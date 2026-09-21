import type { Metadata } from "next";
import { siteConfig } from "@/data/siteConfig";

export const metadata: Metadata = {
  title: `${siteConfig.name} - Travel Blog, Destination Guides & Trip Ideas`,
  description:
    `Explore destination guides, practical travel tips, pilgrimage advice and trip inspiration from ${siteConfig.name}. Get expert insights on India tour packages, Himachal Tour Packages, Dubai Tour Packages, Chardham Yatra, Nainital holiday, Buddhist Tours India, Helicopter Tours India, Shimla honeymoon, Dehradun adventure and more.`,
  keywords: [
    "Travel blog India",
    "Destination guides India",
    "Travel tips India",
    "Pilgrimage advice",
    "Trip inspiration",
    "India travel blog",
    "Himachal travel guide",
    "Dubai travel tips",
    "Chardham Yatra guide",
    "Nainital travel blog",
    "Buddhist Tours India guide",
    "Helicopter Tours India tips",
    "Shimla honeymoon guide",
    "Dehradun adventure travel",
    "My Quick Trippers blog"
  ],
  alternates: {
    canonical: `${siteConfig.domain}/blog`,
  },
};

export default function BlogLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
