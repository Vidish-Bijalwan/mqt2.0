// One-off repair for the over-aggressive chrome-only drop.
//
// The first version of clean-package-blocks' chrome detection treated ANY text
// mentioning the package title as chrome — so real intro paragraphs like
// "Amarnath Yatra is one of the most highly revered pilgrimages..." were
// wrongly deleted. This restores those packages' blocks from the committed
// baseline (git HEAD), re-applying the brand swap and the "See More" cleanup
// that the working tree had before this session, and re-checks with the
// CORRECTED heuristic before restoring:
//
//   keep empty when HEAD blocks are (a) a scraped junk start (homepage dump)
//   or (b) genuinely chrome-only ("Coming Soon" category pages, contact
//   widgets). Otherwise restore.
//
// Run: node scripts/parity/restore-chrome-drops.mjs
//
// Prereq: HEAD copies of both data files, e.g.
//   git show HEAD:src/data/packageDetailsV3.json > .freebuff/v3-head.json
//   git show HEAD:src/data/packageDetailsV2.json > .freebuff/v2-head.json
import fs from "node:fs";
import path from "node:path";

const HEAD_V3 = path.join(process.cwd(), ".freebuff/v3-orig.json");
const HEAD_V2 = path.join(process.cwd(), ".freebuff/v2-head.json");

for (const [name, headFile, target] of [
  ["V3", HEAD_V3, "src/data/packageDetailsV3.json"],
  ["V2", HEAD_V2, "src/data/packageDetailsV2.json"],
]) {
  const head = JSON.parse(fs.readFileSync(headFile, "utf8"));
  const cur = JSON.parse(fs.readFileSync(target, "utf8"));
  const src = fs.readFileSync(path.join(process.cwd(), "src/data/allPackages.ts"), "utf8");
  const all = JSON.parse(src.match(/export const allPackages[^=]*=\s*(\[[\s\S]*\]);?\s*$/)[1]);
  const titleBySlug = new Map(all.map((p) => [p.slug, p.title]));

  // Brand swap + trailing "See More"/"See Less" cleanup (matches the working
  // tree state from before this session).
  const polish = (blocks) =>
    JSON.parse(
      JSON.stringify(blocks)
        .replace(/Namaste India(?!n)/gi, "My Quick Trippers")
        .replace(/"text":\s*"([^"]*?)\s*See More\s*"/gi, '"text": "$1"')
        .replace(/"text":\s*"([^"]*?)\s*See Less\s*"/gi, '"text": "$1"'),
    );

  const JUNK_HEADING_RE =
    /^(Top Trending Tour Packages|Our Popular (India|International) Tour Packages|Book International Tour Packages From India|Choose Your Style Of Themes Holiday|Experience the Best of India|Best Travel Company in Delhi|Top Holiday Destinations in India|.*(Trade|Travel) Mart|.*ITB Asia|.*QTM 20|.*Fair Malaysia|.*Exhibition)/i;

  // CORRECTED chrome check: title-echo only counts for HEADINGS; a paragraph
  // that merely mentions the title is real content.
  const CHROME_RE =
    /coming soon|under construction|how would you like to get in touch|live chat|whatsapp|quick enquiry|email us|call us|send query|book now|view tour/i;
  const isChromeOnlyFixed = (blocks, title) => {
    const headings = blocks.filter((b) => b.type === "heading").map((b) => (b.text || "").trim()).filter(Boolean);
    const paras = blocks.filter((b) => b.type === "paragraph").map((b) => (b.text || "").trim()).filter(Boolean);
    if (headings.length === 0 && paras.length === 0) {
      const lists = blocks.filter((b) => b.type === "list");
      if (lists.length === 0) return false; // images-only
      return lists.every((l) => (l.items || []).filter(Boolean).every((i) => /live chat|whatsapp|enquiry|email|phone|^\+\d/i.test(i)));
    }
    const titleLower = (title || "").toLowerCase();
    const headingOk = headings.every(
      (t) => CHROME_RE.test(t) || (titleLower && (t.toLowerCase() === titleLower || titleLower.includes(t.toLowerCase()))),
    );
    const paraOk = paras.every((t) => CHROME_RE.test(t));
    return headingOk && paraOk;
  };
  const isJunkStart = (blocks) => {
    const fh = blocks.find((b) => b.type === "heading");
    return !!fh && JUNK_HEADING_RE.test(fh.text || "");
  };

  let restored = 0;
  let keptEmpty = 0;
  const restoredSamples = [];
  for (const key of Object.keys(cur)) {
    const curBlocks = cur[key]?.blocks;
    if (!Array.isArray(curBlocks) || curBlocks.length !== 0) continue; // only fully-emptied
    const headBlocks = head[key]?.blocks;
    if (!Array.isArray(headBlocks) || headBlocks.length === 0) continue; // nothing to restore
    const title = titleBySlug.get(key) || "";
    if (isJunkStart(headBlocks) || isChromeOnlyFixed(headBlocks, title)) {
      keptEmpty++;
      continue;
    }
    cur[key].blocks = polish(headBlocks);
    restored++;
    if (restoredSamples.length < 10) restoredSamples.push(key);
  }

  // OneDrive/AV occasionally holds a transient lock — retry a few times.
  const body = JSON.stringify(cur, null, 2);
  for (let attempt = 1; ; attempt++) {
    try {
      fs.writeFileSync(target, body, "utf8");
      break;
    } catch (e) {
      if (attempt >= 5) throw e;
      await new Promise((r) => setTimeout(r, 1500));
    }
  }
  console.log(`${name}: restored ${restored} packages, kept ${keptEmpty} correctly empty`);
  console.log(`  restored: ${restoredSamples.join(", ")}`);
}

console.log("done — HEAD copies left in .freebuff for review; delete when satisfied");
