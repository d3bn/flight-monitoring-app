# Flight Disruption Monitoring System (Testing)

A full-stack application for monitoring live flight departures, tracking disruption events, and managing a personal flight watchlist.

> 👋 **New to this project?** Start with [SETUP.md](./SETUP.md) to connect Claude Code with Jira and GitHub before running anything locally.

---

## Prerequisites

| Tool | Version | Install |
|------|---------|---------|
| Node.js | ≥ 20 | https://nodejs.org |
| npm | ≥ 10 | bundled with Node |
| PostgreSQL | ≥ 14 | `brew install postgresql` |
| Git | any | https://git-scm.com |
| GitHub CLI | ≥ 2 | `brew install gh` |

---

## Quick Start

### 1. Clone the repository

```bash
git clone https://github.com/d3bn/flight-monitoring-app.git
cd flight-monitoring-app
```

### 2. Install dependencies

```bash
# Backend
cd backend && npm install

# Frontend
cd ../frontend && npm install
```

### 3. Set up environment variables

**Backend** — copy the example and fill in your values:

```bash
cd backend
cp .env.example .env
```

```env
PORT=3000
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/flightmonitor
AERODATABOX_API_KEY=        # get from https://rapidapi.com/aedbx-aedbx/api/aerodatabox
WEATHER_API_KEY=            # ask your team lead
```

**Frontend** — the default works for local development:

```bash
cd frontend
cp .env.example .env
```

```env
VITE_API_BASE_URL=http://localhost:3000
```

### 4. Create and migrate the database

```bash
# Create the database (run once)
createdb flightmonitor

# Run migrations
cd backend && npm run migration:run
```

### 5. Start the application

Open two terminal tabs:

```bash
# Tab 1 — Backend (runs on http://localhost:3000)
cd backend && npm run start:dev

# Tab 2 — Frontend (runs on http://localhost:5173)
cd frontend && npm run dev
```

The app is now running at **http://localhost:5173**  
API docs (Swagger) are available at **http://localhost:3000/api/docs**

---

## Running Tests

```bash
# Backend unit tests
cd backend && npm test

# Frontend unit tests
cd frontend && npm test

# Frontend test coverage
cd frontend && npm run test:coverage

# E2E tests (requires backend + frontend running)
cd e2e && npm install && npx playwright install chromium && npm test
```

---

## Project Structure

```
flight-monitoring-app/
├── backend/                   # NestJS + Fastify API
│   ├── src/
│   │   ├── config/            # Typed environment config
│   │   ├── database/          # TypeORM setup + migrations
│   │   ├── flights/           # Departures endpoint + AeroDataBox proxy
│   │   ├── health/            # GET /health
│   │   ├── hello/             # GET /hello
│   │   └── watchlist/         # Watchlist entity (placeholder)
│   ├── .env.example
│   ├── tsconfig.json
│   └── tsconfig.build.json
│
├── frontend/                  # Vite + React SPA
│   ├── src/
│   │   ├── components/        # AirportSearch, DeparturesList, StatusBadge
│   │   ├── hooks/             # useDepartures (TanStack Query)
│   │   ├── lib/               # Shared Axios instance
│   │   ├── pages/             # Home, Watchlist
│   │   └── types/             # Shared TypeScript types
│   ├── .env.example
│   └── vite.config.ts
│
├── e2e/                       # Playwright E2E tests (auto-generated)
│   └── playwright.config.ts
│
├── .github/
│   └── workflows/
│       ├── ci.yml             # Build + test on every PR
│       └── jira-transition.yml # Auto-moves Jira ticket to QA on merge
│
├── docs/                      # Architecture decision records
├── AGENTS.md                  # Claude Code agent workflow rules
├── SETUP.md                   # Jira + GitHub integration guide
└── README.md                  # This file
```

---

## Environment Variable Reference

### Backend (`backend/.env`)

| Variable | Required | Description |
|----------|----------|-------------|
| `PORT` | No | API port — defaults to `3000` |
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `AERODATABOX_API_KEY` | Yes | RapidAPI key for AeroDataBox flight data |
| `WEATHER_API_KEY` | No | Weather API key (used in Inc 2) |

### Frontend (`frontend/.env`)

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_API_BASE_URL` | Yes | Backend base URL — defaults to `http://localhost:3000` |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend framework | NestJS + Fastify adapter |
| Database | PostgreSQL + TypeORM (migrations only — `synchronize: false`) |
| API docs | OpenAPI via `@nestjs/swagger` at `/api/docs` |
| Frontend scaffold | Vite + React (TypeScript) |
| HTTP client | Axios — shared instance at `src/lib/axios.ts` |
| Server state | TanStack Query v5 |
| UI components | DaisyUI + Tailwind CSS |
| Routing | React Router v6 |
| Backend tests | Jest + ts-jest |
| Frontend tests | Vitest + React Testing Library |
| E2E tests | Playwright |

---

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/health` | Health check — returns `{ status, timestamp }` |
| `GET` | `/hello` | Hello World — returns `{ message: "Hello World" }` |
| `GET` | `/flights/departures?airport=SYD` | Upcoming departures from a given airport |

---

## Database Migrations

```bash
# Run pending migrations
cd backend && npm run migration:run

# Revert last migration
cd backend && npm run migration:revert

# Generate a new migration (after editing an entity)
cd backend && npm run migration:generate -- src/database/migrations/MigrationName
```

> **Never** set `synchronize: true` — all schema changes must go through migrations.

---

## CI / CD

Every pull request and push to `main` runs the CI pipeline (`.github/workflows/ci.yml`):

- **Backend job** — `npm ci` → `nest build` → `migration:run` → `jest`
- **Frontend job** — `npm ci` → `tsc && vite build`

When a PR is **merged**, a second workflow (`.github/workflows/jira-transition.yml`) automatically moves the related Jira ticket to **QA**.

---

*For Jira + GitHub + Claude Code integration, see [SETUP.md](./SETUP.md).*
