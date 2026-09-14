#!/usr/bin/env node
/**
 * Keep package SEO links first-party and route them through the public package
 * URL. This removes legacy source-domain backlinks from imported metadata and
 * JSON-LD while preserving all editorial content.
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const DOMAIN = 'https://www.myquicktrippers.com';
const LEGACY_DOMAIN = /^https?:\/\/(?:www\.)?namasteindiatrip\.com/i;

const packageSource = fs.readFileSync(path.join(ROOT, 'src/data/allPackages.ts'), 'utf8');
const marker = 'export const allPackages: Package[] =';
const markerIndex = packageSource.indexOf(marker);
const arrayStart = packageSource.indexOf('[', markerIndex + marker.length);
const packages = JSON.parse(packageSource.slice(arrayStart, packageSource.lastIndexOf(']') + 1));
const imagesBySlug = new Map(packages.map((pkg) => [pkg.slug, pkg.image]));

function cleanSlug(rawSlug) {
  return rawSlug.replace(/\.(?:html?|php)$/i, '');
}

function rewriteValue(value, canonical, imageUrl) {
  if (Array.isArray(value)) return value.map((item) => rewriteValue(item, canonical, imageUrl));
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, rewriteValue(item, canonical, imageUrl)]),
    );
  }
  if (typeof value !== 'string') return value;

  if (LEGACY_DOMAIN.test(value) && /^https?:\/\//i.test(value)) {
    if (/\/wp-content\//i.test(value)) return imageUrl;
    const withoutDomain = value.replace(LEGACY_DOMAIN, '');
    if (!withoutDomain || withoutDomain === '/') return DOMAIN;
    return canonical;
  }

  return value
    .replace(/(?:www\.)?namasteindiatrip\.com\/testimonial/gi, 'www.myquicktrippers.com/reviews')
    .replace(/(?:www\.)?namasteindiatrip\.com/gi, 'www.myquicktrippers.com')
    .replace(/info@namasteindiatrip\.com/gi, 'info@myquicktrippers.com')
    .replace(/\+?91[-\s]?9711616316/g, '+91-8171158569')
    .replace(/\+?91[-\s]?9704545558/g, '+91-8171158569')
    .replace(/\b9711616316\b/g, '8171158569')
    .replace(/\b9704545558\b/g, '8171158569')
    .replace(/\+?91[-\s]?9911572642/g, '+91-8171158569')
    .replace(/\b9911572642\b/g, '8171158569')
    .replace(/NamasteIndiaTrip/gi, 'My Quick Trippers')
    .replace(/\bNIT\b/g, 'My Quick Trippers')
    .replace(/My Quick Trippers\.com/gi, 'www.myquicktrippers.com');
}

for (const filename of ['packageDetailsV2.json', 'packageDetailsV3.json']) {
  const filePath = path.join(ROOT, 'src/data', filename);
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  let changed = 0;

  for (const [rawSlug, record] of Object.entries(data)) {
    if (!record || typeof record !== 'object' || !record.seo) continue;
    const slug = cleanSlug(rawSlug);
    const canonical = `${DOMAIN}/packages/${slug}`;
    const localImage = imagesBySlug.get(slug) || '/images/mqt-logo-256.webp';
    const imageUrl = `${DOMAIN}${localImage.startsWith('/') ? localImage : `/${localImage}`}`;
    data[rawSlug] = rewriteValue(record, canonical, imageUrl);
    const normalizedRecord = data[rawSlug];
    normalizedRecord.seo.canonical_url = canonical;
    if ('page_url' in normalizedRecord.seo) normalizedRecord.seo.page_url = canonical;
    if ('final_url' in normalizedRecord.seo) normalizedRecord.seo.final_url = canonical;
    if (normalizedRecord.seo.open_graph) {
      normalizedRecord.seo.open_graph['og:url'] = canonical;
      normalizedRecord.seo.open_graph['og:image'] ||= imageUrl;
    }
    if (normalizedRecord.seo.og_tags) {
      normalizedRecord.seo.og_tags['og:url'] = canonical;
      normalizedRecord.seo.og_tags['og:image'] ||= imageUrl;
    }
    changed++;
  }

  fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`);
  console.log(`${filename}: normalized ${changed} package records`);
}
