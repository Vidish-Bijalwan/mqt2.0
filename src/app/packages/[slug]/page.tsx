import { allPackages } from "@/data/allPackages";
import { getPublicPackages, getTourDays, isPublicPackage } from "@/utils/packageCatalog";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BadgePercent, Check, CheckCircle2, Clock, MapPin, MessageCircle, Phone, X } from "lucide-react";
import EnquiryForm from "@/components/forms/EnquiryForm";
import GalleryLightbox from "@/components/ui/GalleryLightbox";
import PackageTabs from "@/components/ui/PackageTabs";
import StickyMobileCTA from "@/components/ui/StickyMobileCTA";
import { getPriceInfo } from "@/utils/price";
import { cleanScrapedTitle, replaceReferenceBrand } from "@/utils/branding";
import ItineraryAccordion from "@/components/ui/ItineraryAccordion";
import RelatedPackages from "@/components/ui/RelatedPackages";
import BlockRenderer from "@/components/ui/BlockRenderer";
import ExpandableText from "@/components/ui/ExpandableText";
import { extractInclusions, extractExclusions, extractHighlights } from "@/utils/blocks";
import type { Block, FaqItem } from "@/utils/blocks";
import { siteConfig } from "@/data/siteConfig";
import { packageExperienceOverrides } from "@/data/packageExperienceOverrides";
import { getPackageLocationMedia, packageLocationMedia, PACKAGE_MEDIA_PLACEHOLDER } from "@/data/packageLocationMedia";
import fs from 'fs';
import path from 'path';
import type { CSSProperties } from "react";
import { IMAGE_SKELETON } from "@/utils/imagePlaceholder";

interface LegacyPackageDetails {
  overview: string;
  highlights: string[];
  itinerary: Array<{ title: string; description: string }>;
  faqs: FaqItem[];
}

interface JsonLdNode {
  "@type": string | string[];
  [key: string]: unknown;
}

interface JsonLdDocument {
  "@context"?: string;
  "@graph": JsonLdNode[];
  [key: string]: unknown;
}

interface RichPackageDetails {
  blocks?: Block[];
  seo?: {
    page_title?: string;
    title?: string;
    meta_description?: string;
    og_tags?: Record<string, string>;
    json_ld?: JsonLdDocument;
  };
}

function loadDetailFile<T>(filename: string): Record<string, T> {
  try {
    // Whitelist allowed filenames to prevent path traversal
    const allowedFiles = ['packageDetails.json', 'packageDetailsV2.json', 'packageDetailsV3.json'];
    if (!allowedFiles.includes(filename)) {
      return {};
    }
    
    const dataPath = path.join(process.cwd(), 'src/data', filename);
    const normalizedPath = path.normalize(dataPath);
    
    // Ensure path stays within src/data directory
    const srcDataPath = path.normalize(path.join(process.cwd(), 'src/data'));
    if (!normalizedPath.startsWith(srcDataPath)) {
      return {};
    }
    
    return JSON.parse(fs.readFileSync(normalizedPath, 'utf-8')) as Record<string, T>;
  } catch {
    return {};
  }
}

const packageDetails = loadDetailFile<LegacyPackageDetails>('packageDetails.json');
const packageDetailsV2 = loadDetailFile<RichPackageDetails>('packageDetailsV2.json');
const packageDetailsV3 = loadDetailFile<RichPackageDetails>('packageDetailsV3.json');
const knownLocalImageUrls = new Set([
  ...Object.values(packageLocationMedia).flatMap((media) => [media.primary, ...media.gallery.map((item) => item.src)]),
]);

function detailsV2For(slug: string) {
  return packageDetailsV2[slug] || packageDetailsV2[`${slug}.html`] || packageDetailsV2[`${slug}.htm`];
}

function detailsV3For(slug: string) {
  return packageDetailsV3[slug];
}

const blockText = (block: Block) => String(block.text || block.content || '').trim();

