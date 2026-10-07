import logging
import os
from concurrent.futures import ThreadPoolExecutor
from contextlib import asynccontextmanager
from threading import Lock
from typing import Literal

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, ConfigDict
from pathlib import Path

from backend.store import Store
from federation.data import HOSPITALS
from federation.experiment import ExperimentConfig, execute, initialize, new_run

WITHDRAWAL = ("Withdrawal prevents use in future training rounds. Previously trained model versions may still retain statistical influence. "
              "Retrospective removal would require retraining, rollback, or machine-unlearning techniques.")


class ConsentChange(BaseModel):
    model_config = ConfigDict(extra="forbid")
    status: Literal["active", "withdrawn"]


def create_app(store=None, data=None):
    load_dotenv()
    store = store or Store(os.getenv("FEDCONSENT_DATABASE_URL", "sqlite:///./data/fedconsent.db"))
    busy = Lock()
    pool = ThreadPoolExecutor(max_workers=1)

    @asynccontextmanager
    async def lifespan(app):
        # A stopped process cannot continue its old in-memory training job.
        for run in store.runs():
            if run["status"] in ("queued", "running"):
                run["status"] = "failed"
                run["error"] = "Previous process stopped before this experiment completed."
                store.save_run(run)
        yield
        pool.shutdown(wait=True)

    app = FastAPI(title="FedConsent Health — local simulation", lifespan=lifespan)
    app.add_middleware(CORSMiddleware,
                       allow_origins=os.getenv("FEDCONSENT_CORS_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173").split(","),
                       allow_methods=["GET", "POST"], allow_headers=["Content-Type"])
    app.state.store = store
    app.state.datasets = data

    @app.get("/api/health")
    def health():
        return {"status": "ok", "mode": "local public-data simulation", "busy": busy.locked(),
                "initialized": bool(store.records())}

    @app.post("/api/initialize")
    def initialize_demo():
        if not busy.acquire(blocking=False):
            raise HTTPException(409, "An experiment or initialization is already running")
        try:
            datasets, _, _ = initialize(store, os.getenv("FEDCONSENT_DATA_DIR", "data"))
            app.state.datasets = datasets
            return {"records": len(store.records())}
        except Exception:
            logging.exception("Demo initialization failed")
            raise HTTPException(503, "Dataset initialization failed; check the local log") from None
        finally:
            busy.release()

    @app.get("/api/hospitals")
    def hospitals():
        result = []
        for h in HOSPITALS:
            records = store.records(h)
            labels = app.state.datasets["train"].tensors[1] if app.state.datasets else None
            distribution = None if labels is None else {"normal": sum(int(labels[r["record_index"]]) == 0 for r in records),
                                                       "pneumonia": sum(int(labels[r["record_index"]]) == 1 for r in records)}
            result.append({"id": h, "records": len(records), "eligible": len(store.eligible(h)),
                           "status": "ready (simulated)" if labels is not None else "not initialized in this process",
                           "distribution": distribution})
        return result

    @app.get("/api/patients")
    def patients(hospital: Literal["A", "B", "C"] = "A"):
        return store.records(hospital)

    @app.get("/api/patients/{patient_id}/receipt")
    def receipt(patient_id: str):
        record = next((r for r in store.records() if r["patient_id"] == patient_id), None)
        if record is None:
            raise HTTPException(404, "Unknown simulated record")
        rounds = []
        for run in store.runs():
            for entry in run["rounds"]:
                hospital = entry["hospitals"].get(record["hospital"], {})
                if patient_id in hospital.get("eligible_ids", []):
                    rounds.append({"run_id": run["id"], "round": entry["round"], "snapshot_at": entry["snapshot_at"],
                                   "status": run["status"], "privacy": hospital.get("privacy"),
                                   "participation": hospital.get("participation")})
        return {"record": record, "eligible_now": any(r["patient_id"] == patient_id for r in store.eligible(record["hospital"])),
                "history": store.audit(patient_id), "rounds": rounds, "withdrawal_explanation": WITHDRAWAL,
                "raw_data": "No raw images are sent in Flower messages. Boundaries are logical within one local process, not independently attested.",
                "identity": "Synthetic record identity; not a verified real patient.",
                "initial_consent": "Demo records start with simulated active consent; no real consent was obtained."}

    @app.post("/api/patients/{patient_id}/consent")
    def consent(patient_id: str, change: ConsentChange):
        try:
            changed = store.consent(patient_id, change.status)
        except KeyError:
            raise HTTPException(404, "Unknown simulated record") from None
        return {"changed": changed, "status": change.status, "explanation": WITHDRAWAL}

    @app.get("/api/audit")
    def audit():
        return store.audit()

    @app.get("/api/experiments")
    def experiments():
        return store.runs()

    @app.post("/api/experiments", status_code=202)
    def start(config: ExperimentConfig):
        if app.state.datasets is None:
            raise HTTPException(409, "Initialize the dataset in this process first")
        if sum(bool(store.eligible(h)) for h in HOSPITALS) < 2:
            raise HTTPException(409, "At least two hospitals need eligible records")
        if not busy.acquire(blocking=False):
            raise HTTPException(409, "An experiment is already running")
        run = new_run(config)
        try:
            store.save_run(run)

            def work():
                try:
                    execute(store, app.state.datasets, config, run, artifacts=os.getenv("FEDCONSENT_ARTIFACT_DIR", "artifacts"))
                except Exception:
                    logging.exception("Experiment failed")
                finally:
                    busy.release()

            pool.submit(work)
        except Exception:
            busy.release()
            raise
        return {"id": run["id"], "status": "queued"}

    build = Path(__file__).resolve().parents[1] / "frontend" / "dist"
    if build.exists():
        app.mount("/assets", StaticFiles(directory=build / "assets"), name="assets")

        @app.get("/")
        def index():
            return FileResponse(build / "index.html")

    return app


app = create_app()
