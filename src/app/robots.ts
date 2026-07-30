import { MetadataRoute } from 'next';
import { siteConfig } from '@/data/siteConfig';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        // Allow all well-behaved crawlers full access to indexable content
        userAgent: '*',
        allow: '/',
        disallow: [
          // Faceted navigation / filter params — avoid duplicate content
          '/*?filter=*',
          '/*?category=*',
          '/*?page=*',
          '/*?sort=*',
          '/*?search=*',
          '/*?q=*',
          '/*?tag=*',
          // API routes — not indexable
          '/api/',
          // Internal Next.js paths
          '/_next/',
          // Backup / draft files
          '*.backup',
        ],
      },
      {
        // Block GPTBot and other AI training scrapers
        userAgent: 'GPTBot',
        disallow: '/',
      },
      {
        // Block CCBot (Common Crawl — used by AI training datasets)
        userAgent: 'CCBot',
        disallow: '/',
      },
      {
        // Block Google-Extended (Gemini/Bard training data)
        userAgent: 'Google-Extended',
        disallow: '/',
      },
    ],
    sitemap: `${siteConfig.domain}/sitemap.xml`,
    host: siteConfig.domain,
  };
}