function cleanDisplayText(value: string) {
  return replaceReferenceBrand(String(value || ''))
    .replace(/\*\*/g, '')
    .replace(/\bSee More\b|\bSee Less\b/gi, '')
    .replace(/Places You[’']ll See/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function cleanOverviewText(value: string) {
  const beforeRepeatedCopy = String(value || '').split(/\bSee Less\b/i)[0];
  const beforeHighlights = beforeRepeatedCopy.split(/\bTour Highlights\b/i)[0];
  return cleanDisplayText(beforeHighlights);
}

function resolveLocalPackageImage(candidate?: string): string | null {
  if (!candidate) return null;

  if (candidate === PACKAGE_MEDIA_PLACEHOLDER) return candidate;

  const publicPath = candidate.trim();
  if (!publicPath.startsWith('/images/') || /\.(svg|gif)$/i.test(publicPath)) return null;
  return knownLocalImageUrls.has(publicPath) ? publicPath : null;
}

function sanitizeItineraryBlocks(items: Block[]): Block[] {
  const result: Block[] = [];
  let skipAuxiliary = false;

  for (const block of items) {
    const text = block.type === 'list'
      ? (block.items || []).filter((item): item is string => typeof item === 'string').join(' ')
      : `${blockText(block)} ${block.alt || ''}`;
    const isDayHeading = block.type === 'heading' && /^day\s*[-:]?\s*\d/i.test(blockText(block));

    if (isDayHeading) {
      skipAuxiliary = false;
      result.push(block);
      continue;
    }
    if (block.type === 'heading' && /places you[’']ll see/i.test(blockText(block))) {
      skipAuxiliary = true;
      continue;
    }
    if (/best price|coupon code|response time|response rate|discuss on whatsapp|no hidden charges|people are considering|price guarantee/i.test(text)) {
      skipAuxiliary = true;
      continue;
    }
    if (!skipAuxiliary && block.type !== 'image') result.push(block);
  }


  return result;
}

function isDayHeading(block: Block) {
  return block.type === 'heading' && /^day\s*[-:]?\s*\d/i.test(blockText(block));
}

function hasRenderableScrapedItinerary(items: Block[]) {
  let withinDay = false;
  let dayHasContent = false;

  for (const block of items) {
    if (isDayHeading(block)) {
      if (withinDay && dayHasContent) return true;
      withinDay = true;
      dayHasContent = false;
      continue;
    }

    if (!withinDay || block.type === 'heading') continue;
    if (block.type === 'list' && (block.items || []).some((item) => typeof item === 'string' && item.trim())) {
      dayHasContent = true;
    } else if (block.type === 'faq' && (block.items || []).length > 0) {
      dayHasContent = true;
    } else if (block.type === 'table' && (block.rows || []).length > 0) {
      dayHasContent = true;
    } else if (block.type === 'paragraph' && blockText(block).length > 0) {
      dayHasContent = true;
    }
  }

  return withinDay && dayHasContent;
}

function buildSuggestedItinerary(title: string, duration: string, routePlaces: string[], sourceDayTitles: string[] = []) {
  const dayCount = Math.max(3, getTourDays(duration, title) || routePlaces.length || 3, sourceDayTitles.length);
  const subject = title.replace(/\s*(tour|package|holiday|yatra).*/i, "").trim() || "your destination";
  const stops = routePlaces.length > 0 ? routePlaces : [subject];

  return Array.from({ length: dayCount }, (_, index) => {
    const day = index + 1;
    const stopIndex = Math.min(stops.length - 1, Math.floor((index / Math.max(1, dayCount - 1)) * stops.length));
    const stop = stops[stopIndex];
    const sourceTitle = sourceDayTitles[index]
      ?.replace(/^day\s*[-:]?\s*\d+\s*[:.\-]?\s*/i, '')
      .trim();
    const dayTitle = sourceTitle || (day === 1
      ? `Arrival and welcome in ${stop}`
      : day === dayCount
        ? `Departure from ${stop}`
        : `Explore ${stop}`);
    const previousStop = stops[Math.max(0, Math.min(stops.length - 1, stopIndex - 1))];

    if (day === 1) {
      return { title: dayTitle, description: `Arrive in ${stop} and settle into the journey at an unhurried pace. The first travel window is coordinated around your confirmed arrival, then the day stays intentionally light: time to check in, get your bearings, and talk through the route ahead with the travel team. Keep the evening open for rest so the next morning begins comfortably.` };
    }
    if (day === dayCount) {
      return { title: dayTitle, description: `Begin with breakfast and a calm final check-out. Your onward transfer is planned around your confirmed departure, with any short stop kept strictly time-permitting. It is a considered finish to the ${subject} journey—enough room to travel smoothly without rushing the last morning or promising experiences that depend on road, weather, or access conditions.` };
    }
    if (previousStop !== stop) {
      return { title: dayTitle, description: `After breakfast, continue from ${previousStop} towards ${stop}, treating the journey itself as part of the day rather than a gap between sights. The route is paced with sensible pauses for comfort, meals, and changing conditions. Once you arrive, settle in and use the later part of the day for the local atmosphere or a gentle orientation, with the exact sequence confirmed for your dates.` };
    }
    return { title: dayTitle, description: `This is a fuller day around ${stop}. Start at a comfortable morning pace, leaving room for the experiences that make this stop worthwhile as well as breaks for meals and rest. The travel team shapes the order around seasonal access, local timing, and how active you want the day to feel—so it reads as a real holiday, not a race through a checklist.` };
  });
}

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

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const pkgV3 = detailsV3For(slug);
  const pkgV2 = detailsV2For(slug);
  const pkg = allPackages.find((candidate) => candidate.slug === slug);
  const legacyDetails = packageDetails[slug];
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
        images: [{ url: socialImage, alt: cleanTitle(og['og:title'] || scrapedTitle) }],
      },
    };
  }

  // No brand suffix here — the layout title template ("%s | My Quick Trippers") appends it.
  const title = pkg ? pkg.title : slug.replace(/-/g, ' ').toUpperCase();
  const description = legacyDetails?.overview?.substring(0, 160) || pkg?.description || `Book the best ${title} with My Quick Trippers.`;

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

  const experienceOverride = packageExperienceOverrides[pkg.slug];

  // Get rich details — V3 (clean) preferred, then V2, then legacy. Empty block
  // arrays (junk dropped by clean-package-blocks) must fall through.
  const detailsV3 = detailsV3For(pkg.slug);
  const detailsV2 = detailsV2For(pkg.slug);
  const details: LegacyPackageDetails = packageDetails[pkg.slug] || { overview: '', highlights: [], itinerary: [], faqs: [] };
  // Only arrays with MEANINGFUL content count as blocks — stray contact-chrome
  // lists ("Live Chat / WhatsApp / Quick Enquiry"), "Coming Soon" stubs and
  // empty lists are scraped residue and must fall through (V3 preferred, then
  // V2, then legacy/description), landing on the honest empty state.
  const hasRealContent = (arr: Block[] | undefined): boolean =>
    Array.isArray(arr) &&
    arr.some((b) => {
      if (b.type === 'table') return (b.rows || []).length > 0;
      if (b.type === 'image') return true;
      if (b.type === 'paragraph') {
        const t = blockText(b);
        return t.length > 60 && !/^(coming soon|under construction)/i.test(t);
      }
      if (b.type === 'heading') {
        const t = blockText(b);
        return t.length > 3 && !/live chat|whatsapp|quick enquiry|email us|coming soon/i.test(t);
      }
      if (b.type === 'list') {
        const items = (b.items || []).filter((item): item is string => typeof item === 'string' && Boolean(item));
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

  const hasItinerarySection = (items: Block[] | null | undefined) =>
    Boolean(items?.some((block) =>
      block.type === 'heading' &&
      /(day-?by-?day itinerary|day-?wise itinerary|tour itinerary|^day\s*[-:]?\s*\d)/i.test(blockText(block)),
    ));
  const itinerarySourceBlocks = hasItinerarySection(blocks)
    ? blocks
    : hasItinerarySection(detailsV2?.blocks)
      ? detailsV2?.blocks || null
      : blocks;

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
          if (typeof item !== 'string' && item.q && item.a) faqPairs.push({ q: item.q, a: item.a });
        }
      } else if (blk.type === 'heading' && /^Q\d+\./i.test(blockText(blk))) {
        const answer = blocks[i + 1];
        if (answer?.type === 'paragraph' && /^Ans\./i.test(blockText(answer))) {
          faqPairs.push({
            q: blockText(blk).replace(/\s*See More\s*$/i, '').trim(),
            a: blockText(answer).replace(/^Ans\.\s*/i, '').trim(),
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
  const packageWhatsappUrl = `${siteConfig.social.whatsapp}?text=${encodeURIComponent(
    `Hello My Quick Trippers, I am interested in the ${pkg.title}. Please share the available dates and a tailored quote.`,
  )}`;

  // Section boundaries must support both V2 `text` and V3 `content` headings.
  // Without the end boundary, FAQs and related-tour copy leak into the itinerary.
  const itineraryWrapperIdx = itinerarySourceBlocks
    ? itinerarySourceBlocks.findIndex((b) => b.type === 'heading' && /(day-?by-?day itinerary|day-?wise itinerary|tour itinerary)/i.test(blockText(b)))
    : -1;
  const firstDayIdx = itinerarySourceBlocks
    ? itinerarySourceBlocks.findIndex((b) => b.type === 'heading' && /^day\s*[-:]?\s*\d/i.test(blockText(b)))
    : -1;
  const itineraryStartIdx = firstDayIdx >= 0 ? firstDayIdx : itineraryWrapperIdx >= 0 ? itineraryWrapperIdx + 1 : -1;
  const itineraryEndIdx = itinerarySourceBlocks && itineraryStartIdx >= 0
    ? itinerarySourceBlocks.findIndex((b, index) =>
        index > itineraryStartIdx &&
        b.type === 'heading' &&
        /(frequently asked|faqs?|related tour|inclusions?|exclusions?|highlights?)/i.test(blockText(b)),
      )
    : -1;
  const itineraryBlocks = itinerarySourceBlocks && itineraryStartIdx >= 0
    ? itinerarySourceBlocks.slice(itineraryStartIdx, itineraryEndIdx > itineraryStartIdx ? itineraryEndIdx : itinerarySourceBlocks.length)
    : [];
  const safeItineraryBlocks = sanitizeItineraryBlocks(itineraryBlocks);

  // Reference-style Inclusions / Exclusions / Highlights extracted from blocks.
  const cleanList = (items: string[]) => Array.from(new Set(
    (items || []).map(cleanDisplayText).filter((item) => item.length > 2 && !/^see (more|less)$/i.test(item)),
  ));
  const inclusions = cleanList(blocks ? extractInclusions(blocks) : []);
  const exclusions = cleanList(blocks ? extractExclusions(blocks) : []);
  const highlights = cleanList(
    experienceOverride?.highlights?.length
      ? experienceOverride.highlights
      : details.highlights.length > 0
        ? details.highlights
        : blocks
          ? extractHighlights(blocks)
          : [],
  ).slice(0, 8);

  const overviewBoundary = (blocks || []).findIndex((block) =>
    block.type === 'heading' && /(day-?by-?day itinerary|day-?wise itinerary|tour itinerary|^day\s*[-:]?\s*\d)/i.test(blockText(block)),
  );
  const overviewParagraphs = (blocks || [])
    .slice(0, overviewBoundary >= 0 ? overviewBoundary : blocks?.length)
    .filter((b) => b.type === 'paragraph')
    .map((b) => cleanDisplayText(blockText(b)))
    .filter((text: string) => text.length > 80 && !/related tour packages/i.test(text));
  const overviewText = cleanOverviewText(
    experienceOverride?.overview || details.overview || overviewParagraphs.join(' ') || pkg.description,
  );

  // Route start/end points — split on arrows (→), en/em dashes (– —) and commas,
  // then collapse consecutive repeats (each day ends where the next begins).
  const routePlaces = experienceOverride?.route?.length
    ? experienceOverride.route
    : (pkg.route || '')
        .split(/[\u2192\u2013\u2014,>]/)
        .map(s => s.trim())
        .filter(Boolean);
  const uniqueRoutePlaces = routePlaces.filter((place, i) => place !== routePlaces[i - 1]);
  const startPoint = uniqueRoutePlaces[0] || '';
  const endPoint = uniqueRoutePlaces[uniqueRoutePlaces.length - 1] || '';
  const routeDisplay = uniqueRoutePlaces.join(' → ');
  const journeyStops = uniqueRoutePlaces.slice(0, 10);

  const hasDuration = !!pkg.duration && pkg.duration.toLowerCase() !== "on request";
  const hasRouteInfo = !!routeDisplay && routeDisplay.toLowerCase() !== "on request";
  const hasStartPoint = !!startPoint && startPoint.toLowerCase() !== "on request";
  const hasEndPoint = !!endPoint && endPoint.toLowerCase() !== "on request";
  const hasQuickInfo = hasDuration || hasRouteInfo;
  const legacyItinerary = details.itinerary.filter((day) => day.description.trim().length >= 20);
  const hasLegacyItinerary = legacyItinerary.length > 0;
  // A heading-only scrape is not a usable itinerary. It previously entered
  // BlockRenderer and produced its empty-state message despite valid route/day
  // titles being available. Require content inside at least one day first.
  const hasScrapedItinerary = hasRenderableScrapedItinerary(safeItineraryBlocks);
  const sourceDayTitles = safeItineraryBlocks
    .filter(isDayHeading)
    .map(blockText)
    .filter(Boolean);
  const fallbackDayTitles = sourceDayTitles.length > 0
    ? sourceDayTitles
    : details.itinerary.map((day) => day.title).filter(Boolean);
  const editorialItinerary = packageExperienceOverrides[pkg.slug]?.itinerary || [];
  const suggestedItinerary = !hasLegacyItinerary && !hasScrapedItinerary
    ? editorialItinerary.length > 0
      ? editorialItinerary
      : buildSuggestedItinerary(pkg.title, pkg.duration, uniqueRoutePlaces, fallbackDayTitles)
    : [];
  const allFaqs = details.faqs && details.faqs.length > 0 ? details.faqs : faqPairs;

  // Keep the buying journey concise: experience, plan, inclusions, then FAQs.
  const sections = [
    {
      id: "overview",
      label: "The experience",
      content: (
        <section className="overflow-hidden rounded-[24px] border border-[#dce8e5] bg-white shadow-[0_18px_55px_rgba(11,48,44,0.08)]">
          <div className="p-6 sm:p-8 lg:p-10">
            <p className="mb-3 text-[11px] font-extrabold uppercase tracking-[0.24em] text-brand-orange-text">The experience</p>
            <h2 className="font-display max-w-2xl text-[28px] font-bold leading-tight text-[#102b28] sm:text-4xl">
              More than a route. A journey designed around how you want to feel.
            </h2>
            {overviewText ? (
              <ExpandableText
                text={overviewText}
                limit={680}
                className="mt-5 max-w-3xl text-[15px] leading-7 text-[#536763] sm:text-base"
              />
            ) : (
              <p className="mt-5 max-w-2xl text-[15px] leading-7 text-[#536763]">
                This trip is tailored after a short conversation about your dates, group, pace, and preferences.
              </p>
            )}

            {highlights.length > 0 && (
              <div className="mt-9 border-t border-[#e4ecea] pt-8">
                <div className="mb-5 flex flex-wrap items-end justify-between gap-2">
                  <div>
                    <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#6f817d]">Worth the journey</p>
                    <h3 className="font-display mt-1 text-2xl font-bold text-[#102b28]">Moments you can look forward to</h3>
                  </div>
                  <span className="text-xs font-semibold text-[#6f817d]">Curated from this itinerary</span>
                </div>
                <ul className="grid gap-3 sm:grid-cols-2">
                  {highlights.map((highlight: string) => (
                    <li key={highlight} className="flex gap-3 rounded-2xl bg-[#f2f7f6] p-4 text-sm leading-6 text-[#314944]">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#ef7a2f]" />
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>
      ),
    },
    ...(hasLegacyItinerary || hasScrapedItinerary || suggestedItinerary.length > 0 ? [{
      id: "itinerary",
      label: "Day by day",
      content: (
        <section className="rounded-[24px] border border-[#dce8e5] bg-white p-6 shadow-[0_18px_55px_rgba(11,48,44,0.08)] sm:p-8 lg:p-10">
          <div className="mb-8 max-w-2xl">
            <p className="text-[11px] font-extrabold uppercase tracking-[0.24em] text-brand-orange-text">{suggestedItinerary.length > 0 && editorialItinerary.length === 0 ? "Suggested itinerary" : "Day by day"}</p>
            <h2 className="font-display mt-2 text-[28px] font-bold text-[#102b28] sm:text-4xl">See how the journey unfolds</h2>
            <p className="mt-3 text-sm leading-6 text-[#657772]">{suggestedItinerary.length > 0 && editorialItinerary.length === 0 ? "This starting plan keeps every day visible and will be tailored to your dates, transport and preferred pace before booking." : "Open each day for the plan, travel flow, and experiences included along the way."}</p>
          </div>
          {hasLegacyItinerary ? <ItineraryAccordion itinerary={legacyItinerary} /> : hasScrapedItinerary ? <BlockRenderer blocks={safeItineraryBlocks} /> : <ItineraryAccordion itinerary={suggestedItinerary} />}
        </section>
      ),
    }] : []),
    ...(inclusions.length > 0 || exclusions.length > 0 ? [{
      id: "includes",
      label: "What’s included",
      content: (
        <section className="rounded-[24px] border border-[#dce8e5] bg-white p-6 shadow-[0_18px_55px_rgba(11,48,44,0.08)] sm:p-8 lg:p-10">
          <div className="mb-8 max-w-2xl">
            <p className="text-[11px] font-extrabold uppercase tracking-[0.24em] text-brand-orange-text">Clear before you book</p>
            <h2 className="font-display mt-2 text-[28px] font-bold text-[#102b28] sm:text-4xl">What the package covers</h2>
          </div>
          <div className={`grid gap-5 ${inclusions.length > 0 && exclusions.length > 0 ? 'md:grid-cols-2' : ''}`}>
            {inclusions.length > 0 && (
              <div className="rounded-2xl bg-[#eef7f3] p-5 sm:p-6">
                <h3 className="mb-4 text-base font-extrabold text-[#124b3e]">Included in your plan</h3>
                <ul className="space-y-3">
                  {inclusions.map((item: string, i: number) => (
                    <li key={i} className="flex items-start gap-3 text-sm leading-6 text-[#355e54]">
                      <Check className="mt-1 h-4 w-4 shrink-0 text-[#16815f]" /> <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {exclusions.length > 0 && (
              <div className="rounded-2xl bg-[#fff6ef] p-5 sm:p-6">
                <h3 className="mb-4 text-base font-extrabold text-[#7b431f]">Not included</h3>
                <ul className="space-y-3">
                  {exclusions.map((item: string, i: number) => (
                    <li key={i} className="flex items-start gap-3 text-sm leading-6 text-[#765943]">
                      <X className="mt-1 h-4 w-4 shrink-0 text-[#cc6b2c]" /> <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>
      ),
    }] : []),
    ...(allFaqs.length > 0 ? [{
      id: "faqs",
      label: "FAQs",
      content: (
        <section className="rounded-[24px] border border-[#dce8e5] bg-white p-6 shadow-[0_18px_55px_rgba(11,48,44,0.08)] sm:p-8 lg:p-10">
          <div className="mb-7">
            <p className="text-[11px] font-extrabold uppercase tracking-[0.24em] text-brand-orange-text">Good to know</p>
            <h2 className="font-display mt-2 text-[28px] font-bold text-[#102b28] sm:text-4xl">Frequently asked questions</h2>
          </div>
          <div className="divide-y divide-[#e1ebe8] border-y border-[#e1ebe8]">
            {allFaqs.map((faq, i) => (
              <details key={i} className="group py-1">
                <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-4 text-left text-[15px] font-bold text-[#1b3833] marker:content-none">
                  <span>{faq.q}</span>
                  <span className="text-xl font-light text-[#ef7a2f] transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="max-w-3xl pb-5 pr-8 text-sm leading-7 text-[#60736e]">{faq.a}</p>
              </details>
            ))}
          </div>
        </section>
      ),
    }] : []),
  ].filter((s) => s.content !== null);

  const locationMedia = getPackageLocationMedia(pkg);
  // Location-inventory media is the only approved source for package heroes
  // and galleries. Scraped package images remain available as historical
  // records but cannot leak into the customer-facing journey.
  const galleryCandidates = locationMedia
    ? locationMedia.gallery.map((item) => item.src)
    : [PACKAGE_MEDIA_PLACEHOLDER];
  const galleryImages = Array.from(new Set(
    galleryCandidates
      .map((url) => resolveLocalPackageImage(url))
      .filter((url): url is string => Boolean(url)),
  )).slice(0, 8);

  if (galleryImages.length === 0) galleryImages.push(PACKAGE_MEDIA_PLACEHOLDER);

  // Aligned captions for the lightbox (from block image captions)
  const blockCaptions = new Map<string, string>();
  for (const item of locationMedia?.gallery || []) {
    blockCaptions.set(item.src, item.caption);
  }
  for (const item of experienceOverride?.gallery || []) {
    blockCaptions.set(item.src, item.caption);
  }
  for (const block of blocks || []) {
    if (block.type !== 'image' || !block.caption) continue;
    const imageUrl = resolveLocalPackageImage(block.url);
    if (imageUrl) blockCaptions.set(imageUrl, cleanDisplayText(block.caption));
  }
  const galleryCaptions: string[] = galleryImages.map((url: string) => {
    const exactCaption = blockCaptions.get(url);
    if (exactCaption) return exactCaption;
    const subject = path.basename(url)
      .replace(/\.(avif|jpe?g|png|webp)$/i, '')
      .replace(/^hi-/, '')
      .replace(/[-_]+/g, ' ')
      .replace(/\b\w/g, (letter) => letter.toUpperCase());
    return `${subject} — part of the ${pkg.title} journey`;
  });

  // Always publish first-party structured data. The scraped JSON-LD contains
  // reference-domain URLs, so reusing it would create incorrect backlinks.
  const jsonLd: JsonLdDocument = {
    "@context": "https://schema.org",
    "@graph": [
    {
      "@type": ["TouristTrip", "Product"],
      "name": pkg.title,
      "description": details.overview || pkg.description || `Enjoy a wonderful trip: ${pkg.title}`,
      ...(galleryImages[0] ? { "image": `${siteConfig.domain}${galleryImages[0]}` } : {}),
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

  if (allFaqs.length > 0) {
    jsonLd["@graph"].push({
        "@type": "FAQPage",
        "mainEntity": allFaqs.map((faq) => ({
          "@type": "Question",
          "name": faq.q,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": faq.a
          }
        }))
      });
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {/* Sticky mobile CTA (U21) — price + call + WhatsApp + Send Query always visible */}
      <StickyMobileCTA price={displayPrice} showPrice={showPrice} packageName={pkg.title} />
      <div
        className="package-page-shell min-h-screen pb-24 font-sans lg:pb-16"
        style={{ "--package-backdrop": galleryImages[0] ? `url(${galleryImages[0]})` : "none" } as CSSProperties}
      >
        <nav aria-label="Breadcrumb" className="border-b border-[#dfe9e6] bg-white px-4 py-3 text-xs text-[#63746f]">
          <div className="mx-auto flex w-full max-w-[1320px] items-center gap-2 overflow-hidden">
            <Link href="/" className="shrink-0 font-semibold hover:text-[#0b4c43]">Home</Link>
            <span aria-hidden="true">/</span>
            <Link href={`/packages?category=${encodeURIComponent(pkg.category)}`} className="shrink-0 font-semibold hover:text-[#0b4c43]">{pkg.category}</Link>
            <span aria-hidden="true">/</span>
            <span className="truncate text-[#8a9995]">{pkg.title}</span>
          </div>
        </nav>

        <header className="mx-auto w-full max-w-[1320px] px-4 pb-10 pt-5 sm:pt-7 lg:px-6">
          <div className="relative min-h-[510px] overflow-hidden rounded-[28px] bg-[#0b302c] shadow-[0_24px_70px_rgba(7,38,34,0.24)] sm:min-h-[560px]">
            {galleryImages[0] && (
              <Image
                src={galleryImages[0]}
                alt={`${pkg.title} tour experience`}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 1320px"
                placeholder={IMAGE_SKELETON}
                className="object-cover"
              />
            )}
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(4,28,25,0.95)_0%,rgba(4,28,25,0.79)_43%,rgba(4,28,25,0.2)_78%),linear-gradient(0deg,rgba(4,28,25,0.82)_0%,transparent_62%)]" />

            <div className="absolute right-4 top-4 z-20 sm:right-6 sm:top-6">
              <GalleryLightbox images={galleryImages} title={pkg.title} captions={galleryCaptions} />
            </div>

            <div className="relative z-10 flex min-h-[500px] max-w-3xl flex-col justify-end p-6 text-white sm:min-h-[560px] sm:p-10 lg:p-14">
              <Link href={`/packages?category=${encodeURIComponent(pkg.category)}`} className="mb-5 w-fit rounded-full border border-white/30 bg-white/10 px-4 py-2 text-[11px] font-extrabold uppercase tracking-[0.22em] backdrop-blur-md hover:bg-white/20">
                {pkg.category}
              </Link>
              <h1 className="font-display max-w-3xl text-[34px] font-bold leading-[1.02] tracking-[-0.035em] sm:text-5xl lg:text-6xl">{pkg.title}</h1>
              <p className="mt-5 max-w-2xl text-[15px] leading-7 text-white/82 sm:text-base">{cleanDisplayText(experienceOverride?.heroSummary || pkg.description)}</p>
              <div className="mt-7 flex flex-wrap gap-3">
                {hasDuration && (
                  <span className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/25 bg-black/20 px-4 text-sm font-semibold backdrop-blur-sm">
                    <Clock className="h-4 w-4 text-[#f3a25b]" /> {pkg.duration}
                  </span>
                )}
                {hasStartPoint && (
                  <span className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/25 bg-black/20 px-4 text-sm font-semibold backdrop-blur-sm">
                    <MapPin className="h-4 w-4 text-[#f3a25b]" /> Starts in {startPoint}
                  </span>
                )}
              </div>
              <a href="#enquiry-form" className="mt-8 inline-flex min-h-13 w-fit items-center gap-2 rounded-full bg-[#e96822] px-6 text-sm font-extrabold text-white shadow-[0_12px_28px_rgba(0,0,0,0.2)] transition hover:-translate-y-0.5 hover:bg-[#ce5515] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
                Build my version of this trip <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>

          {journeyStops.length > 0 && (
            <div className="relative z-20 mx-3 -mt-6 rounded-[22px] border border-[#dce8e5] bg-white px-5 py-5 shadow-[0_16px_45px_rgba(11,48,44,0.12)] sm:mx-8 sm:px-7">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-7">
                <div className="shrink-0">
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-brand-orange-text">Your journey</p>
                  <p className="mt-1 text-sm font-bold text-[#153a34]">Route at a glance</p>
                </div>
                <ol className="flex min-w-0 flex-1 items-center gap-2 overflow-x-auto pb-1 text-sm text-[#445d57]">
                  {journeyStops.map((stop, index) => (
                    <li key={`${stop}-${index}`} className="flex shrink-0 items-center gap-2">
                      <span className="rounded-full bg-[#eef5f3] px-3 py-2 font-semibold">{stop}</span>
                      {index < journeyStops.length - 1 && <ArrowRight aria-hidden="true" className="h-4 w-4 shrink-0 text-[#e57a37]" />}
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          )}
        </header>

        <main className="mx-auto grid w-full max-w-[1320px] grid-cols-1 gap-7 px-4 lg:grid-cols-[minmax(0,1fr)_350px] lg:px-6">
          <div className="min-w-0 space-y-8">
            <PackageTabs sections={sections} />

            <section id="enquiry-form" className="scroll-mt-24 overflow-hidden rounded-[24px] bg-[#0b302c] shadow-[0_22px_60px_rgba(7,38,34,0.2)]">
              <div className="px-6 pb-5 pt-8 text-white sm:px-9 sm:pt-10">
                <p className="text-[11px] font-extrabold uppercase tracking-[0.24em] text-[#f0a164]">Make it yours</p>
                <h2 className="font-display mt-2 text-[28px] font-bold leading-tight sm:text-4xl">Tell us how you want to travel</h2>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-white/70">Share your dates, group size, and preferences. Your message opens directly in WhatsApp for a real conversation with the travel team.</p>
              </div>
              <div className="bg-white p-2 sm:p-4"><EnquiryForm pkgName={pkg.title} embedded /></div>
            </section>
          </div>

          <aside className="hidden lg:col-span-1 lg:block">
            <div className="sticky top-5 overflow-hidden rounded-[24px] border border-[#d8e5e1] bg-white shadow-[0_18px_55px_rgba(11,48,44,0.1)]">
              <div className="bg-[#0b302c] p-6 text-white">
                <p className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-[#f0a164]">Plan this journey</p>
                <div className="mt-3 text-3xl font-black tracking-tight">{showPrice ? <>INR {displayPrice}</> : 'Tailored pricing'}</div>
                <p className="mt-1 text-xs leading-5 text-white/65">{showPrice ? 'Starting price per adult' : 'Based on your dates, group size, and preferences'}</p>
                {crossedOutPrice && (
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <span className="text-sm text-white/45 line-through">INR {crossedOutPrice}</span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-[#ef7a2f] px-2.5 py-1 text-[10px] font-extrabold"><BadgePercent className="h-3 w-3" /> Save INR {saveAmount}</span>
                  </div>
                )}
              </div>

              <div className="p-6">
                {hasQuickInfo && (
                  <dl className="space-y-4 border-b border-[#e4ecea] pb-6 text-sm">
                    {hasDuration && <div className="flex justify-between gap-5"><dt className="text-[#71817d]">Duration</dt><dd className="text-right font-bold text-[#173a34]">{pkg.duration}</dd></div>}
                    {hasStartPoint && <div className="flex justify-between gap-5"><dt className="text-[#71817d]">Starts</dt><dd className="text-right font-bold capitalize text-[#173a34]">{startPoint}</dd></div>}
                    {hasEndPoint && <div className="flex justify-between gap-5"><dt className="text-[#71817d]">Ends</dt><dd className="text-right font-bold capitalize text-[#173a34]">{endPoint}</dd></div>}
                  </dl>
                )}

                <div className="mt-6 space-y-3">
                  <a href="#enquiry-form" className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#ef7a2f] px-4 text-sm font-extrabold text-white transition hover:bg-[#d96520]">
                    Get a tailored quote <ArrowRight className="h-4 w-4" />
                  </a>
                  <a href={packageWhatsappUrl} target="_blank" rel="noopener noreferrer" className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border border-[#b9d7ce] bg-[#eef7f3] px-4 text-sm font-extrabold text-[#126348] transition hover:bg-[#e2f1eb]">
                    <MessageCircle className="h-4 w-4" /> Chat on WhatsApp
                  </a>
                  <a href={`tel:${siteConfig.phoneRaw}`} className="flex min-h-11 w-full items-center justify-center gap-2 text-sm font-bold text-[#304b45] hover:text-[#0b4c43]">
                    <Phone className="h-4 w-4" /> {siteConfig.phone}
                  </a>
                </div>

                <div className="mt-6 space-y-3 border-t border-[#e4ecea] pt-5 text-xs leading-5 text-[#687a75]">
                  <p className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#16815f]" /> No payment is required to ask for a quote.</p>
                  <p className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#16815f]" /> Dates, pace, and stays can be discussed with the travel team.</p>
                </div>
              </div>
            </div>
          </aside>
        </main>

        <div className="mx-auto w-full max-w-[1320px] px-4 lg:px-6">
          <RelatedPackages category={pkg.category || 'Trending'} currentSlug={pkg.slug} />
        </div>
      </div>
    </>
  );
}
