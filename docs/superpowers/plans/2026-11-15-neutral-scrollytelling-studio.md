# Neutral Scrollytelling & Dedicated Research Studio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the SIRA web frontend into a pure neutral zinc/charcoal monochrome theme, eliminate the light mode invisible button bug, establish a dedicated `/new` research studio page, and integrate Motion.dev parallax grid and scroll-linked text reveals.

**Architecture:** Refactor CSS variables to space-separated values for valid Tailwind alpha rendering across light and dark modes with a pure zinc scale. Decouple `IdeaInputForm` into a dedicated `NewResearchPage` at `/new`, and rebuild the landing page (`/`) into a pure scrollytelling narrative featuring `ParallaxGrid`, `TextReveal`, and `PinnedPipelineScroller`.

**Tech Stack:** React 19, TypeScript, Tailwind CSS 3.4, Motion 14.14 (`motion/react`), Lucide React, Vite 8.

**Spec:** docs/superpowers/specs/2026-11-15-neutral-scrollytelling-studio-design.md

## Global Constraints

- **Theme Consistency:** Light Mode and Dark Mode must use pure neutral zinc (`#09090B` dark, `#FAFAFA` light) with zero blueish/navy undertones.
- **Button Contrast:** Primary CTA buttons must have stark contrast (solid `#18181B` with white text in light mode, `#FAFAFA` with black text in dark mode).
- **No Inline Form on Landing Page:** The landing page (`/`) must not contain the input form at the bottom; it must link to `/new`.
- **Motion Standards:** Import from `"motion/react"` and use hardware-accelerated transforms (`useScroll`, `useTransform`).
- **Build Cleanliness:** `pnpm build:web` and `pnpm lint:web` must pass with zero errors after every task.

## Review Focus

1. **Button Invisibility in Light Mode:** Verify that primary buttons render with opaque, dark backgrounds and crisp white text.
2. **Dark Mode Color Cast:** Verify that `#09090B` and `#141416` dark mode contains no blue/slate tint.
3. **Route Navigation to `/new`:** Verify that clicking "Launch Research Studio" opens `/new` without scrolling to the bottom of `/`.
4. **Parallax Performance:** Verify that `ParallaxGrid` scrolls off main thread without layout jank or horizontal overflow.
5. **Session Draft Recovery:** Verify that unauthenticated users drafting on `/new` have their draft stored in `sessionStorage` if redirected to login.

---

### Task 1: Design Tokens & Neutral Grey Palette Overhaul

**Files:**
- Modify: `apps/web/src/index.css`
- Modify: `apps/web/tailwind.config.js`
- Test: `apps/web/src/test/theme.test.ts`

**Interfaces:**
- Produces: Correct space-separated CSS variable tokens (`--bg-primary-rgb: 9 9 11`, `--accent-primary-rgb: 24 24 27`), Tailwind semantic mappings for `background`, `surface`, `border`, `primary`, and `accent`.

- [ ] **Step 1: Update `apps/web/src/index.css` with Space-Separated Neutral Zinc Tokens**
  - Replace comma-separated values with space-separated channel numbers (`250 250 250` for light, `9 9 11` for dark).
  - Define `--accent-primary-rgb: 24 24 27` (light) and `250 250 250` (dark).
  - Update `.glass-card` and subtle grid patterns.

- [ ] **Step 2: Update `apps/web/tailwind.config.js`**
  - Map `accent.primary: "rgb(var(--accent-primary-rgb) / <alpha-value>)"`.
  - Map `surface.DEFAULT: "rgb(var(--bg-surface-rgb) / <alpha-value>)"`.
  - Map `background: "rgb(var(--bg-primary-rgb) / <alpha-value>)"`.

- [ ] **Step 3: Run theme test and build**
  - Run: `node --experimental-strip-types apps/web/src/test/theme.test.ts`
  - Run: `pnpm build:web`
  - Expected: PASS with 0 errors.

- [ ] **Step 4: Commit**
  ```bash
  git add apps/web/src/index.css apps/web/tailwind.config.js apps/web/src/test/theme.test.ts
  git commit -m "feat(theme): transition to pure neutral zinc palette and fix CSS variable alpha syntax"
  ```

---

### Task 2: Dedicated `/new` Research Studio Route & Page

**Files:**
- Create: `apps/web/src/routes/NewResearchPage.tsx`
- Modify: `apps/web/src/App.tsx`
- Modify: `apps/web/src/components/layout/Sidebar.tsx`
- Modify: `apps/web/src/components/research/IdeaInputForm.tsx`

**Interfaces:**
- Produces: `export const NewResearchPage: React.FC;` mapped to `/new` in `App.tsx`.
- Consumes: `IdeaInputForm`, `useAuth`, `researchApi.startResearch`.

- [ ] **Step 1: Implement `NewResearchPage.tsx`**
  - Standalone studio view with breadcrumbs/back navigation, header, and centered `IdeaInputForm`.
  - Automatically loads and submits draft concepts saved in `sessionStorage` (`sira_pending_concept`).
  - Redirects unauthenticated users to `/login?redirect=/new` if they attempt to launch research.

