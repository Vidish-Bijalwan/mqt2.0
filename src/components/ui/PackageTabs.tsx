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
  // Keep the first render identical on the server and client. The hash is
  // applied after hydration so a deep link cannot cause a tab mismatch.
  const [activeId, setActiveId] = useState<string>(sections[0]?.id || "");
  const active = sections.find((s) => s.id === activeId) || sections[0];

  useEffect(() => {
    const syncTabFromHash = () => {
      const fromHash = window.location.hash.replace("#", "");
      if (validIds.includes(fromHash)) setActiveId(fromHash);
    };

    syncTabFromHash();

    const onHashChange = () => {
      syncTabFromHash();
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
      <div className="sticky top-2 z-30 mb-5 rounded-2xl border border-[#d7e5e1] bg-white/92 p-1.5 shadow-[0_10px_30px_rgba(11,48,44,0.09)] backdrop-blur-xl">
        <div className="flex gap-1 overflow-x-auto" role="tablist" aria-label="Package sections">
          {sections.map((s) => (
            <button
              key={s.id}
              role="tab"
              aria-selected={s.id === active.id}
              aria-controls={`package-panel-${s.id}`}
              onClick={() => selectTab(s.id)}
              className={`min-h-11 whitespace-nowrap rounded-xl px-4 text-[13px] font-extrabold transition-colors md:px-5 md:text-sm ${
                s.id === active.id
                  ? "bg-[#0b5147] text-white shadow-sm"
                  : "text-[#61746f] hover:bg-[#eef5f3] hover:text-[#164b42]"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div id={`package-panel-${active.id}`} role="tabpanel" aria-label={active.label}>{active.content}</div>
    </div>
  );
}
