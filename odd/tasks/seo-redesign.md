# Feature: SEO + content + redesign for qrgratis.es

Locator: `odd/tasks/seo-redesign.md` · Engram mirror: `odd/seo-redesign/tasks` · Branch: `feat/seo-redesign` (from `main` 4e67b1c)

## Objective
Make every route of https://www.qrgratis.es indexable with unique, useful content, explain the product as clearly as the top competitors (but more honestly), and ship a distinct visual design built with the UI/UX Pro Max skill.

## Problem (audit 2026-10-09, verified)
- Vite React SPA: every route serves the same 1982-byte shell (same title/description, no canonical, no H1, no body).
- The 4 generator pages (url, whatsapp, wifi, texto) share H1 and body (~730 words) → near duplicates.
- Only `GeneratorPage` uses Helmet; `/faq`, `/about`, `/donaciones`, legal pages keep the generic title and no canonical.
- `/` is a client-side redirect (200) listed in the sitemap; sitemap misses `/faq`, `/about`, `/donaciones`; lastmod 2025-02-26.
- No JSON-LD, no `og:image`, 21 images without `alt`.

## Why
Competitors (qrcode-tiger, me-qr, qrcode-monkey, Shopify, Sellfy) rank with: promise-led H1 ("gratis, sin registro, no caduca"), 3–5 step how-to, one landing per QR type, long FAQ (5–16 Qs), static vs dynamic explainer. Most add friction (account for dynamic QR, email gate, ads after scan) → our honest differentiator: static QR, no account, no email, no ads, never expires, data not stored.

## Scope (authorized by user 2026-10-09)
- Build-time prerender per route (React SSR `renderToString`, no headless browser, no new runtime deps).
- Helmet on all pages; real home at `/`; sitemap/robots; alt text; `og:image`; JSON-LD (WebApplication, FAQPage, HowTo, BreadcrumbList).
- Content: home with promise, 3-step how-to, per-type landing content + FAQ, static vs dynamic, honest comparison (no brand names), FAQ ~12 Qs. es/en/pt; SEO targets Spanish.
- Redesign using `uipro-cli` (`uipro init --ai claude`) — form and download behavior unchanged.

## Out of scope
New QR types (Google reviews, vCard, menu) — need backend changes. Push / PR / deploy — user decides.

## Constraints
- No fabricated data (no user counters, ratings, testimonials).
- Privacy claims must match code: QR is generated server-side by `Backend/api` (qrcode + sharp) and not persisted; history is local. Do NOT claim "generated in your browser".
- `Frontend/` has both `package-lock.json` and `pnpm-lock.yaml`: avoid new deps; if any are added, update both lockfiles.
- i18n `lng` reads `localStorage` at import time → must be SSR-safe.

## Checks (TDD: off — no test runner in project; source: package.json has no test script)
- `npm run build` (Frontend) passes, `npx tsc -p tsconfig.app.json --noEmit` no new errors (baseline: 3× `dataLayer` on Window, 1× unused `Header` in GeneratorPage), `npx eslint .` no new errors.
- `curl`-level check: each route's HTML in `dist/` has its own title, description, canonical, H1 and body text.
- Browser check (built-in browser, desktop + mobile 375px) via `vite preview`.

## Tasks
- [x] T0 — Commit pending GA4 fix (gtag Arguments) + lockfile sync. Route: inline. Evidence: 36a21ea.
- [x] T1 — Prerender pipeline: SSR entry, prerender script, SSR-safe i18n/window access, `/` real home, build script, Vercel serving. Route: delegated writer (2+ non-trivial files). Evidence: 1885a11; parent re-ran `npm run build` (11 pages + sitemap), unique title/canonical per file, `tsc` 0 errors (baseline fixed), eslint 0 errors/2 pre-existing warnings. Decisions: SPA fallback → `/app-shell.html` (prerendered home lives in index.html); StaticPageSeo covers non-generator pages (also covers T2 Helmet item). Untested: Vercel serving itself (verify after deploy).
- [x] T2 — SEO metadata remainder: JSON-LD, `og:image`, alt text (Helmet + sitemap done in T1). Route: merged into T3 writer. Evidence: 1126504; JSON-LD parses and matches visible FAQ/HowTo text; og/twitter image on all 11 pages.
- [x] T3 — Content: home promise, how-to, per-type content + FAQ, static vs dynamic, honest comparison, FAQ page; es/en/pt. Route: delegated writer after T5a. Evidence: 1126504; unique text per type page ~755–915 words, cross-page sentence overlap 11–15% (header/tool/footer); privacy/cookies copy corrected (false 'processed in your browser' and 'third-party ads' claims); parent added ES/PT/US to WhatsApp country selector inline.
- [x] T4 — Install UI/UX Pro Max skill (`uipro init --ai claude`) and define design system. Route: inline (install + 3 skill searches + MASTER.md overrides; no delegation needed). Evidence: c9de0a6, `Frontend/design-system/qr-gratis/MASTER.md` (teal-700 primary, orange-700 CTA — generated hues failed AA; Outfit + Work Sans; tool-first landing structure).
- [x] T5 — Redesign pages/components with the new design system (done as T5a before content). Route: delegated writer. Evidence: 3eff618; parent re-ran build (11 pages), tsc 0, eslint 0 errors; visual check in Chrome desktop light + dark (mobile 375 verified by writer via scrollWidth/menu a11y; parent could not resize maximized Chrome). Deviations accepted: CTA stays orange-700 in dark mode (orange-600 fails AA), FAQ uses native details, validation still via alert().
- og:image `Frontend/public/og-image.png` (1200×630) generated by parent with PIL; QR from production API pointing to https://www.qrgratis.es — committed with T3.
- [x] T6 — Final verification. Route: inline. Evidence: `npm run build` 11 pages; tsc 0 errors; eslint 0 errors (2 pre-existing warnings); Chrome desktop review of home sections. Pending: verify Vercel serving (cleanUrls + app-shell fallback) after deploy, GSC URL inspection, owner read of legal copy.

## Delivery
Forecast: well above ~400 authored lines (content ×3 languages + redesign). Strategy: `single-pr` (user choice 2026-10-09) — everything on `feat/seo-redesign`, work-unit commit per task, user reviews and merges once.

## Progress / evidence
- 2026-10-09: branch created, T0 committed (36a21ea). RDD: off (default) → ordinary checks.

## Next step
User review of branch `feat/seo-redesign`; push/merge/deploy is the user's decision. After deploy: check `/generador-qr/wifi` and `/history` on Vercel, submit sitemap in Search Console.

## Follow-ups (not done)
- `<title>` stays Spanish after EN/PT switch (seo.ts is es-only).
- 'Iniciar sesión' opens a 'coming soon' modal next to a 'sin registro' promise.
- Dark-mode first-paint flash (useDarkMode applies class in effect).
- Validation still uses alert().