- [ ] **Step 2: Update `App.tsx` Routes**
  - Add `<Route path="/new" element={<NewResearchPage />} />` as a public/hybrid route.
  - Keep `/` as public marketing landing page.
  - Keep `/research/:id`, `/history`, and `/admin` inside `ProtectedRoute`.

- [ ] **Step 3: Update `Sidebar.tsx` and `IdeaInputForm.tsx`**
  - Ensure "New Research" in `Sidebar` navigates to `/new`.
  - Style `IdeaInputForm` primary button with `bg-primary text-background` (high-contrast inverted button) so it is 100% visible in both light and dark mode.

- [ ] **Step 4: Verify build and commit**
  - Run: `pnpm lint:web && pnpm build:web`
  - Expected: PASS with 0 errors.
  ```bash
  git add apps/web/src/routes/NewResearchPage.tsx apps/web/src/App.tsx apps/web/src/components/layout/Sidebar.tsx apps/web/src/components/research/IdeaInputForm.tsx
  git commit -m "feat(studio): add dedicated /new research studio route and update navigation"
  ```

---

### Task 3: Motion.dev Background & Animation Components (`ParallaxGrid` & `TextReveal`)

**Files:**
- Create: `apps/web/src/components/landing/ParallaxGrid.tsx`
- Create: `apps/web/src/components/landing/TextReveal.tsx`

**Interfaces:**
- Produces:
  ```typescript
  export const ParallaxGrid: React.FC<{ children: React.ReactNode }>;
  export const TextReveal: React.FC<{ text: string; className?: string }>;
  ```

- [ ] **Step 1: Implement `ParallaxGrid.tsx`**
  - Uses `useScroll` and `useTransform` to move an SVG architectural grid at `0%` to `20%` speed.
  - Adds a centered radial spotlight gradient mask fading smoothly to the edges.
  - Encapsulates children cleanly with zero horizontal overflow.

- [ ] **Step 2: Implement `TextReveal.tsx`**
  - Splits text into words or phrases.
  - Uses `useScroll` target progress to scrub word opacity from `0.25` to `1.0`.

- [ ] **Step 3: Verify build and commit**
  - Run: `pnpm lint:web && pnpm build:web`
  - Expected: PASS with 0 errors.
  ```bash
  git add apps/web/src/components/landing/ParallaxGrid.tsx apps/web/src/components/landing/TextReveal.tsx
  git commit -m "feat(motion): add ParallaxGrid and scroll-linked TextReveal components"
  ```

---

### Task 4: Landing Page Overhaul & Conversion Banner

**Files:**
- Modify: `apps/web/src/components/landing/ScrollytellingHome.tsx`
- Modify: `apps/web/src/components/landing/LandingNavbar.tsx`
- Modify: `apps/web/src/components/landing/PinnedPipelineScroller.tsx`
- Modify: `apps/web/src/components/landing/ContainerScroll.tsx`

**Interfaces:**
- Consumes: `ParallaxGrid`, `TextReveal`, `PinnedPipelineScroller`, `ContainerScroll`.
- Produces: Complete landing page without inline form, featuring conversion banner linking to `/new`.

- [ ] **Step 1: Update `ScrollytellingHome.tsx`**
  - Wrap content in `<ParallaxGrid>`.
  - Use `<TextReveal>` for the main headline.
  - Remove the inline `IdeaInputForm` from the bottom.
  - Add an executive conversion CTA banner ("Ready to validate your startup concept?") with a prominent button linking directly to `/new`.
  - Fix Hero CTA button ("Launch Research Studio") to route to `/new`.

- [ ] **Step 2: Update `LandingNavbar.tsx`**
  - Point "Launch Studio" / "New Research" buttons directly to `/new`.
  - Update nav links to match marketing chapters.

- [ ] **Step 3: Update `PinnedPipelineScroller.tsx` and `ContainerScroll.tsx`**
  - Remove any remaining colored glow or blueish styling in cards.
  - Use neutral zinc surface and border tokens.

- [ ] **Step 4: Verify build and commit**
  ```bash
  git add apps/web/src/components/landing/
  git commit -m "feat(landing): integrate parallax grid, text reveal, and new studio CTA banner"
  ```

---

### Task 5: End-to-End Build & Visual Verification

**Files:**
- Full workspace test and visual audit.

- [ ] **Step 1: Run complete lint check**
  - Run: `pnpm lint:web`
  - Expected: 0 errors.

- [ ] **Step 2: Run complete production build**
  - Run: `pnpm build:web`
  - Expected: Production build succeeds with 0 errors.

- [ ] **Step 3: Visually verify via browser subagent**
  - Check `http://localhost:5173/` in Light Mode: Verify primary CTA button is starkly visible.
  - Check `http://localhost:5173/` in Dark Mode: Verify background is neutral zinc (`#09090B`) with zero blue tint.
  - Check `http://localhost:5173/new`: Verify dedicated studio form renders cleanly and functions.
  - Scroll through landing page: Verify parallax grid and text reveal effects.
