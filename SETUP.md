# Setup Guide — Flight Disruption Monitoring System

Welcome! This guide walks you through everything you need to get started working on this project with **Claude Code** — the AI assistant that helps you write code, manage Jira tickets, and automate your workflow.

You do **not** need to be a developer to follow this guide. Each step is explained in plain language with clear instructions.

---

## What Does This Setup Do?

Once you complete this guide, the following things will happen **automatically**:

| What happens | When it happens |
|---|---|
| Your Jira ticket moves to **In Progress** | When Claude starts working on it |
| Your Jira ticket moves to **REVIEW** | When Claude finishes the code |
| Your Jira ticket moves to **QA** | When your Pull Request (code change) is merged |
| A comment with a link to the code change is added to the ticket | When the PR is merged |
| Automated test files are generated for the ticket | Within an hour of it reaching QA |

Think of it as a self-driving workflow — you pick the ticket, Claude does the work, and the board updates itself.

---

## Table of Contents

1. [Install Claude Code](#step-1-install-claude-code)
2. [Connect Jira to Claude](#step-2-connect-jira-to-claude)
3. [Connect GitHub to Claude](#step-3-connect-github-to-claude)
4. [Create a Jira API Key](#step-4-create-a-jira-api-key)
5. [Create a GitHub Access Token](#step-5-create-a-github-access-token)
6. [Add Secrets to the GitHub Repository](#step-6-add-secrets-to-the-github-repository)
7. [Set Up Your Local Project Files](#step-7-set-up-your-local-project-files)
8. [Enable Recommended Skills](#step-8-enable-recommended-skills)
9. [Verify Your Setup](#step-9-verify-your-setup)
10. [Understanding the Full Workflow](#step-10-understanding-the-full-workflow)
11. [Help & Troubleshooting](#help--troubleshooting)

---

## Step 1: Install Claude Code

**What is Claude Code?**  
Claude Code is an AI assistant that runs in your terminal (the command-line tool on your computer). It reads your project files, talks to Jira and GitHub on your behalf, and writes or reviews code for you.

**How to install it:**

1. Make sure you have **Node.js** installed. Check by opening your terminal and typing:
   ```
   node --version
   ```
   If you see a version number starting with `v20` or higher, you're good. If not, download it from [nodejs.org](https://nodejs.org) and install it.

2. Install Claude Code:
   ```
   npm install -g @anthropic-ai/claude-code
   ```

3. Start Claude Code for the first time:
   ```
   claude
   ```
   A browser window will open. Log in with your **Anthropic account**. If you don't have one, ask your team lead to invite you.

4. Once logged in, navigate to the project folder:
   ```
   cd /path/to/FlightMonitoringSystem
   claude
   ```

---

## Step 2: Connect Jira to Claude

**Why do we need this?**  
This connection allows Claude to read your Jira board, move tickets between lanes (To Do → In Progress → Review → QA), and post comments — without you having to do it manually.

**How to connect:**

1. Open this link in your browser:  
   👉 **https://claude.ai/customize/connectors**

2. Click **"Add connector"**

3. Find **Atlassian** in the list and click it

4. Click **"Authorise"** — a pop-up will ask you to log in to your Atlassian account (the same account you use to log into Jira)

5. Once authorised, you'll see **"Atlassian Rovo"** appear in your connectors list with a green tick ✅

**How to test it's working:**  
Open Claude Code and type:
```
Show me the tickets currently In Progress on the PRAG board
```
If Claude lists your Jira tickets, the connection is working.

---

## Step 3: Connect GitHub to Claude

**Why do we need this?**  
GitHub is where the code is stored. Claude needs to be able to read the code, create branches (isolated copies for new features), and open Pull Requests (requests to merge new code) on your behalf.

**How to install the GitHub CLI tool:**

1. On a Mac, open your terminal and run:
   ```
   brew install gh
   ```
   If you don't have Homebrew, install it first from [brew.sh](https://brew.sh).

2. Log in to GitHub:
   ```
   gh auth login
   ```

3. When prompted:
   - Choose **GitHub.com**
   - Choose **HTTPS**
   - Choose **Login with a web browser**
   - A code will appear in your terminal — copy it
   - A browser window will open — paste the code and click **Authorise**

4. Back in your terminal, you should see: `✓ Logged in as your-username`

---

## Step 4: Create a Jira API Key

**What is an API key?**  
Think of an API key like a special password that lets programs (like our automated workflow) talk to Jira on your behalf — without needing your actual password. It's separate from your login so you can revoke it at any time without changing your password.

**How to create one:**

1. Open this link:  
   👉 **https://id.atlassian.com/manage-profile/security/api-tokens**
   
   *(You'll need to be logged into your Atlassian account)*

2. Click **"Create API token"**

3. In the **Label** field, type: `flight-monitor-claude`

4. Click **"Create"**

5. A key will appear on screen — it looks something like `ATATT3xAB123...`

6. **Copy it immediately** and save it somewhere safe (like a password manager). You won't be able to see it again after closing this window.

> 🔒 **Keep this key private.** Don't share it in emails, Slack, or commit it to the code. It will be stored securely in the next step.

---

## Step 5: Create a GitHub Access Token

**What is this for?**  
The automated testing routine (which generates tests from your QA tickets) needs a separate GitHub token to read code changes and open draft Pull Requests.

**How to create one:**

1. Open this link (log into GitHub first):  
   👉 **https://github.com/settings/tokens**

2. Click **"Generate new token"** → choose **"Generate new token (classic)"**

3. In the **Note** field, type: `flight-monitor-e2e-agent`

4. Under **Expiration**, choose **90 days** or **No expiration** (your team's preference)

5. Under **Select scopes**, tick the box next to **`repo`** (this gives access to read and write to the repository)

6. Scroll to the bottom and click **"Generate token"**

7. A token will appear starting with `github_pat_...`

8. **Copy it immediately** — you won't see it again.

> 🔒 **Keep this token private** for the same reasons as the Jira key above.

---

## Step 6: Add Secrets to the GitHub Repository

**What are secrets?**  
Secrets are encrypted values stored inside GitHub. The automated workflows (like the one that moves Jira tickets to QA when a PR is merged) use these secrets to authenticate with Jira — without ever exposing them in the code.

**How to add them:**

1. Open this link:  
   👉 **https://github.com/d3bn/flight-monitoring-app/settings/secrets/actions**
   
   *(You need to be a repo admin or have been granted access)*

2. Click **"New repository secret"** for each of the three values below:

---

### Secret 1 — Your Atlassian site address

| Field | Value |
|---|---|
| **Name** | `JIRA_BASE_URL` |
| **Secret** | `https://dpbasan.atlassian.net` |

Click **"Add secret"**

---

### Secret 2 — Your Jira email address

| Field | Value |
|---|---|
| **Name** | `JIRA_USER_EMAIL` |
| **Secret** | *(your Atlassian account email, e.g. `dpbasan@gmail.com`)* |

Click **"Add secret"**

---

### Secret 3 — Your Jira API Key

| Field | Value |
|---|---|
| **Name** | `JIRA_API_TOKEN` |
| **Secret** | *(the key you copied in Step 4, starting with `ATATT3x...`)* |

Click **"Add secret"**

---

When done, your secrets page should show all three:

```
✅ JIRA_BASE_URL
✅ JIRA_USER_EMAIL
✅ JIRA_API_TOKEN
```

**What these secrets do:**  
Every time a Pull Request is merged into the main branch, GitHub automatically runs a small script that uses these secrets to log into Jira and move the related ticket to the **QA** lane — no manual action needed.

---

## Step 7: Set Up Your Local Project Files

The project needs a few configuration files on your computer that tell it where your database is and what API keys to use. These files are **not** stored in the code repository for security reasons.

### 7.1 Backend configuration

1. In your terminal, navigate to the backend folder:
   ```
   cd /path/to/FlightMonitoringSystem/backend
   ```

2. Copy the example file:
   ```
   cp .env.example .env
   ```

3. Open the `.env` file in any text editor and fill in the values:
   ```
   PORT=3000
   DATABASE_URL=postgresql://postgres:postgres@localhost:5432/flightmonitor
   AERODATABOX_API_KEY=your-key-here
   WEATHER_API_KEY=your-key-here
   ```

   - `AERODATABOX_API_KEY` — get a free key at [rapidapi.com/aedbx-aedbx/api/aerodatabox](https://rapidapi.com/aedbx-aedbx/api/aerodatabox)
   - `WEATHER_API_KEY` — ask your team lead for this

### 7.2 Frontend configuration

1. Navigate to the frontend folder:
   ```
   cd /path/to/FlightMonitoringSystem/frontend
   ```

2. Copy the example file:
   ```
   cp .env.example .env
   ```

3. The default value is fine for local development — no changes needed:
   ```
   VITE_API_BASE_URL=http://localhost:3000
   ```

---

## Step 8: Enable Recommended Skills

**What are skills?**  
Skills are pre-built instructions that teach Claude how to do specific tasks — like reviewing code, creating Jira tickets, or setting up a scheduled routine. Think of them as shortcuts.

**How to enable them:**

1. Open **https://claude.ai/customize**
2. Browse the available skills and enable the ones below

| Skill | What it does | When to use it |
|---|---|---|
| **schedule** | Creates automated routines that run on a timer | Setting up the E2E test generator |
| **simplify** | Reviews your code for quality after changes | After implementing a feature |
| **security-review** | Checks for security issues before merging | Before opening a Pull Request |
| **review** | Does a thorough review of a Pull Request | When reviewing a colleague's PR |

**How to use a skill:**  
In a Claude Code session, just type `/skill-name` or describe what you want:
```
/simplify
```
or
```
Run a security review on my current branch
```

---

## Step 9: Verify Your Setup

Go through this checklist to confirm everything is working:

```
□ Claude Code is installed
  → Run: claude --version

□ GitHub CLI is authenticated
  → Run: gh auth status
  → Should show: "Logged in to github.com as <your-username>"

□ Atlassian connector is active
  → Visit: https://claude.ai/customize/connectors
  → Should show Atlassian Rovo with a green tick

□ GitHub secrets are set (3 secrets)
  → Visit: https://github.com/d3bn/flight-monitoring-app/settings/secrets/actions
  → Should show JIRA_BASE_URL, JIRA_USER_EMAIL, JIRA_API_TOKEN

□ backend/.env exists and has DATABASE_URL filled in
  → Run: cat backend/.env

□ frontend/.env exists
  → Run: cat frontend/.env

□ Claude can see the Jira board
  → Ask Claude: "Show me the open tickets on the PRAG board"
  → Claude should list real tickets from Jira
```

If any step fails, see the [Help & Troubleshooting](#help--troubleshooting) section below.

---

## Step 10: Understanding the Full Workflow

Here is how a typical piece of work flows through the system once everything is set up:

```
YOU                        CLAUDE CODE                    AUTOMATED
─────                      ───────────                    ─────────

Pick a Jira ticket
(e.g. PRAG-71)
                      →    Reads ticket details
                           Moves ticket to IN PROGRESS
                           Writes the code & tests
                           Moves ticket to REVIEW
                           Opens a Pull Request
                                │
You review the PR              │
and click "Merge"   ──────────────────────────────→  Jira ticket moves to QA
                                                     Comment added to ticket
                                                          │
                                                     (within 1 hour)
                                                     E2E tests generated
                                                     Draft PR opened for
                                                     test review
```

### What is a Pull Request?

A **Pull Request (PR)** is a way to propose changes to the codebase. When Claude finishes work on a ticket, it bundles all the changes and submits them as a PR for a human to review before they go live. You review the changes, approve them, and click **Merge** — that's when everything becomes official.

### What are E2E tests?

**End-to-End (E2E) tests** are automated checks that simulate a real user using the app — clicking buttons, filling in forms, checking that things appear on screen. Once a ticket reaches QA, Claude's scheduled routine reads the ticket's requirements and automatically writes these tests, saving your QA team hours of manual scripting.

---

## Help & Troubleshooting

### "Claude can't see my Jira tickets"

Your Atlassian connector may have expired or not connected properly.

1. Go to https://claude.ai/customize/connectors
2. Remove the Atlassian connector if it exists
3. Re-add it following Step 2 above

---

### "The PR was merged but the Jira ticket didn't move to QA"

Check the three GitHub secrets:

1. Go to https://github.com/d3bn/flight-monitoring-app/settings/secrets/actions
2. Make sure all three secrets exist: `JIRA_BASE_URL`, `JIRA_USER_EMAIL`, `JIRA_API_TOKEN`
3. If a secret is wrong, click it and click **"Update"** to replace the value

Also check that the Pull Request title includes the ticket key in **uppercase**:
- ✅ Correct: `feat(PRAG-71): add Hello World endpoint`
- ❌ Won't work: `feat(prag-71): add Hello World endpoint`
- ❌ Won't work: `added hello world` *(no ticket key)*

---

### "The E2E routine isn't generating test files"

The routine only generates tests when a ticket moves to QA **within the last 90 minutes**. If nothing has moved recently, it does nothing and waits until next hour.

To check the routine's history:
1. Go to https://claude.ai/code/routines/trig_01V7ydQFz8yabejANxoteJyW
2. Look at the **Run History** to see what happened on the last run

---

### "I don't have permission to add GitHub secrets"

You need to be a repository admin. Ask your team lead (the person who owns the GitHub repository) to either:
- Add the secrets for you, or
- Grant you **Admin** access to the repository

---

### "I lost my Jira API key"

Jira API keys cannot be recovered once closed. Simply generate a new one:

1. Go to https://id.atlassian.com/manage-profile/security/api-tokens
2. Revoke the old key (click the bin icon next to it)
3. Create a new one following Step 4
4. Update the `JIRA_API_TOKEN` secret in GitHub following Step 6

---

### "I need to give a new team member access"

Each person needs their **own** Jira API token and their own connection in Claude. Share this setup guide with them and have them follow all steps. The GitHub secrets only need to be set once per repository — they don't need to be repeated per person.

---

## Quick Reference Card

Print this out or keep it handy:

```
┌─────────────────────────────────────────────────────────┐
│           FLIGHT MONITOR — QUICK REFERENCE              │
├─────────────────────────────────────────────────────────┤
│ Jira Board       https://dpbasan.atlassian.net          │
│ GitHub Repo      https://github.com/d3bn/               │
│                    flight-monitoring-app                 │
│ MCP Connectors   https://claude.ai/customize/connectors │
│ GitHub Secrets   github.com/d3bn/flight-monitoring-app/ │
│                    settings/secrets/actions              │
│ E2E Routine      https://claude.ai/code/routines/       │
│                    trig_01V7ydQFz8yabejANxoteJyW        │
│ Jira API Tokens  id.atlassian.com/manage-profile/       │
│                    security/api-tokens                   │
│ GitHub Tokens    github.com/settings/tokens             │
├─────────────────────────────────────────────────────────┤
│ PR TITLE FORMAT  feat(PRAG-NNN): short description      │
│ TICKET LANES     To Do → In Progress → Review → QA      │
│ E2E TESTS RUN    cd e2e && npm install && npm test      │
└─────────────────────────────────────────────────────────┘
```

---

*Last updated: 2026-05-25 · Questions? Ask your team lead or open a ticket on the PRAG board.*
