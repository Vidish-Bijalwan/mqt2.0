"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, Check, ChevronDown } from "lucide-react";
import { trackEvent } from "@/lib/analytics";
import { formatINR } from "@/data/commercial/defaults";
import type { PackageCommercial } from "@/types/commercial";

interface ValueStackProps {
  commercial: PackageCommercial;
  /** Public per-person price in rupees (from the existing price pipeline). */
  publicPrice: number;
  /** Formatted strikethrough price, when the existing pipeline has one. */
  crossedPrice?: string | null;
  packageSlug: string;
}

/**
 * Package value stack — makes the value easy to understand in ~5 seconds:
 * what it costs, what's included, why it's worth it, what to do next.
 *
 * The "bundle advantage" row renders ONLY when every component value is a
 * real number in data. Otherwise it is hidden — never fabricated.
 */
export default function ValueStack({ commercial, publicPrice, crossedPrice, packageSlug }: ValueStackProps) {
  const [expanded, setExpanded] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const viewed = useRef(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el || viewed.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && !viewed.current) {
          viewed.current = true;
          trackEvent("price_section_view", { slug: packageSlug });
          observer.disconnect();
        }
      },
      { threshold: 0.35 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [packageSlug]);

  const components = commercial.componentValues;
  const hasBreakdown =
    !!components &&
    components.length > 0 &&
    components.every((c) => c.value != null && c.value > 0);
  const componentsTotal = hasBreakdown
    ? components.reduce((sum, c) => sum + (c.value as number), 0)
    : 0;
  const bundleAdvantage = hasBreakdown && componentsTotal > publicPrice
    ? componentsTotal - publicPrice
    : null;

  return (
    <section
      ref={sectionRef}
      aria-label="Package value breakdown"
      className="overflow-hidden rounded-[24px] border border-line bg-surface-card shadow-[0_18px_55px_rgba(11,31,51,0.08)]"
    >
      {/* Price header — primary, not CTA: this is information, not the action. */}
      <div className="bg-brand-primary-deep p-6 text-white sm:p-7">
        <p className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-brand-secondary-pale">
          {commercial.displayName}
        </p>
        <div className="mt-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <span className="text-3xl font-black tracking-tight sm:text-4xl">
            {formatINR(publicPrice)}
          </span>
          <span className="text-sm font-semibold text-white/70">/ person</span>
          {crossedPrice && (
            <span className="text-sm text-white/45 line-through">INR {crossedPrice}</span>
          )}
        </div>
        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-white/65">
          {commercial.occupancyNote && <span>{commercial.occupancyNote}</span>}
          <span>{commercial.taxNote}</span>
        </div>
      </div>

      <div className="p-6 sm:p-7">
        <h3 className="text-xs font-extrabold uppercase tracking-[0.18em] text-ink-muted">
          Package includes
        </h3>
        <ul className="mt-4 space-y-3">
          {commercial.includes.map((item) => (
            <li key={item.label} className="flex gap-3 text-sm leading-6">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-secondary/15">
                <Check className="h-3 w-3 text-brand-secondary-deep" strokeWidth={3} />
              </span>
              <span>
                <span className="font-bold text-ink">{item.label}</span>
                {item.detail && <span className="block text-ink-muted">{item.detail}</span>}
              </span>
            </li>
          ))}
        </ul>

        {bundleAdvantage != null && (
          <div className="mt-6 rounded-2xl border border-line bg-surface-canvas p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-bold text-ink">
                Bundle advantage:{" "}
                <span className="text-brand-secondary-deep">{formatINR(bundleAdvantage)}</span>
              </p>
              <button
                type="button"
                onClick={() => {
                  setExpanded((v) => !v);
                  if (!expanded) trackEvent("value_stack_opened", { slug: packageSlug });
                }}
                aria-expanded={expanded}
                className="inline-flex items-center gap-1 text-xs font-extrabold text-brand-secondary-deep hover:underline"
              >
                See how the value adds up
                <ChevronDown className={`h-3.5 w-3.5 transition-transform ${expanded ? "rotate-180" : ""}`} />
              </button>
            </div>
            {expanded && (
              <dl className="mt-3 space-y-2 border-t border-line pt-3 text-sm">
                {components!.map((c) => (
                  <div key={c.label} className="flex justify-between gap-4">
                    <dt className="text-ink-muted">
                      {c.label}
                      {c.basis && <span className="block text-[11px] text-ink-muted/70">{c.basis}</span>}
                    </dt>
                    <dd className="shrink-0 font-bold text-ink">{formatINR(c.value as number)}</dd>
                  </div>
                ))}
                <div className="flex justify-between gap-4 border-t border-line pt-2 font-extrabold">
                  <dt className="text-ink">Booked separately</dt>
                  <dd className="text-ink">{formatINR(componentsTotal)}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-ink">This package</dt>
                  <dd className="text-brand-secondary-deep">{formatINR(publicPrice)}</dd>
                </div>
                {commercial.bundleBasis && (
                  <p className="text-[11px] leading-5 text-ink-muted">{commercial.bundleBasis}</p>
                )}
              </dl>
            )}
          </div>
        )}

        <a
          href="#enquiry-form"
          onClick={() => trackEvent("availability_clicked", { slug: packageSlug, source: "value_stack" })}
          className="mt-6 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-brand-cta px-4 text-sm font-extrabold text-ink transition hover:bg-brand-cta-deep"
        >
          Check Dates &amp; Availability <ArrowRight className="h-4 w-4" />
        </a>
      </div>
    </section>
  );
}
