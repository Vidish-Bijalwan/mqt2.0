# Product Requirements Document — My Quick Trippers (MQT India)

## 1. Product Overview

**My Quick Trippers** (brand: **MQT India**) is a B2C tour-and-travel booking website for an Indian travel agency headquartered in New Delhi. The agency is ISO 9001:2008 certified with 10+ years of experience, 50,000+ satisfied travellers, 500+ tour packages, and offices in Delhi, Hyderabad, Pune, Kashmir, Bengaluru, Dehradun, plus overseas presence in the USA, Sri Lanka, and Nepal.

The website is a **content-heavy, SEO-first** property rebuilt from scratch as a Next.js 16 app, seeded with real data scraped from the legacy site (`namasteindiatrip.com`) using a custom Python pipeline. Its primary goal is to rank organically on Indian travel queries and convert visitors to enquiries or WhatsApp contacts.

**Domain:** `https://www.myquicktrippers.com`  
**Phone / WhatsApp:** +91-8171158569  
**Email:** info@myquicktrippers.com

---

## 2. Target Users

| Persona | Need |
|---|---|
| **Indian domestic travellers** | Browse and compare India tour packages (pilgrimage, adventure, family, honeymoon) |
| **NRI / international tourists** | Find curated India experiences; familiar brand trust markers |
| **Group tour bookers** | Fixed-departure group packages |
| **Pilgrimage seekers** | Char Dham, Amarnath, Vaishno Devi, 12 Jyotirlinga, Kailash itineraries |
| **Honeymoon/special occasion** | Curated theme packages |

---

## 3. Core User Flows

### 3.1 Discovery → Enquiry (Primary Conversion)
```
Homepage → Browse trending packages / destination cards
→ Package listing page /packages
→ Package detail page /packages/[slug]
→ Enquiry form (#enquiry anchor) OR WhatsApp floating button
→ Agent follow-up (offline CRM)
```

### 3.2 Destination Browsing
```
Homepage destination grid or Navbar mega-menu
→ /destinations/[slug] (87 destination guide pages)
→ Filtered package listing for that destination
→ Package detail → Enquiry
```

### 3.3 Blog SEO Entry
```
Google organic search → /blog/[slug] (410 blog posts)
→ AutoLinker injects contextual links to relevant packages
→ Package detail → Enquiry
```

### 3.4 Special Tour Themes
```
Homepage theme tiles (Family, Honeymoon, Adventure, etc.)
→ /special-tours/[theme]
→ Filtered package listing
→ Package detail → Enquiry
```

---

## 4. Feature Inventory

### 4.1 Currently Built ✅

| Feature | Route / Component | Notes |
|---|---|---|
| Homepage hero + poster marquee | `page.tsx` + `PosterMarquee.tsx` | Auto-scrolling ambient carousel of 33 destination posters |
| Trending packages grid | `page.tsx` | 10 packages from `allPackages` |
| Destination grid | `page.tsx` | 14 state/region cards |
| Theme holiday tiles | `page.tsx` | 9 categories with Lucide icons |
| Experience tiles | `page.tsx` | 6 activity types |
| Package listing page | `/packages/page.tsx` | Filterable list from `allPackages` (~1,200+ entries) |
| Package detail page | `/packages/[slug]/page.tsx` | Rich itinerary from `packageDetails.json` (121 full entries) |
| Destination guide pages | `/destinations/[slug]/page.tsx` | 20 detailed destination guides from `destinationsData.json` |
| Blog listing | `/blog/page.tsx` | 410 posts from `fullBlogData.json` |
| Blog post detail | `/blog/[slug]/page.tsx` | Full article with AutoLinker |
| Special tours | `/special-tours/page.tsx` | Theme-based filtered pages |
| Customer center | `/customer-center/` | Support/FAQ |
| Navbar | `Navbar.tsx` | Mega-menus for India Tours & International Tours |
| Footer | `Footer.tsx` | Links, social, contact |
| Floating WhatsApp | `FloatingWhatsApp.tsx` | Persistent CTA |
| Floating call buttons | `FloatingButtons.tsx` | Phone + scroll-to-top |
| Enquiry API | `/api/enquiry/` | POST endpoint for enquiry form |
| Contact API | `/api/contact/` | POST endpoint for contact form |
| Sitemap | `sitemap.ts` | Dynamic: all packages + destinations + blogs |
| Robots.txt | `robots.ts` | Standard allow/disallow |
| 301 Redirects | `next.config.ts` | 500+ URL redirects from `redirects.json` |
| Schema.org JSON-LD | `layout.tsx` | Organization + WebSite schema |
| SEO metadata | Per-page `generateMetadata()` | Title, description, canonical |

### 4.2 Planned / Partially Stubbed ⚠️

| Feature | Status | Location |
|---|---|---|
| Search functionality | ❌ Not built | No search UI or API route |
| User authentication | ❌ Not built | No auth provider |
| Online payment | ⚠️ Link exists in navbar ("Pay Online") but no `/pay-online` route implemented | |
| My Booking | ⚠️ Link exists in navbar but no route or backend | |
| Reviews page | ⚠️ Link in top navbar but no `/reviews` route | |
| Careers page | ⚠️ Link in top navbar but no `/careers` route | |
| Currency/language switcher | ⚠️ UI placeholder in navbar (🇬🇧 English ▼) but not functional | |
| Package image coverage | ⚠️ Many packages default to fallback image (chardham.jpg) — scripts/copy-scraped-images.js automates this but not all slugs have matching scraped images | |
| International destinations | ⚠️ Nav links exist to /destinations/bali, /destinations/dubai etc. but these may not have data entries in destinationsData.json (only 20 entries currently) | |
| Group tours page | ⚠️ Nav link `/group-tours` exists but route not confirmed built | |

---

## 5. Content Model

### Package (allPackages.ts — ~1,200+ entries, packageDetails.json — 121 rich entries)
```
slug, title, category, image, duration, route,
description, highlights[], price, oldPrice, discount
```
Rich detail adds: `overview`, `inclusions`, `exclusions`, `itinerary[]`, `faqs[]`, `enquiryForm`

### Destination (destinationsData.json — 20 entries)
```
title, description, heroImage, sections[], packages[]
```

### Blog Post (fullBlogData.json — 410 entries, ~13.5 MB)
```
title, slug, content (HTML), excerpt, image, date, tags[]
```

### Poster (posterData.ts — 33 entries)
```
name, imageUrl (/images/posters/{slug}.png), href
```

---

## 6. Success Criteria

| Metric | Target |
|---|---|
| Google indexed pages | 500+ (packages + destinations + blogs) |
| Page speed (LCP) | < 2.5s on mobile |
| Enquiry conversion rate | > 2% of visitors |
| WhatsApp CTR | > 5% |
| Monthly organic traffic | 10,000+ sessions |
| Zero broken redirects | 500+ legacy URLs handled |

---

## 7. Known Gaps / Flags

- **`packageDetails.json.backup`** exists alongside `packageDetails.json` — the backup is 1.6 MB vs 700 KB active. The content reduction needs documentation.
- **`staticPagesData.json`** (155 KB) is present but its consumers are unclear — no obvious import found in the route files reviewed.
- **`contentData.ts`** (55 KB) is large and its usage is scattered — needs audit.
- **Image 404s**: `andaman.webp` 404 errors observed in dev server logs — the scraped images for some slugs are missing or misnamed.
- **Experiences section images** on homepage reuse the same 2 stock images across 6 tiles — needs unique imagery.
