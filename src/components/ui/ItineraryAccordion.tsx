"use client";

import { useState } from "react";
import { ChevronDown, Clock3, Compass, Route } from "lucide-react";

interface DayItinerary {
  title: string;
  description: string;
}

function itineraryParagraphs(description: string) {
  const cleaned = String(description || "")
    .replace(/Places You[’']ll See/gi, "")
    .replace(/\bSee More\b|\bSee Less\b/gi, "")
    .replace(/([.!?])(?=[A-Z])/g, "$1 ")
    .replace(/([a-z,)])([A-Z][a-z]+(?:\s+[A-Z][a-z]+){0,3}[–-])/g, "$1 $2")
    .replace(/\s+/g, " ")
    .trim();

  if (!cleaned) return [];
  const sentences = cleaned.split(/(?<=[.!?])\s+(?=[A-Z])/);
  const paragraphs: string[] = [];
  let current = "";

  for (const sentence of sentences) {
    if (current && current.length + sentence.length > 320) {
      paragraphs.push(current);
      current = sentence;
    } else {
      current = current ? `${current} ${sentence}` : sentence;
    }
  }
  if (current) paragraphs.push(current);
  return paragraphs;
}

function dayMeta(title: string, description: string) {
  const source = `${title} ${description}`;
  const distance = source.match(/\b(\d+(?:\.\d+)?)\s*km\b/i)?.[0];
  const drive = source.match(/\b(\d+(?:\.\d+)?)\s*(?:hrs?|hours?)\b/i)?.[0];

  let rhythm = "Balanced day";
  if (/arrival|departure|drop[- ]?off/i.test(title)) rhythm = "Arrival & orientation";
  else if (/full[- ]day|sightseeing|excursion|safari/i.test(title)) rhythm = "Immersive exploration";
  else if (/transfer|\bto\b|drive/i.test(title)) rhythm = "Scenic road journey";
  else if (/trek|walk|hike|rafting|ski/i.test(source)) rhythm = "Active adventure";
  else if (/leisure|free time|relax/i.test(source)) rhythm = "Unhurried pace";

  const sentences = itineraryParagraphs(description).join(" ").split(/(?<=[.!?])\s+/);
  const special = sentences.find((sentence) =>
    /must-visit|beautiful|scenic|famous|peaceful|explore|experience|capture|panoramic|stunning|sacred/i.test(sentence) &&
    sentence.length > 45,
  );

  return { distance, drive, rhythm, special };
}

export default function ItineraryAccordion({ itinerary }: { itinerary: DayItinerary[] }) {
  const [openIndexes, setOpenIndexes] = useState<number[]>([0]); // Open first day by default

  const toggleAccordion = (index: number) => {
    setOpenIndexes((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const allOpen = openIndexes.length === itinerary.length;
  const toggleAll = () => setOpenIndexes(allOpen ? [] : itinerary.map((_, index) => index));

  if (!itinerary || itinerary.length === 0) {
    return <p className="rounded-xl border border-dashed border-brand-sage bg-brand-paper p-5 text-sm italic text-gray-600">Detailed itinerary is being tailored by our travel team for this package.</p>;
  }

  return (
    <div className="itinerary-journey">
      {itinerary.length > 1 && (
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#dce8e4] bg-[#f4f8f6] px-4 py-3">
          <p className="flex items-center gap-2 text-xs font-bold text-[#4f6a63]">
            <Compass className="h-4 w-4 text-[#d86527]" />
            {itinerary.length} thoughtfully paced days
          </p>
          <button type="button" onClick={toggleAll} className="min-h-10 rounded-full border border-[#cddeda] px-4 text-xs font-extrabold text-[#18594d] transition hover:bg-[#eef6f3] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#28796b]">
            {allOpen ? "Collapse all days" : "Open all days"}
          </button>
        </div>
      )}
      <ol className="relative space-y-4 before:absolute before:bottom-7 before:left-[23px] before:top-7 before:w-px before:bg-[linear-gradient(#d36b2c,#8bb6a9)] sm:before:left-[27px]">
        {itinerary.map((day, index) => {
          const isOpen = openIndexes.includes(index);
          const contentId = `itinerary-day-${index}`;
          const paragraphs = itineraryParagraphs(day.description);
          const title = day.title.replace(/^day\s*\d+\s*[:.-]?\s*/i, "").trim() || day.title;
          const meta = dayMeta(day.title, day.description);

          return (
            <li key={`${day.title}-${index}`} className={`relative overflow-hidden rounded-[22px] border bg-white transition ${isOpen ? "border-[#9fc6bb] shadow-[0_16px_38px_rgba(11,48,44,0.1)]" : "border-[#dfe9e6] hover:border-[#b7d2ca]"}`}>
              <button
                type="button"
                onClick={() => toggleAccordion(index)}
                aria-expanded={isOpen}
                aria-controls={contentId}
                className="relative z-10 flex min-h-[84px] w-full items-center gap-3.5 p-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#28796b] sm:gap-5 sm:px-5"
              >
                <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-4 border-white text-sm font-black tabular-nums shadow-sm ${isOpen ? "bg-[#0b5147] text-white" : "bg-[#eaf3f0] text-[#18594d]"}`}>{String(index + 1).padStart(2, "0")}</span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#b65d25]">Day {index + 1}</span>
                  <span className="font-display mt-1 block pr-2 text-[17px] font-bold leading-snug text-[#173b35] sm:text-xl">{title}</span>
                </span>
                <ChevronDown className={`h-5 w-5 shrink-0 text-[#52716a] transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
              </button>
              {isOpen && (
                <div id={contentId} className="border-t border-[#e0ebe8] bg-[linear-gradient(135deg,#f7faf8_0%,#eef5f2_100%)] px-5 pb-7 pt-5 sm:pl-[84px] sm:pr-8">
                  <div className="mb-5 flex flex-wrap gap-2">
                    <span className="inline-flex min-h-8 items-center gap-1.5 rounded-full border border-[#cfe0db] bg-white px-3 text-[11px] font-bold text-[#345d53]">
                      <Compass className="h-3.5 w-3.5 text-[#d86527]" /> {meta.rhythm}
                    </span>
                    {meta.distance && (
                      <span className="inline-flex min-h-8 items-center gap-1.5 rounded-full border border-[#cfe0db] bg-white px-3 text-[11px] font-bold text-[#345d53]">
                        <Route className="h-3.5 w-3.5 text-[#d86527]" /> {meta.distance}
                      </span>
                    )}
                    {meta.drive && (
                      <span className="inline-flex min-h-8 items-center gap-1.5 rounded-full border border-[#cfe0db] bg-white px-3 text-[11px] font-bold text-[#345d53]">
                        <Clock3 className="h-3.5 w-3.5 text-[#d86527]" /> Approx. {meta.drive}
                      </span>
                    )}
                  </div>
                  {meta.special && (
                    <div className="mb-5 border-l-2 border-[#ef7a2f] pl-4">
                      <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#9b5429]">Why this day stands out</p>
                      <p className="font-display mt-1 text-[15px] font-semibold leading-6 text-[#234a42] sm:text-base">{meta.special}</p>
                    </div>
                  )}
                  <div className="space-y-4 text-[15px] leading-7 text-[#4d665f]">
                    {paragraphs.map((paragraph, paragraphIndex) => <p key={paragraphIndex}>{paragraph}</p>)}
                  </div>
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
