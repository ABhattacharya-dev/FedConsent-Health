# Current plan

## Objective and state
Install the four additional user-requested skills and map them to their intended project phases. State: ready for user review. Branch: `feature/project-skills`, based on the still-unmerged `feature/project-bootstrap`. No application code or styling yet; bootstrap acceptance remains pending.

## Product decision
The user selected **hospital research teams**, focusing on consent enforcement and audit evidence. Proposed positioning: make eligibility and privacy evidence inspectable across collaborative training. Pneumonia detection is the demonstration workload; product value remains to be validated.

## Architecture
One FastAPI/SQLite application, a Flower simulation with three logical hospital partitions, and one React application with researcher/patient views. Details: `docs/ARCHITECTURE.md`. No microservices or cloud infrastructure.

## Milestones and acceptance
0. Bootstrap: local skills, documented provenance, rules, plans, environment findings, secret exclusions and a committed review branch. User acceptance is required before completion/merge.
1. ML baseline: agree reuse and dependencies; Python 3.11 environment; deterministic PneumoniaMNIST loading; one CNN training run; real held-out metrics.
2. Hospitals: disjoint non-IID partitions, three local baselines and split-isolation tests.
3. Federation: Flower FedAvg, multiple rounds and test-set comparison from actual outputs.
4. Consent: scoped consent model/API, audited idempotent changes, round eligibility snapshots and withdrawal/exclusion tests.
5. DP: Opacus with explicit adjacency, valid sampling assumptions and cumulative accounting; compare feasible privacy configurations without fabricated target epsilons.
6. Functional UI/API: researcher and patient flows using real artifacts; no styling pass without explicit authorization.
7. Attack: membership-inference experiment with defensible splits/metrics; receipt and audit integration.
8. Integration: reproducible demo, failure handling and documentation; styling only if authorized.
9. Optional: secure aggregation, Docker and deployment only after the local P0 demo works.

## Dependencies and decisions
- Use the brief's established libraries; choose an upstream example/model only after a focused reuse discussion.
- Pin Python 3.11 in `.python-version`. Resolve and lock dependencies when the ML milestone starts; do not install the full ML/frontend stack during bootstrap.
- Environment variables are editable; `.env.example` is a proposed contract, not implemented application configuration.
- RTK is already installed. Install Caveman/Ponytail locally and record immutable upstream revisions.
- User authorized FastAPI, Sentry security-review, practicalswan frontend-design and Docker build-strategies. Install only these selected skills locally for Codex. Functional UX applies during core work; styling remains explicitly gated and Docker guidance applies only when containerizing.

## Risks and questions for the next discussion
- Which concrete research workflow and buyer pain should the demo prove? Initial recommendation: show exactly why a record is eligible and what changes after withdrawal.
- PneumoniaMNIST record IDs must not be misrepresented as verified patient identities; record-level DP is the honest starting point.
- Repeated federated rounds, sampling and changed consent cohorts complicate cumulative privacy accounting.
- Windows/Flower simulation dependency support must be verified before choosing an execution path; do not promise GPU availability or successful DP convergence.
- Clinical value, compliance, differentiation and willingness to pay are unvalidated.

## Completed work
- Read the brief and inspected the empty workspace, installed skills and runtime tools.
- Captured the user's target audience and approval/styling rules.
- Installed pinned local Caveman/Ponytail/Ponytail review skills and configured the existing RTK CLI locally. Documented one Ponytail metadata compatibility adjustment.
- Created rules, plans, architecture/privacy/demo documents, original brief, README and proposed environment configuration; initialized Git with the user's existing author identity.
- Verified NotebookLM authentication, GitHub API access and RTK direct invocation/exit-code propagation. Docker engine is stopped; Python 3.11 remains to be provisioned at milestone 1.
- All three local skills passed Codex's validator (UTF-8 mode). Hook JSON parsed successfully, Git ignores secrets/data/artifacts but tracks `.env.example`, and the staged diff passed whitespace checks. No application tests apply to this documentation/configuration bootstrap.
- Installed the four requested skills with project-local Codex scope through `npx skills add`. All four pass the bundled validator after metadata-only compatibility adjustments, and `skills list --agent codex` discovers all seven project skills. Recorded upstream content hashes in `skills-lock.json` and review limits in `docs/TOOLING.md`.
- Updated skill routing for backend conventions, consent/privacy review, functional UX versus gated styling, and deferred Docker work. Sentry's external scanner alert remains unexplained; documented it without presenting this install as a security audit.

## Next step
Present the committed skill additions for user review. Discuss the smallest consent/audit demonstration and upstream reuse before implementing milestone 1. No feature is complete until the user accepts it; leave both feature branches unmerged.
