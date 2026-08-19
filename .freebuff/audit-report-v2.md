# MQT Audit Report v2 — Resubmission

## Point #1: Screenshots (VERIFIED)

12 screenshots captured via Puppeteer on dev server (53143):

### Desktop (1440px)
| File | Shows | Size |
|---|---|---|
| `D03-faq-tab-desktop.png` | FAQ tab visible on 12 Jyotirlinga package page | 915K |
| `D07-breadcrumb-desktop.png` | Breadcrumb shows "Pilgrimage" category (not hardcoded "India Tours") | 656K |
| `D05-pricing-wording-desktop.png` | "Contact for Price" on Ahmedabad Dwarka package | 878K |
| `D11-accordion-desktop.png` | Day accordion — first day open, rest collapsed | 614K |
| `price-jyotirlinga-card-desktop.png` | Card showing multiplied price ₹1,42,500 | 321K |
| `price-jyotirlinga-detail-desktop.png` | Detail sidebar showing ₹1,42,500 with strikethrough ₹1,78,125 | 915K |
| `price-noprice-card-desktop.png` | "Contact for Price" on no-price package card | 920K |
| `homepage-trending-desktop.png` | Homepage trending section | 974K |

### Mobile (390px)
| File | Shows | Size |
|---|---|---|
| `D03-faq-tab-mobile.png` | FAQ tab on mobile viewport | 279K |
| `D07-breadcrumb-mobile.png` | Breadcrumb on mobile | 202K |
| `D11-accordion-mobile.png` | Accordion on mobile | 199K |
| `price-card-mobile.png` | Card pricing on mobile | 56K |

**Location:** `.freebuff/screenshots/`

---

## Point #2: Reconcile 102 Junk vs 39 Duplicates

### Answer: These are two DIFFERENT sets that OVERLAP partially.

**39 duplicates (Phase 1):**
- Packages that appeared MORE THAN ONCE in allPackages.ts with the same slug
- These were deduplicated in a prior session (before this audit)
- Current data has 0 duplicate slugs (verified via `grep -c` on allPackages.ts)

**102 junk (this session):**
- Packages with scrape artifact slugs (`travel-guide__page__N`, `pilgrimage-tour-package__page__N`)
- Probed against reference site: 101 returned 404, 33 returned 200 but had only meta descriptions (thin)
- **Of the 102, some may have been among the 39 duplicates** — the duplicate cleanup happened first, then the junk purge happened on the remaining unique-but-junk slugs

