import type { Package } from "@/data/allPackages";

const DESTINATION_RULES = [
  ["Singapore & Bali", /singapore.*bali|bali.*singapore/i],
  ["Singapore & Malaysia", /singapore.*malaysia|malaysia.*singapore/i],
  ["Bali & Malaysia", /bali.*malaysia|malaysia.*bali/i],
  ["Char Dham", /chardham|char dham|do dham/i],
  ["Badrinath", /badrinath/i],
  ["Kedarnath", /kedarnath/i],
  ["Auli", /\bauli\b/i],
  ["Kainchi Dham", /kainchi|mahavatar babaji|dwarahat/i],
  ["Nepal", /nepal|kathmandu|pokhara/i],
  ["Bali", /\bbali\b/i],
  ["Andaman", /andaman|port blair|havelock|baratang/i],
  // Amarnath MUST come before Kashmir — Amarnath packages mention Srinagar/Kashmir in their route
  ["Amarnath", /amarnath/i],
  ["Vaishno Devi", /vaishno devi|vaishnodevi/i],
  ["Kashmir", /kashmir|srinagar|gulmarg|pahalgam|sonmarg/i],
  ["Goa", /\bgoa\b|panaji/i],
  ["Kerala", /kerala|munnar|alleppey|alappuzha|kochi|cochin|kovalam/i],
  ["Rajasthan", /rajasthan|jaipur|jodhpur|udaipur|jaisalmer|ajmer/i],
  ["Gujarat", /gujarat|ahmedabad|dwarka|somnath|kutch/i],
  ["Assam", /assam|guwahati|kaziranga/i],
  ["Meghalaya", /meghalaya|shillong|cherrapunji/i],
  ["Arunachal Pradesh", /arunachal|tawang/i],
  ["Odisha", /odisha|orissa|puri|konark|bhubaneswar/i],
  ["Ujjain & Omkareshwar", /ujjain|omkareshwar|mahakaleshwar/i],
  ["Agra, Mathura & Vrindavan", /agra|mathura|vrindavan/i],
  ["Ayodhya", /ayodhya/i],
  ["Varanasi", /varanasi|kashi/i],
  ["Haridwar & Rishikesh", /haridwar|rishikesh/i],
  ["Nainital", /nainital/i],
  ["Mussoorie", /mussoorie/i],
  ["Manali", /manali/i],
  ["Shimla", /shimla/i],
  ["Ladakh", /ladakh|leh|nubra/i],
  ["Sikkim", /sikkim|gangtok/i],
  ["Darjeeling", /darjeeling/i],
  ["Dubai", /dubai/i],
  ["Thailand", /thailand|bangkok|phuket|pattaya/i],
  ["Singapore", /singapore/i],
  ["Sri Lanka", /sri lanka|colombo|kandy/i],
  ["Maldives", /maldives/i],
  ["Bhutan", /bhutan|thimphu|paro/i],
  ["Malaysia", /malaysia|kuala lumpur/i],
  ["Vietnam", /vietnam|hanoi|saigon|halong/i],
  ["Japan", /japan|tokyo|kyoto/i],
  ["Europe", /europe|france|italy|switzerland|germany|spain/i],
  ["Africa", /africa|kenya|tanzania|morocco|egypt/i],
  ["Australia & New Zealand", /australia|new zealand/i],
] as const;

export interface PackageGroup {
  key: string;
  label: string;
  representative: Package;
  packages: Package[];
}

export function getPackageDestination(pkg: Package): string {
  const searchable = `${pkg.title} ${pkg.slug} ${pkg.route} ${pkg.category}`;
  const match = DESTINATION_RULES.find(([, rule]) => rule.test(searchable));
  if (match) return match[0];

  return pkg.title
    .replace(/\b\d+\s*(days?|nights?)\b/gi, "")
    .replace(/\b(tour|travel|holiday|vacation|package|packages|itinerary|from india|from delhi|2026)\b/gi, "")
    .replace(/\s+/g, " ")
    .trim() || pkg.category;
}

export function groupPackagesByDestination(packages: Package[]): PackageGroup[] {
  const groups = new Map<string, PackageGroup>();

  for (const pkg of packages) {
    const label = getPackageDestination(pkg);
    const key = label.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    const existing = groups.get(key);
    if (existing) {
      existing.packages.push(pkg);
    } else {
      groups.set(key, { key, label, representative: pkg, packages: [pkg] });
    }
  }

  const sorted = [...groups.values()].sort((a, b) => b.packages.length - a.packages.length || a.label.localeCompare(b.label));
  const usedImages = new Set<string>();

  return sorted.map((group) => {
    // Prefer a package whose slug contains the group key — gives more relevant imagery.
    // e.g. for "Kashmir" group, prefer slug="kashmir-tour-packages" over "amarnath-yatra-with-kashmir-tour"
    const groupKeyWords = group.key.split("-").filter((w) => w.length > 3);
    const preferred = group.packages.find(
      (pkg) => pkg.image && !usedImages.has(pkg.image) && groupKeyWords.some((w) => pkg.slug.includes(w))
    );
    const representative = preferred ||
      group.packages.find((pkg) => pkg.image && !usedImages.has(pkg.image)) ||
      group.representative;
    if (representative.image) usedImages.add(representative.image);
    return { ...group, representative };
  });
}
