# FedConsent Health

## Product and working agreement
- Build a 24-hour educational prototype for hospital research teams: consent-aware federated pneumonia research with measured privacy and audit evidence. Read `.agent/CURRENT_PLAN.md` before work; detailed context is in `docs/PROJECT_BRIEF.md`.
- Discuss consequential product choices, challenge weak assumptions, and implement one agreed milestone at a time. Ask when missing information affects correctness or scope; handle routine reversible choices autonomously.
- **Do not start styling, visual polish, animations, or a design-system pass until the user explicitly authorizes the styling phase.** Build core structure and functional, accessible interactions first.
- Avoid overwork. Reuse maintained open-source libraries, models, datasets, and existing code before writing replacements. Present meaningful reuse options and their licenses/tradeoffs for discussion before adopting an entire project or changing the agreed stack.
- Market impact, differentiation, scalability, and profitability are hypotheses to validate, not guarantees. Prefer an end-to-end demonstration over breadth.

## Architecture and privacy invariants
- Proposed stack: Python 3.11, PyTorch, Flower FedAvg, Opacus, MedMNIST, scikit-learn; FastAPI/Pydantic/SQLAlchemy/SQLite; React/Vite/TypeScript. ART follows the core pipeline. Tailwind/Recharts are for the later approved UI phase as needed.
- Simulate three non-overlapping, non-IID hospital training partitions. Keep the official test split untouched and shared for evaluation only. Raw images stay inside each logical hospital boundary; federation exchanges model updates and safe metadata.
- Public/simulated data only. Pseudonymous record IDs are not evidence of real patient-level grouping. State DP adjacency accurately; do not claim patient-level DP unless all records for each patient are grouped and accounted for correctly.
- Consent must match patient, hospital, project, purpose, policy and active status. Unknown, invalid, unavailable, or withdrawn consent excludes a record. Recompute eligibility before each round; handle zero eligible clients without misleading results.
- Withdrawal affects future rounds. It does not erase influence from already trained models; a round already started may have consumed data. State the round snapshot boundary accurately.
- Record actual experiment outputs, privacy accountant state/parameters, seeds, splits, model configuration and metrics. Account for repeated rounds/releases; never reset an accountant and present the result as a cumulative guarantee.
- Never fabricate metrics, privacy guarantees, participation, attribution, or raw-data residency evidence. FL alone is not DP or protection from malicious updates. No clinical validation, production readiness, HIPAA/DPDP compliance, or diagnostic suitability claims.
- Input validation, safe ORM queries, restrictive CORS, safe errors and audited consent changes are required. Read or edit `.env` as needed; never print secrets or commit credentials, raw datasets, or local runtime artifacts.

## Implementation and verification
- Prioritize P0: three hospitals, local/FL comparison, real consent filtering/withdrawal, measured DP and a functional researcher dashboard. Then membership inference, patient receipts and audit history. Docker/cloud/secure aggregation are optional after the local core works.
- Prefer straightforward functions and existing libraries. No speculative services, abstractions, authentication platforms, blockchain, Kubernetes, LLM features, or machine unlearning implementation.
- Test consent inclusion/exclusion/withdrawal, split isolation, no test leakage, privacy metadata persistence, metrics round trips, malformed input and core endpoints. Cover failure cases that affect truthful results.
- Run checks relevant to the change, fix actual failures, and update the current plan with outcomes and unresolved problems. App test/start commands must be documented only once implemented and verified.

## Git and definition of done
- Create `feature/<short-name>` branches for new features. Commit coherent work using `feature(feature_name) : short description`; initial repository commit: `init: project initialised`. Do not invent author identity.
- Keep tested work on its feature branch as **ready for user review**. A feature is complete only after the user says so; merge into `main` only following that acceptance. Never auto-merge because checks pass.
- Record remaining problems honestly in `.agent/CURRENT_PLAN.md`; do not commit known-broken work as complete. Preserve user changes. Do not push or create a remote unless requested.

## Local skills and tools
Read the applicable entrypoint; use the local copy instead of stacking equivalent global instructions. User instructions and correctness override skill shortcuts.

| Resource | When to refer to it |
| --- | --- |
| `.agents/skills/caveman/SKILL.md` | Concise progress and discussion; preserve technical facts, errors and clear prose. Persisted documentation remains normal prose. |
| `.agents/skills/ponytail/SKILL.md` | Implementation, architecture and dependency decisions; choose the smallest correct solution without removing validation or required tests. |
| `.agents/skills/ponytail-review/SKILL.md` | Review a meaningful feature diff for unnecessary complexity before presenting it. |
| `RTK.md` | Reduce verbose command output using the installed RTK CLI. Use explicit supported `rtk` commands in PowerShell; inspect full output on ambiguity or failure. Never hide exit codes or route secret-bearing output through its history. |
| `docs/TOOLING.md` | Installation provenance, environment findings, and tool setup limitations. |

- Use `gh` for repository/source inspection and authorized GitHub work. Use `nlm` for source-grounded research when useful; consult its help, verify authentication, and cite original sources for claims. Never upload secrets or patient data.
- Use Docker after the core application works if reproducibility/demo value warrants it. Defer design skills until styling is authorized; add other third-party skills only with authorization.

@RTK.md
