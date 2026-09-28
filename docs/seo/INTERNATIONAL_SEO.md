# International SEO Strategy

**Sources:** `01-competitive-seo.md` §3.5, `03-keywords.md` §2 · **Date:** 2026-09-28

## Posture: conservative, one domain

- **One canonical URL per page. Currency in a cookie, never in path/query, no
  hreflang per currency.** Currency variants are not locale content and must not
  fork indexation.
- **One strong domain beats a ccTLD empire** for a small agency — ccTLDs split
  authority and multiply maintenance.
- Do not auto-generate thin destination pages in N languages. **Localize only
  what is editorially maintained.**
- If/when real locale versions ship: reciprocal hreflang + `x-default`,
  language-prefixed paths (pick one scheme), separate sitemaps per language,
  server-rendered hreflang, per-locale structured data, never canonicalize one
  language to another.

## Priority markets (volume × intent × competition × English ease)

| Priority | Markets | Rationale |
|---|---|---|
| **Phase 1** | USA, UK, Australia | Largest English-speaking FTA sources (USA 1.80m, UK 1.02m, AU 0.52m FTAs 2024); strong escorted/private-tour intent; long-tail private/spiritual/wildlife combos are winnable |
| **Phase 1b** | UAE, Saudi Arabia | Kerala family demand (GCC Kerala visits +26%); halal-friendly/private-transport positioning; Arabic later |
| **Phase 2** | Germany, France | Needs real German/French content — the localization *is* the product (`Indien Rundreise`, `circuit Rajasthan`, …) |
| Later | Singapore, Japan | Niche themes (5–6 day Golden Triangle, etc.) |

## Content plays per phase

- **Phase 1:** USA/UK/AU long-tail landing pages (private tours, spiritual,
  wildlife, escorted) + Kerala–GCC family pages. English only; currency display
  localizes via the currency spec (display-only, INR canonical).
- **Phase 2:** German/French localized pages with native-quality editorial —
  machine-translated filler is a quality risk, not a strategy.

## Technical notes

- `x-vercel-ip-country` drives display currency; bots (no geo header) get INR —
  SEO-safe, same canonical content.
- Never auto-redirect users by country (see `proxy.ts` JP redirect → replace with
  a dismissible banner). Country-based auto-redirects confuse crawlers and annoy
  users; never treat crawlers differentially.