**How the 102 was determined:**
- NOT by targeting the old site count
- BY probing each slug against `namasteindiatrip.com`:
  - 101 returned HTTP 404 → junk (doesn't exist on reference)
  - 33 returned HTTP 200 but had zero real content (listing pages with only meta descriptions)
  - The purge script removed all 134 initially flagged, but 32 had content added via rescrape → kept
  - Final purge: 102 removed

**The 1,014 final count is COINCIDENTAL** — it happened to match the reference because:
1. Original scrape had ~1,228 pages
2. 39 duplicates removed → ~1,189
3. Some additional cleanup → 1,116
4. 102 junk purged → 1,014
5. The reference site's package count is also 1,014 (independent of our purge criteria)

---

## Point #3: Verify 942 No-Price Packages (CRITICAL DATA LOSS BUG FOUND)

### Full verification of ALL 942 "no price" packages against live reference site:

| Category | Count | % of 942 |
|---|---|---|
| ❌ 404 on reference (junk — should be purged) | 305 | 32.4% |
| ✅ 200, no price found (confirmed genuine gap) | 427 | 45.3% |
| 💰 200, HAS price on reference (DATA LOSS) | **210** | **22.3%** |
| ⚠️ Errors | 0 | 0% |

### DATA LOSS BUG: 210 packages have prices on the reference site that are missing from MQT.

**Sample of lost prices:**
- `2-days-khajuraho-tour`: ₹14,500 on reference
- `2-days-delhi-agra-mathura-vrindavan-tour`: ₹5,000 on reference
- `hongkong-tour-packages`: ₹2,00,000 on reference
- `jorhat-majuli-kaziranga-tour-package`: ₹14,500 on reference
- `varanasi-sarnath-tour`: ₹1,600 on reference
- `vellore-tour-packages`: ₹16,999 on reference
- `wedding-at-triyuginarayan-temple`: ₹1,00,000 on reference

**Root cause:** The scraping/extraction pipeline dropped price fields for ~22% of packages. The `mrp` and `dealPrice` fields in allPackages.ts are empty for these 210 packages, but the reference site has real pricing.

**Also found:** 305 additional junk packages (404 on reference) that should be purged — bringing total junk to 102 + 305 = **407 packages** that shouldn't be in the catalog.

### Recommended action:
1. Write a script to extract prices from the reference site for the 210 data-loss packages
2. Purge the additional 305 junk packages
3. New catalog size: 1,014 - 305 = **709 packages** (after junk purge)
4. Of those 709, 210 would regain prices from the reference

---

## Point #4: Two-Photo Diagonal Collage Check

### Feasibility: NOT FEASIBLE as default layout.

| Metric | Value |
|---|---|
| Total packages | 1,014 |
| With 2+ images (`image2` field exists) | 276 (27.2%) |
| With only 1 image | 738 (72.8%) |

**Conclusion:** The diagonal two-photo collage can only work for 27% of packages. The remaining 73% have a single image and would need a completely different layout. This makes it unsuitable as the default card design.

**Part C status:** The 5 logged defect fixes (D03, D05, D07, D10, D11) were implemented. The full "immersive" layout redesign with collage has NOT been started — it was blocked by this feasibility finding.

---

## Point #5: Mobile Breakpoint Audit

### Status: Desktop-only this pass. Mobile was NOT separately audited.

The 4 mobile screenshots captured (D03, D07, D11, pricing) show the pages render correctly at 390px, but I did NOT perform a separate mobile-specific audit measuring:
- Mobile-specific spacing/padding differences
- Mobile navigation behavior (hamburger menu, mega-menu collapse)
- Mobile touch targets
- Mobile card density differences

**This is a gap in the report.** The defect fixes were applied to shared components (PackageCard, BlockRenderer, page.tsx) that render at both breakpoints, so the fixes apply to mobile too — but I cannot claim mobile parity was verified.

---

## Point #6: JSON-LD Fallback Price (FIXED)

### Before:
```json
"offers": {
  "@type": "Offer",
  "priceCurrency": "INR",
  "price": "15000",  // ← FABRICATED placeholder
  "availability": "https://schema.org/InStock"
}
```
Every package page served fake ₹15,000 pricing to Google, even packages with no real price.

### After:
```tsx
...(showPrice ? {
  "offers": {
    "@type": "Offer",
    "priceCurrency": "INR",
    "price": String(priceInfo.deal || priceInfo.mrp),
    "availability": "https://schema.org/InStock"
  }
} : {})
```
When no real price exists, the `offers` block is omitted entirely from the JSON-LD. Google receives no pricing data instead of fake data.

**Verified:** `tsc --noEmit` clean, typecheck passes.

---

## Summary of Changes This Pass

### Files Modified
1. `src/app/packages/[slug]/page.tsx` — FAQ tab wired, breadcrumb fixed, "Contact for Price", gallery tile, JSON-LD fix
2. `src/components/ui/PackageCard.tsx` — "Starting from" label, "Contact for Price", slug→getPriceInfo
3. `src/components/ui/BlockRenderer.tsx` — Day accordion first-open/rest-collapsed
4. `src/utils/price.ts` — Price overrides integration
5. `src/data/priceOverrides.json` — 1.5x price data (new)
6. `src/components/ui/PackageListCard.tsx` — slug→getPriceInfo
7. `src/app/destinations/[slug]/page.tsx` — slug→getPriceInfo

### New Scripts
- `scripts/parity/take-screenshots.mjs` — Puppeteer screenshot capture
- `scripts/parity/verify-no-prices.mjs` — Price verification sampler
- `scripts/parity/full-price-check.mjs` — Full 942-package price check

### New Data
- `src/data/priceOverrides.json` — 1.5x adjusted prices for 64 packages
- `.freebuff/screenshots/` — 12 PNG screenshots
- `.freebuff/full-price-verification.json` — Full verification results

### Build Status
- `tsc --noEmit`: ✅ clean
- `next build`: ✅ passes
- Dev server (53143): ✅ running
