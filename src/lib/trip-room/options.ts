/**
 * Group Trip Room — poll option catalogs.
 *
 * Destinations are the real destination titles from src/data/destinationsData.json
 * (nothing invented). Date windows are generated from the current month so the
 * poll is always current.
 */

/** Real destinations offered on the site (excludes the "Travel Blog" entry). */
export const DESTINATION_OPTIONS = [
  "Kashmir",
  "Ladakh",
  "Himachal Pradesh",
  "Uttarakhand",
  "Kedarnath",
  "Darjeeling",
  "Sikkim",
  "Rajasthan",
  "Goa",
  "Kerala",
  "Karnataka",
  "Tamil Nadu",
  "Maharashtra",
  "Gujarat",
  "Madhya Pradesh",
  "Uttar Pradesh",
  "Varanasi",
  "Assam",
  "Nepal",
  "Bhutan",
  "Sri Lanka",
  "Vietnam",
] as const;

/** Next `count` month labels starting with the current month, e.g. "Oct 2026". */
export function dateWindowOptions(count = 6, now: Date = new Date()): string[] {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const out: string[] = [];
  for (let i = 0; i < count; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
    out.push(`${months[d.getMonth()]} ${d.getFullYear()}`);
  }
  return out;
}

export const BUDGET_OPTIONS = [
  "Under ₹25,000",
  "₹25,000 – ₹40,000",
  "₹40,000 – ₹60,000",
  "₹60,000+",
  "Flexible",
] as const;

export const HOTEL_OPTIONS = [
  "3-star comfort",
  "4-star premium",
  "5-star luxury",
  "Any — best value",
] as const;

export const ACTIVITY_OPTIONS = [
  "Adventure",
  "Sightseeing",
  "Beaches",
  "Spiritual / pilgrimage",
  "Wildlife",
  "Food & culture",
  "Snow & mountains",
] as const;

export const DURATION_OPTIONS = ["3–4 days", "5–7 days", "8–10 days", "10+ days"] as const;

/** Creator selection limits per category (min, max options). */
export const OPTION_LIMITS: Record<string, { min: number; max: number }> = {
  destination: { min: 2, max: 6 },
  dates: { min: 2, max: 4 },
  budget: { min: 2, max: 4 },
  hotel: { min: 2, max: 4 },
  activities: { min: 2, max: 6 },
  duration: { min: 2, max: 4 },
};
