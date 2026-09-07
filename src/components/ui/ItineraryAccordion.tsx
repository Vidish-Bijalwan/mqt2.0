"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface DayItinerary {
  title: string;
  description: string;
}

function itineraryParagraphs(description: string) {
  const cleaned = String(description || "")
    .replace(/Places You[’']ll See/gi, "")
    .replace(/\bSee More\b|\bSee Less\b/gi, "")
    .replace(/([.!?])(?=[A-Z])/g, "$1 ")
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
    <div>
      {itinerary.length > 1 && (
        <div className="mb-4 flex justify-end">
          <button type="button" onClick={toggleAll} className="min-h-10 rounded-full border border-[#cddeda] px-4 text-xs font-extrabold text-[#18594d] transition hover:bg-[#eef6f3] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#28796b]">
            {allOpen ? "Collapse all days" : "Open all days"}
          </button>
        </div>
      )}
      <ol className="relative space-y-4 before:absolute before:bottom-7 before:left-[22px] before:top-7 before:w-px before:bg-[#c9ddd7]">
        {itinerary.map((day, index) => {
          const isOpen = openIndexes.includes(index);
          const contentId = `itinerary-day-${index}`;
          const paragraphs = itineraryParagraphs(day.description);
          const title = day.title.replace(/^day\s*\d+\s*[:.-]?\s*/i, "").trim() || day.title;

          return (
            <li key={`${day.title}-${index}`} className={`relative overflow-hidden rounded-2xl border bg-white transition ${isOpen ? "border-[#9fc6bb] shadow-[0_12px_30px_rgba(11,48,44,0.08)]" : "border-[#dfe9e6] hover:border-[#b7d2ca]"}`}>
              <button
                type="button"
                onClick={() => toggleAccordion(index)}
                aria-expanded={isOpen}
                aria-controls={contentId}
                className="relative z-10 flex min-h-[78px] w-full items-center gap-4 p-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#28796b] sm:px-5"
              >
                <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-4 border-white text-sm font-black shadow-sm ${isOpen ? "bg-[#0b5147] text-white" : "bg-[#eaf3f0] text-[#18594d]"}`}>{index + 1}</span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#b65d25]">Day {index + 1}</span>
                  <span className="mt-1 block pr-2 text-base font-extrabold leading-snug text-[#193b35] sm:text-lg">{title}</span>
                </span>
                <ChevronDown className={`h-5 w-5 shrink-0 text-[#52716a] transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
              </button>
              {isOpen && (
                <div id={contentId} className="border-t border-[#e0ebe8] bg-[#f6faf9] px-5 pb-6 pt-5 sm:pl-20 sm:pr-8">
                  <div className="space-y-4 text-sm leading-7 text-[#516963] sm:text-[15px]">
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
