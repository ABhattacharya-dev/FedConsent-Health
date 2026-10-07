import argparse
import hashlib
import importlib.metadata
import json
import os
import time
import uuid
from pathlib import Path

os.environ.setdefault("FLWR_TELEMETRY_ENABLED", "0")

import torch
from flwr.app import ArrayRecord, Message, Metadata, MetricRecord, RecordDict
from flwr.serverapp.strategy import FedAvg
from opacus import PrivacyEngine
from medmnist import INFO
from pydantic import BaseModel, ConfigDict, Field
from torch.utils.data import DataLoader, Subset

from backend.store import Store, now
from federation.data import HOSPITALS, load_data, partition
from federation.model import evaluate, model, train, validation_threshold
from federation.attack import measure_attack


class ExperimentConfig(BaseModel):
    model_config = ConfigDict(extra="forbid", allow_inf_nan=False)
    rounds: int = Field(default=3, ge=1, le=10)
    epochs: int = Field(default=2, ge=1, le=5)
    batch_size: int = Field(default=64, ge=8, le=128)
    learning_rate: float = Field(default=.1, gt=0, le=1)
    noise: float = Field(default=0, ge=0, le=10)
    delta: float = Field(default=1e-5, gt=0, lt=1e-3)
    clipping: float = Field(default=1, gt=0, le=10)
    seed: int = Field(default=42, ge=0, le=2147483647)


def initialize(store, root="data", limit=256):
    data = load_data(root)
    parts = partition(data["train"].tensors[1], seed=42)
    if limit:
        parts = {h: indices[:limit] for h, indices in parts.items()}
    fingerprint = hashlib.sha256(json.dumps(parts, sort_keys=True).encode()).hexdigest()
    store.seed(parts, fingerprint)
    return data, parts, fingerprint


def new_run(config):
    return {"id": uuid.uuid4().hex, "status": "queued", "started_at": now(),
            "config": config.model_dump(), "rounds": [], "baselines": {},
            "privacy_scope": "This run only; record-level training mechanism conditional on fixed/public cohort metadata. Comparisons include non-DP releases, so no joint DP guarantee is claimed.",
            "simulation": "Sequential local hospitals; Flower Message API and FedAvg aggregation. No network/process isolation.",
            "secure_rng": False, "model": "conv4-conv8-linear-v1", "optimizer": "SGD",
            "attack": {"status": "pending"}, "error": None}


