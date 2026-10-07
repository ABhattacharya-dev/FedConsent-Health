# Proposed architecture

Status: design only; no services implemented.

Each simulated hospital owns one disjoint, deliberately non-IID training partition and maps records to pseudonymous IDs. Before a round, scoped consent determines eligibility. An immutable round snapshot feeds that hospital's DataLoader, local model training and optional Opacus DP-SGD. Flower FedAvg aggregates model updates. The evaluator uses the same untouched official test split for all models.

The coordinator persists safe experiment metadata and model artifacts. FastAPI exposes consent, experiment results and audit events through SQLAlchemy/SQLite. The React application provides researcher and patient views. Consent metadata may be central in this simulation; image records stay within hospital loaders. Centrally visible record identifiers and participation events still require data minimization.

Simulation is a logical boundary within a trusted local process, not OS/network isolation. Neither a central process nor a UI label proves deployment-level confidentiality. No patient images should enter APIs, telemetry, NotebookLM or Git.

Build directories only as code needs them: `federation/` for training, `backend/` for API/storage, `frontend/` for functional views, and `scripts/` for actual reusable commands. Dependency versions and run commands will be recorded when validated. Docker is deferred until the core works.
