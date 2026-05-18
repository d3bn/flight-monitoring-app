# ADR 0002: PostgreSQL with TypeORM for persistence

- **Status:** Accepted
- **Date:** 2026-05-18
- **Increment:** Inc 1
- **Related:** PRAG-4, PRAG-11

## Context

PRAG-4 originally suggested SQLite as a file-backed local store, in keeping
with the "minimal abstraction" Inc 1 directive. The PRAG-4 comment overrode
this and confirmed **PostgreSQL** as the persistence target, citing
production-realistic constraints expected from Inc 2 onwards (event history
volume, more complex queries).

We need a persistence stack that:

- Works locally with a single Docker command for new developers.
- Can absorb Inc 2's event-sourced domain model (chronological events,
  filtering, derived state) without a storage migration.
- Has migration tooling so schema changes are reviewable and reversible.

## Decision

We will use **PostgreSQL ≥ 14** as the database, accessed via **TypeORM**
through `@nestjs/typeorm`. Schema changes are managed exclusively via TypeORM
migrations; `synchronize` is set to `false` everywhere except local-only test
bootstrap.

## Consequences

### Positive

- Postgres handles the event-volume and indexing needs Inc 2 will introduce
  without a storage swap.
- TypeORM integrates natively with NestJS modules (`TypeOrmModule.forRootAsync`
  + `forFeature`) and gives us a CLI for `migration:generate/run/revert`.
- A standalone `DataSource` (`backend/src/database/data-source.ts`) lets the
  TypeORM CLI run without bootstrapping the full Nest app.

### Negative / trade-offs

- Postgres is a heavier prerequisite than SQLite — new developers need a local
  install or the documented Docker command.
- TypeORM has rough edges (notably around relation eager-loading and migration
  generation accuracy). Acceptable for now; revisit in Inc 3 if friction grows.

### Neutral

- `synchronize: false` enforces migration discipline from day one, which is
  more work in Inc 1 but pays off the first time we change a column in Inc 2.

## Alternatives considered

- **SQLite (file-backed)** — the original PRAG-4 suggestion. Lightweight, but
  forces a migration before Inc 2 and doesn't reflect production-realistic
  query patterns.
- **Prisma over Postgres** — better DX than TypeORM, but the schema-first model
  and generated client felt heavier than needed for Inc 1 and would require
  rework if we later split the backend into multiple services with different
  schemas.
- **Knex / raw SQL** — minimal abstraction; rejected because we lose entity
  mapping convenience and migrations become hand-rolled.

## Notes

- The Inc 1 `watchlist_items` table is created via migration
  `1700000000000-CreateWatchlistItems.ts`. Inc 2's event-history tables will be
  added as additional migrations, not by modifying the existing one.
- The current smoke test (`database.smoke.spec.ts`) uses `synchronize: true`
  for test-time bootstrap. Acceptable short-term; ideally replaced by a test
  database seeded via migrations once Inc 2 introduces more than one table.
