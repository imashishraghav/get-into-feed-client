# Hostinger production security

This CMS cannot be made impossible to hack. These settings reduce common attack paths; keep the host runtime, dependencies, credentials, and backups maintained as well.

## Production environment

Set these in the private Laravel environment file in Hostinger, never in source control:

- `APP_ENV=production`
- `APP_DEBUG=false`
- `APP_URL=https://getintofeed.com`
- `FRONTEND_URL=https://getintofeed.com`
- `SESSION_SECURE_COOKIE=true`
- `SESSION_ENCRYPT=true`
- `SESSION_HTTP_ONLY=true`
- `SESSION_SAME_SITE=lax`
- `SESSION_LIFETIME=60`
- `SESSION_EXPIRE_ON_CLOSE=true`
- `CORS_ALLOWED_ORIGINS=https://getintofeed.com,https://www.getintofeed.com`
- A unique `APP_KEY`, unique database credentials with only the required database privileges, and working SMTP credentials.

Keep the Laravel `.env`, application source, `vendor`, logs, sessions, and database outside the document root if the hosting layout permits it. This project currently routes the public SPA and Laravel through a root PHP bridge. If Laravel must remain in a `laravel/` folder under `public_html`, deploy the root `.htaccess` security rules with it and verify direct requests to `/laravel/.env`, `/laravel/composer.json`, `/laravel/storage/logs/laravel.log`, `/.env`, `/composer.json`, and `/database.sqlite` return 403 or 404 without response content.

## Hostinger account and runtime

- Enable two-step verification on the Hostinger account and use a unique password. Keep SSH/SFTP access restricted and remove unused accounts/keys.
- Change every existing CMS account to its own unique password of at least 16 characters; the new minimum only applies to passwords created or changed through the updated admin form.
- Use the newest security-patched PHP release available for the plan, plus Laravel's required extensions. Laravel 12 requires PHP 8.2 or newer.
- Keep SSL active and force HTTPS at Hostinger as well as in the site rewrite rules.
- Run `composer install --no-dev --prefer-dist --optimize-autoloader` from a reviewed `composer.lock`; run `composer audit --locked` before deployment. Do not run `composer update` directly on production.
- After reviewing a backup, run migrations with `php artisan migrate --force`, then `php artisan optimize`. Do not seed production with bootstrap owner credentials; remove one-time bootstrap values after initial setup.
- Keep `storage` and `bootstrap/cache` writable only by the hosting account. Do not use world-writable permissions.
- Keep off-host backups of the database and uploaded media, and test restoring them.

## Remaining security work

- Enforce and verify MFA for every CMS user and for Hostinger itself. Filament's current login is rate-limited, but this application has not yet configured a second factor.
- Create and commit a Composer lockfile, run `composer audit --locked`, and deploy only maintained dependency versions. The workspace has no `composer.lock`, Composer, or installed Laravel dependencies, so a dependency advisory scan and PHP runtime verification have not been possible here.
- After deploying the access-deny rules, verify the protected URLs above from a browser or HTTP client. If production secrets may previously have been served from public URLs, rotate the database/mail credentials, `APP_KEY`, and administrator passwords after blocking access.
