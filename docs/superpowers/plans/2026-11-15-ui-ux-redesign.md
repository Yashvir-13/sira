# SIRA UI/UX Redesign & Scrollytelling Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform SIRA's frontend into an investment-grade venture intelligence platform with light/dark theme tokens, a 5-chapter scrollytelling home page, a collapsible sidebar and topbar shell, and a 4-tab executive research dossier featuring Recharts visualizations.

**Architecture:** Define semantic CSS variable tokens for Light Mode ("Ivory Executive Studio") and Dark Mode ("Obsidian Editorial") mapped in Tailwind CSS. Establish a persistent `ThemeContext` managing `.dark` class state on `<html>`. Build a modular layout shell featuring a collapsible sidebar (240px to 64px rail) and sticky topbar. Construct the scrollytelling landing page with lightweight `IntersectionObserver` chapter tracking, and restructure the research report view into a 4-tab dossier (Overview, Market & Competitors, Strategy & Risks, Sources & Evidence) with theme-aware Recharts components.

**Tech Stack:** React 19, TypeScript, Tailwind CSS 3.4, Recharts 3.10, Lucide React, Axios, React Router 7, Vite 8.

**Spec:** [docs/superpowers/specs/2026-11-15-ui-ux-redesign-design.md](file:///d:/Projects/startup-idea-research-agent/docs/superpowers/specs/2026-11-15-ui-ux-redesign-design.md)

## Global Constraints

- **Theme Consistency:** Light Mode and Dark Mode must be supported everywhere via CSS variables with zero unstyled flashes.
- **Copy & Tone:** Zero AI verbosity, marketing hyperbole, or pretentious text; copy must be calm, direct, and factual.
- **Backend Stability:** Preserve all existing REST endpoints, SSE streaming interfaces, and data models without changes to backend contracts.
- **Build Cleanliness:** `pnpm build` (`tsc -b && vite build`) and `pnpm lint:web` (`oxlint`) must pass with zero errors at every task.
- **Accessibility & Contrast:** All text must meet WCAG AA contrast against its respective light/dark surface tokens.

## Review Focus

1. **Theme Switch Flash / Persistence Failure:** Toggling theme must immediately update DOM class `.dark` on `document.documentElement` and persist in `localStorage` without a white flash on refresh.
2. **Scrollytelling Sticky Desync:** On viewport resizing or rapid scrolling, the sticky pipeline spine in Chapter 3 must not overlap subsequent chapters or cause layout overflow.
3. **Recharts Light/Dark Color Contrast:** Switching themes while viewing a report must immediately update Recharts grid lines, tick labels, and tooltip backgrounds without requiring a component unmount.
4. **SSE Progress Stream Handoff:** In `/research/:id`, the live 4-step pipeline monitor must transition seamlessly into the Tabbed Dossier upon job completion without losing report state.
5. **Mobile Navigation Overlap:** On small screens (<768px), the collapsible sidebar must become a modal overlay drawer that closes on route change, avoiding viewport clipping.

---

### Task 1: Semantic Theme System & Dual Theme Context (Light/Dark Tokens)

**Files:**
- Create: `apps/web/src/state/ThemeContext.tsx`
- Create: `apps/web/src/test/theme.test.ts`
- Modify: `apps/web/src/index.css`
- Modify: `apps/web/tailwind.config.js`
- Modify: `apps/web/src/App.tsx`

**Interfaces:**
- Consumes: `localStorage` browser API, `document.documentElement.classList`.
- Produces:
  ```typescript
  export type Theme = 'light' | 'dark';
  export interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
    setTheme: (theme: Theme) => void;
  }
  export const useTheme = (): ThemeContextType;
  export const ThemeProvider: React.FC<{ children: React.ReactNode }>;
  ```

- [x] **Step 1: Write failing unit test for Theme logic in `apps/web/src/test/theme.test.ts`**
- [x] **Step 2: Run test to verify it passes in Node 22**
- [x] **Step 3: Define semantic CSS variable tokens in `apps/web/src/index.css`**
- [x] **Step 4: Map semantic tokens in `apps/web/tailwind.config.js`**
- [x] **Step 5: Implement `ThemeContext.tsx` and integrate into `apps/web/src/App.tsx`**
- [x] **Step 6: Verify build and commit**

Run: `pnpm build:web`
Expected: PASS with 0 errors
```bash
git add apps/web/src/state/ThemeContext.tsx apps/web/src/test/theme.test.ts apps/web/src/index.css apps/web/tailwind.config.js apps/web/src/App.tsx
git commit -m "feat(theme): implement semantic design tokens and theme context"
```

---

### Task 2: Application Shell Layout (Collapsible Sidebar, Topbar & Breadcrumbs)

**Files:**
- Create: `apps/web/src/components/layout/TopNavbar.tsx`
- Modify: `apps/web/src/components/layout/Sidebar.tsx`
- Modify: `apps/web/src/components/layout/AppLayout.tsx`

**Interfaces:**
- Consumes: `useTheme` from `../state/ThemeContext`, `useAuth` from `../state/AuthContext`, `useLocation` from `react-router-dom`.
- Produces:
  ```typescript
  export const TopNavbar: React.FC<{ onToggleSidebar: () => void; isSidebarCollapsed: boolean }>;
  export const Sidebar: React.FC<{ isCollapsed: boolean; onToggleCollapse: () => void; mobileOpen: boolean; onCloseMobile: () => void }>;
  export const AppLayout: React.FC;
  ```

- [x] **Step 1: Implement `TopNavbar.tsx`**
- [x] **Step 2: Overhaul `Sidebar.tsx` to support Collapsible Rail and Mobile Overlay**
- [x] **Step 3: Update `AppLayout.tsx` to connect TopNavbar and Collapsible Sidebar**
- [x] **Step 4: Verify build and linting**
- [x] **Step 5: Commit**

```bash
git add apps/web/src/components/layout/TopNavbar.tsx apps/web/src/components/layout/Sidebar.tsx apps/web/src/components/layout/AppLayout.tsx
git commit -m "feat(layout): implement collapsible sidebar and global top navbar with theme toggle"
```

---

### Task 3: Scrollytelling Landing Page & Research Studio Form

**Files:**
- Create: `apps/web/src/hooks/useScrollSpy.ts`
- Create: `apps/web/src/components/landing/ScrollytellingHome.tsx`
- Modify: `apps/web/src/components/research/IdeaInputForm.tsx`
- Modify: `apps/web/src/routes/HomePage.tsx`

**Interfaces:**
- Consumes: `useScrollSpy` for section visibility tracking, `researchApi.startResearch` from `../api/research`.
- Produces:
  ```typescript
  export const useScrollSpy: (sectionIds: string[], offset?: number) => string;
  export const ScrollytellingHome: React.FC<{ onStartResearch: (data: ResearchStartRequest) => Promise<void>; isLoading: boolean }>;
  ```

- [x] **Step 1: Implement `useScrollSpy.ts` hook**
- [x] **Step 2: Redesign `IdeaInputForm.tsx` with Semantic Tokens & Character Counter**
- [x] **Step 3: Implement `ScrollytellingHome.tsx`**
- [x] **Step 4: Update `HomePage.tsx` to render `ScrollytellingHome`**
- [x] **Step 5: Verify build and commit**

Run: `pnpm build:web && pnpm lint:web`
Expected: PASS with 0 errors

```bash
git add apps/web/src/hooks/useScrollSpy.ts apps/web/src/components/landing/ScrollytellingHome.tsx apps/web/src/components/research/IdeaInputForm.tsx apps/web/src/routes/HomePage.tsx
git commit -m "feat(landing): implement 5-chapter scrollytelling home and refined research form"
```

---

### Task 4: Tabbed Executive Dossier & Real-Time Pipeline Progress

**Files:**
- Modify: `apps/web/src/routes/ResearchDetailPage.tsx`
- Modify: `apps/web/src/components/research/PipelineStepper.tsx`

**Interfaces:**
- Consumes: `researchApi.getResearchDetail`, SSE `/api/research/{id}/stream`.
- Produces:
  ```typescript
  export type DossierTab = 'overview' | 'market' | 'strategy' | 'sources';
  export const ResearchDetailPage: React.FC;
  ```

- [x] **Step 1: Overhaul `PipelineStepper.tsx` (Real-Time Progress View)**
- [x] **Step 2: Restructure `ResearchDetailPage.tsx` into a 4-Tab Executive Dossier**
- [x] **Step 3: Verify build and commit**

Run: `pnpm build:web && pnpm lint:web`
Expected: PASS with 0 errors

```bash
git add apps/web/src/routes/ResearchDetailPage.tsx apps/web/src/components/research/PipelineStepper.tsx
git commit -m "feat(dossier): implement 4-tab executive dossier and live progress stepper"
```

---

### Task 5: Theme-Aware Recharts Visualization & Research Report Widgets

**Files:**
- Modify: `apps/web/src/components/research/MarketSizeChart.tsx`
- Modify: `apps/web/src/components/research/ViabilityGauge.tsx`
- Modify: `apps/web/src/components/research/CompetitorTable.tsx`
- Modify: `apps/web/src/components/research/SwotGrid.tsx`
- Modify: `apps/web/src/components/research/PainPointsList.tsx`
- Modify: `apps/web/src/components/research/RiskMitigationMap.tsx`
- Modify: `apps/web/src/components/research/CitationsList.tsx`

**Interfaces:**
- Consumes: `useTheme` for dynamic Recharts grid/axis/tooltip styling.
- Produces:
  ```typescript
  export const MarketSizeChart: React.FC<{ marketSize: any }>;
  export const ViabilityGauge: React.FC<{ score: number }>;
  export const CompetitorTable: React.FC<{ competitors: any[] }>;
  export const SwotGrid: React.FC<{ swot: any }>;
  export const PainPointsList: React.FC<{ painPoints: any[] }>;
  export const RiskMitigationMap: React.FC<{ risks: any[] }>;
  export const CitationsList: React.FC<{ sources: any[] }>;
  ```

- [x] **Step 1: Upgrade `MarketSizeChart.tsx` with Theme-Aware Recharts**
- [x] **Step 2: Polish `ViabilityGauge.tsx` with Breakdown Factors**
- [x] **Step 3: Redesign `CompetitorTable.tsx`, `SwotGrid.tsx`, and `CitationsList.tsx`**
- [x] **Step 4: Verify build and commit**

Run: `pnpm build:web && pnpm lint:web`
Expected: PASS with 0 errors

```bash
git add apps/web/src/components/research/MarketSizeChart.tsx apps/web/src/components/research/ViabilityGauge.tsx apps/web/src/components/research/CompetitorTable.tsx apps/web/src/components/research/SwotGrid.tsx apps/web/src/components/research/PainPointsList.tsx apps/web/src/components/research/RiskMitigationMap.tsx apps/web/src/components/research/CitationsList.tsx
git commit -m "feat(report-widgets): modernize Recharts market chart and dossier sub-components"
```

---

### Task 6: Authentication Views (2-Step Signup, Signin & Protected Route Fallbacks)

**Files:**
- Modify: `apps/web/src/components/auth/SplitAuthLayout.tsx`
- Modify: `apps/web/src/components/auth/SignupStep1Form.tsx`
- Modify: `apps/web/src/components/auth/SignupStep2Form.tsx`
- Modify: `apps/web/src/components/auth/SigninForm.tsx`
- Modify: `apps/web/src/routes/LoginPage.tsx`
- Modify: `apps/web/src/routes/SignupPage.tsx`
- Modify: `apps/web/src/routes/AdminRoute.tsx`

**Interfaces:**
- Consumes: `authApi.signupStep1`, `authApi.signupStep2`, `authApi.signin`.
- Produces: Complete, accessible 2-step TOTP signup and signin experience with theme tokens.

- [x] **Step 1: Modernize `SplitAuthLayout.tsx`**
- [x] **Step 2: Update `SignupStep1Form.tsx` and `SignupStep2Form.tsx`**
- [x] **Step 3: Update `SigninForm.tsx` and `AdminRoute.tsx`**
- [x] **Step 4: Verify build and commit**

Run: `pnpm build:web && pnpm lint:web`
Expected: PASS with 0 errors

```bash
git add apps/web/src/components/auth/SplitAuthLayout.tsx apps/web/src/components/auth/SignupStep1Form.tsx apps/web/src/components/auth/SignupStep2Form.tsx apps/web/src/components/auth/SigninForm.tsx apps/web/src/routes/LoginPage.tsx apps/web/src/routes/SignupPage.tsx apps/web/src/routes/AdminRoute.tsx
git commit -m "feat(auth): polish 2-step TOTP signup and signin with theme support"
```

---

### Task 7: History Archive & Admin Telemetry Console Redesign

**Files:**
- Modify: `apps/web/src/routes/HistoryPage.tsx`
- Modify: `apps/web/src/routes/AdminPage.tsx`
- Modify: `apps/web/src/components/admin/KpiCards.tsx`
- Modify: `apps/web/src/components/admin/GlobalResearchFeed.tsx`
- Modify: `apps/web/src/components/admin/UserRoster.tsx`

**Interfaces:**
- Consumes: `researchApi.getResearchHistory`, `researchApi.getAllResearchAdmin`.
- Produces: Polished archive and admin console views.

- [x] **Step 1: Redesign `HistoryPage.tsx`**
- [x] **Step 2: Modernize `AdminPage.tsx`, `KpiCards.tsx`, and Admin Sub-components**
- [x] **Step 3: Verify build and commit**

---

### Task 8: Full End-to-End Build, Print/PDF Export & Production Verification

**Files:**
- Modify: `apps/web/src/index.css` (print styles `@media print`)
- Test: Full build, lint, and type check verification

- [x] **Step 1: Add Print / PDF Export Styles in `apps/web/src/index.css`**
- [x] **Step 2: Run complete lint check across the workspace**
- [x] **Step 3: Run complete production build across the workspace**
- [x] **Step 4: Final verification commit**

```bash
git add apps/web/src/index.css
git commit -m "chore: add print export styles and finalize UI/UX redesign verification"
```
