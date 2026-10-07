from fastapi.testclient import TestClient

from backend.app import create_app
from backend.store import Store


def test_consent_api_and_invalid_requests(tmp_path):
    store = Store(f"sqlite:///{tmp_path / 'api.db'}")
    store.seed({"A": [0], "B": [1], "C": [2]}, "api")
    with TestClient(create_app(store)) as client:
        assert client.get("/api/health").status_code == 200
        assert client.get("/api/health", headers={"host": "untrusted.example"}).status_code == 400
        assert client.post('/api/initialize', headers={'origin':'https://untrusted.example'}).status_code == 403
        assert client.get("/api/hospitals").json()[0]["eligible"] == 1
        assert client.post("/api/patients/P-A-00000/consent", json={"status": "bogus"}).status_code == 422
        assert client.post("/api/patients/P-A-00000/consent", json={"status": "active", "hospital": "B"}).status_code == 422
        assert client.post("/api/patients/unknown/consent", json={"status": "withdrawn"}).status_code == 404
        assert client.post("/api/patients/P-A-00000/consent", json={"status": "withdrawn"}).json()["changed"]
        assert not client.get("/api/patients/P-A-00000/receipt").json()["eligible_now"]
        assert len(client.get("/api/audit").json()) == 1
        assert client.post("/api/experiments", json={"noise": -1}).status_code == 422
        assert client.post("/api/experiments", json={"rounds": 100}).status_code == 422
        assert client.post("/api/experiments", json={}).status_code == 409
        assert client.get("/api/experiments").json() == []
        exported = client.get('/api/patients/P-A-00000/receipt?download=true')
        assert exported.headers['content-disposition'].startswith('attachment;')
        assert exported.json()['record']['status'] == 'withdrawn'
        assert client.get('/api/experiments/missing/download').status_code == 404


def test_restart_recovers_dataset_and_interrupted_jobs(tmp_path, monkeypatch):
    store = Store(f"sqlite:///{tmp_path / 'restart.db'}")
    store.seed({"A": [0], "B": [1], "C": [2]}, "restart")
    store.consent('P-A-00000', 'withdrawn')
    store.save_run({'id': 'interrupted', 'status': 'running', 'rounds': []})
    (tmp_path / 'pneumoniamnist.npz').touch()
    monkeypatch.setenv('FEDCONSENT_DATA_DIR', str(tmp_path))
    monkeypatch.setattr('backend.app.initialize', lambda *args: ({'cached': True}, {}, 'restart'))
    with TestClient(create_app(store)) as client:
        assert client.get('/api/health').json()['initialized']
        assert client.get('/api/experiments').json()[0]['status'] == 'failed'
        assert not client.get('/api/patients/P-A-00000/receipt').json()['eligible_now']


def test_receipt_explicitly_records_exclusion(tmp_path):
    store = Store(f"sqlite:///{tmp_path / 'receipt.db'}")
    store.seed({'A': [0], 'B': [1], 'C': [2]}, 'receipt')
    store.save_run({'id':'example', 'status':'succeeded', 'rounds':[
        {'round':1, 'snapshot_at':'2026-10-07', 'hospitals':{'A':{'eligible_ids':[]}}}]})
    with TestClient(create_app(store, data={})) as client:
        receipt = client.get('/api/patients/P-A-00000/receipt').json()
        assert receipt['rounds'][0]['eligible'] is False
        exported = client.get('/api/experiments/example/download')
        assert exported.headers['content-disposition'].startswith('attachment;')
        assert exported.json()['id'] == 'example'
