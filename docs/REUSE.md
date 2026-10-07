# Reuse decisions

- Flower's maintained PyTorch quickstart: https://flower.ai/docs/examples/quickstart-pytorch.html (Apache-2.0 framework). Reuse Flower aggregation/client interfaces rather than implement FedAvg arithmetic ourselves. Local logical simulation avoids adding distributed infrastructure for the demo.
- Opacus PrivacyEngine: https://opacus.ai/api/privacy_engine.html (Apache-2.0). Reuse Poisson sampling, per-example clipping/noise and RDP accounting. No custom DP implementation.
- MedMNIST: https://github.com/MedMNIST/MedMNIST (Apache-2.0 code). Use its PneumoniaMNIST download/checksum and official train/validation/test splits; dataset attribution and terms are distinct from code licensing and are recorded in run metadata.
- SQLite with SQLAlchemy: embedded persistence without a database service. FastAPI handles validated APIs; React/Vite provides functional views without a design framework.

Examples inform integration; no complete upstream application is forked. Installed versions and source signatures are verified before using APIs. No cloud, Ray cluster, containers, custom aggregation or custom privacy accountant is required for this initial local demonstration.
