import json

import pytest

from backend.store import Store
from demo import backup, prepare


def test_backup_escapes_evidence_and_preparation_preserves_database(tmp_path):
    store = Store(f"sqlite:///{tmp_path / 'demo.db'}")
    manifest = {'note': '<script>not executable</script>'}
    backup(tmp_path, store, manifest)
    page = (tmp_path / 'backup.html').read_text(encoding='utf-8')
    assert '<script>' not in page and '&lt;script&gt;' in page
    assert 'not a live session' in page
    assert json.loads((tmp_path / 'evidence.json').read_text())['manifest'] == manifest
    with pytest.raises(SystemExit, match='already exists'):
        prepare(tmp_path)
