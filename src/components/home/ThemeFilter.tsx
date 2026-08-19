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
      {/* Theme Filter Buttons — reference .theme-touBox style */}
      <ul className="nit-themes">
        {themeConfigs.map((theme, i) => {
          const isActive = selectedTheme === theme.name;
          const Icon = THEME_ICONS[theme.name];
          return (
            <li key={i}>
              <button
                type="button"
                onClick={() => handleThemeClick(theme.name)}
                aria-pressed={isActive}
                aria-label={`Filter by ${theme.name}`}
                className={isActive ? "nit-theme-active" : undefined}
              >
                {Icon ? <Icon className="nit-theme-ic" strokeWidth={1.5} /> : null}
                {theme.name}
              </button>
            </li>
          );
        })}
      </ul>

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
            <div className="nit-grid">
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
