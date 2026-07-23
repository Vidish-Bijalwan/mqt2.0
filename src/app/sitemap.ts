import { MetadataRoute } from 'next';
import { siteConfig } from '@/data/siteConfig';
import packageDetailsRaw from '@/data/packageDetails.json';
import destinationsDataRaw from '@/data/destinationsData.json';
import fullBlogDataRaw from '@/data/fullBlogData.json';

const packageDetails = packageDetailsRaw as Record<string, any>;
const destinationsData = destinationsDataRaw as Record<string, any>;
const fullBlogData = fullBlogDataRaw as Record<string, any>;

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteConfig.domain;

  // Static core pages
  const staticRoutes = [
    '',
    '/packages',
    '/blog',
    '/about-us',
    '/contact-us',
    '/privacy-policy',
    '/terms-and-conditions',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  // Packages (121 genuine itineraries)
  const packageRoutes = Object.keys(packageDetails).map((slug) => ({
    url: `${baseUrl}/packages/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.9,
  }));

  // Destinations (87 rich guides)
  const destinationRoutes = Object.keys(destinationsData).map((slug) => ({
    url: `${baseUrl}/destinations/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.9,
  }));

  // Blogs (410 posts)
  const blogRoutes = Object.keys(fullBlogData).map((slug) => ({
    url: `${baseUrl}/blog/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [
    ...staticRoutes,
    ...destinationRoutes,
    ...packageRoutes,
    ...blogRoutes,
  ];
}
