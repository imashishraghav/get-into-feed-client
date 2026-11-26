# CRM Application Rules (crm.getintofeed.com)

These rules apply strictly when working within the `crm/` directory. For workspace-wide baseline rules (secrets, DPDP, database safety), see root [AGENTS.md](../AGENTS.md).

## 1. Scope & Monorepo Isolation
- The CRM lives in `crm/` (same repository as the website, separate app).
- All CRM tasks and modifications are strictly scoped to `crm/` and the documented API contract only.
- **Do not modify website files** (`frontend/`, `laravel/`, or root public files).
- If any website-side or backend API change is needed, list it separately for explicit user approval before proceeding.

## 2. Secrets & Credentials Security
- Never read, print, log, or commit `.env`, API keys, DB dumps, customer data, or credentials.
- Use `.env.example` as the reference.

## 3. Environment & Destructive Commands
- Local/staging only. Never touch or execute against the production database.
- Strictly prohibited without explicit approval: `migrate:fresh`, `db:wipe`, `truncate`, or any destructive commands.

## 4. Testing & Data Integrity
- Tests must run on a separate testing database.
- Never create fake or test leads in a live database; use an `is_test` flag and test factories.

## 5. DPDP Act & Privacy Compliance
- Treat all lead data as personal data under the DPDP Act (Digital Personal Data Protection Act):
  - Minimal logging across all services.
  - No PII in logs or error trackers.
  - All export actions must be audited.

## 6. Verification Checklist (Before completing any CRM task)
Run each check and report the results:
1. Formatter / Code style check
2. CRM test suite (`test`)
3. Dependency audit (`audit`)
4. CRM build check (`npm run build:crm`)

## 7. Git & Migrations
- Work on a feature branch with small, focused commits.
- Clearly explain every migration and document exact steps to roll it back.
