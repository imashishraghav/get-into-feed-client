# FeedOS — Architectural, Compliance & Operational Assumptions

**Product**: FeedOS (`crm.getintofeed.com`) — Internal CRM & Client Operating System for GetIntoFeed  
**Location**: Delhi NCR, India (Primary GST State Code: `07` — New Delhi)  
**Last Updated**: 2026-11-26 (Phase 0 Approved + Phase 1A Decisions Aligned)  
**Status**: Approved Phase 0 Baseline (Decisions 1–5 Applied)

---

## 1. Product Scope & Zero-AI Policy
1. **100% AI-Free Operations**:
   - FeedOS contains **zero** generative AI, LLM adapters, automated voice transcription, AI lead scoring/qualification, `"AI Qualified"` pipeline stages, or AI-drafted replies.
   - All qualification is human-verified using a mandatory 5-point checklist (requiring at least 3 of 5 items checked, or an explicit Admin override with note).
   - All call notes, client feedback logs, and WhatsApp/email replies are human-written. Static/merge-tag plain templates (English and Hinglish) are allowed.
2. **Bilingual Field Cues**:
   - The UI is English-first with Hinglish helper cues in sales logging (e.g., *"Rep Action (Salesperson ne kya kiya?)"*, *"Client Feedback (Client se kya baat hui?)"*).
3. **Demo Mode Until Backend Exists**:
   - During Phases 1 and 2 (before the `feedos-api/` Laravel backend is connected in Phase 3), the CRM runs on a mock client-side adapter with a persistent `"DEMO MODE - data not secure"` banner. Browser-side filtering/masking is treated strictly as a UI mirror and never claimed as a security control.

---

## 2. Frontend Architecture & Design System
1. **Pure JavaScript Only (No TypeScript)**:
   - All `crm/` source files must be `.js` / `.jsx` only. The 6 legacy `.ts` files discovered during the Phase 0 audit (`crm/src/schemas/*.ts`, `crm/src/types/index.ts`, `crm/src/utils/csvSanitizer.ts`, `crm/src/utils/priceBook.ts`) are converted to `.js` with JSDoc `@typedef` annotations and Zod runtime validation schemas in Phase 1A.
   - Type safety is enforced via **Zod validation** at every form and API boundary, **JSDoc typedefs** for domain models, **strict ESLint**, and **Vitest + React Testing Library + Playwright** tests.
