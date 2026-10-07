# Demo plan

Status: planned, not executable yet. There are no verified application, training or test commands at bootstrap.

1. Run the documented seeded experiment and show disjoint non-IID hospital distributions.
2. Compare three local baselines with the federated model using one untouched test split.
3. Show a simulated record's active scoped consent and next-round eligibility.
4. Withdraw consent. Show the audit event and exclusion from the next round snapshot.
5. Explain that previously trained versions can retain influence.
6. Run DP training and show achieved epsilon/delta, configuration and real utility metrics.
7. If implemented, show membership-inference results, limitations and a training receipt.

When implementation exists, replace this paragraph with verified environment, experiment and server startup commands. Do not substitute plausible but untested commands.

Backup: replay saved real experiment artifacts with visible seed, run ID, timestamp and configuration; label the session as a replay. Keep withdrawal interactive only if the API actually runs. Missing results remain missing; never fill charts with invented numbers.
