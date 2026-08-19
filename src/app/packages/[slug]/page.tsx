import { allPackages } from "@/data/allPackages";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, Clock, MapPin, Phone, MessageCircleQuestion, HelpCircle, BookOpen, BadgePercent, XCircle } from "lucide-react";
import EnquiryForm from "@/components/forms/EnquiryForm";
import GalleryLightbox from "@/components/ui/GalleryLightbox";
import PackageTabs from "@/components/ui/PackageTabs";
import StickyMobileCTA from "@/components/ui/StickyMobileCTA";
import { getPriceInfo } from "@/utils/price";
import { cleanScrapedTitle, replaceReferenceBrand } from "@/utils/branding";
import ItineraryAccordion from "@/components/ui/ItineraryAccordion";
import PackageOverview from "@/components/ui/PackageOverview";
import TrustIndicators from "@/components/ui/TrustIndicators";
import RelatedPackages from "@/components/ui/RelatedPackages";
import BlockRenderer from "@/components/ui/BlockRenderer";
import PackageAtAGlance from "@/components/ui/PackageAtAGlance";
import ExpandableText from "@/components/ui/ExpandableText";
import { extractInclusions, extractExclusions, extractHighlights, stripLeadingJunk } from "@/utils/blocks";
import { siteConfig } from "@/data/siteConfig";
import fs from 'fs';
import path from 'path';

// Load the newly generated rich package details payload (Legacy)
let packageDetails: Record<string, any> = {};
try {
  const dataPath = path.join(process.cwd(), 'src/data/packageDetails.json');
  packageDetails = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
} catch (e) {
  // silently continue without V1 details
}

// Load V2 Package Details (Agent 3 output)
let packageDetailsV2: Record<string, any> = {};
try {
  const dataPathV2 = path.join(process.cwd(), 'src/data/packageDetailsV2.json');
  packageDetailsV2 = JSON.parse(fs.readFileSync(dataPathV2, 'utf-8'));
} catch (e) {
  // silently continue without V2 details
}

// Load V3 Package Details (clean, structured blocks regenerated from the
// scraped folder — junk chrome removed, lists/headings/images structured)
let packageDetailsV3: Record<string, any> = {};
try {
  const dataPathV3 = path.join(process.cwd(), 'src/data/packageDetailsV3.json');
  packageDetailsV3 = JSON.parse(fs.readFileSync(dataPathV3, 'utf-8'));
} catch (e) {
  // silently continue without V3 details
}

function detailsV2For(slug: string) {
  return packageDetailsV2[slug] || packageDetailsV2[`${slug}.html`] || packageDetailsV2[`${slug}.htm`];
}

function detailsV3For(slug: string) {
  return packageDetailsV3[slug];
}

function getFallbackImage(slug: string, category: string) {
  return `/images/packages/${slug}.jpg`;
}

export function generateStaticParams() {
  return allPackages.map((pkg) => ({ slug: pkg.slug }));
}

// ISR: revalidate daily so newly scraped/edited package content (V3 blocks,
// prices, routes) appears without a full 1,116-page rebuild on every deploy.
export const revalidate = 86400;

