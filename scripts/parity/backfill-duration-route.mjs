// Backfill missing duration/route fields in allPackages.ts from REAL scraped
// content — never invented data.
//
// Duration sources (in priority order):
//   1. A "X Days / Y Nights" style paragraph in the package blocks (the
//      reference site's own fact lines).
//   2. The count of "Day N" itinerary headings (days ⇒ "N Days / N-1 Nights").
//
// Route source:
//   A route-list paragraph ("Destinations ➝ A → B → C", "A → B → C") with the
//   "Destinations" prefix and junk tokens ("Rest of the Sightseeing",
//   "Places You'll See", "See More") stripped, arrows normalized to " → ".
//
// Only fields that are currently EMPTY are touched. The file keeps its exact
// CRLF + 2-space formatting (verified byte-identical regeneration).
//
// Run: node scripts/parity/backfill-duration-route.mjs
import fs from "node:fs";
import path from "node:path";

const FILE = path.join(process.cwd(), "src/data/allPackages.ts");
const src = fs.readFileSync(FILE, "utf8");
const m = src.match(/export const allPackages[^=]*=\s*(\[[\s\S]*\]);?\s*$/);
if (!m) throw new Error("could not locate allPackages array");
const all = JSON.parse(m[1]);

const v3 = JSON.parse(fs.readFileSync(path.join(process.cwd(), "src/data/packageDetailsV3.json"), "utf8"));
const v2 = JSON.parse(fs.readFileSync(path.join(process.cwd(), "src/data/packageDetailsV2.json"), "utf8"));
// Legacy structured sources (V1 + its fuller backup). Measured to be fully
// subsumed by the V3/V2 blocks for the current catalog (0 additional fills),
// but kept in the pipeline so a future re-scrape with gaps benefits.
const v1 = JSON.parse(fs.readFileSync(path.join(process.cwd(), "src/data/packageDetails.json"), "utf8"));
const v1b = JSON.parse(fs.readFileSync(path.join(process.cwd(), "src/data/packageDetails.json.backup"), "utf8"));

const blocksFor = (slug) => v3[slug]?.blocks || v2[slug]?.blocks || [];
const legacyFor = (slug) => v1[slug] || v1b[slug] || null;

// ---- duration ----
const DUR_RE = /^([\s\S]{0,40}?)(\d{1,2})\s*(days?|nights?)\s*[\/\\\-|]\s*(\d{1,2})\s*(nights?|days?)([\s\S]{0,20})$/i;
const DAY_RE = /^day\s*-?\s*\d+/i;

function durationFromBlocks(blocks) {
  // Prefer short fact-line paragraphs ("2 Days / 1 Night"), skip prices.
  const paras = blocks
    .filter((b) => b.type === "paragraph")
    .map((b) => (b.text || "").trim())
    .filter((t) => !/₹|USD|INR|per person|price|cost/i.test(t));
  const hit = paras.find((t) => DUR_RE.test(t));
  if (!hit) return null;
  const mm = hit.match(DUR_RE);
  const isDaysFirst = /^days?$/i.test(mm[3]);
  const days = isDaysFirst ? mm[2] : mm[4];
  const nights = isDaysFirst ? mm[4] : mm[2];
  if (Number(days) === 0) return null;
  return `${Number(days)} Days / ${Number(nights)} Nights`;
}

function durationFromDayCount(blocks) {
  const days = blocks.filter((b) => b.type === "heading" && DAY_RE.test(b.text || "")).length;
  if (days < 1) return null;
  return days === 1 ? "1 Day" : `${days} Days / ${days - 1} Nights`;
}

// ---- route ----
// All arrow variants seen in the scraped data: → (2192) ➝ (279d) ➤ (27a4) ▸ (25b8)
const ARROW = /[\u2192\u279D\u27A4\u25B8]/;
const JUNK_SEGMENTS = /see (more|less)|rest of the sightseeing|multi-day tours available|places you.?ll see|destinations/i;
const LEADING_ARROW = new RegExp(`^[${ARROW.source.slice(1, -1)}]+`, "i");
const PREFIX_RE = new RegExp(`^(destinations|route map|route)\\s*[:${ARROW.source.slice(1, -1)}]?\\s*`, "i");

