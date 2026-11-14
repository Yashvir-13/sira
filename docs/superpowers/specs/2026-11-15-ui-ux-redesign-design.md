# Specification: SIRA UI/UX Redesign & Scrollytelling Architecture

## 1. Overview & Objectives

This specification defines the complete UI/UX overhaul for SIRA (Startup Idea Research Agent). 

While the backend services, FastAPI gateway, and agent worker pipelines are operational, the frontend interface is being redesigned into a cohesive, high-conviction venture intelligence product. The new experience introduces:
- **Dual Theme Support:** Polished Light Mode ("Ivory Executive Studio") and Dark Mode ("Obsidian Editorial") with zero-flicker transitions.
- **Scrollytelling Landing Page:** A narrative-driven home experience that demonstrates the 4-stage research pipeline (SearXNG, Jev, Crawl4AI, Claude) through sticky interactive scroll chapters before leading into the active research studio.
- **Tabbed Executive Dossier:** An investment-grade research report interface featuring Recharts visualizations (TAM/SAM/SOM), competitor matrices, SWOT analysis, and linked source citations.
- **Grounded Tone & Copy:** Clear, direct, unpretentious communication with zero marketing buzzwords or AI verbosity.
- **Fluid Layout Shell:** Collapsible sidebar (expanded 240px / collapsed 64px rail), global sticky topbar with breadcrumbs, theme toggle, and 2-step TOTP authentication UI.

---

## 2. Design System & Theme Architecture

### 2.1. Semantic CSS Variable Tokens
Tokens are declared in `apps/web/src/index.css` and mapped into `tailwind.config.js`. Theme switching toggles the `.dark` class on the root `<html>` element.

```css
:root {
  /* Light Mode ("Ivory Executive Studio") */
  --bg-primary: #F8F9FC;
  --bg-surface: #FFFFFF;
  --bg-surface-raised: #F1F4F9;
  --bg-surface-glass: rgba(255, 255, 255, 0.85);
  --border-subtle: rgba(15, 23, 42, 0.08);
  --border-prominent: rgba(15, 23, 42, 0.16);
  --text-primary: #0F172A;
  --text-secondary: #475569;
  --text-muted: #94A3B8;
  --accent-emerald: #059669; /* Conviction / Success */
  --accent-indigo: #4F46E5;  /* Pipeline / Analysis */
  --accent-amber: #D97706;   /* Risk / Moderate */
  --accent-rose: #DC2626;    /* Threat / High Risk */
  --shadow-card: 0 4px 20px -2px rgba(15, 23, 42, 0.05), 0 1px 3px rgba(15, 23, 42, 0.03);
}

.dark {
  /* Dark Mode ("Obsidian Editorial") */
  --bg-primary: #090A0F;
  --bg-surface: #11131E;
  --bg-surface-raised: #171A29;
  --bg-surface-glass: rgba(17, 19, 30, 0.85);
  --border-subtle: rgba(255, 255, 255, 0.08);
  --border-prominent: rgba(255, 255, 255, 0.16);
  --text-primary: #F8FAFC;
  --text-secondary: #94A3B8;
  --text-muted: #64748B;
  --accent-emerald: #10B981;
  --accent-indigo: #6366F1;
  --accent-amber: #F59E0B;
  --accent-rose: #EF4444;
  --shadow-card: 0 4px 24px -2px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.05);
}
```

### 2.2. Typography
- **Display & Headlines:** Modern geometric sans (`Plus Jakarta Sans` or `Inter`, falling back to system sans) with tight letter spacing (`tracking-tight`) and bold weights for clarity.
- **Body Text:** Neutral slate tone (`text-secondary`), 14px–15px base size with generous line height (`leading-relaxed`) to optimize readability for dense research documents.
- **Monospace Badges:** Fixed-width tabular figures (`font-mono text-[11px] tracking-wider uppercase`) for scores, TAM market figures, dates, and citation identifiers.

### 2.3. Micro-interactions & Transitions
- **Theme Transitions:** Clean 200ms cross-fade for background and text colors without layout recalculation.
- **Card Depth:** Elevation transform on hover (`hover:-translate-y-0.5 hover:shadow-card transition-all duration-200 ease-out`).
- **Interactive Feedback:** Ripple-free, tactile active states (`active:scale-[0.98]`) on buttons and preset inspiration chips.
- **Glassmorphism:** `backdrop-blur-md` applied to sticky navigation headers and modal backdrops.

---

## 3. Scrollytelling Landing Page Architecture (`/`)

The home view serves as both an interactive product narrative for new/evaluating visitors and an efficient launchpad for authenticated members.

