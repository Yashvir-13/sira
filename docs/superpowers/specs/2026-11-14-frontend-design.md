# Frontend Design Specification: Startup Idea Research Agent

**Date:** 2026-11-14  
**Status:** Approved  
**Author:** Antigravity & User  
**Target Application:** `apps/web/` (React 19 + TypeScript + Vite + Tailwind CSS + Recharts + Lucide Icons)

---

## 1. Overview & Objectives

The frontend for the **Startup Idea Research Agent** provides an intuitive, high-trust interface for entrepreneurs and investors to validate startup ideas through a multi-step AI research pipeline. 

The application integrates two tightly coupled experiences:
1. **Secure Authentication & RBAC:** Two-step signup with live Google/Microsoft Authenticator QR code verification, signin with 6-digit TOTP codes, JWT storage, and role-based route protection (`MEMBER` vs `ADMIN`).
2. **AI Venture Research Subsystem:** Real-time research job creation, live Server-Sent Events (SSE) pipeline progress streaming across 4 external services (SearXNG &rarr; Jev &rarr; Crawl4AI &rarr; Claude), and rich executive data visualization rendered with Recharts.

---

## 2. Visual Aesthetic & Design Tokens

### 2.1 Aesthetic Philosophy: Calm Executive Dark
* **Core Look:** Matte charcoal, slate, and zinc palette inspired by Linear, GitHub Dark, and Vercel.
* **Guiding Rule:** Zero cyberpunk, zero neon glows, and no distracting decorative gimmicks. High contrast, clean hairline borders, and generous whitespace ensure data clarity and executive authority.

### 2.2 Color Palette
* **Background Canvas:** Zinc 950 (`#090a0f`)
* **Card & Surface Background:** Zinc 900 (`#12131a`) with subtle inner surface highlights (`#181924`)
* **Hairline Borders:** Zinc 800 (`#27272a`) / Zinc 700 (`#3f3f46`)
* **Primary Text:** Zinc 100 (`#f4f4f5`)
* **Muted/Secondary Text:** Zinc 400 (`#a1a1aa`)
* **Semantic Accents (Calm & Restrained):**
  - **Viability & High Potential:** Muted Emerald (`#10b981`)
  - **Neutral & Moderate:** Slate / Indigo (`#6366f1`)
  - **Caution & Warnings:** Soft Amber (`#f59e0b`)
  - **High Threat / Risk:** Soft Rose (`#f43f5e`)

### 2.3 Typography
* **Primary Font:** Inter / System Sans-Serif (`font-sans`)
* **Data, Code, & Metrics:** Fira Code / JetBrains Mono (`font-mono`) for tickers, TOTP inputs, and timestamps

---

## 3. Application Architecture & Route Hierarchy

