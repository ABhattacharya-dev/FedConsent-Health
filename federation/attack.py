"""Label-matched loss-threshold membership baseline; no test-split access."""
import numpy as np
from sklearn.metrics import balanced_accuracy_score, roc_auc_score, roc_curve
from torch.utils.data import Subset

from federation.model import predict


def attack_split(labels, members, seed):
    labels = np.asarray(labels)
    members = np.asarray(sorted(set(members)), dtype=int)
    outsiders = np.setdiff1d(np.arange(len(labels)), members)
    rng = np.random.default_rng(seed)
    groups = {"calibration_members": [], "calibration_nonmembers": [],
              "evaluation_members": [], "evaluation_nonmembers": []}
    for label in (0, 1):
        inside = rng.permutation(members[labels[members] == label])
        outside = rng.permutation(outsiders[labels[outsiders] == label])
        n = min(len(inside), len(outside), 256)
        if n < 4:
            return None
        for name, pool in (("members", inside), ("nonmembers", outside)):
            groups[f"calibration_{name}"].extend(pool[:n // 2].tolist())
            groups[f"evaluation_{name}"].extend(pool[n // 2:n].tolist())
    return groups


def measure_attack(net, training, members, seed=42):
    groups = attack_split(training.tensors[1], members, seed)
    if groups is None:
        return {"status": "unavailable", "reason": "Too few label-matched members/nonmembers for disjoint calibration and evaluation."}
    scores = {}
    for name, indices in groups.items():
        probability, truth = predict(net, Subset(training, indices))
        # Log probability of the true label = negative cross-entropy loss.
        scores[name] = np.log(np.clip(np.where(np.asarray(truth) == 1, probability, 1 - probability), 1e-12, 1))
    calibration = np.concatenate([scores["calibration_members"], scores["calibration_nonmembers"]])
    calibration_y = np.concatenate([np.ones(len(scores["calibration_members"])), np.zeros(len(scores["calibration_nonmembers"]))])
    fpr, tpr, thresholds = roc_curve(calibration_y, calibration)
    finite = np.isfinite(thresholds)
    threshold = float(thresholds[finite][np.argmax((tpr - fpr)[finite])])
    evaluation = np.concatenate([scores["evaluation_members"], scores["evaluation_nonmembers"]])
    evaluation_y = np.concatenate([np.ones(len(scores["evaluation_members"])), np.zeros(len(scores["evaluation_nonmembers"]))])
    return {"status": "measured", "method": "Label-matched negative-loss threshold baseline v1",
            "source": "https://arxiv.org/abs/1709.01604", "seed": seed,
            "auroc": float(roc_auc_score(evaluation_y, evaluation)),
            "balanced_accuracy": float(balanced_accuracy_score(evaluation_y, evaluation >= threshold)),
            "tpr": float(np.mean(scores["evaluation_members"] >= threshold)),
            "fpr": float(np.mean(scores["evaluation_nonmembers"] >= threshold)),
            "threshold": threshold, "counts": {k: len(v) for k, v in groups.items()},
            "indices": groups,
            "scope": "Membership means ever eligible in this run, not proof of a Poisson draw. Nonmembers are unused official training records, label-matched; calibration and evaluation records are disjoint. Test/validation splits are not used.",
            "limitation": "One small attack baseline, no confidence interval or exhaustive adversary. Chance-level performance does not prove privacy. Attack statistics themselves are not a DP-protected release."}
