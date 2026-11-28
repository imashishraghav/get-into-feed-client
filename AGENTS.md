# Workspace Rules & Common Policies

These baseline rules apply repository-wide across all applications (`crm/`, `laravel/`, `frontend/`):

## 1. Secrets & Credentials Security
- Never read, print, log, or commit `.env`, API keys, DB dumps, customer/lead data, or credentials.
- Use `.env.example` as the reference for environment variables.
- Use `env()` only inside configuration files (`config/*.php`); in application code, always use `config(...)`.

## 2. Environment Safety & Destructive Commands
- Production deploys and additive migrations (`php artisan migrate --force`) are allowed ONLY after taking a full MySQL backup and receiving explicit user approval in chat.
- Strictly prohibited without explicit approval: `migrate:fresh`, `db:wipe`, `truncate`, or any destructive commands.

## 3. Testing & Data Integrity
- Tests must run against a separate testing database (`phpunit.xml` / `.env.testing` with `:memory:` or `testing.sqlite`).
- Never create test/bot leads or any fake data in the live or development database.
- Seed demo data only locally (`DemoLeadSeeder` with local environment guard).
- All CRM stats, analytics, and KPI queries must filter with `is_test = 0` / `scopeProduction()`.

## 4. DPDP Act & Privacy Compliance
- Treat all lead and customer data as personal data under the DPDP Act (Digital Personal Data Protection Act):
  - Minimal logging across all services.
  - Zero PII in logs or error trackers.
  - All data export actions must be audited.

## 5. Git & Migrations Hygiene
- Work on a feature branch with small, focused commits.
- Clearly explain every migration and document exact steps to roll it back.

---

## Sub-Project Rulebooks
- **CRM Application (`crm/`)**: Follow [crm/AGENTS.md](file:///c:/Users/ashis/OneDrive/Documents/Get%20into%20feed/crm/AGENTS.md).
- **Website Backend (`laravel/`)**: Follow [laravel/AGENTS.md](file:///c:/Users/ashis/OneDrive/Documents/Get%20into%20feed/laravel/AGENTS.md).
