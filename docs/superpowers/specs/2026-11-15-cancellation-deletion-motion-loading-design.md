# Specification: Research Lifecycle (Cancel & Delete), Motion Loading, Auth Redirection, & Tested Documentation

**Author:** Antigravity  
**Date:** 2026-11-15  
**Status:** Approved  
**Classification:** Architectural  

---

## 1. Overview & Goals

This specification details the design and implementation for 5 key capabilities across the SIRA platform:
1. **Research Lifecycle Management:** Adding the ability to cancel an in-flight background research pipeline immediately (`POST /api/research/{id}/cancel`), and permanently delete research dossiers (`DELETE /api/research/{id}`) from both the detail view and history archive.
2. **Seamless Auth Redirection & Draft Persistence:** Preserving intended destinations (`?redirect=...`) across login/signup so unauthenticated users who draft concepts on `/new` or visit `/history` are returned to their target page with their drafted inputs intact.
3. **Motion-Powered Loading Screens & Skeletons:** Replacing basic spinners and hardcoded dark screens with a branded `<BrandedPageLoader>` and contextual skeleton components (`<HistorySkeleton>`, `<DossierDetailSkeleton>`) using `motion/react`.
4. **Landing Page Spacing & Institutional Footer:** Trimming trailing empty scroll space on the scrollytelling landing page and introducing a multi-column `<LandingFooter>` with system health, technology stack, and platform navigation.
5. **Tested Reproducibility & Visual Documentation:** Providing verified, tested step-by-step reproduction instructions in `README.md` and embedding high-resolution screenshots of the UI.

---

## 2. Architecture & Data Contracts

### 2.1 Database Schema & Enums (`packages/models/research.py`)

- Update `ResearchStatus` enum to include `CANCELLED = "cancelled"`.
  ```python
  class ResearchStatus(str, enum.Enum):
      PENDING = "pending"
      PROCESSING = "processing"
      COMPLETED = "completed"
      FAILED = "failed"
      CANCELLED = "cancelled"
  ```
- **Alembic Migration:**
  - Create migration `packages/db/migrations/versions/<id>_add_cancelled_status_to_researchstatus.py`.
  - Upgrades PostgreSQL enum:
    ```sql
    ALTER TYPE researchstatus ADD VALUE IF NOT EXISTS 'cancelled';
    ```

### 2.2 Active Task Registry & Cancellation Engine (`services/agent/pipeline.py`)

- Track active in-flight research background tasks:
  ```python
  ACTIVE_RESEARCH_TASKS: dict[uuid.UUID, asyncio.Task] = {}
  ```
- In `run_research_pipeline`:
  - Registers `asyncio.current_task()` into `ACTIVE_RESEARCH_TASKS`.
  - Handles `asyncio.CancelledError` gracefully:
    ```python
    except asyncio.CancelledError:
        await update_research_progress(
            research_id=research_id,
            status=ResearchStatus.CANCELLED,
            current_step="Research pipeline cancelled by user.",
            progress=progress
        )
        raise
    finally:
        ACTIVE_RESEARCH_TASKS.pop(research_id, None)
    ```

### 2.3 API Gateway Endpoints (`services/api/routes/research.py`)

1. **`POST /api/research/{research_id}/cancel`**
   - **Authentication:** `get_current_user` (Bearer JWT).
   - **Authorization:** `current_user.id == record.user_id` or `current_user.role == UserRole.ADMIN`.
   - **Validation:** If `record.status` in `[COMPLETED, FAILED, CANCELLED]`, raise `400 Bad Request` ("Cannot cancel research in terminal state").
   - **Execution:**
     - If task in `ACTIVE_RESEARCH_TASKS`, invoke `task.cancel()`.
     - Update database record: `status = ResearchStatus.CANCELLED`, `current_step = "Research cancelled by user."`.
     - Return `{ "success": True, "message": "Research pipeline cancelled successfully.", "research_id": str(research_id) }`.

2. **`DELETE /api/research/{research_id}`**
   - **Authentication:** `get_current_user` (Bearer JWT).
   - **Authorization:** `current_user.id == record.user_id` or `current_user.role == UserRole.ADMIN`.
   - **Execution:**
     - If actively running in `ACTIVE_RESEARCH_TASKS`, cancel the task first.
     - Execute `await db.delete(record)` and `await db.commit()`.
     - Return `{ "success": True, "message": "Research dossier deleted successfully." }`.

3. **SSE Stream Updates (`GET /api/research/{research_id}/stream`)**
   - Stream break condition updated to include `ResearchStatus.CANCELLED`:
     ```python
     if record.status in [ResearchStatus.COMPLETED, ResearchStatus.FAILED, ResearchStatus.CANCELLED]:
         break
     ```

---

## 3. Frontend Architecture & User Experience

### 3.1 Auth Redirection & Concept Draft Restoration

1. **`ProtectedRoute.tsx`:**
   - Detects missing token/user and redirects with query parameter:
     ```tsx
     const location = useLocation();
     if (!token || !user) {
       const redirectUrl = encodeURIComponent(location.pathname + location.search);
       return <Navigate to={`/login?redirect=${redirectUrl}`} replace />;
     }
     ```
2. **`SigninForm.tsx`:**
   - Reads `searchParams.get('redirect')`.
   - After calling `login(token, user)`:
     - Navigates to `decodeURIComponent(redirectParam)` if valid and internal.
     - Default fallback if empty: `/new`.
