# Local skills and development tools

Inspected 2026-10-07. No global skill or tool configuration was overwritten.

## Repository installation

| Resource | Source / revision | Local location |
| --- | --- | --- |
| Caveman | [JuliusBrussee/caveman](https://github.com/JuliusBrussee/caveman), `99aafe151a1be72be783e662858e8a0955add59f`, `skills/caveman` | `.agents/skills/caveman/` |
| Ponytail | [DietrichGebert/ponytail](https://github.com/DietrichGebert/ponytail), `552acd5efd0aeae2583a12efe39373d2f076f25e`, `skills/ponytail` | `.agents/skills/ponytail/` |
| Ponytail review | Same revision, `skills/ponytail-review` | `.agents/skills/ponytail-review/` |
| RTK | [rtk-ai/rtk](https://github.com/rtk-ai/rtk), existing CLI `0.50.0` | `RTK.md`, `.codex/hooks.json` |

Caveman/Ponytail were installed with the bundled skill-installer helper using immutable revisions and `--dest .agents/skills`. Upstream licenses accompany the skills. Ponytail's top-level `argument-hint` was moved into `metadata` for Codex validator compatibility; instructions are otherwise unchanged. No Caveman proxy, external model endpoint, Ponytail plugin hooks or unrelated modes were installed.

RTK is a CLI, not an installable generic SKILL.md in its repository. Its official `rtk init --codex` integration was installed locally after inspecting the dry run and hook documentation. The generated hook matches Bash and runs `rtk hook codex`; automatic rewriting in this PowerShell desktop session is not verified. Explicit `rtk git status` works and `rtk proxy python -c 'import sys; sys.exit(7)'` preserved exit code 7. RTK still prints a generic missing-hook warning during direct use; do not install global hooks merely to silence it.

New local skills should be discoverable on the next turn. RTK's installer requests a Codex restart and project-hook trust if prompted. Until hook activation is verified, use explicit supported RTK commands. Follow AGENTS.md's full-output/error checks over any blanket upstream suggestion to trust compressed output.

## Environment

| Tool | Observed state |
| --- | --- |
| Git | 2.52.0.windows.1; local author identity already configured; commits work |
| GitHub CLI | 2.102.0; repository API reads work; no remote configured or pushed |
| Python | 3.14.2 default; uv-managed 3.12.13 also present; required 3.11 not yet installed |
| uv | Installed; used for future project-specific Python/dependency management |
| Node / npm | 24.13.1 / 11.8.0 |
| Docker | CLI 29.8.0; Linux engine unavailable during inspection; defer containers |
| NotebookLM CLI | `nlm` 0.12.0; `nlm login --check` succeeds; no notebook content inspected or uploaded |
| RTK | 0.50.0; `rtk gain` confirms token-optimizer CLI |

`.python-version` pins the intended interpreter, but does not install it. Before milestone 1, provision Python 3.11 with uv, create `.venv`, verify library/platform compatibility and commit an appropriate dependency lock. There are no application test commands yet.

## Skill selection

Detected globally: Ponytail plugin 4.13.0 (including review/audit/debt/help modes), system installer/creator skills, many brand UI skills, humanizer and UI-copy/learning-design skills. Caveman was absent from the inspected global skills directory. Keep repository-local copies authoritative for this project.

Use Caveman for concise discussion, Ponytail for minimal implementation and Ponytail review for complexity review. No additional skill installation is currently needed. Later, a narrowly scoped FastAPI/pytest or security-review skill could help if repeated workflow gaps emerge; official framework documentation and critical tests are sufficient initially. Defer brand/design skills until styling is authorized. Docker skills, cloud/deployment plugins and broad audit modes are unnecessary during bootstrap.
