# Developer Setup, Environment Separation & CI Guide
**Project:** BitesBro Cloud Kitchen Platform
**Target Environments:** Local Development · Staging · Production
**Document Status:** Foundation Readiness Guide (Task 06)

---

## 1. Prerequisites

Before setting up the repository locally, ensure you have the following installed:

- **Node.js**: `v20.x` LTS (recommended: `v20.18.0` or later)
- **npm**: `v10.x` or later (bundled with Node.js)
- **Git**: `v2.40` or later with standard POSIX or PowerShell shell
- **Optional for Local Backend**: [Supabase CLI](https://supabase.com/docs/guides/cli) (`v1.190+`) and Docker Desktop for running local PostgreSQL & Edge Functions.

---

## 2. Local Development Quickstart

### Step 1: Clone and Inspect
```bash
git clone <repository-url> bitesbro
cd bitesbro
```

### Step 2: Install Node Dependencies
Use `npm ci` for deterministic clean installs from `package-lock.json`:
```bash
npm ci
```

### Step 3: Configure Environment Variables
Copy the example environment template:
```bash
cp .env.example .env
```
*Note: For frontend UI development and running automated tests, default placeholders in `.env.example` are sufficient. Do not add real service-role secrets.*

### Step 4: Run the Local Development Server
```bash
npm run dev
```
The Vite development server runs at `http://localhost:5173`.
- Navigate to `http://localhost:5173/me` for the customer Menu, Cart, and Orders views.
- Append `?dev=true` or `#dev-studio` to open the development-only Navbar Verification Studio (isolated from production builds).

### Step 5: Execute Automated Tests & Production Build
```bash
# Run Vitest test suite (96 tests)
npm test

# Run TypeScript typecheck and Vite production build
npm run build

# Check for trailing whitespace or formatting conflicts
git diff --check
```

---

## 3. Environment Separation Architecture

In accordance with `AGENTS.md` and `docs/ARCHITECTURE.md`, BitesBro enforces strict physical and credential separation across three environments:

| Dimension | Local Development (`development`) | Staging (`staging`) | Production (`production`) |
|---|---|---|---|
| **Frontend Host** | Localhost Vite (`http://localhost:5173`) | Cloudflare Pages Preview / Branch (`staging.bitesbro.pages.dev`) **[PENDING CLIENT APPROVAL — domain not yet registered or delegated]** | Cloudflare Pages Production (`bitesbro.com` / `bitesbro.pages.dev`) **[PENDING CLIENT APPROVAL — domain acquisition; see `docs/PHASE_0_APPROVALS.md` §9]** |
| **Supabase Project** | Local Docker via Supabase CLI (`127.0.0.1:54321`) or Dedicated Dev Project | Dedicated Staging Supabase Project | Dedicated Production Supabase Project |
| **Database Instance** | Local PostgreSQL 15 | Isolated Cloud PostgreSQL instance | Isolated Cloud PostgreSQL instance (PITR enabled) |
| **Storage Buckets** | Local private storage emulation | Dedicated staging private buckets | Production private buckets (Zero public access) |
| **Payment Gateway** | Mock / Razorpay Sandbox Mode **[PENDING CLIENT APPROVAL — gateway provider selection; see `docs/PHASE_0_APPROVALS.md` §7]** | Razorpay Sandbox Mode (Test Cards / UPI) **[PENDING CLIENT APPROVAL]** | Razorpay Live Merchant Account **[PENDING CLIENT APPROVAL]** |
| **Credentials & Keys** | Local development anon keys | Independent staging service-role & anon keys | Production keys strictly managed via Cloudflare/Supabase Secrets |

> **CRITICAL RULE:**
> Never point staging or local development environments at the production database or Supabase project. An environment breach or accidental wipe must not compromise live customer records.

---

## 4. Secret Protection & Git Hygiene

### Strict `.gitignore` Policy
The repository `.gitignore` explicitly blocks all local environment configurations and sensitive credentials:
```gitignore
node_modules/
dist/
coverage/
.env
.env.*
!.env.example
*.log
.DS_Store
.claude/settings.local.json
```

### Pre-Commit Developer Checklist
1. **Never Commit Secrets:** Check `git status` and `git diff` before committing. Ensure no API keys, service-role keys, private keys, database passwords, or personal test data appear in code or fixtures.
2. **Whitespace Check:** Run `git diff --check` to verify no whitespace errors, trailing spaces, or carriage-return corruptions.
3. **Verify Tests:** Ensure all automated tests pass (`npm test`) and the production build completes without TypeScript errors (`npm run build`).
4. **Follow Branching Conventions:** Work on designated `feature/<feature-name>` branches. Never push untested code directly to `main`.

---

## 5. Continuous Integration (CI) Workflow

Automated testing and build verification are enforced via GitHub Actions in `.github/workflows/ci.yml`.

### Workflow Triggers
- Every `push` to `main` and `feature/*` branches.
- Every `pull_request` targeting `main`.

### Automated Pipeline Steps
1. **Source Checkout:** Fetches clean git repository tree (`actions/checkout@v4`).
2. **Node Environment:** Boots Node.js `20.x` with automatic npm cache validation (`actions/setup-node@v4`).
3. **Clean Installation:** Executes `npm ci` ensuring zero package drift.
4. **Git Whitespace Hygiene:** Executes `git diff --check` against the actual commits introduced by the push or pull request (not a no-op clean-tree diff). See `.github/workflows/ci.yml` for the base/head resolution logic.
5. **Test Suite Execution:** Executes `npm test` verifying all 96 unit and integration tests across App, Navbar, Hero, Menu, Cart, and Orders.
6. **Typecheck & Production Build:** Executes `npm run build` (`tsc && vite build`) ensuring zero TypeScript diagnostic errors and valid bundle generation.

---

## 6. Security & Dependency Maintenance Checklist

| Task | Frequency | Command / Tool | Action Plan on Failure |
|---|---|---|---|
| **Vulnerability Audit** | Weekly / On Dependency Update | `npm audit` | Resolve high/critical vulnerabilities via `npm update` or patch updates. Never use `--force` blindly. |
| **Package Drift Check** | Monthly | `npm outdated` | Review minor/patch updates for React, Vite, and Vitest. Verify with full test suite before upgrading. |
| **Secret Scanning** | Continuous / Pre-push | `git diff`, GitHub Secret Scanning | Immediately rotate compromised credentials in Supabase/Cloudflare if detected. |
| **Dependency Pinning** | On Release | `package-lock.json` | Commit exact lockfiles. Avoid unpinned wildcards (`*`) in `package.json`. |
| **Static Code Analysis** | Per PR | `tsc --noEmit` & ESLint | Fix all compiler warnings and type mismatches prior to PR merge. |
| **Quarterly Restore Drill** | Quarterly (Phase 3) | Supabase Backup Restore Drill | Rehearse restoring database snapshots into a staging instance to verify RPO/RTO adherence. |
