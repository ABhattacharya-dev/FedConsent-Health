# FedConsent Health

## Platform
Web. Local React/Vite/TypeScript interface backed by the existing FastAPI service.

## Users and purpose
Hospital research teams inspecting consent-aware federated pneumonia experiments. The simulated patient portal lets users change future eligibility and inspect audit receipts. This purpose was explicitly selected by the user.

## Constraints and evidence
Public-data educational prototype, three logical hospital partitions in one trusted process. Actual saved metrics only. Record-level DP with per-run accounting limits; withdrawal affects future snapshots and does not remove past influence. No clinical, compliance or authentication claims. See AGENTS.md, docs/PROJECT_BRIEF.md and .agent/CURRENT_PLAN.md for authoritative implementation context.

## Current request
Redesign the existing UI using the user's five Mira screenshots: soft white surfaces, rounded cards/pills, blue-teal visual accents and dark evidence panels. Preserve functionality; responsive layout; no automated tests requested. No new backend scope.