function routeFromBlocks(blocks) {
  const para = blocks.find((b) => {
    const t = (b.text || "").trim();
    if (b.type !== "paragraph" || !ARROW.test(t)) return false;
    if (t.length > 200) return false;
    if (/^multi-day|^dates|^price|^starting from|₹|USD|INR/i.test(t)) return false;
    if (/^(arrival|transfer|day|night|sightseeing)\s*\d/i.test(t)) return false;
    return true;
  });
  if (!para) return null;
  let t = para.text.trim();
  // Strip "Destinations ➝" / "Route Map:" style prefixes.
  t = t.replace(PREFIX_RE, "");
  const places = t
    .split(ARROW)
    .map((s) => s.trim())
    .filter(Boolean)
    // Drop leading arrows, day-prefixed markers like "1N Guwahati", junk.
    .map((s) => s.replace(LEADING_ARROW, "").replace(/^\d+\s*n\s*/i, "").trim())
    .filter((s) => !JUNK_SEGMENTS.test(s));
  if (places.length === 0) return null;
  return places.join(" → ");
}

// Legacy itinerary entries use { title: "Day 1: ...", description } — count the
// Day titles as a duration source, and scan their text for "X Days / Y Nights".
function durationFromLegacy(entry) {
  if (!entry) return null;
  const it = Array.isArray(entry.itinerary) ? entry.itinerary : [];
  const days = it.filter((d) => DAY_RE.test((d.title || "").trim())).length;
  const text =
    JSON.stringify(entry.overview || "") +
    " " +
    JSON.stringify(it.map((d) => `${d.title} ${d.description}`).join(" "));
  const mm = text.match(/(\d{1,2})\s*days?\s*\/\s*(\d{1,2})\s*nights?/i);
  if (mm && Number(mm[1]) > 0) return `${Number(mm[1])} Days / ${Number(mm[2])} Nights`;
  if (days >= 1) return days === 1 ? "1 Day" : `${days} Days / ${days - 1} Nights`;
  return null;
}

// ---- apply ----
let durFilled = 0;
let durFromDays = 0;
let durFromLegacy = 0;
let routeFilled = 0;
const durSamples = [];
const routeSamples = [];

for (const p of all) {
  const blocks = blocksFor(p.slug);
  if (!p.duration) {
    const fromPara = durationFromBlocks(blocks);
    const fromDays = !fromPara ? durationFromDayCount(blocks) : null;
    const value = fromPara || fromDays || durationFromLegacy(legacyFor(p.slug));
    if (value) {
      p.duration = value;
      durFilled++;
      if (fromDays) durFromDays++;
      if (!fromPara && !fromDays) durFromLegacy++;
      if (durSamples.length < 10) durSamples.push(`${p.slug}: ${value}`);
    }
  }
  if (!p.route) {
    const value = routeFromBlocks(blocks);
    if (value) {
      p.route = value;
      routeFilled++;
      if (routeSamples.length < 10) routeSamples.push(`${p.slug}: ${value}`);
    }
  }
}

// ---- write back (byte-identical formatting) ----
const body = JSON.stringify(all, null, 2).replace(/\n/g, "\r\n");
const next = src.replace(m[1], body);
fs.writeFileSync(FILE, next, "utf8");

const emptyDur = all.filter((p) => !p.duration).length;
const emptyRoute = all.filter((p) => !p.route).length;
console.log(`── backfill result ──`);
console.log(`duration: filled ${durFilled} (${durFromDays} from itinerary day count, ${durFromLegacy} from legacy V1/V1b); still empty: ${emptyDur}`);
console.log(`route:    filled ${routeFilled}; still empty: ${emptyRoute}`);
console.log(`\nduration samples:\n${durSamples.join("\n")}`);
console.log(`\nroute samples:\n${routeSamples.join("\n")}`);
