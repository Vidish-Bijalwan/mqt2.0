import { getPublicPackages } from "@/utils/packageCatalog";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import ThemePackageList from "@/components/special-tours/ThemePackageList";
import { themeConfigs } from "@/data/themeConfig";
import { siteConfig } from "@/data/siteConfig";
import { safeJsonLd } from "@/utils/jsonLd";
import { getApprovedPackageImage } from "@/data/packageLocationMedia";

// Map theme slugs to keywords (reuses shared config)
const THEME_KEYWORDS: Record<string, string[]> = {};
themeConfigs.forEach((t) => {
  THEME_KEYWORDS[t.name.toLowerCase()] = t.keywords;
});

export const dynamicParams = true;

export async function generateMetadata({ params }: { params: Promise<{ theme: string }> }) {
  const resolvedParams = await params;
  const theme = resolvedParams?.theme?.toLowerCase();

  if (!THEME_KEYWORDS[theme]) return { title: "Special Tours" };

  const displayTheme = theme.charAt(0).toUpperCase() + theme.slice(1);
  const title = `${displayTheme} Tour Packages`;
  const description = `Explore our handpicked ${theme} tour packages. Find the perfect itinerary for your next trip.`;
  const url = `${siteConfig.domain}/special-tours/${theme}`;
  const ogImage = `${siteConfig.domain}/images/hero/hero-bg-2.svg`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: "website",
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export default async function ThemePage({ params }: { params: Promise<{ theme: string }> }) {
  const resolvedParams = await params;
  const theme = resolvedParams?.theme?.toLowerCase();
  
  if (!theme || !THEME_KEYWORDS[theme]) {
    notFound();
  }

  const keywords = THEME_KEYWORDS[theme];

  // Filter packages based on keywords in title, category, or description
  const matchedPackages = getPublicPackages().filter(pkg => {
    const searchString = `${pkg.title} ${pkg.category} ${pkg.description}`.toLowerCase();
    return keywords.some(keyword => searchString.includes(keyword));
  });

  // Sort them so packages with explicit theme in title come first
  matchedPackages.sort((a, b) => {
    const aTitleMatch = a.title.toLowerCase().includes(theme) ? 1 : 0;
    const bTitleMatch = b.title.toLowerCase().includes(theme) ? 1 : 0;
    return bTitleMatch - aTitleMatch;
  });

  const displayTheme = theme.charAt(0).toUpperCase() + theme.slice(1);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${displayTheme} Tour Packages`,
    description: `Explore our handpicked ${theme} tour packages. Find the perfect itinerary for your next trip.`,
    url: `${siteConfig.domain}/special-tours/${theme}`,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: matchedPackages.map((pkg, i) => {
        const imageSrc = getApprovedPackageImage(pkg);
        const price = pkg.dealPrice || pkg.mrp;
        return {
          "@type": "ListItem",
          position: i + 1,
          item: {
            "@type": ["TouristTrip", "Product"],
            name: pkg.title,
            url: `${siteConfig.domain}/packages/${pkg.slug}`,
            image: `${siteConfig.domain}${imageSrc}`,
            ...(price
              ? {
                  offers: {
                    "@type": "Offer",
                    priceCurrency: "INR",
                    price: String(price),
                    availability: "https://schema.org/InStock",
                    url: `${siteConfig.domain}/packages/${pkg.slug}`,
                  },
                }
              : {}),
          },
        };
      }),
    },
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }} />
      {/* Breadcrumb */}
      <div className="bg-legacy-nav-blue text-white text-xs py-2 px-4">
        <div className="mx-auto w-[95%] max-w-[1600px] flex items-center">
          <Link href="/" className="hover:text-legacy-orange transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3 mx-1 opacity-70" />
          <Link href="/special-tours" className="hover:text-legacy-orange transition-colors">Special Tours</Link>
          <ChevronRight className="w-3 h-3 mx-1 opacity-70" />
          <span className="text-legacy-orange">{displayTheme} Packages</span>
        </div>
      </div>

      {/* Header */}
      <div className="bg-white border-b border-gray-200 py-8 mb-8">
        <div className="mx-auto w-[95%] max-w-[1600px]">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">{displayTheme} Tour Packages</h1>
          <p className="text-gray-600 max-w-3xl">
            Discover our curated collection of {matchedPackages.length} {displayTheme.toLowerCase()} packages. 
            Whether you are looking for a quick getaway or an extended vacation, we have the perfect itinerary for you.
          </p>
        </div>
      </div>

      {/* Content Layout — filters and sort are live (ThemePackageList) */}
      <div className="mx-auto w-[95%] max-w-[1600px]">
        <ThemePackageList
          packages={matchedPackages}
          images={Object.fromEntries(matchedPackages.map((pkg) => [pkg.slug, getApprovedPackageImage(pkg)]))}
          displayTheme={displayTheme}
        />
      </div>
    </div>
  );
}
