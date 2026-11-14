# SIRA Neutral Scrollytelling & Dedicated Research Studio Spec

## 1. Overview & Goals

This specification defines the architectural and visual overhaul of the SIRA web application based on user feedback and visual audits:
1. **Dedicated `/new` Research Studio Page:** Decouple the research input form from the landing page. Create a standalone, focused `/new` route for drafting concepts, selecting inspiration presets, and initiating research.
2. **Pure Neutral Zinc / Charcoal Grey Palette:** Eliminate all blue/navy/indigo hues in dark mode. Adopt an institutional, monochrome zinc scale (inspired by Linear, Vercel, and Apple).
3. **Fix Light Mode Invisible Buttons:** Correct CSS variable channel formatting from comma-delimited to space-delimited numbers, fixing the browser syntax error that caused primary buttons to render with transparent backgrounds and white text.
4. **Motion.dev Parallax & Text Reveal Background:** Implement a hardware-accelerated architectural parallax grid layer and scroll-driven text reveal for headlines using `useScroll` and `useTransform`.

---

## 2. Design System & Palette Specification

### 2.1 CSS Variables & Tailwind Tokens

Tailwind's `rgb(var(...) / <alpha-value>)` requires space-separated RGB channel numbers (e.g. `24 24 27`) in CSS variables. Comma separation causes invalid CSS syntax when combined with slash opacity.

#### Light Mode Tokens (`:root`)
- `--bg-primary-rgb: 250 250 250` (`#FAFAFA`)
- `--bg-surface-rgb: 255 255 255` (`#FFFFFF`)
- `--bg-surface-raised-rgb: 244 244 245` (`#F4F4F5`)
- `--border-subtle: #E4E4E7` (`zinc-200`)
- `--border-prominent: #D4D4D8` (`zinc-300`)
- `--text-primary: #09090B` (`zinc-950`)
- `--text-secondary: #52525B` (`zinc-600`)
- `--text-muted: #71717A` (`zinc-500`)
- `--accent-primary-rgb: 24 24 27` (`#18181B` - Solid Charcoal Black CTA)
- `--accent-primary-fg: #FAFAFA`
- `--accent-emerald-rgb: 16 185 129`
- `--accent-amber-rgb: 245 158 11`
- `--accent-rose-rgb: 239 68 68`
- `--shadow-card: 0 1px 3px rgba(0, 0, 0, 0.05), 0 4px 12px rgba(0, 0, 0, 0.03)`

#### Dark Mode Tokens (`.dark`)
- `--bg-primary-rgb: 9 9 11` (`#09090B` - Deep Neutral Zinc)
- `--bg-surface-rgb: 20 20 22` (`#141416` - Dark Charcoal Surface)
- `--bg-surface-raised-rgb: 31 31 35` (`#1F1F23` - Raised Zinc Card)
- `--border-subtle: rgba(255, 255, 255, 0.08)` (`#27272A` equivalent)
- `--border-prominent: rgba(255, 255, 255, 0.16)` (`#3F3F46` equivalent)
- `--text-primary: #FAFAFA` (`zinc-50`)
- `--text-secondary: #A1A1AA` (`zinc-400`)
- `--text-muted: #71717A` (`zinc-500`)
- `--accent-primary-rgb: 250 250 250` (`#FAFAFA` - Crisp White CTA with Dark Text)
- `--accent-primary-fg: #09090B`
- `--accent-emerald-rgb: 52 211 153`
- `--accent-amber-rgb: 251 191 36`
- `--accent-rose-rgb: 248 113 113`
- `--shadow-card: 0 4px 20px -2px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.06)`

---

## 3. Route Architecture & Page Structure

### 3.1 Routing Matrix
1. `/` (Public): `LandingPage`
   - Pure marketing and scrollytelling experience.
   - 3D hero perspective tilt (`ContainerScroll.tsx`).
   - Motion.dev Parallax Grid background (`ParallaxGrid.tsx`).
   - Scroll-linked text reveal headline (`TextReveal.tsx`).
   - Sticky pinned 4-stage pipeline scroller (`PinnedPipelineScroller.tsx`).
   - Founder dilemma comparison section.
   - High-impact bottom CTA banner with "Launch Research Studio" linking to `/new`.
2. `/new` (Public/Hybrid): `NewResearchPage`
   - Dedicated focused studio view.
   - Top navigation with back-to-home or back-to-archive link.
   - Full `IdeaInputForm` with 5,000 character limit, preset chips, and submission loader.
   - If authenticated: Submits research to backend and navigates to `/research/:id`.
   - If unauthenticated: Saves draft to `sessionStorage` (`sira_pending_concept`), redirects to `/login?redirect=/new`.
3. `/research/:id` (Protected): `ResearchDetailPage`
   - Real-time pipeline monitor and 4-tab executive dossier.
4. `/history` (Protected): `HistoryPage`
   - Searchable archive of all historical dossiers.
5. `/admin` (Protected Admin): `AdminPage`
   - Platform telemetry and user roster.

---

## 4. Motion.dev Background & Animation Components

### 4.1 Parallax Architectural Grid (`ParallaxGrid.tsx`)
- Container with `useScroll` tracking viewport scroll.
- `backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"])`.
- SVG geometric grid pattern with radial gradient mask (`maskImage: radial-gradient(ellipse 60% 50% at 50% 0%, #000 70%, transparent 100%)`).
- Runs off main thread with hardware acceleration.

### 4.2 Scroll-Linked Text Reveal (`TextReveal.tsx`)
- Splits target text into individual word spans.
- Each word has an opacity mapped to a slice of `scrollYProgress` (`[start, end] -> [0.2, 1.0]`).
- As the user scrolls, words illuminate from subtle stone grey to bright primary text.

### 4.3 Pinned Pipeline Scroller Deck (`PinnedPipelineScroller.tsx`)
- Pinned viewport (`sticky top-16 h-[85vh]`).
- 4 stages slide, scale, and pan smoothly based on scroll completion (0% -> 100%).
- Updated with neutral zinc tokens, crisp badges, and zero blue tints.

---

## 5. Verification & Acceptance Criteria
1. **Light Mode Visibility:** All buttons (primary and secondary) have high-contrast text and solid backgrounds (no ghost/invisible buttons).
2. **Dark Mode Neutrality:** Dark mode background is deep zinc (`#09090B`) with zero blue or navy color casts.
3. **Dedicated Route:** Navigating to `/new` displays the focused research studio form without requiring scrolling to the bottom of the landing page.
4. **Scrollytelling:** Parallax grid, text reveals, and pinned pipeline transitions operate smoothly without layout shifts or black voids.
5. **Quality Gates:** `pnpm lint:web` passes with 0 errors; `pnpm build:web` succeeds; theme unit test passes.