### 3.1. Structure & Narrative Chapters
1. **Chapter 1: The Hero Canvas**
   - Headline: *"Validate before you build."*
   - Subhead: *"SIRA queries 20+ web sources, filters noise with type-safe classifiers, extracts real market signals, and delivers investment-grade validation in 90 seconds."*
   - Quick Concept Preview: Clickable example concept pills (*"Autonomous PR Code Reviewer"*, *"B2B SaaS Churn Predictor"*, *"Smart Macro Meal Planner"*) that pre-populate the launchpad.
   - Dual Actions: *"Start Research"* (smooth scroll to Chapter 5) + *"See How It Works"* (smooth scroll to Chapter 2).

2. **Chapter 2: The Founder's Dilemma**
   - Side-by-side comparison illustrating the contrast:
     - **Manual Research (40 Hours):** 50 browser tabs, outdated market figures, fragmented notes, subjective bias.
     - **SIRA Agent (90 Seconds):** Structured multi-source metasearch, automated signal classification, clean web content extraction, and quantitative risk modeling.

3. **Chapter 3: The 4-Stage Agent Pipeline (Sticky Interactive Spine)**
   - Sticky left timeline synchronized with scroll progress through four stages:
     - **Stage 1 (SearXNG Metasearch):** Multi-index querying across Reddit, Hacker News, Product Hunt, SEC reports, and news.
     - **Stage 2 (TypeSafe Jev Classification):** Real-time categorization into `Competitor`, `Pricing Model`, `Customer Pain Point`, or `TAM Signal`.
     - **Stage 3 (Crawl4AI Scraping):** Headless extraction converting raw web pages into clean, token-efficient Markdown.
     - **Stage 4 (Claude Synthesis):** Multi-factor analysis generating viability scores, market bounds, and defensive moats.

4. **Chapter 4: The Executive Dossier Preview**
   - Interactive live preview showcasing core report components:
     - Animated viability gauge (reaching 84/100, High Conviction).
     - Miniature Recharts TAM/SAM/SOM chart with hover tooltips.
     - Competitor matrix sample with threat level badges.

5. **Chapter 5: The Launchpad Studio**
   - For signed-in members: Active submission card with title input, 5,000-character description textarea with live counter, preset suggestions, and a prominent *"Run Research"* button.
   - For guests: Frictionless action card with *"Sign In with 2FA"* or *"Create Account"*.
   - **Bypass Option:** Returning users can click *"Jump to Studio"* in the top navigation at any time to skip scroll chapters.

### 3.2. Technical Implementation
- Native React `IntersectionObserver` hook (`useIntersectionObserver`) observing chapter section thresholds (`0.3` to `0.7`).
- CSS `sticky top-28` layout for the pipeline spine on screens `>= 1024px`.
- Zero external scroll libraries required; uses GPU-accelerated CSS transforms.

---

## 4. Application Shell & Navigation

### 4.1. Collapsible Sidebar
- **State A (Expanded, 240px):**
  - Brand header (`SIRA Intelligence`).
  - Navigation links:
    - `New Research` (`/`)
    - `Research Archive` (`/history`)
    - `Admin Console` (`/admin` - rendered only for users with `admin` role).
  - Active pipeline badge showing connected services.
  - Collapse button at the bottom of the rail.
- **State B (Collapsed, 64px):**
  - Compact icon-only rail with tooltip labels on hover.
  - Provides additional horizontal real estate for wide tables and Recharts visualizations.
- **Mobile Drawer:**
  - Off-canvas slide-out sheet triggered by topbar hamburger icon on screens `< 768px`.

### 4.2. Sticky Global Topbar
- **Left:** Contextual breadcrumbs reflecting the current view hierarchy (e.g., `Archive / DevPulse Intelligence Dossier`).
- **Right:**
  - Theme Toggle: Single-click switch between Light Mode and Dark Mode with SVG icon animation.
  - User Profile Menu: Displays email, role badge (`Admin` or `Member`), and a sign-out button.

---

## 5. Authentication Flows

### 5.1. Two-Step Signup (`/signup`)
- **Step 1: Account Credentials**
  - Email, Password, Confirm Password.
  - Immediate client-side verification that passwords match.
  - Understated error feedback directly below inputs.
- **Step 2: Google Authenticator (TOTP) Setup**
  - High-contrast QR code rendered on a clean surface.
  - Plain-text secret fallback with one-click `Copy Secret` action.
  - 6 individual digit input boxes with auto-focus and auto-advance. Entering the 6th digit automatically submits the verification request.

### 5.2. Signin (`/login`)
- Focused single-card form: Email, Password, and 6-digit TOTP code.
- Clean error messaging if credentials or TOTP fail, preserving the entered email.

