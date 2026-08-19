# MQT Site Audit — 100 Issues Found & 100 Improvement Recommendations

## CRITICAL (P0) — Must Fix
1. **No /contact-us page exists** — navbar links to it but returns catch-all 404
2. **No not-found.tsx** — broken URLs show Next.js default 404, not branded
3. **No robots.txt** — search engines can't discover crawl rules
4. **No /public/avatars/ directory** — review page avatar paths are all broken
5. **No /public/reviews/ directory** — review page photo paths are all broken
6. **No /public/destinations/ directory** — destination review card images are broken
7. **No /public/tours/ directory** — tour review card images are broken
8. **No /public/images/hero/ directory** — hero background images referenced but missing
9. **Logo file is 864KB PNG** — should be optimized WebP under 50KB
10. **console.log left in production package page** — 3 instances in error handlers

## HIGH (P1) — SEO & Accessibility
11. **Missing H1 tags** on privacy-policy and terms-and-conditions pages
12. **Missing rel="noopener noreferrer"** on 7 external target="_blank" links (security)
13. **Missing aria-labels** on 15+ buttons throughout the site
14. **Empty alt=""** on 3 images — hurts SEO and screen reader access
15. **Missing alt text** on 2 images (OG route, PosterMarquee)
16. **Only 8 pages have JSON-LD** — missing on homepage, reviews, experiences listing, customer-center
17. **Missing BreadcrumbList JSON-LD** on all pages except packages
18. **No canonical URLs** specified on any page
19. **Missing Open Graph images** on most pages — only packages have OG route
20. **Scraped content has "Read More" artifacts** in allPackages.ts descriptions

## HIGH (P1) — Broken Functionality
21. **Footer "Customer Center" link** goes to wrong section structure
22. **Footer has no actual link destinations** for most items — just text
23. **Header "Contact Us" link** points to /contact-us which doesn't exist
24. **Site-map page** lists /contact-us as a valid page
25. **Customer-center page** lists /contact-us in its breadcrumbs
26. **App Store / Google Play buttons** in footer are non-functional placeholders
27. **No actual contact form** — EnquiryForm only sends to WhatsApp
28. **Group tours page** returns empty/minimal content

## MEDIUM (P2) — Styling & Visual
29. **CRLF line endings** in globals.css (mixed with LF) — causes cross-platform issues
30. **Missing Tailwind theme config** — no custom colors defined in tailwind.config
31. **Inconsistent button border-radius** — mix of rounded-full, rounded-lg, rounded-md, rounded
32. **Inconsistent padding scale** — 290 instances of p-* with no clear system
33. **Hardcoded hex colors** in 15+ places instead of theme tokens
34. **Social icon colors** are hardcoded brand colors in Navbar — should use theme
35. **Missing hover states** on FloatingButtons links
36. **Missing focus-visible states** — only 6 focus-visible: vs 30 focus: classes
37. **Inconsistent card shadow styles** — some shadow-sm, some shadow-md, some shadow-lg
38. **No smooth scroll behavior** defined globally
39. **Mobile nav hamburger** doesn't have proper animation

## MEDIUM (P2) — Content & Data
40. **Homepage has only 4 links** — far too few for a travel site homepage
41. **Review card avatar paths** use `/avatars/rahul.jpg` — these files don't exist
42. **Review card photo paths** use `/reviews/kashmir-1.jpg` — don't exist
43. **Destination review card images** use gradient placeholders — should use real images
44. **Tour review card images** use gradient placeholders — should use real images
45. **"Read More" artifacts** in scraped package descriptions
46. **Package descriptions** end with truncated text from scraping
47. **Blog post images** reference `/images/blog/` which may not have all files
48. **Experience cards** reference images that may be missing
49. **Static pages data** has duplicate entries across V1/V2 files
50. **redirects.json** is 17K lines — many are stale/duplicate

