# AGENTS.md - Repository Source of Truth for Coding Agents

Welcome to the **Startup Idea Research Agent** repository.

## Architecture & Layout

This project is a monorepo structured into four primary zones:
- `apps/web/`: Deployable frontend application (React / Next.js / Vue).
- `services/api/`: Primary HTTP REST/GraphQL API gateway.
- `services/agent/`: AI Research agent service (LLM pipelines, scraper/search workers, analysis engines).
- `packages/`: Shared libraries (`models/`, `lib/`, `db/`).

## Agent Ground Rules

1. **Follow Directory Responsibilities**:
   - Place database schemas, migrations, and seeds in `packages/db/`.
   - Place data contracts, types, and domain models in `packages/models/`.
   - Keep `services/api/routes` controllers thin; delegate domain logic to `packages/lib/` or `services/agent/`.
2. **Configuration & Secrets**:
   - Refer to `.env.example`, `.env.example.api`, and `.env.example.web` for expected environment variables.
   - Never commit `.env` or plain-text secrets into version control.
3. **Execution Scripts**:
   - Use `./scripts/run.ps1` (Windows) or `./scripts/run.sh` (POSIX) for local operations.

