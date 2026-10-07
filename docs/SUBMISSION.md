# Submission notes

## Judging coverage

The supplied categories total **90 points**, not 100. No omitted category or self-awarded score is invented.

| Category | Weight | Demonstrable evidence | Remaining limit |
| --- | ---: | --- | --- |
| Innovation & Creativity | 15 | Consent enforced at each round boundary, with exclusion receipts and privacy/utility/attack evidence in one research workflow | The component algorithms are established open source; differentiation is integration and workflow, not a novel FL algorithm |
| Technical Implementation | 15 | Locked Python/JS dependencies, real Flower aggregation, Opacus accountant history, validated APIs, transactions and persistent results | Local simulation; no real identity/authorization or physical hospital isolation |
| User Experience & Design | 15 | Responsive researcher, privacy and patient views; selected-run comparisons, plain-language withdrawal, explicit excluded states, downloads and accessible tables | Full screen-reader/assistive-technology audit unverified |
| Feasibility & Scalability | 15 | One-machine demo, restart recovery, documented preparation, reuse of maintained libraries | Hospital connectors, identity, network security and operational governance require a pilot; no scale benchmark |
| Technical Complexity & Execution | 10 | Non-IID cohorts, comparable local/FL training, cumulative DP accounting, atomic consent snapshots, independent attack calibration/evaluation | Small CNN, record-level accounting, one attack baseline, no secure aggregation |
| Functionality & Features | 10 | Train, compare, withdraw/regrant, exclude next round, inspect/export receipts and evidence | No retrospective unlearning or real patient portal |
| Presentation & Pitch | 10 | Five-minute flow, measured evidence, architecture diagram, Q&A, standalone offline backup | Presenter must distinguish live actions from saved results and avoid clinical/privacy overclaims |

## Pitch talking points

**Opening:** Hospital research collaborations need more than a shared model. They need to know which records were eligible, what changed when consent was withdrawn, and what privacy–utility tradeoff was actually measured.

**Product:** FedConsent Health connects consent decisions to federated training rounds. Researchers compare hospital and shared models; patients can change future eligibility and inspect a receipt. The same workspace exposes the accountant and a measured attack baseline.

**Proof:** Three deliberately biased cohorts, real Flower aggregation, scoped consent, next-round exclusion, real DP noise/accounting, persistent audit events and exportable experiment evidence. Show one action and its consequence rather than describing a long feature list.

**Honest result:** Federation improves AUROC over two local baselines in the three-round experiment but not the strongest hospital. More noise lowered utility in this small experiment. Attack AUROC stays near chance for this weak baseline; that is not a privacy certificate.

**Commercial hypothesis:** A research-office or multi-hospital consortium could pay for consent enforcement, reproducible experiment governance and audit preparation. Pricing, sales cycle, integration cost and willingness to pay are unvalidated. The first pilot should test whether the evidence workflow reduces manual reconciliation and whether researchers trust/use it.

**Next step:** Validate a small research workflow with a hospital partner before investing in distributed deployment. Measure consent-policy integration effort, audit preparation time, usability and reproducibility. Add security/identity infrastructure only when the deployment and data governance requirements are clear.

## Judge Q&A

**What is new?** The consent-to-round-to-evidence workflow. Flower, Opacus and the classifier are reused rather than rebranded as inventions.

**Are the hospitals separate?** Their training index sets are disjoint and each local loader receives only that hospital's eligible subset. Flower messages carry weights and counts, verified by a test. All tensors still live in one trusted local process; there is no physical isolation or residency attestation.

**Is raw data centralized?** This public-data simulation loads the archive centrally and partitions it logically. It does not transmit images in aggregation messages or expose them through the API. A real deployment must move loaders/training to hospital-controlled systems; the current prototype must not be sold as that deployment.

**Why not show guaranteed model improvement?** The data is deliberately non-IID and training is tiny. Collaboration helps B/C in the documented run but is not universally better. AUROC, recall and specificity expose weaknesses that accuracy alone hides.

