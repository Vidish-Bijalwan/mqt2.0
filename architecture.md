# Architecture — My Quick Trippers

## 1. System Overview

The project is composed of two loosely-coupled subsystems:

1. **Python Scraping Pipeline** — runs outside the Next.js app. Crawls `namasteindiatrip.com`, extracts structured data, and persists it as JSON/CSV in `scraped_data/`.
2. **Next.js 16 Web App** (`myquicktrippers/`) — consumes the scraped JSON as static data. There is **no live database** — all content is baked into the build or read from large JSON files at request time.

```
namasteindia_scraper_package/
├── scraper.py                  ← Python crawler (Selenium + requests)
├── poster_rename.py            ← OCR-powered poster image naming tool
├── requirements.txt            ← Python deps (selenium, pillow, pytesseract)
├── scraped_data/               ← Scraper output (DO NOT EDIT MANUALLY)
│   ├── html/                   ← Raw page HTML
│   ├── text/                   ← Extracted text JSON
│   ├── images/                 ← Downloaded images per page slug
│   ├── mqt_packages_processed.json   ← Cleaned package list (~1,200)
│   ├── seo_data.json           ← Meta/SEO inventory
│   └── ...                     ← Other scraper outputs (see README.md)
├── POSTERS/                    ← 226 branded poster PNGs (named by OCR)
├── rename_log.csv              ← Audit log of all poster rename operations
├── review.csv                  ← Manual review queue for uncertain OCR names
├── tessdata/                   ← Tesseract OCR model data
└── myquicktrippers/            ← Next.js app (see section 3)
```

---

## 2. Data Flow Diagram

```mermaid
graph TD
    A[namasteindiatrip.com] -->|HTTP + Selenium| B[scraper.py]
    B -->|HTML, images, JSON| C[scraped_data/]
    C -->|mqt_packages_processed.json| D[scripts/transform-scraped-packages.ts]
    D -->|writes| E[src/data/allPackages.ts]
    C -->|images/| F[scripts/copy-scraped-images.js]
    F -->|copies to| G[public/images/packages/]
    F -->|updates image paths in| E

    POSTERS[POSTERS/*.png] -->|cp command| H[public/images/posters/]
    poster_rename[poster_rename.py] -->|OCR rename| POSTERS

    E -->|import| I[Next.js Pages]
    J[src/data/packageDetails.json] -->|import| I
    K[src/data/destinationsData.json] -->|import| I
    L[src/data/fullBlogData.json] -->|import| I
    M[src/data/redirects.json] -->|import| N[next.config.ts]

    I -->|SSG/SSR| O[Browser]
    O -->|POST| P[/api/enquiry]
    O -->|POST| Q[/api/contact]
    O -->|WhatsApp deep link| R[wa.me/+918171158569]
```

---

## 3. Next.js App Structure

```
myquicktrippers/
├── next.config.ts          ← 500+ 301 redirects from redirects.json
├── package.json            ← Next 16.2, React 19, TailwindCSS 4, Framer Motion
├── tsconfig.json           ← Path alias: @/ → src/
├── eslint.config.mjs       ← next/core-web-vitals + next/typescript
│
├── src/
│   ├── app/                ← Next.js App Router
│   │   ├── layout.tsx      ← Root layout: Navbar + Footer + Floating CTAs + JSON-LD schema
│   │   ├── globals.css     ← Tailwind v4 theme tokens + custom CSS (marquee, lightbox)
│   │   ├── page.tsx        ← Homepage (hero + 7 sections)
│   │   ├── robots.ts       ← Dynamic robots.txt
│   │   ├── sitemap.ts      ← Dynamic XML sitemap (~600+ URLs)
│   │   ├── packages/
│   │   │   ├── page.tsx    ← Package listing with filter sidebar
│   │   │   └── [slug]/     ← Package detail (SSG from packageDetails.json)
│   │   ├── destinations/
│   │   │   └── [slug]/     ← Destination guide (SSG from destinationsData.json)
│   │   ├── blog/
│   │   │   ├── page.tsx    ← Blog listing (410 posts)
│   │   │   └── [slug]/     ← Blog post detail with AutoLinker
│   │   ├── special-tours/  ← Theme-filtered package pages
│   │   ├── customer-center/← FAQ / support
│   │   ├── [...slug]/      ← Catch-all for legacy URL handling
│   │   └── api/
│   │       ├── enquiry/    ← POST: package enquiry form
│   │       └── contact/    ← POST: general contact form
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.tsx          ← 3-tier nav: top bar + logo row + mega-menu
│   │   │   ├── Footer.tsx          ← Links, social icons, newsletter
│   │   │   ├── FloatingButtons.tsx ← Phone call + scroll-to-top
│   │   │   └── FloatingWhatsApp.tsx← WhatsApp CTA bubble
│   │   ├── ui/
│   │   │   ├── PackageCard.tsx     ← Grid card with image, price, CTA buttons
│   │   │   ├── PackageListCard.tsx ← Horizontal card for list view
│   │   │   ├── PackageOverview.tsx ← Rich parser for package description text
│   │   │   ├── ItineraryAccordion.tsx ← Day-by-day itinerary via Radix Accordion
│   │   │   ├── FilterSidebar.tsx   ← Category/duration filters
│   │   │   ├── PosterMarquee.tsx   ← Infinite-scroll poster carousel + lightbox
│   │   │   ├── AutoLinker.tsx      ← Injects package links into blog text
│   │   │   ├── DestinationDescription.tsx
│   │   │   ├── TrustIndicators.tsx ← Stats bar (10yr, 50k travellers, etc.)
│   │   │   ├── EmptyState.tsx      ← No-results UI
│   │   │   └── FloatingWhatsApp.tsx
│   │   ├── forms/                  ← Enquiry / contact form components
│   │   ├── package/                ← Package detail sub-components
│   │   └── sections/               ← (Empty — reserved for future page sections)
│   │
│   ├── data/                       ← Static content data (JSON / TS)
│   │   ├── siteConfig.ts           ← Single source of truth for brand/contact info
│   │   ├── allPackages.ts          ← ~1,200 packages (generated by transform script)
│   │   ├── packageDetails.json     ← 121 rich itinerary entries (700 KB)
│   │   ├── destinationsData.json   ← 20 destination guides (61 KB)
│   │   ├── fullBlogData.json       ← 410 blog posts (13.5 MB — large!)
│   │   ├── redirects.json          ← 500+ 301 redirect rules (501 KB)
│   │   ├── navLinks.ts             ← Navigation tree with mega-menu structure
│   │   ├── footerLinks.ts          ← Footer link sections
│   │   ├── posterData.ts           ← 33 poster cards for hero marquee
│   │   ├── blogImageMap.ts         ← Blog slug → image path mapping
│   │   ├── contentData.ts          ← Large static content (55 KB — usage unclear)
│   │   ├── staticPagesData.json    ← 155 KB — consumer unclear, needs audit
│   │   └── packages.ts             ← Small hand-curated featured packages
│   │
│   ├── lib/
│   │   └── utils.ts                ← cn() (clsx+twMerge) + slugify()
│   │
│   └── utils/                      ← (reserved)
│
├── scripts/
│   ├── transform-scraped-packages.ts ← Reads mqt_packages_processed.json → writes allPackages.ts
│   ├── copy-scraped-images.js       ← Copies scraped images → public/images/packages/
│   ├── map-scraped-images.js        ← Maps image filenames to package slugs
│   └── audit-images.js             ← Reports missing package images
│
└── public/
    ├── logo/                ← mqt-india-logo.png (brand logo)
    ├── images/
    │   ├── packages/        ← Per-slug hero images (scraped + copied)
    │   ├── posters/         ← Cropped landscape poster thumbnails (33 files)
    │   │   └── full/        ← Original full-size poster PNGs (for lightbox)
    │   ├── blog/            ← Blog post images
    │   ├── hero/            ← Homepage hero images
    │   └── categories/      ← Category/theme images
    └── *.svg                ← Next.js default assets
```

