import type { Metadata } from "next";
import { siteConfig } from "@/data/siteConfig";

/**
 * Route-level metadata for /reviews. The page itself is a client component,
 * so title/description/OG tags must live here instead of in the page.
 */
export const metadata: Metadata = {
  title: "Customer Reviews | My Quick Trippers",
  description:
    "Read real traveler reviews and ratings for My Quick Trippers tour packages — verified experiences across India and beyond.",
  alternates: { canonical: `${siteConfig.domain}/reviews` },
  openGraph: {
    title: "Customer Reviews | My Quick Trippers",
    description:
      "Real experiences. Real travelers. Real journeys. See what travelers say about My Quick Trippers.",
    url: `${siteConfig.domain}/reviews`,
    type: "website",
    images: [
      {
        url: `${siteConfig.domain}/images/hero/hero-bg-2.svg`,
        width: 1200,
        height: 630,
        alt: "My Quick Trippers customer reviews",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Customer Reviews | My Quick Trippers",
    description:
      "Real experiences. Real travelers. Real journeys. See what travelers say about My Quick Trippers.",
    images: [`${siteConfig.domain}/images/hero/hero-bg-2.svg`],
  },
};

export default function ReviewsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
