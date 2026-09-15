#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const BASE = (process.argv[2] || 'http://localhost:3000').replace(/\/$/, '');
const PUBLIC_DOMAIN = 'https://www.myquicktrippers.com';
// Local development servers compile and render routes on demand. Keep the
// default gentle enough to avoid turning an audit into artificial timeouts;
// CI can opt into more parallelism with AUDIT_CONCURRENCY.
const CONCURRENCY = Math.max(1, Number.parseInt(process.env.AUDIT_CONCURRENCY || "6", 10) || 6);
const TIMEOUT = 30_000;

function decodeHtml(value) {
  return value.replace(/&amp;/g, '&').replace(/&#x27;/g, "'").replace(/&quot;/g, '"');
}

function localUrl(value) {
  try {
    const url = new URL(decodeHtml(value), BASE);
    if (url.origin === new URL(BASE).origin || url.origin === PUBLIC_DOMAIN) {
      return `${BASE}${url.pathname}${url.search}`;
    }
  } catch {
    return null;
  }
  return null;
}

async function fetchPage(url) {
  const started = Date.now();
  try {
    const response = await fetch(url, {
      redirect: 'follow',
      signal: AbortSignal.timeout(TIMEOUT),
      headers: { 'user-agent': 'MQT-Local-Audit/1.0' },
    });
    const type = response.headers.get('content-type') || '';
    const body = type.includes('text/') || type.includes('json') || type.includes('xml')
      ? await response.text()
      : '';
    return { url, status: response.status, finalUrl: response.url, type, ms: Date.now() - started, body };
  } catch (error) {
    return { url, status: 0, finalUrl: '', type: '', ms: Date.now() - started, body: '', error: error.message };
  }
}

async function fetchMany(urls) {
  const queue = [...urls];
  const results = [];
  const workers = Array.from({ length: Math.min(CONCURRENCY, queue.length) }, async () => {
    while (queue.length) results.push(await fetchPage(queue.shift()));
  });
  await Promise.all(workers);
  return results;
}

const sitemapResponse = await fetchPage(`${BASE}/sitemap.xml`);
if (sitemapResponse.status !== 200) throw new Error(`Sitemap returned ${sitemapResponse.status}`);
const sitemapUrls = [...sitemapResponse.body.matchAll(/<loc>([^<]+)<\/loc>/g)]
  .map((match) => localUrl(match[1]))
  .filter(Boolean);

const firstPass = await fetchMany([...new Set([`${BASE}/`, ...sitemapUrls])]);
const discovered = new Set();
const externalHrefs = new Set();
for (const result of firstPass) {
  for (const match of result.body.matchAll(/\shref=["']([^"']+)["']/gi)) {
    const href = decodeHtml(match[1]);
    if (/^(?:mailto:|tel:|sms:|javascript:|#)/i.test(href)) continue;
    const local = localUrl(href);
    if (local) discovered.add(local.split('#')[0]);
    else if (/^https?:\/\//i.test(href)) externalHrefs.add(href);
  }
}

const checked = new Set(firstPass.map((result) => result.url));
const additionalUrls = [...discovered].filter((url) => !checked.has(url));
const secondPass = await fetchMany(additionalUrls);
const results = [...firstPass, ...secondPass];
const broken = results.filter((result) => result.status < 200 || result.status >= 400);
const redirects = results.filter((result) => result.finalUrl && new URL(result.finalUrl).pathname !== new URL(result.url).pathname);
const htmlResults = results.filter((result) => result.type.includes('text/html'));
const legacyLeaks = htmlResults.filter((result) => /namasteindiatrip|9711616316|9704545558/i.test(result.body));
const packageResults = htmlResults.filter((result) => new URL(result.url).pathname.startsWith('/packages/'));
const missingItineraryControl = packageResults.filter((result) => !/(>Itinerary<|>Suggested itinerary<|Day by day)/i.test(result.body));
const missingPrice = packageResults.filter((result) => !/Starting from/i.test(result.body));
const badCanonical = packageResults.filter((result) => {
  const pathname = new URL(result.url).pathname;
  return !result.body.includes(`href="${PUBLIC_DOMAIN}${pathname}"`);
});
const withoutBody = (result) => {
  const item = { ...result };
  delete item.body;
  return item;
};
const slowest = [...results].sort((a, b) => b.ms - a.ms).slice(0, 20).map(withoutBody);

const summary = {
  generatedAt: new Date().toISOString(),
  baseUrl: BASE,
  sitemapUrls: sitemapUrls.length,
  discoveredInternalUrls: discovered.size,
  checkedUrls: results.length,
  packageUrls: packageResults.length,
  successfulUrls: results.length - broken.length,
  brokenUrls: broken.length,
  redirectedUrls: redirects.length,
  legacyReferenceLeaks: legacyLeaks.length,
  packagesMissingItineraryControl: missingItineraryControl.length,
  packagesMissingPublishedPrice: missingPrice.length,
  packagesWithBadCanonical: badCanonical.length,
  externalHrefCount: externalHrefs.size,
};

const output = {
  summary,
  broken: broken.map(withoutBody),
  redirects: redirects.map(withoutBody),
  legacyLeaks: legacyLeaks.map(({ url }) => url),
  missingItineraryControl: missingItineraryControl.map(({ url }) => url),
  missingPrice: missingPrice.map(({ url }) => url),
  badCanonical: badCanonical.map(({ url }) => url),
  externalHrefs: [...externalHrefs].sort(),
  slowest,
};

const qaDir = path.join(process.cwd(), 'docs', 'qa');
fs.mkdirSync(qaDir, { recursive: true });
fs.writeFileSync(path.join(qaDir, 'live-route-audit.json'), `${JSON.stringify(output, null, 2)}\n`);
fs.writeFileSync(path.join(process.cwd(), 'docs', 'live-route-audit.md'), `# Live Route Audit

Generated: ${summary.generatedAt}

- Sitemap routes: **${summary.sitemapUrls}**
- Total internal URLs checked: **${summary.checkedUrls}**
- Package routes checked: **${summary.packageUrls}**
- Successful URLs: **${summary.successfulUrls}/${summary.checkedUrls}**
- Broken URLs: **${summary.brokenUrls}**
- Legacy domain/contact leaks: **${summary.legacyReferenceLeaks}**
- Packages without an itinerary control: **${summary.packagesMissingItineraryControl}**
- Packages without a published starting price: **${summary.packagesMissingPublishedPrice}**
- Package canonical errors: **${summary.packagesWithBadCanonical}**
- Unique external links discovered: **${summary.externalHrefCount}**

Full findings and the external-link inventory are in \`docs/qa/live-route-audit.json\`.
`);

console.log(JSON.stringify(summary, null, 2));
if (broken.length || legacyLeaks.length || missingItineraryControl.length || missingPrice.length || badCanonical.length) process.exitCode = 1;
