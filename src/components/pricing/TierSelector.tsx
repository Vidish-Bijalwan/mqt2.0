"use client";

import { useState } from "react";
import { ArrowRight, Check, Minus } from "lucide-react";
import { trackEvent } from "@/lib/analytics";
import { formatINR } from "@/data/commercial/defaults";
import type { TierDefinition } from "@/types/commercial";

interface TierSelectorProps {
  tiers: TierDefinition[];
  packageSlug: string;
  packageTitle: string;
  /** Real public price — used when the base tier has no explicit priceFrom. */
  basePrice: number;
}

/**
 * Good / Better / Best tier selector.
 *
 * Rules enforced here:
 * - Differences come from config only — never invented in the component.
 * - A tier without a real price shows "Price on enquiry", never a guess.
 * - Badges render as authored; only neutral labels may be used without
 *   verified booking data (see config guide).
 */
export default function TierSelector({ tiers, packageSlug, packageTitle, basePrice }: TierSelectorProps) {
  const [selected, setSelected] = useState(tiers[0]?.id ?? "");

  if (tiers.length === 0) return null;

  const chooseTier = (tier: TierDefinition) => {
    setSelected(tier.id);
    trackEvent("tier_selected", { slug: packageSlug, tier: tier.id });
    if (tier.priceFrom == null) {
      // Quote-only tier: carry the choice into the enquiry flow.
      try {
        sessionStorage.setItem(
          "mqt-tier",
          JSON.stringify({ slug: packageSlug, tier: tier.name, packageTitle }),
        );
      } catch {
        // Storage unavailable — the anchor still works.
      }
      document.getElementById("enquiry-form")?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section aria-label="Choose your comfort level" className="mt-8">
      <h3 className="text-xs font-extrabold uppercase tracking-[0.18em] text-ink-muted">
        Choose your comfort level
      </h3>
      <div className="mt-4 grid gap-4 md:grid-cols-3" role="radiogroup" aria-label="Package tiers">
        {tiers.map((tier, index) => {
          const isSelected = selected === tier.id;
          const isMiddle = tiers.length === 3 && index === 1;
          const price = tier.priceFrom ?? (index === 0 ? basePrice : null);
          return (
            <div
              key={tier.id}
              role="radio"
              aria-checked={isSelected}
              tabIndex={0}
              onClick={() => chooseTier(tier)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  chooseTier(tier);
                }
              }}
              className={`relative cursor-pointer rounded-[20px] border-2 bg-surface-card p-5 transition focus-visible:outline-2 focus-visible:outline-brand-secondary ${
                isSelected
                  ? "border-brand-secondary shadow-[0_14px_40px_rgba(18,124,130,0.16)]"
                  : "border-line hover:border-brand-secondary/50"
              }`}
            >
              {tier.badge && (
                <span
                  className={`absolute -top-3 left-5 rounded-full px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.12em] ${
                    isMiddle ? "bg-brand-secondary text-white" : "bg-surface-canvas text-ink-muted ring-1 ring-line"
                  }`}
                >
                  {tier.badge}
                </span>
              )}
              <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-brand-secondary-deep">
                {tier.name}
              </p>
              <p className="mt-1 text-lg font-black text-ink">
                {price != null ? formatINR(price) : "Price on enquiry"}
              </p>
              {price != null && <p className="text-[11px] text-ink-muted">per person · starting price</p>}
              <p className="mt-2 text-xs leading-5 text-ink-muted">{tier.tagline}</p>

              <ul className="mt-4 space-y-2 border-t border-line pt-4">
                {tier.differences.map((d) => (
                  <li key={d.label} className="flex gap-2 text-[13px] leading-5">
                    {d.included ? (
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-state-success" strokeWidth={3} />
                    ) : (
                      <Minus className="mt-0.5 h-4 w-4 shrink-0 text-ink-muted/50" />
                    )}
                    <span className={d.included ? "text-ink" : "text-ink-muted/70 line-through"}>
                      {d.label}
                      {d.note && <span className="text-ink-muted"> · {d.note}</span>}
                    </span>
                  </li>
                ))}
              </ul>

              <span
                className={`mt-5 flex min-h-11 w-full items-center justify-center gap-2 rounded-xl text-sm font-extrabold transition ${
                  isSelected
                    ? "bg-brand-cta text-ink hover:bg-brand-cta-deep"
                    : "border border-line bg-surface-canvas text-ink hover:border-brand-secondary/60"
                }`}
              >
                {price != null ? (
                  <>Choose {tier.name} <ArrowRight className="h-4 w-4" /></>
                ) : (
                  <>Get my quote <ArrowRight className="h-4 w-4" /></>
                )}
              </span>
              {!tier.verified && (
                <p className="mt-2 text-center text-[11px] text-ink-muted">
                  Final inclusions &amp; price confirmed on enquiry.
                </p>
              )}
              <span className="sr-only">{packageTitle} — {tier.name} tier</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