**Does withdrawal delete my influence?** No. It changes the next eligibility snapshot; an already-started round may still use its frozen cohort. Prior trained models can retain influence. Removal requires retraining or an independently validated unlearning approach.

**What exactly does epsilon cover?** Opacus's record-level training mechanism for one experiment, conditional on public/fixed cohort metadata. Each hospital accountant accumulates across rounds; the displayed maximum applies to disjoint hospital records. Cohort membership, attack statistics and public evaluation records are not protected by that claim. Repeated experiments/non-DP releases have no joint guarantee here. Secure RNG is off.

**Is epsilon a safe medical threshold?** No. The noise settings are experimental and accountant outputs are measured. There is no certified safety cutoff.

**What attack did you measure?** A negative-loss threshold baseline informed by Yeom et al. It uses unused records from the official training split as nonmembers, matches class distributions and separates calibration from evaluation. The threshold is selected on calibration only. AUROC, balanced accuracy, TPR/FPR and exact group counts are recorded. No shadow-model or exhaustive attack suite; no confidence intervals. It measures cohort membership, not logged Poisson inclusion.

**Why no ART?** The required baseline uses existing PyTorch/scikit-learn primitives. Adding an attack framework solely to wrap a loss threshold would add dependency risk without stronger evidence. ART remains an option for a later broader threat evaluation.

**Can patients access this securely?** Not yet. Role selection is a local demo control. Any local caller can change simulated consent. No claim of authenticated cross-patient/hospital access control is made. External deployment is out of scope.

**Can audit history be tampered with?** A database administrator can alter it. Transactions make ordinary updates reliable; this is not an immutable or cryptographically signed ledger.

**How does this scale?** The next engineering boundary is hospital-local clients, authenticated policy checks and durable job/result storage. The current single-process lock and SQLite are deliberate demo choices, not a scale demonstration.

**What happens if the demo fails?** Restart preserves consent/results and marks interrupted work failed. The offline backup shows actual saved evidence with an explicit replay label. No made-up fallback metrics.

## Verification record

- Automated: 19 tests pass, covering fail-closed consent, identity/scope, disjoint partitions, evaluation-only test access, Flower message contents, empty Poisson steps, cumulative accountant history, withdrawal, API validation, foreign-origin mutations, restart recovery, explicit exclusion receipts and attack split integrity.
- Setup: `uv sync --locked`, `npm ci` and the production build succeed. No new package dependencies. Build output approximately 76 KB gzipped JS and 3.2 KB gzipped CSS; no remote fonts or UI libraries.
- Real data: four three-round experiments and a between-round withdrawal ran successfully in a separate submission database. Attack evaluation uses 504 held-out records, plus 504 separate calibration records.
- Browser: research/DP comparisons, patient regrant/withdrawal, keyboard activation, mobile reflow, stale warning on server stop and automatic recovery after restart checked. Live experiment submission checked separately from saved replay.
- Export evidence: native attachment endpoints return valid JSON and Content-Disposition headers in tests. Native experiment and receipt downloads were verified in the browser and parsed from disk after replacing Blob downloads. The offline HTML/JSON backup is generated and tested; its local-file preview is blocked by the embedded browser URL policy. Open it directly in a regular browser for rehearsal.
- Remaining verification limits: no production load test, formal security/privacy proof, clinical validation, exhaustive attack suite, screen-reader certification or field Core Web Vitals measurement.

## Security boundary

Routes use Pydantic validation and bound SQL parameters; React escapes content. Local Host and CORS restrictions are retained, and foreign-origin browser POSTs are rejected (CORS alone would not stop a simple cross-origin initialization POST). This does not establish authentication. Dataset/artifact paths are operator-controlled; no image/upload endpoint exists. New exports contain public synthetic IDs, not real patient records. The offline backup escapes serialized text.

The user's untracked `docs/figures/` and `frontend/public/icon.svg` assets were preserved and excluded from this implementation commit. They are not required by the demo or presented as verified architecture evidence.
