# Competitor SEO Research (adapted)

**Source:** `~/workspace/mqt-seo-research/01-competitive-seo.md` (520 lines, 12 competitors, inspected 2026-09-28)
**Adapted:** 2026-09-28 · **Standing:** white-hat only; no ranking guarantees.

## Verdict

The winnable battlefield is **long-tail, not head terms**. Thrillophilia's observed
URL architecture proves the model: an origin × destination matrix turns one real
itinerary into dozens of genuinely distinct landing pages. Global platforms' moats
are supply/UGC-side, not trick-side — replicate their *page templates*, not their scale.

## What to copy (patterns, not content)

- **Thrillophilia** (observed): `/tours/<keyword-slug>` + `/cities/<dest>/tours/from-<origin>`;
  tour page = H1 → duration + per-day stops → inclusion chips → Trip Highlights →
  truthful price → rating + real count → Inclusions/Exclusions → Know Before You Go →
  "More on \<Destination\>" hub links. robots.txt blocks tags, blog-category
  archives, internal search, parameter search pages.
- **Viator** (observed): overview → why-choose → inclusions → meeting/pickup →
  itinerary → additional info → cancellation → FAQs; attraction cross-link blocks;
  visible product identity.
- **GetYourGuide** (observed): hub → subcategory → product; price-led titles only
  with real bookable prices; tracking in query params, never separate URLs.
- **TripAdvisor** (observed): host responses to reviews by name/role; date-stamped
  reviews; traveler photos. Reproducible as a *habit*, not at their scale.

## What is off-limits

- MakeMyTrip-style exact-match microsite/link networks (reported as link-scheme-like).
- Goibibo-style utility traffic (PNR status, train schedules) — vanity visits, ~zero package intent.
- Head terms ("hotels", "cheap flights"), UGC review scale, ccTLD-per-market empires.

## Schema stack (travel pages)

| Page type | Types |
|---|---|
| Package detail | `TouristTrip` (or `Product`) + truthful `Offer` + `BreadcrumbList` |
| Destination hub | `CollectionPage`/`WebPage` + `ItemList` + `BreadcrumbList` |
| Blog/guide | `Article`/`BlogPosting` + real named author + `datePublished`/`dateModified` |
| Site entity | `Organization` + `TravelAgency`, one canonical `@id` |

**Truthfulness:** JSON-LD must match visible content 1:1. `AggregateRating` only with
genuine visible reviews + real counts. `Offer.priceCurrency` always `"INR"`; converted
display prices never enter structured data (avoids any cloaking interpretation).

## Crawl control

Index curated inventory (tours, hubs, guides); de-index combinatorial exhaust
(tags, internal search, sort/filter params). Curated facets get clean URLs only with
real demand + inventory + unique content. Pagination: unique URLs, self-canonicals
(page 2+ never canonicalizes to page 1). Empty filter combos → real 404.

## Core Web Vitals targets (field data, 75th percentile, 28-day CrUX)

LCP ≤ 2.5s · INP ≤ 200ms · CLS ≤ 0.1. Lab scores are debugging, not proof; field
data lags ~28 days after a fix.

## Sequencing for a small site

Technical baseline → package-page quality → internal linking/clusters → GBP + local
proof → E-E-A-T editorial → linkable assets/digital PR → **only then** controlled
programmatic expansion. Thin pages first = wasted crawl budget.

## Local SEO

GBP: honest categories, exact NAP (**+91 81711 58569** — the production number;
the testing number never appears publicly), real photos, posts cadence, genuine
post-trip review requests + replies by name. Citations: JustDial, Sulekha,
IndiaMART. Two tracks: operating-market map pack (Dehradun/Uttarakhand) vs
destination-expertise organic.

## Linkable assets (white-hat)

Annual data study (e.g. "real cost of a Chardham trip" from genuine pricing
knowledge); trip-cost estimator / best-time widget; expert quotes for journalists;
creator-blog links from the existing Instagram program; broken-link replacement
only with a genuinely better resource.

## Developer action list

The full 24-item list with owners, effort, and acceptance criteria is §10 of the
source report. It has been re-ranked through the lead-generation lens in
`MQT_SEO_MASTER_AUDIT.md` §§3–6, which is the execution order.
