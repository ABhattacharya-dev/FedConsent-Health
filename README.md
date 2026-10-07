# FedConsent Health

A local educational prototype for hospital research teams: consent-aware federated pneumonia research with measured privacy and audit evidence. P0 is operational and ready for user review; visual styling is deferred.

## Run locally

Prerequisites: uv and Node/npm. Run from the repository root:

```powershell
uv sync --locked
npm --prefix frontend ci
npm --prefix frontend run build
uv run uvicorn backend.app:app --host 127.0.0.1 --port 8000
```

Open http://127.0.0.1:8000 and select **Load / initialize public dataset**. First initialization downloads PneumoniaMNIST; subsequent initialization preserves consent changes. Python 3.11 is pinned. Optional configuration is documented in `.env.example`; defaults work without an `.env` file.

Use one server process without reload/workers. Do not run CLI training against the same database while the server is training. The in-process job lock is for a single local demo, not distributed scheduling.

## Verify

```powershell
uv run --locked pytest -q
npm --prefix frontend run build
```

For a standalone experiment, with server training stopped:

```powershell
uv run python -m federation.experiment --noise 0 --rounds 3 --epochs 2
uv run python -m federation.experiment --noise 1.2 --rounds 3 --epochs 2
```

Experiment results and consent history persist in SQLite. Model weights and result JSON are saved under `artifacts/<run-id>/`. Runtime artifacts and datasets are intentionally excluded from Git.

## What works

- Three disjoint, non-IID hospital cohorts, capped at 256 records each; local baselines and Flower FedAvg.
- Scoped consent, audited withdrawal/regrant, per-round eligibility and simulated patient receipts.
- Opacus DP-SGD with cumulative accounting across rounds within each run; measured epsilon/utility comparison.
- FastAPI and React researcher/patient views, persistent results, loading/error states and an accessible results table.

See [the manual test guide and measured results](docs/DEMO.md), [architecture](docs/ARCHITECTURE.md), [privacy limits](docs/PRIVACY.md), [reuse decisions](docs/REUSE.md), [tooling](docs/TOOLING.md), and [current plan](.agent/CURRENT_PLAN.md).

## Limits

Public/simulated data only; no clinical validation, diagnostic suitability or compliance claims. Hospital boundaries are logical within one trusted process. Role switching is not authentication: keep the server on localhost. Withdrawal affects future round snapshots and does not remove past influence. DP values describe each training run, conditional on public cohort/evaluation data; repeated experiments and non-DP comparisons have no joint DP guarantee. Secure RNG is disabled. Membership-inference evaluation, deployment and styling remain deferred.

Tested features remain on their feature branch until user acceptance; no automatic merge or push.
