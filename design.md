# Design System — My Quick Trippers

## 1. Color Palette

All colors are defined as CSS custom properties in `src/app/globals.css` under `@theme {}`.

### Primary Brand Colors

| Token | Value | Usage |
|---|---|---|
| `brand-orange` | `#F97316` | Primary CTA buttons, ribbons, highlights, hover states |
| `brand-orange-light` | `#FFF7ED` | Backgrounds for orange-accented sections |
| `brand-orange-dark` | `#EA580C` | Hover state for orange elements |
| `brand-green` | `#16A34A` | Success states, discount badges, "Pay Online" button |
| `brand-green-dark` | `#15803D` | Hover state for green elements |
| `brand-navy` | `#0F172A` | Hero section background, footer background, nav background |
| `brand-navy-light` | `#1E293B` | Secondary navy, card hover overlays |
| `brand-blue` | `#0EA5E9` | Links, info accents |

### Legacy Aliases (in use throughout codebase)

These map to brand colors above — prefer brand tokens in new code:

| Alias | Maps To | Common Usage |
|---|---|---|
| `legacy-orange` | `brand-orange` | Package card ribbons, section underlines |
| `legacy-nav-blue` | `brand-navy` | Navbar background, button backgrounds |
| `legacy-footer-bg` | `brand-navy` | Footer background |
| `legacy-gray-text` | `#64748B` | Secondary text, captions |
| `legacy-card-bg` | `#F8FAFC` | Card backgrounds |
| `legacy-light-gray` | `#E2E8F0` | Borders, dividers |

### Semantic Utilities

| Token | Value | Usage |
|---|---|---|
| `mqt-orange` | `brand-orange` | Alias for easy use |
| `mqt-navy` | `brand-navy` | Alias for easy use |
| `mqt-green` | `brand-green` | Alias for easy use |
| `mqt-bg` | `#ffffff` | Default page background |
| `mqt-text` | `#333333` | Default body text color |
| `mqt-border` | `#eaeaea` | Default border color (applied to `*`) |

### Social Brand Colors

| Token | Value |
|---|---|
| `legacy-social-fb` | `#3b5998` |
| `legacy-social-tw` | `#00aced` |
| `legacy-social-yt` | `#bb0000` |
| `legacy-social-ig` | `#517fa4` |
| `legacy-social-wa` | `#4dc247` |
| `legacy-social-in` | `#007bb6` |

---

## 2. Typography

### Font
- **Body font:** `Inter` (Google Fonts, Latin subset) — loaded via `next/font/google` in `layout.tsx`
- **CSS variable:** `--font-sans: "Roboto", "Helvetica Neue", "Arial", sans-serif` (defined in theme — there is a discrepancy: Inter is loaded via JS but Roboto is in the theme variable. In practice, Inter wins as it is applied to `<body>`.)
- **Recommended resolution:** Update `--font-sans` to match Inter, or standardise on one.

### Scale (Tailwind defaults + custom usage observed)

| Use Case | Size | Weight | Class Example |
|---|---|---|---|
| Homepage H1 | 3xl → 5xl (responsive) | 800 extrabold | `text-3xl md:text-5xl font-extrabold` |
| Section H2 | 2xl | 700 bold | `text-2xl font-bold text-gray-700` |
| Package card title | base | 600 semibold | `text-base font-semibold` |
| Body text | sm | 400 | `text-sm text-gray-500` |
| Micro labels | xs / 10px / 9px | 500-700 | `text-xs`, `text-[10px]`, `text-[9px]` |
| Top-bar text | 13px | 400 | `text-[13px]` |

### Text Utilities
- Destination sub-labels use `text-[9px]` — very small, only readable at desktop sizes.
- Package titles on cards use `line-clamp-1` for overflow.
- Blog content renders raw HTML (with AutoLinker transformation).

---

## 3. Spacing

The layout uses Tailwind spacing utilities. Key patterns observed:

| Context | Spacing |
|---|---|
| Section vertical padding | `py-12` (3rem top + bottom) |
| Container horizontal padding | `px-4` (1rem), `px-2 md:px-4` |
| Card grid gap | `gap-[10px]` (custom fixed gap, not Tailwind default) |
| Component internal padding | `px-4 py-3` for card content areas |
| Top navbar height | ~44px (auto, based on content) |

**Max container width:** `max-w-[1920px]` — the site is designed for ultrawide displays.

---

## 4. Component Patterns

### Package Card (`PackageCard.tsx`)
- Fixed image height: `h-[250px]`
- White card with `border border-gray-200 shadow-sm hover:shadow-md`
- Orange triangle ribbon in top-left: `.nit-ribbon` + `.nit-ribbon-text` (custom CSS)
- Two-button footer: "Quick Enquiry" (ghost) + "View Tour" (orange)
- Price block with green discount badge, strikethrough old price, bold current price
- Four icon amenities bar: Hotel Stay, Meals, Transfers, Sightseeing (Lucide icons)