3. **`NewResearchPage.tsx` & `IdeaInputForm.tsx`:**
   - Unauthenticated submit stores draft in `sessionStorage.setItem('sira_pending_concept', JSON.stringify(data))` and navigates to `/login?redirect=/new`.
   - When user returns to `/new` authenticated, `IdeaInputForm` automatically loads the draft from `sessionStorage`.

### 3.2 Cancellation & Deletion UI

1. **`ResearchDetailPage.tsx`:**
   - When `status === 'pending' || status === 'processing'`:
     - Displays a red-bordered, subtle red hover "Cancel Research" button with `XCircle` icon.
     - Clicking calls `researchApi.cancelResearch(id)`.
     - UI displays a `CANCELLED` badge, keeps partial data gathered up to that point, and renders an informational banner: *"Analysis cancelled by user. Partial evidence preserved."*
   - Top action bar includes a "Delete Dossier" button with `Trash2` icon.
   - Clicking opens `<ConfirmDeleteModal>`. Upon confirmation, calls `researchApi.deleteResearch(id)` and redirects to `/history`.
2. **`HistoryPage.tsx`:**
   - Each history card features a subtle trash icon button.
   - Confirmation modal prevents accidental deletion.
   - Upon deletion, card is removed using `motion.div` exit animations (`opacity: 0, scale: 0.95`).

### 3.3 Motion-Powered Loading Screens & Skeletons

1. **`<BrandedPageLoader>` (`apps/web/src/components/common/BrandedPageLoader.tsx`):**
   - Replaces hardcoded dark screens. Fully theme-aware (`bg-background text-primary`).
   - Displays a pulsing geometric 'S' mark, spinning accent ring, and status label in monospace font.
   - Uses `motion` with smooth entry and exit opacity transitions.
2. **Contextual Skeletons:**
   - `<HistorySkeleton>`: Shimmering grid cards with pulse animations.
   - `<DossierDetailSkeleton>`: Shimmering header, KPI row, and tab containers.

### 3.4 Landing Page Dead Space & Institutional Footer

1. **Spacing Adjustments (`ScrollytellingHome.tsx`):**
   - Normalize bottom padding and margin between Chapter 4 (Conversion Banner) and the footer.
2. **`<LandingFooter>` (`apps/web/src/components/landing/LandingFooter.tsx`):**
   - Brand column: SIRA logo, version `v2.4.0`, tagline.
   - Navigation columns:
     - **Product:** Research Studio (`/new`), Autonomous Pipeline (`/#pipeline`), Dossier Archive (`/history`).
     - **Technology:** SearXNG Metasearch, TypeSafe Jev, Crawl4AI Headless, Anthropic Claude 3.5.
     - **Platform:** System Architecture (`AGENTS.md`), GitHub Repository, REST API Docs (`http://localhost:8000/docs`).
   - Bottom status line: *"System Status: All Engines Operational"*, Copyright © 2026 SIRA.

---

## 4. Documentation & Tested Reproducibility

### 4.1 Reproducibility Instructions (`README.md`)
- Provide a clean, verified step-by-step walkthrough:
  1. Prerequisites (Node 20, Python 3.12, Docker).
  2. Starting SearXNG (`:8080`) and Crawl4AI (`:11235`) with verified copy-paste commands for PowerShell and Bash.
  3. Environment variables configuration.
  4. Running Alembic migrations (`pnpm db:migrate`) and user seeds (`pnpm db:seed`).
  5. Starting the services with `pnpm dev`.
  6. Testing the pipeline, cancellation, and deletion flows.
  7. Test credentials table with Google/Microsoft Authenticator guidance.
  8. Full API endpoints table including `/research/{id}/cancel` and `DELETE /research/{id}`.

### 4.2 UI Screenshots (`docs/assets/screenshots/`)
- Capture 5 high-resolution screenshots from the running app:
  1. `landing-dark.png` — Dark mode landing page.
  2. `landing-light.png` — Light mode landing page.
  3. `studio-new.png` — Dedicated `/new` studio with preset chips.
  4. `research-streaming.png` — Live research streaming progress with Cancel button.
  5. `dossier-report.png` — Complete institutional dossier report with charts.
- Embed in `README.md` with responsive markdown rendering.

---

## 5. Verification Plan

1. **Backend Verification:**
   - Run Alembic migration and verify `cancelled` exists in `researchstatus` type.
   - Test `POST /api/research/{id}/cancel` on a running research task and verify DB status transitions to `cancelled` and background task aborts.
   - Test `DELETE /api/research/{id}` and verify record is removed from DB.
2. **Frontend Verification:**
   - Test `/new` unauthenticated submit &rarr; `/login?redirect=%2Fnew` &rarr; login &rarr; redirected back to `/new` with draft intact.
   - Test `/history` unauthenticated click &rarr; `/login?redirect=%2Fhistory` &rarr; login &rarr; redirected back to `/history`.
   - Verify cancellation button halts progress bar and shows `CANCELLED` banner.
   - Verify deletion modal deletes dossier from detail view and history grid.
   - Run `pnpm lint:web` and `pnpm build:web` with 0 errors.
   - Verify landing page footer renders and excessive dead space is eliminated.
