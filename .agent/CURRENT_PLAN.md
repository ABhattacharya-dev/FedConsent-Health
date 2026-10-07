# Current execution plan

## Objective / state
Bring P0 operational: local baselines and Flower federation, scoped consent withdrawal affecting training, measured Opacus DP and functional researcher/patient views. Implementation in progress on `feature/ml-baseline`; earlier branches remain unmerged pending user acceptance.

## Decisions
- User authorizes reversible engineering choices and dependent work without routine approval. Strategic doubts still require discussion; acceptance is required for completion/merging.
- Reuse MedMNIST, Flower FedAvg, Opacus, SQLite/SQLAlchemy, FastAPI and React/Vite. See `docs/REUSE.md`.
- Sequential local hospital simulation with Flower's Message API aggregation; not a distributed deployment or the Ray simulation runtime.
- Seeded non-IID partitions; cap demo cohorts to 256 records/hospital. Keep the entire official test split untouched. Baselines get the same local epoch budget as federation.
- DP accounting accumulates across rounds within a run, at record level, conditional on public/fixed cohort metadata. Non-DP comparisons prevent a joint DP claim. Secure RNG is disabled in this research demo.
- Localhost-only role simulation; no real patient access control or deployment claims. No styling pass or Docker work.

## Milestones
1. ML baseline: Python 3.11, dependency lock, real data, partition/metric tests and measured baselines; commit.
2. Consent/federation/DP: scoped consent, round snapshots, Flower aggregation, cumulative accounting and integration tests; branch and commit.
3. Functional API/UI: initialize dataset, run experiments, inspect results, change consent and view receipts; build/API/browser checks; branch and commit.
4. End-to-end P0: real non-DP and multiple DP runs, documented commands and withdrawal demonstration.

## Deferred
P1: membership-inference evaluation and enhanced receipt/audit presentation. P2: secure aggregation, deployment, Docker. Styling needs explicit authorization.

## Evidence
- Inspected repository and verified seven installed skills in prior review.
- Provisioned Python 3.11.15, created environment and resolved dependency lock; package downloads ongoing.
- Baseline, consent store, experiment loop, FastAPI and functional React views written. Python syntax check passes; runtime checks pending installation.

## Risks / next action
- Slow/intermittent downloads; finish dependencies, inspect installed signatures and test before claiming operation.
- Verify Opacus empty Poisson batches, cumulative history and withdrawal between rounds.
- Never claim clinical utility, patient-level identity, authenticated patient access, data-residency attestation or joint privacy protection for non-DP releases.