### 5.3. Route Protection & Access States
- Unauthenticated requests to protected routes redirect to `/login` with redirect intent saved.
- Non-admin attempts to access `/admin` display a minimal "Access Restricted" state with a direct button back to `/`.

---

## 6. The Tabbed Executive Dossier (`/research/:id`)

When viewing a completed research report, content is organized across 4 dedicated tabs rather than an unsegmented vertical scroll.

```
┌────────────────────────────────────────────────────────────────────────┐
│ [← Archive]          DevPulse - AI Code Reviewer          [Export PDF] │
│ Created Nov 14, 2026 • 24 Sources Analyzed • Verdict: High Conviction  │
├────────────────────────────────────────────────────────────────────────┤
│ [1. Overview & Verdict] [2. Market & Competition] [3. Strategy & Risks] [4. Sources] │
└────────────────────────────────────────────────────────────────────────┘
```

### 6.1. Tab 1: Overview & Verdict
- **Executive Summary:** Concise one-paragraph synthesis outlining market opportunity and fundamental risks.
- **Viability Gauge (0–100):**
  - Color-coded conviction rating: `75–100` (Emerald, High Conviction), `50–74` (Amber, Moderate Potential), `<50` (Rose, High Risk).
  - Breakdown metrics: **Market Demand**, **Defensibility**, and **Execution Complexity**.
- **Action Toolbar:** `Export PDF` (formatted print view), `Copy Share Link`, and `Re-run Analysis`.

### 6.2. Tab 2: Market & Competition
- **Recharts Market Size Chart (TAM / SAM / SOM):**
  - Responsive Bar/Area chart comparing Total Addressable Market, Serviceable Addressable Market, and Serviceable Obtainable Market.
  - Theme-aware axes, grid lines, and tooltips adapting to active light or dark mode.
- **Competitor Analysis Table:**
  - Columns: **Competitor**, **Threat Level** (`Low`, `Medium`, `High`), **Pricing Model**, **Strengths**, and **Vulnerabilities / Gaps**.
  - Row hover highlighting and direct external links to competitor homepages.

### 6.3. Tab 3: Strategy & Risks
- **SWOT Matrix (2x2 Grid):**
  - Four distinct quadrants: **Strengths**, **Weaknesses**, **Opportunities**, and **Threats**.
  - Crisp typography with bulleted strategic findings.
- **Customer Pain Points:**
  - Severity badges (`Critical`, `Moderate`) alongside customer quotes/signals and willingness-to-pay ratings.
- **Risk Mitigation Map:**
  - Structured 3-column table: *Identified Risk*, *Proposed Mitigation*, and *Residual Risk Level*.

### 6.4. Tab 4: Sources & Evidence
- **Citation Directory:**
  - Lists every web page scraped and cited by the agent.
  - Displays source title, publisher domain, signal classification (`Competitor`, `Market Data`, `Pricing`), and clickable link opening in a new tab.
  - Search and filter bar to locate specific domains or categories.

### 6.5. Real-Time Pipeline Progress (Pending State)
- When research status is `pending` or `processing`:
  - 4-stage visual stepper (SearXNG &rarr; Jev &rarr; Crawl4AI &rarr; Claude).
  - Animated progress bar (0% &rarr; 100%) tracking SSE events.
  - Pulsing stage indicator showing the active service.
  - Automatic transition to the complete Dossier upon completion without requiring manual page reload.

---

## 7. History & Admin Console Redesign

### 7.1. Research Archive (`/history`)
- Grid/list view of past research sessions.
- Status badges (`Completed`, `Processing`, `Failed`), viability score pill, date, and source count.
- Search filter by title or keyword.

### 7.2. Admin Console (`/admin`)
- Metric KPI cards: Total Research Sessions, Active Users, Average Viability Score, Pipeline Success Rate.
- Tabbed view switching between:
  - **Global Research Feed:** System-wide research runs with owner information and status.
  - **User Roster:** Member accounts, roles, registration dates, and role promotion toggles.

---

## 8. Verification & Success Criteria

1. **Theme Consistency:** Switching between light and dark mode toggles all surfaces, text colors, borders, Recharts charts, and inputs without contrast bugs or unstyled flashes.
2. **Scrollytelling Fluidity:** The 5-chapter landing page narrative scrolls smoothly at 60fps on desktop and mobile; sticky pipeline indicators align with scroll position.
3. **Data Integrity:** All API calls (`auth`, `research`, SSE streams) continue functioning without modifying backend contracts.
4. **Build & Type Safety:** `pnpm build` succeeds with zero TypeScript or Vite compilation errors.