```
apps/web/src/
├── api/
│   ├── client.ts                 # Axios instance with JWT interceptors & error handlers
│   ├── auth.ts                   # Auth API endpoints (signup step1/2, signin, me)
│   └── research.ts               # Research API endpoints (start, get, history, admin)
├── components/
│   ├── layout/
│   │   ├── AppLayout.tsx         # Main Shell with persistent sidebar & header
│   │   └── Sidebar.tsx           # Collapsible navigation, user pill, and role badges
│   ├── auth/
│   │   ├── SplitAuthLayout.tsx   # Left branding hero + Right active form container
│   │   ├── SigninForm.tsx        # Email + password + segmented 6-digit TOTP input
│   │   ├── SignupStep1Form.tsx   # Email + password + confirm password
│   │   └── SignupStep2Form.tsx   # Base64 QR code viewer + 6-digit TOTP verification
│   ├── research/
│   │   ├── IdeaInputForm.tsx     # Idea submission with title, textarea & tags
│   │   ├── PipelineStepper.tsx   # Live 4-stage SSE visual progress indicator
│   │   ├── ViabilityGauge.tsx    # Circular / radial score metric (0-100)
│   │   ├── MarketSizeChart.tsx   # Recharts Composed/Bar chart for TAM/SAM/SOM
│   │   ├── CompetitorTable.tsx   # Comparison matrix with threat badges
│   │   ├── SwotGrid.tsx          # 2x2 SWOT quadrant cards
│   │   ├── PainPointsList.tsx    # Customer pain points & severity
│   │   ├── RiskMitigationMap.tsx # Critical risks mapped to Claude mitigations
│   │   └── CitationsList.tsx     # Crawled sources with external hyperlinks
│   └── admin/
│       ├── KpiCards.tsx          # Total users, jobs run, success rate
│       ├── GlobalResearchFeed.tsx# Platform-wide research table with user tags
│       └── UserRoster.tsx        # User management table with role pills & 2FA state
├── routes/
│   ├── ProtectedRoute.tsx        # Guards routes requiring authenticated session
│   ├── AdminRoute.tsx            # Guards routes requiring UserRole.ADMIN
│   ├── LoginPage.tsx             # Route: /login
│   ├── SignupPage.tsx            # Route: /signup
│   ├── HomePage.tsx              # Route: / (New Research Studio)
│   ├── ResearchDetailPage.tsx    # Route: /research/:id (Live Stepper -> Report)
│   ├── HistoryPage.tsx           # Route: /history (User past research archive)
│   └── AdminPage.tsx             # Route: /admin (Full admin console)
├── state/
│   └── AuthContext.tsx           # User session, JWT tokens, login, logout
├── types/
│   └── index.ts                  # TypeScript models matching backend contracts
├── App.tsx                       # React Router DOM configuration
└── main.tsx                      # Root mount with AuthProvider & QueryClient
```

---

## 4. State Management & API Client

### 4.1 `AuthContext`
* **State:**
  - `user: UserResponse | null`
  - `token: string | null`
  - `isLoading: boolean`
* **Storage:** Token persisted in `localStorage.getItem("token")`.
* **Initialization:** App startup triggers `GET /auth/me` with stored token. If valid, populates `user`; if expired or invalid, flushes storage and redirects to `/login`.
* **Actions:**
  - `login(token: string, user: UserResponse)`
  - `logout()`

### 4.2 Axios Client (`src/api/client.ts`)
* `baseURL: http://localhost:8000`
* **Request Interceptor:** Injects `Authorization: Bearer ${token}` from `localStorage`.
* **Response Interceptor:** Catches `401 Unauthorized` responses and automatically triggers session eviction to `/login`.

---

## 5. View Specifications

### 5.1 Authentication Experience (`/login` & `/signup`)
* **Split Layout:**
  - **Left Hero:** Deep slate background showcasing the value proposition: automated query expansion, link classification, deep scraping, and AI validation.
  - **Right Card:**
    - **Login:** Email, password, and a segmented 6-digit TOTP input box.
    - **Signup Step 1:** Email, password, password confirmation with validation.
    - **Signup Step 2:** Displays the base64 QR code image (`data:image/png;base64,...`) and manual secret key, with instructions to scan in Google Authenticator or Microsoft Authenticator, followed by a 6-digit code verification input.

### 5.2 Research Studio (`/`)
* **Input Fields:**
  - `title`: Startup idea title (min 3 chars).
  - `description`: Concept details (min 10 chars, max 2000 chars) with live character counter.
  - Quick-preset chips (*B2B SaaS, DevTool, Fintech, Consumer AI, HealthTech*) to prepopulate tags.
* **Submission:** Calls `POST /research/start`. On response (`{ research_id: "..." }`), immediately navigates to `/research/:id`.

### 5.3 Live Pipeline Stepper (`/research/:id` while processing)
* **Real-time SSE Connection:**
  - Opens `new EventSource('/api/research/' + id + '/stream?token=' + token)`.
  - Parses event JSON payload: `{ status, current_step, progress, error_message }`.
