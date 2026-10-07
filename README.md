# FedConsent Health

Consent-aware federated pneumonia research for hospital research teams. Three simulated hospitals train with scoped consent; withdrawal changes the next round, and researchers can inspect measured utility, DP accounting, membership-inference results and audit receipts.

**Hackathon prototype:** public data, logical hospital boundaries, localhost only. No real patient authentication or clinical/compliance claims.

## Setup and deterministic demo flow

Requires uv and Node/npm. Run from this repository root:

```powershell
uv sync --locked
npm --prefix frontend ci
npm --prefix frontend run build
uv run --locked python -m demo prepare
uv run --locked python -m demo serve --port 8001
```

Open **http://127.0.0.1:8001**. Preparation downloads PneumoniaMNIST if needed, measures four comparable experiments and a between-round withdrawal, and saves an offline backup. It uses a separate `artifacts/submission/demo.db`; your existing working database is preserved.

**Prepare once.** If already prepared, run only `serve`. To rehearse from fresh state, use a new `--directory artifacts/rehearsal-2` on both commands; preparation refuses to overwrite an existing database. Workflow, cohorts and configurations are fixed; DP noise remains random, so repeated metrics are not bit-for-bit identical.

On restart, cached tensors reload automatically, consent/results persist, and interrupted jobs become explicitly failed. One process only; no concurrent CLI training against the server's database.

For the original working database instead: `uv run uvicorn backend.app:app --host 127.0.0.1 --port 8000`. Optional paths/CORS settings are in `.env.example`.

## Verify

```powershell
uv run --locked pytest -q
npm --prefix frontend run build
```

Verified: 19 tests, production build, real training/attack measurements, browser consent changes, mobile reflow and server restart recovery. Detailed evidence and remaining checks are in [the submission notes](docs/SUBMISSION.md).

## Presentation kit

- [Five-minute demo and fallback](docs/DEMO.md)
- [Judging coverage, pitch and Q&A](docs/SUBMISSION.md)
- [Architecture diagram](docs/ARCHITECTURE.md)
- [Privacy assumptions and limitations](docs/PRIVACY.md)
- [Open-source reuse and licenses](docs/REUSE.md)

Stack: Python 3.11, PyTorch, Flower, Opacus, MedMNIST, scikit-learn, FastAPI, SQLAlchemy/SQLite, React/TypeScript/Vite. No additional service is required. Data/model artifacts stay out of Git.

Withdrawal does not erase prior model influence. DP values apply to each training run conditional on public cohort/evaluation metadata, not all experiments jointly; secure RNG is disabled. The attack is one small baseline, not a privacy proof. The local coordinator can access all images in memory; this is not a distributed data-residency deployment.
