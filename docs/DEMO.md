# Manual test guide and measured evidence

Start the application using README.md. Open http://127.0.0.1:8000. All records represent public dataset images, not verified patient identities.

## Features to test

1. **Initialize and inspect hospitals.** Click Load / initialize public dataset. Expect three ready hospitals, 256 records each and visibly different normal/pneumonia distributions. Eligible counts may be lower because previous withdrawals persist. Initialization must not restore withdrawn consent.
2. **Non-DP comparison.** Select No DP and three rounds, then Start training. Expect progress, three local baseline results and three federated round results. Accuracy, AUROC, F1, recall, specificity and validation-selected threshold are shown; test count is 624. A second training job cannot start concurrently.
3. **DP accounting.** Select noise 1.2 and run three rounds. Expect epsilon/delta and per-hospital noise, clipping, sample rate and accountant history. Epsilon accumulates across rounds. Repeat with noise 2.0 for the comparison plot/table; compare runs with the same cohorts/settings. Exact metrics vary because DP randomness is not seeded.
4. **Withdraw consent.** In Patient portal, select an active record and withdraw. Expect status withdrawn, next-round eligibility No, a timestamped audit event and hospital eligibility reduced by one. Run a new experiment: its round details must show the reduced count. The withdrawn record's receipt must not gain eligibility entries for those later rounds. Old entries remain visible.
5. **Regrant and persistence.** Grant consent again. Expect eligibility restored and a new audit event. Reload the page and reinitialize: consent history and experiment results remain. Withdrawal during an already-started round applies at the next snapshot, not retroactively.
6. **Receipts and errors.** Switch hospitals/records and inspect project, purpose, policy and history. DP receipts describe eligibility, not proof of individual Poisson sampling. At `/docs`, an unknown record returns 404; an invalid consent status or out-of-range experiment configuration returns 422. Stop the backend temporarily: the open UI should report connection failure and stale results.

The browser smoke test left `P-A-00015` withdrawn, so Hospital A currently has 255 eligible records. Grant it again if you want the original equal-sized cohort. Existing runs include earlier fixed-threshold experiments, explicitly labeled legacy. Use the run IDs below for the validated three-round comparison.

## Actual measured runs (2026-10-07)

All below used 256 records/hospital, three rounds, two local epochs/round, seed 42 for initialization, batch size 64, SGD learning rate 0.1, clipping 1 and delta 0.00001. Validation: official 524 records; test: official 624 records. Thresholds maximize Youden J on validation only. Values below are rounded.

| Run ID | Noise | Final AUROC | Final accuracy | Maximum hospital epsilon |
| --- | ---: | ---: | ---: | ---: |
| a542b93e30754c288a36def33f4516ad | 0 | 0.726 | 0.671 | No DP |
| e9a6422a2c2644d4b084d0d3bfbef4ea | 0.8 | 0.615 | 0.566 | 14.552 |
| 9a9b4c8bbbf1421498e8206241063371 | 1.2 | 0.609 | 0.554 | 7.293 |
| dab2c16e6f6149728059db70c31d80f2 | 2.0 | 0.603 | 0.558 | 3.396 |

Non-DP local AUROCs: A 0.750, B 0.697, C 0.619. Federation did not outperform the strongest hospital; do not claim universal accuracy improvement. This small demo demonstrates integration and the measured tradeoff, not a clinically useful model. Epsilon is per run, not composed across this table.

Browser-launched run `2df418e33d4049468d05da265397ecb3` succeeded after withdrawal with A=255, B=256, C=256; its A snapshot excluded `P-A-00015`. A separate automated integration test withdraws between rounds and verifies exclusion plus accountant continuity.

## Automated evidence

The test suite covers partition isolation/reproducibility, metrics serialization, fail-closed consent scope/status, idempotent consent/audit updates, malformed/unknown API input, hostile Host headers, withdrawal between rounds, cumulative DP history persistence, empty Poisson batches, evaluation-only test access, zero-client skipping and insufficient-hospital failure. The frontend production build checks TypeScript and bundles successfully.

Saved results can serve as a demo backup only when clearly labeled a replay. Runtime data is local and is not shipped in Git. Never substitute invented metrics if an experiment fails.
