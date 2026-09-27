import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock, MapPin } from "lucide-react";
import GalleryLightbox from "@/components/ui/GalleryLightbox";
import { IMAGE_SKELETON } from "@/utils/imagePlaceholder";
import { cleanDisplayText, type PackageViewModel } from "@/utils/packageDetails";

/**
 * Breadcrumb, gallery hero and "route at a glance" strip.
 * Renders the same markup as the original page.tsx header block.
 */
export default function PackageHero({ vm }: { vm: PackageViewModel }) {
  const {
    pkg,
    hasDuration,
    hasStartPoint,
    galleryImages,
    galleryCaptions,
    journeyStops,
  } = vm;

  return (
    <>
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
            <p className="mt-5 max-w-2xl text-[15px] leading-7 text-white/82 sm:text-base">{cleanDisplayText(vm.heroSummary || pkg.description)}</p>
            <div className="mt-7 flex flex-wrap gap-3">
              {hasDuration && (
                <span className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/25 bg-black/20 px-4 text-sm font-semibold backdrop-blur-sm">
                  <Clock className="h-4 w-4 text-[#f3a25b]" /> {pkg.duration}
                </span>
              )}
              {hasStartPoint && (
                <span className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/25 bg-black/20 px-4 text-sm font-semibold backdrop-blur-sm">
                  <MapPin className="h-4 w-4 text-[#f3a25b]" /> Starts in {vm.startPoint}
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
    </>
  );
}
