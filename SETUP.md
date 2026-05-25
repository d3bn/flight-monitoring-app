# Claude Code Integration Setup

This guide connects **Claude Code** to your Jira board and GitHub repository so the two systems work together automatically. Once complete, Claude will be able to read and update Jira tickets, push code, and open Pull Requests — and your board will update itself when work is merged.

> 💻 **Looking for how to run the app locally?** That's in [README.md](./README.md).

---

## What You Get After This Setup

| This happens automatically | When |
|---|---|
| Jira ticket moves to **In Progress** | Claude starts working on a ticket |
| Jira ticket moves to **Review** | Claude finishes and raises a Pull Request |
| Jira ticket moves to **QA** | The Pull Request is merged |
| A comment with the PR link appears on the ticket | The Pull Request is merged |
| Playwright E2E tests are generated for the ticket | Within 1 hour of reaching QA |

---

## What You Need

Before starting, make sure you have access to:

- ✅ An **Anthropic account** (to use Claude Code) — ask your team lead if you don't have one
- ✅ An **Atlassian account** (your Jira login)
- ✅ A **GitHub account** with access to this repository
- ✅ Admin access to the GitHub repository to add secrets (or ask someone who does)

---

## Step 1 — Install Claude Code

Claude Code is the AI assistant that connects everything together. Install it once on your machine.

1. Open your terminal and run:
   ```
   npm install -g @anthropic-ai/claude-code
   ```

2. Launch it and log in when the browser opens:
   ```
   claude
   ```

3. Once logged in, open Claude Code inside this project folder:
   ```
   cd /path/to/flight-monitoring-app
   claude
   ```

That's it — Claude Code is ready.

---

## Step 2 — Connect Claude to Jira

This gives Claude live access to your Jira board so it can read tickets, move them between lanes, and add comments.

1. Go to 👉 **https://claude.ai/customize/connectors**

2. Click **Add connector**

3. Select **Atlassian** from the list

4. Click **Authorise** and log in with the same account you use for Jira

5. You'll see **Atlassian Rovo** appear with a green tick ✅

**Test it:** In a Claude Code session, say:
> *"Show me the open tickets on the PRAG board"*

Claude should list your real Jira tickets. If it does, you're connected.

---

## Step 3 — Connect Claude to GitHub

This lets Claude push code changes and open Pull Requests on your behalf.

