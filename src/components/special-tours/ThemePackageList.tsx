'use client';

import { useMemo, useState } from 'react';
import { Award, IndianRupee, Calendar, RotateCcw } from 'lucide-react';
import PackageListCard from '@/components/ui/PackageListCard';
import type { Package } from '@/data/allPackages';
import { getPriceInfo, parseINR } from '@/utils/price';
import { getTourDays } from '@/utils/duration';

interface ThemePackageListProps {
  packages: Package[];
  /** Server-resolved image per package slug (keeps the 815KB media module server-side). */
  images: Record<string, string>;
  displayTheme: string;
}

const SPECIALITIES: { label: string; test: RegExp }[] = [
  { label: "Customized Holidays", test: /customiz/ },
  { label: "Family", test: /family/ },
  { label: "Women's Special", test: /wom[ae]n/ },
  { label: "Honeymoon Special", test: /honeymoon/ },
  { label: "Seniors' Special", test: /senior/ },
  { label: "Road Trips", test: /road trip/ },
];

const BUDGETS: { label: string; test: (price: number | null) => boolean }[] = [
  { label: "Less Than 10,000", test: (p) => p !== null && p < 10000 },
  { label: "10,000 - 20,000", test: (p) => p !== null && p >= 10000 && p <= 20000 },
  { label: "20,000 - 40,000", test: (p) => p !== null && p > 20000 && p <= 40000 },
  { label: "40,000 - 60,000", test: (p) => p !== null && p > 40000 && p <= 60000 },
  { label: "60,000 - 80,000", test: (p) => p !== null && p > 60000 && p <= 80000 },
  { label: "Above 80,000", test: (p) => p !== null && p > 80000 },
];

const DURATIONS: { label: string; test: (days: number | null) => boolean }[] = [
  { label: "3 to 5 days", test: (d) => d !== null && d >= 3 && d <= 5 },
  { label: "6 to 9 days", test: (d) => d !== null && d >= 6 && d <= 9 },
  { label: "10+ days", test: (d) => d !== null && d >= 10 },
];

type SortKey = "recommended" | "price-asc" | "price-desc" | "duration-asc";

function packagePrice(pkg: Package): number | null {
  const info = getPriceInfo(pkg.mrp, pkg.dealPrice, pkg.slug);
  if (!info.hasPrice) return null;
  const value = parseINR(info.display);
  return value > 0 ? value : null;
}

function toggle(set: Set<string>, value: string): Set<string> {
  const next = new Set(set);
  if (next.has(value)) next.delete(value);
  else next.add(value);
  return next;
}

