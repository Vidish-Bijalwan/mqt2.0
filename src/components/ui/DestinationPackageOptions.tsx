import type { Package } from "@/data/allPackages";
import { getPriceInfo } from "@/utils/price";
import { ArrowUpRight, CalendarDays, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { IMAGE_SKELETON } from "@/utils/imagePlaceholder";

interface DestinationPackageOptionsProps {
  destination: string;
  packages: Package[];
  totalCount: number;
  heroPackage: Package;
}

export default function DestinationPackageOptions({
  destination,
  packages,
  totalCount,
  heroPackage,
}: DestinationPackageOptionsProps) {
  return (
    <section className="destination-options" aria-labelledby="destination-options-title">
      <div className="destination-options-hero">
        <Image
          src={heroPackage.image}
          alt={`${destination} travel experience`}
          fill
          sizes="(max-width: 768px) 100vw, 70vw"
          className="object-cover"
          priority
          placeholder={IMAGE_SKELETON}
        />
        <div>
          <p>Explore {destination}</p>
          <h2 id="destination-options-title">Choose the journey that fits you</h2>
          <span>{totalCount} curated itinerary {totalCount === 1 ? "option" : "options"}</span>
        </div>
      </div>

      <div className="destination-options-list">
        {packages.map((pkg, index) => {
          const price = getPriceInfo(pkg.mrp, pkg.dealPrice, pkg.slug);
          return (
            <article className="destination-option" key={pkg.slug}>
              <span className="destination-option-number">{String(index + 1).padStart(2, "0")}</span>
              <div className="destination-option-copy">
                <h3>{pkg.title}</h3>
                <div className="destination-option-facts">
                  <span><CalendarDays aria-hidden="true" />{pkg.duration || "Custom duration"}</span>
                  <span><MapPin aria-hidden="true" />{pkg.route || "Route tailored on request"}</span>
                </div>
              </div>
              <div className="destination-option-action">
                <small>{price.hasPrice ? "Starting from" : "Personalised quote"}</small>
                <strong>{price.hasPrice ? `INR ${price.display}` : "On request"}</strong>
                <Link href={`/packages/${pkg.slug}`}>
                  View itinerary <ArrowUpRight aria-hidden="true" />
                </Link>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
