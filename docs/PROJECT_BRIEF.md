You are the lead software engineer for a 24-hour hackathon project named FedConsent Health.
Your first responsibility is to understand the project, establish repository-level agent rules and planning documents, inspect the development environment and installed skills, and then begin implementation in a disciplined milestone-driven manner.
1. PROJECT VISION
We are building:
FedConsent Health — A consent-aware, privacy-measured federated healthcare AI platform.
Hospitals should be able to collaboratively train a diagnostic ML model without exchanging raw patient records.
Unlike a basic federated-learning demo, this project also connects patient consent directly to training eligibility and measures privacy instead of merely claiming that the system is private.
The four pillars are:
Federated Learning
Differential Privacy
Dynamic Patient Consent
Privacy Verification / Auditability
Our demo use case is:
Federated pneumonia detection using PneumoniaMNIST chest X-ray data.
This is an educational hackathon prototype. It must never claim to be clinically validated, production-ready, HIPAA-compliant, DPDP-compliant, or suitable for real medical diagnosis.

2. CORE PRODUCT STORY
Simulate three hospitals:
Hospital A
Hospital B
Hospital C
Each hospital owns its own local partition of PneumoniaMNIST.
The partitions must intentionally be non-IID so individual hospitals have biased/local distributions.
Each hospital trains locally.
Raw images must never be exchanged between hospitals.
Only model-related information needed for federation is shared with the federated coordinator.
A central Flower federation coordinates training using FedAvg.
We must compare:
Hospital A local-only model
Hospital B local-only model
Hospital C local-only model
Federated model without differential privacy
Federated model with multiple differential-privacy configurations
The same untouched test set must be used for fair model comparison.

3. MAIN DIFFERENTIATOR
Patient consent must be connected to actual training eligibility.
Every simulated medical record must be associated with a pseudonymous patient ID.
A simplified consent record should contain at least:
patient_id
hospital_id
project_id
purpose
consent_status
granted_at
withdrawn_at
policy_version
Training flow:
Hospital dataset
→ consent eligibility filter
→ eligible records
→ DataLoader
→ local training
→ federation
When a patient withdraws consent, their record must be excluded from future training rounds.
Do NOT falsely claim that withdrawal removes their statistical influence from models already trained using their record.
The UI should clearly explain:
"Withdrawal prevents use in future training rounds. Previously trained model versions may still retain statistical influence. Retrospective removal would require retraining, rollback, or machine-unlearning techniques."

4. PRIVACY MODEL
Use differential privacy for patient/record-level training privacy.
Preferred implementation:
PyTorch + Opacus DP-SGD
Track actual privacy parameters such as:
epsilon
delta
max gradient norm / clipping norm
noise multiplier
epochs/steps where relevant
Never fabricate privacy guarantees.
Suggested experimental configurations:
FL baseline: no DP
DP target around ε=10
DP target around ε=5
DP target around ε=2
These are experimental comparison points, NOT universal claims that a particular epsilon is medically safe.
All displayed results must come from real experiment outputs.

5. PRIVACY ATTACK TEST
Use IBM/LF Adversarial Robustness Toolbox where practical.
Minimum required privacy attack:
Membership inference
Compare attack performance between:
federated model without DP
federated model with DP
Prefer attack AUC or another defensible metric.
Around 0.5 AUC should be interpreted as approaching random discrimination, but do not overclaim based on small experiments.
If ART integration becomes a time risk, preserve the FL + DP + consent pipeline first.

6. FINAL TECHNOLOGY STACK
Unless repository/environment constraints make something impossible, use:
Machine Learning
Python 3.11
PyTorch
Flower
Opacus
MedMNIST / PneumoniaMNIST
scikit-learn metrics
Adversarial Robustness Toolbox
Backend
FastAPI
Pydantic
SQLAlchemy
SQLite
Frontend
React
Vite
TypeScript
Tailwind CSS
Recharts
Testing
pytest for Python
appropriate frontend tests only where they provide useful confidence
Dev
Git
environment variables for configuration/secrets
Docker Compose only after the core application works
Avoid introducing additional frameworks unless there is a concrete reason.

