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

- [ ] **Step 1: Write failing unit test for Theme logic in `apps/web/src/test/theme.test.ts`**

```typescript
import test from 'node:test';
import assert from 'node:assert';

test('Theme resolution defaults to dark or stored preference', () => {
  const getInitialTheme = (stored: string | null, prefersDark: boolean): 'light' | 'dark' => {
    if (stored === 'light' || stored === 'dark') return stored;
    return prefersDark ? 'dark' : 'light';
  };

  assert.strictEqual(getInitialTheme('light', true), 'light');
  assert.strictEqual(getInitialTheme('dark', false), 'dark');
  assert.strictEqual(getInitialTheme(null, true), 'dark');
  assert.strictEqual(getInitialTheme(null, false), 'light');
});
```

- [ ] **Step 2: Run test to verify it passes in Node 22**

Run: `node --experimental-strip-types apps/web/src/test/theme.test.ts`
Expected: PASS

- [ ] **Step 3: Define semantic CSS variable tokens in `apps/web/src/index.css`**

Add root variables (`--bg-primary`, `--bg-surface`, `--bg-surface-raised`, `--border-subtle`, `--text-primary`, `--text-secondary`, `--accent-emerald`, `--accent-indigo`, `--accent-amber`, `--accent-rose`, `--shadow-card`) and their `.dark` overrides as specified in Section 2.1 of the spec.

- [ ] **Step 4: Map semantic tokens in `apps/web/tailwind.config.js`**

Extend `theme.extend` with semantic color names referencing `var(--...)` tokens and custom box shadows.

- [ ] **Step 5: Implement `ThemeContext.tsx` and integrate into `apps/web/src/App.tsx`**

Implement `ThemeProvider` with `localStorage` persistence under key `sira-theme`, automatic class syncing to `document.documentElement`, and export `useTheme()`. Wrap the application tree in `App.tsx` with `<ThemeProvider>`.

- [ ] **Step 6: Verify build and commit**

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

- [ ] **Step 1: Implement `TopNavbar.tsx`**

Build the sticky top navigation header:
- Breadcrumb generator derived from `location.pathname` (e.g. `Home`, `Archive`, `Research / [ID]`, `Admin`).
- One-click Theme Toggle button (Sun / Moon icon with smooth rotation transition).
- User Profile Pill showing email, role badge (`Admin` or `Member`), and a clean dropdown for sign-out.
- Mobile menu toggle icon (hamburger).

- [ ] **Step 2: Overhaul `Sidebar.tsx` to support Collapsible Rail and Mobile Overlay**

Refactor `Sidebar.tsx`:
- Accepts `isCollapsed` prop: toggles between 240px (`w-60`) expanded view and 64px (`w-16`) icon-only rail.
- Tooltip labels appear on hover when collapsed.
- Navigation links for `New Research`, `Research Archive`, and `Admin Console` (rendered only if `user?.role === 'admin'`).
- Bottom collapse/expand toggle button with chevron icon.
- Mobile responsive off-canvas overlay triggered by `mobileOpen`.

- [ ] **Step 3: Update `AppLayout.tsx` to connect TopNavbar and Collapsible Sidebar**

Update layout container with state `isCollapsed` (persisted in `localStorage` under `sira-sidebar-collapsed`) and `mobileOpen`. Render `<TopNavbar>` at the top of the main viewport and `<Sidebar>` on the left.

- [ ] **Step 4: Verify build and linting**

Run: `pnpm build:web && pnpm lint:web`
Expected: PASS with 0 errors

- [ ] **Step 5: Commit**

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

- [ ] **Step 1: Implement `useScrollSpy.ts` hook**

Use `IntersectionObserver` to track the currently active section id from a list of section identifiers with zero layout thrashing.

- [ ] **Step 2: Redesign `IdeaInputForm.tsx` with Semantic Tokens & Character Counter**

Update `IdeaInputForm.tsx`:
- Apply theme surface tokens (`bg-surface`, `border-subtle`, `text-primary`).
- Title input with length validation (min 3 chars).
- Textarea with 5,000 character limit and live `charCount / 5000` counter.
- Interactive preset idea inspiration chips (*DevPulse*, *FitBite*, *SaaSChurn*).
- Clear submit button with loading state spinner.

- [ ] **Step 3: Implement `ScrollytellingHome.tsx`**

Build the 5-chapter scrollytelling narrative:
- **Chapter 1 (Hero):** Ambient gradient glow, bold headline (*"Validate before you build"*), quick concept preview bar, jump button to studio.
- **Chapter 2 (The Friction):** 40-hour manual grind vs. SIRA agent comparison cards.
- **Chapter 3 (The 4-Stage Pipeline):** Sticky scroll spine highlighting stages as the user scrolls (1. SearXNG Metasearch, 2. Jev Classification, 3. Crawl4AI Scraping, 4. Claude Synthesis).
- **Chapter 4 (Dossier Preview):** Interactive preview showing miniature gauge, market size bars, and threat cards.
- **Chapter 5 (Launchpad Studio):** Embedded `IdeaInputForm` with fast-action submission.

- [ ] **Step 4: Update `HomePage.tsx` to render `ScrollytellingHome`**

Wire `handleStartResearch` callback to redirect to `/research/:id` on successful job submission.

- [ ] **Step 5: Verify build and commit**

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

- [ ] **Step 1: Overhaul `PipelineStepper.tsx` (Real-Time Progress View)**

Redesign the in-progress SSE monitor:
- 4 clean step cards (SearXNG Metasearch &rarr; Jev Classification &rarr; Crawl4AI Scraping &rarr; Claude Synthesis).
- Animated progress bar with smooth transition.
- Live progress ticker message from backend SSE events.
- Smooth transition callback when status reaches `completed`.

