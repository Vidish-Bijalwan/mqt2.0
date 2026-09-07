# Microtrippers Website Audit

Audit date: 2026-09-06

## Scope and method

- Reviewed the app routes, shared navigation, footer, catalog, package detail, experience, destination, sitemap, robots, image, pricing, and structured-data code.
- Smoke-tested the local home, package list, a filtered package list, a public package detail, a rich-content package detail, and a removed two-day package at phone width.
- Ran `npm run check:content`: 0 newly content-less packages.
- This is a code and local-runtime SEO audit. Live rankings, Core Web Vitals field data, Search Console errors, payment processing, CRM delivery, and third-party social links require production credentials and should be checked separately.

## Changes completed

- Added a single public-catalog policy. Tours shorter than three days are excluded from catalog pages, home sections, themes, experiences, destinations, related tours, generated package paths, the sitemap, and the Open Graph endpoint. Direct short-tour URLs render the existing not-found experience while their source records remain recoverable.
- Suppressed public prices below INR 10,000. Cards and detail pages now show an enquiry prompt instead of a price, and Product structured data omits an Offer when price is private.
- Built functional URL-based package search and duration filters. Filters work without client-only state and can be shared or indexed safely.
- Put results before the category/enquiry sidebar on phones and made categories horizontally scrollable, reducing the long mobile lead-in before the first package.
- Added gallery coverage from a package's secondary image, in-content images, and a safe visual fallback.
- Reworked both itinerary render paths into accessible, expandable journey-day cards with clear day markers, state feedback, and contextual labels.
- Repaired stale hero-image references that pointed to absent JPG files; the app now uses the available SVG assets.
- Replaced the orange-led shared palette with forest, river, parchment, sage, and a restrained mineral-gold accent. Navigation, package tabs, filters, cards, itinerary panels, and footer CTA follow this direction.

## Findings

### High priority

1. Local route rendering is often slow on first load because large package and content datasets are repeatedly imported, scanned, and sometimes read from disk. The development logs showed multi-second route application time; measure production Core Web Vitals before launch.
2. The package corpus has inconsistent routes, durations, titles, prices, and some scraped content. The content-presence check is clean, but it cannot certify editorial quality or commercial accuracy.
3. The footer remains content-dense on mobile. It is usable, but should be progressively disclosed to reduce page length and competing CTAs.
4. The site has a package-level sitemap and canonical metadata, but no evidence here of Search Console ownership, production redirects, analytics goals, or real-world schema validation.

### Medium priority

5. Existing rich body content can still mention short tours as plain text even though those tours are no longer linked or published. Editorial cleanup should remove those stale references.
6. Some package detail pages have a full itinerary and gallery while others correctly use a tailored/enquiry state. The visual framework is now consistent, but content depth remains uneven.
7. The legacy orange utility classes are still present in parts of the wider codebase. The shared token change prevents orange from leading the new experience, but a dedicated visual sweep should finish conversion page by page.
8. `npm run lint` could not run in this workspace because the `node_modules` junction denies shell access to the ESLint executable. This is an environment issue, not an application lint result.

## Recommendations

1. Set up Google Search Console and submit the updated production sitemap.
2. Add Bing Webmaster Tools and submit the same sitemap.
3. Connect GA4 and define enquiry, phone, WhatsApp, and booking-start conversion events.
4. Capture Core Web Vitals on real mobile devices before the next promotion.
5. Add a production error-monitoring service with route and form context.
6. Replace the development-only package scans with a precomputed public catalog artifact.
7. Keep full package detail data in a database or CMS instead of loading large JSON files per route.
8. Generate responsive WebP or AVIF variants for every package cover.
9. Add explicit image width, height, and blur placeholders to package images.
10. Audit and remove every broken local image reference with an automated CI check.
11. Use a CDN and immutable cache headers for poster and package image assets.
12. Preload only the primary above-the-fold image on each page.
13. Keep poster marquee images lazy-loaded and limit their mobile payload.
14. Add a skeleton state for package cards and gallery images that are still loading.
15. Add a visible no-results reset action to the package filter form.
16. Add destination and budget filters only after their data is normalized.
17. Store a numeric `days` field rather than parsing duration text.
18. Store a package publication status rather than deriving archival state only from duration.
19. Introduce a clear internal rule for when price is public, on request, or unavailable.
20. Add validation that prevents suspicious prices and impossible discounts from publishing.
21. Add per-person, tax, room-sharing, and validity labels wherever a public price is shown.
22. Add last-updated dates and availability disclaimers to package detail pages.
23. Replace any remaining scraped brand references with reviewed MQT copy.
24. Give every published package a human-reviewed summary, route, inclusions, exclusions, and cancellation note.
25. Establish a minimum of three good photos for each featured package.
26. Add descriptive captions and alt text that name the destination or activity.
27. Add map data to package detail pages when a route is available.
28. Add hotel category and transport details to the at-a-glance section.
29. Show itinerary duration estimates and meal/accommodation markers for each day.
30. Add an itinerary PDF or shareable itinerary link after a lead is qualified.
31. Turn the mobile footer columns into accordion sections.
32. Limit the mobile footer to primary links and place secondary links behind an expand control.
33. Use one primary conversion action per viewport, rather than several equal-weight buttons.
34. Add a persistent but non-obstructive mobile enquiry button with safe-area spacing.
35. Test every form for validation, submission feedback, duplicate-submit prevention, and CRM delivery.
36. Add consent-aware analytics and a privacy-respecting cookie preference flow if tracking is used.
37. Verify phone, WhatsApp, social, payment, and footer links against production destinations.
38. Add a proper booking lookup flow or remove the My Booking promise until it is live.
39. Add server-side rate limiting and spam protection to enquiry endpoints.
40. Add a client-side accessible error summary to each form.
41. Verify keyboard navigation through navigation menus, gallery, tabs, accordions, and filters.
42. Run a WCAG 2.2 contrast audit after the full color migration.
43. Add `aria-current` to active navigation and category states where appropriate.
44. Add a skip link target and check focus order at all mobile breakpoints.
45. Test at 320px, 360px, 390px, 412px, 768px, and common desktop widths.
46. Add automated visual regression screenshots for home, packages, package detail, footer, and mobile navigation.
47. Add automated route smoke tests for every static page and a sample of every dynamic route family.
48. Ensure removed short-tour URLs return an intentional status/redirect strategy in production and are removed from external feeds.
49. Validate Product, TouristTrip, FAQ, Breadcrumb, Organization, and LocalBusiness schema with Google Rich Results Test.
50. Add Organization, TravelAgency/LocalBusiness, and WebSite schema globally with verified business details.
51. Add a site search action to WebSite schema only when internal search is reliable.
52. Use unique, editorial titles and meta descriptions for high-value destination and package pages.
53. Add self-referential canonicals and pagination handling to every indexable listing state.
54. Keep filtered URLs out of the sitemap; only canonical category and high-value landing pages should be indexed.
55. Add internal links between destination guides, experience pages, relevant blogs, and packages using descriptive anchor text.
56. Publish destination guides that answer seasonal, transport, budget, permit, and safety questions.
57. Add author, reviewer, and update information to editorial travel content.
58. Build a monthly content-quality review that checks factual accuracy, duplication, and thin pages.
59. Create a redirect map before deleting or renaming any high-traffic legacy page.
60. Establish a release gate requiring lint, typecheck, content validation, image validation, route smoke tests, and mobile visual review.
