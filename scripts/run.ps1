<#
.SYNOPSIS
    Local workflow CLI runner for Windows PowerShell.
.DESCRIPTION
    Provides a single entry point for local development, database operations, and migrations.
.EXAMPLE
    .\scripts\run.ps1 dev
    .\scripts\run.ps1 dev:web
    .\scripts\run.ps1 dev:api
    .\scripts\run.ps1 db:migrate
#>

param(
    [Parameter(Position=0)]
    [string]$Command = "help"
)

switch ($Command) {
    "dev" {
        Write-Host "Starting development servers..." -ForegroundColor Cyan
        pnpm dev:web
    }
    "dev:web" {
        pnpm --filter web dev
    }
    "dev:api" {
        & .\.venv\Scripts\python -m uvicorn services.api.main:app --reload
    }
    "build:web" {
        pnpm --filter web build
    }
    "db:migrate" {
        Write-Host "Running database migrations..." -ForegroundColor Cyan
        & .\.venv\Scripts\alembic upgrade head
    }
    "db:seed" {
        Write-Host "Seeding database..." -ForegroundColor Cyan
    }
    "test" {
        Write-Host "Running tests..." -ForegroundColor Cyan
    }
    default {
        Write-Host "Usage: .\scripts\run.ps1 [command]" -ForegroundColor Yellow
        Write-Host "Commands:"
        Write-Host "  dev         - Start local web frontend"
        Write-Host "  dev:web     - Start Vite React frontend via pnpm"
        Write-Host "  dev:api     - Start FastAPI backend with reload"
        Write-Host "  build:web   - Build the frontend for production"
        Write-Host "  db:migrate  - Apply pending Alembic migrations"
        Write-Host "  db:seed     - Populate database with seed data"
        Write-Host "  test        - Run test suite"
    }
}
