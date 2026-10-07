# Privacy model and limits

This is an educational prototype using public/simulated data. It is not clinically validated, production-ready, compliant by certification, or suitable for diagnosis.

## Threat model
Raw images stay in logical hospital partitions. The trusted local simulation/coordinator can access process memory; it is not hardened multi-party deployment. Updates and model outputs can leak information. FL does not itself prevent membership inference, reconstruction, malicious clients or a malicious coordinator. Secure aggregation is optional future work and does not replace differential privacy.

## Consent
Eligibility requires active consent with matching hospital, project, purpose and policy. Missing or invalid state fails closed. Capture eligibility at the round boundary and audit changes. A withdrawal excludes the record from the next round's snapshot; it cannot retroactively stop reads that already occurred in an in-flight round.

Required user explanation: "Withdrawal prevents use in future training rounds. Previously trained model versions may still retain statistical influence. Retrospective removal would require retraining, rollback, or machine-unlearning techniques."

Distinguish eligible, sampled and actually trained-on records. Do not report participation from eligibility alone. Receipts describe measured events, not an individual's contribution to model accuracy.

## Differential privacy
Use Opacus DP-SGD with explicit adjacency, clipping norm, noise multiplier, sampling assumptions, delta, steps and actual accountant outputs. Synthetic patient IDs attached to individual images support a record-level demonstration, not an unverified patient-level guarantee. Multiple records per patient would require appropriate grouping and accounting.

Account for repeated rounds and released versions; resetting optimizer/model objects must not erase privacy history. Consent cohort changes need a defensible accounting policy before numerical claims. An epsilon target is an experimental configuration, not a medical safety threshold. Report achieved epsilon and delta with utility; mark failures/unavailable values honestly. Baseline without DP has no DP guarantee.

## Verification
Membership inference compares disjoint, appropriately matched member/non-member samples with attack evaluation data held out from attack fitting. Report AUC, sample sizes and protocol; near 0.5 is weak discrimination in this experiment, not proof of privacy. A loss-threshold baseline is implemented with the existing PyTorch/scikit-learn stack. ART and stronger attacks remain deferred.

Exclude real PHI, secrets, raw images and sensitive record fields from logs and external tools. Do not claim HIPAA/DPDP compliance, cryptographic audit integrity, machine unlearning or deployment-level hospital isolation.

## Implemented accounting boundary

Each hospital has one Opacus RDP accountant per experiment. All scheduled steps, including empty Poisson batches, accumulate across rounds. Saved histories are snapshots, not mutable aliases. Changing eligible subsets changes sampling rates; recorded RDP history retains each rate/noise/step tuple. Eligibility, counts and evaluation data are treated as public/fixed side information: consent membership itself is not protected by the reported epsilon.

Displayed epsilon is the maximum of the three disjoint hospital accountants for that run. Separate runs are not composed into a dataset-wide budget. Because this demo also releases non-DP baselines and models, no combined DP guarantee is claimed. Validation-selected thresholds and test metrics use public evaluation records outside the protected training cohort. Secure RNG is disabled: this is measured research accounting, not a hardened privacy deployment.

The local API has no authenticated patient/hospital authorization. All roles can read and change simulated records. Bind to localhost only; adding real identities or external access requires authentication and explicit cross-patient/hospital authorization before use. Host/CORS restrictions are not substitutes for those controls.