1. Install the GitHub command-line tool:
   ```
   brew install gh
   ```
   *(On Windows, download from https://cli.github.com)*

2. Log in to GitHub:
   ```
   gh auth login
   ```

3. When asked:
   - Choose **GitHub.com**
   - Choose **HTTPS**
   - Choose **Login with a web browser**
   - Copy the one-time code shown in your terminal, paste it in the browser window that opens, and click **Authorise**

4. You should see: `✓ Logged in as your-github-username`

---

## Step 4 — Generate a Jira API Token

The automation that moves your Jira ticket to **QA** when a PR is merged needs a special key to identify itself to Jira. This is different from your password — it can be revoked any time without affecting your account.

1. Go to 👉 **https://id.atlassian.com/manage-profile/security/api-tokens**

2. Click **Create API token**

3. Name it `flight-monitor-claude` and click **Create**

4. **Copy the token immediately** — it won't be shown again. Save it in a password manager.

> 🔒 Never paste this token into Slack, email, or code. It goes only into the GitHub secrets in the next step.

---

## Step 5 — Add the Jira Token to GitHub Secrets

GitHub Secrets are a secure vault inside the repository. The automated workflow that moves Jira tickets on merge reads your token from here — it's never visible in the code.

1. Go to 👉 **https://github.com/d3bn/flight-monitoring-app/settings/secrets/actions**
   *(You need Admin access — ask your team lead if you can't see this page)*

2. Click **New repository secret** and add each of the three secrets below:

---

**Secret 1**

| Field | What to enter |
|---|---|
| Name | `JIRA_BASE_URL` |
| Secret | `https://dpbasan.atlassian.net` |

---

**Secret 2**

| Field | What to enter |
|---|---|
| Name | `JIRA_USER_EMAIL` |
| Secret | Your Atlassian account email (e.g. `you@example.com`) |

---

**Secret 3**

| Field | What to enter |
|---|---|
| Name | `JIRA_API_TOKEN` |
| Secret | The token you copied in Step 4 |

---

When done, the secrets page should show:

```
✅ JIRA_BASE_URL
✅ JIRA_USER_EMAIL  
✅ JIRA_API_TOKEN
```

---

## Step 6 — Enable Recommended Skills

Skills give Claude shortcuts for common tasks. Enable these once and they're available in every Claude Code session.

1. Go to 👉 **https://claude.ai/customize**

2. Enable the following skills:

| Skill | What it does |
|---|---|
| **schedule** | Create automated routines (like the E2E test generator) |
| **review** | Ask Claude to review a Pull Request |
| **security-review** | Check your code for security issues before merging |
| **simplify** | Review code quality after implementing a feature |

**How to use a skill** — just say it naturally in Claude Code:
> *"Review this pull request"*  
> *"Run a security review on my current branch"*

---

## Step 7 — Verify Everything is Connected

Ask Claude these questions in a session. Each one tests a different connection:

| Ask Claude this | If it works |
|---|---|
| *"Show me the In Progress tickets on the PRAG board"* | Lists real Jira tickets |
| *"What's the latest merged PR in this repo?"* | Describes a real GitHub PR |
| *"What does the health endpoint return?"* | Reads the source code and answers |

If all three work, your setup is complete.

---

## How the Workflow Works

Once connected, this is the full journey of a piece of work:

```
You tell Claude which ticket to work on
          │
          ▼
Claude reads the ticket from Jira
Claude moves the ticket → IN PROGRESS
Claude writes the code and tests
Claude moves the ticket → REVIEW
Claude opens a Pull Request on GitHub
          │
          ▼
You review the Pull Request and click Merge
          │
          ├──▶ Jira ticket moves to QA  (automatic)
          ├──▶ PR link posted on ticket  (automatic)
          │
          ▼  (within 1 hour)
Scheduled agent reads the ticket requirements
Agent generates Playwright E2E tests
Agent opens a draft PR with the test files
```

You stay in control at the review step — Claude handles everything before and after.

---

## The E2E Test Routine

A scheduled agent runs **every hour** and automatically generates end-to-end tests for any ticket that just reached QA.

| | |
|---|---|
| **What it does** | Reads ticket requirements + PR diff → generates `e2e/PRAG-NNN.spec.ts` |
| **When it runs** | Every hour, checks for tickets moved to QA in the last 90 minutes |
| **Output** | A draft Pull Request with the generated test file for your review |
| **Manage it** | https://claude.ai/code/routines/trig_01V7ydQFz8yabejANxoteJyW |

---

## Troubleshooting

**Claude can't see my Jira tickets**  
The Atlassian connector may have expired. Go to https://claude.ai/customize/connectors, remove it, and re-add it following Step 2.

---

**The Jira ticket didn't move to QA after a PR was merged**  
Check that all three secrets exist at https://github.com/d3bn/flight-monitoring-app/settings/secrets/actions. Also check that the PR title includes the ticket key in uppercase — for example `feat(PRAG-71): description`. Lowercase (`prag-71`) won't be detected.

---

**"I don't have permission" on the GitHub secrets page**  
You need Admin access to the repository. Ask your team lead to either add the secrets for you or grant you Admin rights.

---

**I need to add a new team member**  
Each person needs to follow Steps 1–3 themselves (install Claude Code, connect Jira, connect GitHub). Steps 4 and 5 only need to be done **once per repository**, not per person — the secrets are already set.

---

**I lost my Jira API token**  
Generate a new one at https://id.atlassian.com/manage-profile/security/api-tokens, then update the `JIRA_API_TOKEN` secret on GitHub (Step 5).

---

*For technical setup (running the app, tests, migrations), see [README.md](./README.md).*  
*Last updated: 2026-05-25*
