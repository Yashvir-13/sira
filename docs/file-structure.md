# Workspace File Structure

This repository is organized as a modular monorepo cleanly separating client frontends, backend services, and shared packages.

```
├── apps/                          # Deployable frontends (any stack)
│   └── web/                       # Primary web app (React | Next | Vue | …)
│       ├── src/
│       │   ├── api/               # HTTP clients / SDK wrappers
│       │   ├── assets/            # Static assets bundled with app
│       │   ├── components/        # UI components by feature
│       │   ├── hooks/             # Custom hooks / composables / stores
│       │   ├── lib/               # Utilities, config, auth helpers
│       │   ├── state/             # Client state management
│       │   ├── styles/            # Global and modular CSS/styles
│       │   └── types/             # Frontend-specific or shared API contract types
│       └── public/                # Static public assets served as-is
│
├── services/                      # Deployable backends (any stack)
│   ├── api/                       # HTTP API service
│   │   ├── routes/                # Request handlers and controllers
│   │   └── app.entry              # Framework bootstrap entry point
│   └── agent/                     # Autonomous research agent / worker service
│
├── packages/                      # Shared, stack-agnostic packages
│   ├── models/                    # Shared data models, entities, and enums
│   ├── lib/                       # Common utilities, db adapters, storage, errors
│   └── db/                        # Database schemas, migrations, and seeds
│       ├── migrations/            # Version-controlled schema migrations
│       └── seeds/                 # Initial and test seed data
│
├── scripts/                       # Local workflow automation CLI
│   └── run.*                      # Scripts for dev, db, and migration tasks
│
├── docs/                          # Architecture & developer documentation
│   └── file-structure.md          # File structure specification (this file)
│
├── .agents/rules/                 # Agent rules & constraints (tool-neutral)
├── AGENTS.md                      # Source of truth and instructions for AI agents
│
├── .env.example                   # Master environment template (index)
├── .env.example.api               # Backend API & Agent environment variables
├── .env.example.web               # Frontend web environment variables
│
└── README.md                      # Project overview and setup guide
```

