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
- [ ] T1 — Prerender pipeline: SSR entry, prerender script, SSR-safe i18n/window access, `/` real home, build script, Vercel serving. Route: delegated writer (2+ non-trivial files).
- [ ] T2 — SEO metadata: Helmet on every page, JSON-LD, `og:image`, sitemap/robots, alt text. Route: delegated writer.
- [ ] T3 — Content: home promise, how-to, per-type content + FAQ, static vs dynamic, honest comparison, FAQ page; es/en/pt. Route: delegated writer.
- [ ] T4 — Install UI/UX Pro Max skill (`uipro init --ai claude`) and define design system. Route: inline install + delegated design.
- [ ] T5 — Redesign pages/components with the new design system. Route: delegated writer.
- [ ] T6 — Final verification (build, types, lint, prerender HTML audit, desktop/mobile browser pass). Route: inline.

## Delivery
Forecast: well above ~400 authored lines (content ×3 languages + redesign). Strategy: `single-pr` (user choice 2026-10-09) — everything on `feat/seo-redesign`, work-unit commit per task, user reviews and merges once.

## Progress / evidence
- 2026-10-09: branch created, T0 committed (36a21ea). RDD: off (default) → ordinary checks.

## Next step
T1 prerender pipeline.
