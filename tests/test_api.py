from fastapi.testclient import TestClient

from backend.app import create_app
from backend.store import Store


def test_consent_api_and_invalid_requests(tmp_path):
    store = Store(f"sqlite:///{tmp_path / 'api.db'}")
    store.seed({"A": [0], "B": [1], "C": [2]}, "api")
    with TestClient(create_app(store)) as client:
        assert client.get("/api/health").status_code == 200
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
