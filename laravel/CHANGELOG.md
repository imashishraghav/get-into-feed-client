# GetIntoFeed CMS & Admin Panel — Release Changelog (Phases 1–4)

## Phase 1: Architecture, Schema, Policies, Autosaves & Revisions
- **Layered Backend Architecture**: Routes → Thin Controllers → Form Requests (`StoreBlogPostRequest`, `UpdateBlogPostRequest`, `AutosaveBlogPostRequest`, `UploadEditorMediaRequest`) → Service Classes (`BlogPostService`, `BlogSeoAnalyzerService`, `HtmlSanitizerService`, `MediaOptimizationService`, `AuditLogService`) → Models & API Resources (`BlogPostResource`, `BlogPostSummaryResource`).
- **Database Schema & Optimistic Locking**:
  - Added `uuid`, `content_html`, `content_json`, `version`, `seo_score`, `readability_score`, `featured_media_id`, `scheduled_at`, `meta_title`, `meta_description`, `schema_json`, `faq_json`, and status/date indexes on `blog_posts`.
  - Bidirectional sync of mirrored legacy columns (`content`/`content_html`, `seo_title`/`meta_title`, `faq_items`/`faq_json`, `scheduled_for`/`scheduled_at`) inside `BlogPostService`.
  - Created `post_revisions` (full snapshot history + diffing + restore) and `post_autosaves` (per-user server-side autosaves that never overwrite live published posts).
- **Security Hotfix & RBAC**: Removed unauthenticated view-cache purge, locked `/api/v1/health` and `/api/v1/mcp/*`, removed legacy `routes/api.php` `/crm/*` endpoints, removed Livewire CSRF exclusions, introduced `author` role + policies (`BlogPostPolicy`, `LeadPolicy`), and added `user:reset-2fa` Artisan emergency CLI command.

## Phase 2: Mobile-First TipTap Studio, Live SEO & Public Block Parity
- **TipTap Rich Editor (`laravel/resources/js/editor.js`)**: Custom blocks for Callouts, FAQ Accordions, Key Takeaways TOC, CTA Cards, YouTube/Vimeo embeds, Tables, Task Lists, Drag-to-upload/paste images with WebP conversion (`MediaOptimizationService`), floating bubble toolbar, slash commands (`/`), and distraction-free focus mode.
- **Responsive Mobile-First UI**: Breakpoints down to `375px` with `>= 44px` touch targets, collapsible bottom-sheet Inspector Drawer, Device Preview switcher (`Desktop` / `Tablet` / `Mobile`), and Slide-over Revisions Diff & Restore drawer.
- **HTML Sanitization & Mixed Content Safety**: `HtmlSanitizerService` (powered by `symfony/html-sanitizer`) + `classifyContent()` keeps legacy Markdown and mixed Markdown+HTML posts safely in Code/Markdown mode by default.
- **Public SPA Parity**: Styled TipTap custom blocks in `frontend/src/styles.css` and updated `frontend/src/utils/markdownRenderer.jsx` DOMPurify hooks to allow sanitized TipTap video iframes and `data-*` block attributes.

## Phase 3: Core Two-Factor Authentication (Email OTP MFA)
- **Single-Use 6-Digit Email OTP**: Replaced TOTP QR with synchronous 6-digit one-time verification codes emailed directly to the admin's registered address (`EmailOtpNotification`, 10-minute expiry, bcrypt-hashed storage, 30s resend cooldown).
- **Safe Enrollment & Recovery Guardrail**: Mandatory two-step activation requiring explicit emergency recovery code confirmation (`confirmRecoveryCodes`) plus configurable 7-day transition grace period (`config('cms.two_factor.grace_days')`).
- **Challenge UX & Trusted Devices**: Dark-themed Email OTP challenge screen (`44px` touch targets, `inputmode="numeric"`, `autocomplete="one-time-code"`, Resend OTP), 30-day HMAC-SHA256 `HttpOnly` `gif_mfa_trust` cookie (`two_factor_trusted_token_version`), per-user rate limiting, and audit logs.

## Phase 4: Final Security Hardening & Handover
- **Single-Use Email OTP Replay Protection**: Consumes and clears `two_factor_email_otp_hash`, `two_factor_email_otp_purpose`, and `two_factor_email_otp_expires_at` immediately upon verification, isolating `setup`, `login`, and `reauth` codes.
- **Superadmin Recovery UI & Notifications**: Added `Reset 2FA` confirmation table action in `UserResource` recording `two_factor_reset_by`/`two_factor_reset_at`, `MFA_ADMIN_RESET` audit event, and queued `TwoFactorDisabledAlert` + masked-IP `NewDeviceLoginAlert` mail notifications.
- **Account Security Hub & Re-Authentication**: Added Filament `SecuritySettings` page (`/admin/security-settings`, session invalidation via `Auth::logoutOtherDevices`, trusted-device revocation, security event log) and `RequireRecentAuthentication` middleware protecting `/admin/system-backups/{id}/download` via `/admin/two-factor/reauth`.

---

## Database Migrations & Exact Rollback Commands

All schema changes across Phases 1–4 are additive and reversible:
1. `2026_11_26_000001_upgrade_blog_posts_architecture.php` (Phase 1)
2. `2026_11_26_000002_create_post_revisions_and_autosaves_tables.php` (Phase 1)
3. `2026_11_26_000003_upgrade_media_and_operations_indexes.php` (Phase 1)
4. `2026_11_27_000001_add_two_factor_phase3_columns_to_users_table.php` (Phase 3)
5. `2026_11_27_000002_add_totp_replay_and_audit_columns_to_users_table.php` (Phase 4)
6. `2026_11_27_000003_add_email_otp_columns_to_users_table.php` (Email OTP columns)

### Staging / Production Migration Order (Always back up MySQL first!)
```bash
# 1. Create MySQL dump before touching schema
mysqldump -u "$DB_USERNAME" -p "$DB_DATABASE" > backup_pre_cms_upgrade_$(date +%F_%H%M).sql

# 2. Run pending additive migrations
php artisan migrate --force

# 3. Publish Filament assets & clear caches
php artisan filament:assets
php artisan optimize:clear
```

### Emergency Rollback Commands
- Roll back only Email OTP columns (1 migration):
  ```bash
  php artisan migrate:rollback --step=1 --force
  ```
- Roll back Phases 3–4 + Email OTP (3 migrations):
  ```bash
  php artisan migrate:rollback --step=3 --force
  ```
- Roll back all Phases 1–4 schema migrations cleanly (6 migrations):
  ```bash
  php artisan migrate:rollback --step=6 --force
  ```

## Production Host Checklist
- **PHP**: PHP 8.2+ with `pdo_mysql`, `gd` (compiled with WebP support), `mbstring`, `openssl`, `xml`.
- **Cron Jobs**:
  - `* * * * * cd /path/to/laravel && php artisan schedule:run >> /dev/null 2>&1`
  - `* * * * * cd /path/to/laravel && php artisan queue:work --stop-when-empty --tries=3 >> /dev/null 2>&1`
- **Secrets to Rotate**: Ensure fresh unique values in production `.env` for `APP_KEY`, `MCP_API_KEY`, `SYSTEM_HEALTH_TOKEN`, and `ADMIN_BOOTSTRAP_PASSWORD` (or remove bootstrap credentials once active accounts exist).
