# Feature: QR tools — client-side engine, new types, checker, templates, bulk

Locator: `odd/tasks/qr-tools.md` · Engram mirror: `odd/qr-tools/tasks` · Branch: `feat/qr-tools` (stacked on `feat/seo-redesign` @ 5cd52fc)

## Objective
Give people reasons to come back to https://www.qrgratis.es: more QR types, printable templates, a readability checker and bulk generation — each as an indexable landing page — on top of a QR engine that runs entirely in the browser.

## Why (research 2026-10-09, sources in session report)
- Google Suggest (es-ES) shows demand for "qr para reseñas de google", "qr vcard/tarjeta de visita", "qr ubicacion google maps", "cartel qr wifi", "plantilla qr reseñas google", "pegatina qr", "crear qr masivo".
- Competitors gate templates (Canva/ME-QR need account; ME-QR ads after scan) and bulk (QR Tiger paid plans). Gap: free, no signup, client-side, in Spanish.
- Client-side generation: faster (no network/cold start), data never leaves the device, no CORS/server cost, required for bulk and for module-level checks.
- Current backend uses `margin: 1`; ISO/IEC 18004 quiet zone is 4 modules.

## Scope (authorized by user 2026-10-09: "confirmo el plan, haz todas las fases")
- F0: MIT license; client-side QR engine replacing `Backend/api` calls (PNG/JPG/SVG/vector PDF, logo, color, size, ECC H, quiet zone 4); privacy copy updated.
- F1: new types with own landing + content + FAQ + JSON-LD: resenas-google, vcard, ubicacion, email, telefono, sms, instagram, evento; "Más tipos" nav.
- F2: readability checker (live warnings: contrast, inverted, logo size, quiet zone; print-size calculator 10:1; "Probar escaneo" decode via lazy zxing-wasm) + `/verificador-qr` (upload image → decode + report).
- F3: printable templates: `/plantillas-qr` + cartel-wifi, cartel-resenas-google, pegatina-escaneame, tarjeta-de-visita, menu-restaurante; A4/A5/A6 tent, stickers 5/8/10 cm, card 85×55 (+3 mm bleed); vector PDF + PNG 300 dpi.
- F4: bulk: `/generador-qr-masivo` CSV (contenido, nombre_archivo, tipo), ≤500 rows, progress, ZIP (PNG/SVG + manifest.csv) + A4 PDF sheet.
- All: es/en/pt, prerender + sitemap, design system, lazy-loaded deps.

## Out of scope
Bizum QR (no public payload standard), TikTok/PayPal types, Excel upload, dynamic QR, deleting `Backend/` (kept, unused). Push/PR/deploy — user decides.

## Constraints
- Truthfulness: only claim what code does; after F0, "tus datos no salen de tu dispositivo" becomes true — update privacy/FAQ/comparison copy accordingly. No fake data.
- Google review link: do not construct undocumented formats as the main path; user pastes the link from Business Profile (validated), with guide.
- New deps only via npm in `Frontend/`; parent syncs `pnpm-lock.yaml` with `CI=true npx pnpm@9 install --lockfile-only` (never let pnpm purge node_modules).
- Prerender guarantees: one h1, unique title/description/canonical per route.
- Delivery: `single-pr` (same as previous feature; user asked to leave everything finished for review).

## Checks (TDD: off — no test runner)
`npm run build` (route count grows per phase), `npx tsc -p tsconfig.app.json --noEmit` 0 errors, `npx eslint .` 0 errors, browser check of new pages (generate + download where applicable), scan-test generated codes via decoder.

## Tasks
- [x] F0a — MIT LICENSE + README license section. Route: inline. Evidence: e04ca1c.
- [x] F0b — Client-side QR engine + exports + privacy copy. Route: delegated writer. Evidence: db031b5; parent re-ran build (11 pages), tsc 0, eslint 0 errors, no server refs; initial JS 285.9 → 152.2 kB gzip (qrcode 9.7 kB and jsPDF lazy chunks); writer verified matrix == QRCode.create for 5 inputs incl. UTF-8, quiet zone 4, PNG module sampling 0 mismatches, all 4 download formats. Real scanner test pending → F2 (zxing). Logo backing capped at 25% of side (backend used ~29%).
- [ ] F1a — Types: resenas-google, vcard, ubicacion, email (+ "Más tipos" nav, routing scaffolding). Route: delegated writer. STOPPED by user request 2026-10-09 during the writer's final browser check; changes left uncommitted (17 files, +2033/−171; new `config/qrTypes.ts` registry, `utils/qrPayloads.ts`, `TypeFields.tsx`, `MoreTypesMenu.tsx`). Parent check after stop: build 15 pages, tsc 0, eslint 0 errors. Not reviewed: payload sanity, browser pass, content read. Committed as WIP on user request 2026-10-11 (before review) and pushed; review + finish pending.
- [ ] F1b — Types: telefono, sms, instagram, evento. Route: delegated writer.
- [ ] F2 — Readability checker + /verificador-qr. Route: delegated writer.
- [ ] F3 — Printable templates. Route: delegated writer.
- [ ] F4 — Bulk CSV generator. Route: delegated writer.
- [ ] F5 — pnpm-lock sync, README/feature update, final verification. Route: inline.

## Progress / evidence
- 2026-10-11: pnpm-lock synced (qrcode) via `CI=true npx pnpm@9 install --lockfile-only` — it still wiped node_modules; restored with `npm install`. Use a separate copy/dir for future pnpm syncs.
- 2026-10-09: branch created from feat/seo-redesign; node_modules re-verified with npm after an aborted pnpm frozen check (build OK).

## Next step
Review F1a (payloads, browser pass, content), then F1b → F5.
