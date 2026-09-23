import { MetadataRoute } from 'next';
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
// Do not regenerate every URL's lastmod on request. A stable timestamp tells
// crawlers which URLs genuinely changed in this release.
const SITE_CONTENT_UPDATED_AT = new Date('2026-09-21T00:00:00.000Z');

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteConfig.domain;
  const staticRoutes = [
    { route: '', priority: 1.0, freq: 'daily' as const },
    { route: '/packages', priority: 0.9, freq: 'daily' as const },
    { route: '/blog', priority: 0.8, freq: 'daily' as const },
    { route: '/about-us', priority: 0.8, freq: 'monthly' as const },
    { route: '/contact-us', priority: 0.8, freq: 'monthly' as const },
    { route: '/special-tours', priority: 0.8, freq: 'weekly' as const },
    { route: '/destinations/india-tours', priority: 0.8, freq: 'weekly' as const },
    { route: '/destinations/international-tours', priority: 0.7, freq: 'weekly' as const },
    { route: '/customer-center', priority: 0.6, freq: 'monthly' as const },
    { route: '/reviews', priority: 0.5, freq: 'monthly' as const },
    { route: '/pay-online', priority: 0.6, freq: 'monthly' as const },
    { route: '/my-booking', priority: 0.5, freq: 'monthly' as const },
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
  ].map(({ route, priority, freq }) => ({ url: `${baseUrl}${route}`, lastModified: SITE_CONTENT_UPDATED_AT, changeFrequency: freq, priority }));
  const curatedPackageRoutes = [...curatedPackageSlugs].map((slug) => ({ url: `${baseUrl}/packages/${slug}`, lastModified: SITE_CONTENT_UPDATED_AT, changeFrequency: 'monthly' as const, priority: 0.9 }));
  const destinationRoutes = Object.keys(destinationsData).map((slug) => ({ url: `${baseUrl}/destinations/${slug}`, lastModified: SITE_CONTENT_UPDATED_AT, changeFrequency: 'monthly' as const, priority: 0.85 }));
  const experienceRoutes = experiences.map((exp) => ({ url: `${baseUrl}/experiences/${exp.slug}`, lastModified: SITE_CONTENT_UPDATED_AT, changeFrequency: 'weekly' as const, priority: 0.8 }));
  const blogRoutes = ALL_BLOGS.map((blog) => ({
    url: `${baseUrl}/blog/${blog.slug}`,
    lastModified: SITE_CONTENT_UPDATED_AT,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));
  return [...staticRoutes, ...destinationRoutes, ...experienceRoutes, ...curatedPackageRoutes, ...blogRoutes];
}
