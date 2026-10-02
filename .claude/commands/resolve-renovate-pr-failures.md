---
description: Fix failing Renovate dependency upgrade PRs
argument-hint: [pr-number-or-branch]
allowed-tools:
  - Bash(gh:*)
  - Bash(git:*)
  - Bash(npm:*)
  - Bash(npx:*)
  - Read
  - Edit
  - Write
  - Grep
  - Glob
  - Task
model: opus
---

You are an industry-leading software engineer. Your job is to check out a Renovate branch, diagnose
why the package upgrade is failing CI, and fix the source code so the upgrade passes.

## CRITICAL SAFETY CONSTRAINT

**You MUST NOT modify any test files or test content.** This is a hard, non-negotiable rule.

The following are ALL off-limits for editing:

- Any file matching `**/*.test.ts`, `**/*.test.tsx`, `**/*.spec.ts`, `**/*.spec.tsx`
- Any file inside `**/cypress/**`
- Any file inside `**/__tests__/**`
- Any file matching `**/vitest.config.*` or `**/vitest.setup.*`
- Any file matching `**/cypress.config.*`
- Any file inside `.github/workflows/`

If the CI failure can ONLY be resolved by changing tests (e.g., a test is asserting on removed API
surface), you MUST stop and report this to the user rather than making the change yourself. Explain
exactly which tests need updating and why, so a human can make that decision.

## Workflow

### Step 1: Identify the Renovate PR

If the user provided a PR number (`$ARGUMENTS`), use it directly. If they provided a branch name,
use that. If neither was provided, list open Renovate PRs that have been open for more than a week
and ask which one to fix. Calculate the date one week ago from today and use it as the cutoff:

```
gh pr list --label renovate --state open --search "created:<$(date -v-7d +%Y-%m-%d)" --json number,title,headRefName,createdAt
```

If no PRs match the age filter, inform the user that all open Renovate PRs are less than a week old
and there is nothing to fix yet.

### Step 2: Gather CI failure information BEFORE checking out

Before switching branches, gather all failure context from GitHub:

1. Get the PR details and failed check runs:

   ```
   gh pr checks <pr-number> --json name,state,description
   ```

2. For each failed check, fetch the workflow run logs:

   ```
   gh run list --branch <branch-name> --status failure --json databaseId,name --limit 5
   gh run view <run-id> --log-failed
   ```

3. Read the PR body to understand what package is being upgraded and to what version.

### Step 3: Check out the Renovate branch

```
git pull
git fetch origin <branch-name>
git checkout <branch-name>
```

**Important:** The `git pull` on the current branch before switching ensures the local main branch
stays up to date. This avoids a situation where, after committing on the Renovate branch, git needs
to reconcile diverged histories and triggers a rebase or merge.

### Step 4: Install dependencies

```
npm install
```

### Step 5: Reproduce the failures locally

Based on the CI logs from Step 2, reproduce each failure locally. The CI pipeline runs these checks:

- **prettier**: `npm run format:check`
- **unit-tests**: `npm run test`
- **build**: `npm run build`
- **e2e-tests**: Cypress end-to-end tests (via `npx next build` then `npx next start` + Cypress)

Run the specific failing check(s) first to confirm the failure locally. Do NOT run checks that
passed in CI — focus only on what is broken.

### Step 6: Diagnose the root cause

Analyze the error output to determine the root cause. Common failure categories for Renovate
dependency upgrades:

**Type errors from upgraded package:**

- Changed or removed type exports
- New required properties on interfaces
- Changed generic type parameters
- Deprecated API replaced with new API

**Build failures:**

- Breaking API changes in the upgraded dependency
- Peer dependency conflicts
- Changed import paths or module structure
- Removed or renamed exports

**Formatting failures:**

- New version of prettier or a prettier plugin changing formatting rules
- Run `npm run format` to auto-fix, then verify with `npm run format:check`

**Runtime / test failures (read-only diagnosis):**

- Changed runtime behavior in the dependency
- You may READ test files to understand expected behavior, but NEVER edit them
- If tests fail due to changed dependency behavior, the SOURCE code must be updated to preserve the
  behavior the tests expect

### Step 7: Apply the fix

Fix the source code to work with the upgraded dependency. Follow the project's CLAUDE.md coding
standards. Common fixes include:

- Updating import paths for renamed/moved exports
- Adapting to new API signatures (adding required params, updating types)
- Replacing usage of removed/deprecated APIs with their replacements
- Updating type annotations to match changed library types
- Running `npm run format` if the formatting check failed

After applying fixes, verify by re-running the previously failing check(s).

### Step 8: Verify ALL checks pass

Once the targeted fix is applied and verified, run the full suite of checks that CI runs:

1. `npm run format:check`
2. `npm run test`
3. `npm run build`

If all pass, report success. If any fail, diagnose and fix (still respecting the test-modification
ban).

### Step 9: Commit and push

Stage only the files you changed (never use `git add -A` or `git add .`). Create a commit with a
clear message explaining what was fixed and why. Push to the Renovate branch.

**Important:** Before pushing, verify you are on the Renovate branch and not on `main`.

## Reporting

When finished (whether successful or blocked), provide a summary:

- **PR**: Link or number
- **Package upgraded**: Name and version range
- **CI failures found**: List each failing check and its error
- **Root cause**: What broke and why
- **Fix applied**: What you changed (or why you could not change it)
- **Verification**: Which checks you ran and their results
- **Files modified**: List every file you touched

If you were blocked by the test-modification constraint, clearly explain what tests need human
attention and what changes those tests likely need.
