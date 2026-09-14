import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Travel Blog, Destination Guides & Trip Ideas",
  description:
    "Explore destination guides, practical travel tips, pilgrimage advice and trip inspiration from My Quick Trippers.",
};

export default function BlogLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
