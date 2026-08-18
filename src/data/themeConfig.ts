export interface ThemeConfig {
  name: string;
  href: string;
  keywords: string[];
}

/**
 * Shared theme definitions used by both ThemeFilter (homepage)
 * and individual theme pages. Keeps filtering logic in one place.
 */
export const themeConfigs: ThemeConfig[] = [
  { name: "Family", href: "/special-tours/family", keywords: ["family", "kids", "leisure"] },
  { name: "Honeymoon", href: "/special-tours/honeymoon", keywords: ["honeymoon", "romantic", "couple"] },
  { name: "Cultural", href: "/special-tours/cultural", keywords: ["culture", "heritage", "temple", "historical", "fort"] },
  { name: "Pilgrimage", href: "/packages?category=Pilgrimage", keywords: ["pilgrimage", "darshan", "yatra", "dham", "temple", "spiritual"] },
  { name: "Beaches", href: "/special-tours/beaches", keywords: ["beach", "goa", "andaman", "island", "sea"] },
  { name: "Adventure", href: "/special-tours/adventure", keywords: ["adventure", "trek", "safari", "rafting", "camping"] },
  { name: "Winter", href: "/special-tours/winter", keywords: ["winter", "snow", "ski", "kashmir", "auli"] },
  { name: "Summer", href: "/special-tours/summer", keywords: ["summer", "hill station", "manali", "shimla", "ooty"] },
  { name: "Monsoon", href: "/special-tours/monsoon", keywords: ["monsoon", "rain", "kerala", "meghalaya"] },
];

/**
 * Filter packages by a theme's keywords, returning matches sorted
 * with explicit title matches first. Preserves the full package type.
 */
export function filterPackagesByTheme<T extends { title: string; category: string; description: string }>(
  packages: T[],
  themeName: string,
): T[] {
  const theme = themeConfigs.find((t) => t.name === themeName);
  if (!theme) return [];

  const matched = packages.filter((pkg) => {
    const searchString = `${pkg.title} ${pkg.category} ${pkg.description}`.toLowerCase();
    return theme.keywords.some((kw) => searchString.includes(kw));
  });

  matched.sort((a, b) => {
    const aMatch = a.title.toLowerCase().includes(theme.name.toLowerCase()) ? 1 : 0;
    const bMatch = b.title.toLowerCase().includes(theme.name.toLowerCase()) ? 1 : 0;
    return bMatch - aMatch;
  });

  return matched;
}