- [ ] **Step 2: Restructure `ResearchDetailPage.tsx` into a 4-Tab Executive Dossier**

Refactor `ResearchDetailPage.tsx`:
- Header bar: Return to archive link, research title, timestamp, source count, status badge, and print/PDF export button (`window.print()`).
- Navigation Tabs with active indicator:
  1. `Overview & Verdict` (Summary verdict, Viability Gauge, key takeaways)
  2. `Market & Competition` (Market size Recharts chart, competitor comparison table)
  3. `Strategy & Risks` (SWOT 2x2 grid, customer pain points, risk mitigation map)
  4. `Sources & Evidence` (Citations list with category filters)
- Tab switching persists selected tab in local state or URL search params (`?tab=market`).

- [ ] **Step 3: Verify build and commit**

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

- [ ] **Step 1: Upgrade `MarketSizeChart.tsx` with Theme-Aware Recharts**

Refactor `MarketSizeChart.tsx`:
- Consume `theme` from `useTheme()`.
- Set dynamic colors for `CartesianGrid` (`#e2e8f0` light / `#1e293b` dark) and `XAxis`/`YAxis` tick labels (`#64748b` light / `#94a3b8` dark).
- Custom Tooltip styled with theme surface tokens (`bg-surface`, `border-subtle`, `text-primary`) displaying formatted dollar amounts ($B / $M).
- Responsive container with smooth bar animation.

- [ ] **Step 2: Polish `ViabilityGauge.tsx` with Breakdown Factors**

Upgrade `ViabilityGauge.tsx`:
- High Conviction (`>=75`), Moderate (`50-74`), High Risk (`<50`) badge and colored bar.
- Add 3 mini-meters underneath for **Market Demand**, **Defensibility**, and **Execution Complexity**.

- [ ] **Step 3: Redesign `CompetitorTable.tsx`, `SwotGrid.tsx`, and `CitationsList.tsx`**

- `CompetitorTable`: Threat level badges, pricing pill, external link icon.
- `SwotGrid`: Clean 2x2 grid with quadrant icons (Shield for Strengths, AlertCircle for Weaknesses, TrendingUp for Opportunities, Zap for Threats).
- `PainPointsList`: Severity tags with customer quote formatting.
- `RiskMitigationMap`: 3-column table (Risk, Mitigation Strategy, Residual Risk).
- `CitationsList`: Search bar to filter sources by domain or classification type.

- [ ] **Step 4: Verify build and commit**

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

- [ ] **Step 1: Modernize `SplitAuthLayout.tsx`**

Refactor auth layout:
- Left pane: Executive value proposition (*"Autonomous Venture Intelligence"*) with subtle product feature highlights and theme-aware surface.
- Right pane: Active auth form container with top-right theme toggle.

- [ ] **Step 2: Update `SignupStep1Form.tsx` and `SignupStep2Form.tsx`**

- Step 1: Matching password verification, clear error feedback, accessible form fields.
- Step 2: High-contrast QR card, plain-text secret copy button with temporary "Copied!" feedback, 6-digit OTP boxes with auto-focus.

- [ ] **Step 3: Update `SigninForm.tsx` and `AdminRoute.tsx`**

- Signin: Single-card with email, password, and 6-digit TOTP input.
- `AdminRoute`: Clean "Access Restricted" state with link back to Home for non-admin users.

- [ ] **Step 4: Verify build and commit**

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

- [ ] **Step 1: Redesign `HistoryPage.tsx`**

Refactor research archive:
- Search bar to filter past dossiers by title or concept.
- Card grid with conviction score pills, status badges (`Completed`, `Processing`, `Failed`), created date, and direct click-through to dossier.
- Clean empty state with a direct *"Launch Research"* action.

- [ ] **Step 2: Modernize `AdminPage.tsx`, `KpiCards.tsx`, and Admin Sub-components**

- `KpiCards`: Metric cards with trend indicators for Total Reports, Active Users, Average Viability Score, and Pipeline Health.
- Tab toggle between `Research Feed` and `User Roster`.
- `GlobalResearchFeed`: Searchable table of platform-wide research.
- `UserRoster`: Clean member list with role badges.

- [ ] **Step 3: Verify build and commit**

Run: `pnpm build:web && pnpm lint:web`
Expected: PASS with 0 errors

```bash
git add apps/web/src/routes/HistoryPage.tsx apps/web/src/routes/AdminPage.tsx apps/web/src/components/admin/KpiCards.tsx apps/web/src/components/admin/GlobalResearchFeed.tsx apps/web/src/components/admin/UserRoster.tsx
git commit -m "feat(admin): modernize research archive and administrative telemetry dashboard"
```

---

### Task 8: Full End-to-End Build, Print/PDF Export & Production Verification

**Files:**
- Modify: `apps/web/src/index.css` (print styles `@media print`)
- Test: Full build, lint, and type check verification

- [ ] **Step 1: Add Print / PDF Export Styles in `apps/web/src/index.css`**

Add `@media print` rules:
- Hide navigation sidebar, topbar, and action buttons during print.
- Expand tabs to show complete dossier content sequentially on paper/PDF.
- Force high-contrast background and text colors for clean black-and-white or color PDF generation.

- [ ] **Step 2: Run complete lint check across the workspace**

Run: `pnpm lint:web`
Expected: 0 lint errors

- [ ] **Step 3: Run complete production build across the workspace**

Run: `pnpm build`
Expected: Production build succeeds with 0 TypeScript or Vite errors.

- [ ] **Step 4: Final verification commit**

```bash
git add apps/web/src/index.css
git commit -m "chore: add print export styles and finalize UI/UX redesign verification"
```
