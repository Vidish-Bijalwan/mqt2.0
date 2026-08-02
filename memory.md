# Project Memory — My Quick Trippers

> This file is the persistent context document for AI agents and developers returning to this project across sessions. Update it whenever a significant decision is made or a gotcha is discovered.

---

## Project Identity

- **Product:** My Quick Trippers (brand: MQT India)
- **Type:** Tour & travel B2C website for an Indian travel agency
- **Stack:** Next.js 16.2 / React 19 / TailwindCSS 4 / TypeScript 5
- **Data:** 100% static — no live database. All content is JSON files in `src/data/`.
- **Dev server:** `cd myquicktrippers && npm run dev` → usually port 3000 or 3001
- **Working directory for the Next.js app:** `/home/zerosirus/Downloads/namasteindia_scraper_package/myquicktrippers/`
- **Python pipeline root:** `/home/zerosirus/Downloads/namasteindia_scraper_package/`

---

## Key Architectural Decisions

### "No database" approach
All package, destination, and blog data lives in JSON/TS files in `src/data/`. This was chosen for simplicity and to allow static generation. The trade-off: updating content requires re-running Python scraper → transform script → rebuild.

### Data sourced from competitor/legacy site
All content (packages, blog posts, destination guides, images) was scraped from `namasteindiatrip.com` using `scraper.py`. The scraping was authorised (same company, migrating content). This is not a scraping-for-hire situation.

### 500+ redirects in `next.config.ts`
The legacy site had hundreds of URL patterns that needed to be 301-redirected to the new URL structure. Rather than a database-backed redirect system, all redirects are stored in `src/data/redirects.json` and loaded in `next.config.ts`. The trade-off: any JSON syntax error in this 501 KB file breaks the entire build.

### Tailwind v4 (not v3)
The project uses Tailwind CSS v4 via `@import "tailwindcss"` in `globals.css`. There is **no `tailwind.config.js`** — all design tokens are defined in the `@theme {}` block inside `globals.css`. Do not create a Tailwind config file; it is not the v4 way.

### `allPackages.ts` is generated
The file `src/data/allPackages.ts` (~852 KB, 16,000+ lines) is **generated** by `scripts/transform-scraped-packages.ts`. It must never be hand-edited. If packages need updating, re-run the transform script.

### Poster images have two copies
- **Thumbnails** (cropped landscape): `public/images/posters/{slug}.png` — used in the marquee carousel
- **Full originals**: `public/images/posters/full/{slug}.png` — used in the lightbox viewer
Both sets were copied from `../POSTERS/*.png` via a manual `cp` command.

---

## Known Issues & Gotchas

### 1. `fullBlogData.json` is 13.5 MB
This file is imported as a module in `sitemap.ts` and blog pages. It is enormous and may cause build memory pressure. In the future, consider:
- Splitting by category
- Serving via an API route with filesystem reads
- Using a build-time script to pre-process it

### 2. `packageDetails.json.backup` is in the repo
The file `src/data/packageDetails.json.backup` (1.6 MB) is a backup and should be added to `.gitignore`. It is not imported anywhere but it clutters `src/data/`.

### 3. Font conflict: Inter vs Roboto
- `layout.tsx` loads **Inter** via `next/font/google` and applies it to `<body>`
- `globals.css` declares `--font-sans: "Roboto", "Helvetica Neue", "Arial", sans-serif`
- In practice, Inter wins because it is applied directly via a class
- Recommended fix: update `--font-sans` to `"Inter", sans-serif`

### 4. Navbar uses raw `<img>` not `next/image`
The logo in `Navbar.tsx` uses `<img src="/images/mqt-logo.png">` instead of `<Image>`. This triggers ESLint warnings and bypasses Next.js image optimisation. Should be replaced with `<Image>`.

### 5. Many package images are 404
`scripts/audit-images.js` can report which packages have missing images. Many default to `chardham.jpg`. Run `node scripts/audit-images.js` to get the full list. The `copy-scraped-images.js` script only works if the scraped image directory name matches the package slug exactly.

### 6. Poster marquee: hover scale was the root cause of all clipping bugs
**History:** Multiple attempts were made to fix poster cards overlapping the hero title text. Various `z-index`, `overflow`, `padding`, and `margin-top` tweaks failed because the root cause was `transform: scale()` inside an `overflow: hidden` parent — CSS cannot clip a scaled element that has already been painted outside the stacking context.

**Final fix (Phase 3):** Removed all hover scaling. Cards now use a glow border + dimmed image effect on hover. The `transform-origin` debate (bottom vs top vs center) is now moot. If scaling is ever re-introduced, the parent must use `overflow: visible` and the hero section must have sufficient padding to absorb the growth.

