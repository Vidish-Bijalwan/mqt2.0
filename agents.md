# AI Agent Instructions — My Quick Trippers

> Read this file in full before making any changes to the codebase. Cross-reference `memory.md` for historical context and known pitfalls.

---

## 1. Setup & Run Commands

```bash
# Navigate to the Next.js app
cd /home/zerosirus/Downloads/namasteindia_scraper_package/myquicktrippers

# Install dependencies (if node_modules missing)
npm install

# Start development server
npm run dev
# → Runs on http://localhost:3000 (or 3001 if 3000 is busy)

# Lint the codebase
npm run lint

# Build for production (SSG)
npm run build

# Run the Python scraper (from the package root)
cd /home/zerosirus/Downloads/namasteindia_scraper_package
source venv/bin/activate
python scraper.py --scrape-level normal --max-pages 200

# Transform scraped packages into allPackages.ts
cd myquicktrippers
npx ts-node scripts/transform-scraped-packages.ts

# Copy scraped images to public/
node scripts/copy-scraped-images.js

# Audit for missing images
node scripts/audit-images.js

# Copy poster PNGs to public (run from myquicktrippers/)
cp ../POSTERS/*.png public/images/posters/
# Then manually or via script copy to public/images/posters/full/ for full-size originals

# Validate redirects.json before building (always do this after editing it)
python3 -c "import json; json.load(open('src/data/redirects.json')); print('✅ redirects.json is valid')"
```

---

## 2. Where to Look Before Making Changes

### Making UI changes
1. Check `src/app/globals.css` — design tokens and custom CSS classes are all here
2. Check `design.md` — color palette, typography, component patterns
3. Check the relevant component in `src/components/ui/` or `src/components/layout/`
4. Check `rules.md` "Things NOT To Do" section

### Adding a new page
1. Create `src/app/[route]/page.tsx`
2. Add `export async function generateMetadata()` with title + description
3. Add the route to `sitemap.ts` if it should be indexed
4. Check if a redirect in `redirects.json` should point to this new route

### Modifying package data
1. Never edit `allPackages.ts` — re-run `scripts/transform-scraped-packages.ts`
2. For rich itinerary changes, edit `packageDetails.json` directly (121 entries)
3. For new packages, add to the scraped JSON and re-run the transform

### Modifying navigation
1. Edit `src/data/navLinks.ts` — this is the single source for the navbar tree
2. Verify the `href` values have corresponding routes built

### Changing brand details
1. Only edit `src/data/siteConfig.ts` — never hardcode contact/brand info elsewhere

### Adding redirects
1. Add entries to `src/data/redirects.json`
2. Validate JSON before saving
3. The format is: `[{ "source": "/old-path", "destination": "/new-path", "permanent": true }]`

---

## 3. Review Checklist Before Committing

Run through this list before considering any task done:

- [ ] **No TypeScript errors**: Run `npm run lint` — zero errors
- [ ] **No `<img>` tags**: Check that all content images use `next/image` (`<Image>`)
- [ ] **`alt` text**: Every `<Image>` has a meaningful `alt` attribute
- [ ] **`sizes` prop**: Every `<Image fill>` has a `sizes` prop (avoids Next.js dev warning)
- [ ] **`siteConfig` used**: No hardcoded phone numbers, emails, or domain
- [ ] **No hover `scale()` inside `overflow: hidden`**: See memory.md for why this breaks
- [ ] **Lightbox z-index is `z-[9999]`**: Nav is `z-[1000]` — modals must be higher
- [ ] **`redirects.json` valid** (if edited): Run the Python JSON validator above
- [ ] **`allPackages.ts` not hand-edited** (if package data changed): Re-run transform script
- [ ] **New page has `generateMetadata()`**: Every page route should export metadata
- [ ] **New page added to `sitemap.ts`**: If the page should be indexed
- [ ] **Design tokens used**: `brand-orange`, `brand-navy` etc., not hardcoded hex values
- [ ] **Mobile responsive**: Test at 375px, 768px, 1280px breakpoints
- [ ] **Reduced motion**: Animations respect `prefers-reduced-motion`
- [ ] **`packageDetails.json.backup` not committed**: Add to `.gitignore` if present

---

## 4. Boundaries — Files & Folders NOT to Touch

| Path | Reason |
|---|---|
| `src/data/allPackages.ts` | Generated — will be overwritten by transform script |
| `scraped_data/` | Scraper output — do not edit |
| `venv/` | Python virtual environment |
| `POSTERS/` | Source poster images — only modify via `poster_rename.py` |
| `rename_log.csv` | Audit log — only modified by `poster_rename.py` |
| `src/data/redirects.json` | 500+ redirects — edit with extreme care, always validate |
| `src/data/packageDetails.json.backup` | Stale backup — ignore, do not read from |

---

## 5. CSS Conventions for Agents

The project uses **Tailwind v4** — important differences from v3:

| v3 Behaviour | v4 Behaviour |
|---|---|
| `tailwind.config.js` for design tokens | `@theme {}` block in `globals.css` |
| `@apply` works with custom configs | `@apply` restricted — use native CSS |
| `bg-brand-orange` from config | `bg-brand-orange` from `@theme` token |
| Plugin API in config | CSS-first approach |

**For new custom CSS components:**
1. Add to `globals.css` after the existing marquee/lightbox CSS
2. Use a short prefix for your class names to avoid collisions (e.g., `.search-bar`, `.trust-bar`)
3. Do not duplicate Tailwind utilities in custom CSS — use the Tailwind class in the JSX

---

## 6. Common Tasks & How to Approach Them

### "Add a new destination page"
1. Add the destination data to `src/data/destinationsData.json`
2. The route `/destinations/[slug]` already uses `generateStaticParams()` — it will auto-pick up the new entry on next build
3. Add the destination to `navLinks.ts` under the appropriate region
4. Add the destination to the sitemap's `destinationRoutes`

### "Add a new blog post"
1. Add the post object to `src/data/fullBlogData.json` following the existing schema
2. Add an image to `public/images/blog/` if needed and register in `blogImageMap.ts`
3. The `/blog/[slug]` route auto-picks up new entries

### "Fix a broken redirect"
1. Find the entry in `src/data/redirects.json`
2. Update `destination` field
3. Validate JSON, then restart dev server (`next dev` reloads next.config.ts changes)

### "Change the WhatsApp number"
1. Only edit `siteConfig.whatsapp` and `siteConfig.phone` in `src/data/siteConfig.ts`
2. All components consume from there — no other files need changing

### "Add a new package card section to the homepage"
1. Filter `allPackages` in `src/app/page.tsx` with a new const (e.g. `BEACH_PACKAGES`)
2. Copy an existing `<section>` block and update the heading and package variable
3. No component changes needed — `PackageCard` is already reusable

### "Debug a 404 package image"
1. Run `node scripts/audit-images.js` to list all missing images
2. Check if the scraped image exists in `scraped_data/images/{slug}/`
3. If yes, run `node scripts/copy-scraped-images.js`
4. If no, manually source an image and save to `public/images/packages/{slug}.webp`

---

## 7. Architecture Reminders

- **There is no database.** If you find yourself wanting to write a SQL query or Prisma schema, stop and rethink.
- **There is no API for content.** All content loads from static JSON at build time (SSG).
- **The enquiry and contact forms** post to `/api/enquiry` and `/api/contact` — these are Next.js Route Handlers. They likely send emails or log to a sheet. Do not add database calls here without setting up proper infrastructure.
- **The dev server is long-running** — the user has it open. Hot-reload handles most changes automatically.
