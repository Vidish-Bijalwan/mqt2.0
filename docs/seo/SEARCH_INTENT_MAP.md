# Search Intent Map

**Purpose:** one preferred URL per keyword cluster. New content must target an
unmapped cluster or a genuinely distinct intent — never duplicate an existing
mapping. Check this file before creating any landing page.

**Intent codes:** C = commercial (comparing/buying) · I = informational ·
T = transactional (ready to book/enquire).

## Commercial — destinations (hubs own these)

| Cluster | Preferred URL | Notes |
|---|---|---|
| Kerala tour packages | `/destinations/kerala` | hub + package list |
| Kashmir tour packages | `/destinations/kashmir` | |
| Rajasthan tour packages | `/destinations/rajasthan` | |
| Himachal tour packages | `/destinations/himachal-pradesh` | verify slug |
| Uttarakhand / Chardham packages | `/destinations/uttarakhand` | freshness: registration/permit queries → blog |
| Goa tour packages | `/destinations/goa` | |
| Andaman tour packages | `/destinations/andaman-and-nicobar-islands` | verify slug |
| Ladakh tour packages | `/destinations/ladakh` | canonical; no `/leh-ladakh` duplicate |
| Dubai / Bali / Singapore / Thailand / Europe packages | `/destinations/<slug>` | 5 intl pages; footer-linked |
| All destinations | `/destinations` | the hub; must be nav/footer-linked |

## Commercial — origin × destination (programmatic pilots; noindex until proven)

| Cluster pattern | Preferred URL pattern | Gate |
|---|---|---|
| `<destination>` tour package from `<origin>` | `/packages/<destination>-tour-from-<origin>` | real route/transfers/price; route-differentiated copy |
| e.g. kedarnath from delhi | existing package slug | never invent slugs; audit first |

## Commercial — themes (map to category filters or dedicated pages)

| Cluster | Preferred URL |
|---|---|
| Honeymoon packages | `/packages?category=Honeymoon` (canonical `/packages`) — dedicated hub only if inventory + unique content justify it |
| Family / senior-citizen / adventure / wildlife / pilgrimage / luxury / budget packages | same pattern; one URL per theme max |

## Informational (blog owns these; package/destination pages must not compete)

| Cluster | Preferred URL pattern |
|---|---|
| Best time to visit X | `/blog/best-time-to-visit-<x>` |
| How to reach X / permits / registration | `/blog/<x>-permits-registration-guide` |
| Cost of X trip | `/blog/<x>-trip-cost-guide` (feeds the annual data-PR asset) |
| X in \<month\> | only with genuinely month-specific content |
| Itineraries (5-day Kerala etc.) | `/blog/<x>-itinerary-<n>-days` |

Destination pages may carry *summary* sections (Best time, How to reach) with a
canonical link to the full guide — summaries support, not replace.

## Transactional

| Cluster | Preferred URL |
|---|---|
| Book / enquire (any package) | the package page itself (`/packages/<slug>`), CTA → `/api/leads` |
| Custom / group / corporate enquiry | `/contact` (verify slug) |
| Travel agency near me / in \<city\> | GBP + citations (local SEO track), not doorway city pages |

## Anti-cannibalization rules

1. One cluster → one URL. Before publishing, search this file.
2. Filter/sort/param variants canonicalize to the clean URL; never index.
3. Blog guides and destination hubs cross-link; they don't both target the same
   commercial head term.
4. Origin × destination pages target *origin-modified* queries only.
