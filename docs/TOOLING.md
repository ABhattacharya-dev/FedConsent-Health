# Local skills and development tools

Inspected 2026-10-07. No global skill or tool configuration was overwritten.

## Repository installation

| Resource | Source / revision | Local location |
| --- | --- | --- |
| Caveman | [JuliusBrussee/caveman](https://github.com/JuliusBrussee/caveman), `99aafe151a1be72be783e662858e8a0955add59f`, `skills/caveman` | `.agents/skills/caveman/` |
| Ponytail | [DietrichGebert/ponytail](https://github.com/DietrichGebert/ponytail), `552acd5efd0aeae2583a12efe39373d2f076f25e`, `skills/ponytail` | `.agents/skills/ponytail/` |
| Ponytail review | Same revision, `skills/ponytail-review` | `.agents/skills/ponytail-review/` |
| RTK | [rtk-ai/rtk](https://github.com/rtk-ai/rtk), existing CLI `0.50.0` | `RTK.md`, `.codex/hooks.json` |
| FastAPI | [fastapi/fastapi](https://github.com/fastapi/fastapi), `fastapi/.agents/skills/fastapi` | `.agents/skills/fastapi/` |
| Security review | [getsentry/skills](https://github.com/getsentry/skills), `skills/security-review` | `.agents/skills/security-review/` |
| Frontend design | [practicalswan/agent-skills](https://github.com/practicalswan/agent-skills), `frontend-design` | `.agents/skills/frontend-design/` |
| Docker build strategies | [docker/skills](https://github.com/docker/skills), `skills/docker-build-strategies` | `.agents/skills/docker-build-strategies/` |

Caveman/Ponytail were installed with the bundled skill-installer helper using immutable revisions and `--dest .agents/skills`. Upstream licenses accompany the skills. Ponytail's top-level `argument-hint` was moved into `metadata` for Codex validator compatibility; instructions are otherwise unchanged. No Caveman proxy, external model endpoint, Ponytail plugin hooks or unrelated modes were installed.

RTK is a CLI, not an installable generic SKILL.md in its repository. Its official `rtk init --codex` integration was installed locally after inspecting the dry run and hook documentation. The generated hook matches Bash and runs `rtk hook codex`; automatic rewriting in this PowerShell desktop session is not verified. Explicit `rtk git status` works and `rtk proxy python -c 'import sys; sys.exit(7)'` preserved exit code 7. RTK still prints a generic missing-hook warning during direct use; do not install global hooks merely to silence it.

New local skills should be discoverable on the next turn. RTK's installer requests a Codex restart and project-hook trust if prompted. Until hook activation is verified, use explicit supported RTK commands. Follow AGENTS.md's full-output/error checks over any blanket upstream suggestion to trust compressed output.

## Environment

| Tool | Observed state |
| --- | --- |
| Git | 2.52.0.windows.1; local author identity already configured; commits work |
| GitHub CLI | 2.102.0; repository API reads work; user configured the GitHub remote and committed the partial implementation |
| Python | 3.14.2 default; project uses uv-managed 3.11.15 in .venv |
| uv | Installed; project environment and uv.lock verified |
| Node / npm | 24.13.1 / 11.8.0 |
| Docker | CLI 29.8.0; Linux engine unavailable during inspection; defer containers |
| NotebookLM CLI | `nlm` 0.12.0; `nlm login --check` succeeds; no notebook content inspected or uploaded |
| RTK | 0.50.0; `rtk gain` confirms token-optimizer CLI |

Project dependencies are installed and locked. Verified application/test commands are in README.md. Docker remains deferred; no notebook data was uploaded. Python package download retries were needed during setup, but installation completed.

## Skill selection

Detected globally: Ponytail plugin 4.13.0 (including review/audit/debt/help modes), system installer/creator skills, many brand UI skills, humanizer and UI-copy/learning-design skills. Caveman was absent from the inspected global skills directory. Keep repository-local copies authoritative for this project.

Use Caveman for concise discussion, Ponytail for minimal implementation and Ponytail review for complexity review. The user subsequently authorized the four targeted skills above. FastAPI guides backend conventions; security-review supports consent/privacy-sensitive review; frontend-design supports functional UX now and visual design only after styling approval; Docker build strategies activates only when containerization begins. UX is worth 15 judging points per the user. No additional skills are needed now.

## Additional skill installation and adaptations

Installed with `skills` CLI 1.7.1 using the user's `npx skills add` commands plus `--agent codex --copy --yes --json`. Scope is project-local. `skills-lock.json` records each upstream source, skill path and content hash; these hashes identify downloaded upstream content, not subsequent local compatibility edits. Git preserves the actual installed files. Do not treat unpinned restore/update commands as immutable reproduction.

Moved frontend-design's `version`, `last_updated` and `tags`, and Docker's `compatibility`, under `metadata` to satisfy the bundled Codex validator. Instruction bodies remain upstream originals. Added upstream root license files for FastAPI and Docker; preserved bundled frontend license/attribution files and Sentry's OWASP CC BY-SA notice.

Inspected entrypoints and bundled helper scripts. No new hooks or MCP connections were registered. Docker's helper builds an image and inspects its size/user; it was not executed. Frontend's contrast helper is a local calculation utility. Related skills referenced upstream are optional and were not installed; some Sentry language/infrastructure references are absent upstream in this selected package, while Python, JavaScript and Docker guides are present.

The installer's external assessments were mixed for Sentry security-review (Gen: Critical Risk, Socket: 1 alert, Snyk: Low Risk); the summary did not give a cause. The package contains review documentation and illustrative vulnerable code, with no executable helper or hook. This inspection does not resolve the external alert. AGENTS.md explicitly overrides its exclusion of authenticated code paths: authenticated authorization/consent bypasses still require review. It also preserves SQLAlchemy over the FastAPI skill's SQLModel preference and keeps visual styling/Docker execution gated. Skill installation is not evidence of application security or DP correctness.
