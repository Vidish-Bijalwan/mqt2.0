import { ArrowRight, BadgePercent, CheckCircle2, MessageCircle, Phone } from "lucide-react";
import { siteConfig } from "@/data/siteConfig";
import type { PackageViewModel } from "@/utils/packageDetails";
import ConvertedPrice from "@/components/currency/ConvertedPrice";

/** Sticky pricing / quote sidebar card. */
export default function PackageSidebar({ vm }: { vm: PackageViewModel }) {
  const {
    pkg,
    showPrice,
    displayPrice,
    crossedOutPrice,
    saveAmount,
    hasQuickInfo,
    hasDuration,
    hasStartPoint,
    hasEndPoint,
    startPoint,
    endPoint,
    packageWhatsappUrl,
  } = vm;

  return (
    <aside className="hidden lg:col-span-1 lg:block">
      <div className="sticky top-5 overflow-hidden rounded-[24px] border border-line bg-white shadow-[0_18px_55px_rgba(11,31,51,0.1)]">
        <div className="bg-brand-primary-deep p-6 text-white">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-brand-secondary-pale">Plan this journey</p>
          <div className="mt-3 text-3xl font-black tracking-tight">{showPrice ? <>INR {displayPrice}</> : 'Tailored pricing'}</div>
          {showPrice && (
            <div className="mt-1 min-h-[16px]">
              <ConvertedPrice amountInr={vm.priceInfo.deal} className="text-xs font-semibold text-white/60" />
            </div>
          )}
          <p className="mt-1 text-xs leading-5 text-white/65">{showPrice ? 'Starting price per adult' : 'Based on your dates, group size, and preferences'}</p>
          {crossedOutPrice && (
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="text-sm text-white/45 line-through">INR {crossedOutPrice}</span>
              <span className="inline-flex items-center gap-1 rounded-full bg-brand-secondary px-2.5 py-1 text-[10px] font-extrabold text-white"><BadgePercent className="h-3 w-3" /> Save INR {saveAmount}</span>
            </div>
          )}
        </div>

        <div className="p-6">
          {hasQuickInfo && (
            <dl className="space-y-4 border-b border-line pb-6 text-sm">
              {hasDuration && <div className="flex justify-between gap-5"><dt className="text-ink-muted">Duration</dt><dd className="text-right font-bold text-ink">{pkg.duration}</dd></div>}
              {hasStartPoint && <div className="flex justify-between gap-5"><dt className="text-ink-muted">Starts</dt><dd className="text-right font-bold capitalize text-ink">{startPoint}</dd></div>}
              {hasEndPoint && <div className="flex justify-between gap-5"><dt className="text-ink-muted">Ends</dt><dd className="text-right font-bold capitalize text-ink">{endPoint}</dd></div>}
            </dl>
          )}

          <div className="mt-6 space-y-3">
            <a href="#enquiry-form" className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-brand-cta px-4 text-sm font-extrabold text-ink transition hover:bg-brand-cta-deep">
              Get a tailored quote <ArrowRight className="h-4 w-4" />
            </a>
            <a href={packageWhatsappUrl} target="_blank" rel="noopener noreferrer" className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border border-line bg-surface-canvas px-4 text-sm font-extrabold text-brand-secondary-deep transition hover:bg-brand-secondary/10">
              <MessageCircle className="h-4 w-4" /> Chat on WhatsApp
            </a>
            <a href={`tel:${siteConfig.phoneTel}`} className="flex min-h-11 w-full items-center justify-center gap-2 text-sm font-bold text-ink-muted hover:text-brand-primary">
              <Phone className="h-4 w-4" /> {siteConfig.phone}
            </a>
          </div>

          <div className="mt-6 space-y-3 border-t border-line pt-5 text-xs leading-5 text-ink-muted">
            <p className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-state-success" /> No payment is required to ask for a quote.</p>
            <p className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-state-success" /> Dates, pace, and stays can be discussed with the travel team.</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