export default function ThemePackageList({ packages, images, displayTheme }: ThemePackageListProps) {
  const [sort, setSort] = useState<SortKey>("recommended");
  const [budgets, setBudgets] = useState<Set<string>>(new Set());
  const [durations, setDurations] = useState<Set<string>>(new Set());
  const [specialities, setSpecialities] = useState<Set<string>>(new Set());

  const enriched = useMemo(
    () =>
      packages.map((pkg) => ({
        pkg,
        price: packagePrice(pkg),
        days: getTourDays(pkg.duration, pkg.title),
        haystack: `${pkg.title} ${pkg.category} ${pkg.description}`.toLowerCase(),
      })),
    [packages]
  );

  const visible = useMemo(() => {
    const filtered = enriched.filter((item) => {
      if (budgets.size > 0) {
        const match = BUDGETS.some((b) => budgets.has(b.label) && b.test(item.price));
        if (!match) return false;
      }
      if (durations.size > 0) {
        const match = DURATIONS.some((d) => durations.has(d.label) && d.test(item.days));
        if (!match) return false;
      }
      if (specialities.size > 0) {
        const match = SPECIALITIES.some((s) => specialities.has(s.label) && s.test.test(item.haystack));
        if (!match) return false;
      }
      return true;
    });
    const sorted = [...filtered];
    if (sort === "price-asc") sorted.sort((a, b) => (a.price ?? Infinity) - (b.price ?? Infinity));
    else if (sort === "price-desc") sorted.sort((a, b) => (b.price ?? -1) - (a.price ?? -1));
    else if (sort === "duration-asc") sorted.sort((a, b) => (a.days ?? Infinity) - (b.days ?? Infinity));
    return sorted;
  }, [enriched, budgets, durations, specialities, sort]);

  const hasActiveFilters = budgets.size > 0 || durations.size > 0 || specialities.size > 0 || sort !== "recommended";
  const resetAll = () => {
    setSort("recommended");
    setBudgets(new Set());
    setDurations(new Set());
    setSpecialities(new Set());
  };

  const checkboxClass = "rounded border-gray-300 text-legacy-orange focus:ring-legacy-orange";
  const labelClass = "flex items-center space-x-2 text-sm text-gray-700 cursor-pointer hover:text-legacy-orange";

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Sidebar */}
      <div className="w-full lg:w-1/4">
        <div className="w-full bg-white rounded-md border border-gray-200 overflow-hidden">
          <div className="border-b border-gray-200 p-4">
            <h3 className="font-bold text-gray-800 flex items-center mb-3">
              <Award className="w-4 h-4 mr-2 text-legacy-orange" />
              Speciality Tour
            </h3>
            <div className="space-y-2">
              {SPECIALITIES.map((item) => (
                <label key={item.label} className={labelClass}>
                  <input
                    type="checkbox"
                    className={checkboxClass}
                    checked={specialities.has(item.label)}
                    onChange={() => setSpecialities((prev) => toggle(prev, item.label))}
                  />
                  <span>{item.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="border-b border-gray-200 p-4">
            <h3 className="font-bold text-gray-800 flex items-center mb-3">
              <IndianRupee className="w-4 h-4 mr-2 text-legacy-orange" />
              Budget Per Person ( In Rs. )
            </h3>
            <div className="space-y-2">
              {BUDGETS.map((item) => (
                <label key={item.label} className={labelClass}>
                  <input
                    type="checkbox"
                    className={checkboxClass}
                    checked={budgets.has(item.label)}
                    onChange={() => setBudgets((prev) => toggle(prev, item.label))}
                  />
                  <span>{item.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="p-4">
            <h3 className="font-bold text-gray-800 flex items-center mb-3">
              <Calendar className="w-4 h-4 mr-2 text-legacy-orange" />
              Duration ( in Days )
            </h3>
            <div className="space-y-2">
              {DURATIONS.map((item) => (
                <label key={item.label} className={labelClass}>
                  <input
                    type="checkbox"
                    className={checkboxClass}
                    checked={durations.has(item.label)}
                    onChange={() => setDurations((prev) => toggle(prev, item.label))}
                  />
                  <span>{item.label}</span>
                </label>
              ))}
            </div>
          </div>

          {hasActiveFilters && (
            <div className="p-4 pt-0">
              <button
                type="button"
                onClick={resetAll}
                className="inline-flex items-center gap-2 text-sm font-semibold text-legacy-orange hover:underline"
              >
                <RotateCcw className="w-4 h-4" />
                Reset all filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Package List */}
      <div className="w-full lg:w-3/4 flex flex-col gap-4">
        <div className="bg-white p-3 border border-gray-200 rounded shadow-sm mb-2 flex justify-between items-center">
          <span className="text-sm font-semibold text-gray-700">Found {visible.length} Tours</span>
          <label className="sr-only" htmlFor="theme-sort">Sort tours</label>
          <select
            id="theme-sort"
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="border border-gray-300 rounded text-sm px-3 py-1.5 focus:outline-none focus:border-legacy-orange text-gray-600"
          >
            <option value="recommended">Sort By: Recommended</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="duration-asc">Duration: Short to Long</option>
          </select>
        </div>

        {visible.length > 0 ? (
          visible.map((item) => (
            <PackageListCard key={item.pkg.slug} pkg={item.pkg} imageSrc={images[item.pkg.slug]} />
          ))
        ) : (
          <div className="bg-white p-12 text-center border border-gray-200 rounded shadow-sm">
            <p className="text-gray-500 text-lg">No {displayTheme.toLowerCase()} packages found matching your criteria.</p>
            <button
              type="button"
              onClick={resetAll}
              className="inline-block mt-4 bg-legacy-orange text-white px-6 py-2 rounded hover:bg-orange-600 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
