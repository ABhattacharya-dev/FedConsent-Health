import pytest
from sqlalchemy import text

from backend.store import Store


@pytest.fixture
def store(tmp_path):
    result = Store(f"sqlite:///{tmp_path / 'test.db'}")
    result.seed({"A": [0, 1], "B": [2], "C": [3]}, "test")
    return result


def test_withdrawal_and_regrant_are_real_and_idempotent(store):
    assert len(store.eligible("A")) == 2
    assert store.consent("P-A-00000", "withdrawn")
    assert not store.consent("P-A-00000", "withdrawn")
    assert [r["record_index"] for r in store.eligible("A")] == [1]
    store.seed({"A": [0, 1], "B": [2], "C": [3]}, "test")
    assert len(store.eligible("A")) == 1
    assert store.consent("P-A-00000", "active")
    assert len(store.eligible("A")) == 2
    assert len(store.audit("P-A-00000")) == 2


@pytest.mark.parametrize("field,value", [("status", "unknown"), ("purpose", "other"),
                                        ("project", "other"), ("policy", "2"),
                                        ("granted_at", None), ("withdrawn_at", "2026-01-01")])
def test_invalid_scoped_consent_fails_closed(store, field, value):
    with store.engine.begin() as db:
        db.execute(text(f"UPDATE records SET {field}=:value WHERE patient_id='P-A-00000'"), {"value": value})
    assert [r["record_index"] for r in store.eligible("A")] == [1]
    assert store.eligible("unknown") == []


def test_unknown_patient_and_changed_dataset_rejected(store):
    with pytest.raises(KeyError):
        store.consent("P-Z-00000", "withdrawn")
    with pytest.raises(ValueError):
        store.seed({}, "changed")
    with pytest.raises(ValueError):
        store.consent("P-A-00000", "bad")
