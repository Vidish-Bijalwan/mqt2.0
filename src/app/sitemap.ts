import { MetadataRoute } from 'next';
import { siteConfig } from '@/data/siteConfig';
import { allPackages } from '@/data/allPackages';
import { experiences } from '@/data/experiencesData';
import packageDetailsRaw from '@/data/packageDetails.json';
import destinationsDataRaw from '@/data/destinationsData.json';
import fullBlogDataRaw from '@/data/fullBlogData.json';

const packageDetails = packageDetailsRaw as Record<string, any>;
const destinationsData = destinationsDataRaw as Record<string, any>;
const fullBlogData = fullBlogDataRaw as Record<string, any>;

// Slugs that have rich itinerary details (our best pages — crawl budget priority)
const richPackageSlugs = new Set(Object.keys(packageDetails));

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteConfig.domain;

  // Static core pages
  const staticRoutes = [
    { route: '', priority: 1.0, freq: 'daily' as const },
    { route: '/packages', priority: 0.9, freq: 'daily' as const },
    { route: '/blog', priority: 0.8, freq: 'daily' as const },
    { route: '/about-us', priority: 0.8, freq: 'monthly' as const },
    { route: '/contact-us', priority: 0.8, freq: 'monthly' as const },
    { route: '/special-tours', priority: 0.8, freq: 'weekly' as const },
    // /india-tours and /international-tours 404/redirect — list the real destination pages
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
  ].map(({ route, priority, freq }) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: freq,
    priority,
  }));

  // Rich packages (121 full itineraries) — highest priority for crawl budget
  const richPackageRoutes = Object.keys(packageDetails).map((slug) => ({
    url: `${baseUrl}/packages/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.9,
  }));

  // Basic packages (rest of ~1,200) — lower priority, conserves crawl budget
  const basicPackageRoutes = allPackages
    .filter((pkg) => !richPackageSlugs.has(pkg.slug))
    .map((pkg) => ({
      url: `${baseUrl}/packages/${pkg.slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }));

  // Destination guides (high-value SEO landing pages)
  const destinationRoutes = Object.keys(destinationsData).map((slug) => ({
    url: `${baseUrl}/destinations/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.85,
  }));

  // Experience category pages (SEO landing pages)
  const experienceRoutes = experiences.map((exp) => ({
    url: `${baseUrl}/experiences/${exp.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // Blog posts (real posts only — excludes junk archive keys like travel-theme__*)
  const blogRoutes = Object.keys(fullBlogData)
    .filter((slug) => !slug.includes('__'))
    .map((slug) => {
      const cleanSlug = slug.startsWith('blog__') ? slug.replace('blog__', '') : slug;
      return {
        url: `${baseUrl}/blog/${cleanSlug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      };
    });

  return [
    ...staticRoutes,
    ...destinationRoutes,
    ...experienceRoutes,
    ...richPackageRoutes,
    ...basicPackageRoutes,
    ...blogRoutes,
  ];
}
