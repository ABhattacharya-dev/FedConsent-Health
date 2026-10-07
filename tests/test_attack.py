import numpy as np
import torch
from torch.utils.data import TensorDataset

from federation.attack import attack_split, measure_attack


def test_attack_is_disjoint_label_matched_and_measures_constant_model():
    labels = np.arange(80) % 2
    groups = attack_split(labels, range(40), 42)
    pools = [set(v) for v in groups.values()]
    assert sum(map(len, pools)) == len(set.union(*pools))
    for name, indices in groups.items():
        assert set(indices).issubset(set(range(40)) if name.endswith('_members') else set(range(40, 80)))
        assert sum(labels[indices]) * 2 == len(indices)
    net = torch.nn.Sequential(torch.nn.Flatten(), torch.nn.Linear(4, 2))
    for p in net.parameters():
        p.data.zero_()
    result = measure_attack(net, TensorDataset(torch.zeros(80, 1, 2, 2), torch.tensor(labels)), range(40))
    assert result['auroc'] == .5 and result['balanced_accuracy'] == .5
    assert attack_split(labels, range(80), 42) is None
