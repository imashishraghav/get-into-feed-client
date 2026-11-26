# Staging Migration, Rollback & Hostinger Production Deploy Runbook

> **Rule of Thumb**: Never run destructive database commands (`migrate:fresh`, `db:wipe`, `truncate`) against production. Always take a full backup before touching production schema or files.

---

## 1. Pre-Migration Production Read-Only Audits (MySQL)

Run these read-only queries against production MySQL **before** deploying CMS upgrades to inventory `editor_mode` and legacy Markdown / mixed HTML posts:

```sql
-- 1. Count posts by editor_mode
SELECT COALESCE(editor_mode, 'NULL') AS editor_mode, COUNT(*) AS total
FROM blog_posts
GROUP BY COALESCE(editor_mode, 'NULL');

-- 2. Identify posts containing HTML or embedded HTML tags vs pure Markdown
SELECT id, slug, editor_mode, status,
       CASE
           WHEN content REGEXP '<(p|h[1-6]|div|table|br|img|iframe|ul|ol|blockquote)\\b' THEN 'contains_html_or_mixed'
           ELSE 'pure_markdown_or_text'
       END AS detected_format
FROM blog_posts
ORDER BY id;
```

---

## 2. Backup & Staging Validation Commands

1. **Back up live MySQL database first** (or run via Admin Dashboard encrypted backup):
   ```bash
   mysqldump --single-transaction --routines --triggers -u "$DB_USER" -p"$DB_PASS" "$PROD_DB" > backup_pre_cms_$(date +%Y%m%d_%H%M%S).sql
   ```
2. **Restore into isolated staging DB (`staging_cms`)**:
   ```bash
   mysql -u "$DB_USER" -p"$DB_PASS" staging_cms < backup_pre_cms_*.sql
   ```
3. **Run migrations & baseline revision snapshot on staging**:
   ```bash
   cd /path/to/staging/laravel
   php artisan cms:snapshot-posts
   php artisan migrate --force
   php artisan migrate:status
   ```
4. **Verify Rollback cleanly on staging** (before touching production):
   ```bash
   php artisan migrate:rollback --step=3
   php artisan migrate:status
   php artisan migrate --force
   ```

---

## 3. Production Host Requirements & Cron Setup

- **PHP:** `>= 8.2` (`8.3` verified) with extensions: `pdo_mysql`, `gd` (**with WebP write support enabled**, verify via `php -r "var_dump(function_exists('imagewebp'));"`), `mbstring`, `openssl`, `fileinfo`, `xml`, `json`.
- **Cron Jobs (Hostinger / Linux crontab):**
  ```cron
  * * * * * cd /home/u221467171/domains/getintofeed.com/laravel && /opt/alt/php83/usr/bin/php artisan schedule:run >> /dev/null 2>&1
  * * * * * cd /home/u221467171/domains/getintofeed.com/laravel && /opt/alt/php83/usr/bin/php artisan queue:work --stop-when-empty --tries=3 --timeout=60 >> /dev/null 2>&1
  ```

---

## 4. Production Deploy Order (Zero-Node Host Compatible)

`laravel/public/build/editor/tiptap-studio.js` and `tiptap-studio.css` are prebuilt via `npm run build` inside `laravel/` and **committed to git**, so the production web server does **not** require Node.js or npm.

Execute in exact order:
1. **Enable Maintenance Mode & Back Up Live DB** (`mysqldump` or `php artisan db:backup` if configured).
2. **Rotate Compromised / Legacy Secrets** in `.env`:
   - `APP_KEY` (only if exposed — re-encrypts 2FA/cookies cleanly if planned; keep backup of old key before rotating), `CRM_SYNC_SECRET`, `MCP_API_KEY`, `SYSTEM_HEALTH_TOKEN`, `WHATSAPP_ACCESS_TOKEN`, DB password.
3. **Deploy Code + Prebuilt Assets (`laravel/public/build/editor/*` + `frontend/dist/*`)** to Hostinger `public_html/` + `laravel/`.
4. **Publish Filament Vendor Assets & Migrate**:
   ```bash
   cd /home/u221467171/domains/getintofeed.com/laravel
   /opt/alt/php83/usr/bin/php artisan filament:assets
   /opt/alt/php83/usr/bin/php artisan cms:snapshot-posts
   /opt/alt/php83/usr/bin/php artisan migrate --force
   /opt/alt/php83/usr/bin/php artisan db:seed --class=UserSeeder --force
   ```
   *(If `public_html` webroot serves separately from `laravel/public`, root `.htaccess` rewrites `/css/filament/*`, `/js/filament/*`, and `/build/editor/*` to `laravel/public/$1`, OR copy `laravel/public/{css,js,build}` into `public_html/`.)*
5. **Clear Caches & Warm Up**:
   ```bash
   /opt/alt/php83/usr/bin/php artisan optimize:clear
   /opt/alt/php83/usr/bin/php artisan view:clear
   /opt/alt/php83/usr/bin/php artisan route:clear
   ```
6. **Verify Live Endpoints & Static Assets via `curl`**:
   ```bash
   curl -sI https://getintofeed.com/css/filament/filament/app.css | head -n 5
   curl -sI https://getintofeed.com/js/filament/filament/app.js | head -n 5
   curl -sI https://getintofeed.com/build/editor/tiptap-studio.js | head -n 5
   curl -sI https://getintofeed.com/build/editor/tiptap-studio.css | head -n 5
   curl -s -H "X-Health-Token: $SYSTEM_HEALTH_TOKEN" https://getintofeed.com/api/v1/health
   ```
7. **Bring Site Out of Maintenance Mode** (`php artisan up`) and perform post-deploy smoke test.
