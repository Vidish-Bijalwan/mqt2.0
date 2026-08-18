// Clean scraped junk out of the package detail block data (V3 + V2).
//
// The original scrape of the reference site dumped homepage sections into the
// package pages (e.g. "Top Trending Tour Packages", "Our Popular India Tour
// Packages", trade-fair listings like "MATTA Fair Malaysia") BEFORE the real
// package content. The Overview tab was rendering that junk verbatim.
//
// This pass:
//   1. Drops everything before the first REAL content heading when a package
//      starts with a junk heading (9 packages in V3, same in V2).
//   2. Removes bare "Day N:" stub headings that just duplicate the real
//      "Day N: <title>" heading that follows (chardham-yatra-by-helicopter).
//
// Run: node scripts/parity/clean-package-blocks.mjs
import fs from "node:fs";
import path from "node:path";

const JUNK_HEADING_RE =
  /^(Top Trending Tour Packages|Our Popular (India|International) Tour Packages|Book International Tour Packages From India|Choose Your Style Of Themes Holiday|Experience the Best of India|Best Travel Company in Delhi|Top Holiday Destinations in India|.*(Trade|Travel) Mart|.*ITB Asia|.*QTM 20|.*Fair Malaysia|.*Exhibition)/i;

// Real content headings that end a junk run. Day headings and the itinerary
// wrapper are the common case (the 9 junk packages had no overview copy).
const REAL_HEADING_RE =
  /Tour Overview|Itinerar|Highlight|Inclusion|Exclusion|^Day\s*\d|^Q\d|Why |Significance|Best Time|Useful|Guideline|Important|Note:/i;

// Scrape chrome that carries no real package info — "Coming Soon" placeholders,
// contact widgets, and the package title echoing as a heading.
const CHROME_RE =
  /coming soon|under construction|how would you like to get in touch|live chat|whatsapp|quick enquiry|email us|call us|send query|book now|view tour/i;

// A block set whose every text block is chrome or a title-echo heading is
// content-less (e.g. category pages scraped as "Coming Soon") — drop it so the
// page falls through to the honest empty state instead of rendering contact
// widgets.
//
// IMPORTANT: the title-echo rule applies ONLY to HEADINGS. A paragraph that
// merely mentions the package title ("Amarnath Yatra is one of the most highly
// revered pilgrimages...") is real content and must never be treated as
// chrome — that bug deleted 89 real intros and was repaired by
// restore-chrome-drops.mjs.
function isChromeOnly(blocks, title) {
  const headings = blocks
    .filter((b) => b.type === "heading")
    .map((b) => (b.text || "").trim())
    .filter(Boolean);
  const paras = blocks
    .filter((b) => b.type === "paragraph")
    .map((b) => (b.text || "").trim())
    .filter(Boolean);
  if (headings.length === 0 && paras.length === 0) {
    // No text at all: if there are lists they must all be contact chrome.
    const lists = blocks.filter((b) => b.type === "list");
    if (lists.length === 0) return false; // images-only — could be a real gallery
    return lists.every((l) =>
      (l.items || [])
        .filter(Boolean)
        .every((i) => /live chat|whatsapp|enquiry|email|phone|^\+\d/i.test(i)),
    );
  }
  const titleLower = (title || "").toLowerCase();
  const headingOk = headings.every(
    (t) =>
      CHROME_RE.test(t) ||
      (titleLower && (t.toLowerCase() === titleLower || titleLower.includes(t.toLowerCase()))),
  );
  const paraOk = paras.every((t) => CHROME_RE.test(t));
  return headingOk && paraOk;
}

function cleanBlocks(blocks, title) {
  if (!Array.isArray(blocks) || blocks.length === 0) return blocks;

  // 0. Chrome-only block sets ("Coming Soon" category pages, contact widgets).
  if (isChromeOnly(blocks, title)) {
    console.warn("  ⚠ chrome-only blocks (no real content) — dropping blocks");
    return [];
  }

  // 1. Junk prefix: if the first heading is homepage junk, keep only the real
  //    content (from the first real heading onward).
  const firstHeading = blocks.findIndex((b) => b.type === "heading");
  if (firstHeading >= 0 && JUNK_HEADING_RE.test(blocks[firstHeading].text || "")) {
    const realIdx = blocks.findIndex(
      (b, i) =>
        i > firstHeading &&
        b.type === "heading" &&
        !JUNK_HEADING_RE.test(b.text || "") &&
        REAL_HEADING_RE.test(b.text || ""),
    );
    if (realIdx > 0) {
      blocks = blocks.slice(realIdx);
    } else {
      // Entirely junk (no real content anywhere — the scrape captured only
      // the homepage). Drop the blocks so the page falls back to the concise
      // pkg.description / V2 / legacy details instead of rendering junk.
      console.warn("  ⚠ all-junk blocks (no real content) — dropping blocks");
      return [];
    }
  }

  // 2. Bare "Day N:" stubs immediately followed by the real "Day N: <title>".
  const out = [];
  for (let i = 0; i < blocks.length; i++) {
    const b = blocks[i];
    const next = blocks[i + 1];
    if (
      b.type === "heading" &&
      /^day\s*\d+:\s*$/i.test((b.text || "").trim()) &&
      next &&
      next.type === "heading" &&
      /^day\s*\d+/i.test(next.text || "")
    ) {
      continue; // drop the stub, keep the real day heading
    }
    out.push(b);
  }
  return out;
}

function processFile(relPath, label) {
  const file = path.join(process.cwd(), relPath);
  if (!fs.existsSync(file)) {
    console.log(`skip ${relPath} (missing)`);
    return;
  }
  const data = JSON.parse(fs.readFileSync(file, "utf8"));
  let changed = 0;
  let removedBlocks = 0;
  let removedStubs = 0;
  const all = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), "src/data/allPackages.ts"), "utf8").match(/export const allPackages[^=]*=\s*(\[[\s\S]*\]);?\s*$/)[1],
  );
  const titleBySlug = new Map(all.map((p) => [p.slug, p.title]));
  for (const key of Object.keys(data)) {
    const before = data[key]?.blocks?.length ?? 0;
    const cleaned = cleanBlocks(data[key]?.blocks, titleBySlug.get(key));
    if (cleaned.length !== before) {
      data[key].blocks = cleaned;
      changed++;
      removedBlocks += before - cleaned.length;
    }
  }
  // Count stub removals separately (they don't change length by themselves
  // when the prefix strip also ran; report as informational).
  const stubCount = countStubs(data);
  fs.writeFileSync(file, JSON.stringify(data, null, 2), "utf8");
  console.log(
    `${label}: ${changed} packages cleaned, ${removedBlocks} blocks removed, ${stubCount} bare Day stubs dropped`,
  );
}

function countStubs(data) {
  let n = 0;
  for (const key of Object.keys(data)) {
    const b = data[key]?.blocks || [];
    for (let i = 0; i < b.length; i++) {
      const next = b[i + 1];
      if (
        b[i].type === "heading" &&
        /^day\s*\d+:\s*$/i.test((b[i].text || "").trim()) &&
        next &&
        next.type === "heading" &&
        /^day\s*\d+/i.test(next.text || "")
      ) {
        n++;
      }
    }
  }
  return n;
}

console.log("── clean-package-blocks ──");
processFile("src/data/packageDetailsV3.json", "V3");
processFile("src/data/packageDetailsV2.json", "V2");
console.log("done");
