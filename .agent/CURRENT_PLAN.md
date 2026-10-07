# Current execution plan

## Objective / state

P0 is operational and ready for user review on `feature/p0-integration`, based on the user's `c400867` partial implementation commit. No merge or push performed. Styling remains unauthorized.

## Decisions

- Reuse MedMNIST, Flower FedAvg, Opacus, SQLite/SQLAlchemy, FastAPI and React/Vite; see docs/REUSE.md.
- Sequential local hospital simulation using Flower Message API aggregation, without Ray or distributed infrastructure.
- Seeded non-IID cohorts capped at 256 records/hospital. Validation selects thresholds; the entire official test split is evaluation-only. Local baselines have the same total epoch budget as federation.
- Cumulative record-level DP accounting within each run, conditional on public cohort/evaluation metadata. No joint guarantee across experiments or non-DP releases. Secure RNG disabled.
- Localhost role simulation without real authorization. No styling, Docker or deployment work.

## Operational P0 milestones

1. Python 3.11.15 environment, locked dependencies, official data/checksum, disjoint partitions and actual baseline metrics verified.
2. Scoped consent, audited withdrawal/regrant, Flower aggregation, round snapshots and cumulative Opacus accounting verified, including empty Poisson batches and unavailable clients.
3. Functional API/UI, persistent experiment history, researcher comparison and simulated patient receipts verified. Production frontend build passes.
4. Real non-DP and noise 0.8/1.2/2.0 runs succeeded. Browser withdrawal followed by a browser-launched experiment excluded the record. Manual test instructions and measured evidence are in docs/DEMO.md.

## Evidence / resolved problems

- Installed Flower 1.39 requires message metadata outside its runtime; supplied explicit metadata rather than mutating global runtime identity.
- Initial fixed threshold produced poor specificity. Every new model now chooses its threshold on validation only; historical runs are labeled legacy.
- Accountant history copied when persisted to prevent later steps changing earlier round snapshots.
- UI connection errors no longer overwrite action errors; receipt refresh avoids unnecessary flicker.
- Fourteen automated tests pass; production frontend build passes. Expected third-party deprecation and research-mode DP warnings remain.
- Browser smoke left P-A-00015 withdrawn (Hospital A 255 eligible); user may regrant. Initialization preserves it.

## Meaningful limits / next milestone

- Measured federation AUROC 0.726 is below Hospital A local 0.750; no claim that federation universally improves accuracy. DP reduces utility in measured runs.
- Local role switching provides no real patient authorization or physical hospital isolation. Keep the server localhost-only and single-process.
- User review/testing and acceptance are next. Keep feature branch unmerged until acceptance.
- P1 membership inference remains unimplemented; receipts/audit basics are already operational. Docker, secure aggregation and external deployment are optional later. Styling requires explicit user authorization.
