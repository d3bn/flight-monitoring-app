# Architecture Decision Records

This directory holds **Architecture Decision Records (ADRs)** for the Flight
Disruption Monitoring System. Each ADR captures one significant decision, the
context in which it was made, and the trade-offs accepted.

## Why ADRs?

The product brief is explicitly designed to stress architectural adaptability
across three increments. ADRs let us:

- Record *why* a choice was made, not just *what* was chosen.
- Detect when an Inc 1 decision starts to crack under Inc 2 or Inc 3 pressure
  (the ADR's "Consequences" section is the contract being tested).
- Supersede decisions cleanly, with a paper trail, rather than rewriting.

## Conventions

- Files are numbered sequentially: `0001-short-title.md`, `0002-…`, …
- One decision per ADR. Split rather than bundle.
- Status is one of: `Proposed`, `Accepted`, `Superseded by ADR-XXXX`.
- Never edit an accepted ADR's decision after the fact — write a new ADR that
  supersedes it. The history matters.
- Cross-link Jira tickets in the **Related** field.

## Writing a new ADR

Copy `0000-adr-template.md` to the next available number and fill it in.
Reference the new ADR from the PR that implements the decision.

## Current ADRs

| #    | Title                                  | Status   | Increment |
|------|----------------------------------------|----------|-----------|
| 0001 | NestJS with Fastify adapter            | Accepted | Inc 1     |
| 0002 | PostgreSQL with TypeORM                | Accepted | Inc 1     |
