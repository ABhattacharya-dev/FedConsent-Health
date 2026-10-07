import numpy as np
import torch
from sklearn.metrics import accuracy_score, confusion_matrix, f1_score, roc_auc_score
from torch import nn
from torch.utils.data import DataLoader


def model():
    # No BatchNorm: this network is compatible with per-record gradient clipping.
    return nn.Sequential(nn.Conv2d(1, 4, 3, padding=1), nn.ReLU(), nn.AvgPool2d(2),
                         nn.Conv2d(4, 8, 3, padding=1), nn.ReLU(), nn.AvgPool2d(2),
                         nn.Flatten(), nn.Linear(8 * 7 * 7, 2))


def parameters(net):
    return [value.detach().cpu().numpy().copy() for value in net.state_dict().values()]


def set_parameters(net, values):
    net.load_state_dict({key: torch.tensor(value) for key, value in
                         zip(net.state_dict(), values, strict=True)})


def train(net, loader, optimizer, epochs):
    net.train()
    steps = 0
    for _ in range(epochs):
        for images, labels in loader:
            optimizer.zero_grad()
            # Opacus Poisson sampling can produce an empty batch; its optimizer
            # must still add noise and account for the scheduled step.
            logits = net(images)
            loss = nn.functional.cross_entropy(logits, labels, reduction="sum")
            loss = loss / max(1, len(labels))
            loss.backward()
            optimizer.step()
            steps += 1
    return steps


def evaluate(net, dataset):
    net.eval()
    probabilities, truth = [], []
    with torch.no_grad():
        for images, labels in DataLoader(dataset, batch_size=256):
            probabilities.extend(net(images).softmax(1)[:, 1].tolist())
            truth.extend(labels.tolist())
    predicted = np.asarray(probabilities) >= .5
    tn, fp, fn, tp = confusion_matrix(truth, predicted, labels=[0, 1]).ravel()
    return {"accuracy": float(accuracy_score(truth, predicted)),
            "auroc": float(roc_auc_score(truth, probabilities)) if len(set(truth)) == 2 else None,
            "f1": float(f1_score(truth, predicted, zero_division=0)),
            "sensitivity": float(tp / (tp + fn)) if tp + fn else None,
            "specificity": float(tn / (tn + fp)) if tn + fp else None,
            "test_count": len(truth)}
