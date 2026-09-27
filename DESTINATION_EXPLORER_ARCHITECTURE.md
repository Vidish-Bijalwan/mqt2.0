# Destination Explorer architecture

## Purpose

Destination Explorer is the reusable state, Union Territory, city and destination-listing pattern for My Quick Trippers. It keeps state identity, geography, destination discovery and package filtering in one route rather than creating a separate page for each destination.

The existing route shape is:

`/destinations/:slug?destination=&experience=&duration=&budget=`

The route is server-rendered. This keeps the state description, package count, destination links and JSON-LD crawlable before client-side interaction.

## Data model

`src/data/destinationExplorer.ts` contains state identity and explorer metadata:

- editorial identity: eyebrow, tagline, summary and best travel period
- taxonomy-driven experience chips
- featured destinations with stable names, image paths and themes
- optional `geography` metadata: map asset, source, version, verification date, boundary level and district count

Package counts, trip length and the starting price are never copied into this file. They are calculated from `getPublicPackages()` in `src/app/destinations/[slug]/page.tsx`.

## Geography policy and asset pipeline

An explorer can render its map only when `geography` is present. This prevents decorative placeholder art from being presented as an administrative map.

1. Obtain the state/district boundary from Survey of India Administrative Boundary Database or state-map catalogue.
2. Record source, edition/version and verification date in `destinationExplorer.ts`.
3. Validate state outline, district names and political representation before publishing.
4. Convert the authoritative source into an optimized web map asset. For an interactive district layer, retain the original source separately and generate topology-preserving GeoJSON/TopoJSON during build preparation.
5. Store only the selected state’s optimized asset in the page bundle; never load all state geometries globally.

Uttarakhand currently uses the Survey of India *Uttarakhand English, 1st edition 2026, 1:500,000* map at `public/images/maps/uttarakhand-soi-2026.webp`. It is a verified rendered official map, not an SVG approximation. District interaction must wait for verified district geometry.

## Adding a state or Union Territory

1. Add state identity, themes and featured destinations to `destinationExplorerProfiles`.
2. Add package-matching terms to the destination route’s `keywords` map. These query the existing catalogue rather than creating a second package list.
3. Add an authoritative map asset and `geography` record once validated. Without it, the page retains the explorer and package journey but does not claim to show a map.
4. Add a high-quality hero and feature images from the internal location library.
5. Verify the state page at desktop and mobile widths, then verify destination, experience, duration and budget query combinations.

## Search state

The route is the source of truth. Supported query parameters are:

- `destination`
- `experience`
- `duration` (`3-5`, `6-9`, `10+`)
- `budget` (`25000-50000` currently implemented)

Destination cards and state-map destination links produce URL-driven selections so links are shareable, survive refresh and work with browser history.

## Accessibility and fallback behavior

Every visual destination discovery item is a real link with a descriptive accessible name. The official map includes a useful alt label and source attribution. If a geography asset is unavailable, the regular destination hero, place rail and package results continue to render; no empty map or broken image is shown.

## Performance

- Next Image serves responsive images with explicit dimensions and lazy loading below the fold.
- The primary map is loaded only when its state has verified geography metadata.
- Package filtering is performed once from the already-available catalogue for the request; the explorer does not create duplicate package data.
- The map asset should remain a few hundred KB compressed where practical. Uttarakhand’s rendered source is currently larger than this target, so future interactive geometry should use an optimized topology-preserving asset.

## Current rollout status

- Shared explorer profile schema: implemented.
- Shared verified-map hero component: implemented.
- Uttarakhand verified map, catalogue stats, destination filtering and responsive layout: implemented.
- Other state profiles: use the shared explorer page and data model; authoritative geometry should be added state by state after validation.
- District polygons, marker coordinates, map hover previews, mobile filter drawer and sort controls: not yet implemented. They require validated geometry and normalized district/destination metadata before they can be represented accurately.
