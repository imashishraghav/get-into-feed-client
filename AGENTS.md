# Laravel Project Rules (getintofeed.com)

## Security & Secrets
- Never read, print, log or commit `.env`, API keys, DB dumps, or any credentials.
- Use `.env.example` as the reference for environment variables.
- Use `env()` only inside configuration files (`config/*.php`); in application code, always use `config(...)`.

## Environment & Destructive Commands
- Local/staging environments only. Never run commands against production or a production database.
- Strictly prohibited without explicit approval: `migrate:fresh`, `db:wipe`, or other destructive artisan commands.

## Laravel Conventions & Architecture
- Validation: Use `FormRequest` classes for request validation.
- Authorization: Use `Policies` and `Gates` for authorization checks.
- Database: Use Eloquent with eager loading to avoid N+1 queries.
- Application config: Access configuration via `config()` helper in app code.
- Background jobs: Dispatch queues for slow I/O operations.

## SEO, Meta & Content Guidelines
- Every public page must have:
  - Unique `<title>`
  - Complete meta description (max 155 characters)
  - Canonical link tag
  - Open Graph (OG) tags
  - Server-rendered unique `<h1>` and body content
  - An entry in `sitemap.xml`
- Changing a public URL requires a `301` redirect.

## Verification Checklist (Before finishing any task)
Run the following checks and report the results:
1. `./vendor/bin/pint` (or code style fixer)
2. `php artisan test`
3. `composer audit`
4. `npm run build`

## Git & Migrations
- Work on a feature branch with small, focused commits.
- Clearly explain every migration and document exact steps to roll it back.
