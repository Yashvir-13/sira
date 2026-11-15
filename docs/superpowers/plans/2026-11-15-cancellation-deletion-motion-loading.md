# Research Lifecycle (Cancel & Delete), Motion Loading, Auth Redirection & Tested Docs Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement research cancellation and deletion, seamless auth redirection with concept draft restoration, motion-powered loading screens, landing page institutional footer, and verified visual documentation in README.

**Architecture:** Maintain an active asyncio task registry in the FastAPI backend for immediate pipeline aborts, apply an Alembic migration for `ResearchStatus.CANCELLED`, add REST endpoints for cancellation and deletion, wire up React Router `?redirect=` state with `sessionStorage` draft persistence, integrate theme-aware Motion loaders and skeletons, and capture live screenshots for an accurate, tested `README.md`.

**Tech Stack:** FastAPI, SQLAlchemy, Alembic, PostgreSQL (Neon), React 19, TypeScript, Tailwind CSS, Motion (`motion/react`), Docker, pnpm.

**Spec:** [`docs/superpowers/specs/2026-11-15-cancellation-deletion-motion-loading-design.md`](file:///d:/Projects/startup-idea-research-agent/docs/superpowers/specs/2026-11-15-cancellation-deletion-motion-loading-design.md)

## Global Constraints

- Never commit `.env` or plaintext secrets.
- Always use `pnpm` as the primary workspace runner (`pnpm dev`, `pnpm db:migrate`, `pnpm db:seed`, `pnpm build:web`, `pnpm lint:web`).
- Always use PostgreSQL `Text` and align Pydantic validation (`max_length=5000`) for concepts and prompts.
- Button styling: strictly high-contrast neutral zinc (`bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900`), zero blue/cyan tint in dark mode.
- Link files using `file://` with forward slashes.

## Review Focus

1. **Cancelling completed/failed research:** Calling `POST /cancel` on an already completed or failed research must return 400 without crashing or corrupting DB state.
2. **Deleting an actively running research:** Calling `DELETE` while analysis is running must cancel the active worker task before removing the row to prevent orphan DB writes.
3. **Session draft restoration:** Entering an idea on `/new` as a guest, logging in via `/login?redirect=%2Fnew`, must restore both `title` and `description` without data loss.
4. **SSE disconnection on cancel:** Stream must terminate cleanly with a `cancelled` event rather than hanging open or throwing unhandled server exceptions.
5. **Theme consistency in loaders:** The new `<BrandedPageLoader>` must respect Light Mode (`#FAFAFA`) and Dark Mode (`#09090B`) with zero blue cast.

---

### Task 1: Database Migration for `ResearchStatus.CANCELLED`

**Files:**
- Modify: `packages/models/research.py:11-16`
- Create: `packages/db/migrations/versions/b314a51e6c88_add_cancelled_status_to_researchstatus.py`
- Test: Database migration command (`pnpm db:migrate`)

**Interfaces:**
- Consumes: PostgreSQL `researchstatus` enum
- Produces: `ResearchStatus.CANCELLED = "cancelled"` enum value

- [ ] **Step 1: Update `ResearchStatus` enum in `packages/models/research.py`**
  Add `CANCELLED = "cancelled"` to the enum.

- [ ] **Step 2: Create Alembic migration file `packages/db/migrations/versions/b314a51e6c88_add_cancelled_status_to_researchstatus.py`**
  Implement `upgrade()` with `op.execute("ALTER TYPE researchstatus ADD VALUE IF NOT EXISTS 'cancelled';")` and empty `downgrade()`.

- [ ] **Step 3: Run database migration**
  Run: `pnpm db:migrate`
  Expected: "Running upgrade a212f22d878f -> b314a51e6c88" with exit code 0.

- [ ] **Step 4: Commit**
  ```bash
  git add packages/models/research.py packages/db/migrations/versions/b314a51e6c88_add_cancelled_status_to_researchstatus.py
  git commit -m "feat(db): add CANCELLED status to researchstatus enum"
  ```

---

### Task 2: Background Task Registry, Cancellation & Deletion Endpoints in API

**Files:**
- Modify: `services/agent/pipeline.py:1-60`
- Modify: `services/api/routes/research.py:1-113`
- Create: `services/api/tests/test_cancel_delete.py`

**Interfaces:**
- Consumes: `ACTIVE_RESEARCH_TASKS: dict[uuid.UUID, asyncio.Task]`, `ResearchStatus.CANCELLED`
- Produces: `POST /api/research/{research_id}/cancel`, `DELETE /api/research/{research_id}`

- [ ] **Step 1: Add active task registry and `asyncio.CancelledError` handling in `services/agent/pipeline.py`**
  - Export `ACTIVE_RESEARCH_TASKS: dict[uuid.UUID, asyncio.Task] = {}`.
  - In `run_research_pipeline`, register current task in registry.
  - In `try...except asyncio.CancelledError`, call `update_research_progress(..., status=ResearchStatus.CANCELLED, current_step="Research pipeline stopped by user.")`.
  - In `finally`, pop research ID from `ACTIVE_RESEARCH_TASKS`.

- [ ] **Step 2: Add `POST /cancel` and `DELETE` endpoints in `services/api/routes/research.py`**
  - `POST /{research_id}/cancel`: verifies ownership/admin, validates status not in `[COMPLETED, FAILED, CANCELLED]`, cancels active task if present, updates record to `CANCELLED`.
  - `DELETE /{research_id}`: verifies ownership/admin, cancels active task if running, executes `await db.delete(record)`.
  - Update `stream_research_progress` loop to break on `ResearchStatus.CANCELLED`.

- [ ] **Step 3: Write tests in `services/api/tests/test_cancel_delete.py`**
  - Test cancellation on in-progress record updates status to `cancelled`.
  - Test cancellation on completed record returns 400.
  - Test deletion removes record from DB.

- [ ] **Step 4: Run backend tests**
  Run: `pytest services/api/tests/test_cancel_delete.py -v`
  Expected: All tests pass.

- [ ] **Step 5: Commit**
  ```bash
  git add services/agent/pipeline.py services/api/routes/research.py services/api/tests/test_cancel_delete.py
  git commit -m "feat(api): add research cancellation and deletion endpoints with active task abort"
  ```

---

### Task 3: Auth Redirection & Draft Restoration

**Files:**
- Modify: `apps/web/src/routes/ProtectedRoute.tsx:1-24`
- Modify: `apps/web/src/components/auth/SigninForm.tsx:1-55`
- Modify: `apps/web/src/routes/NewResearchPage.tsx:15-35`
- Modify: `apps/web/src/components/research/IdeaInputForm.tsx:40-75`

**Interfaces:**
- Consumes: React Router `useSearchParams`, `useLocation`
- Produces: Predictable return routing to `/new` or `/history` after sign-in

- [ ] **Step 1: Update `ProtectedRoute.tsx` to preserve target URL**
  Capture `location.pathname + location.search` and redirect to `/login?redirect=${encodeURIComponent(returnUrl)}`.

- [ ] **Step 2: Update `SigninForm.tsx` to read `redirect` parameter**
  Read `searchParams.get('redirect')` and navigate to `redirectTarget || '/new'` upon successful login.

- [ ] **Step 3: Verify draft persistence in `IdeaInputForm.tsx` and `NewResearchPage.tsx`**
  Verify that when an unauthenticated user submits, `sira_pending_concept` stores title/description, routes to `/login?redirect=%2Fnew`, and loads the saved draft on return.

- [ ] **Step 4: Commit**
  ```bash
  git add apps/web/src/routes/ProtectedRoute.tsx apps/web/src/components/auth/SigninForm.tsx apps/web/src/routes/NewResearchPage.tsx apps/web/src/components/research/IdeaInputForm.tsx
  git commit -m "feat(auth): support dynamic post-login redirect and preserve studio drafts"
  ```

---

### Task 4: Cancellation & Deletion UI in Frontend

**Files:**
- Modify: `apps/web/src/api/research.ts`
- Create: `apps/web/src/components/common/ConfirmDeleteModal.tsx`
- Modify: `apps/web/src/routes/ResearchDetailPage.tsx`
- Modify: `apps/web/src/routes/HistoryPage.tsx`

**Interfaces:**
- Consumes: `researchApi.cancelResearch(id)`, `researchApi.deleteResearch(id)`
- Produces: User-facing Cancel and Delete actions with modals and status badges

- [ ] **Step 1: Add API client methods in `apps/web/src/api/research.ts`**
  Add `cancelResearch: (id: string) => api.post(...)` and `deleteResearch: (id: string) => api.delete(...)`.

- [ ] **Step 2: Create `apps/web/src/components/common/ConfirmDeleteModal.tsx`**
  Accessible modal with stark neutral zinc styling, warning text, "Cancel", and "Delete Permanently" buttons.

- [ ] **Step 3: Update `ResearchDetailPage.tsx` with Cancel and Delete actions**
  - Show "Cancel Research" button while status is `pending` or `processing`.
  - Render `CANCELLED` banner with amber border and preserved partial evidence.
  - Add "Delete Dossier" button in header that triggers modal and navigates to `/history`.

- [ ] **Step 4: Update `HistoryPage.tsx` with card delete actions**
  Add trash icon button to dossier cards and animate removal with `AnimatePresence`.

- [ ] **Step 5: Commit**
  ```bash
  git add apps/web/src/api/research.ts apps/web/src/components/common/ConfirmDeleteModal.tsx apps/web/src/routes/ResearchDetailPage.tsx apps/web/src/routes/HistoryPage.tsx
  git commit -m "feat(ui): add cancel and delete research controls with confirmation modals"
  ```

---

### Task 5: Motion-Powered Global Page Loading & Contextual Skeletons

**Files:**
- Create: `apps/web/src/components/common/BrandedPageLoader.tsx`
- Create: `apps/web/src/components/common/HistorySkeleton.tsx`
- Create: `apps/web/src/components/common/DossierDetailSkeleton.tsx`
- Modify: `apps/web/src/routes/ProtectedRoute.tsx`
- Modify: `apps/web/src/routes/HistoryPage.tsx`
- Modify: `apps/web/src/routes/ResearchDetailPage.tsx`

**Interfaces:**
- Consumes: `motion/react` animation primitives
- Produces: Theme-aware smooth loaders and skeleton placeholders across all routes

- [ ] **Step 1: Create `BrandedPageLoader.tsx`**
  Motion-powered loader with pulsing 'S' brand mark, subtle progress indicator, and monospace status labels.

- [ ] **Step 2: Create `HistorySkeleton.tsx` and `DossierDetailSkeleton.tsx`**
  Shimmering skeleton screens matching card grids and executive reports.

- [ ] **Step 3: Replace raw loading spinners in routes**
  Update `ProtectedRoute.tsx`, `HistoryPage.tsx`, and `ResearchDetailPage.tsx` to use the new loaders and skeletons.

- [ ] **Step 4: Commit**
  ```bash
  git add apps/web/src/components/common/ apps/web/src/routes/ProtectedRoute.tsx apps/web/src/routes/HistoryPage.tsx apps/web/src/routes/ResearchDetailPage.tsx
  git commit -m "feat(motion): add branded page loader and contextual route skeletons"
  ```

---

### Task 6: Landing Page Dead Space Trimming & Multi-Column Institutional Footer

**Files:**
- Create: `apps/web/src/components/landing/LandingFooter.tsx`
- Modify: `apps/web/src/components/landing/ScrollytellingHome.tsx`
- Modify: `apps/web/src/routes/HomePage.tsx`

**Interfaces:**
- Consumes: SIRA navigation routes and system status
- Produces: Institutional footer and compact scroll termination

- [ ] **Step 1: Create `LandingFooter.tsx`**
  Multi-column footer with Brand, Product, Tech Stack, Platform links, live operational status badge, and copyright.

- [ ] **Step 2: Trim trailing spacing in `ScrollytellingHome.tsx` and attach `LandingFooter` in `HomePage.tsx`**
  Remove excess margin at the bottom of the scroller and frame the page cleanly.

- [ ] **Step 3: Commit**
  ```bash
  git add apps/web/src/components/landing/LandingFooter.tsx apps/web/src/components/landing/ScrollytellingHome.tsx apps/web/src/routes/HomePage.tsx
  git commit -m "feat(landing): trim trailing scroll dead space and add institutional footer"
  ```

---

### Task 7: Verified Tested Reproducibility Walkthrough & Screenshots in `README.md`

**Files:**
- Create: `docs/assets/screenshots/landing-dark.png`
- Create: `docs/assets/screenshots/landing-light.png`
- Create: `docs/assets/screenshots/studio-new.png`
- Create: `docs/assets/screenshots/research-streaming.png`
- Create: `docs/assets/screenshots/dossier-report.png`
- Modify: `README.md`

**Interfaces:**
- Consumes: Live browser screenshots and verified shell commands
- Produces: Comprehensive, verified visual `README.md`

- [ ] **Step 1: Capture live UI screenshots using browser subagent**
  Take high-resolution screenshots of the landing page (dark/light), `/new` studio, streaming analysis with Cancel button, and completed dossier report. Save under `docs/assets/screenshots/`.

- [ ] **Step 2: Update `README.md` with verified reproduction steps**
  - Verify SearXNG and Crawl4AI Docker commands.
  - Document `pnpm install`, `pnpm db:migrate`, `pnpm db:seed`, `pnpm dev`.
  - Include test credentials table.
  - Include updated API reference table with `/cancel` and `DELETE`.
  - Embed the captured screenshots.

- [ ] **Step 3: Commit**
  ```bash
  git add docs/assets/screenshots/ README.md
  git commit -m "docs: update README with verified reproducibility walkthrough and screenshots"
  ```

---

### Task 8: Verification & Visual Quality Audit

**Files:**
- All modified components and tests

- [ ] **Step 1: Run linter check**
  Run: `pnpm lint:web`
  Expected: 0 errors.

- [ ] **Step 2: Run production build check**
  Run: `pnpm build:web`
  Expected: Clean build with exit code 0.

- [ ] **Step 3: Live browser end-to-end audit**
  Run browser subagent to verify:
  1. Spacing at bottom of landing page and new footer.
  2. Draft restoration when signing in from `/new`.
  3. Research cancellation button halts streaming and shows cancelled status.
  4. Deletion modal removes dossier.
  5. Motion loaders display smoothly.

- [ ] **Step 4: Final commit and wrap-up**
