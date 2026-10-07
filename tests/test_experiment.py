import json

import pytest
import torch
from torch.utils.data import TensorDataset

from backend.store import Store
from federation.experiment import ExperimentConfig, execute


def setup(tmp_path):
    store = Store(f"sqlite:///{tmp_path / 'experiment.db'}")
    store.seed({"A": list(range(16)), "B": list(range(16, 32)), "C": list(range(32, 48))}, "synthetic")
    data = {"train": TensorDataset(torch.rand(48, 1, 28, 28), torch.arange(48) % 2),
            "val": TensorDataset(torch.rand(8, 1, 28, 28), torch.arange(8) % 2),
            "test": TensorDataset(torch.rand(8, 1, 28, 28), torch.arange(8) % 2)}
    return store, data


def test_withdrawal_changes_next_round_training_and_dp_accumulates(tmp_path):
    store, data = setup(tmp_path)

    def hook(round_number):
        if round_number == 2:
            store.consent("P-A-00000", "withdrawn")

    run = execute(store, data, ExperimentConfig(rounds=2, epochs=1, noise=1.2, batch_size=8),
                  round_hook=hook, artifacts=tmp_path / "artifacts")
    first, second = [r["hospitals"]["A"] for r in run["rounds"]]
    assert "P-A-00000" in first["eligible_ids"]
    assert "P-A-00000" not in second["eligible_ids"]
    assert first["count"] == 16 and second["count"] == 15
    assert second["privacy"]["epsilon"] > first["privacy"]["epsilon"] > 0
    assert sum(h[2] for h in second["privacy"]["history"]) == first["steps"] + second["steps"]
    assert sum(h[2] for h in first["privacy"]["history"]) == first["steps"]
    assert store.runs()[0]["status"] == "succeeded"
    persisted = json.loads((tmp_path / "artifacts" / run["id"] / "result.json").read_text())
    assert persisted["config"]["delta"] == 1e-5
    assert persisted["rounds"][-1]["metrics"]["test_count"] == 8


def test_no_test_data_enters_training_and_zero_hospital_skips(tmp_path):
    store, data = setup(tmp_path)
    for row in store.records("C"):
        store.consent(row["patient_id"], "withdrawn")

    class EvaluationOnly:
        def __len__(self):
            return 8

        def __getitem__(self, index):
            assert not torch.is_grad_enabled(), "Evaluation data was accessed during training"
            return data["val"][index]

    data["test"] = EvaluationOnly()
    run = execute(store, data, ExperimentConfig(rounds=1, epochs=1), artifacts=tmp_path / "artifacts")
    assert run["rounds"][0]["hospitals"]["C"]["count"] == 0
    for row in store.records("B"):
        store.consent(row["patient_id"], "withdrawn")
    with pytest.raises(ValueError, match="Insufficient"):
        execute(store, data, ExperimentConfig(rounds=1, epochs=1), artifacts=tmp_path / "artifacts")
    assert store.runs()[0]["status"] == "failed"


def test_empty_poisson_batch_still_accounts_for_noise_step():
    from opacus import PrivacyEngine
    from torch.utils.data import DataLoader
    from federation.model import model, train

    net = model()
    optimizer = torch.optim.SGD(net.parameters(), lr=.1)
    engine = PrivacyEngine(accountant="rdp")
    net, optimizer, _ = engine.make_private(
        module=net, optimizer=optimizer,
        data_loader=DataLoader(TensorDataset(torch.rand(2, 1, 28, 28), torch.tensor([0, 1])), batch_size=1),
        noise_multiplier=1.2, max_grad_norm=1)
    train(net, [(torch.empty(0, 1, 28, 28), torch.empty(0, dtype=torch.long))], optimizer, 1)
    assert sum(h[2] for h in engine.accountant.history) == 1
    assert all(torch.isfinite(p).all() for p in net.parameters())
