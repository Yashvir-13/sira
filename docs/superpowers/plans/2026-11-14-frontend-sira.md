# SIRA Frontend Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and integrate the complete web frontend application for SIRA (Startup Idea Research Agent) in `apps/web/`, delivering split-screen 2-factor authentication, research submission studio, real-time Server-Sent Events (SSE) progress streaming, and executive Recharts data visualizations.

**Architecture:** A modern single-page application built with React 19, React Router DOM v7, and Tailwind CSS. The app uses an authenticated Axios client with automatic Bearer token injection, an `AuthContext` for JWT lifecycle management, a persistent App Shell with collapsible sidebar, an EventSource hook for SSE live updates, and composable Recharts components for venture insights.

**Tech Stack:** React 19, TypeScript, Vite, Tailwind CSS, Recharts, Lucide Icons, Axios, React Router DOM.

**Spec:** [`docs/superpowers/specs/2026-11-14-frontend-design.md`](file:///d:/Projects/startup-idea-research-agent/docs/superpowers/specs/2026-11-14-frontend-design.md)

## Global Constraints
- Target workspace: `apps/web/`
- Visual Theme: Calm Executive Dark (`#090a0f` canvas, `#12131a` card surfaces, `border-zinc-800` hairline dividers, zero neon, zero cyberpunk glows)
- Port Alignment: Frontend runs on `http://localhost:5173`, proxying API calls to `http://localhost:8000`
- Role Protection: Routes and actions strictly enforce `MEMBER` vs `ADMIN` roles
- Secrets & Tokens: Store JWT access token in `localStorage.getItem("token")`; never commit raw credentials to version control

## Review Focus
1. **Clock Drift / TOTP formatting:** The 6-digit TOTP input must accept exactly 6 numeric digits and strip accidental whitespace or letters before sending to `/auth/signup/step2` or `/auth/signin`.
2. **SSE Auto-Reconnection & Clean Termination:** The EventSource stream must cleanly terminate when `status === 'completed'` or `status === 'failed'` to avoid infinite polling or memory leaks.
3. **Recharts Responsive Container sizing:** All Recharts charts must be wrapped with `<ResponsiveContainer width="100%" height={...}>` to prevent zero-width render collisions in flex/grid layouts.
4. **401 Eviction Guard:** When any API request receives `401 Unauthorized`, `AuthContext` must purge the expired token and redirect the user to `/login`.
5. **Empty State & Fallbacks:** Research reports with missing or null competitor lists, market sizes, or citations must render graceful empty state indicators rather than crashing the page.

---

### Task 1: TypeScript Contracts & HTTP API Client

**Files:**
- Create: `apps/web/src/types/index.ts`
- Create: `apps/web/src/api/client.ts`
- Create: `apps/web/src/api/auth.ts`
- Create: `apps/web/src/api/research.ts`

**Interfaces:**
- Consumes: Backend schemas in `packages/models/schemas.py`
- Produces: `apiClient`, `authApi`, `researchApi`, TypeScript domain models (`User`, `ResearchItem`, `ReportData`)

- [ ] **Step 1: Define TypeScript contracts in `apps/web/src/types/index.ts`**
  Declare `UserRole` (`'member' | 'admin'`), `UserResponse`, `SigninResponse`, `SignupStep1Response`, `ResearchStatus`, `ResearchItem`, and `ReportData` matching backend schemas.
- [ ] **Step 2: Implement Axios HTTP client in `apps/web/src/api/client.ts`**
  Configure Axios with `baseURL: 'http://localhost:8000'`, request interceptor attaching `Authorization: Bearer <token>`, and response interceptor dispatching auth eviction on `401`.
- [ ] **Step 3: Implement Auth endpoints in `apps/web/src/api/auth.ts`**
  Implement `signupStep1`, `signupStep2`, `signin`, and `getMe`.
- [ ] **Step 4: Implement Research endpoints in `apps/web/src/api/research.ts`**
  Implement `startResearch`, `getResearchDetail`, `getResearchHistory`, and `getAllResearchAdmin`.
- [ ] **Step 5: Verify build**
  Run `pnpm --filter web build` to verify type checking passes.

---

### Task 2: Auth State, Session Persistence & Route Guards

**Files:**
- Create: `apps/web/src/state/AuthContext.tsx`
- Create: `apps/web/src/routes/ProtectedRoute.tsx`
- Create: `apps/web/src/routes/AdminRoute.tsx`

**Interfaces:**
- Consumes: `authApi`, `UserResponse` from Task 1
- Produces: `useAuth()` hook, `<ProtectedRoute>`, `<AdminRoute>`

- [ ] **Step 1: Implement `AuthContext.tsx`**
  Manage `token`, `user`, and `isLoading`. On mount, inspect `localStorage.getItem("token")` and validate via `getMe()`. Expose `login(token, user)` and `logout()`.
- [ ] **Step 2: Implement `<ProtectedRoute>`**
  Redirect unauthenticated visitors (`!token && !isLoading`) to `/login`.
- [ ] **Step 3: Implement `<AdminRoute>`**
  Allow access only if `user?.role === 'admin'`; otherwise redirect to `/`.
- [ ] **Step 4: Verify build**
  Run `pnpm --filter web build` to ensure no lint or type errors.

---

### Task 3: Split-Screen Authentication Views

**Files:**
- Create: `apps/web/src/components/auth/SplitAuthLayout.tsx`
- Create: `apps/web/src/components/auth/SigninForm.tsx`
- Create: `apps/web/src/components/auth/SignupStep1Form.tsx`
- Create: `apps/web/src/components/auth/SignupStep2Form.tsx`
- Create: `apps/web/src/routes/LoginPage.tsx`
- Create: `apps/web/src/routes/SignupPage.tsx`

**Interfaces:**
- Consumes: `useAuth()`, `authApi` from Task 1 & 2
- Produces: User authentication pages with 2-step TOTP enrollment and login

- [ ] **Step 1: Implement `SplitAuthLayout.tsx`**
  Left hero pane highlighting SIRA features; Right container hosting the dynamic auth form.
- [ ] **Step 2: Implement `SignupStep1Form.tsx` and `SignupStep2Form.tsx`**
  Step 1 collects email and matching passwords; Step 2 displays base64 QR code and 6-digit TOTP code input.
- [ ] **Step 3: Implement `SigninForm.tsx`**
  Collects email, password, and 6-digit TOTP code; stores JWT on success.
- [ ] **Step 4: Connect `/login` and `/signup` in `LoginPage.tsx` and `SignupPage.tsx`**
- [ ] **Step 5: Verify build**
  Run `pnpm --filter web build` to confirm build succeeds.

---

### Task 4: App Shell & Responsive Sidebar Navigation

**Files:**
- Create: `apps/web/src/components/layout/Sidebar.tsx`
- Create: `apps/web/src/components/layout/AppLayout.tsx`
- Modify: `apps/web/src/App.tsx`

**Interfaces:**
- Consumes: `useAuth()` from Task 2
- Produces: Persistent shell for all protected pages

- [ ] **Step 1: Implement `Sidebar.tsx`**
  Collapsible navigation with links for `+ New Research`, `Research History`, and conditional `Admin Console` (only for admin role). Bottom user card with role pill and signout button.
- [ ] **Step 2: Implement `AppLayout.tsx`**
  Renders Sidebar and `<Outlet />` inside the calm dark canvas (`bg-[#090a0f]`).
- [ ] **Step 3: Wire up router in `apps/web/src/App.tsx`**
  Mount `/login`, `/signup`, `/`, `/research/:id`, `/history`, and `/admin`.
- [ ] **Step 4: Verify build**
  Run `pnpm --filter web build` to verify layout compiles cleanly.

---

### Task 5: Research Studio View (`HomePage.tsx`)

**Files:**
- Create: `apps/web/src/components/research/IdeaInputForm.tsx`
- Create: `apps/web/src/routes/HomePage.tsx`

**Interfaces:**
- Consumes: `researchApi.startResearch`
- Produces: Research submission studio navigating to `/research/:id` on submit

- [ ] **Step 1: Implement `IdeaInputForm.tsx`**
  Idea title input, concept description textarea with character counter, preset category chips, and validation.
- [ ] **Step 2: Implement `HomePage.tsx`**
  Mounts the form inside an executive studio hero card. Calls `startResearch` and navigates to `/research/${research_id}`.
- [ ] **Step 3: Verify build**
  Run `pnpm --filter web build`.

---

### Task 6: Real-time Pipeline Progress Stepper (SSE)

**Files:**
- Create: `apps/web/src/components/research/PipelineStepper.tsx`

**Interfaces:**
- Consumes: Server-Sent Events from `http://localhost:8000/research/:id/stream?token=<token>`
- Produces: Real-time progress bar, animated stage stepper, and auto-completion trigger

- [ ] **Step 1: Implement `PipelineStepper.tsx`**
  Initialize `EventSource` with the auth token. Parse `{ status, current_step, progress, error_message }`.
- [ ] **Step 2: Add 4-milestone visual stepper**
  Render stages: SearXNG Search (15%) &rarr; Jev Classification (40%) &rarr; Crawl4AI Scraping (65%) &rarr; Claude Synthesis (85%).
- [ ] **Step 3: Implement completion transition**
  When `status === 'completed'`, close the EventSource and notify parent component to fetch the finished report. Handle `status === 'failed'` with retry button.
- [ ] **Step 4: Verify build**
  Run `pnpm --filter web build`.

---

### Task 7: Recharts Visualizations & Executive Report View

**Files:**
- Create: `apps/web/src/components/research/ViabilityGauge.tsx`
- Create: `apps/web/src/components/research/MarketSizeChart.tsx`
- Create: `apps/web/src/components/research/CompetitorTable.tsx`
- Create: `apps/web/src/components/research/SwotGrid.tsx`
- Create: `apps/web/src/components/research/PainPointsList.tsx`
- Create: `apps/web/src/components/research/RiskMitigationMap.tsx`
- Create: `apps/web/src/components/research/CitationsList.tsx`
- Create: `apps/web/src/routes/ResearchDetailPage.tsx`

**Interfaces:**
- Consumes: `ReportData`, `ResearchItem`
- Produces: Complete research analysis dashboard at `/research/:id`

- [ ] **Step 1: Implement `ViabilityGauge.tsx` and `MarketSizeChart.tsx`**
  Circular viability badge (0-100) and Recharts Composed/Bar chart for TAM, SAM, and SOM with currency formatting.
- [ ] **Step 2: Implement `CompetitorTable.tsx` and `SwotGrid.tsx`**
  Competitor table with threat pills and 2x2 SWOT quadrant cards.
- [ ] **Step 3: Implement `PainPointsList.tsx`, `RiskMitigationMap.tsx`, and `CitationsList.tsx`**
  Pain points list, operational risks with Claude mitigations, and citations table with external links.
- [ ] **Step 4: Implement `ResearchDetailPage.tsx`**
  Toggles between `<PipelineStepper>` (if processing/pending) and the full Executive Report (if completed).
- [ ] **Step 5: Verify build**
  Run `pnpm --filter web build`.

---

### Task 8: Research History & Admin Console

**Files:**
- Create: `apps/web/src/routes/HistoryPage.tsx`
- Create: `apps/web/src/components/admin/KpiCards.tsx`
- Create: `apps/web/src/components/admin/GlobalResearchFeed.tsx`
- Create: `apps/web/src/components/admin/UserRoster.tsx`
- Create: `apps/web/src/routes/AdminPage.tsx`

**Interfaces:**
- Consumes: `getResearchHistory()`, `getAllResearchAdmin()`
- Produces: Member archive at `/history` and Admin hub at `/admin`

- [ ] **Step 1: Implement `HistoryPage.tsx`**
  Table of user's past research with status badges, viability scores, and direct "View Report" links.
- [ ] **Step 2: Implement `KpiCards.tsx`, `GlobalResearchFeed.tsx`, and `UserRoster.tsx`**
  Admin dashboard metrics, platform-wide research feed, and user management table.
- [ ] **Step 3: Implement `AdminPage.tsx`**
  Mounts KPI cards and tabbed admin tables protected by `<AdminRoute>`.
- [ ] **Step 4: Verify build**
  Run `pnpm --filter web build`.

---

### Task 9: Production Build & End-to-End Integration Verification

**Files:**
- Modify: `apps/web/package.json` (ensure build & dev scripts)
- Modify: Root `scripts/run.ps1`

- [ ] **Step 1: Full production build test**
  Run `pnpm --filter web build` to verify 0 TypeScript, JSX, or bundling errors.
- [ ] **Step 2: Test script runner integration**
  Verify `.\scripts\run.ps1 dev:web` and `.\scripts\run.ps1 dev:api` run cleanly.
- [ ] **Step 3: Commit and push**
  Commit all frontend implementations and push to `https://github.com/Yashvir-13/sira`.
