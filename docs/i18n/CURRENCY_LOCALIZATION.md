# Currency Localization Architecture

**Source:** `~/workspace/mqt-seo-research/05-currency-spec.md` (research complete
2026-09-28, not yet implemented) · **Status:** spec — needs CA/FEMA sign-off before launch.

**Principle:** display-only conversion of real INR prices. We never invent
prices; billing stays INR. No nationality-based price discrimination — every
visitor sees the same INR truth with an indicative local-currency reference.

## Decisions

| Concern | Decision |
|---|---|
| Geo-IP source | Vercel native headers (`x-vercel-ip-country`, ISO 3166-1) — all deployments, zero latency, zero cost |
| FX primary | `GET https://open.er-api.com/v6/latest/INR` — keyless, 160+ currencies, daily updates. Attribution: "Rates By Exchange Rate API" |
| FX fallback | `GET https://api.frankfurter.dev/v1/latest?base=INR` — keyless, ECB-backed (pin `api.frankfurter.dev/v1`; no Gulf currencies — fallback only) |
| Rate storage | Vercel Edge Config key `fx_rates` (~10 KB), written by cron, read at the edge |
| Refresh | Vercel Cron daily 01:30 UTC. Serve fresh <36h; stale-but-servable to 7 days (show rate date); >7 days → INR-only |
| Where conversion happens | Server Components (SEO-safe HTML, no layout shift). Middleware only maps country → currency into an `x-display-currency` request header. Never call FX APIs from the browser |
| Manual override | `mqt_currency` cookie (30 days), set by a client-side switcher; **cookie always wins** over geo-IP |
| Canonical/SEO | One canonical URL per page. Currency in a cookie, **never** path/query. No hreflang per currency. JSON-LD `Offer.priceCurrency` stays `"INR"`; bots (no geo header) get INR. Keep the INR price visible in HTML for every geo (no cloaking interpretation) |

## Data flow

```
[Vercel Cron 01:30 UTC] → open.er-api.com/v6/latest/INR
  (timeout 8s; on fail → api.frankfurter.dev/v1/latest?base=INR;
   validate USD/EUR/GBP/AED present, timestamp <48h)
→ [Edge Config: fx_rates = {provider, fetchedAt, rateDate, base:"INR", rates}]
[Request] → middleware: country = x-vercel-ip-country;
  currency = cookie mqt_currency ?? COUNTRY_CURRENCY_MAP[country] ?? "INR";
  set x-display-currency header
→ [Server Component] read fx_rates → convert → Intl.NumberFormat(locale, {currency})
```

## Country → currency map (samples; ~60 markets in code, unmapped → INR)

US→USD (en-US) · GB→GBP (en-GB) · AU→AUD (en-AU) · SG→SGD (en-SG) ·
DE/FR/IT/ES/NL→EUR (de-DE/fr-FR/…) · AE→AED · SA→SAR · QA→QAR · KW→KWD ·
**Scandinavia is NOT euro:** SE→SEK, NO→NOK, DK→DKK · IN/default→INR (en-IN).

## Formatting rules

- `Intl.NumberFormat(locale, { style: "currency", currency })` — CLDR decimals
  (JPY/KRW/VND/IDR = 0; BHD/KWD/OMR = 3). Pre-round to the currency's fraction digits.
- Indicative display rounds to whole minor units. Never display below the smallest
  sensible unit.
- **Null-price hard rule:** `priceInr == null` → "Price on request". The converter
  rejects null/NaN. Never render $0 or NaN.

## Compliance (not legal advice — CA/FEMA counsel sign-off required)

FEMA governs transactions, not display. RBI circular 09.05.2023 + FEMA 2023 Reg 3:
fees payable in India denominated and settled in rupees only. **Rules:** checkout,
invoices, payment gateway = INR only. Every converted price carries:
*"Indicative conversion for reference only. All bookings are billed and settled in
Indian Rupees (INR)."* Never "Pay in USD". Always show the rate date.

## Failure modes

VPN/proxy wrong country → harmless (display-only; picker overrides) · bots →
INR default · FX API down → fallback provider, keep last snapshot, alert, retry in
1h · snapshot >7 days → INR-only + "conversion unavailable", never show a rate
without its date · Edge Config unreachable → in-memory last-known-good → INR-only ·
null price / missing currency → "Price on request" / INR fallback.

## Build checklist

1. `mqt_currency` cookie reader + `COUNTRY_CURRENCY_MAP` in a shared lib.
2. `middleware.ts` (or proxy.ts): geo → currency resolution, `x-display-currency` header. No FX calls.
3. Cron route (01:30 UTC): fetch → fallback → validate → write Edge Config.
4. `convertInr(amountInr, currency, rates)`: null-rejecting, Intl-formatted, returns rate date.
5. Price components: converted price + INR reference + "indicative" note + rate date.
6. Currency switcher (sets cookie, refreshes).
7. JSON-LD `priceCurrency: "INR"` unchanged; canonical URLs unchanged.
8. Tests: null price, missing currency, stale snapshot, cookie override, bot.
