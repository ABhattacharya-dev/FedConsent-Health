import json
from datetime import datetime, timezone
from pathlib import Path

from sqlalchemy import create_engine, text

PROJECT = "pneumonia-research"
PURPOSE = "pneumonia-classification"
POLICY = "1"


def now():
    return datetime.now(timezone.utc).isoformat()


class Store:
    def __init__(self, url="sqlite:///./data/fedconsent.db"):
        if url.startswith("sqlite:///:"):
            raise ValueError("Use a file-backed SQLite database")
        if not url.startswith("sqlite:///"):
            raise ValueError("This local demo supports SQLite only")
        Path(url.removeprefix("sqlite:///")).parent.mkdir(parents=True, exist_ok=True)
        self.engine = create_engine(url, connect_args={"check_same_thread": False, "timeout": 30})
        with self.engine.begin() as db:
            for statement in (
                "CREATE TABLE IF NOT EXISTS records (patient_id TEXT PRIMARY KEY, hospital TEXT NOT NULL, record_index INTEGER NOT NULL UNIQUE, project TEXT NOT NULL, purpose TEXT NOT NULL, policy TEXT NOT NULL, status TEXT NOT NULL, granted_at TEXT, withdrawn_at TEXT)",
                "CREATE TABLE IF NOT EXISTS audit (id INTEGER PRIMARY KEY, patient_id TEXT NOT NULL, action TEXT NOT NULL, at TEXT NOT NULL)",
                "CREATE TABLE IF NOT EXISTS runs (id TEXT PRIMARY KEY, status TEXT NOT NULL, payload TEXT NOT NULL)",
                "CREATE TABLE IF NOT EXISTS metadata (key TEXT PRIMARY KEY, value TEXT NOT NULL)",
            ):
                db.execute(text(statement))

    def seed(self, parts, fingerprint):
        from federation.data import patient_id
        # Transaction prevents reseeding from silently restoring withdrawn consent.
        with self.engine.begin() as db:
            current = db.execute(text("SELECT value FROM metadata WHERE key='dataset'")).scalar()
            if current is not None:
                if current != fingerprint:
                    raise ValueError("Dataset/partition differs from the existing consent registry; use a separate database")
                return
            for hospital, indices in parts.items():
                for index in indices:
                    values = dict(patient_id=patient_id(hospital, index), hospital=hospital,
                                  record_index=index, project=PROJECT, purpose=PURPOSE,
                                  policy=POLICY, status="active", granted_at=now())
                    db.execute(text("INSERT INTO records VALUES (:patient_id,:hospital,:record_index,:project,:purpose,:policy,:status,:granted_at,NULL)"), values)
            db.execute(text("INSERT INTO metadata VALUES ('dataset',:value)"), {"value": fingerprint})

    def records(self, hospital=None):
        with self.engine.connect() as db:
            query = "SELECT * FROM records"
            if hospital:
                query += " WHERE hospital=:hospital"
            return [dict(row) for row in db.execute(text(query + " ORDER BY patient_id"), {"hospital": hospital}).mappings()]

    def eligible(self, hospital):
        return [r for r in self.records(hospital) if r["status"] == "active"
                and r["project"] == PROJECT and r["purpose"] == PURPOSE and r["policy"] == POLICY
                and r["granted_at"] is not None and r["withdrawn_at"] is None]

    def consent(self, patient_id, status):
        if status not in ("active", "withdrawn"):
            raise ValueError("Invalid consent status")
        with self.engine.begin() as db:
            # Serialize transitions so repeated concurrent requests are idempotent.
            db.exec_driver_sql("BEGIN IMMEDIATE")
            record = db.execute(text("SELECT * FROM records WHERE patient_id=:id"), {"id": patient_id}).mappings().first()
            if record is None:
                raise KeyError(patient_id)
            if record["status"] == status:
                return False
            at = now()
            db.execute(text("UPDATE records SET status=:status, granted_at=:granted, withdrawn_at=:withdrawn WHERE patient_id=:id"),
                       {"id": patient_id, "status": status,
                        "granted": at if status == "active" else record["granted_at"],
                        "withdrawn": at if status == "withdrawn" else None})
            db.execute(text("INSERT INTO audit(patient_id,action,at) VALUES (:id,:status,:at)"),
                       {"id": patient_id, "status": status, "at": at})
        return True

    def audit(self, patient_id=None):
        with self.engine.connect() as db:
            query = "SELECT * FROM audit" + (" WHERE patient_id=:id" if patient_id else "")
            return [dict(r) for r in db.execute(text(query + " ORDER BY id DESC LIMIT 200"), {"id": patient_id}).mappings()]

    def save_run(self, run):
        payload = json.dumps(run, allow_nan=False)
        with self.engine.begin() as db:
            db.execute(text("INSERT INTO runs VALUES (:id,:status,:payload) ON CONFLICT(id) DO UPDATE SET status=:status,payload=:payload"),
                       {"id": run["id"], "status": run["status"], "payload": payload})

    def runs(self):
        with self.engine.connect() as db:
            return [json.loads(r) for r in db.execute(text("SELECT payload FROM runs ORDER BY rowid DESC")).scalars()]
