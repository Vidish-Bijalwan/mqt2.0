"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { Package } from "@/data/allPackages";
import PackageListCard from "@/components/ui/PackageListCard";

/* ─────────────────────────────────────────────────────────────────────────
   PackageListWithMore — renders the first N matched packages on an
   experience category page and reveals the rest via a "Show More" button.
   Keeps the full (often large) match set server-rendered and serializable.
   ───────────────────────────────────────────────────────────────────────── */

const INITIAL = 6;

export default function PackageListWithMore({ packages }: { packages: Package[] }) {
  const [count, setCount] = useState(INITIAL);
  const shown = packages.slice(0, count);

  return (
    <div>
      <div className="flex flex-col gap-4">
        {shown.map((pkg, idx) => (
          <PackageListCard key={`${pkg.slug}-${idx}`} pkg={pkg} />
        ))}
      </div>

      {packages.length > count && (
        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => setCount((c) => Math.min(c + INITIAL, packages.length))}
            className="inline-flex items-center gap-2 rounded-full border border-brand-orange bg-brand-orange-light px-6 py-2.5 text-sm font-bold text-brand-orange-dark transition-all duration-200 hover:bg-brand-orange hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2"
          >
            Show more packages ({packages.length - count} remaining)
            <ChevronDown className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      )}
    </div>
  );
}
