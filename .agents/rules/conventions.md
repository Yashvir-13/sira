# Agent Coding & Architecture Rules

1. **Separation of Concerns**:
   - `apps/web`: Frontend only. Keep UI components presentation-focused and business/API logic in `src/api` or `src/hooks`.
   - `services/api`: Thin handlers/controllers routing requests to packages or the agent.
   - `services/agent`: Autonomous research pipelines, LLM prompt orchestrations, and background workers.
   - `packages/`: Reusable, stack-agnostic modules (shared schemas, models, DB connections, utilities).

2. **Environment Variables**:
   - Never hardcode secrets or API keys. Always read from environment variables defined in `.env.example*`.
   - Frontend secrets must NOT be prefixed for client exposure unless explicitly meant to be public.

3. **Modifications & Verification**:
   - Verify code syntax and tests before declaring tasks complete.

