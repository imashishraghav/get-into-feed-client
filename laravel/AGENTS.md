# Laravel & Website Project Rules (getintofeed.com)

These rules apply strictly when working within the `laravel/` and website frontend codebases. For workspace-wide baseline rules (secrets, DPDP, database safety), see root [AGENTS.md](../AGENTS.md).

## 1. Scope & Monorepo Boundaries
- Keep website backend modifications scoped to `laravel/` and website frontend to `frontend/`.
- Do not modify `crm/` during website tasks without coordinating via documented API contracts.

## 2. Security & Secrets
- Never read, print, log, or commit `.env`, API keys, DB dumps, or any credentials.
- Use `.env.example` as the reference for environment variables.
- Use `env()` only inside configuration files (`config/*.php`); in application code, always use `config(...)`.

## 3. Environment, Testing & Destructive Commands
- Production deploys and additive migrations (`php artisan migrate --force`) are allowed ONLY after taking a full MySQL backup and receiving explicit user approval in chat.
- Strictly prohibited without explicit approval: `migrate:fresh`, `db:wipe`, or other destructive artisan commands.
- Tests must run against a separate testing database (`phpunit.xml` / `.env.testing`). Never create test/bot leads or any fake data in the live database. Seed demo data only locally.

## 4. Laravel Conventions & Architecture
- Validation: Use `FormRequest` classes for request validation.
- Authorization: Use `Policies` and `Gates` for authorization checks.
- Database: Use Eloquent with eager loading to avoid N+1 queries.
- Application config: Access configuration via `config()` helper in app code.
- Background jobs: Dispatch queues for slow I/O operations.

## 5. SEO, Meta & Content Guidelines
- Every public page must have:
  - Unique `<title>`
  - Complete meta description (max 155 characters)
  - Canonical link tag
  - Open Graph (OG) tags
  - Server-rendered unique `<h1>` and body content
  - An entry in `sitemap.xml`
- Changing a public URL requires a `301` redirect.

## 6. Verification Checklist (Before completing any task)
Run the following checks and report the results:
1. `./vendor/bin/pint` (or code style fixer)
2. `php artisan test`
3. `composer audit`
4. `npm run build`

## 7. Git & Migrations
- Work on a feature branch with small, focused commits.
- Clearly explain every migration and document exact steps to roll it back.
