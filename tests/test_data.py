import numpy as np
import torch

from federation.data import partition
from federation.model import evaluate, model
from torch.utils.data import TensorDataset


def test_partitions_are_disjoint_complete_and_biased():
    labels = np.array([0] * 100 + [1] * 100)
    parts = partition(labels)
    assert parts == partition(labels)
    flattened = sum(parts.values(), [])
    assert len(flattened) == len(set(flattened)) == len(labels)
    assert set(flattened) == set(range(len(labels)))
    assert labels[parts["A"]].mean() < labels[parts["C"]].mean()


def test_metrics_are_serializable():
    import json
    result = evaluate(model(), TensorDataset(torch.zeros(4, 1, 28, 28), torch.tensor([0, 1, 0, 1])))
    assert json.loads(json.dumps(result)) == result
    assert result["test_count"] == 4