export const dynamicParams = true;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const pkgV3 = detailsV3For(slug);
  const pkgV2 = detailsV2For(slug);
  const pkg = packageDetails[slug] || allPackages.find(p => p.slug === slug);
  
  const seoSource = pkgV3?.seo || pkgV2?.seo;
  if (seoSource) {
    // Scraped SEO preserved, but sanitized: the reference site's brand name
    // and claims ("Namaste India Trip", "Ministry Approved") must never leak
    // into MQT titles/descriptions, and canonicals/OG URLs must point at MQT.
    const scrapedTitle = seoSource.page_title || seoSource.title;
    const og = seoSource.og_tags || {};
    const cleanTitle = (t: string | undefined | null) => (t ? cleanScrapedTitle(t) : pkg?.title || slug.replace(/-/g, ' '));
    return {
      title: cleanTitle(scrapedTitle),
      description: seoSource.meta_description ? replaceReferenceBrand(seoSource.meta_description) : undefined,
      alternates: {
        canonical: `${siteConfig.domain}/packages/${slug}`,
      },
      openGraph: {
        title: cleanTitle(og['og:title'] || scrapedTitle),
        description: og['og:description'] ? replaceReferenceBrand(og['og:description']) : undefined,
        url: `${siteConfig.domain}/packages/${slug}`,
        type: 'article',
        images: [{ url: `${siteConfig.domain}/api/og/${slug}`, width: 1200, height: 630 }],
      },
    };
  }

  // No brand suffix here — the layout title template ("%s | My Quick Trippers") appends it.
  const title = pkg ? pkg.title : slug.replace(/-/g, ' ').toUpperCase();
  const description = pkg?.overview?.substring(0, 160) || `Book the best ${title} with My Quick Trippers.`;

  return { 
    title,
    description,
    alternates: {
      canonical: `${siteConfig.domain}/packages/${slug}`,
    },
    openGraph: {
      title,
      description,
      url: `${siteConfig.domain}/packages/${slug}`,
      type: 'article',
      // Dynamically generated OG image — package photo + title (via /api/og/[slug])
      images: [{ url: `${siteConfig.domain}/api/og/${slug}`, width: 1200, height: 630, alt: title }],
    },
  };
}

