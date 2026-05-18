# AGENTS.md

Guidelines for AI agents working on this project.

---

## Jira Board

- **Project:** Pragma Test (`PRAG`)
- **Cloud ID:** `54f8b670-ab2c-4236-b99a-89706a22bb36`
- **Transition IDs:** `21` = In Progress · `2` = REVIEW · `11` = To Do · `31` = Done

---

## Workflow — Per Sub-task

Follow this sequence for **every sub-task** without being asked:

1. **Move to In Progress** — transition the sub-task to `In Progress` (`21`) before writing any code
2. **Implement** — write the code for that sub-task only
3. **Comment on Jira** — add a `## Work Done — Moving to REVIEW` comment listing:
   - Every file created or modified with a short description of what it does
   - Acceptance criteria met (mapped against the ticket's "Done when" list)
4. **Move to REVIEW** — transition the sub-task to `REVIEW` (`2`)
5. **Git commit** — create one commit scoped to that sub-task's work (see commit format below)

Repeat for each sub-task before moving to the next.

---

## Workflow — Per Story / Task

- Move the **parent story/task** to `In Progress` (`21`) when its **first sub-task** starts
- Move the **parent story/task** to `REVIEW` (`2`) only after **all its sub-tasks** are in REVIEW
- Do not move the parent to REVIEW mid-way through

---

## Git Commit Format

One commit per sub-task, using conventional commits scoped to the Jira ticket key:

```
<type>(prag-<n>): <short description>

<body — what changed and why, bullet points if multiple files>

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
```

**Types:** `feat` · `fix` · `chore` · `test` · `docs` · `refactor`

**Example:**
```
feat(prag-13): add AeroDataBox departures integration and endpoint

- GET /flights/departures?airport=SYD proxies AeroDataBox API
- DeparturesService handles HTTP + error mapping
- DeparturesController decorated for OpenAPI

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
```

---

## Tech Stack

### Backend
| Concern | Choice |
|---------|--------|
| Framework | NestJS + Fastify adapter (`@nestjs/platform-fastify`) |
| Database | PostgreSQL via TypeORM (`@nestjs/typeorm`) |
| API Docs | OpenAPI via `@nestjs/swagger` — Swagger UI at `/api/docs` |
| Config | `@nestjs/config` with typed factory at `src/config/configuration.ts` |
| Migrations | TypeORM CLI — `synchronize` is always `false` |

### Frontend
| Concern | Choice |
|---------|--------|
| Scaffold | Vite + React (TypeScript) |
| HTTP | Axios — shared instance at `src/lib/axios.ts` |
| Server state | TanStack Query v5 (`@tanstack/react-query`) |
| UI | DaisyUI + Tailwind CSS |
| Routing | React Router v6 |

---

## Key Constraints

- **No `synchronize: true`** in production or staging TypeORM config — migrations only
- **No abstractions ahead of the increment** — Inc 1 is intentionally flat; service boundaries emerge in Inc 2
- **No auth / user accounts** — out of scope for all three increments
- **No Docker / CI required** for Inc 1 — optional nice-to-have
- **`.env` is always gitignored** — `.env.example` is always committed with placeholders

---

## Environment Variables

### Backend (`backend/.env`)
```
PORT=3000
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/flightmonitor
AERODATABOX_API_KEY=
WEATHER_API_KEY=
```

### Frontend (`frontend/.env`)
```
VITE_API_BASE_URL=http://localhost:3000
```

---

## Story Map (Inc 1 — PRAG-1)

| Story | Sub-tasks |
|-------|-----------|
| PRAG-4 Project Setup | PRAG-9, PRAG-10, PRAG-11, PRAG-12 |
| PRAG-5 View Departures | PRAG-13, PRAG-14, PRAG-15, PRAG-16 |
| PRAG-6 Watchlist | PRAG-17, PRAG-18, PRAG-19, PRAG-20 |
| PRAG-7 Weather Risk | PRAG-21, PRAG-22, PRAG-23, PRAG-24 |
| PRAG-8 Flight Detail | PRAG-25, PRAG-26, PRAG-27 |
