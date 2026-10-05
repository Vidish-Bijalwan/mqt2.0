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
  };
}

// NOTE (2026-10-05): the llms.txt discovery comment could not be emitted
// from this file — Next 16's robots special-file pipeline only accepts a
// MetadataRoute.Robots object and crashes the build on a raw Response.
// /llms.txt is instead advertised via a <link> tag in the root layout head
// (the other standard llms.txt discovery mechanism) and is listed in the
// sitemap-adjacent docs. See src/app/layout.tsx.
