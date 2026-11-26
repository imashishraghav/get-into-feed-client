# GetIntoFeed CMS — API & Route Reference (Phase 1)

All admin routes use `web` + `auth` session authentication, CSRF protection (`VerifyCsrfToken`), rate limiting (`throttle`), and policy authorization (`Gate::policy`).

## Public & Headless Read Endpoints (`routes/api.php`)

| Method | Path | Throttle | Auth / Access | Description |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/up` | None | Public | Built-in lightweight container liveness probe. |
| `GET` | `/api/v1/health`, `/api/health` | None | Admin session **or** `X-Health-Token` | Detailed DB, cache, queue depth, failed jobs, CRM sync stats, and last backup telemetry (`401` if unauthorized). |
| `GET` | `/api/v1/bootstrap`, `/api/bootstrap` | Cached (300s) | Public | Consolidated SPA hydration payload (services, case studies, `publiclyListed` posts, settings, reviews, team, awards, FAQs). |
| `GET` | `/api/v1/blog`, `/api/v1/blogs`, `/api/blog` | Cached (300s default) | Public (`publiclyListed`) | Paginated published public blog posts (`per_page`, `page`, `category`, `search`/`q`). |
| `GET` | `/api/v1/blog/{slug}`, `/api/blog/{slug}` | None | Public (`accessiblePublished`) | Single published post (`public` or `unlisted`) with SEO metadata, FAQ, JSON-LD, and `srcset`. |
| `GET` | `/api/v1/sitemap.xml`, `/sitemap.xml` | Cached (3600s) | Public | XML sitemap regenerated on `PostPublished` and `cms:publish-scheduled`. |
| `POST` | `/api/v1/leads`, `/api/v1/enquiries` | `10/min` | Public + honeypot + DPDP consent | Stores website enquiry and dispatches `SyncLeadToCrmJob`. |
| `POST` | `/api/v1/audit` | `5/min` | Public + DPDP consent | Stores 360 growth audit request. |
| `POST` | `/api/v1/newsletter/subscribe` | `5/min` | Public | Newsletter subscription. |
| `POST` | `/api/v1/webhooks/crm-status` | `30/min` | HMAC-SHA256 + 5m replay window | Inbound CRM sync status webhook callback. |
| `POST` | `/api/v1/crm/ingest` | `10/min` | Public + DPDP consent + honeypot | Temporary hardened website lead ingestion bridge (removed in FeedOS Phase 3). |
| `GET/POST` | `/api/v1/mcp*`, `/api/mcp*` | `60/min` | Public read / Bearer `MCP_API_KEY` write | Model Context Protocol JSON-RPC & tool endpoints. |

## Admin Editorial Studio & Operations API (`routes/web.php`)

All `/admin/api/*` routes require authenticated session + CSRF token (`throttle:120,1`).

### Posts & Editorial Workflow (`PostController`)
- `GET /admin/api/posts` — Paginated list with filters (`status`, `visibility`, `category`, `search`, `trashed`, `with_trashed`, `per_page`). Authors see only their own posts.
- `POST /admin/api/posts` — Create post (`StoreBlogPostRequest`). Enforces author role cannot self-publish, sanitizes HTML (preserving pure Markdown), creates `PostRevision` #1 and `AuditLog`.
- `GET /admin/api/posts/{post}` — Fetch single post + current user's latest `PostAutosave` buffer.
- `PUT|PATCH /admin/api/posts/{post}` — Update post (`UpdateBlogPostRequest`) with optimistic locking (`version` check → `409 Conflict` if stale), auto 301 redirect + chain collapse on published slug change, HTML sanitization, new `PostRevision`, and `PostPublished` cache/sitemap refresh.
- `DELETE /admin/api/posts/{post}` — Soft-delete (`status = trashed`) and regenerate sitemap if previously published.
- `POST /admin/api/posts/{id}/restore` — Restore soft-deleted post back to `draft`.
- `POST /admin/api/posts/{post}/publish` — Publish post (`BlogPostPolicy::publish`) and dispatch `PostPublished`.
- `POST /admin/api/posts/{post}/schedule` — Schedule post in `Asia/Kolkata` timezone (`SchedulePostRequest`).
- `POST|PATCH /admin/api/posts/{post}/autosave` — Debounced autosave (`AutosaveBlogPostRequest`) saved solely in `post_autosaves` without mutating the live `blog_posts` row; returns `version_conflict` boolean.
- `POST /admin/api/posts/analyze` — Compute word count, reading time, readability score, heading structure, and missing alt checks.
- `GET /admin/api/posts/{post}/revisions` — List revisions (`PostRevisionResource`).
- `GET /admin/api/posts/{post}/revisions/diff?from={id}&to={id}` — Structured field & line-by-line diff.
- `POST /admin/api/posts/{post}/revisions/{revisionId}/restore` — Restore revision with optimistic lock check (`RestoreRevisionRequest`).
- `GET /admin/api/posts/tags?q=` — Tag autocomplete suggestions.
- `POST /admin/api/posts/tags` — Quick-create tag in `blog_tags_registry`.
- `POST /admin/api/posts/{post}/preview-link` — Generate expiring HMAC-signed preview link (`admin.posts.signed-preview`).
- `GET /cms-preview-data/blog/{uuid}?expires=...&signature=...` — Signed draft preview endpoint (`signed` middleware).

### Editor Helpers & Media Pipeline (`EditorController`, `MediaController`)
- `POST /admin/editor/upload-image` — Editor image upload (`UploadMediaRequest`, max 5MB, `alt` required, magic-byte check, EXIF strip, max 1400px WebP + responsive `400`/`800`/`1200` variants).
- `GET /admin/editor/internal-links?q=&exclude_id=` — Search publicly listed articles for internal link insertion.
- `GET /admin/api/media`, `GET /admin/media/list` — Paginated media library (`MediaResource` with `variants` and `srcset`).
- `POST /admin/api/media`, `POST /admin/media/quick-upload` — Upload media (`UploadMediaRequest`, `alt` required on `/admin/api/media`, EXIF stripped, WebP + responsive variants generated).

### Redirects, Backups, Exports & Operations
- `GET /admin/api/redirects` — Paginated redirects (`RedirectPolicy::viewAny`).
- `POST /admin/api/redirects` — Upsert redirect (`StoreRedirectRequest`, audited).
- `POST /admin/api/operations/purge-cache` — Admin-only cache/view clear + sitemap regeneration (audited).
- `GET /admin/api/operations/queue` — Admin-only queue depth and failed job inspection.
- `POST /admin/api/operations/queue/retry/{uuidOrAll}` — Retry failed queue job(s) (audited).
- `GET /admin/system-backups/{id}/download` — SuperAdmin backup download (`BackupController`, audited).
- `GET /admin/leads/export-csv`, `GET /admin/leads/export-pdf` — Audited lead exports (`LeadExportController`, `LeadPolicy::export`).
- `GET/POST /admin/two-factor/*` — Existing 2FA challenge/setup/confirm/disable routes (CLI emergency reset: `php artisan user:reset-2fa {email}`).
