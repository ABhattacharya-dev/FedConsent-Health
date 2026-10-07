# FedConsent Health

A hackathon prototype for hospital research teams exploring consent-aware federated learning and inspectable privacy evidence. Three simulated hospitals collaboratively train a pneumonia classifier without exchanging raw images through the federation interface.

**Current status:** repository bootstrap only. No application, trained model or experiment results yet. Core functionality comes first; styling requires explicit user approval.

## Proposed stack
Python 3.11, PyTorch, Flower FedAvg, Opacus, PneumoniaMNIST and scikit-learn; FastAPI, SQLAlchemy and SQLite; React, Vite and TypeScript. Membership inference with ART follows the core pipeline. Docker/cloud are optional later work.

## Start here
- [Agent rules](AGENTS.md)
- [Current plan](.agent/CURRENT_PLAN.md)
- [Architecture](docs/ARCHITECTURE.md)
- [Privacy assumptions](docs/PRIVACY.md)
- [Demo plan](docs/DEMO.md)
- [Local skills and tooling](docs/TOOLING.md)
- [Original project brief](docs/PROJECT_BRIEF.md)

Copy `.env.example` to `.env` when needed. These are proposed configuration names until application code consumes them. Python is pinned in `.python-version`; dependency locking, training/application commands and screenshots will be added when implemented and verified.

Features stay on `feature/<name>` branches until the user accepts completion. Commit format: `feature(feature_name) : short description`.

## Limitations
Educational use of public/simulated data only. No clinical validation, production readiness, compliance certification or diagnostic use. Hospital separation is initially logical simulation. Consent withdrawal excludes future training; it does not erase previous model influence. Privacy claims must match actual accounting and measured results.