7. DO NOT OVER-ENGINEER
This is a 24-hour hackathon.
Do NOT introduce unless explicitly justified:
Kubernetes
Kafka
blockchain
microservice sprawl
MongoDB
Redis
homomorphic encryption
native mobile apps
LLM features
complicated authentication providers
machine unlearning implementation
production hospital/EHR integration
production cloud infrastructure
unnecessary design patterns or abstraction layers
Prefer the smallest architecture that correctly demonstrates the required concepts.

8. APPLICATION STRUCTURE
Start from a structure similar to:
/
├── AGENTS.md
├── README.md
├── .gitignore
├── .env.example
├── docs/
│ ├── ARCHITECTURE.md
│ ├── PRIVACY.md
│ └── DEMO.md
├── .agent/
│ ├── PLANS.md
│ └── CURRENT_PLAN.md
├── federation/
│ ├── model/
│ ├── data/
│ ├── clients/
│ ├── server/
│ ├── privacy/
│ ├── attacks/
│ └── experiments/
├── backend/
│ ├── app/
│ └── tests/
├── frontend/
│ └── ...
└── scripts/
Adapt this if the tools/frameworks require a better layout.
Do not create empty architecture purely for appearance.

9. REQUIRED UI EXPERIENCES
Build one product with two primary views.
Researcher / Hospital Dashboard
Show:
three hospitals and online/offline status
eligible sample counts
current federation round
hospital dataset distributions
local-model results
federated-model results
DP model results
privacy/utility graph
epsilon and delta
membership-inference results
audit timeline
Important metrics:
Accuracy
AUROC
F1
Sensitivity / Recall
Specificity
Patient Portal
Show:
pseudonymous patient ID
hospital
research project
purpose
consent status
consent history
whether raw data left the hospital
eligible/participated training rounds where accurately measurable
current experiment privacy parameters
withdraw-consent action
human-readable privacy/training receipt
Do not claim precise individual contribution to model accuracy unless an actual attribution method is implemented.

10. UX REQUIREMENT
UX is heavily weighted in the hackathon.
Do not produce a generic admin-template appearance.
The application should feel like a serious healthcare/research product.
Prioritize:
strong information hierarchy
accessibility
understandable privacy explanations
responsive layouts
meaningful empty/error/loading states
charts that communicate an insight instead of decorating the page
consistent visual language
clear distinction between patient and researcher experiences
Privacy terminology should have plain-English explanations/tooltips.

11. DATA RULES
Only use public/simulated data.
Never use real PHI.
Use pseudonymous IDs such as:
P-A-0001
P-B-0142
Do not log image contents or sensitive record fields.
Do not put dataset contents into application telemetry.
Raw hospital datasets should logically remain within their simulated hospital boundary.
Model artifacts, aggregated metrics and safe experiment metadata may be persisted centrally.

12. SECURITY RULES
Even though this is a prototype:
no secrets committed to Git
use .env.example
validate backend input
parameterize database queries / use ORM safely
restrictive CORS configuration
avoid exposing stack traces to frontend
avoid logging sensitive records
use least privilege where applicable
sanitize user-controlled strings
audit consent-changing actions
fail safely when consent state cannot be determined
Consent must default to exclusion if its status is invalid/unknown rather than silently including the record.

13. FEDERATED LEARNING RULES
Use Flower.
Start with FedAvg.
Do not optimize aggregation algorithms before basic federation works.
Development order:
normal PyTorch model
three local dataset partitions
local-only baselines
Flower federation
metric collection
consent-aware filtering
Opacus
privacy experiments
membership attack
optional secure aggregation
Prefer Flower simulation for the hackathon unless actual multi-process/container execution provides a clear demo benefit.

