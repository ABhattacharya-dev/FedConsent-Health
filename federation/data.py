from pathlib import Path

import numpy as np
import torch
from medmnist import PneumoniaMNIST
from torch.utils.data import TensorDataset

HOSPITALS = ("A", "B", "C")


def load_data(root: str):
    Path(root).mkdir(parents=True, exist_ok=True)
    # MedMNIST verifies its published archive checksum during download.
    datasets = {}
    for split in ("train", "val", "test"):
        source = PneumoniaMNIST(root=root, split=split, download=True)
        images = torch.from_numpy(source.imgs.copy()).float().unsqueeze(1) / 255
        labels = torch.from_numpy(source.labels.reshape(-1).copy()).long()
        datasets[split] = TensorDataset(images, labels)
    return datasets


def partition(labels, seed=42):
    """Allocate every training record exactly once with deliberately biased labels."""
    rng = np.random.default_rng(seed)
    parts = {h: [] for h in HOSPITALS}
    for label, weights in ((0, (.7, .2, .1)), (1, (.1, .3, .6))):
        indices = np.flatnonzero(np.asarray(labels) == label)
        rng.shuffle(indices)
        chunks = np.split(indices, [int(len(indices) * weights[0]),
                                    int(len(indices) * sum(weights[:2]))])
        for hospital, chunk in zip(HOSPITALS, chunks):
            parts[hospital].extend(int(i) for i in chunk)
    for indices in parts.values():
        rng.shuffle(indices)
    return parts


def patient_id(hospital, index):
    return f"P-{hospital}-{index:05d}"
