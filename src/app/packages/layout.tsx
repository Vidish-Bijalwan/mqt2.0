import type { Metadata } from "next";
import { siteConfig } from "@/data/siteConfig";

// Search and filter parameters refine the same catalogue; they must not
// create competing indexable package-listing URLs.
export const metadata: Metadata = {
  alternates: {
    canonical: `${siteConfig.domain}/packages`,
  },
};

export default function PackagesLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
