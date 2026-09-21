import Image from "next/image";
import Link from "next/link";
import { Sun, MapPin } from "lucide-react";
import { getPriceInfo } from "@/utils/price";
import { IMAGE_SKELETON } from "@/utils/imagePlaceholder";

export interface PackageCardProps {
  slug: string;
  title: string;
  image: string;
  image2?: string;
  duration: string;
  route: string;
  mrp: string;
  dealPrice?: string;
  discount?: string;
  highlights: string[];
  destination?: string; // Ported from InternationalPackageCard
  rating?: number; // Ported from InternationalPackageCard
}

interface PackageCardComponentProps {
  pkg: PackageCardProps;
  href?: string;
  variantCount?: number;
}
/* Amenity icons — WebP converted (18 KiB PNG → 2 KiB WebP each, 89% smaller) */
const AMENITIES = [
  { label: "Hotel Stay", icon: "/images/nit/bed.webp" },
  { label: "Meals", icon: "/images/nit/food.webp" },
  { label: "Transfers", icon: "/images/nit/car.webp" },
  { label: "Sightseeing", icon: "/images/nit/sightseeing.webp" },
];

export default function PackageCard({ pkg, href, variantCount }: PackageCardComponentProps) {
  const cardHref = href || `/packages/${pkg.slug}`;
  // Extract number of days from duration string (e.g. "5 Nights / 6 Days" -> "6 Days")
  const durationMatch = pkg.duration.match(/(\d+)\s*Days/i);
  const days = durationMatch ? durationMatch[1] + " Days" : pkg.duration.split('/')[0] || pkg.duration;
  const nightsMatch = pkg.duration.match(/(\d+)\s*Nights/i);
  const nights = nightsMatch ? nightsMatch[1] + " Nights" : "";
  const durationPill = days + (nights ? ` / ${nights}` : "");

  /* ─── Pricing (shared model): pkg.mrp = list price, pkg.dealPrice = the deal ─── */
  const { display: displayPrice, crossed: crossedOutPrice, save: discountAmount, hasPrice: showPrice } = getPriceInfo(pkg.mrp, pkg.dealPrice, pkg.slug);

  return (
    <div className="nit-pcard">
      {/* Whole-card link: covers the card so clicking anywhere opens the tour.
          The image/title/CTA links sit above it (z-index) and stay clickable. */}
      <Link href={cardHref} className="nit-pcard-stretch" tabIndex={-1} aria-hidden="true" />

      {/* ── Image (5px inset, rounded, scale-on-hover like reference) ── */}
      <Link href={cardHref} className="nit-pcard-img" tabIndex={-1}>
        <Image
          src={pkg.image}
          alt={pkg.title}
          fill
          sizes="(max-width: 640px) 380px, (max-width: 1360px) 33vw, 20vw"
          quality={68}
          loading="lazy"
          decoding="async"
          placeholder={IMAGE_SKELETON}
          className="nit-pcard-img-el"
          style={{ objectFit: "cover" }}
        />
        {/* ── Company watermark (top-left, bean shape, translucent) ── */}
        <span className="nit-pcard-watermark" aria-hidden="true">
          <Image
            src="/logo/mqt-india-logo.png"
            alt="My Quick Trippers"
            width={72}
            height={30}
            className="nit-pcard-watermark-img"
            loading="lazy"
            unoptimized
          />
        </span>
        {variantCount && variantCount > 1 ? (
          <span className="nit-pcard-variants">{variantCount} trip options</span>
        ) : null}
      </Link>

      {/* ── Content: title, duration, route, amenities ── */}
      <div className="nit-pcard-cant">
        <h3 className="nit-pcard-title">
          <Link href={cardHref}>{pkg.title}</Link>
        </h3>

        {pkg.duration && (
          <p className="nit-pcard-dur">
            <Sun aria-hidden="true" />
            {durationPill}
          </p>
        )}

        <div className="nit-pcard-dest">
          <MapPin aria-hidden="true" strokeWidth={2} />
          <span className="nit-destinx">
            {pkg.route ? pkg.route : <em style={{ color: "#999", fontStyle: "italic" }}>Route details on request</em>}
          </span>
        </div>

        <ul className="nit-pcard-amen">
          {AMENITIES.map((a) => (
            <li key={a.label}>
              <i className="nit-amen-ic" style={{ backgroundImage: `url(${a.icon})` }} aria-hidden="true"></i>
              {a.label}
            </li>
          ))}
        </ul>
      </div>

      {/* ── Price strip (#ebf1ff) ── */}
      <div className="nit-pcard-price">
        <div className="nit-prOld">
          {showPrice && crossedOutPrice ? (
            <>
              <span className="nit-badge">INR {discountAmount} off</span>
              <del className="nit-old">INR {crossedOutPrice}</del>
            </>
          ) : (
            <span style={{ visibility: "hidden" }}>·</span>
          )}
        </div>

        <div className="nit-prCn">
          {showPrice ? (
            <>
              <span style={{ fontSize: 12, fontWeight: 400, color: '#666', display: 'block', lineHeight: '16px' }}>Starting from</span>
              INR <b>{displayPrice}</b>
            </>
          ) : (
            <b style={{ fontSize: 18, color: "#fb4d00" }}>Contact for Price</b>
          )}
        </div>

        <span className="nit-prCap">Starting price per person</span>

        <div className="nit-prcEnq">
          <Link href={variantCount && variantCount > 1 ? cardHref : `${cardHref}#enquiry-form`} title="Get a Best Deal Quick Enquiry">
            Quick enquiry
          </Link>
          <Link href={cardHref} title={pkg.title}>
            {variantCount && variantCount > 1 ? "View options" : "View Tour"}
          </Link>
        </div>
      </div>
    </div>
  );
}
