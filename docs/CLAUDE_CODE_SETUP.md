# Claude Code Setup Guide

> For developers and BAs working on the **Flight Disruption Monitoring System**.  
> This guide covers everything needed to get Claude Code working with the full Jira + GitHub automation workflow.

---

## Table of Contents

1. [Prerequisites](#1-prerequisites)
2. [Install Claude Code](#2-install-claude-code)
3. [MCP Connectors](#3-mcp-connectors)
4. [Recommended Skills](#4-recommended-skills)
5. [Jira API Token](#5-jira-api-token)
6. [GitHub Personal Access Token](#6-github-personal-access-token)
7. [GitHub Repository Secrets](#7-github-repository-secrets)
8. [Local Environment Variables](#8-local-environment-variables)
9. [Automated Workflow Overview](#9-automated-workflow-overview)
10. [E2E Test Routine (Scheduled Agent)](#10-e2e-test-routine-scheduled-agent)
11. [Verifying Everything Works](#11-verifying-everything-works)
12. [Troubleshooting](#12-troubleshooting)

---

## 1. Prerequisites

| Tool | Version | Install |
|------|---------|---------|
| Node.js | ≥ 20 | https://nodejs.org |
| npm | ≥ 10 | bundled with Node |
| Git | any | https://git-scm.com |
| GitHub CLI (`gh`) | ≥ 2.x | `brew install gh` / https://cli.github.com |
| PostgreSQL | ≥ 14 | `brew install postgresql` |

---

## 2. Install Claude Code

```bash
npm install -g @anthropic-ai/claude-code
```

Authenticate on first launch:

```bash
claude
```

Follow the browser prompt to log in with your Anthropic account. You must have access to the **Pragma Test** Claude Code organisation.

---

## 3. MCP Connectors

MCP (Model Context Protocol) connectors give Claude Code live access to external services. This project uses **Atlassian (Jira)**.

### 3.1 Connect Atlassian / Jira

1. Open **https://claude.ai/customize/connectors**
2. Click **Add connector → Atlassian**
3. Authorise with your Atlassian account (`dpbasan@gmail.com` or your own)
4. Once connected, the connector will appear as **Atlassian Rovo** in Claude Code sessions

> **What it unlocks:** Claude can read/create/update Jira tickets, transition them between lanes, add comments, and search the board — all without you copying and pasting ticket content.

### 3.2 Verify the connector is active

In a Claude Code session, ask:

```
What tickets are currently In Progress on the PRAG board?
```

Claude should list them live from Jira. If it can't, re-check the connector at https://claude.ai/customize/connectors.

---

## 4. Recommended Skills

Skills extend Claude Code with specialised workflows. Enable these from **https://claude.ai/customize** or from inside a Claude Code session.

| Skill | Purpose | How to trigger |
|-------|---------|----------------|
| **`schedule`** | Create/manage recurring remote agent routines | `/schedule` or say "set up a routine" |
| **`simplify`** | Review changed code for quality and duplication | `/simplify` after implementing a feature |
| **`security-review`** | Check pending branch changes for vulnerabilities | `/security-review` before raising a PR |
| **`review`** | Full pull request review | `/review` on an open PR |
| **`init`** | Bootstrap a `CLAUDE.md` for a new repo | `/init` in a new project |
| **`fewer-permission-prompts`** | Auto-allowlist common read-only commands | `/fewer-permission-prompts` |

---

## 5. Jira API Token

Claude Code uses your personal Jira API token to call the Jira REST API on your behalf (transitions, comments, search).

### 5.1 Generate a token

1. Go to **https://id.atlassian.com/manage-profile/security/api-tokens**
2. Click **Create API token**
3. Label it `claude-code-flight-monitor`
4. Copy the token — **you will not see it again**

### 5.2 Where it is used

| Location | Purpose |
|----------|---------|
| Atlassian MCP connector (auto) | Live Jira access in Claude Code sessions |
| GitHub Secret `JIRA_API_TOKEN` | Auto-transition workflow (see §7) |
| Scheduled E2E routine prompt | E2E generator reads QA tickets (see §10) |

> **Security:** Never commit the token to the repo. It lives only in GitHub Secrets and the secure routine prompt stored in Anthropic's infrastructure.

---

## 6. GitHub Personal Access Token

Needed by the scheduled E2E agent to read PR diffs and open draft PRs.

### 6.1 Generate a token

1. Go to **https://github.com/settings/tokens** → **Generate new token (classic)**
2. Label it `claude-code-e2e-agent`
3. Select scope: **`repo`** (full repo access)
4. Click **Generate token** and copy it

### 6.2 Where it is used

| Location | Purpose |
|----------|---------|
| GitHub Secret `GH_PAT` *(optional)* | If you want Claude-initiated pushes to bypass branch protection |
| Scheduled E2E routine prompt | Agent fetches PR diffs and creates draft PRs |

---

## 7. GitHub Repository Secrets

Three secrets must be set in the GitHub repo for the **auto-transition workflow** (`.github/workflows/jira-transition.yml`) to function.

### 7.1 Add secrets

1. Open **https://github.com/d3bn/flight-monitoring-app/settings/secrets/actions**
2. Click **New repository secret** for each:

| Secret name | Value | Where to get it |
|-------------|-------|----------------|
| `JIRA_BASE_URL` | `https://dpbasan.atlassian.net` | Your Atlassian site URL |
| `JIRA_USER_EMAIL` | `dpbasan@gmail.com` | Your Atlassian account email |
| `JIRA_API_TOKEN` | `ATATT3x...` | Generated in §5 |

### 7.2 What these secrets power

```
PR merged into main
       │
       ▼
.github/workflows/jira-transition.yml
       │
       ├─ Extracts PRAG-NNN from PR title
       ├─ POST /rest/api/3/issue/PRAG-NNN/transitions  → moves to QA
       └─ POST /rest/api/3/issue/PRAG-NNN/comment      → posts PR link
```

> **PR title format required:** `<type>(PRAG-NNN): description`  
> Example: `feat(PRAG-71): add Hello World endpoint`  
> The regex extracts every `PRAG-[0-9]+` match, so multi-ticket PRs (`PRAG-15+PRAG-16`) work too.

---

## 8. Local Environment Variables

Copy the example files and fill in your values. **Never commit `.env` files.**

### 8.1 Backend

```bash
cp backend/.env.example backend/.env
```

```env
# backend/.env
PORT=3000
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/flightmonitor
AERODATABOX_API_KEY=<your RapidAPI key for AeroDataBox>
WEATHER_API_KEY=<your weather API key>
```

Get an AeroDataBox key at **https://rapidapi.com/aedbx-aedbx/api/aerodatabox**.

### 8.2 Frontend

```bash
cp frontend/.env.example frontend/.env
```

```env
# frontend/.env
VITE_API_BASE_URL=http://localhost:3000
```

---

## 9. Automated Workflow Overview

Once all secrets are configured, this is the full end-to-end flow:

```
┌─────────────────────────────────────────────────────────────────┐
│                     DEVELOPER WORKFLOW                          │
│                                                                 │
│  1. Pick a Jira ticket (e.g. PRAG-71)                          │
│  2. Claude Code moves it → In Progress                         │
│  3. Claude implements the feature + tests                       │
│  4. One git commit per sub-task                                 │
│     format: feat(PRAG-71): description                         │
│  5. Claude moves ticket → REVIEW + adds comment                │
│  6. Claude pushes branch + opens PR                            │
│     PR title: feat(PRAG-71): description                       │
│                                                                 │
│                         ▼ you review + merge                   │
│                                                                 │
│  7. GitHub Actions: jira-transition.yml fires                  │
│     → ticket moves to QA automatically                         │
│     → comment with PR link posted on ticket                    │
│                                                                 │
│  8. Scheduled routine fires within the hour                    │
│     → reads ticket AC + PR diff from Jira & GitHub            │
│     → generates e2e/PRAG-71.spec.ts (Playwright)              │
│     → opens draft PR for review                                │
└─────────────────────────────────────────────────────────────────┘
```

### Jira lane transitions

| ID | Lane | Triggered by |
|----|------|-------------|
| `21` | In Progress | Claude at task start |
| `2` | REVIEW | Claude after implementation |
| `3` | QA | GitHub Actions on PR merge |
| `31` | Done | Manual (after QA sign-off) |

---

## 10. E2E Test Routine (Scheduled Agent)

A remote Claude Code agent runs **every hour** and auto-generates Playwright E2E tests for any ticket that just landed in QA.

### 10.1 Routine details

| | |
|--|--|
| **Name** | PRAG E2E Test Generator |
| **ID** | `trig_01V7ydQFz8yabejANxoteJyW` |
| **Schedule** | Every hour (`0 * * * *` UTC) |
| **Manage** | https://claude.ai/code/routines/trig_01V7ydQFz8yabejANxoteJyW |

### 10.2 What the agent does each run

```
1. Query Jira for PRAG tickets moved to QA in the last 90 min
2. For each ticket:
   a. Skip if branch e2e/PRAG-NNN already exists        → idempotent
   b. Skip if ticket is docs-only (README, config)      → no test needed
   c. Find the merged PR via GitHub search
   d. Fetch the PR diff
   e. Read relevant source files from the repo
3. First run only: scaffold e2e/ with playwright.config.ts
4. Generate e2e/PRAG-NNN.spec.ts:
   - API tickets  → Playwright request fixture → tests :3000
   - UI tickets   → Playwright page fixture   → tests :5173
5. Push branch e2e/PRAG-NNN
6. Open draft PR on GitHub for human review
```

### 10.3 Running E2E tests locally

```bash
# Start backend and frontend first:
cd backend && npm run start:dev   # runs on :3000
cd frontend && npm run dev        # runs on :5173

# Then in a third terminal:
cd e2e
npm install
npx playwright install chromium
npm test
```

### 10.4 Updating the routine

To change the schedule, prompt, or credentials:

1. Go to **https://claude.ai/code/routines/trig_01V7ydQFz8yabejANxoteJyW**
2. Or ask Claude Code: *"Update the E2E test generator routine to run every 2 hours"*

---

## 11. Verifying Everything Works

Run through this checklist after setup:

```
[ ] claude --version                      → prints a version
[ ] gh auth status                        → shows authenticated as d3bn
[ ] Atlassian connector active            → claude.ai/customize/connectors
[ ] GitHub secrets set (3 secrets)        → github.com/.../settings/secrets/actions
[ ] backend/.env exists with DB URL       → cat backend/.env
[ ] frontend/.env exists                  → cat frontend/.env
[ ] backend tests pass                    → cd backend && npm test
[ ] frontend tests pass                   → cd frontend && npm test
[ ] Ask Claude: "Show me PRAG board"      → lists live Jira tickets
[ ] Merge a test PR                       → ticket moves to QA automatically
[ ] Check routine page                    → https://claude.ai/code/routines
```

---

## 12. Troubleshooting

### Jira transition workflow fails with exit code 3
**Cause:** `JIRA_BASE_URL` secret is empty.  
**Fix:** Add all three secrets at `github.com/d3bn/flight-monitoring-app/settings/secrets/actions`.

### Jira transition workflow fails with exit code 43
**Cause:** `base64` wrapping — fixed in the current workflow (`base64 -w 0`).  
**Fix:** Ensure you're on the latest `main` which includes the fix from `fix/PRAG-72-base64-wrap`.

### Claude can't find Jira tickets
**Cause:** Atlassian MCP connector not connected or expired.  
**Fix:** Re-authorise at https://claude.ai/customize/connectors.

### E2E routine opens no PRs
**Cause 1:** No tickets moved to QA in the last 90 minutes — expected behaviour.  
**Cause 2:** `e2e/PRAG-NNN` branch already exists — skipped intentionally.  
**Cause 3:** GitHub PAT expired. Regenerate at https://github.com/settings/tokens and update the routine prompt at https://claude.ai/code/routines.

### `gh pr create` fails with "not authenticated"
```bash
gh auth login
# Choose GitHub.com → HTTPS → authenticate via browser
```

### Backend build fails with `TS2593: Cannot find name 'describe'`
**Cause:** `@types/jest` not installed or `tsconfig.json` missing `"types": ["jest", "node"]`.  
**Fix:**
```bash
cd backend && npm install
```
Verify `backend/tsconfig.json` contains `"types": ["jest", "node"]`.

### Frontend build fails with `Property 'env' does not exist on type 'ImportMeta'`
**Cause:** `vite/client` missing from `frontend/tsconfig.json` types array.  
**Fix:** Ensure `frontend/tsconfig.json` contains:
```json
"types": ["vite/client", "vitest/globals", "@testing-library/jest-dom"]
```

---

## Quick Reference

```bash
# Start development
cd backend  && npm run start:dev
cd frontend && npm run dev

# Run tests
cd backend  && npm test
cd frontend && npm test

# Run E2E tests (requires running backend + frontend)
cd e2e && npm test

# Create a PR (Claude Code handles this, but manual fallback):
gh pr create --title "feat(PRAG-NNN): description"

# Check CI status
gh run list --limit 5

# Re-run a failed CI job
gh run rerun <run-id> --failed
```

---

*Last updated: 2026-05-25 — maintained alongside `AGENTS.md`*
