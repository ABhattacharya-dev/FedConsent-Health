# Current execution plan

## State and authorization

Final hackathon integration on `feature/submission-ready`, stacked on `feature/p0-integration` (341bd4b). User authorized styling and final presentation work on 2026-10-07. Scope is now frozen around demo reliability and judging impact. Work is ready for user review after final checks; do not merge or push without acceptance.

## Delivered milestones

1. Inspected actual code, Git history, runtime outputs and the existing test suite before edits. Preserved user assets in docs/figures and frontend/public/icon.svg as untracked, unstaged files.
2. Correctness/reliability: atomic cross-hospital consent snapshots; fail-closed record/hospital identity matching; explicit inclusion/exclusion receipts; cached dataset recovery; failed status for interrupted jobs; browser-origin validation; native evidence downloads.
3. Measured attack: minimal loss-threshold baseline using existing PyTorch/scikit-learn. Label-matched unused training records; separate calibration/evaluation; counts, indices, seed, metrics and limitations persisted. No ART or new package dependencies.
4. Polished UI: restrained teal research workspace, hospital cohort distributions, selected-run local/FL metrics, comparable-cohort privacy plot/table, attack panel, patient consent/audit/receipts, visible focus and responsive layout. No mock results.
5. Submission kit: isolated preparation/serve commands, actual four-setting experiment suite, between-round withdrawal proof, offline HTML/JSON backup, concise README, architecture diagram, five-minute flow, limitations, judging matrix, pitch and Q&A.

## Evidence

- 19 automated tests pass; production frontend build passes. uv locked sync and npm clean install verified.
- Prepared directory: artifacts/submission (separate SQLite database; original data/fedconsent.db preserved). Manifest identifies the four experiments and withdrawal proof. Re-preparation refuses to overwrite consent/history.
- Non-DP three-round AUROC 0.726; local A/B/C 0.750/0.697/0.619. DP noise 0.8/1.2/2 gives epsilon 14.552/7.293/3.396 and measured AUROC 0.619/0.621/0.595. Attack AUROC about 0.52; no protection claim inferred from that weak attack.
- Prepared withdrawal run 21c7143e includes P-A-00015 in round 1 and excludes it in round 2. Browser grant/withdraw audited; browser-launched run b6da58a5 after restart explicitly excludes it.
- Browser checked research/privacy/patient views, keyboard activation, 320/390/820/1280-width reflow, server-stop stale state and automatic restart recovery. No page-wide overflow observed. Text/primary-action contrast pairs measured; input border and sidebar focus contrast corrected.
- Native export endpoints and browser receipt/experiment downloads verified, including downloaded JSON contents. Offline backup serialization/escaping tested; embedded browser blocks local-file preview, so regular-browser rehearsal remains recommended. No screen-reader/200%-text certification or field performance claim.

## Boundaries and next action

- Keep localhost-only: role switching is not authentication. Hospital partitions are logical; the trusted coordinator can access all public images. Flower messages contain only model weights/counts, covered by a test.
- DP accounting is cumulative within each run, conditional on public cohort/evaluation metadata. No composed guarantee across experiments/non-DP outputs; secure RNG off. Attack statistics are outside the DP training guarantee.
- User review and five-minute rehearsal are next. No broader architecture, Docker, cloud, secure aggregation or additional attacks are needed for this submission.
- See docs/SUBMISSION.md for every judging category (provided weights total 90), pitch, Q&A and honest remaining limits. See docs/DEMO.md for the executable flow and backup plan.