def execute(store, data, config, run=None, round_hook=None, artifacts="artifacts"):
    """Sequential simulation. Only ArrayRecords and counts reach FedAvg."""
    torch.set_num_threads(2)
    run = run or new_run(config)
    run["status"] = "running"
    run["versions"] = {p: importlib.metadata.version(p) for p in ("torch", "flwr", "opacus", "medmnist", "scikit-learn")}
    run["split_sizes"] = {name: len(dataset) for name, dataset in data.items()}
    run["dataset"] = {"name": "PneumoniaMNIST", "source": INFO["pneumoniamnist"]["url"],
                      "license": INFO["pneumoniamnist"]["license"], "archive_md5": INFO["pneumoniamnist"]["MD5"]}
    run["training_split"] = "official train only; capped hospital cohorts are explicitly listed"
    run["evaluation"] = "Threshold maximizes Youden J on official validation split; metrics use official test split. Same procedure for every model."
    store.save_run(run)
    try:
        torch.manual_seed(config.seed)
        global_model = model()
        initial = {k: v.detach().clone() for k, v in global_model.state_dict().items()}
        # Each hospital's accountant lives for the entire run, across model resets,
        # round boundaries and consent changes. DP RNG is not reset per round.
        engines = {h: PrivacyEngine(accountant="rdp", secure_mode=False) for h in HOSPITALS} if config.noise else {}
        if config.noise:
            torch.seed()
        else:
            # Local baselines use the same initial weights and training epochs as FL.
            for hospital in HOSPITALS:
                records = store.eligible(hospital)
                if not records:
                    run["baselines"][hospital] = {"status": "no eligible records"}
                    continue
                net = model()
                net.load_state_dict(initial)
                torch.manual_seed(config.seed)
                subset = Subset(data["train"], [r["record_index"] for r in records])
                steps = train(net, DataLoader(subset, batch_size=config.batch_size, shuffle=True),
                              torch.optim.SGD(net.parameters(), lr=config.learning_rate), config.epochs * config.rounds)
                run["baselines"][hospital] = {"metrics": evaluate(net, data["test"], validation_threshold(net, data["val"])), "steps": steps,
                                              "eligible_ids": [r["patient_id"] for r in records]}
                store.save_run(run)
        strategy = FedAvg(min_train_nodes=2, min_available_nodes=2, fraction_evaluate=0)
        for round_number in range(1, config.rounds + 1):
            if round_hook:
                round_hook(round_number)
            # Freeze every hospital's eligible cohort before any client trains.
            snapshot_at, snapshots = store.snapshot()
            active = [h for h in HOSPITALS if snapshots[h]]
            if len(active) < 2:
                raise ValueError("Insufficient hospitals with eligible records (minimum two)")
            entry = {"round": round_number, "snapshot_at": snapshot_at, "hospitals": {}, "metrics": None}
            replies = []
            for node, hospital in enumerate(HOSPITALS, 1):
                records = snapshots[hospital]
                if not records:
                    entry["hospitals"][hospital] = {"eligible_ids": [], "count": 0, "status": "skipped: no eligible records"}
                    continue
                net = model()
                net.load_state_dict(global_model.state_dict())
                subset = Subset(data["train"], [r["record_index"] for r in records])
                loader = DataLoader(subset, batch_size=config.batch_size, shuffle=True)
                optimizer = torch.optim.SGD(net.parameters(), lr=config.learning_rate)
                if config.noise:
                    net, optimizer, loader = engines[hospital].make_private(
                        module=net, optimizer=optimizer, data_loader=loader,
                        noise_multiplier=config.noise, max_grad_norm=config.clipping)
                steps = train(net, loader, optimizer, config.epochs)
                bare = net._module if config.noise else net
                privacy = None
                if config.noise:
                    privacy = {"epsilon": engines[hospital].get_epsilon(config.delta), "delta": config.delta,
                               "sample_rate": loader.sample_rate, "noise_multiplier": config.noise,
                               "clipping": config.clipping, "history": list(engines[hospital].accountant.history)}
                entry["hospitals"][hospital] = {"count": len(records), "status": "trained", "steps": steps,
                                                "eligible_ids": [r["patient_id"] for r in records], "privacy": privacy,
                                                "participation": "Eligibility recorded; individual Poisson draws are not logged." if config.noise else "All eligible records used."}
                # The runtime normally stamps Metadata. Our pinned, in-process
                # simulation supplies it explicitly without modifying global TaskIdentity.
                metadata = Metadata(run_id=int(run["id"][:12], 16), message_id=f"{round_number}-{node}",
                                    src_node_id=node, dst_node_id=0, reply_to_message_id=f"round-{round_number}",
                                    group_id=str(round_number), created_at=time.time(), ttl=3600, message_type="train")
                replies.append(Message(content=RecordDict({"arrays": ArrayRecord(bare.state_dict()),
                                                         "metrics": MetricRecord({"num-examples": len(records)})}), metadata=metadata))
            arrays, _ = strategy.aggregate_train(round_number, replies)
            if arrays is None:
                raise ValueError("Flower did not return aggregated model parameters")
            global_model.load_state_dict(arrays.to_torch_state_dict())
            entry["metrics"] = evaluate(global_model, data["test"], validation_threshold(global_model, data["val"]))
            entry["epsilon_max"] = max((v["privacy"]["epsilon"] for v in entry["hospitals"].values() if v.get("privacy")), default=None)
            run["rounds"].append(entry)
            store.save_run(run)
        members = {int(pid.rsplit("-", 1)[1]) for entry in run["rounds"]
                   for hospital in entry["hospitals"].values() for pid in hospital["eligible_ids"]}
        try:
            run["attack"] = measure_attack(global_model, data["train"], members, config.seed)
        except Exception:
            import logging
            logging.exception("Attack measurement failed")
            run["attack"] = {"status": "unavailable", "reason": "Attack evaluation failed; training results remain valid. Check local logs."}
        destination = Path(artifacts) / run["id"]
        destination.mkdir(parents=True, exist_ok=True)
        torch.save(global_model.state_dict(), destination / "model.pt")
        run["status"] = "succeeded"
        run["finished_at"] = now()
        store.save_run(run)
        (destination / "result.json").write_text(json.dumps(run, indent=2, allow_nan=False), encoding="utf-8")
        return run
    except Exception:
        run["status"] = "failed"
        run["error"] = "Training failed; inspect the local process log. No final result was produced."
        store.save_run(run)
        raise


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--noise", type=float, default=0)
    parser.add_argument("--rounds", type=int, default=3)
    parser.add_argument("--epochs", type=int, default=2)
    args = parser.parse_args()
    from dotenv import load_dotenv
    load_dotenv()
    store = Store(os.getenv("FEDCONSENT_DATABASE_URL", "sqlite:///./data/fedconsent.db"))
    data, _, _ = initialize(store, os.getenv("FEDCONSENT_DATA_DIR", "data"))
    run = execute(store, data, ExperimentConfig(**vars(args)), artifacts=os.getenv("FEDCONSENT_ARTIFACT_DIR", "artifacts"))
    print(json.dumps({"id": run["id"], "status": run["status"], "final": run["rounds"][-1]["metrics"], "epsilon_max": run["rounds"][-1]["epsilon_max"]}))


if __name__ == "__main__":
    main()
