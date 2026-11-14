# SIRA — Startup Idea Research Agent

An autonomous AI agent designed to research, validate, and analyze startup ideas across market size, competitors, unit economics, and viability.

## Monorepo Structure

```text
├── apps/                          # Deployable frontends
│   └── web/                       # Web application dashboard
├── services/                      # Deployable backends
│   ├── api/                       # API gateway & HTTP handlers
│   └── agent/                     # Autonomous research & analysis agent
├── packages/                      # Shared libraries & utilities
│   ├── models/                    # Data models, contracts & schemas
│   ├── lib/                       # Common utilities, storage & adapters
│   └── db/                        # Database migrations & seeds
├── scripts/                       # Local workflow CLI (run.ps1 / run.sh)
├── docs/                          # Project documentation
│   └── file-structure.md          # Detailed file structure overview
├── .agents/rules/                 # Agent rules & constraints
├── AGENTS.md                      # AI agent source of truth
├── .env.example                   # Master env index
├── .env.example.api               # Backend & Agent env template
└── .env.example.web               # Web frontend env template
```

## Quick Start

1. **Environment Setup**:
   Copy the example environment files:
   ```bash
   cp .env.example.api services/api/.env
   cp .env.example.web apps/web/.env
   ```
2. **Local Workflow Script**:
   ```bash
   # Windows PowerShell
   .\scripts\run.ps1 dev

   # Bash
   ./scripts/run.sh dev
   ```

