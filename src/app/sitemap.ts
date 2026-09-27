import { MetadataRoute } from 'next';
import fs from 'node:fs';
import path from 'node:path';
import { siteConfig } from '@/data/siteConfig';
import { getPublicPackages } from '@/utils/packageCatalog';
import { experiences } from '@/data/experiencesData';
import packageDetailsRaw from '@/data/packageDetails.json';
import destinationsDataRaw from '@/data/destinationsData.json';
import { ALL_BLOGS } from '@/data/blogIndex';

const packageDetails = packageDetailsRaw as Record<string, unknown>;
const destinationsData = destinationsDataRaw as Record<string, unknown>;
const publicPackages = getPublicPackages();
const publicPackageSlugs = new Set(publicPackages.map((pkg) => pkg.slug));
// Only the package pages with verified, editor-maintained detail records
// belong in the sitemap. Sending every scraped catalogue record created a
// sudden 1,000+ URL crawl queue and diluted Googlebot's attention away from
// pages that customers can actually use to plan a trip.
const curatedPackageSlugs = new Set(Object.keys(packageDetails).filter((slug) => publicPackageSlugs.has(slug)));

// ── Per-source lastmod ──────────────────────────────────────────────
// None of the data records carry their own date fields, so each URL group
// takes the modification time of its source data file. Static routes have
// no content source, so they fall back to the build time. All values are
// computed once at build time, so the same input tree always produces the
// same sitemap — crawlers can see exactly which groups changed release to
// release instead of a frozen site-wide stamp.
const BUILD_DATE = new Date();
function dataFileMtime(...relativePath: string[]): Date {
  try {
    return fs.statSync(path.join(process.cwd(), ...relativePath)).mtime;
  } catch {
    return BUILD_DATE;
  }
}
const PACKAGES_LASTMOD = dataFileMtime('src', 'data', 'packageDetails.json');
const DESTINATIONS_LASTMOD = dataFileMtime('src', 'data', 'destinationsData.json');
const EXPERIENCES_LASTMOD = dataFileMtime('src', 'data', 'experiencesData.ts');
const BLOG_LASTMOD = dataFileMtime('src', 'data', 'blogIndex.generated.json');

// ── Near-duplicate package families ────────────────────────────────
// The same trip is sold under per-origin-city slugs (e.g.
// "chardham-yatra-package-from-delhi"). Google crawls these families and
// declines to index most of them, so the sitemap keeps exactly one primary
// URL per family: the shortest slug (the base trip, never a -from-<city>
// variant). Families are derived programmatically — strip the trailing
// "-from-<city>" segment and group — so this stays correct as packages are
// added or removed. The variant pages themselves are untouched; only
// sitemap inclusion changes.
const ORIGIN_CITY_SUFFIX = /-from-[a-z]+(?:-[a-z]+)*$/;
function familyBaseSlug(slug: string): string {
  return slug.replace(ORIGIN_CITY_SUFFIX, '');
}
const primaryPackageSlugs: string[] = (() => {
  const families = new Map<string, string[]>();
  for (const slug of curatedPackageSlugs) {
    const base = familyBaseSlug(slug);
    const members = families.get(base);
    if (members) members.push(slug);
    else families.set(base, [slug]);
  }
  return [...families.values()].map((members) => {
    members.sort((a, b) => a.length - b.length || (a < b ? -1 : a > b ? 1 : 0));
    return members[0];
  });
})();

