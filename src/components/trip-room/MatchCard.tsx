"use client";

import Link from "next/link";
import { ArrowRight, BadgeCheck, Clock, MapPin, Tag } from "lucide-react";
import type { PackageMatch } from "@/lib/trip-room/matcher";

interface MatchCardProps {
  match: PackageMatch;
  rank: number;
  onEnquire: (pkg: PackageMatch["pkg"]) => void;
}

/**
 * One matched package: real title/price/duration from the catalog, a link to
 * the package page, and a "Continue to enquiry" button that writes the room
 * summary to sessionStorage (key "mqt-room") before navigating.
 */
export default function MatchCard({ match, rank, onEnquire }: MatchCardProps) {
  const { pkg, reasons } = match;
  const href = `/packages/${pkg.slug}`;
  return (
    <article className="overflow-hidden rounded-2xl border border-line bg-surface-card">
      <div className="flex items-center justify-between gap-2 border-b border-line bg-surface-canvas px-4 py-2.5">
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-[0.12em] ${
            rank === 1 ? "bg-brand-cta text-brand-primary-deep" : "bg-brand-primary/10 text-brand-primary"
          }`}
        >
          {rank === 1 && <BadgeCheck className="h-3.5 w-3.5" aria-hidden="true" />}
          {rank === 1 ? "Best match" : `Match #${rank}`}
        </span>
        <span className="text-xs font-semibold text-ink-muted">Group score {match.score}</span>
      </div>

      <div className="p-4 sm:p-5">
        <h3 className="text-lg font-extrabold leading-snug text-ink">
          <Link href={href} className="hover:text-brand-secondary focus-visible:outline-2 focus-visible:outline-brand-secondary">
            {pkg.title}
          </Link>
        </h3>
        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-ink-muted">
          <span className="inline-flex items-center gap-1">
            <MapPin className="h-4 w-4" aria-hidden="true" /> {pkg.category}
          </span>
          <span className="inline-flex items-center gap-1">
            <Clock className="h-4 w-4" aria-hidden="true" /> {pkg.duration}
          </span>
          {pkg.dealPrice.trim() !== "" && (
            <span className="inline-flex items-center gap-1 font-bold text-ink">
              <Tag className="h-4 w-4" aria-hidden="true" /> {pkg.dealPrice}
              <span className="font-normal text-ink-muted"> per person</span>
            </span>
          )}
        </div>
        {reasons.length > 0 && (
          <ul className="mt-3 flex flex-wrap gap-2" aria-label="Why this matches">
            {reasons.map((reason) => (
              <li
                key={reason}
                className="rounded-full border border-brand-secondary/30 bg-brand-secondary/10 px-2.5 py-1 text-xs font-semibold text-brand-secondary"
              >
                {reason}
              </li>
            ))}
          </ul>
        )}
        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
          <Link
            href={href}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border-2 border-brand-primary px-4 py-2.5 text-sm font-extrabold text-brand-primary transition-colors hover:bg-brand-primary hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-secondary"
          >
            View best match <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
          <button
            type="button"
            onClick={() => onEnquire(pkg)}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-brand-cta px-4 py-2.5 text-sm font-extrabold text-brand-primary-deep transition-transform hover:scale-[1.02] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-secondary active:scale-[0.99]"
          >
            Continue to enquiry <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </article>
  );
}
