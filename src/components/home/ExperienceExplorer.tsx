"use client";

import { useMemo, useState } from "react";
import { Search, ChevronDown, SlidersHorizontal, X } from "lucide-react";
import ExperienceCard from "@/components/ui/ExperienceCard";
import { experienceGroups, type ExperienceGroup } from "@/data/experiencesData";

/* ─────────────────────────────────────────────────────────────────────────
   ExperienceExplorer — interactive category discovery.
   Client component: search + group filter + sort chips + responsive grid.
   Package counts are injected from the server (keeps allPackages out of the
   client bundle).
   ───────────────────────────────────────────────────────────────────────── */

export interface ExplorerExperience {
  slug: string;
  name: string;
  group: ExperienceGroup;
  image: string;
  tagline: string;
  packageCount: number;
}

type SortMode = "count" | "az";

interface ExperienceExplorerProps {
  experiences: ExplorerExperience[];
  /** Show the search/filter toolbar (hidden on small embeds if desired) */
  showToolbar?: boolean;
  /** Max cards to render initially (0 = all) */
  limit?: number;
}

export default function ExperienceExplorer({ experiences, showToolbar = true, limit = 0 }: ExperienceExplorerProps) {
  const [query, setQuery] = useState("");
  const [group, setGroup] = useState<ExperienceGroup | "all">("all");
  const [sort, setSort] = useState<SortMode>("count");
  const [visible, setVisible] = useState(limit > 0 ? Math.min(limit, 8) : experiences.length);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = experiences.filter((e) => {
      const matchesGroup = group === "all" || e.group === group;
      const matchesQuery =
        q === "" || e.name.toLowerCase().includes(q) || e.tagline.toLowerCase().includes(q);
      return matchesGroup && matchesQuery;
    });

    list = [...list].sort((a, b) =>
      sort === "count" ? b.packageCount - a.packageCount : a.name.localeCompare(b.name),
    );
    return list;
  }, [experiences, query, group, sort]);

  const shown = filtered.slice(0, visible);
  const totalShown = experiences.length;
  const hasFilters = query !== "" || group !== "all";

  function resetFilters() {
    setQuery("");
    setGroup("all");
    setVisible(limit > 0 ? Math.min(limit, 8) : experiences.length);
  }

  return (
    <div>
      {/* ── Toolbar: search + group dropdown + sort chips ── */}
      {showToolbar && (
        <div className="mb-8 space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            {/* Search */}
            <label className="relative flex-1">
              <span className="sr-only">Search experiences</span>
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" aria-hidden="true" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search experiences…"
                className="w-full rounded-full border border-gray-300 bg-white py-2.5 pl-10 pr-10 text-sm text-gray-900 shadow-sm transition-colors placeholder:text-gray-400 focus:border-brand-orange focus:outline-none focus:ring-2 focus:ring-brand-orange/30"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  aria-label="Clear search"
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
                >
                  <X className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              )}
            </label>

            {/* Group dropdown */}
            <div className="relative">
              <span className="sr-only">Filter by category group</span>
              <SlidersHorizontal className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" aria-hidden="true" />
              <select
                value={group}
                onChange={(e) => setGroup(e.target.value as ExperienceGroup | "all")}
                className="w-full appearance-none rounded-full border border-gray-300 bg-white py-2.5 pl-10 pr-9 text-sm font-medium text-gray-700 shadow-sm transition-colors focus:border-brand-orange focus:outline-none focus:ring-2 focus:ring-brand-orange/30 sm:w-auto"
              >
                <option value="all">All Categories</option>
                {experienceGroups.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" aria-hidden="true" />
            </div>
          </div>

          {/* Sort chips */}
          <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Sort experiences">
            <span className="mr-1 text-xs font-semibold uppercase tracking-wide text-gray-400">Sort</span>
            {(
              [
                { id: "count", label: "Popular" },
                { id: "az", label: "A–Z" },
              ] as const
            ).map((chip) => (
              <button
                key={chip.id}
                type="button"
                onClick={() => setSort(chip.id)}
                aria-pressed={sort === chip.id}
                className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all duration-200 ${
                  sort === chip.id
                    ? "bg-brand-orange text-white shadow-sm"
                    : "border border-gray-300 bg-white text-gray-600 hover:border-brand-orange hover:text-brand-orange"
                }`}
              >
                {chip.label}
              </button>
            ))}
            {hasFilters && (
              <button
                type="button"
                onClick={resetFilters}
                className="rounded-full px-3.5 py-1.5 text-xs font-semibold text-gray-500 underline-offset-2 hover:text-brand-orange hover:underline"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>
      )}

      {/* ── Grid ── */}
      {shown.length > 0 ? (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
            {shown.map((exp) => (
              <ExperienceCard
                key={exp.slug}
                slug={exp.slug}
                name={exp.name}
                tagline={exp.tagline}
                image={exp.image}
                packageCount={exp.packageCount}
              />
            ))}
          </div>

          {limit > 0 && filtered.length > visible && (
            <div className="mt-8 text-center">
              <button
                type="button"
                onClick={() => setVisible((v) => v + 8)}
                className="inline-flex items-center gap-2 rounded-full border border-brand-orange bg-brand-orange-light px-6 py-2.5 text-sm font-bold text-brand-orange-dark transition-all duration-200 hover:bg-brand-orange hover:text-white"
              >
                Show more experiences ({filtered.length - visible} remaining)
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="rounded-card border border-dashed border-gray-300 bg-white py-16 text-center">
          <p className="text-lg font-semibold text-gray-700">No experiences found</p>
          <p className="mt-1 text-sm text-gray-500">
            Try a different search term or clear the filters to see all {totalShown} categories.
          </p>
          <button
            type="button"
            onClick={resetFilters}
            className="mt-4 rounded-full bg-brand-orange px-6 py-2 text-sm font-bold text-white transition-colors hover:bg-brand-orange-dark"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
}
