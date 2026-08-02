"use client";

import { useState, useMemo } from "react";
import { allPackages } from "@/data/allPackages";
import { themeConfigs, filterPackagesByTheme } from "@/data/themeConfig";
import PackageCard from "@/components/ui/PackageCard";
import Link from "next/link";
import {
  Users, Heart, Landmark, Flame, Umbrella, Tent,
  Snowflake, Sun, CloudRain
} from "lucide-react";

const THEME_ICONS: Record<string, React.ElementType> = {
  Family: Users,
  Honeymoon: Heart,
  Cultural: Landmark,
  Pilgrimage: Flame,
  Beaches: Umbrella,
  Adventure: Tent,
  Winter: Snowflake,
  Summer: Sun,
  Monsoon: CloudRain,
};

export default function ThemeFilter() {
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);

  const { filtered, totalMatching } = useMemo(() => {
    if (!selectedTheme) return { filtered: [], totalMatching: 0 };
    const all = filterPackagesByTheme(allPackages, selectedTheme);
    return { filtered: all.slice(0, 5), totalMatching: all.length };
  }, [selectedTheme]);

  const handleThemeClick = (name: string) => {
    setSelectedTheme((prev) => (prev === name ? null : name));
  };

  const activeThemeConfig = selectedTheme
    ? themeConfigs.find((t) => t.name === selectedTheme)
    : null;

  return (
    <div>
      {/* Theme Filter Buttons */}
      <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-[10px]">
        {themeConfigs.map((theme, i) => {
          const isActive = selectedTheme === theme.name;
          const Icon = THEME_ICONS[theme.name];
          return (
            <button
              key={i}
              type="button"
              onClick={() => handleThemeClick(theme.name)}
              aria-pressed={isActive}
              className={`group border p-3 flex flex-col items-center justify-center rounded cursor-pointer transition-all duration-200 ${
                isActive
                  ? "border-legacy-orange bg-legacy-orange text-white shadow-md scale-105"
                  : "border-gray-200 bg-white text-gray-700 hover:border-legacy-orange hover:shadow-sm"
              }`}
            >
              <div className={`w-10 h-10 mb-2 flex items-center justify-center transition-colors duration-200 ${
                isActive ? "text-white" : "text-brand-orange group-hover:text-black"
              }`}>
                {Icon && <Icon className="w-8 h-8" strokeWidth={isActive ? 2.5 : 1.5} />}
              </div>
              <span className={`text-[10px] font-medium text-center transition-colors duration-200 ${
                isActive ? "text-white" : "text-gray-700"
              }`}>
                {theme.name}
              </span>
            </button>
          );
        })}
      </div>

      {/* Filter Results */}
      {selectedTheme && activeThemeConfig && (
        <div className="mt-8 animate-fadeIn">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-700">
              {selectedTheme} Tour Packages
              <span className="text-sm font-normal text-gray-400 ml-2">
                ({totalMatching} available)
              </span>
            </h3>
            <Link
              href={activeThemeConfig.href}
              className="text-sm font-semibold text-legacy-orange hover:underline transition-colors flex items-center gap-1"
            >
              View All →
            </Link>
          </div>

          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-[10px]">
              {filtered.map((pkg) => (
                <PackageCard key={pkg.slug} pkg={pkg} />
              ))}
            </div>
          ) : (
            <div className="bg-gray-50 border border-dashed border-gray-300 rounded-lg p-8 text-center">
              <p className="text-gray-500 text-sm">
                No {selectedTheme.toLowerCase()} packages found.{" "}
                <Link
                  href={activeThemeConfig.href}
                  className="text-legacy-orange font-semibold hover:underline"
                >
                  Browse all {selectedTheme.toLowerCase()} tours
                </Link>
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