### Poster Marquee (`PosterMarquee.tsx`)
- Class prefix: `.pm-*`
- Cards: `overflow: hidden`, fixed height (220px mobile → 235px 1440px+)
- Hover: orange glow border + darkened image + overlay with destination name
- Click: opens `PosterLightbox` in a portal with zoom/pan/pinch support
- Animation: `marquee-scroll` keyframe on `.pm-track`, paused on hover via JS state

### Destination Grid (homepage)
- `h-[220px]` image with `group-hover:scale-110 transition-transform duration-700`
- Gradient overlay: `from-black/90 via-black/30 to-transparent`
- Text: centered bottom-left with white title + gray subtitle

### Theme Tiles (homepage)
- `border border-gray-200 hover:border-legacy-orange` box
- Lucide icon (`w-8 h-8`, `strokeWidth={1.5}`) in orange
- Tiny label: `text-[10px] text-gray-700`

### Navigation
- **Top bar** (orange): email, phone, utility links — hidden on mobile
- **Main header**: logo + ISO badge + social icons
- **Nav bar** (navy/dark): full mega-menu on desktop, hamburger on mobile
- Mega-menu columns: grouped by region (North India, South India, etc.)
- `z-[1000]` on nav — all modals/lightboxes must use `z-[9999]`

---

## 5. Shadows

| Token | Value | Usage |
|---|---|---|
| `shadow-card` | `0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)` | Default card shadow |
| `shadow-card-hover` | `0 4px 6px rgba(0,0,0,0.1)` | Card hover shadow |
| `.pm-card` shadow | `0 4px 16px rgba(0, 0, 0, 0.4)` | Poster card shadow |
| Lightbox CTA button | `0 4px 16px rgba(255, 100, 0, 0.4)` | Orange glow |

---

## 6. Responsive Breakpoints (Tailwind defaults)

| Breakpoint | Width |
|---|---|
| `sm` | 640px |
| `md` | 768px |
| `lg` | 1024px |
| `xl` | 1280px |
| `2xl` | 1536px |

**Custom breakpoints used:** `min-width: 1440px` in marquee CSS (non-standard, added manually).

**Grid patterns:**
- Packages: `grid-cols-1 md:grid-cols-3 lg:grid-cols-5`
- Destinations: `grid-cols-2 md:grid-cols-4 lg:grid-cols-7`
- Themes: `grid-cols-3 md:grid-cols-5 lg:grid-cols-9`
- Experiences: `grid-cols-2 md:grid-cols-3 lg:grid-cols-6`

---

## 7. Custom CSS Utilities

Defined in `globals.css @layer utilities`:

| Class | Purpose |
|---|---|
| `.nit-ribbon` | Orange triangle clip ribbon (top-left package card badge) |
| `.nit-ribbon-text` | "MQT" text inside ribbon, rotated -45deg |
| `.nav-divider` | Right border separator for navbar utility links |
| `.arrow-right-shape` | `clip-path: polygon` chevron shape |

---

## 8. Motion / Animation

- **Marquee:** CSS `@keyframes marquee-scroll` (translateX 0 → -50%), 90s duration, infinite linear
- **Card hover:** `filter: brightness(0.75)` + border glow (250ms ease) — NO scale transform
- **Lightbox enter:** `@keyframes lb-fadein` (opacity 0→1, 200ms)
- **Destination image:** `group-hover:scale-110 transition-transform duration-700`
- **Package card image:** `transition-transform duration-500 group-hover:scale-105`
- **Prefers-reduced-motion:** Marquee animation is disabled (`animation: none`) and replaced with horizontal scroll

---

## 9. Icons

All icons via `lucide-react@1.24`. Commonly used:
- `MapPin`, `Navigation` — package routes
- `BedDouble`, `Utensils`, `CarFront` — amenities
- `Users`, `Heart`, `Landmark`, `Flame`, `Umbrella`, `Tent`, `Snowflake`, `Sun`, `CloudRain` — theme tiles
- `Phone`, `Mail`, `MessageCircle`, `ChevronDown`, `ChevronRight`, `Menu`, `X` — navbar
- SVG inline icons used for social links in Navbar (not Lucide).

---

## 10. Proposed Improvements

> These are currently inconsistent in the codebase and should be standardised:

1. **Font:** Resolve the Inter vs Roboto conflict — pick Inter (already loaded) and update `--font-sans`.
2. **`<img>` → `<Image>`:** The Navbar logo uses raw `<img>` — replace with `next/image`.
3. **Destination sub-label font size:** `text-[9px]` is below mobile readability threshold — increase to `text-xs` (12px).
4. **Poster card image position:** Currently `object-position: 8% center` as a workaround for logo visibility — proper fix is to re-crop posters with the logo in-frame.
5. **`sections/` component directory:** Empty — populate or remove.