export default async function PackageDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const pkg = allPackages.find((p) => p.slug === slug);
  
  if (!pkg) {
    notFound();
  }

  // Get rich details — V3 (clean) preferred, then V2, then legacy. Empty block
  // arrays (junk dropped by clean-package-blocks) must fall through.
  const detailsV3 = detailsV3For(pkg.slug);
  const detailsV2 = detailsV2For(pkg.slug);
  const details = packageDetails[pkg.slug] || { overview: '', highlights: [], itinerary: [], faqs: [] };
  // Only arrays with MEANINGFUL content count as blocks — stray contact-chrome
  // lists ("Live Chat / WhatsApp / Quick Enquiry"), "Coming Soon" stubs and
  // empty lists are scraped residue and must fall through (V3 preferred, then
  // V2, then legacy/description), landing on the honest empty state.
  const hasRealContent = (arr: any[] | undefined): boolean =>
    Array.isArray(arr) &&
    arr.some((b) => {
      if (b.type === 'table') return (b.rows || []).length > 0;
      if (b.type === 'image') return true;
      if (b.type === 'paragraph') {
        const t = (b.text || '').trim();
        return t.length > 60 && !/^(coming soon|under construction)/i.test(t);
      }
      if (b.type === 'heading') {
        const t = (b.text || '').trim();
        return t.length > 3 && !/live chat|whatsapp|quick enquiry|email us|coming soon/i.test(t);
      }
      if (b.type === 'list') {
        const items = (b.items || []).filter(Boolean);
        return (
          items.length > 0 &&
          !items.every((i: string) => /live chat|whatsapp|enquiry|email|phone|^\+\d/i.test(i))
        );
      }
      return false;
    });

  const blocks = hasRealContent(detailsV3?.blocks)
    ? detailsV3.blocks
    : hasRealContent(detailsV2?.blocks)
      ? detailsV2.blocks
      : null;
  const hasRealBlocks = !!blocks;

  // Extract FAQ pairs from V3 blocks early (used by both sections and JSON-LD)
  // Two formats:
  // 1. Structured faq block: { type: 'faq', items: [{ q, a }] }
  // 2. Legacy heading+paragraph: "Q1. ..." + "Ans. ..."
  const faqPairs: { q: string; a: string }[] = [];
  if (blocks) {
    for (let i = 0; i < blocks.length; i++) {
      const blk = blocks[i];
      if (blk.type === 'faq' && Array.isArray(blk.items)) {
        for (const item of blk.items) {
          if (item.q && item.a) faqPairs.push({ q: item.q, a: item.a });
        }
      } else if (blk.type === 'heading' && /^Q\d+\./i.test(blk.text || '')) {
        const answer = blocks[i + 1];
        if (answer?.type === 'paragraph' && /^Ans\./i.test(answer.text || '')) {
          faqPairs.push({
            q: (blk.text || '').replace(/\s*See More\s*$/i, '').trim(),
            a: (answer.text || '').replace(/^Ans\.\s*/i, '').trim(),
          });
        }
      }
    }
  }

  // Shared pricing model (D16/D17): pkg.mrp = list price, pkg.dealPrice = the deal.
  const priceInfo = getPriceInfo(pkg.mrp, pkg.dealPrice, pkg.slug);
  const displayPrice = priceInfo.display;
  const crossedOutPrice = priceInfo.crossed;
  const saveAmount = priceInfo.save;
  const showPrice = priceInfo.hasPrice;

  // Split blocks at the itinerary heading so Overview and Itinerary are separate
  // tabs. Itinerary starts at the "Day-by-Day Itinerary" wrapper OR the first
  // "Day N" heading (42 packages lack the wrapper). Everything before it is the
  // overview — never the scraped homepage junk (data pass removed it, and
  // stripLeadingJunk below is defense-in-depth).
  const itineraryHeadingIdx = blocks
    ? blocks.findIndex((b: any) => b.type === 'heading' && /(day-?by-?day itinerary|day-?wise|^day\s*\d)/i.test(b.text || ''))
    : -1;
  const hasItineraryBlocks = itineraryHeadingIdx >= 0;
  const overviewBlocks = blocks && hasItineraryBlocks ? blocks.slice(0, itineraryHeadingIdx) : blocks;
  const itineraryBlocks = blocks && hasItineraryBlocks ? blocks.slice(itineraryHeadingIdx) : [];

  // Reference-style Inclusions / Exclusions / Highlights extracted from blocks.
  const inclusions = blocks ? extractInclusions(blocks) : [];
  const exclusions = blocks ? extractExclusions(blocks) : [];
  const highlights =
    details.highlights.length > 0 ? details.highlights : blocks ? extractHighlights(blocks) : [];

  // Route start/end points — split on arrows (→), en/em dashes (– —) and commas,
  // then collapse consecutive repeats (each day ends where the next begins).
  const routePlaces = (pkg.route || '')
    .split(/[\u2192\u2013\u2014,>]/)
    .map(s => s.trim())
    .filter(Boolean);
  const uniqueRoutePlaces = routePlaces.filter((place, i) => place !== routePlaces[i - 1]);
  const startPoint = uniqueRoutePlaces[0] || 'Delhi';
  const endPoint = uniqueRoutePlaces[uniqueRoutePlaces.length - 1] || 'Delhi';
  const routeDisplay = uniqueRoutePlaces.join(' → ');

  const hasDuration = !!pkg.duration && pkg.duration.toLowerCase() !== "on request";
  const hasRouteInfo = !!routeDisplay && routeDisplay.toLowerCase() !== "on request";
  const hasStartPoint = !!startPoint && startPoint.toLowerCase() !== "on request";
  const hasEndPoint = !!endPoint && endPoint.toLowerCase() !== "on request";
  const hasQuickInfo = hasDuration || hasRouteInfo;

  // Tabbed sections — Overview / Itinerary / Highlights / FAQs (only the ones
  // with real content, matching the reference site's tab navigation).
  const sections = [
    {
      id: "overview",
      label: "Tour Overview",
      content: (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex items-center gap-3 px-6 md:px-8 py-4 border-b border-orange-100 bg-gradient-to-r from-orange-50/80 to-transparent">
            <div className="w-10 h-10 rounded-full bg-legacy-orange text-white flex items-center justify-center shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-gray-800">Tour Overview</h2>
              <p className="text-xs text-gray-500 mt-0.5">Everything you need to know about this trip</p>
            </div>
          </div>
          <div className="p-6 md:p-8">
            {/* Concise intro — the reference opens with a short paragraph */}
            {hasRealBlocks && pkg.description ? (
              <ExpandableText
                text={pkg.description}
                className="text-gray-700 leading-relaxed text-[15px]"
              />
            ) : null}
            {/* At a Glance fact strip (the reference's "Tour Gallery" table) */}
            <PackageAtAGlance
              duration={pkg.duration}
              routeDisplay={routeDisplay}
              startPoint={startPoint}
              endPoint={endPoint}
              category={pkg.category}
            />
            {hasRealBlocks ? (
              overviewBlocks.length > 0 ? (
                <div className="mt-6">
                  <BlockRenderer blocks={stripLeadingJunk(overviewBlocks)} truncate />
                </div>
              ) : (
                <p className="text-sm text-gray-500 italic mt-6">
                  This tour has a detailed day-by-day plan — see the{" "}
                  <span className="font-semibold text-gray-700">Itinerary</span> tab.
                </p>
              )
            ) : details.overview || pkg.description ? (
              <PackageOverview content={details.overview || pkg.description} packageTitle={pkg.title} />
            ) : (
              /* No overview content in the scrape — honest, useful empty state. */
              <div className="mt-6 rounded-lg border border-dashed border-gray-300 bg-gray-50/60 p-6 text-center">
                <p className="text-[15px] text-gray-600 leading-relaxed">
                  Detailed tour information for this package is shared on request.
                  Contact our travel experts for the complete itinerary, pricing, and inclusions.
                </p>
                <div className="mt-5 flex flex-wrap justify-center gap-3">
                  <a
                    href={`tel:${siteConfig.phoneRaw}`}
                    className="inline-flex items-center gap-2 bg-gray-900 text-white text-sm font-bold px-5 py-2.5 rounded-md hover:bg-gray-800 transition-colors"
                  >
                    <Phone className="w-4 h-4" /> Call {siteConfig.phone}
                  </a>
                  <a
                    href={siteConfig.social.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-[#25D366] text-white text-sm font-bold px-5 py-2.5 rounded-md hover:bg-[#1fb457] transition-colors"
                  >
                    Chat on WhatsApp
                  </a>
                  <a
                    href="#enquiry-form"
                    className="inline-flex items-center gap-2 bg-legacy-orange text-white text-sm font-bold px-5 py-2.5 rounded-md hover:bg-orange-700 transition-colors"
                  >
                    Send Query
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      ),
    },
    ...(itineraryBlocks.length > 0 ? [{
      id: "itinerary",
      label: "Itinerary",
      content: (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex items-center gap-3 px-6 md:px-8 py-4 border-b border-orange-100 bg-gradient-to-r from-orange-50/80 to-transparent">
            <div className="w-10 h-10 rounded-full bg-legacy-orange text-white flex items-center justify-center shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-gray-800">Tour Itinerary</h2>
              <p className="text-xs text-gray-500 mt-0.5">Day-by-day plan of your journey</p>
            </div>
          </div>
          <div className="p-6 md:p-8">
            <BlockRenderer blocks={itineraryBlocks} />
          </div>
        </div>
      ),
    }] : []),
    ...(!blocks && details.itinerary.length > 0 ? [{
      id: "itinerary",
      label: "Itinerary",
      content: (
        <div className="bg-white p-6 md:p-8 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center mb-6 pb-4 border-b border-gray-100">
            <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center mr-4">
              <MapPin className="text-legacy-orange w-5 h-5" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Tour Itinerary</h2>
          </div>
          <ItineraryAccordion itinerary={details.itinerary} />
        </div>
      ),
    }] : []),
    ...(inclusions.length > 0 || exclusions.length > 0 ? [{
      id: "includes",
      label: "Includes",
      content: (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex items-center gap-3 px-6 md:px-8 py-4 border-b border-orange-100 bg-gradient-to-r from-orange-50/80 to-transparent">
            <div className="w-10 h-10 rounded-full bg-legacy-orange text-white flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-gray-800">Inclusions & Exclusions</h2>
              <p className="text-xs text-gray-500 mt-0.5">What&apos;s covered and what&apos;s not</p>
            </div>
          </div>
          <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            {inclusions.length > 0 && (
              <div>
                <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wide mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500" /> Inclusions
                </h3>
                <ul className="space-y-2.5">
                  {inclusions.map((item: string, i: number) => (
                    <li key={i} className="flex items-start text-[14px] text-gray-600">
                      <CheckCircle2 className="w-4 h-4 mr-2.5 text-green-500 shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {exclusions.length > 0 && (
              <div>
                <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wide mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-gray-300" /> Exclusions
                </h3>
                <ul className="space-y-2.5">
                  {exclusions.map((item: string, i: number) => (
                    <li key={i} className="flex items-start text-[14px] text-gray-600">
                      <XCircle className="w-4 h-4 mr-2.5 text-gray-400 shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      ),
    }] : []),
    ...(highlights.length > 0 ? [{
      id: "highlights",
      label: "Highlights",
      content: (
        <div className="bg-white p-6 md:p-8 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center mb-6 pb-4 border-b border-gray-100">
            <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center mr-4">
              <CheckCircle2 className="text-legacy-orange w-5 h-5" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Tour Highlights</h2>
          </div>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {highlights.map((highlight: string, idx: number) => (
              <li key={idx} className="flex items-start text-[15px] text-gray-600">
                <CheckCircle2 className="w-5 h-5 mr-3 text-green-500 shrink-0 mt-0.5" />
                <span>{highlight}</span>
              </li>
            ))}
          </ul>
        </div>
      ),
    }] : []),
    ...((details.faqs && details.faqs.length > 0) || faqPairs.length > 0 ? [{
      id: "faqs",
      label: "FAQs",
      content: (
        <div className="bg-white p-6 md:p-8 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center mb-6 pb-4 border-b border-gray-100">
            <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center mr-4">
              <MessageCircleQuestion className="text-legacy-orange" size={20} />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-4">
            {(details.faqs && details.faqs.length > 0 ? details.faqs : faqPairs).map((faq: any, i: number) => (
              <div key={i} className="border border-gray-100 rounded-lg p-4 bg-gray-50/50">
                <h3 className="font-bold text-gray-800 mb-2 flex items-start gap-2">
                  <HelpCircle size={18} className="text-legacy-orange shrink-0 mt-1" />
                  {faq.q}
                </h3>
                <p className="text-gray-600 pl-7 text-sm leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      ),
    }] : []),
  ].filter((s) => s.content !== null);

  // Real gallery images: the package cover plus in-content images from the
  // cleaned blocks (deduped), so the photo grid shows actual photos instead
  // of gray placeholder boxes.
  const galleryImages: string[] = [
    pkg.image,
    ...(blocks || [])
      .filter((b: any) => b.type === 'image' && b.url)
      .map((b: any) => b.url),
  ].filter((url: string, idx: number, arr: string[]) => url && arr.indexOf(url) === idx).slice(0, 5);

  // Aligned captions for the lightbox (from block image captions)
  const blockCaptions = new Map<string, string>((blocks || []).filter((b: any) => b.type === 'image' && b.caption).map((b: any) => [b.url, b.caption]));
  const galleryCaptions: string[] = galleryImages.map((url: string) => blockCaptions.get(url) || '');

  let jsonLd = detailsV2?.seo?.json_ld ? detailsV2.seo.json_ld : {
    "@context": "https://schema.org",
    "@graph": [
    {
      "@type": ["TouristTrip", "Product"],
      "name": pkg.title,
      "description": details.overview || pkg.description || `Enjoy a wonderful trip: ${pkg.title}`,
      "image": `${siteConfig.domain}${getFallbackImage(slug, pkg.category)}`,
      "touristType": [
        "Leisure",
        "Family"
      ],
      ...(showPrice ? {
        "offers": {
          "@type": "Offer",
          "priceCurrency": "INR",
          "price": String(priceInfo.deal || priceInfo.mrp),
          "availability": "https://schema.org/InStock",
          "url": `${siteConfig.domain}/packages/${slug}`
        }
      } : {})
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": siteConfig.domain
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": pkg.category || "Packages",
          "item": `${siteConfig.domain}/packages?category=${encodeURIComponent(pkg.category || 'all')}`
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": pkg.title,
          "item": `${siteConfig.domain}/packages/${slug}`
        }
      ]
    }
  ]
  };

  if (!detailsV2?.seo?.json_ld) {
    if (details.faqs && details.faqs.length > 0) {
      jsonLd["@graph"].push({
        "@type": "FAQPage",
        "mainEntity": details.faqs.map((faq: any) => ({
          "@type": "Question",
          "name": faq.q,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": faq.a
          }
        }))
      });
    }
    // FAQPage schema from V3 blocks (S14)
    if (faqPairs.length > 0) {
      jsonLd["@graph"].push({
        "@type": "FAQPage",
        "mainEntity": faqPairs.map((f) => ({
          "@type": "Question",
          "name": f.q,
          "acceptedAnswer": { "@type": "Answer", "text": f.a },
        })),
      });
    }
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {/* Sticky mobile CTA (U21) — price + call + WhatsApp + Send Query always visible */}
      <StickyMobileCTA price={displayPrice} showPrice={showPrice} />
      <div className="bg-gray-50 min-h-screen pb-24 lg:pb-16 font-sans">
      
      {/* Breadcrumb Area */}
      <div className="bg-legacy-nav-blue text-white text-xs py-2 px-4 shadow-sm relative z-10">
        <div className="container mx-auto w-[95%] max-w-[1600px] flex items-center gap-2">
          <Link href="/" className="hover:text-legacy-orange">Home</Link>
          {" » "}
          {pkg.category && (
            <>
              <Link href={`/packages?category=${encodeURIComponent(pkg.category)}`} className="hover:text-legacy-orange">{pkg.category}</Link>
              {" » "}
            </>
          )}
          <span className="text-gray-300 truncate">{pkg.title}</span>
        </div>
      </div>

      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 w-[95%] max-w-[1600px] py-4 md:py-6">
           <h1 className="text-2xl md:text-3xl font-bold text-gray-800">{pkg.title}</h1>
           <p className="text-sm text-gray-500 mt-1">{pkg.duration || ''} {pkg.route ? '· ' + pkg.route.split(/[\u2192\u2013\u2014,>]/)[0].trim() : ''}</p>
           {/* Duplicate breadcrumbs removed per UX audit */}
        </div>
      </div>

      <div className="container mx-auto px-4 w-[95%] max-w-[1600px] mt-6">
        
        {/* Photo Gallery Grid — real images from package cover + content */}
        {galleryImages.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-8 rounded-lg overflow-hidden shadow-sm">
            <div className="col-span-2 row-span-2 relative h-[260px] md:h-[450px] group">
              <Image src={galleryImages[0]} alt={pkg.title} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover transition-transform duration-700 group-hover:scale-105" priority />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
            </div>
            {galleryImages.slice(1, 4).map((img, idx) => (
              <div key={idx} className={`relative h-[130px] md:h-[222px] group ${idx >= 2 ? 'hidden md:block' : ''}`}>
                <Image src={img} alt={`${pkg.title} — Photo ${idx + 1}`} fill sizes="(max-width: 768px) 50vw, 25vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
              </div>
            ))}
            {/* 5th tile — View All Photos overlay */}
            <div className="relative h-[130px] md:h-[222px] group overflow-hidden bg-gray-900/60">
              {galleryImages[4] ? (
                <Image src={galleryImages[4]} alt={`${pkg.title} — Photo 4`} fill sizes="25vw" className="object-cover opacity-60 group-hover:opacity-40 transition-opacity" />
              ) : (
                <Image src={galleryImages[0]} alt={pkg.title} fill sizes="25vw" className="object-cover opacity-40" />
              )}
              <div className="absolute inset-0 flex items-center justify-center">
                <GalleryLightbox images={galleryImages} title={pkg.title} captions={galleryCaptions} />
              </div>
            </div>
          </div>
        )}

        {/* Trust Indicators (Social Proof alternative) */}
        <TrustIndicators category={pkg.category} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Left Content — tabbed sections like the reference */}
          <div className="lg:col-span-2 space-y-8">
            <PackageTabs sections={sections} />

            {/* Enquiry form — always visible so #enquiry-form anchors keep working */}
            <div id="enquiry-form" className="bg-legacy-nav-blue text-white rounded-lg shadow-lg overflow-hidden scroll-mt-24">
               <div className="p-6 md:p-8 text-center border-b border-white/10">
                  <h2 className="text-xl md:text-2xl font-bold mb-2">Plan Your Perfect Holiday!</h2>
                  <p className="text-blue-100 text-sm">Fill out the form below and get an affordable itinerary within hours.</p>
               </div>
               <div className="p-6 bg-white text-gray-800">
                  <EnquiryForm pkgName={pkg.title} />
               </div>
            </div>

            {/* Value Props */}
            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
               <div>
                  <div className="w-16 h-16 mx-auto bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-4 text-2xl">🛡️</div>
                  <h4 className="font-bold text-gray-800 mb-2">Hassle-Free Booking</h4>
                  <p className="text-sm text-gray-500">Enjoy low deposits, flexible cancellation options, and personalized support.</p>
               </div>
               <div>
                  <div className="w-16 h-16 mx-auto bg-green-50 text-green-500 rounded-full flex items-center justify-center mb-4 text-2xl">✨</div>
                  <h4 className="font-bold text-gray-800 mb-2">Lifelong Memories</h4>
                  <p className="text-sm text-gray-500">Curated trips offering the perfect balance of exploration and relaxation.</p>
               </div>
               <div>
                  <div className="w-16 h-16 mx-auto bg-orange-50 text-orange-500 rounded-full flex items-center justify-center mb-4 text-2xl">🤝</div>
                  <h4 className="font-bold text-gray-800 mb-2">Trusted Companion</h4>
                  <p className="text-sm text-gray-500">Join millions of travelers who have trusted us to help them discover the world.</p>
               </div>
            </div>
          </div>

          {/* Sticky Right Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
               
               {/* Price Card */}
               <div className="bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden">
                  <div className="p-6">
                     <div className="flex justify-between items-start mb-2">
                        <div>
                           <p className="text-sm text-gray-500 font-medium uppercase tracking-wide">Starting from</p>
                           <div className="text-3xl font-bold text-gray-900 mt-1">
                              {showPrice ? <>INR {displayPrice}</> : "Contact for Price"}
                           </div>
                           {crossedOutPrice && (
                              <div className="flex items-center gap-2 mt-1.5">
                                 <span className="text-sm text-gray-400 line-through">INR {crossedOutPrice}</span>
                                 <span className="bg-legacy-orange text-white text-[11px] font-bold px-2 py-0.5 rounded-sm inline-flex items-center gap-1">
                                    <BadgePercent className="w-3 h-3" /> SAVE INR {saveAmount}
                                 </span>
                              </div>
                           )}
                           <p className="text-xs text-gray-400 mt-1.5">Starting Price Per Adult</p>
                        </div>
                     </div>

                     {/* Quick Information */}
                     {hasQuickInfo && (
                       <div className="mt-6 pt-6 border-t border-gray-100">
                          <p className="text-xs font-bold text-gray-800 uppercase tracking-wide mb-3">Quick Information</p>
                          <div className="space-y-2.5 text-sm">
                             {hasDuration && (
                                <div className="flex justify-between items-center gap-4">
                                   <span className="text-gray-500 flex items-center shrink-0"><Clock className="w-4 h-4 mr-2" /> Duration</span>
                                   <span className="font-semibold text-gray-800 text-right">{pkg.duration}</span>
                                </div>
                             )}
                             {hasRouteInfo && (
                                <>
                                   {hasStartPoint && (
                                     <div className="flex justify-between items-center gap-4">
                                        <span className="text-gray-500 flex items-center shrink-0"><MapPin className="w-4 h-4 mr-2" /> Starting Point</span>
                                        <span className="font-semibold text-gray-800 text-right capitalize">{startPoint}</span>
                                     </div>
                                   )}
                                   {hasEndPoint && (
                                     <div className="flex justify-between items-center gap-4">
                                        <span className="text-gray-500 flex items-center shrink-0"><MapPin className="w-4 h-4 mr-2" /> Ending Point</span>
                                        <span className="font-semibold text-gray-800 text-right capitalize">{endPoint}</span>
                                     </div>
                                   )}
                                   <div className="flex justify-between items-center gap-4">
                                      <span className="text-gray-500 flex items-center shrink-0"><MapPin className="w-4 h-4 mr-2" /> Places Covered</span>
                                      <span className="font-semibold text-gray-800 text-right capitalize">{routeDisplay}</span>
                                   </div>
                                </>
                             )}
                          </div>
                       </div>
                     )}

                     {/* What's Included — real data from the package blocks, never fabricated */}
                     {inclusions.length > 0 && (
                        <div className="mt-6 pt-6 border-t border-gray-100">
                           <p className="text-xs font-bold text-gray-800 uppercase tracking-wide mb-3">What&apos;s Included</p>
                           <div className="space-y-2 text-sm text-gray-600">
                              {inclusions.slice(0, 6).map((inc: string, i: number) => (
                                 <div key={i} className="flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" /> {inc}
                                 </div>
                              ))}
                              {inclusions.length > 6 && (
                                 <div className="text-xs text-gray-400">+ {inclusions.length - 6} more in the Includes tab</div>
                              )}
                           </div>
                        </div>
                     )}

                     {/* Price Breakdown */}
                     <div className="mt-6 pt-6 border-t border-gray-100">
                        <details className="group">
                           <summary className="text-xs font-bold text-legacy-orange uppercase tracking-wide mb-2 cursor-pointer list-none flex justify-between items-center">
                              <span>View Price Details</span>
                              <span className="transition group-open:rotate-180">▼</span>
                           </summary>
                           <div className="space-y-2 text-sm text-gray-600 mt-3 pl-1">
                              <div className="flex justify-between font-bold text-gray-900 border-t border-gray-100 pt-2"><span>Total per adult</span> <span>{showPrice ? `INR ${displayPrice}` : "Contact for Price"}</span></div>
                              <p className="text-xs text-gray-400">Full price breakup (hotels, meals, transport, taxes) is shared on request.</p>
                           </div>
                        </details>
                     </div>

                     <div className="mt-8 space-y-3">
                        <a href="#enquiry-form" className="w-full block text-center bg-[#2e9e4f] hover:bg-[#278a45] text-white font-bold py-3 rounded-md transition-colors shadow-md">
                           Send Query
                        </a>
                     </div>
                  </div>
               </div>

               {/* Need Help Card */}
               <div className="bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden">
                  <div className="p-6">
                     <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                        <Phone className="w-5 h-5 text-legacy-orange" /> Need help? Get more information
                     </h3>
                     <p className="text-sm text-gray-500 mb-4">
                        Kindly feel free to ask our travel experts for details on pricing, itineraries and more.
                     </p>
                     <div className="flex flex-col gap-2">
                        <a href={`tel:${siteConfig.phoneRaw}`} className="w-full block text-center bg-gray-900 text-white font-bold py-2.5 rounded-md hover:bg-gray-800 transition-colors">
                           Call {siteConfig.phone}
                        </a>
                        <a
                          href={siteConfig.social.whatsapp}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full block text-center bg-[#25D366] text-white font-bold py-2.5 rounded-md hover:bg-[#1fb457] transition-colors"
                        >
                          Chat on WhatsApp
                        </a>
                     </div>
                  </div>
               </div>

            </div>
          </div>

        </div>
        
        <RelatedPackages category={pkg.category || 'Trending'} currentSlug={pkg.slug} />
      </div>
    </div>
    </>
  );
}