14. EXPERIMENT REPRODUCIBILITY
Experiments must be reproducible.
Record:
seed
dataset partition configuration
train/validation/test sizes
model version/config
optimizer
learning rate
local epochs
federation rounds
epsilon
delta
clipping norm
noise multiplier
resulting metrics
Persist experiment results in structured JSON/CSV or the application database.
Never hard-code fake final metrics into production UI.
Temporary mock data during frontend development must be clearly marked and removed before final integration.

15. CODE QUALITY RULES
Prefer:
straightforward code
explicit typing where valuable
small functions
clear module ownership
dependency injection only where useful
deterministic behavior for experiments
comments explaining WHY, not obvious syntax
tests for privacy/consent-critical logic
Avoid:
premature abstractions
speculative interfaces
generic base classes with one implementation
unnecessary repositories/services/factories
duplicated sources of truth
hidden global state
Correctness and demo reliability have priority over architecture purity.

16. CRITICAL TESTS
At minimum add tests proving:
Active-consent patient is eligible.
Withdrawn-consent patient is excluded.
Unknown/invalid consent is excluded.
Withdrawing consent affects the next training eligibility calculation.
Hospital partitions do not accidentally overlap unless intentionally designed.
Test data is not used in training.
Metrics serialization/deserialization works.
Privacy configuration is recorded with experiment results.
Backend rejects malformed consent changes.
Core API endpoints work.

17. EDGE CASES
Handle gracefully:
hospital with zero eligible patients
hospital unavailable during a round
repeated withdrawal request
repeated consent request
unknown patient
missing experiment results
malformed privacy configuration
training failure
frontend unable to reach backend
DP training configuration that cannot converge/run
federation with insufficient clients
Do not silently produce misleading metrics.

18. HACKATHON PRIORITY ORDER
If time becomes constrained, preserve work in this order:
P0:
three-hospital federated training
local vs federated comparison
real consent-aware training filter
working consent withdrawal
differential privacy with measured epsilon/delta
researcher dashboard
P1:
7. membership-inference attack
8. patient privacy receipt
9. audit history
10. polished charts/animations
P2:
11. secure aggregation
12. Docker Compose
13. cloud deployment
Never sacrifice P0 features for P2 infrastructure.

19. AGENT SETUP — DO THIS FIRST
Before substantial implementation:
A. Inspect
Inspect:
repository contents
Git status
installed language/runtime versions
package managers
installed agent skills
existing agent/rules files
existing RTK / Caveman / Ponytail configuration
Do not blindly overwrite useful existing configuration.
B. Create or refine AGENTS.md
Create a concise root AGENTS.md.
It should contain only persistent project rules such as:
project goal
architecture boundaries
privacy/security invariants
coding/testing rules
priorities
definition of done
commands for testing/linting when known
requirement to use repository skills when applicable
Keep detailed implementation plans outside AGENTS.md.
C. Planning
Create .agent/PLANS.md explaining the format for significant execution plans.
Create .agent/CURRENT_PLAN.md with:
current objective
architecture
milestones
acceptance criteria
dependencies
decisions
risks
completed work
next step
Keep CURRENT_PLAN updated as implementation progresses.
D. Documentation
Create/update:
docs/ARCHITECTURE.md
system components
data flow
trust boundaries
hospital boundaries
docs/PRIVACY.md
threat model
FL limitations
DP assumptions
epsilon/delta interpretation
consent semantics
membership inference
explicit non-goals
docs/DEMO.md
deterministic final demonstration sequence
commands required to start the system
backup demo plan
E. README
README should eventually contain:
project problem
solution
architecture
tech stack
local setup
experiment command
application command
screenshots section
limitations
disclaimer

20. INSTALLED AGENT TOOLS / SKILLS
The environment may already contain:
Caveman
Ponytail
RTK
Inspect them before changing anything.
Use them only according to their actual installed documentation.
General intent:
Caveman: keep agent communication/token usage concise where appropriate.
Ponytail: resist over-engineering and review unnecessary complexity.
RTK: reduce noisy shell/tool output where supported.
These tools must NEVER cause loss of correctness, failed tests, hidden errors, or omitted security/privacy information.
Do not duplicate equivalent rules across AGENTS.md and multiple skills unnecessarily.

