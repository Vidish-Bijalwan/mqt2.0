import { allPackages } from "@/data/allPackages";
import { getPublicPackages, isPublicPackage } from "@/utils/packageCatalog";
import { notFound } from "next/navigation";
import type { CSSProperties } from "react";
import StickyMobileCTA from "@/components/ui/StickyMobileCTA";
import RelatedPackages from "@/components/ui/RelatedPackages";
import PackageHero from "@/components/packages/PackageHero";
import PackageTabSections from "@/components/packages/PackageTabSections";
import PackageEnquirySection from "@/components/packages/PackageEnquirySection";
import PackageSidebar from "@/components/packages/PackageSidebar";
import CommercialSection from "@/components/pricing/CommercialSection";
import PackageViewTracker from "@/components/packages/PackageViewTracker";
import { siteConfig } from "@/data/siteConfig";
import { getPackageLocationMedia, PACKAGE_MEDIA_PLACEHOLDER } from "@/data/packageLocationMedia";
import { cleanScrapedTitle, replaceReferenceBrand } from "@/utils/branding";
import { safeJsonLd } from "@/utils/jsonLd";
import {
  buildPackageJsonLd,
  buildPackageViewModel,
  detailsV2For,
  detailsV3For,
  packageDetails,
} from "@/utils/packageDetails";

export function generateStaticParams() {
  // Popular catalogue pages are linked from the home page and warm quickly.
  // Long-tail packages render on demand and are then cached by ISR, avoiding
  // hundreds of duplicated page artifacts in every deployment.
  return getPublicPackages().slice(0, 24).map((pkg) => ({ slug: pkg.slug }));
}

// ISR: revalidate daily so newly scraped/edited package content (V3 blocks,
// prices, routes) appears without a full 1,116-page rebuild on every deploy.
export const revalidate = 86400;

export const dynamicParams = true;

// Truncate at a word boundary so meta descriptions never cut mid-word.
function truncateAtWordBoundary(text: string, max = 160): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max);
  const lastSpace = cut.lastIndexOf(" ");
  return (lastSpace > 0 ? cut.slice(0, lastSpace) : cut).trim();
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const pkgV3 = detailsV3For(slug);
  const pkgV2 = detailsV2For(slug);
  const pkg = allPackages.find((candidate) => candidate.slug === slug);
  const legacyDetails = packageDetails[slug];
  // Detail records in packageDetails.json have been manually reviewed. The
  // remaining catalogue entries stay available to visitors, but are not
  // candidates for organic search until their copy is reviewed.
  const shouldIndex = Boolean(legacyDetails);
  if (pkg && !isPublicPackage(pkg)) return {};
  const socialImage = pkg
    ? new URL(getPackageLocationMedia(pkg)?.primary || PACKAGE_MEDIA_PLACEHOLDER, siteConfig.domain).toString()
    : `${siteConfig.domain}/logo/mqt-logo.png`;

  const seoSource = pkgV3?.seo || pkgV2?.seo;
  if (seoSource) {
    // Scraped SEO preserved, but sanitized: the reference site's brand name
    // and claims ("Namaste India Trip", "Ministry Approved") must never leak
    // into MQT titles/descriptions, and canonicals/OG URLs must point at MQT.
    const scrapedTitle = seoSource.page_title || seoSource.title;
    const og = seoSource.og_tags || {};
    const cleanTitle = (t: string | undefined | null) => pkg?.title || (t ? cleanScrapedTitle(t) : slug.replace(/-/g, ' '));
    const scrapedDescription = og['og:description'] ? replaceReferenceBrand(og['og:description']) : undefined;
    const pageDescription = scrapedDescription || (seoSource.meta_description ? replaceReferenceBrand(seoSource.meta_description) : undefined);
    const pageTitle = cleanTitle(og['og:title'] || scrapedTitle);
    return {
      title: cleanTitle(scrapedTitle),
      description: pageDescription,
      alternates: {
        canonical: `${siteConfig.domain}/packages/${slug}`,
      },
      robots: {
        index: shouldIndex,
        follow: true,
      },
      openGraph: {
        title: pageTitle,
        description: pageDescription,
        url: `${siteConfig.domain}/packages/${slug}`,
        type: 'website',
        images: [{ url: socialImage, alt: pageTitle }],
      },
      twitter: {
        card: 'summary_large_image',
        title: pageTitle,
        description: pageDescription,
        images: [socialImage],
      },
    };
  }

  // No brand suffix here — the layout title template ("%s | My Quick Trippers") appends it.
  const title = pkg ? pkg.title : slug.replace(/-/g, ' ').toUpperCase();
  const priceRaw = pkg ? (pkg.dealPrice || pkg.mrp || "") : "";
  const price = priceRaw.replace(/^[₹\s]+/, "");
  const hook = pkg?.description || legacyDetails?.overview || "";
  const templated = `${title}${pkg?.duration ? ` — ${pkg.duration}` : ""}${price ? `, from ₹${price}` : ""}${hook ? `. ${hook}` : ""}`;
  const description = truncateAtWordBoundary(templated);

  return {
    title,
    description,
    alternates: {
      canonical: `${siteConfig.domain}/packages/${slug}`,
    },
    robots: {
      index: shouldIndex,
      follow: true,
    },
    openGraph: {
      title,
      description,
      url: `${siteConfig.domain}/packages/${slug}`,
      type: 'website',
      images: [{ url: socialImage, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [socialImage],
    }
  };
}

export default async function PackageDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const pkg = allPackages.find((p) => p.slug === slug);

  if (!pkg || !isPublicPackage(pkg)) {
    notFound();
  }

  const vm = buildPackageViewModel(pkg);
  const jsonLd = buildPackageJsonLd(vm);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }} />
      {/* Sticky mobile CTA (U21) — price + call + WhatsApp + Send Query always visible */}
      <StickyMobileCTA price={vm.displayPrice} showPrice={vm.showPrice} packageName={pkg.title} />
      <PackageViewTracker slug={pkg.slug} category={pkg.category || "general"} />
      <div
        className="package-page-shell min-h-screen pb-24 font-sans lg:pb-16"
        style={{ "--package-backdrop": vm.galleryImages[0] ? `url(${vm.galleryImages[0]})` : "none" } as CSSProperties}
      >
        <PackageHero vm={vm} />

        <main className="mx-auto grid w-full max-w-[1320px] grid-cols-1 gap-7 px-4 lg:grid-cols-[minmax(0,1fr)_350px] lg:px-6">
          <div className="min-w-0 space-y-8">
            <PackageTabSections vm={vm} />

            {/* Commercial UI (value stack + tiers + offers) renders only for
                packages with a config in src/data/commercial/packages.ts. */}
            {vm.showPrice && (
              <CommercialSection
                slug={pkg.slug}
                packageTitle={pkg.title}
                publicPrice={vm.priceInfo.deal}
                crossedPrice={vm.crossedOutPrice}
              />
            )}

            <PackageEnquirySection pkgTitle={pkg.title} />
          </div>

          <PackageSidebar vm={vm} />
        </main>

        <div className="mx-auto w-full max-w-[1320px] px-4 lg:px-6">
          <RelatedPackages category={pkg.category || 'Trending'} currentSlug={pkg.slug} />
        </div>
      </div>
    </>
  );
}
