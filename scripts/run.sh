#!/usr/bin/env bash
# Local workflow CLI runner for Unix/macOS/Linux.
# Usage: ./scripts/run.sh [dev|dev:web|dev:api|build:web|db:migrate|db:seed|test]

set -e

COMMAND="${1:-help}"

case "$COMMAND" in
    dev)
        echo "Starting development servers..."
        pnpm dev:web
        ;;
    dev:web)
        pnpm --filter web dev
        ;;
    dev:api)
        source .venv/bin/activate 2>/dev/null || source .venv/Scripts/activate
        uvicorn services.api.main:app --reload
        ;;
    build:web)
        pnpm --filter web build
        ;;
    db:migrate)
        echo "Running database migrations..."
        source .venv/bin/activate 2>/dev/null || source .venv/Scripts/activate
        alembic upgrade head
        ;;
    db:seed)
        echo "Seeding database..."
        ;;
    test)
        echo "Running test suite..."
        ;;
    *)
        echo "Usage: ./scripts/run.sh [command]"
        echo "Commands:"
        echo "  dev         - Start local web frontend"
        echo "  dev:web     - Start Vite React frontend via pnpm"
        echo "  dev:api     - Start FastAPI backend with reload"
        echo "  build:web   - Build the frontend for production"
        echo "  db:migrate  - Apply pending Alembic migrations"
        echo "  db:seed     - Populate database with seed data"
        echo "  test        - Run test suite"
        exit 1
        ;;
esac
