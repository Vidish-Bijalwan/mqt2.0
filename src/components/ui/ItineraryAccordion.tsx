"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface DayItinerary {
  title: string;
  description: string;
}

export default function ItineraryAccordion({ itinerary }: { itinerary: DayItinerary[] }) {
  const [openIndexes, setOpenIndexes] = useState<number[]>([0]); // Open first day by default

  const toggleAccordion = (index: number) => {
    setOpenIndexes((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  if (!itinerary || itinerary.length === 0) {
    return <p className="text-gray-500 italic">Detailed itinerary is not available for this package.</p>;
  }

  return (
    <div className="space-y-3">
      {itinerary.map((day, index) => {
        const isOpen = openIndexes.includes(index);
        return (
          <div key={index} className="border border-gray-200 rounded-md overflow-hidden bg-white">
            <button
              onClick={() => toggleAccordion(index)}
              className="w-full flex justify-between items-center p-4 text-left hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-inset focus:ring-legacy-orange"
            >
              <h4 className="font-bold text-gray-800 text-base flex-1 pr-4">{day.title}</h4>
              {isOpen ? (
                <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
              )}
            </button>
            {isOpen && (
              <div className="p-4 border-t border-gray-100 bg-gray-50/50">
                <div className="prose max-w-none text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {day.description}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
