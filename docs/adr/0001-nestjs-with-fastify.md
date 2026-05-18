# ADR 0001: NestJS with Fastify adapter for the backend

- **Status:** Accepted
- **Date:** 2026-05-18
- **Increment:** Inc 1
- **Related:** PRAG-4, PRAG-10

## Context

The brief intentionally pushes us to deliver Inc 1 quickly while leaving the
architecture in a state that can evolve under Inc 2 (event sourcing, richer
domain) and Inc 3 (real-time push, provider abstraction, reconciliation).

We need a backend framework that:

- Boots a `/health` endpoint and a few REST controllers without ceremony.
- Has a credible path to introducing service boundaries, DI-managed providers,
  schedulers, and WebSocket gateways without a rewrite.
- Is familiar enough to the team that Inc 1 velocity is not bottlenecked on
  framework ramp-up.

The original PRAG-4 ticket left framework choice open ("e.g., Node/Express,
FastAPI, etc."). The PRAG-4 comment overrode that with a confirmed stack.

## Decision

We will use **NestJS** as the backend framework, swapping its default Express
adapter for the **Fastify adapter** (`@nestjs/platform-fastify`).

## Consequences

### Positive

- Built-in DI container and module system give us a clean place to drop the
  provider abstraction layer required in Inc 3 without restructuring the app.
- First-class support for WebSocket gateways and schedulers maps directly to
  Inc 2 (refresh strategies) and Inc 3 (push updates).
- `@nestjs/swagger` produces an OpenAPI spec from controller decorators, which
  satisfies API documentation needs cheaply (see ADR-0003).
- Fastify gives measurably better throughput than Express with no code-level
  difference for our use case.

### Negative / trade-offs

- More boilerplate than a minimal Express/Fastify app for Inc 1's small surface
  area. The brief explicitly warns against premature structure — we accept this
  cost because the decomposition cost in Inc 2/3 would be larger.
- A small subset of Express-only middleware does not work under Fastify; we
  must check compatibility before adopting third-party middleware.

### Neutral

- TypeScript-first; aligns with the frontend stack (Vite + React + TS).

## Alternatives considered

- **Express (plain)** — fastest to bootstrap, but no structural support for the
  Inc 2/3 evolution. Would force a refactor or a parallel framework decision.
- **Fastify (plain)** — better perf than Express but same structural gap as
  plain Express.
- **FastAPI (Python)** — strong typing and ergonomics, but splits the language
  context between frontend (TS) and backend (Python), and the team's velocity
  with Node is higher.

## Notes

- Reassess in Inc 3 if the WebSocket layer or provider reconciliation pushes us
  toward splitting the backend into multiple services. NestJS supports this via
  microservices transport, so the migration is incremental rather than a
  rewrite.
