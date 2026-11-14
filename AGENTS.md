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
3. **Execution Tooling (`pnpm` First)**:
   - Use `pnpm` as the primary workspace runner for all tasks:
     - `pnpm dev`: Runs API (`:8000`) and Web (`:5173`) concurrently.
     - `pnpm dev:api`: Starts FastAPI server via `scripts/py.js` (auto-binds to `.venv`).
     - `pnpm dev:web`: Starts Vite frontend.
     - `pnpm db:migrate`: Applies Alembic database migrations.
     - `pnpm db:seed`: Seeds test users and TOTP credentials.
     - `pnpm build`: Production build and type checks.
   - Standalone runner scripts (`./scripts/run.ps1` / `./scripts/run.sh`) remain supported secondary fallbacks.
4. **Database & Input Invariants**:
   - Never restrict user-authored concepts, strategic briefs, prompts, or error logs to `VARCHAR(1000)`.
   - Always use PostgreSQL `Text` (SQLAlchemy `Text`) and align Pydantic validation (`max_length=5000`) and client textarea limits.
5. **LLM & Agent Pipelines**:
   - In Anthropic SDK (`v2.8.0+`), omit `temperature` from `client.messages.create` calls.
   - For structured JSON outputs, allocate `max_tokens >= 8192` and instruct the model in prompt to limit arrays (3–5 items) to prevent mid-token truncation.
6. **Frontend Styling Invariant**:
   - When configuring Tailwind CSS in `apps/web/`, verify that `src/index.css` imports `@tailwind base; @tailwind components; @tailwind utilities;` to prevent unstyled browser default fallbacks.
