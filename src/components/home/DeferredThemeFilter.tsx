"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";

const ThemeFilter = dynamic(() => import("./ThemeFilter"), {
  ssr: false,
  loading: () => <ThemeFilterSkeleton />,
});

function ThemeFilterSkeleton() {
  return (
    <div className="min-h-28" aria-hidden="true">
      <div className="flex flex-wrap gap-3">
        {Array.from({ length: 9 }, (_, index) => (
          <span
            key={index}
            className="h-11 w-28 rounded-full bg-[#e8efec]"
          />
        ))}
      </div>
    </div>
  );
}

/**
 * Keeps the package catalogue and theme-filter controls out of the initial
 * homepage JavaScript. The section loads well before it enters the viewport.
 */
export default function DeferredThemeFilter() {
  const anchorRef = useRef<HTMLDivElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const anchor = anchorRef.current;
    if (!anchor) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setShouldLoad(true);
        observer.disconnect();
      },
      { rootMargin: "900px 0px" },
    );

    observer.observe(anchor);
    return () => observer.disconnect();
  }, []);

  return <div ref={anchorRef}>{shouldLoad ? <ThemeFilter /> : <ThemeFilterSkeleton />}</div>;
}
