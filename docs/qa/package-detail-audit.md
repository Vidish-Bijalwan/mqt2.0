# Package detail QA and conversion pass

Date: 7 September 2026  
Reference page: `/packages/10-days-assam-meghalaya-arunachal-pradesh-tour-packages`

## Punch list and resolution

| Finding | Reproduction / evidence | Resolution | Status |
| --- | --- | --- | --- |
| Photo gallery was trapped inside the transformed hero and appeared frozen on a 375 px viewport. | Open the reference package at 375 px and select **View photo**. The old overlay remained bounded by the hero while page content stayed visible around it. | The lightbox is now rendered into `document.body`, fills the dynamic viewport, locks background scrolling, traps focus, supports Escape/arrow keys and swipe, and restores focus/scroll on close. | Fixed and browser-tested |
| The reference package exposed only one photo. | The old hero CTA opened a single-image viewer. | Added seven human-reviewed, captioned images covering Kaziranga, Tawang, Nohkalikai, Kamakhya and Shillong. | Fixed and browser-tested |
| Unverified secondary images could be reused in unrelated galleries. | Asset audit found 301 records needing review, many with hash-only filenames that cannot establish destination relevance. | Gallery enrichment now accepts only local, sufficiently sized images with descriptive filenames sharing destination terms. Hash-only assets are excluded. Editorial overrides take priority for manually reviewed packages. | Fixed in rendering logic |
| Package content and pricing sidebar squeezed small screens. | Checked at 375 px and 414 px. | Desktop planning card is hidden on small screens; a two-action sticky journey bar shows price, WhatsApp and **Personalise trip**. Hero, route rail, tabs, content cards and enquiry form stack cleanly. | Fixed and browser-tested |
| Enquiry controls were not consistently mobile-oriented. | Checked native roles and dimensions at 414 px. | Name, email, phone, date and traveller controls are full width and 52 px high; email, phone, date and number retain the correct native input types. | Fixed and browser-tested |
| Itinerary presentation under-sold the eleven-day journey. | The source itinerary was a visually flat accordion despite containing useful detail. | Added a numbered journey rail, a day count, open-all control, pacing labels, distance/drive-time chips and a factual “Why this day stands out” callout. Existing multi-paragraph day descriptions remain intact. | Fixed and browser-tested |
| Hero and section typography lacked hierarchy and conversion focus. | Compared the supplied mobile captures with the finished 375 px and 1440 px layouts. | Added an editorial display type role, stronger hierarchy, forest/saffron expedition styling, sensory hero and overview copy, a route-at-a-glance rail, clearer value highlights and stronger tailored-quote CTAs. | Fixed |
| Related tours could be random when the source category was broad (for example “India Tours”). | Arunachal initially surfaced Andhra and Madhya Pradesh cards. | Recommendations now score exact destination names plus geographic clusters/subclusters. Arunachal now surfaces the combined North-East journey and Tawang; unrelated state cards are omitted. | Fixed and browser-tested |
| CTA destinations needed verification. | Checked hero CTA, sticky CTA, breadcrumbs, related-tour **View Tour**, related-tour **Quick enquiry**, category link and WhatsApp URL. | Internal destinations return HTTP 200; related enquiry opens the matching package at `#enquiry-form`; WhatsApp links include a package-specific pre-filled message. | Passed |

## Responsive verification

- 375 × 812: hero, route rail, sticky journey CTA, tabs, itinerary and full-screen gallery checked.
- 414 × 896: package content and full enquiry form checked; controls measured at 319 × 52 px and the message field at 319 × 130 px.
- 1440 px desktop: hero, editorial hierarchy, route rail, tabs and desktop planning card checked.
- The seven-photo gallery advanced from image 1 to image 2, updated its caption/counter, and closed back to the package page.

## Catalog-wide content audit

The catalog scan covers 709 source records and 652 published package records:

- 652/652 published packages have a primary image.
- No primary-image destination mismatch was detected by the filename/title audit.
- 99 primary images are below the preferred resolution threshold.
- 301 image records still need a human licensing/visual review; these assets are no longer allowed into galleries when their filenames cannot prove relevance.
- A conservative post-fix scan finds at least 520 published packages with five to eight semantically matched local images, 110 with two to four, and 22 with one.
- 89 published packages have structured itineraries; 563 do not have source itinerary data to enrich.

The remaining image and itinerary gaps are content-inventory work, not a UI defect. The application deliberately avoids filling them with unrelated stock photography or invented day plans. Completing every package to the same standard as the reference page requires destination-specific licensed assets and verified itinerary copy for those remaining records.

## Build verification

- Focused ESLint check: passed.
- TypeScript check: passed.
- Next.js production build: passed, including static generation for all 652 package routes.
- Known non-blocking build warning: the existing filesystem-backed package loader creates a broad dependency pattern for Turbopack.

## Follow-up: Madurai and Rameswaram

Reference page: `/packages/3-days-madurai-rameshwaram-tour`

- Removed sticky positioning and translucent backdrop styling from the package tabs. At the enquiry section the tab bar now reports `position: static` and is fully above the viewport instead of following the user.
- Replaced the low-resolution branded collage and duplicate filler with a six-photo editorial gallery. Browser-reported source dimensions range from 1,400 × 1,867 to 1,920 × 2,560, with one 1,600 × 1,200 waterfront image.
- Added package-specific copy, route stops and highlights for Madurai, Rameswaram and Dhanushkodi.
- Tightened automatic galleries site-wide: additional images must now be a curated asset or a high-resolution library asset, at least 50 KB, and still pass the destination-name match.
- Tested required-field validation: an empty submission focuses `Full Name`, remains on the enquiry form and opens no external tab.
- Tested the WhatsApp URL builder with all form fields, including package, date, traveller count and message; the exact encoded payload passed.
- Added a persistent **Open WhatsApp** fallback after preparation so a browser popup blocker cannot strand the visitor. No real customer enquiry was sent during QA.
