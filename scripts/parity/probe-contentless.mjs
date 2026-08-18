// Probe the reference site for the content-less packages and classify what is
// actually there: 404 / redirect / category listing / tour detail with real
// content. Output: .freebuff/probe-results.json
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const baseline = JSON.parse(fs.readFileSync(path.join(ROOT, "scripts/parity/contentless-baseline.json"), "utf8"));
const slugs = baseline.slugs;
const results = {};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

for (let i = 0; i < slugs.length; i++) {
  const slug = slugs[i];
  const url = `https://www.namasteindiatrip.com/${slug}`;
  try {
    const res = await fetch(url, {
      redirect: "manual",
      signal: AbortSignal.timeout(20000),
      headers: { "user-agent": "Mozilla/5.0 (compatible; parity-audit/1.0)" },
    });
    const status = res.status;
    if (status === 301 || status === 302 || status === 308) {
      results[slug] = { status, kind: "redirect", to: res.headers.get("location") };
    } else if (status === 404) {
      results[slug] = { status, kind: "404" };
    } else if (status === 200) {
      const html = await res.text();
      const text = html.replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<style[\s\S]*?<\/style>/gi, " ").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
      const hasOverview = /tour overview|day\s*1\s*:|itinerary|inclusions?|highlights/i.test(text);
      const hasDetail = /(day\s*-?\s*\d|inclusions?|exclusions?|highlights)/i.test(text);
      // category pages list many tour links — detect via repeated card titles
      const tourLinks = (html.match(/href="\/[a-z0-9-]+"/g) || []).length;
      const metaDesc = (html.match(/<meta name="description" content="([^"]*)"/i) || [])[1] || "";
      results[slug] = {
        status,
        kind: hasDetail ? "detail" : "listing",
        hasOverview,
        tourLinks,
        metaDesc: metaDesc.slice(0, 120),
      };
    } else {
      results[slug] = { status, kind: "other" };
    }
  } catch (e) {
    results[slug] = { kind: "error", msg: e.message.slice(0, 80) };
  }
  if (i % 10 === 0) console.log(`probed ${i + 1}/${slugs.length}`);
  await sleep(300);
}

fs.writeFileSync(path.join(ROOT, ".freebuff/probe-results.json"), JSON.stringify(results, null, 2));
const kinds = {};
for (const r of Object.values(results)) kinds[r.kind] = (kinds[r.kind] || 0) + 1;
console.log("── probe summary ──");
console.log(JSON.stringify(kinds));