## MEDIUM (P2) — UX & Interaction
51. **No loading states** (skeletons) on any page
52. **No error boundaries** — if a component throws, entire page crashes
53. **No scroll-to-top button** on any page
54. **Package page tabs** don't update URL hash for sharing
55. **No breadcrumbs** on blog listing, reviews, experiences listing pages
56. **Mobile filter menu** not optimized — full-width dropdowns on 375px
57. **Enquiry form** has no success state animation — just a text swap
58. **Gallery lightbox** doesn't support keyboard navigation
59. **WhatsApp floating button** overlaps content on mobile
60. **No back-to-top** on long package detail pages

## LOWER (P3) — Performance
61. **1.9MB of JSON data files** loaded at build time
62. **fullBlogData.json** is 537KB — should be split or lazy-loaded
63. **fullBlogDataV2.json** is 658KB — redundant with fullBlogData.json
64. **packageDetailsV2.json** is 308KB — check if V1 can be removed
65. **No code splitting** for heavy page components
66. **19 images with priority=true** — only first visible should be priority
67. **generateStaticParams returns empty** on catch-all route
68. **Missing next/image width/height** on some Image components
69. **Large inline JSON-LD scripts** — should be external or smaller
70. **No service worker** for offline caching

## LOWER (P3) — Code Quality
71. **Duplicate data files** — packageDetails.json, V2, V3 all exist
72. **Duplicate blog data** — fullBlogData, V2, Clean all exist
73. **Static pages data** duplicated — staticPagesData.json and V2
74. **No TypeScript strict mode** — ignoring build errors
75. **scripts/parity/** has 20+ utility scripts — should be documented
76. **.freebuff/** directory has screenshots and audit files — should be gitignored
77. **priceOverrides.json** — 2.4KB of manual price adjustments
78. **No ESLint configuration file** visible
79. **Mixed import styles** — some use @/ alias, some relative
80. **No consistent error handling pattern** across pages

## LOWER (P3) — Branding & Identity
81. **"Namaste Indian Culture"** text still appears in one image caption
82. **Footer tagline** says "Your Journey, Our Expertise" but logo says "MQT India"
83. **No favicon.ico** — using default
84. **Logo at 864KB** — 17x too heavy for a web logo
85. **No OG image** — shares show generic fallback
86. **No structured brand colors** in CSS/Tailwind config
87. **Social media handles** not consistent (some @mqt_india, some @myquicktrippers)
88. **No app store links** — placeholder buttons in footer
89. **Phone number** appears in 5+ different formats across the site
90. **Copyright year** hardcoded to 2026 — should be dynamic

## MINOR (P4)
91. **Typo in footer**: "Placeholders for App Store buttons" comment left in JSX
92. **Empty className=""** not found — good
93. **No print stylesheet** — pages don't print cleanly
94. **No dark mode** support (acceptable for travel site)
95. **No lazy loading** below-fold images explicitly
96. **No prefetch** hints for critical pages
97. **Missing lang attribute** variations — all "en" but content is multilingual
98. **No structured data for FAQ** on package pages with FAQ tabs
99. **Sticky CTA on mobile** overlaps footer on some pages
100. **No A/B testing framework** — can't measure conversion improvements

---

# 100 Improvement Recommendations

## Images & Assets (1-15)
1. Optimize logo to WebP under 50KB
2. Create /public/avatars/ with generated avatar images for reviews
3. Create /public/reviews/ with destination-themed placeholder images
4. Create /public/destinations/ with real destination thumbnails
5. Create /public/tours/ with real tour package thumbnails
6. Add proper hero backgrounds to /public/images/hero/
7. Add WebP versions of all NIT amenity icons
8. Create proper OG image (1200x630) for social sharing
9. Add favicon set (ICO, PNG 16/32/180, SVG)
10. Create touch icons for mobile home screens
11. Optimize all poster images to WebP under 100KB each
12. Add blur placeholder for all images
13. Create consistent image aspect ratio system (16:9 hero, 4:3 cards, 1:1 avatars)
14. Add image error fallback component
15. Lazy-load below-fold images explicitly

## Links & Navigation (16-25)
16. Create /contact-us page with contact form, map, office addresses
17. Create custom not-found.tsx with branded 404 page
18. Create /public/robots.txt with crawl rules
19. Fix all 7 target="_blank" links to add rel="noopener noreferrer"
20. Fix footer links to point to actual pages
21. Make footer App Store/Google Play buttons link to real URLs or remove
22. Add breadcrumbs to blog listing, reviews, experiences pages
23. Add scroll-to-top button on all pages
24. Fix header "Contact Us" link to working page
25. Add canonical URLs to all pages

## Content & SEO (26-40)
26. Remove "Read More" artifacts from all package descriptions
27. Add H1 tags to privacy-policy and terms-and-conditions
28. Add JSON-LD to homepage (WebSite + Organization)
29. Add JSON-LD to reviews page (AggregateRating)
30. Add BreadcrumbList JSON-LD to all pages
31. Add FAQPage JSON-LD to packages with FAQ tabs
32. Add Open Graph meta images to all pages
33. Fix empty alt="" to descriptive alt text on all images
34. Add missing alt text to OG route and PosterMarquee images
35. Add aria-labels to all 15+ unlabeled buttons
36. Create dynamic copyright year
37. Normalize phone number format across entire site
38. Add structured data for local business on homepage
39. Add Twitter Card meta tags
40. Create proper sitemap with all 709 packages + blog + destinations

## Styling & Design (41-55)
41. Create Tailwind config with brand colors (navy, orange, etc.)
42. Standardize button border-radius system (sm/md/lg/full)
43. Create spacing scale system (4/8/12/16/24/32/48/64)
44. Add smooth-scroll CSS globally
45. Add loading skeleton components
46. Add error boundary components
47. Standardize card shadow system
48. Add focus-visible states to all interactive elements
49. Add hover transitions to FloatingButtons
50. Fix mobile nav animation
51. Fix WhatsApp button overlap on mobile
52. Add print stylesheet
53. Standardize font weights across all text elements
54. Add consistent text shadow on hero sections
55. Fix CRLF line endings in globals.css

## Reviews Page Improvements (56-65)
56. Use generated gradient avatars instead of broken image paths
57. Use destination-themed gradient backgrounds instead of broken images
58. Add mobile floating "Write Review" CTA button
59. Convert filter bar to horizontal scrollable chips on mobile
60. Add loading skeleton for review cards
61. Add empty state for no reviews found
62. Add pagination or infinite scroll
63. Add JSON-LD AggregateRating schema
64. Make star ratings keyboard-accessible
65. Add "Was this review helpful?" animation

## Package Page Improvements (66-75)
66. Add URL hash persistence for tabs (#itinerary, #overview)
67. Add back-to-top button on long package pages
68. Add image lazy loading for gallery beyond 5th image
69. Standardize package card hover animation
70. Add "Similar Packages" section at bottom
71. Improve mobile sticky CTA positioning
72. Add share buttons (WhatsApp, Facebook, Twitter)
73. Add "Last updated" date on package pages
74. Add reading time estimate for itinerary
75. Add comparison table between MRP and deal price

## Blog Improvements (76-82)
76. Add reading time to blog cards
77. Add author name and avatar on blog posts
78. Add "Related Posts" section at bottom of blog posts
79. Add inline package links within blog content
80. Add social share buttons on blog posts
81. Add newsletter signup in blog sidebar
82. Add category count badges on filter chips

## Homepage Improvements (83-88)
83. Add more internal links to homepage (featured packages, destinations)
84. Add "Why Choose MQT" trust section
85. Add testimonials carousel section
86. Add recent blog posts section
87. Add partner logos / certification badges
88. Add animated statistics counter

## Performance (89-93)
89. Remove duplicate data files (keep only latest versions)
90. Split blog data into per-category chunks
91. Remove console.log statements from production
92. Fix priority attribute on images (only first visible)
93. Add prefetch hints for critical navigation targets

## Code Quality (94-97)
94. Enable TypeScript strict mode
95. Document parity scripts in README
96. Add consistent error handling pattern
97. Clean up .freebuff/ gitignore

## Branding (98-100)
98. Remove any remaining "Namaste India" references
99. Standardize social media handle references
100. Create brand guidelines section in about-us page
