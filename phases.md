# Development Roadmap — My Quick Trippers

## Phase Assessment Key

| Symbol | Meaning |
|---|---|
| ✅ | Fully built and working |
| ⚠️ | Partially built / has known issues |
| 🔲 | Planned, not started |
| ❌ | Identified gap — needs to be built |

---

## Phase 1 — Data Pipeline & Content Extraction ✅ COMPLETE

**Goal:** Build a reliable pipeline to extract all content from the legacy site and prepare it for the new app.

| Task | Status |
|---|---|
| Python scraper (`scraper.py`) — 4 scrape levels | ✅ |
| Scrape all packages from namasteindiatrip.com | ✅ (~1,244 raw → ~1,200 unique) |
| Scrape all blog posts (410 articles) | ✅ |
| Scrape all destination pages | ✅ (20 destinations) |
| Download package images per slug | ✅ |
| OCR-powered poster renaming (`poster_rename.py`) | ✅ (226 posters renamed) |
| Transform script: scraped JSON → `allPackages.ts` | ✅ |
| Image copy script: `scraped_data/images/` → `public/images/packages/` | ✅ |
| 500+ URL redirect map (`redirects.json`) | ✅ |
| `mqt_packages_processed.json` with 121 rich itineraries | ✅ |

**Remaining gaps:**
- Many packages still default to `chardham.jpg` fallback image — not all slugs have a matching scraped image.
- `review.csv` has poster names that couldn't be OCR'd — manual naming needed.

---

## Phase 2 — Core Web App Foundation ✅ COMPLETE

**Goal:** Build the Next.js app with all primary routes, layout, and static data integration.

| Task | Status |
|---|---|
| Next.js 16 App Router setup | ✅ |
| Tailwind CSS v4 with brand design tokens | ✅ |
| `siteConfig.ts` — single source of truth | ✅ |
| Root layout (Navbar + Footer + FloatingCTAs) | ✅ |
| Homepage (hero + 7 sections) | ✅ |
| Package listing page (`/packages`) | ✅ |
| Package detail pages (`/packages/[slug]`) | ✅ (121 rich + ~1,200 basic) |
| Destination guide pages (`/destinations/[slug]`) | ✅ (20 pages) |
| Blog listing + post pages (`/blog/[slug]`) | ✅ (410 posts) |
| Special tours pages (`/special-tours/`) | ✅ |
| Customer center page | ✅ |
| Enquiry API (`/api/enquiry`) | ✅ |
| Contact API (`/api/contact`) | ✅ |
| Dynamic sitemap (600+ URLs) | ✅ |
| Robots.txt | ✅ |
| JSON-LD schema (Organization + WebSite) | ✅ |
| 301 redirects from legacy URLs | ✅ |
| Floating WhatsApp CTA | ✅ |
| Floating call + scroll-to-top buttons | ✅ |

---

## Phase 3 — UI Polish & Hero Experience ⚠️ IN PROGRESS

**Goal:** Make the homepage visually premium and fix all UI/UX rough edges.

| Task | Status |
|---|---|
| Poster Marquee carousel (hero band) | ✅ Built |
| Marquee — ambient scroll, no lag | ✅ Fixed (opacity/glow, no scale) |
| Marquee — poster image cropping (OCR to landscape) | ✅ Done via Python crop script |
| Marquee — clipping/overflow bugs fixed | ✅ `overflow-x: hidden` on wrapper |
| Marquee — poster lightbox with zoom/pan | ✅ Built (`PosterLightbox`) |
| Marquee — MQT logo visibility (`object-position: 8%`) | ⚠️ Workaround in place — proper fix is re-cropping |
| PackageCard design (ribbon, amenities, dual CTA) | ✅ |
| AutoLinker in blog posts | ✅ |
| ItineraryAccordion for package details | ✅ |
| FilterSidebar for package listing | ✅ |
| TrustIndicators stats bar | ✅ |
| EmptyState component | ✅ |
| Homepage destination grid images | ⚠️ Several entries reuse wrong/placeholder images |
| Homepage experiences tiles images | ⚠️ 6 tiles share only 2 unique images |
| Raw `<img>` in Navbar (should be `next/image`) | ❌ Needs fix |
| `text-[9px]` readability on destination sub-labels | ⚠️ Too small on mobile |

