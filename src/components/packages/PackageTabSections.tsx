import { Check, X } from "lucide-react";
import PackageTabs, { type PackageTabSection } from "@/components/ui/PackageTabs";
import ItineraryAccordion from "@/components/ui/ItineraryAccordion";
import BlockRenderer from "@/components/ui/BlockRenderer";
import ExpandableText from "@/components/ui/ExpandableText";
import PackageTripTruth from "@/components/packages/PackageTripTruth";
import type { PackageViewModel } from "@/utils/packageDetails";

/**
 * Overview / Itinerary / Inclusions / FAQs tab sections.
 * Same section JSX as the original page.tsx `sections` array.
 */
export default function PackageTabSections({ vm }: { vm: PackageViewModel }) {
  const {
    overviewText,
    highlights,
    hasLegacyItinerary,
    hasScrapedItinerary,
    legacyItinerary,
    safeItineraryBlocks,
    suggestedItinerary,
    editorialItinerary,
    inclusions,
    exclusions,
    allFaqs,
  } = vm;

  // Keep the buying journey concise: experience, plan, inclusions, then FAQs.
  const sections: PackageTabSection[] = [
    {
      id: "overview",
      label: "The experience",
      content: (
        <section className="overflow-hidden rounded-[24px] border border-[#dce8e5] bg-white shadow-[0_18px_55px_rgba(11,48,44,0.08)]">
          <div className="p-6 sm:p-8 lg:p-10">
            <p className="mb-3 text-[11px] font-extrabold uppercase tracking-[0.24em] text-brand-orange-text">The experience</p>
            <h2 className="font-display max-w-2xl text-[28px] font-bold leading-tight text-[#102b28] sm:text-4xl">
              More than a route. A journey designed around how you want to feel.
            </h2>
            {overviewText ? (
              <ExpandableText
                text={overviewText}
                limit={680}
                className="mt-5 max-w-3xl text-[15px] leading-7 text-[#536763] sm:text-base"
              />
            ) : (
              <p className="mt-5 max-w-2xl text-[15px] leading-7 text-[#536763]">
                This trip is tailored after a short conversation about your dates, group, pace, and preferences.
              </p>
            )}

            {highlights.length > 0 && (
              <div className="mt-9 border-t border-[#e4ecea] pt-8">
                <div className="mb-5 flex flex-wrap items-end justify-between gap-2">
                  <div>
                    <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#6f817d]">Worth the journey</p>
                    <h3 className="font-display mt-1 text-2xl font-bold text-[#102b28]">Moments you can look forward to</h3>
                  </div>
                  <span className="text-xs font-semibold text-[#6f817d]">Curated from this itinerary</span>
                </div>
                <ul className="grid gap-3 sm:grid-cols-2">
                  {highlights.map((highlight: string) => (
                    <li key={highlight} className="flex gap-3 rounded-2xl bg-[#f2f7f6] p-4 text-sm leading-6 text-[#314944]">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#ef7a2f]" />
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>
      ),
    },
    ...(hasLegacyItinerary || hasScrapedItinerary || suggestedItinerary.length > 0 ? [{
      id: "itinerary",
      label: "Day by day",
      content: (
        <section className="rounded-[24px] border border-[#dce8e5] bg-white p-6 shadow-[0_18px_55px_rgba(11,48,44,0.08)] sm:p-8 lg:p-10">
          <div className="mb-8 max-w-2xl">
            <p className="text-[11px] font-extrabold uppercase tracking-[0.24em] text-brand-orange-text">{suggestedItinerary.length > 0 && editorialItinerary.length === 0 ? "Suggested itinerary" : "Day by day"}</p>
            <h2 className="font-display mt-2 text-[28px] font-bold text-[#102b28] sm:text-4xl">See how the journey unfolds</h2>
            <p className="mt-3 text-sm leading-6 text-[#657772]">{suggestedItinerary.length > 0 && editorialItinerary.length === 0 ? "This starting plan keeps every day visible and will be tailored to your dates, transport and preferred pace before booking." : "Open each day for the plan, travel flow, and experiences included along the way."}</p>
          </div>
          {hasLegacyItinerary ? <ItineraryAccordion itinerary={legacyItinerary} /> : hasScrapedItinerary ? <BlockRenderer blocks={safeItineraryBlocks} /> : <ItineraryAccordion itinerary={suggestedItinerary} />}
        </section>
      ),
    }] : []),
    ...(inclusions.length > 0 || exclusions.length > 0 ? [{
      id: "includes",
      label: "What’s included",
      content: (
        <section className="rounded-[24px] border border-[#dce8e5] bg-white p-6 shadow-[0_18px_55px_rgba(11,48,44,0.08)] sm:p-8 lg:p-10">
          <div className="mb-8 max-w-2xl">
            <p className="text-[11px] font-extrabold uppercase tracking-[0.24em] text-brand-orange-text">Clear before you book</p>
            <h2 className="font-display mt-2 text-[28px] font-bold text-[#102b28] sm:text-4xl">What the package covers</h2>
          </div>
          <div className={`grid gap-5 ${inclusions.length > 0 && exclusions.length > 0 ? 'md:grid-cols-2' : ''}`}>
            {inclusions.length > 0 && (
              <div className="rounded-2xl bg-[#eef7f3] p-5 sm:p-6">
                <h3 className="mb-4 text-base font-extrabold text-[#124b3e]">Included in your plan</h3>
                <ul className="space-y-3">
                  {inclusions.map((item: string, i: number) => (
                    <li key={i} className="flex items-start gap-3 text-sm leading-6 text-[#355e54]">
                      <Check className="mt-1 h-4 w-4 shrink-0 text-[#16815f]" /> <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {exclusions.length > 0 && (
              <div className="rounded-2xl bg-[#fff6ef] p-5 sm:p-6">
                <h3 className="mb-4 text-base font-extrabold text-[#7b431f]">Not included</h3>
                <ul className="space-y-3">
                  {exclusions.map((item: string, i: number) => (
                    <li key={i} className="flex items-start gap-3 text-sm leading-6 text-[#765943]">
                      <X className="mt-1 h-4 w-4 shrink-0 text-[#cc6b2c]" /> <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>
      ),
    }] : []),
    // Feature A — Trip essentials (price clarity, cancellation, logistics)
    // always has the MQT standard policy + price terms, so it always renders.
    {
      id: "essentials",
      label: "Trip essentials",
      content: <PackageTripTruth vm={vm} />,
    },
    ...(allFaqs.length > 0 ? [{
      id: "faqs",
      label: "FAQs",
      content: (
        <section className="rounded-[24px] border border-[#dce8e5] bg-white p-6 shadow-[0_18px_55px_rgba(11,48,44,0.08)] sm:p-8 lg:p-10">
          <div className="mb-7">
            <p className="text-[11px] font-extrabold uppercase tracking-[0.24em] text-brand-orange-text">Good to know</p>
            <h2 className="font-display mt-2 text-[28px] font-bold text-[#102b28] sm:text-4xl">Frequently asked questions</h2>
          </div>
          <div className="divide-y divide-[#e1ebe8] border-y border-[#e1ebe8]">
            {allFaqs.map((faq, i) => (
              <details key={i} className="group py-1">
                <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-4 text-left text-[15px] font-bold text-[#1b3833] marker:content-none">
                  <span>{faq.q}</span>
                  <span className="text-xl font-light text-[#ef7a2f] transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="max-w-3xl pb-5 pr-8 text-sm leading-7 text-[#60736e]">{faq.a}</p>
              </details>
            ))}
          </div>
        </section>
      ),
    }] : []),
  ].filter((s) => s.content !== null);

  return <PackageTabs sections={sections} />;
}
