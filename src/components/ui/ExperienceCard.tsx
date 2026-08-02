import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Compass } from "lucide-react";

/* ─────────────────────────────────────────────────────────────────────────
   ExperienceCard — premium clickable category card for the discovery section.
   Entire card is a link. Hierarchy: image → category name → tagline → count.
   ───────────────────────────────────────────────────────────────────────── */

interface ExperienceCardProps {
  slug: string;
  name: string;
  tagline: string;
  image: string;
  packageCount: number;
}

export default function ExperienceCard({ slug, name, tagline, image, packageCount }: ExperienceCardProps) {
  return (
    <Link
      href={`/experiences/${slug}`}
      aria-label={
        packageCount > 0
          ? `Explore ${name} — ${packageCount} ${packageCount === 1 ? "package" : "packages"}`
          : `Explore ${name} — custom itinerary`
      }
      className="group relative block h-[280px] md:h-[320px] w-full overflow-hidden rounded-card bg-gray-900 shadow-card-soft transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-card-lift focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2"
    >
      {/* Image + zoom on hover */}
      <Image
        src={image}
        alt={name}
        fill
        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
        className="object-cover transition-transform duration-700 ease-out motion-safe:group-hover:scale-[1.08]"
      />

      {/* Dark gradient overlay — readable text on any image */}
      <div
        className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/10 transition-opacity duration-300 group-hover:from-black/85"
        aria-hidden="true"
      />

      {/* Group chip — top left */}
      <span className="absolute left-4 top-4 inline-flex items-center gap-1 rounded-full bg-white/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-md ring-1 ring-white/20">
        <Compass className="h-3 w-3" aria-hidden="true" />
        Discover India
      </span>

      {/* Text block — bottom */}
      <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
        <h3 className="text-xl sm:text-2xl font-bold leading-tight text-white drop-shadow-md transition-transform duration-300 ease-out motion-safe:group-hover:scale-[1.02] motion-safe:group-hover:origin-left">
          {name}
        </h3>
        <p className="mt-1 line-clamp-1 text-xs sm:text-[13px] text-gray-300">{tagline}</p>

        {/* Footer row — count + arrow */}
        <div className="mt-3 flex items-center justify-between border-t border-white/20 pt-3">
          <span className="text-[11px] font-semibold uppercase tracking-wide text-amber-300/90">
            {packageCount > 0
              ? `${packageCount} ${packageCount === 1 ? "Package" : "Packages"}`
              : "Custom Itinerary"}
          </span>
          <span
            className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/15 text-white ring-1 ring-white/25 backdrop-blur-md transition-all duration-300 ease-out group-hover:bg-brand-orange group-hover:ring-brand-orange motion-safe:group-hover:translate-x-0.5"
            aria-hidden="true"
          >
            <ArrowRight className="h-4 w-4" />
          </span>
        </div>
      </div>
    </Link>
  );
}
