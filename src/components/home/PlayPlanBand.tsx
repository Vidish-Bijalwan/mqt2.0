import Image from "next/image";
import Link from "next/link";
import { RotateCw, Sparkles, Users } from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";
import { IMAGE_SKELETON } from "@/utils/imagePlaceholder";

/**
 * Play & Plan — homepage discoverability band for the three interactive
 * routes that live outside the tour-category nav:
 *   /games      Spin the Himalayas — daily voucher wheel
 *   /trip-twin  Find Your Trip Twin — 8-question travel personality quiz
 *   /trip-room  Plan a Group Trip — shared voting room for groups
 *
 * Imagery reuses the site's existing destination photography (same files as
 * the homepage tiles). Copy is factual, taken from each route's own title
 * and description — nothing is invented here.
 */
const CARDS = [
  {
    href: "/games",
    img: "/images/packages/fascinating-eastern-himalaya.webp",
    alt: "Eastern Himalaya peaks",
    icon: RotateCw,
    eyebrow: "Games",
    title: "Spin the Himalayas",
    copy: "Spin the wheel once a day and win real MyQuickTrippers travel vouchers — up to ₹5,000 off your booking, with published odds.",
    cta: "Spin the wheel",
  },
  {
    href: "/trip-twin",
    img: "/images/packages/kashmir-hq.webp",
    alt: "Kashmir valley landscape",
    icon: Sparkles,
    eyebrow: "Quiz",
    title: "Find Your Trip Twin",
    copy: "Answer 8 quick questions to discover your traveler personality — and get three real MyQuickTrippers trips matched to you.",
    cta: "Find your twin",
  },
  {
    href: "/trip-room",
    img: "/images/packages/group-tour.webp",
    alt: "Group of travelers on a tour",
    icon: Users,
    eyebrow: "Group Trips",
    title: "Plan a Group Trip",
    copy: "Create a trip room, share one link with your group, collect votes on destination, dates and budget — then see real package matches.",
    cta: "Create a room",
  },
];

export default function PlayPlanBand() {
  return (
    <section className="home-deferred-section bg-[#fbfaf6]/96" aria-label="Play and plan">
      <div className="nit-page">
        <SectionHeader
          title="Play & Plan"
          subtitle="Spin the voucher wheel, discover your travel personality, or plan a group trip together."
          marginTop
        />
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {CARDS.map((card) => (
            <Link
              key={card.href}
              href={card.href}
              className="group overflow-hidden rounded-2xl border border-line bg-surface-card shadow-[var(--shadow-card-soft)] transition-all duration-200 hover:-translate-y-1 hover:shadow-[var(--shadow-card-lift)]"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                  src={card.img}
                  alt={card.alt}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  quality={70}
                  loading="lazy"
                  decoding="async"
                  placeholder={IMAGE_SKELETON}
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-surface-card/95 px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.12em] text-brand-orange">
                  <card.icon className="h-3.5 w-3.5" aria-hidden="true" />
                  {card.eyebrow}
                </span>
              </div>
              <div className="p-5">
                <h3 className="font-display text-xl font-extrabold text-ink">{card.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-muted">{card.copy}</p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-brand-orange group-hover:underline">
                  {card.cta}
                  <span aria-hidden="true">→</span>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
