import { MetadataRoute } from 'next';
import { siteConfig } from '@/data/siteConfig';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        // Keep indexable pages crawlable so Google can see their canonical
        // and robots directives. Blocking filter URLs here prevents that.
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/thank-you',
          '*.backup',
        ],
      },
      {
        // Allow GPTBot and other AI crawlers for better AI visibility
        userAgent: 'GPTBot',
        allow: '/',
      },
      {
        // Allow CCBot (Common Crawl — used by AI training datasets)
        userAgent: 'CCBot',
        allow: '/',
      },
      {
        // Allow Google-Extended (Gemini/Bard training data)
        userAgent: 'Google-Extended',
        allow: '/',
      },
    ],
    sitemap: `${siteConfig.domain}/sitemap.xml`,
    host: siteConfig.domain,
  };
}
