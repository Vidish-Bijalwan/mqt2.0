"use client";

import { useState, useEffect, type ReactNode } from "react";

export interface PackageTabSection {
  id: string;
  label: string;
  content: ReactNode;
}

export default function PackageTabs({ sections }: { sections: PackageTabSection[] }) {
  // Persist the active tab in the URL hash (U22) so sections can be
  // shared/bookmarked, e.g. /packages/<slug>#itinerary.
  const validIds = sections.map((s) => s.id);
  const [activeId, setActiveId] = useState<string>(() => {
    if (typeof window !== "undefined") {
      const fromHash = window.location.hash.replace("#", "");
      if (validIds.includes(fromHash)) return fromHash;
    }
    return sections[0]?.id;
  });
  const active = sections.find((s) => s.id === activeId) || sections[0];

  useEffect(() => {
    const onHashChange = () => {
      const fromHash = window.location.hash.replace("#", "");
      if (validIds.includes(fromHash)) setActiveId(fromHash);
    };
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selectTab = (id: string) => {
    setActiveId(id);
    if (typeof window !== "undefined") {
      // Replace instead of push so back/forward history isn't polluted.
      window.history.replaceState(null, "", `#${id}`);
    }
  };

  if (!active) return null;

  return (
    <div>
      {/* Tab bar — sticky below the header, reference-style */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur border border-gray-200 rounded-lg shadow-sm overflow-hidden mb-4">
        <div className="flex overflow-x-auto" role="tablist" aria-label="Package sections">
          {sections.map((s) => (
            <button
              key={s.id}
              role="tab"
              aria-selected={s.id === active.id}
              onClick={() => selectTab(s.id)}
              className={`px-4 md:px-6 py-3 text-[13px] md:text-sm font-bold whitespace-nowrap transition-colors border-b-2 -mb-px ${
                s.id === active.id
                  ? "text-legacy-orange border-legacy-orange bg-orange-50/50"
                  : "text-gray-600 border-transparent hover:text-legacy-orange hover:bg-gray-50"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div>{active.content}</div>
    </div>
  );
}