* **Visual Stepper Milestones:**
  1. `15%`: Query Expansion & SearXNG Search
  2. `40%`: Jev (TypeSafe AI) Link Classification
  3. `65%`: Crawl4AI Web Page Scraping
  4. `85%`: Claude Venture Analysis & Financial Modeling
  5. `100%`: Report Assembly Complete
* **Auto-transition:** When `status === 'completed'`, the event source closes and the component fetches the full record from `GET /research/:id` to render the Executive Report seamlessly.

### 5.4 Executive Report Dashboard (`/research/:id` when completed)
* **Venture Verdict Hero Card:**
  - Decisive 1-sentence verdict banner.
  - Circular Viability Gauge (`0–100`) with color mapping.
* **Executive Summary:** Clean multi-paragraph synthesis from Claude.
* **Market Sizing Visualization (Recharts):**
  - Composed Bar Chart comparing TAM, SAM, and SOM values in USD Billions with clean tooltips and CAGR indicator.
* **Competitor Comparison Matrix:**
  - Filterable table displaying Competitor Name, URL, Threat Level badge (`HIGH`, `MEDIUM`, `LOW`), Strengths, Weaknesses, Pricing, and Founder Differentiation.
* **SWOT Grid:**
  - 2x2 structured matrix with subtle color accents (Strengths, Weaknesses, Opportunities, Threats).
* **Customer Pain Points & Risk Mitigation:**
  - Card list of pain points and severity.
  - Table of key operational/market risks paired with Claude's concrete mitigations.
* **Verified Citations & Footnotes:**
  - Table linking every claim to its crawled source URL.

### 5.5 Research History (`/history`)
* Table of all past research created by the logged-in user (`GET /research/history`).
* Columns: Title, Date, Viability Score badge, Status, and "View Report" button.

### 5.6 Admin Console (`/admin`)
* **Route Protection:** Accessible strictly when `user.role === 'admin'`.
* **Top Metric Cards:**
  - Total Platform Users
  - Total Researches Run
  - Pipeline Success Rate
* **Tab 1: Global Research Feed (`GET /research/admin/all`):**
  - Full table of every research job run across the platform with user email badges and inspection links.
* **Tab 2: User Management Roster:**
  - User accounts, roles (`ADMIN` vs `MEMBER`), 2FA verification status, and registration date.

---

## 6. Error Handling & Edge Cases

1. **SSE Connection Drop / Refresh:**
   - If user refreshes `/research/:id` mid-run, component checks `status`. If still `processing`, it reconnects to the SSE stream; if already `completed`, it displays the finished report immediately.
2. **Pipeline Failure (`status === 'failed'`):**
   - The stepper turns to an alert state displaying `error_message`, with a "Retry Research" button.
3. **RBAC Unauthorized Access (403):**
   - If a member attempts to manually navigate to `/admin` or view another user's research ID, they are redirected to `/` with a clean error toast.

---

## 7. Implementation Checklist

- [ ] Install / verify required icon & utility packages (`lucide-react`, `recharts`, `axios`, `clsx`, `tailwind-merge`).
- [ ] Configure Tailwind theme colors & fonts in `apps/web/tailwind.config.js`.
- [ ] Build API client & typed interfaces in `src/api/` and `src/types/`.
- [ ] Implement `AuthContext` and route guards (`ProtectedRoute`, `AdminRoute`).
- [ ] Implement Split Auth view (Signup Step 1 & 2 + Signin).
- [ ] Implement App Shell (`Layout` + `Sidebar`).
- [ ] Implement Research Studio form (`HomePage.tsx`).
- [ ] Implement Live Pipeline Stepper (`PipelineStepper.tsx`).
- [ ] Implement Executive Report & Recharts charts (`ResearchDetailPage.tsx`).
- [ ] Implement History page (`HistoryPage.tsx`).
- [ ] Implement Admin Console (`AdminPage.tsx`).
- [ ] Verify production build (`pnpm build:web`) and end-to-end integration.
