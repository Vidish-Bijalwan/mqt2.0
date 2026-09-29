import fs from 'fs';
import path from 'path';
import type { Package } from "@/data/allPackages";
import { getTourDays } from "@/utils/packageCatalog";
import { siteConfig } from "@/data/siteConfig";
import { getPriceInfo } from "@/utils/price";
import { replaceReferenceBrand } from "@/utils/branding";
import { extractInclusions, extractExclusions, extractHighlights } from "@/utils/blocks";
import type { Block, FaqItem } from "@/utils/blocks";
import { packageExperienceOverrides } from "@/data/packageExperienceOverrides";
import { getPackageLocationMedia, packageLocationMedia, PACKAGE_MEDIA_PLACEHOLDER } from "@/data/packageLocationMedia";

export interface LegacyPackageDetails {
  overview: string;
  highlights: string[];
  itinerary: Array<{ title: string; description: string }>;
  faqs: FaqItem[];
}

export interface JsonLdNode {
  "@type": string | string[];
  [key: string]: unknown;
}

export interface JsonLdDocument {
  "@context"?: string;
  "@graph": JsonLdNode[];
  [key: string]: unknown;
}

export interface RichPackageDetails {
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

export const packageDetails = loadDetailFile<LegacyPackageDetails>('packageDetails.json');
const packageDetailsV2 = loadDetailFile<RichPackageDetails>('packageDetailsV2.json');
const packageDetailsV3 = loadDetailFile<RichPackageDetails>('packageDetailsV3.json');

const knownLocalImageUrls = new Set([
  ...Object.values(packageLocationMedia).flatMap((media) => [media.primary, ...media.gallery.map((item) => item.src)]),
]);

export function detailsV2For(slug: string) {
  return packageDetailsV2[slug] || packageDetailsV2[`${slug}.html`] || packageDetailsV2[`${slug}.htm`];
}

export function detailsV3For(slug: string) {
  return packageDetailsV3[slug];
}

export const blockText = (block: Block) => String(block.text || block.content || '').trim();

export function cleanDisplayText(value: string) {
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

export function isDayHeading(block: Block) {
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

export interface PackageViewModel {
  slug: string;
  pkg: Package;
  blocks: Block[] | null;
  safeItineraryBlocks: Block[];
  faqPairs: { q: string; a: string }[];
  allFaqs: FaqItem[];
  priceInfo: ReturnType<typeof getPriceInfo>;
  displayPrice: string;
  crossedOutPrice: string | null;
  saveAmount: string | null;
  showPrice: boolean;
  packageWhatsappUrl: string;
  inclusions: string[];
  exclusions: string[];
  highlights: string[];
  overviewText: string;
  heroSummary?: string;
  hasDuration: boolean;
  hasRouteInfo: boolean;
  hasStartPoint: boolean;
  hasEndPoint: boolean;
  hasQuickInfo: boolean;
  startPoint: string;
  endPoint: string;
  journeyStops: string[];
  legacyItinerary: Array<{ title: string; description: string }>;
  hasLegacyItinerary: boolean;
  hasScrapedItinerary: boolean;
  editorialItinerary: Array<{ title: string; description: string }>;
  suggestedItinerary: Array<{ title: string; description: string }>;
  galleryImages: string[];
  galleryCaptions: string[];
  legacyDetails: LegacyPackageDetails;
  /** Package-specific scraped cancellation/refund notes (may be empty). */
  cancellationNotes: string[];
  /** Cancellation/refund FAQ Q&A from the package's own records (may be empty). */
  cancellationFaqs: FaqItem[];
  /** Package-specific scraped pickup / reporting-point notes (may be empty). */
  logisticsNotes: string[];
  /** Pickup / transfer FAQ Q&A from the package's own records (may be empty). */
  logisticsFaqs: FaqItem[];
}

/**
 * Computes every derived value the package detail page needs, in one place.
 * Pure data computation — no JSX, no Next.js calls — so the page component
 * stays a thin composition of data + sections.
 */
export function buildPackageViewModel(pkg: Package): PackageViewModel {
  const slug = pkg.slug;
  const experienceOverride = packageExperienceOverrides[pkg.slug];

  // Get rich details — V3 (clean) preferred, then V2, then legacy. Empty block
  // arrays (junk dropped by clean-package-blocks) must fall through.
  const detailsV3 = detailsV3For(slug);
  const detailsV2 = detailsV2For(slug);
  const details: LegacyPackageDetails = packageDetails[slug] || { overview: '', highlights: [], itinerary: [], faqs: [] };
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

  const blocks: Block[] | null = hasRealContent(detailsV3?.blocks)
    ? (detailsV3 as RichPackageDetails).blocks as Block[]
    : hasRealContent(detailsV2?.blocks)
      ? (detailsV2 as RichPackageDetails).blocks as Block[]
      : null;

  // Shared pricing model (D16/D17) — computed early because block tables below
  // may need the public price substituted into "Tour Price: On Request" rows.
  const priceInfo = getPriceInfo(pkg.mrp, pkg.dealPrice, pkg.slug);

  // Root-cause fix: scraped V2/V3 "Price Details" tables sometimes say
  // "On Request" even when the catalogue exposes a public price, contradicting
  // the price card, sidebar and sticky CTA on the same page. When the package
  // has a public price, substitute it into the table row instead.
  const normalizeTourPriceRows = (items: Block[] | null | undefined): Block[] | null => {
    if (!items || !priceInfo.hasPrice) return items ?? null;
    return items.map((block) => {
      if (block.type !== 'table' || !(block.rows || []).length) return block;
      const rows = (block.rows || []).map((row) => {
        const label = String(row[0] || '').trim().toLowerCase();
        if ((label === 'tour price' || label === 'price') && /^on request$/i.test(String(row[1] || '').trim())) {
          return [row[0], `INR ${priceInfo.display} (starting price)`];
        }
        return row;
      });
      return { ...block, rows };
    });
  };

  const normalizedBlocks = normalizeTourPriceRows(blocks);

  const hasItinerarySection = (items: Block[] | null | undefined) =>
    Boolean(items?.some((block) =>
      block.type === 'heading' &&
      /(day-?by-?day itinerary|day-?wise itinerary|tour itinerary|^day\s*[-:]?\s*\d)/i.test(blockText(block)),
    ));
  const itinerarySourceBlocks = hasItinerarySection(normalizedBlocks)
    ? normalizedBlocks
    : hasItinerarySection(detailsV2?.blocks)
      ? normalizeTourPriceRows(detailsV2?.blocks)
      : normalizedBlocks;

  // Extract FAQ pairs from V3 blocks early (used by both sections and JSON-LD)
  // Two formats:
  // 1. Structured faq block: { type: 'faq', items: [{ q, a }] }
  // 2. Legacy heading+paragraph: "Q1. ..." + "Ans. ..."
  const faqPairs: { q: string; a: string }[] = [];
  if (normalizedBlocks) {
    for (let i = 0; i < normalizedBlocks.length; i++) {
      const blk = normalizedBlocks[i];
      if (blk.type === 'faq' && Array.isArray(blk.items)) {
        for (const item of blk.items) {
          if (typeof item !== 'string' && item.q && item.a) faqPairs.push({ q: item.q, a: item.a });
        }
      } else if (blk.type === 'heading' && /^Q\d+\./i.test(blockText(blk))) {
        const answer = normalizedBlocks[i + 1];
        if (answer?.type === 'paragraph' && /^Ans\./i.test(blockText(answer))) {
          faqPairs.push({
            q: blockText(blk).replace(/\s*See More\s*$/i, '').trim(),
            a: blockText(answer).replace(/^Ans\.\s*/i, '').trim(),
          });
        }
      }
    }
  }

  // priceInfo is computed early (see above) because block tables may need it.
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
  const inclusions = cleanList(normalizedBlocks ? extractInclusions(normalizedBlocks) : []);
  const exclusions = cleanList(normalizedBlocks ? extractExclusions(normalizedBlocks) : []);
  const highlights = cleanList(
    experienceOverride?.highlights?.length
      ? experienceOverride.highlights
      : details.highlights.length > 0
        ? details.highlights
        : normalizedBlocks
          ? extractHighlights(normalizedBlocks)
          : [],
  ).slice(0, 8);

  const overviewBoundary = (normalizedBlocks || []).findIndex((block) =>
    block.type === 'heading' && /(day-?by-?day itinerary|day-?wise itinerary|tour itinerary|^day\s*[-:]?\s*\d)/i.test(blockText(block)),
  );
  const overviewParagraphs = (normalizedBlocks || [])
    .slice(0, overviewBoundary >= 0 ? overviewBoundary : normalizedBlocks?.length)
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
        .split(/[→–—,>]/)
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
  const editorialItinerary = packageExperienceOverrides[slug]?.itinerary || [];
  const suggestedItinerary = !hasLegacyItinerary && !hasScrapedItinerary
    ? editorialItinerary.length > 0
      ? editorialItinerary
      : buildSuggestedItinerary(pkg.title, pkg.duration, uniqueRoutePlaces, fallbackDayTitles)
    : [];
  const allFaqs = details.faqs && details.faqs.length > 0 ? details.faqs : faqPairs;

  // --- Feature A: trip truth (cancellation terms + pickup/logistics) ---
  // Scraped block sections under "Cancellation ..."/"Refund Policy" and
  // "Pick up point / Reporting Point"/"Meet & Greet on Arrival" headings,
  // sanitized with the same cleanDisplayText path as inclusions. A package
  // with no such sections gets the official MQT standard policy instead
  // (rendered by the component), so the UI always stays truthful.
  const collectAfterHeadings = (headingRe: RegExp, maxChars = 600): string[] => {
    const items = normalizedBlocks || [];
    const collected: string[] = [];
    const consumed = new Set<number>();
    items.forEach((block, i) => {
      if (block.type !== "heading" || !headingRe.test(blockText(block))) return;
      for (let j = i + 1; j < items.length; j++) {
        const next = items[j];
        if (next.type === "heading") break;
        if (consumed.has(j)) continue;
        consumed.add(j);
        if (next.type === "list") {
          (next.items || [])
            .filter((it): it is string => typeof it === "string")
            .map(cleanDisplayText)
            .filter((t) => t.length > 3)
            .forEach((t) => collected.push(t.slice(0, maxChars)));
        } else if (next.type === "paragraph") {
          const t = cleanDisplayText(blockText(next)).replace(/^Ans[.:]\s*/i, "");
          if (t.length > 30) collected.push(t.slice(0, maxChars));
        }
      }
    });
    return Array.from(new Set(collected)).slice(0, 8);
  };

  const faqsMatching = (re: RegExp): FaqItem[] =>
    (allFaqs || [])
      .filter((f) => re.test(f.q || ""))
      .slice(0, 4)
      .map((f) => ({
        q: cleanDisplayText(f.q || ""),
        a: cleanDisplayText(f.a || "").slice(0, 500),
      }))
      .filter((f) => f.a.length > 20);

  const cancellationNotes = collectAfterHeadings(/cancell|refund/i, 400);
  const cancellationFaqs = faqsMatching(/cancell|refund/i);
  // Pickup/logistics: "Pick up point / Reporting Point" and
  // "Meet & Greet on Arrival" headings. Deliberately excludes "Day N: ..."
  // arrival headings, which are itinerary, not logistics.
  const logisticsNotes = collectAfterHeadings(
    /pick[\s-]?up point|reporting point|meet[\s\S]{0,15}greet on arrival/i,
  );
  const logisticsFaqs = faqsMatching(
    /pick[\s-]?up|airport.{0,15}drop|drop.{0,15}airport|meet[\s\S]{0,15}greet|reporting point/i,
  );

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
  for (const block of normalizedBlocks || []) {
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

  return {
    slug,
    pkg,
    blocks: normalizedBlocks,
    safeItineraryBlocks,
    faqPairs,
    allFaqs,
    priceInfo,
    displayPrice,
    crossedOutPrice,
    saveAmount,
    showPrice,
    packageWhatsappUrl,
    inclusions,
    exclusions,
    highlights,
    overviewText,
    heroSummary: experienceOverride?.heroSummary,
    hasDuration,
    hasRouteInfo,
    hasStartPoint,
    hasEndPoint,
    hasQuickInfo,
    startPoint,
    endPoint,
    journeyStops,
    legacyItinerary,
    hasLegacyItinerary,
    hasScrapedItinerary,
    editorialItinerary,
    suggestedItinerary,
    galleryImages,
    galleryCaptions,
    legacyDetails: details,
    cancellationNotes,
    cancellationFaqs,
    logisticsNotes,
    logisticsFaqs,
  };
}

/**
 * Always publish first-party structured data. The scraped JSON-LD contains
 * reference-domain URLs, so reusing it would create incorrect backlinks.
 */
export function buildPackageJsonLd(vm: PackageViewModel): JsonLdDocument {
  const { pkg, slug, legacyDetails, galleryImages, allFaqs, showPrice, priceInfo } = vm;

  const jsonLd: JsonLdDocument = {
    "@context": "https://schema.org",
    "@graph": [
    {
      "@type": ["TouristTrip", "Product"],
      "name": pkg.title,
      "description": legacyDetails.overview || pkg.description || `Enjoy a wonderful trip: ${pkg.title}`,
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
          "item": `${siteConfig.domain}/packages`
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

  return jsonLd;
}
