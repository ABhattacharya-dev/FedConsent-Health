import argparse
import json
from pathlib import Path

import torch
from torch.utils.data import DataLoader, Subset

from federation.data import load_data, partition
from federation.model import evaluate, model, train, validation_threshold


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--data", default="data")
    parser.add_argument("--epochs", type=int, default=2)
    args = parser.parse_args()
    torch.set_num_threads(2)
    torch.manual_seed(42)
    datasets = load_data(args.data)
    parts = partition(datasets["train"].tensors[1])
    results = {}
    for hospital, indices in parts.items():
        torch.manual_seed(42)
        net = model()
        train(net, DataLoader(Subset(datasets["train"], indices), batch_size=64, shuffle=True),
              torch.optim.SGD(net.parameters(), lr=.1), args.epochs)
        results[hospital] = evaluate(net, datasets["test"], validation_threshold(net, datasets["val"]))
    output = {"seed": 42, "epochs": args.epochs, "learning_rate": .1,
              "partition_counts": {h: len(v) for h, v in parts.items()}, "metrics": results}
    Path("artifacts").mkdir(exist_ok=True)
    Path("artifacts/baselines.json").write_text(json.dumps(output, indent=2))
    print(json.dumps(output, indent=2))


if __name__ == "__main__":
    main()
