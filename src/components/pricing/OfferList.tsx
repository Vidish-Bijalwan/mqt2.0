import {
  ArrowUpCircle,
  CalendarClock,
  Gift,
  HeartHandshake,
  Users,
  Wallet,
} from "lucide-react";
import { commercialDefaults, formatINR } from "@/data/commercial/defaults";
import type { EvaluatedOffer, OfferType } from "@/types/commercial";

interface OfferListProps {
  /** Engine-evaluated offers (eligibility already decided server-side). */
  evaluatedOffers: EvaluatedOffer[];
}

const TYPE_ICON: Record<OfferType, typeof Gift> = {
  EARLY_BIRD: CalendarClock,
  GROUP_UNLOCK: Users,
  VALUE_BONUS: Gift,
  UPGRADE: ArrowUpCircle,
  WALLET_CREDIT: Wallet,
  REFERRAL: HeartHandshake,
};

const TYPE_LABEL: Record<OfferType, string> = {
  EARLY_BIRD: "Early-bird",
  GROUP_UNLOCK: "Group unlock",
  VALUE_BONUS: "Included bonus",
  UPGRADE: "Upgrade",
  WALLET_CREDIT: "Trip credit",
  REFERRAL: "Referral",
};

function formatDate(iso: string): string {
  const d = new Date(iso);
  return Number.isFinite(d.getTime())
    ? d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
    : iso;
}

/**
 * Renders eligible offers. The engine decides eligibility — this component
 * only presents. Returns null when there is nothing eligible to show.
 */
export default function OfferList({ evaluatedOffers }: OfferListProps) {
  const visible = evaluatedOffers.filter((e) => e.eligible);
  if (visible.length === 0) return null;

  return (
    <section aria-label="Available offers" className="mt-8">
      <h3 className="text-xs font-extrabold uppercase tracking-[0.18em] text-ink-muted">
        Available offers
      </h3>
      <ul className="mt-4 space-y-3">
        {visible.map(({ offer, displayValue }) => {
          const Icon = TYPE_ICON[offer.type];
          return (
            <li
              key={offer.id}
              className="flex gap-4 rounded-2xl border border-line bg-surface-card p-4 sm:p-5"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-secondary/12">
                <Icon className="h-5 w-5 text-brand-secondary-deep" />
              </span>
              <div className="min-w-0 text-sm leading-6">
                <p className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-brand-secondary-deep">
                    {TYPE_LABEL[offer.type]}
                  </span>
                  {displayValue != null && (
                    <span className="rounded-full bg-brand-secondary/12 px-2.5 py-0.5 text-xs font-extrabold text-brand-secondary-deep">
                      {offer.type === "VALUE_BONUS" ? `Value ${formatINR(displayValue)}` : `${formatINR(displayValue)}/person`}
                    </span>
                  )}
                </p>
                <p className="mt-1 font-bold text-ink">{offer.headline}</p>
                <p className="text-ink-muted">{offer.detail}</p>

                {offer.type === "EARLY_BIRD" && offer.expiresAt && (
                  <p className="mt-1 text-xs text-ink-muted">
                    Book by {formatDate(offer.expiresAt)}
                    {offer.inventorySource ? ` · ${offer.inventorySource}` : ""}
                  </p>
                )}
                {offer.type === "GROUP_UNLOCK" && (
                  <p className="mt-1 text-xs text-ink-muted">
                    Unlocks for groups of {offer.threshold ?? commercialDefaults.groupUnlockDefaultThreshold}+ travellers travelling together.
                  </p>
                )}
                {offer.type === "VALUE_BONUS" && offer.bonusItems && offer.bonusItems.length > 0 && (
                  <ul className="mt-2 space-y-1">
                    {offer.bonusItems.map((b) => (
                      <li key={b.label} className="text-[13px] text-ink">
                        · {b.label}
                        {b.value != null && offer.comparisonBasis && (
                          <span className="text-ink-muted"> ({formatINR(b.value)})</span>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
                {offer.type === "VALUE_BONUS" && offer.comparisonBasis && (
                  <p className="mt-1 text-[11px] text-ink-muted">Value basis: {offer.comparisonBasis}</p>
                )}
                {offer.type === "UPGRADE" && offer.upgradeNote && (
                  <p className="mt-1 text-xs text-ink-muted">{offer.upgradeNote}</p>
                )}
                {offer.type === "WALLET_CREDIT" && (
                  <p className="mt-1 text-xs text-ink-muted">
                    {[
                      offer.walletExpiry ? `Valid till ${formatDate(offer.walletExpiry)}` : null,
                      offer.walletMinimumSpend ? `Min. spend ${formatINR(offer.walletMinimumSpend)}` : null,
                      offer.walletRedemptionRules,
                    ]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                )}
                {offer.type === "REFERRAL" && offer.referralConditions && (
                  <p className="mt-1 text-xs text-ink-muted">{offer.referralConditions}</p>
                )}
                {offer.eligibility && (
                  <p className="mt-1 text-xs text-ink-muted">Eligibility: {offer.eligibility}</p>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
