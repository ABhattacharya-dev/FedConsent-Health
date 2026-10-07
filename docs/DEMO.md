# Five-minute demo

Use README.md's prepare/serve commands before judging. First preparation needs internet and downloads; serving the prepared demo uses cached data and local assets. Do not prepare or install dependencies on stage.

## Rehearsal checklist

- Open http://127.0.0.1:8001 and check all hospitals show READY.
- Keep `artifacts/submission/manifest.json` beside you: it identifies the actual run IDs for each noise setting and the withdrawal proof. New preparations produce new IDs and random DP results.
- Open `artifacts/submission/backup.html` in a browser before presenting. It is a standalone, clearly labeled recorded-evidence page. `evidence.json` contains the full saved configurations and round snapshots.
- Patient P-A-00015 begins withdrawn after preparation. For a live withdraw demonstration, grant consent before the pitch, then withdraw on stage. Both events are audited. Do not delete or reset history.
- The prepared two-round withdrawal run remains reproducible evidence even if the live run is slow. It includes the record in round 1 and excludes it in round 2.

## Flow and words to use

| Time | Show | Say / prove |
| --- | --- | --- |
| 0:00–0:35 | Hospital network | Three disjoint cohorts have different label mixes: A 177/79, B 57/199, C 14/242 normal/pneumonia. Local data bias changes model behavior. These are logical boundaries in one process. |
| 0:35–1:15 | Select the three-round non-DP experiment from the manifest | Compare local A/B/C with the real federated result on the same 624-record test set. Federation AUROC 0.726 exceeds B 0.697 and C 0.619, but not A 0.750. Do not imply universal improvement. |
| 1:15–1:40 | Expand round-by-round results | Show collaborative training and actual round progression. All models use validation-selected thresholds and the same epoch budget. Test data never trains the model. |
| 1:40–2:20 | Patient portal | Identify project, purpose and policy. Withdraw the active simulated record. Status becomes excluded; hospital eligibility drops by one. Explain that previous model influence remains. |
| 2:20–2:55 | Start one non-DP round, then inspect patient receipt | Exclusion appears explicitly in the new snapshot. If live timing is awkward, select the prepared withdrawal run: round 1 eligible, round 2 excluded. State that this is saved evidence. |
| 2:55–3:40 | Privacy evidence, select the three-round DP 1.2 run | Show epsilon 7.293 at delta 0.00001, clipping 1 and accountant history. Compare the three matched-cohort noise settings. Explain lower epsilon versus measured utility; do not promise monotonic utility from one random trial. |
| 3:40–4:15 | Membership-inference measurement | Show held-out attack AUROC, balanced accuracy, TPR/FPR and sample counts. Around 0.52 is weak discrimination for this attack, not proof of privacy or evidence that DP eliminated attacks. |
| 4:15–4:40 | Patient receipt / Export evidence | Consent events, eligibility snapshots, configuration and actual results are downloadable. Audit is ordinary SQLite history, not cryptographically tamper-proof. |
| 4:40–5:00 | Close on value | The proposed product is a consent-enforcement and evidence layer for research collaboration. A hospital pilot must validate integration, adoption and willingness to pay. |

## Prepared evidence, 2026-10-07

Same 768-record initial cohort, 3 rounds, 2 local epochs/round, seed 42, batch 64, SGD 0.1, clipping 1, delta 1e-5. Attack evaluation contains 252 members and 252 matched nonmembers; separate calibration contains the same counts. Members denote ever-eligible records, not logged individual Poisson draws.

| Run prefix | Noise | Model AUROC | ε max | Attack AUROC |
| --- | ---: | ---: | ---: | ---: |
| d68445c0 | 0 | 0.726 | No DP | 0.519 |
| 21c6e8a3 | 0.8 | 0.619 | 14.552 | 0.517 |
| 04113d43 | 1.2 | 0.621 | 7.293 | 0.517 |
| a34273a6 | 2.0 | 0.595 | 3.396 | 0.516 |

Withdrawal run `21c7143e` changes Hospital A from 256 to 255 between rounds; P-A-00015 is excluded in round 2. Its final AUROC is 0.733 versus local A 0.686, B 0.691 and C 0.608, but its changing cohort/two-round configuration is not directly comparable to the table above. Do not hide this distinction.

## Failures and fallback

- **Server restart:** rerun the same serve command. The cache loads automatically; audit and consent remain. A job interrupted before final persistence is failed, never silently reported as succeeded. Start a new experiment.
- **No internet:** prepared demo still works with its archive/cache; do not delete `data/`. No fonts or scripts load from external CDNs.
- **Training error:** keep the failed label visible and inspect an earlier successful run. Partial rounds are labeled as part of a failed run. Never describe them as a completed experiment.
- **Backend unavailable:** UI marks displayed results stale and disables mutations. Restart and retry; do not claim a live withdrawal succeeded offline.
- **Backend cannot recover in time:** open `backup.html`; announce recorded evidence. It supports results/audit presentation, not live interaction. Full evidence is adjacent in JSON.
- **Port occupied:** choose another localhost `--port` and use that URL. Never kill an unknown process to free the port.
- **Fresh rehearsal:** use a new `--directory` and prepare before judging. Existing databases are intentionally not reset.

## Features to test manually

Initialization without resetting consent; non-DP local/federated comparison; DP budget growth; filtered comparable-run plot; measured attack protocol; withdrawal/regrant; explicit next-round exclusion; downloadable receipt/evidence; keyboard navigation; narrow screens; malformed requests through `/docs`; stale-state recovery after stopping/restarting the server. Screen-reader and full assistive-technology certification remain unverified.