### 7. Poster MQT logo partially clipped
The cropped poster thumbnails are landscape crops of the original portrait posters. The MQT India "M" logo sits near the top-left of the landscape image. With `object-fit: cover` centered, this gets cropped. Workaround: `object-position: 8% center`. Permanent fix: re-crop the poster images keeping the logo region within the crop boundary.

### 8. `staticPagesData.json` consumer unknown
The file `src/data/staticPagesData.json` (155 KB) exists but its import location was not identified in the code review. It may be used by pages not examined, or it may be dead data. Needs audit with: `grep -r "staticPagesData" src/`

### 9. `contentData.ts` is large and scattered
`src/data/contentData.ts` is 55 KB and its consumers are unclear. Run `grep -r "contentData" src/` to audit.

### 10. `sections/` component directory is empty
`src/components/sections/` exists but is empty. Either populate it with homepage section components or remove it.

### 11. Navbar links to unbuilt routes
These links exist in the navbar/sitemap but have no corresponding Next.js route files:
- `/pay-online`
- `/my-booking`
- `/reviews`
- `/careers`
These will 404 until built. The `[...slug]` catch-all may handle some of these gracefully — verify.

### 12. `redirects.json` syntax error = build failure
This file is 501 KB and loaded synchronously in `next.config.ts`. A single malformed JSON character breaks the entire `next build`. Always validate with `python3 -c "import json; json.load(open('src/data/redirects.json'))"` before committing changes.

---

## What Previous AI Sessions Got Wrong

1. **Tried to fix poster clipping with `overflow-x: hidden` + `overflow-y: visible`** — this doesn't work reliably across browsers because CSS `overflow` can't be independently hidden/visible on the same axis in all cases. The real fix was removing scaling.

2. **Incremental z-index bumping** — multiple rounds of `z-[100]` → `z-[200]` → `z-[9999]` for the lightbox. The nav has `z-[1000]` — lightboxes and modals must always be `z-[9999]` from the start.

3. **`transform-origin: center bottom` vs `center top` debate** — switching between these is a red herring. Both cause the card to overflow its container boundaries when scaling. Do not re-introduce scale-on-hover without redesigning the stacking context.

4. **Trying to patch `overflow: hidden` with padding** — adding `padding: 80px 0` to give scaled cards room was an antipattern that broke the visual proportions. The clean solution is no scaling.

5. **Using Tailwind `!important` utilities** to override specificity — this indicates a CSS architecture problem, not a specificity one. Fix the root cause.

---

## AI Agent Architecture (August 2026)

For the ongoing content migration to MyQuickTrippers, we have established a specialized AI agent pipeline to manage the transition from the raw `scraped_data/pages/` schema into production Next.js files:

1. **Scraper & Recon Agent**
   - *Role*: Executes `scraper.py` (v2), fetches raw HTML, parses structured `content_blocks`, CSS backgrounds, and SEO metadata. Outputs to `scraped_data/pages/<type>/<slug>/`.
   - *Handoff*: Writes folder structure and `summary_report.json`.
2. **Gap Analysis & Content Mapping Agent**
   - *Role*: Analyzes `content_blocks` from the scraper output against the required MyQuickTrippers schemas (e.g. `PackageCardProps`, `allPackages.ts`). Identifies missing structural elements like missing prices or broken routing.
   - *Handoff*: Writes a gap report and mappings to be used by the Rebranding Agent.
3. **Rebranding & Content Generation Agent**
   - *Role*: Processes raw scraped content block-by-block. Converts "Namaste India Trip" references to "My Quick Trippers". Extracts itinerary steps into structured JSON logic. Uplifts text to match the new premium brand voice.
   - *Handoff*: Writes updated data JSON files and assets to `src/data/` and `public/images/`.
4. **QA & Writeback Agent**
   - *Role*: Validates the structural integrity of the final TS/TSX files and JSON data. Runs `npm run build` and `tsc` checks. Enforces design compliance.
5. **Human-in-the-Loop Escalation**
   - *Role*: Business-judgment escalation is a hardcoded protocol. If Agent 2 or 3 encounters unresolvable data conflicts (e.g., COVID-cancelled tours, completely missing price grids, mismatched itineraries), they log the slug to an `escalations.json` queue and block on human review rather than hallucinating content.

---

## Current State Summary (August 2026)

- **Dev server:** Running on port 3001 (`npm run dev` in `myquicktrippers/`)
- **Phase:** Content Migration & Scraper Audit
- **Major Activity:** Executing v2 Scraper in the background. We discovered that the initial crawl missed 524 of the 1,205 target package slugs. v2 has been injected with the exact 1,205 target URLs to ensure a 100% attempt rate, executing a full HTML re-crawl across 1,786 unique URLs.
- **Major remaining work:** Resolving missing slugs, completing the Scraper run, and launching the Gap Analysis & Rebranding Agents to process the new scraped structure.
