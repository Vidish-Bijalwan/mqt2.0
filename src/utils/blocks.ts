// Helpers for the scraped package-detail block data (V3/V2).
//
// The original scrape sometimes dumped homepage sections into package pages
// ("Top Trending Tour Packages", "Our Popular India Tour Packages", trade
// fairs). A data pass (scripts/parity/clean-package-blocks.mjs) removed the
// worst offenders; these helpers keep the UI defensive and extract the
// reference-style Inclusions / Exclusions / Highlights sections that the
// Namaste India package pages show.

export interface Block {
  type: string;
  level?: number;
  text?: string;
  url?: string;
  alt?: string;
  caption?: string;
  items?: string[];
  ordered?: boolean;
  rows?: string[][];
}

// Keep in sync with scripts/parity/clean-package-blocks.mjs.
const JUNK_HEADING_RE =
  /^(Top Trending Tour Packages|Our Popular (India|International) Tour Packages|Book International Tour Packages From India|Choose Your Style Of Themes Holiday|Experience the Best of India|Best Travel Company in Delhi|Top Holiday Destinations in India|.*(Trade|Travel) Mart|.*ITB Asia|.*QTM 20|.*Fair Malaysia|.*Exhibition)/i;

const REAL_SECTION_RE = /Tour Overview|Itinerar|Highlight|Inclusion|Exclusion|^Day\s*\d|^Q\d/i;

/** Drop a leading run of scraped homepage junk (defense-in-depth). */
export function stripLeadingJunk(blocks: Block[]): Block[] {
  const firstHeading = blocks.findIndex((b) => b.type === "heading");
  if (firstHeading < 0) return blocks;
  if (!JUNK_HEADING_RE.test(blocks[firstHeading].text || "")) return blocks;
  const realIdx = blocks.findIndex(
    (b, i) =>
      i > firstHeading &&
      b.type === "heading" &&
      !JUNK_HEADING_RE.test(b.text || "") &&
      REAL_SECTION_RE.test(b.text || ""),
  );
  return realIdx > 0 ? blocks.slice(realIdx) : [];
}

// Scraped lists carry literal "See More"/"See Less" toggle artifacts — drop them.
function cleanItems(items: string[]): string[] {
  return (items || [])
    .map((s) => (s || "").trim())
    .filter(Boolean)
    .filter((s) => !/^see (more|less)$/i.test(s));
}

function listItemsAfter(blocks: Block[], startIdx: number, isSameSection: (t: string) => boolean): string[] {
  const items: string[] = [];
  for (let i = startIdx + 1; i < blocks.length; i++) {
    const b = blocks[i];
    if (b.type === "heading") {
      if (isSameSection(b.text || "")) continue;
      break;
    }
    if (b.type === "list") items.push(...cleanItems(b.items || []));
  }
  return items;
}

/** List items under the FIRST heading matching `headingRe`, merging repeated sections. */
export function extractListSection(blocks: Block[], headingRe: RegExp): string[] {
  const i = blocks.findIndex((b) => b.type === "heading" && headingRe.test(b.text || ""));
  if (i < 0) return [];
  return listItemsAfter(blocks, i, (t) => headingRe.test(t));
}

/** INCLUSIONS list — prefers an explicit "INCLUSIONS" heading, else the "Inclusion / Exclusion" wrapper. */
export function extractInclusions(blocks: Block[]): string[] {
  const explicit = extractListSection(blocks, /^inclusions?$/i);
  if (explicit.length > 0) return explicit;
  const i = blocks.findIndex((b) => b.type === "heading" && /inclusion/i.test(b.text || ""));
  if (i < 0) return [];
  return listItemsAfter(blocks, i, (t) => /inclusion/i.test(t) && !/exclusion/i.test(t));
}

/** EXCLUSIONS list — prefers an explicit "EXCLUSIONS" heading, else the wrapper. */
export function extractExclusions(blocks: Block[]): string[] {
  const explicit = extractListSection(blocks, /^exclusions?$/i);
  if (explicit.length > 0) return explicit;
  const i = blocks.findIndex((b) => b.type === "heading" && /exclusion/i.test(b.text || ""));
  if (i < 0) return [];
  return listItemsAfter(blocks, i, (t) => /exclusion/i.test(t));
}

/** Highlights bullets ("Key Highlights" / "Tour Highlights" + following lists). */
export function extractHighlights(blocks: Block[]): string[] {
  return extractListSection(blocks, /highlight/i);
}
