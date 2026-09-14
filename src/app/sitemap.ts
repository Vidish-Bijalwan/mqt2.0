import { MetadataRoute } from 'next';
import { siteConfig } from '@/data/siteConfig';
import { getPublicPackages } from '@/utils/packageCatalog';
import { experiences } from '@/data/experiencesData';
import packageDetailsRaw from '@/data/packageDetails.json';
import destinationsDataRaw from '@/data/destinationsData.json';
import fullBlogDataRaw from '@/data/fullBlogData.json';

const packageDetails = packageDetailsRaw as Record<string, unknown>;
const destinationsData = destinationsDataRaw as Record<string, unknown>;
const fullBlogData = fullBlogDataRaw as Record<string, unknown>;
const publicPackages = getPublicPackages();
const publicPackageSlugs = new Set(publicPackages.map((pkg) => pkg.slug));
const richPackageSlugs = new Set(Object.keys(packageDetails).filter((slug) => publicPackageSlugs.has(slug)));

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
  ].map(({ route, priority, freq }) => ({ url: `${baseUrl}${route}`, lastModified: new Date(), changeFrequency: freq, priority }));
  const richPackageRoutes = [...richPackageSlugs].map((slug) => ({ url: `${baseUrl}/packages/${slug}`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.9 }));
  const basicPackageRoutes = publicPackages.filter((pkg) => !richPackageSlugs.has(pkg.slug)).map((pkg) => ({ url: `${baseUrl}/packages/${pkg.slug}`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.6 }));
  const destinationRoutes = Object.keys(destinationsData).map((slug) => ({ url: `${baseUrl}/destinations/${slug}`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.85 }));
  const experienceRoutes = experiences.map((exp) => ({ url: `${baseUrl}/experiences/${exp.slug}`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.8 }));
  const blogRoutes = Object.keys(fullBlogData).filter((slug) => !slug.includes('__')).map((slug) => {
    const cleanSlug = slug.startsWith('blog__') ? slug.replace('blog__', '') : slug;
    return { url: `${baseUrl}/blog/${cleanSlug}`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.7 };
  });
  return [...staticRoutes, ...destinationRoutes, ...experienceRoutes, ...richPackageRoutes, ...basicPackageRoutes, ...blogRoutes];
}