// Thin editorial page excluded from the sitemap (the page itself is
// untouched — this only controls crawler inclusion).
const EXCLUDED_DESTINATION_SLUGS = new Set(['blog']);

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteConfig.domain;
  const staticRoutes = [
    { route: '', priority: 1.0, freq: 'daily' as const },
    { route: '/packages', priority: 0.9, freq: 'daily' as const },
    { route: '/blog', priority: 0.8, freq: 'daily' as const },
    { route: '/about-us', priority: 0.8, freq: 'monthly' as const },
    { route: '/contact-us', priority: 0.8, freq: 'monthly' as const },
    { route: '/special-tours', priority: 0.8, freq: 'weekly' as const },
    // special-tours theme landing pages (slugs mirror src/data/themeConfig.ts;
    // "pilgrimage" is a /packages filter, not a special-tours page, so it is
    // excluded here)
    { route: '/special-tours/family', priority: 0.7, freq: 'weekly' as const },
    { route: '/special-tours/honeymoon', priority: 0.7, freq: 'weekly' as const },
    { route: '/special-tours/cultural', priority: 0.7, freq: 'weekly' as const },
    { route: '/special-tours/beaches', priority: 0.7, freq: 'weekly' as const },
    { route: '/special-tours/adventure', priority: 0.7, freq: 'weekly' as const },
    { route: '/special-tours/winter', priority: 0.7, freq: 'weekly' as const },
    { route: '/special-tours/summer', priority: 0.7, freq: 'weekly' as const },
    { route: '/special-tours/monsoon', priority: 0.7, freq: 'weekly' as const },
    { route: '/customer-center', priority: 0.6, freq: 'monthly' as const },
    { route: '/reviews', priority: 0.5, freq: 'monthly' as const },
    { route: '/careers', priority: 0.4, freq: 'monthly' as const },
    { route: '/group-tours', priority: 0.7, freq: 'weekly' as const },
    { route: '/experiences', priority: 0.85, freq: 'weekly' as const },
    { route: '/privacy-policy', priority: 0.3, freq: 'yearly' as const },
    { route: '/terms-and-conditions', priority: 0.3, freq: 'yearly' as const },
    { route: '/site-map', priority: 0.3, freq: 'yearly' as const },
    // Campaign pages
    { route: '/campaigns/himachal-tour-packages', priority: 0.9, freq: 'weekly' as const },
    { route: '/campaigns/chardham-yatra', priority: 0.9, freq: 'weekly' as const },
    { route: '/campaigns/dubai-tour-packages', priority: 0.9, freq: 'weekly' as const },
    { route: '/campaigns/nainital-holiday', priority: 0.9, freq: 'weekly' as const },
    { route: '/campaigns/buddhist-tours-india', priority: 0.9, freq: 'weekly' as const },
    { route: '/campaigns/helicopter-tours-india', priority: 0.9, freq: 'weekly' as const },
    { route: '/campaigns/shimla-honeymoon', priority: 0.9, freq: 'weekly' as const },
    { route: '/campaigns/dehradun-adventure', priority: 0.9, freq: 'weekly' as const },
  ].map(({ route, priority, freq }) => ({ url: `${baseUrl}${route}`, lastModified: BUILD_DATE, changeFrequency: freq, priority }));
  const curatedPackageRoutes = primaryPackageSlugs.map((slug) => ({ url: `${baseUrl}/packages/${slug}`, lastModified: PACKAGES_LASTMOD, changeFrequency: 'monthly' as const, priority: 0.9 }));
  const destinationRoutes = Object.keys(destinationsData)
    .filter((slug) => !EXCLUDED_DESTINATION_SLUGS.has(slug))
    .map((slug) => ({ url: `${baseUrl}/destinations/${slug}`, lastModified: DESTINATIONS_LASTMOD, changeFrequency: 'monthly' as const, priority: 0.85 }));
  const experienceRoutes = experiences.map((exp) => ({ url: `${baseUrl}/experiences/${exp.slug}`, lastModified: EXPERIENCES_LASTMOD, changeFrequency: 'weekly' as const, priority: 0.8 }));
  const blogRoutes = ALL_BLOGS.map((blog) => ({
    url: `${baseUrl}/blog/${blog.slug}`,
    lastModified: BLOG_LASTMOD,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));
  return [...staticRoutes, ...destinationRoutes, ...experienceRoutes, ...curatedPackageRoutes, ...blogRoutes];
}