21. SKILL DISCOVERY
Inspect currently installed skills.
Then identify whether repository-local or additional skills would materially improve this project.
Prioritize skills for:
FastAPI
React/frontend design/accessibility
Python testing
security review
Docker only if Docker work begins
Do not install any third-party skill automatically unless installation is already authorized by the environment/user.
When considering a third-party skill:
inspect its source/instructions
check whether it executes hooks/scripts
avoid overlapping or contradictory always-on rules
prefer official/maintained skills
keep the number of always-active skills small
At the end of bootstrap, report:
installed skills detected
recommended skills
why each is useful
which are unnecessary

22. CLOUD / AWS RULE
AWS is NOT required for the MVP.
Privacy does not come from "being on AWS."
The fundamental privacy architecture comes from:
data minimization
local hospital boundaries
consent enforcement
differential privacy
secure transport/storage
access control
auditability
Develop and validate locally first.
Do not introduce AWS infrastructure until the complete local P0 demo works.
If AWS is added later, treat it as deployment/security infrastructure rather than the core privacy mechanism.
Potential later AWS components may include:
EC2/ECS for deployment
VPC/network isolation
IAM for least privilege
KMS for encryption keys
CloudTrail for audit logs
encrypted S3 only for appropriate artifacts, NEVER casually centralizing raw hospital datasets
Nitro Enclaves only as a future confidential-computing extension unless sufficient time remains
Do not migrate raw simulated hospital datasets into one central S3 bucket merely to say the solution uses AWS.
That would undermine the federated-learning story.

23. DEVELOPMENT WORKFLOW
Work milestone-by-milestone.
For every milestone:
inspect relevant existing code
make the smallest coherent implementation
run tests/lint/type checks relevant to the change
resolve actual failures
update CURRENT_PLAN
summarize what is working and what is not
Do not spend large amounts of time planning after implementation can safely begin.
Do not ask unnecessary questions if a safe, reversible engineering decision can be made from this specification.
When uncertainty affects correctness, verify documentation rather than guessing APIs or library behavior.
Never invent package APIs.

24. FIRST IMPLEMENTATION MILESTONES
Milestone 0 — Repository bootstrap
AGENTS.md
planning/docs files
project structure
environment checks
dependency strategy
Milestone 1 — ML baseline
PneumoniaMNIST loading
deterministic train/test setup
CNN
one successful local training run
Milestone 2 — Hospital simulation
three non-IID partitions
independent local training
baseline metrics
Milestone 3 — Federation
Flower ClientApp/ServerApp or current recommended API
FedAvg
multiple rounds
global metrics
Milestone 4 — Consent
DB model
patient IDs
consent API
training eligibility filter
withdrawal test
Milestone 5 — Differential privacy
Opacus integration
epsilon/delta tracking
DP experiment matrix
Milestone 6 — API/UI
backend endpoints
researcher dashboard
patient portal
charts
real experiment data
Milestone 7 — Attack verification
membership inference
comparison dashboard
Milestone 8 — Integration/polish
errors/loading states
audit timeline
README
deterministic demo script
Milestone 9 — Optional
secure aggregation
Docker
cloud deployment

25. DEFINITION OF MVP DONE
MVP is done only when this sequence can be demonstrated:
Three hospitals have separate non-IID datasets.
Local-only models produce measurable baselines.
Flower trains a federated model.
The dashboard compares local and federated results.
A patient is shown as actively consented.
Their record is included in eligibility.
The patient withdraws consent.
The next training eligibility calculation excludes them.
DP training executes and records ε and δ.
Privacy-vs-utility results are shown using actual experiments.
No UI claim contradicts the implementation.
The entire demo can be started using documented commands.
Membership inference is strongly preferred but comes after these fundamentals are stable.

Begin now.
First perform rep