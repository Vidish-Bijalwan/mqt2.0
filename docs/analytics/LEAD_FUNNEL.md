# Lead Funnel & Analytics

**Sources:** `~/workspace/mqt-seo-research/04-analytics.md` (inventory),
`07-analytics-cro.md` (diagnosis + CRO) · **Repo HEAD:** `52bf8d15` · **Date:** 2026-09-28

## The funnel as it actually is (VERIFIED)

```
Package page view → (maybe) price section → enquiry form → [window.open(wa.me/...)]
→ user may or may not press send in WhatsApp → business may never know
```

There are **zero API routes**. The form's own comment: *"There is no lead-capture
API configured in this static site. Open the prefilled business WhatsApp thread
instead of falsely claiming a lead was submitted and then discarded."*
`enquiry_completed` fires when WhatsApp **opens**, not when a message is sent —
analytics overcounts even that. This fully explains "~zero leads": the site is
architecturally incapable of capturing one.

## What is installed

- `@vercel/analytics` v2 (pageviews) + `@vercel/speed-insights` v2.
- `src/lib/analytics.ts`: typed wrapper over Vercel `track()`; 17 events defined,
  ~9 actually firing. **Never fired:** `package_shared`, `booking_started`.
- No GA4, no Meta Pixel, no GTM, no session replay. (Deliberate minimalism — keep
  the stack small, but GA4 is recommended for acquisition analysis.)

## The actual lead actions are invisible

`whatsapp_click`, `phone_click`, `email_click` — the business's real conversions —
are **not tracked anywhere**. Destination/blog pages have no attention events.

## Target funnel (after P0-2 + P1-3)

```
package_view → booking_cta_click → enquiry_start → enquiry_submit (server-confirmed)
→ whatsapp_click (confirmation) → team follow-up
```

## Event taxonomy (fire via `src/lib/analytics.ts`; GA4 `gtag` once installed)

| Event | Trigger | Props |
|---|---|---|
| `destination_view` | destination page mount (once) | `slug` |
| `package_view` | package page mount (once) — exists | `slug`, `category` |
| `search` | site search submitted | `query` (no PII), `results_count` |
| `package_filter` | filter applied | `filter_type`, `filter_value` |
| `price_section_view` | pricing enters viewport — exists | `slug` |
| `tier_selected` | Good/Better/Best — exists | `slug`, `tier` |
| `booking_cta_click` | any Book/Enquire/Check-availability CTA — **new** | `slug`, `cta_location` |
| `enquiry_start` | first form interaction (move from submit) | `package` / `general` |
| `enquiry_submit` | **server confirms lead stored** — new | `package`, `lead_id`, `channel` |
| `whatsapp_click` | any wa.me link — **new, highest priority** | `location`, `context` |
| `phone_click` / `email_click` | any tel:/mailto: — new | `location` |
| `scroll_depth_75` / `time_on_page_60s` | destinations/blog — new | `slug` |
| `package_shared` | share action — wire up or remove | `slug`, `channel` |
| trip_twin / trip_room / voucher events | exist — keep | per current props |

UTM: capture `utm_*` on landing → sessionStorage → attach to `enquiry_submit`.
Game-to-lead: anonymous first-party ID tying `voucher_game_won` → later `enquiry_submit`.

## CRO fixes (ranked; see master audit for execution order)

1. Real server-side lead endpoint + team notification (P0-2).
2. Instrument the real funnel (#3 above).
3. Remove fabricated reviews (P0-1); substantiate or remove trust claims.
4. Fix/remove dead CTAs (`/pay-online`, `/my-booking`); relabel "Quick enquiry" → "View packages".
5. Form friction: email optional; submit to server first; no cross-page PII persistence.
6. Surface *real* social proof on homepage + package pages — only after reviews are genuine.
7. GA4 + Search Console (measurement).
8. Voucher-code fraud review: codes appear client-generated — define server-side
   issuance/validation before scaling the game.

**Explicitly rejected:** fake urgency timers, invented scarcity, fabricated
testimonials, purchased reviews/backlinks.

## Data availability (honest)

Vercel Analytics dashboard (project `mqt`), GSC, and GA4 hold the real numbers —
**no agent has access; nothing here is inferred.** Vidish: Analytics tab in the
Vercel dashboard shows traffic by country, top pages, and event counts today.
Week-1 baseline after instrumentation; no baseline exists now.
