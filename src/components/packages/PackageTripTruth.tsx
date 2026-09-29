import { BadgeIndianRupee, Undo2, MapPin } from "lucide-react";
import {
  mqtStandardCancellationTiers,
  mqtStandardCancellationNotes,
  mqtStandardRefundNotes,
  mqtStandardPriceTerms,
} from "@/data/tripEssentials";
import type { PackageViewModel } from "@/utils/packageDetails";

/**
 * Feature A — "Trip essentials": the honest fine print on every package page.
 *
 * Three panels rendered from REAL existing records only:
 *  1. Price clarity — what the shown price covers (per-person starting price,
 *     tied to the real inclusions list; official INR/change terms from MQT's
 *     own Terms & Conditions).
 *  2. Cancellation & refunds — plan-specific scraped notes when present, plus
 *     MQT's official standard cancellation policy (transcribed from the
 *     company T&C document, applies to every booking).
 *  3. Pickup & logistics — scraped "Pick up point / Reporting Point" and
 *     "Meet & Greet" blocks and matching FAQ answers when present; an honest
 *     fallback when the record carries none.
 *
 * Nothing here is invented: empty records omit gracefully.
 */
export default function PackageTripTruth({ vm }: { vm: PackageViewModel }) {
  const {
    showPrice,
    displayPrice,
    crossedOutPrice,
    saveAmount,
    inclusions,
    cancellationNotes,
    cancellationFaqs,
    logisticsNotes,
    logisticsFaqs,
  } = vm;

  const priceCoversLine = inclusions.length > 0
    ? "It covers exactly the services listed under What’s included for this package — nothing is added later at checkout."
    : "It covers the services listed for this package — nothing is added later at checkout.";

  return (
    <section className="overflow-hidden rounded-[24px] border border-[#dce8e5] bg-white shadow-[0_18px_55px_rgba(11,48,44,0.08)]">
      <div className="p-6 sm:p-8 lg:p-10">
        <div className="mb-8 max-w-2xl">
          <p className="text-[11px] font-extrabold uppercase tracking-[0.24em] text-brand-orange-text">
            Trip essentials
          </p>
          <h2 className="font-display mt-2 text-[28px] font-bold text-[#102b28] sm:text-4xl">
            The honest fine print
          </h2>
          <p className="mt-3 text-sm leading-6 text-[#657772]">
            Everything on this page comes from this package&apos;s own records or MQT&apos;s
            official terms — nothing is guessed.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {/* --- 1. Price clarity --- */}
          <div className="flex flex-col rounded-2xl bg-[#eef7f3] p-5 sm:p-6">
            <div className="mb-4 flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#124b3e] text-white">
                <BadgeIndianRupee className="h-5 w-5" />
              </span>
              <h3 className="text-base font-extrabold text-[#124b3e]">What the price means</h3>
            </div>
            {showPrice ? (
              <>
                <p className="text-3xl font-extrabold tracking-tight text-[#102b28]">
                  ₹{displayPrice}
                </p>
                <p className="mt-1 text-xs font-semibold uppercase tracking-[0.14em] text-[#16815f]">
                  per person · starting price
                </p>
                {crossedOutPrice && (
                  <p className="mt-2 text-sm text-[#536763]">
                    List price{" "}
                    <span className="line-through">₹{crossedOutPrice}</span>
                    {saveAmount && (
                      <span className="ml-2 font-bold text-[#16815f]">You save ₹{saveAmount}</span>
                    )}
                  </p>
                )}
                <p className="mt-4 text-sm leading-6 text-[#355e54]">{priceCoversLine}</p>
              </>
            ) : (
              <>
                <p className="text-xl font-extrabold text-[#102b28]">Priced for your dates</p>
                <p className="mt-2 text-sm leading-6 text-[#355e54]">
                  No fixed price on this page — your dates, group size and preferences set
                  the final total. Send a query and we&apos;ll confirm the exact price in writing
                  before you pay anything.
                </p>
              </>
            )}
            <div className="mt-auto pt-5">
              <ul className="space-y-2 border-t border-[#d5e6e0] pt-4">
                {mqtStandardPriceTerms.map((term) => (
                  <li key={term} className="text-[13px] leading-5 text-[#5a716b]">
                    {term}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* --- 2. Cancellation & refunds --- */}
          <div className="flex flex-col rounded-2xl bg-[#fff6ef] p-5 sm:p-6">
            <div className="mb-4 flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#7b431f] text-white">
                <Undo2 className="h-5 w-5" />
              </span>
              <h3 className="text-base font-extrabold text-[#7b431f]">Cancellation &amp; refunds</h3>
            </div>
            {cancellationNotes.length > 0 && (
              <div className="mb-5">
                <p className="mb-2 text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#a4632c]">
                  This package&apos;s plan notes
                </p>
                <ul className="space-y-2">
                  {cancellationNotes.map((note, i) => (
                    <li key={i} className="text-sm leading-6 text-[#765943]">
                      {note}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <p className="mb-2 text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#a4632c]">
              MQT standard policy — applies to every booking
            </p>
            <dl className="space-y-2.5">
              {mqtStandardCancellationTiers.map((tier) => (
                <div key={tier.deadline} className="flex items-baseline justify-between gap-3 text-sm">
                  <dt className="text-[#765943]">{tier.deadline}</dt>
                  <dd className="shrink-0 font-extrabold text-[#7b431f]">{tier.charge}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-auto pt-5">
              <ul className="space-y-2 border-t border-[#f0ddc8] pt-4">
                {mqtStandardCancellationNotes.map((note) => (
                  <li key={note} className="text-[13px] leading-5 text-[#8a6a4f]">
                    {note}
                  </li>
                ))}
                {mqtStandardRefundNotes.map((note) => (
                  <li key={note} className="text-[13px] leading-5 text-[#8a6a4f]">
                    {note}
                  </li>
                ))}
                {cancellationFaqs.map((faq) => (
                  <li key={faq.q} className="text-[13px] leading-5 text-[#8a6a4f]">
                    <span className="font-bold text-[#7b431f]">{faq.q}</span> {faq.a}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* --- 3. Pickup & logistics --- */}
          <div className="flex flex-col rounded-2xl bg-[#f2f7f6] p-5 sm:p-6 md:col-span-2 xl:col-span-1">
            <div className="mb-4 flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1b3833] text-white">
                <MapPin className="h-5 w-5" />
              </span>
              <h3 className="text-base font-extrabold text-[#1b3833]">Pickup &amp; logistics</h3>
            </div>
            {logisticsNotes.length > 0 ? (
              <ul className="space-y-3">
                {logisticsNotes.map((note, i) => (
                  <li key={i} className="flex gap-3 text-sm leading-6 text-[#314944]">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#ef7a2f]" />
                    <span>{note}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm leading-6 text-[#314944]">
                Pickup and meeting-point details are confirmed personally for your dates —
                mention your arrival city in the enquiry below and we&apos;ll arrange it.
              </p>
            )}
            {logisticsFaqs.length > 0 && (
              <div className="mt-5 space-y-3 border-t border-[#dce8e5] pt-4">
                {logisticsFaqs.map((faq) => (
                  <div key={faq.q} className="text-sm leading-6">
                    <p className="font-bold text-[#1b3833]">{faq.q}</p>
                    <p className="mt-1 text-[#536763]">{faq.a}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