2. **Toolchain Alignment (Vite 6.x Approved)**:
   - Keep **Vite 6.x** (`vite ^6.4.4`), alongside `react ^18.3.1`, `lucide-react ^0.468.0`, `tailwindcss ^3.4.19`, and `zod ^4.6.7`. ("Vite 5" removed from plan per Phase 0 approval Decision #4.) Add `eslint`, `vitest`, `@testing-library/react`, `jsdom`, and `playwright` as devDependencies.
3. **90 / 8 / 2 Light Design System**:
   - **90% Surfaces**: `#F8F9FB` canvas, `#FFFFFF` cards/drawers, `1px solid #E2E8F0` borders, `12px` (`rounded-xl`) radius, zero decorative gradients; subtle elevation shadow on overlays/drawers only. Dark mode is removed from the CRM shell (`crm/index.html` and `AuthContext` default strictly to light mode).
   - **8% Ink**: `#0F172A` headings/metrics/dark buttons, `#475569` small labels/metadata (WCAG AA compliant), `#64748B` strictly for `14px+` body text.
   - **2% Brand Accent**: `#D4FF00` fill with `#0F172A` bold text for **at most one primary CTA per screen**, active nav indicator, and primary approval button. `#D4FF00` is never used as text or border on white backgrounds.
   - **Status Pills**: Muted semantic tokens only (`emerald-50/700`, `amber-50/700`, `rose-50/700`) paired with icon + text label (never color alone).
   - **Formatting Standards**: Money stored in integer **paise** and formatted via `Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' })` (`₹1,50,000`) with `tabular-nums`. Phones normalized to E.164 `+91`. Timestamps stored in UTC and rendered in `Asia/Kolkata` (IST).
   - **Accessibility & Performance**: WCAG AA contrast, `>= 44px` tap targets on mobile/interactive controls, `prefers-reduced-motion` respected, static SVG monogram (no GIF), initial route bundle `<= 150 KB` gzipped (lazy-loading charts, PDF generator, and video player).

---

## 3. Monorepo Isolation & Backend Architecture (`feedos-api/`)
1. **Separation from Marketing Website (`getintofeed.com`)**:
   - Root `laravel/`, `api/`, `frontend/`, and `public/` serve the marketing website (`getintofeed.com`) and must remain **untouched** aside from temporary security hardening approved under Decision #1.
   - **Temporary Website Capture Bridge (Decision #1)**: All read/list/update/delete routes under `/api/v1/crm/*` in `laravel/routes/api.php` are removed/disabled immediately. **Only** hardened `POST /api/v1/crm/ingest` (rate limited, honeypot checked, FormRequest validated, explicit DPDP consent required, zero PII logging) stays temporarily until the new `feedos-api/` endpoint goes live in Phase 3, at which point `/api/v1/crm/ingest` will be removed from `laravel/routes/api.php`.
   - **New FeedOS Backend (`feedos-api/`, Decision #2)**: Built in Phase 3 as a separate top-level Laravel + MySQL application in `feedos-api/` (own `composer.json`, `.env`, MySQL schema), served under `crm.getintofeed.com/api/v1` (same origin as the CRM SPA for Sanctum cookie authentication).
2. **Hostinger VPS/Cloud Primary vs. Shared Hosting Fallback (Decision #5)**:
   - `feedos-api/` targets Laravel (PHP 8.3+) + MySQL 8 with versioned REST `/api/v1/*` and OpenAPI 3.1 docs.
   - **Primary Production Target (Hostinger VPS / Cloud)**: Redis cache/queue, Supervisor managing queue workers, per-minute `php artisan schedule:run` cron, and Laravel Reverb for real-time updates.
   - **Documented Fallback Only** (`FEEDOS_HOSTING_MODE=shared` in `feedos-api/.env`): `QUEUE_CONNECTION=database` processed via scheduled cron (`queue:work --stop-when-empty --max-time=50`), `BROADCAST_CONNECTION=null`, and authenticated client polling (15s interval) instead of WebSockets.

---

## 4. Access Control & Security (Server-Enforced)
1. **Five Canonical Roles on One URL (`crm.getintofeed.com`)**:
   - `Admin`, `Sales`, `Finance`, `Editor`, `Client`.
   - Legacy 8-role taxonomy (`OWNER`, `SALES_MANAGER`, `SALES_REP`, `ACCOUNT_MANAGER`, `CREATIVE_LEAD`, `FREELANCER`, `FINANCE`, `CLIENT`) in `crm/src/utils/rbac.js` will be collapsed cleanly to these 5 roles.
2. **Strict Server Enforcement**:
   - Lead/task/inbox ownership is identified strictly by `owner_id` (foreign key), never by name string matching.
   - Access is enforced in Laravel via Policies + Eloquent global query scopes + role-tailored API Resources (omitting forbidden columns completely rather than nulling/masking only in the browser).
   - **Protections Always On**: Strict tenant/owner isolation, field masking, hidden margins for Editor/Sales, and mandatory DPDP consent tracking are hardcoded invariants and are **not** toggleable in UI settings.
   - **Admin-Only Configurable Settings**: SLA window (`1`, `2`, or `5` minutes), business hours & holiday calendar (IST), 48h proposal nudge default, push alerts, and magic-link expiry. Changing any requires password/2FA re-authentication and writes an audit log entry.
3. **Auth & Audit**:
   - Laravel Sanctum token/cookie auth, mandatory TOTP 2FA for `Admin` and `Finance`, login rate limiting, configurable idle session timeout, and password complexity policy.
   - Tamper-evident append-only `audit_logs` table with SHA-256 hash chaining (`prev_hash` + row payload -> `row_hash`), restricted MySQL DB user lacking `UPDATE`/`DELETE` privileges on `audit_logs`, and an `artisan feedos:audit-verify` integrity-check command.

---

## 5. CRM Pipeline, Lead Intake & Communications
1. **Pipeline & Qualification**:
   - Default admin-configurable stages: `Captured` -> `Contacted` -> `Qualified` -> `Proposal Sent` -> `Negotiation` -> `Won`, plus `Lost` (mandatory reason: `Pricing`, `Competitor`, `No budget`, `Not ready`, `No response`, `Wrong fit`, `Other` + note).
   - `Won` + `Monthly Retainer` deal type automatically sets the client lifecycle state to `Retainer Active`.
   - Backward & forward stage moves supported with undo toast and audit trail.
   - `Call Outcome` is stored separately from stage (`Interested - Hot`, `Follow-Up Needed`, `Budget Objection`, `Proposal Reviewing`, `No Answer`, `Not Interested`); stage transitions require explicit user action.
   - Feedback Logger entries are **append-only** (corrections append a new correction entry referencing the prior entry).
2. **Lead Intake, Deduplication & Business-Hours SLA**:
   - Webhooks: Meta Lead Ads (`GET` verify + `POST` `X-Hub-Signature-256` HMAC-SHA256 + Graph API fetch by `leadgen_id`, idempotent on `leadgen_id`), Google Ads lead form webhook (shared key validation), Website `feed-capture.js` (honeypot, rate limit, optional Cloudflare Turnstile, UTM/`gclid`/`fbclid`, landing page). Failed webhooks queue for retry and appear on Admin's "Integration Health" view.
   - Phone normalization uses the last 10 digits (`+91 XXXXXXXXXX` E.164). Existing active/lost leads matched by 10-digit phone are **not duplicated**: a timeline event is appended, owner is notified, Lost/closed leads are reopened (or reassigned if owner is inactive), and Admin can split wrongly merged leads.
   - Round-robin cursor uses DB row locking (`SELECT ... FOR UPDATE`), skips suspended/on-leave reps, respects optional per-rep capacity, and targets `< 2s` assignment.
   - SLA clocks run strictly within configured IST business hours (skipping nights/weekends/holidays); out-of-hours leads start their deadline at the next business opening. UI computes local countdowns from server-persisted UTC `sla_deadline_at` timestamps.
3. **WhatsApp & Telephony**:
   - WhatsApp Business Cloud API only: free-form messages allowed within the 24-hour customer service window; outside 24h, only Meta-approved template messages are permitted. Opt-in and `STOP` opt-out are strictly enforced.
   - 48h proposal nudge toggle is per-lead, default `OFF`, requires WhatsApp opt-in, enforces a frequency cap, uses an approved template with case study link, and auto-stops on reply.
   - Exotel click-to-call provides a floating call bar with live timer and call-recording disclosure; status callback stores duration and recording reference (visible to lead owner & Admin only) for manual rep notes.

---

## 6. Reels Studio, Billing & Legal/Tax Assumptions (India)
1. **Reels Studio & Magic Links**:
   - Variable deliverable counts per package (never hardcoded to 12); pipeline: `Brief` -> `Script` -> `Shoot` -> `Edit` -> `Internal Review` -> `Client Review` -> `Approved` -> `Published`.
   - Video assets stored in S3/R2 object storage (mock local storage in dev) accessed via short-lived signed URLs.
   - Timestamped revision notes stored in **integer milliseconds** (`timestamp_ms`).
   - Magic-link approvals store SHA-256 hashed random tokens with expiry and single-use scope per deliverable. `GET` only displays the review page; approval happens strictly on explicit `POST` button click to prevent email/WhatsApp link-prefetch false approvals. IP, user agent, and timestamp are logged; tokens can be revoked.
2. **India GST, SAC & TDS (Requires CA Sign-Off)**:
   - Agency legal entity name (`Get Into Feed Media Pvt. Ltd.` vs `GetIntoFeed Digital LLP`), GSTIN (`07...`), and UPI VPA must be configured in Admin Settings / `.env` and verified before live billing.
   - Place of supply is derived from the client's GSTIN 2-digit state code (or billing address state for unregistered buyers) across all **36 Indian states & Union Territories** against Agency State `07` (Delhi).
   - **CA Review Flags**: SAC `998366` (often maps to other advertising space/design rather than commercial video production `999612`/`998365`) and `998313` (IT consulting vs software/web dev `998314`/`998315`) remain prominently flagged in the Price Book until confirmed by the agency's Chartered Accountant.
   - **TDS (Income-tax Act, 2025 Section 393)**: Rates are configurable by service category and payer entity, displaying statutory Section 393 references alongside legacy `194C` / `194J` mappings.
   - **Invoice Integrity & Payment Confirmation**: Financial-year sequential numbers (`GIF/26-27/0001`), immutable once issued, adjusted only via Credit Notes; includes an e-Invoice IRN/QR hook when turnover threshold applies. Dynamic UPI QR / Razorpay links never auto-mark an invoice paid — payment confirmation requires either a verified Razorpay/bank webhook or Finance manual UTR reconciliation (audit-logged).
3. **DPDP Retention & Privacy**:
   - Unqualified leads: soft-deleted / anonymized after retention period; GST invoices & tax ledgers retained for statutory duration (72 months under Section 36, CGST Act 2017 — to be confirmed by CA/legal counsel).
   - Grievance contact (`DPO email`) and breach log / erasure request workflow included in DPDP module.

---

## 7. PWA & Service Worker Policy
- `crm/public/sw.js` caches **static app shell assets only** (`index.html`, hashed JS/CSS chunks, offline fallback, icons/manifest).
- `sw.js` **never** caches `/api/*` responses or any PII, clears all caches on logout (`CLEAR_CACHES` message), displays a non-blocking update prompt on new SW activation, and handles VAPID Web Push notifications (with an explicit UI hint that iOS requires installing the PWA to the Home Screen).
