import Image from "next/image";
import Link from "next/link";
import { Sun, MapPin } from "lucide-react";
import { getPriceInfo } from "@/utils/price";

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

/* Amenity icons — copied from reference site (64px PNGs, rendered at 24px) */
const AMENITIES = [
  { label: "Hotel Stay", icon: "/images/nit/bed.png" },
  { label: "Meals", icon: "/images/nit/food.png" },
  { label: "Transfers", icon: "/images/nit/car.png" },
  { label: "Sightseeing", icon: "/images/nit/sightseeing.png" },
];

export default function PackageCard({ pkg }: { pkg: PackageCardProps }) {
  // Extract number of days from duration string (e.g. "5 Nights / 6 Days" -> "6 Days")
  const durationMatch = pkg.duration.match(/(\d+)\s*Days/i);
  const days = durationMatch ? durationMatch[1] + " Days" : pkg.duration.split('/')[0] || pkg.duration;
  const nightsMatch = pkg.duration.match(/(\d+)\s*Nights/i);
  const nights = nightsMatch ? nightsMatch[1] + " Nights" : "";
  const durationPill = days + (nights ? ` / ${nights}` : "");

  /* ─── Pricing (shared model): pkg.mrp = list price, pkg.dealPrice = the deal ─── */
  const { display: displayPrice, crossed: crossedOutPrice, save: discountAmount, hasPrice: showPrice } = getPriceInfo(pkg.mrp, pkg.dealPrice);

  return (
    <div className="nit-pcard">
      {/* Whole-card link: covers the card so clicking anywhere opens the tour.
          The image/title/CTA links sit above it (z-index) and stay clickable. */}
      <Link href={`/packages/${pkg.slug}`} className="nit-pcard-stretch" tabIndex={-1} aria-hidden="true" />

      {/* ── Image (5px inset, rounded, scale-on-hover like reference) ── */}
      <Link href={`/packages/${pkg.slug}`} className="nit-pcard-img" tabIndex={-1}>
        <Image
          src={pkg.image}
          alt={pkg.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1360px) 50vw, 33vw"
          className="nit-pcard-img-el"
          style={{ objectFit: "cover", filter: "saturate(1.15) contrast(1.08)" }}
        />
      </Link>

      {/* ── Content: title, duration, route, amenities ── */}
      <div className="nit-pcard-cant">
        <h3 className="nit-pcard-title">
          <Link href={`/packages/${pkg.slug}`}>{pkg.title}</Link>
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
            <>INR <b>{displayPrice}</b></>
          ) : (
            <b style={{ fontSize: 20, color: "#fb4d00" }}>Pricing on request</b>
          )}
        </div>

        <span className="nit-prCap">Starting price per person</span>

        <div className="nit-prcEnq">
          <Link href={`/packages/${pkg.slug}#enquiry-form`} title="Get a Best Deal Quick Enquiry">
            Quick enquiry
          </Link>
          <Link href={`/packages/${pkg.slug}`} title={pkg.title}>
            View Tour
          </Link>
        </div>
      </div>
    </div>
  );
}