---

## Phase 4 — SEO & Performance ⚠️ PARTIALLY DONE

**Goal:** Achieve >90 Lighthouse scores and full Google indexation.

| Task | Status |
|---|---|
| `generateMetadata()` on all page routes | ⚠️ Verify all dynamic routes have it |
| Canonical URLs | ⚠️ Verify `canonical` is set per page |
| Open Graph / Twitter card tags | ⚠️ Verify present on all pages |
| Image `alt` text on all images | ⚠️ Some package images may lack meaningful alt |
| `next/image` sizes prop on all fill images | ⚠️ Dev server logs show warnings |
| Blog `fullBlogData.json` (13.5 MB) — memory impact | ❌ Not optimised — risks OOM on build |
| Missing package images (404s) | ❌ `andaman.webp` and others 404 in dev logs |
| Structured data: TourPackage / Place schema | 🔲 Only Org+WebSite schema currently |
| PageSpeed / Core Web Vitals audit | 🔲 Not formally run |
| Image format optimisation (WebP conversion) | ⚠️ Partially done by copy script |

---

## Phase 5 — Missing Pages & Features ❌ NOT STARTED

**Goal:** Fill in stubbed navigation links that have no routes.

| Task | Status |
|---|---|
| `/pay-online` page | ❌ Linked in navbar, route missing |
| `/my-booking` page | ❌ Linked in navbar, route missing |
| `/reviews` page | ❌ Linked in navbar, route missing |
| `/careers` page | ❌ Linked in navbar, route missing |
| `/about-us` page | ❌ Referenced in sitemap, verify route |
| `/privacy-policy` page | ❌ Referenced in sitemap, verify route |
| `/terms-and-conditions` page | ❌ Referenced in sitemap, verify route |
| Language/currency switcher (🇬🇧 placeholder) | ❌ UI exists, not functional |
| Group tours page (`/group-tours`) | ❌ Nav link exists, verify route |
| International destination pages | ❌ Nav links exist (Bali, Dubai, etc.) but only 20 destinations have data |

---

## Phase 6 — Search & Discovery 🔲 NOT STARTED

**Goal:** Let users search and filter across all 1,200+ packages without browsing.

| Task | Status |
|---|---|
| Global search bar (package + destination + blog) | 🔲 |
| Search results page (`/search?q=...`) | 🔲 |
| Advanced filter: destination + duration + price | 🔲 |
| Autocomplete suggestions | 🔲 |

**Options:** Client-side search via `fuse.js` (good for static data), or index with Algolia/Typesense.

---

## Phase 7 — User Accounts & Booking 🔲 NOT STARTED

**Goal:** Online booking and payment capability.

| Task | Status |
|---|---|
| User registration / login | 🔲 |
| "My Booking" portal | 🔲 |
| Online payment integration (Razorpay / PayU) | 🔲 |
| Booking confirmation emails | 🔲 |
| Admin dashboard for enquiry management | 🔲 |

> ⚠️ This phase requires a backend/database (currently there is none). Options: Supabase, PlanetScale, or a separate API service.

---

## Current Focus (as of July 2026)

**Active phase:** Phase 3 (UI Polish) + Phase 4 (SEO/Performance) being addressed concurrently.

**Immediate priorities:**
1. Fix all 404 image errors (missing package images)
2. Fix pages missing `generateMetadata()` 
3. Add routes for linked-but-missing pages (`/pay-online`, `/reviews`, `/careers`, etc.)
4. Fix `<img>` → `<Image>` in Navbar
5. Add `sizes` prop to all `fill` images to clear dev server warnings
