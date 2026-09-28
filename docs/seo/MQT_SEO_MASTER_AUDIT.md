# MQT SEO Master Audit (reconciled)

**Site:** myquicktrippers.com · **Repo:** Vidish-Bijalwan/mqt2.0
**Date:** 2026-09-28 · **Reconciled from:** `~/workspace/mqt-seo-research/` reports 01–07
**Main HEAD at audit time:** `52bf8d15`

This is the single reconciled source of truth. Five specialist tracks fed it:
competitive SEO (01), AI-search/GEO (02), keyword universe (03), analytics inventory (04),
currency spec (05), technical SEO audit (06), analytics & CRO diagnosis (07).
Where tracks disagreed, the resolution is recorded in §2 — the resolution stands,
not the individual report.

**Standing constraints (non-negotiable):** build for humans first, search engines
second. No keyword stuffing, doorway pages, hidden text, fake reviews, fabricated
facts, duplicate copy, spam backlinks, PBNs, cloaking, mass-spam outreach, invented
analytics/volumes/traffic, or nationality-based price discrimination. No ranking
promises, ever. One preferred URL per keyword cluster (no cannibalization).
Structured data only with real, visible facts. INR is canonical in all pricing and
all structured data.

---

## 1. The one-paragraph diagnosis

The site is **architecturally incapable of capturing a lead**: zero API routes, the
enquiry form only opens a prefilled WhatsApp thread, and the actual lead actions
(WhatsApp/phone/email clicks) are not even tracked. That single fact explains
"~zero leads in two months" more than any ranking problem. Layered on top:
**2,483 fabricated reviews** presented as real (source header: "Realistic seed
data") — a Google spam-policy and consumer-law risk that must be removed before
anything else compounds; unverifiable "Government approved / ISO 9001 / 24×7"
trust claims; dead "PAY ONLINE" / "MY BOOKING" CTAs; sitemap and internal-link
gaps around the destinations hub; `images.unoptimized=true` killing responsive
images; and a keyword-stuffed homepage hero/title. The realistic battlefield is
long-tail (origin × destination × duration × audience × month), not head terms —
6–12 months for measurable national movement, honest.

---

## 2. Reconciliation log (conflicts resolved)

- **R1 — Fabricated reviews.** 06 asked Vidish to confirm genuineness; 07 found the
  decisive evidence: `src/data/reviews.ts` header literally says "Realistic seed
  data" while the page claims "Real experiences. Real travelers." **Resolution:
  remove immediately, no confirmation needed.** Re-add only with real customer data.
- **R2 — Layout-wide FAQPage JSON-LD.** 06: dead weight, remove. 02: FAQPage still
  parseable by AI but rich results deprecated since 2023, and Google requires
  schema to match visible text. **Resolution: remove the blanket layout injection;
  keep FAQPage schema only on pages where the Q&A is genuinely visible.**
- **R3 — Schema's role.** 02's controlled experiment (1,885 pages vs 4,000
  controls) found **no causal citation lift from JSON-LD**. 01 recommends the
  schema stack as P0. **Resolution: ship schema work as correctness/anti-garbling
  hygiene and rich-result eligibility — never present it as an AI-citation lever.**
- **R4 — llms.txt.** 02: ~97% of files never fetched, zero measured citation
  effect — but harmless. **Resolution: ship as P3 insurance (one afternoon), never
  as a strategy line-item.**
- **R5 — Currency.** Unanimous: display-only conversion, INR canonical, JSON-LD
  stays INR, real cached FX with rate date, manual selector, "indicative" wording,
  INR fallback. Needs CA/FEMA sign-off before launch (display is not a
  transaction, but get it signed).
- **R6 — Lead capture vs traffic.** Unanimous: capture first, traffic second.
  Nothing compounds without a server-side lead record.
- **R7 — Programmatic pages.** Allowed only where each variable changes something
  real (route, transfers, price); **noindex until a pilot cohort proves quality**;
  near-duplicate origin variants are doorway-class and forbidden.
- **R8 — `images.unoptimized`.** P1 SEO slice, but implementation belongs to the
  in-flight performance workstream — coordinate, don't duplicate.
- **R9 — GA4.** Recommended; implement with a consent-aware loader and have
  Vidish confirm the privacy-policy disclosure.
- **R10 — Trust claims.** "Government approved / ISO 9001" with no certificate
  evidence → remove. "24/7 support" vs "Mon–Sat 10–7" → reconcile to real hours.
  Five "offices" with no addresses → remove or reframe honestly.

---

## 3. P0 — do first

| # | Item | Evidence |
|---|---|---|
| P0-1 | **Remove fabricated reviews** (`src/data/reviews.ts`, `/reviews` aggregates, `aggregateRating` JSON-LD, "Verified" badges) | 06 P0-1, 07 §2.1#2. Google spam policy + consumer-law risk. |
| P0-2 | **Server-side lead capture**: `/api/leads` validates, rate-limits, stores, notifies; enquiry form submits to server first (email optional, no cross-page PII persistence); `enquiry_submit` fires on server confirmation; WhatsApp becomes the confirmation channel, not the only channel | 07 §2.1#1. The #1 lead lever. |
| P0-3 | **Verify GSC + Bing Webmaster Tools**, submit sitemaps, take the measurement baseline snapshot | 01 P0.1–P0.4, 02 (Bing gates ChatGPT citations). Vidish action: account verification. |

## 4. P1 — high impact

| # | Item |
|---|---|
| P1-1 | Sitemap completeness: add `/games`, `/trip-twin`, `/trip-room`, `/destinations` hub, 5 footer-linked intl destinations; build destination URLs as the union of all 3 resolution sources |
| P1-2 | Internal linking: `/destinations` hub into nav/footer; 6 sitemap-only orphans (bhutan, kedarnath, nepal, sri-lanka, varanasi, vietnam) into the index grid; "More on \<Destination\>" hub blocks on package pages |
| P1-3 | Lead-tracking analytics: `whatsapp_click` / `phone_click` / `email_click` on every CTA, `enquiry_submit`, `search_query`, UTM capture, scroll-depth on destinations/blog, GA4, fix `enquiry_completed` semantics, fire `package_shared`/`booking_started` or remove |
| P1-4 | Schema hygiene: remove layout FAQPage; `TouristTrip` typing on packages; `ItemList` on hubs; `og:type` article→website; breadcrumb query-param fix; INR-only prices everywhere |
| P1-5 | Trust-claim cleanup per R10 |
| P1-6 | Dead CTAs: PAY ONLINE / MY BOOKING out of the header; relabel "Quick enquiry" → "View packages" where it links to a list |
| P1-7 | Homepage hero alt (~280 chars → ~125 natural) + title rewrite (deferred until games/nav workstream merges — homepage is in its scope) |
| P1-8 | og:image gaps: raster 1200×630 fallback replacing the SVG default; per-page images for games/trip-twin/trip-room (page part deferred with workstream) |
| P1-9 | Currency display localization per the spec (flagged: needs CA sign-off before launch) |

## 5. P2 — growth

- Destination schema enrichment (`image`, `geo`, `containsPlace`).
- Blog snippet editorial pass (150–160 chars, human-written; current copy reads as Mad Libs).
- Destination H2 depth: Best time / How to reach / Things to do / Where to stay / FAQ — doubles as GEO fuel (answer-first blocks, statistics, quotations, source citations).
- `proxy.ts` JP auto-redirect → dismissible banner (never crawler-differential).
- Answer-first content blocks on top commercial pages (direct-answer leads, tables, question H2s).
- GBP claim/optimization + genuine post-trip review flywheel (ops).
- Citations: JustDial, Sulekha, IndiaMART, consistent NAP (**+91 81711 58569** everywhere public).
- `llms.txt` insurance file (R4).
- Bing IndexNow wiring; explicit retrieval-crawler allows in robots.txt.
- Fixed weekly AI-citation prompt set (manual tracking; no guaranteed "ChatGPT rank" exists).

## 6. P3 — later / gated

- Controlled programmatic expansion: origin × destination pilots, then month/season — R7 gates apply.
- Data-led digital PR asset (e.g. annual "real cost of a Chardham/Kashmir trip" study from genuine pricing knowledge).
- Trip-cost estimator / best-time widget (linkable tool).
- i18n (German/French) only with real localized content; hreflang only then. Currency never in URL.

## 7. Verified healthy — do not "fix"

robots.txt (AI crawlers allowed); canonical hygiene (query-param strip, trailing-slash
308, uppercase 404); deliberate noindex on unreviewed packages; 410 legacy handling;
`Offer` JSON-LD only with real prices; per-template JSON-LD present; one H1 per page;
sitemap lastmod from data mtimes; no fake site-wide stamps.

## 8. Honest timelines (third-party benchmarks, not promises)

Local/map-pack movement 1–3 months · long-tail indexing 3–6 months · measurable
national organic growth 6–12 months · organic as a primary lead channel 12–24 months.
Only ~1.74% of pages reach top 10 within a year; the average #1 page is ~5 years old.
AI-citation footprint: ~3–6 months initial, 6–12 for competitive queries. No guarantees.

## 9. Measurement baseline (establish week 1 after instrumentation)

- GSC: clicks / impressions / CTR / position, indexed-URL count (needs P0-3).
- Vercel Analytics: top pages, countries, referrers, custom-event volumes.
- Weekly funnel: `package_view → booking_cta_click → enquiry_start → enquiry_submit → whatsapp_click`.
- Destination/blog attention: `scroll_depth_75`, `time_on_page_60s`.
- AI citations: fixed prompt set per engine, checked weekly (directional only).
- **No baseline exists today.** Do not compare future numbers against imagined past ones.

## 10. Backlog pointer

The living backlog with owners, effort, and acceptance criteria starts from §10 of
`COMPETITOR_SEO_RESEARCH.md` in this folder, re-ranked above through the
commercial-intent × lead-generation lens. Track execution per PR in git history.

---
*Adapted repo docs: `COMPETITOR_SEO_RESEARCH.md` (from 01), `KEYWORD_UNIVERSE.md` +
`keywords.csv` (from 03), `SEARCH_INTENT_MAP.md` (new), `GEO_AEO_STRATEGY.md`
(from 02), `../analytics/LEAD_FUNNEL.md` (from 04+07), `INTERNATIONAL_SEO.md`
(from 01 §3.5 + 03 §2), `../i18n/CURRENCY_LOCALIZATION.md` (from 05).*