---

## 4. Key Modules

### 4.1 Scraper Pipeline (Python)
- **`scraper.py`** (46 KB): Full-featured web crawler. Supports 4 scraping levels (polite/normal/aggressive/heavy). Uses `requests` + optionally Selenium for JS-rendered pages. Outputs structured JSON to `scraped_data/`.
- **`poster_rename.py`** (12 KB): Uses Tesseract OCR (`pytesseract`) + Pillow to read destination names from poster images in `POSTERS/`, then renames files to `{destination-slug}.png`. Logs all renames to `rename_log.csv`; ambiguous ones go to `review.csv`.

### 4.2 Transform Pipeline (Node.js)
- **`transform-scraped-packages.ts`**: Reads `mqt_packages_processed.json`, normalises fields, deduplicates by slug, writes to `allPackages.ts`. Also audits which destinations have zero packages.
- **`copy-scraped-images.js`**: Reads `scraped_data/images/` directories, copies representative images to `public/images/packages/`, updates image paths in `allPackages.ts`.

### 4.3 Next.js Data Layer
- **No database.** All content is loaded from static JSON/TS files at build time (SSG) or request time (SSR).
- `fullBlogData.json` (13.5 MB) is the largest file. It is imported directly — this may cause build memory pressure and slow cold starts.
- `allPackages.ts` (~852 KB) is a TypeScript module with 1,200+ objects — large but tree-shakeable.

---

## 5. External Dependencies

| Dependency | Purpose |
|---|---|
| `next@16.2.10` | App Router, Image optimisation, metadata API |
| `react@19.2.4` | UI rendering |
| `tailwindcss@4` | Utility-first CSS (via `@import "tailwindcss"`) |
| `@tailwindcss/postcss@4` | PostCSS integration for Tailwind v4 |
| `framer-motion@12` | Page/component animations (installed, usage extent unclear) |
| `lucide-react@1.24` | Icon library |
| `@radix-ui/react-accordion` | Itinerary accordion (accessible, headless) |
| `@radix-ui/react-dialog` | Dialog/modal primitives |
| `@radix-ui/react-dropdown-menu` | Dropdown menus |
| `clsx` + `tailwind-merge` | Conditional class utilities (`cn()`) |
| `class-variance-authority` | Component variant management |

---

## 6. Deployment

- **Dev server:** `npm run dev` (Next.js default port 3000, running on 3001 if 3000 busy)
- **Build:** `npm run build` — SSG for all dynamic routes
- **No containerisation** observed — assumed Vercel or similar Node host
- **No `.env` files** found — API endpoints and keys (if any) are not documented

---

## 7. Gotchas

- `redirects.json` is imported into `next.config.ts` — any syntax error in that 501 KB file will break the entire build.
- `fullBlogData.json` at 13.5 MB is imported at module level. If this causes build OOM, consider splitting it or serving via an API route.
- `packageDetails.json.backup` (1.6 MB) is tracked in the repo — this should be gitignored.
- The `sections/` directory under `components/` is empty — it was likely planned but unused.
- Framer Motion is installed but actual usage in components was not confirmed — may be dead dependency.
