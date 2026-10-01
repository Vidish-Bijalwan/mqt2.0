import type { Metadata } from "next";
import { siteConfig } from "@/data/siteConfig";

/**
 * Route-level metadata for /reviews. The page is a server component;
 * title/description/OG tags live here.
 *
 * Copy is deliberately honest: no review counts or "verified experiences"
 * claims are made until genuine, verifiable traveller reviews exist.
 */
export const metadata: Metadata = {
  title: "Customer Reviews | My Quick Trippers",
  description:
    "How My Quick Trippers collects customer reviews: only verified feedback from real travellers, published with trip details. Travelled with us? Share your experience.",
  alternates: { canonical: `${siteConfig.domain}/reviews` },
  openGraph: {
    title: "Customer Reviews | My Quick Trippers",
    description:
      "Honest reviews from real travellers — how My Quick Trippers collects and publishes customer feedback.",
    url: `${siteConfig.domain}/reviews`,
    type: "website",
    images: [
      {
        url: `${siteConfig.domain}/images/og-default.png`,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "Customer Reviews | My Quick Trippers",
    description:
      "Honest reviews from real travellers — how My Quick Trippers collects and publishes customer feedback.",
  },
};

export default function ReviewsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
