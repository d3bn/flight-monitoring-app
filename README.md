# Flight Disruption Monitoring System

A full-stack application for monitoring live flight departures, tracking disruption events, and managing a personal flight watchlist.

---

## Prerequisites

| Requirement | Version |
|-------------|---------|
| Node.js | >= 20 |
| npm | >= 10 |
| PostgreSQL | >= 14 |
| NestJS CLI *(optional)* | `npm i -g @nestjs/cli` |

### PostgreSQL — quick start with Docker

```bash
docker run --name flightmonitor-db \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=flightmonitor \
  -p 5432:5432 \
  -d postgres:16
```

---

## Project Structure

```
FlightMonitoringSystem/
├── backend/    NestJS + Fastify + TypeORM + PostgreSQL
└── frontend/   Vite + React + TanStack Query + DaisyUI
```

---

## Backend Setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env` and populate all values (see [Environment Variables](#environment-variables) below).

```bash
# Run database migrations
npm run migration:run

# Start in development mode (hot reload)
npm run start:dev
```

Backend runs at **http://localhost:3000**
Swagger UI available at **http://localhost:3000/api/docs**

---

## Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
```

```bash
npm run dev
```

Frontend runs at **http://localhost:5173**

---

## Environment Variables

### `backend/.env`

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Backend port | `3000` |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://postgres:postgres@localhost:5432/flightmonitor` |
| `AERODATABOX_API_KEY` | API key from [AeroDataBox](https://rapidapi.com/aerodatabox/api/aerodatabox) | `your_key_here` |
| `WEATHER_API_KEY` | API key from [WeatherAPI](https://www.weatherapi.com) | `your_key_here` |

### `frontend/.env`

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Backend base URL | `http://localhost:3000` |

---

## Architecture Decisions

### Backend: NestJS + Fastify
NestJS provides a structured, module-based DI framework that scales cleanly into Inc 2 and Inc 3 service boundaries. The Fastify adapter replaces Express for improved throughput with minimal config change.

### Database: PostgreSQL + TypeORM
PostgreSQL is chosen over SQLite to match production-realistic constraints — particularly event history volume in Inc 2 (PRAG-29 onwards). TypeORM is used via `@nestjs/typeorm` for its native NestJS integration and first-class migration support. `synchronize` is always `false`; schema changes go through versioned migrations.

### API Documentation: OpenAPI via @nestjs/swagger
All endpoints are decorated with `@ApiOperation`, `@ApiResponse`, etc. The Swagger UI auto-generates from these decorators and is available at `/api/docs` in development.

### Frontend: Vite + React (TypeScript)
Vite provides near-instant HMR and a minimal config surface. React with TypeScript keeps the codebase consistent with the backend's typed approach.

### Server State: TanStack Query (React Query v5)
All server data fetching goes through TanStack Query to get caching, background refetch, loading/error states, and later optimistic updates (watchlist in PRAG-6) for free.

### HTTP Client: Axios
A shared Axios instance in `src/lib/axios.ts` sets the `baseURL` from env and provides a single place to attach auth headers or interceptors in later increments.

### UI: DaisyUI + Tailwind CSS
DaisyUI provides semantic component classes (`btn`, `badge`, `card`, `navbar`) on top of Tailwind, keeping markup readable without a heavy component library.

---

## Available Scripts

### Backend

| Script | Description |
|--------|-------------|
| `npm run start:dev` | Start with hot reload |
| `npm run build` | Compile to `dist/` |
| `npm run migration:run` | Apply pending migrations |
| `npm run migration:generate` | Generate migration from entity changes |
| `npm run migration:revert` | Revert last migration |
| `npm test` | Run unit tests |

### Frontend

| Script | Description |
|--------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
