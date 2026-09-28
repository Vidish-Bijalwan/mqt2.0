// Currency localization — display-only conversion of canonical INR prices.
//
// Principles (per docs/i18n/CURRENCY_LOCALIZATION.md):
// - INR is the canonical price everywhere. Billing/checkout settles in INR only.
// - Converted amounts are indicative convenience display, never emitted in
//   JSON-LD or used for payment. No nationality-based price discrimination:
//   every visitor converts from the same INR base price.
// - FX rates come from a real cached source (open.er-api.com, frankfurter
//   fallback). If rates are unavailable or stale, we fall back to INR-only.

export const CURRENCY_COOKIE = "mqt_currency";
export const CURRENCY_COOKIE_MAX_AGE = 30 * 24 * 60 * 60; // 30 days
export const CURRENCY_LOCALSTORAGE_KEY = "mqt_currency";

export const FX_PRIMARY_URL = "https://open.er-api.com/v6/latest/INR";
export const FX_FALLBACK_URL = "https://api.frankfurter.dev/v1/latest?base=INR";
/** Attribution required by the primary FX provider. */
export const FX_ATTRIBUTION = "Rates by Exchange Rate API";
/** Fresh-enough to convert silently. */
export const FX_FRESH_MS = 36 * 60 * 60 * 1000;
/** Older than this → stop converting, INR-only. */
export const FX_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;
/** Currencies that must be present for a snapshot to be considered valid. */
const REQUIRED_CURRENCIES = ["USD", "EUR", "GBP", "AED"];

export interface CurrencyMeta {
  currency: string;
  locale: string;
  label: string;
}

/**
 * ISO 3166-1 alpha-2 country → display currency + formatting locale.
 * Unmapped countries fall back to INR. Scandinavia is intentionally NOT euro.
 */
export const COUNTRY_CURRENCY_MAP: Record<string, CurrencyMeta> = {
  US: { currency: "USD", locale: "en-US", label: "US Dollar" },
  GB: { currency: "GBP", locale: "en-GB", label: "British Pound" },
  AU: { currency: "AUD", locale: "en-AU", label: "Australian Dollar" },
  AE: { currency: "AED", locale: "en-AE", label: "UAE Dirham" },
  SA: { currency: "SAR", locale: "en-SA", label: "Saudi Riyal" },
  CA: { currency: "CAD", locale: "en-CA", label: "Canadian Dollar" },
  NZ: { currency: "NZD", locale: "en-NZ", label: "New Zealand Dollar" },
  SG: { currency: "SGD", locale: "en-SG", label: "Singapore Dollar" },
  DE: { currency: "EUR", locale: "de-DE", label: "Euro" },
  FR: { currency: "EUR", locale: "fr-FR", label: "Euro" },
  IT: { currency: "EUR", locale: "it-IT", label: "Euro" },
  ES: { currency: "EUR", locale: "es-ES", label: "Euro" },
  NL: { currency: "EUR", locale: "nl-NL", label: "Euro" },
  BE: { currency: "EUR", locale: "nl-BE", label: "Euro" },
  AT: { currency: "EUR", locale: "de-AT", label: "Euro" },
  IE: { currency: "EUR", locale: "en-IE", label: "Euro" },
  PT: { currency: "EUR", locale: "pt-PT", label: "Euro" },
  FI: { currency: "EUR", locale: "fi-FI", label: "Euro" },
  GR: { currency: "EUR", locale: "el-GR", label: "Euro" },
  SE: { currency: "SEK", locale: "sv-SE", label: "Swedish Krona" },
  NO: { currency: "NOK", locale: "nb-NO", label: "Norwegian Krone" },
  DK: { currency: "DKK", locale: "da-DK", label: "Danish Krone" },
  CH: { currency: "CHF", locale: "de-CH", label: "Swiss Franc" },
  QA: { currency: "QAR", locale: "en-QA", label: "Qatari Riyal" },
  KW: { currency: "KWD", locale: "en-KW", label: "Kuwaiti Dinar" },
  OM: { currency: "OMR", locale: "en-OM", label: "Omani Rial" },
  BH: { currency: "BHD", locale: "en-BH", label: "Bahraini Dinar" },
  JP: { currency: "JPY", locale: "ja-JP", label: "Japanese Yen" },
  MY: { currency: "MYR", locale: "en-MY", label: "Malaysian Ringgit" },
  TH: { currency: "THB", locale: "th-TH", label: "Thai Baht" },
  ID: { currency: "IDR", locale: "id-ID", label: "Indonesian Rupiah" },
  PH: { currency: "PHP", locale: "en-PH", label: "Philippine Peso" },
  VN: { currency: "VND", locale: "vi-VN", label: "Vietnamese Dong" },
  KR: { currency: "KRW", locale: "ko-KR", label: "South Korean Won" },
  CN: { currency: "CNY", locale: "zh-CN", label: "Chinese Yuan" },
  HK: { currency: "HKD", locale: "en-HK", label: "Hong Kong Dollar" },
  TW: { currency: "TWD", locale: "zh-TW", label: "Taiwan Dollar" },
  LK: { currency: "LKR", locale: "en-LK", label: "Sri Lankan Rupee" },
  NP: { currency: "NPR", locale: "en-NP", label: "Nepalese Rupee" },
  BD: { currency: "BDT", locale: "en-BD", label: "Bangladeshi Taka" },
  MV: { currency: "MVR", locale: "en-MV", label: "Maldivian Rufiyaa" },
  PK: { currency: "PKR", locale: "en-PK", label: "Pakistani Rupee" },
  MX: { currency: "MXN", locale: "es-MX", label: "Mexican Peso" },
  BR: { currency: "BRL", locale: "pt-BR", label: "Brazilian Real" },
  ZA: { currency: "ZAR", locale: "en-ZA", label: "South African Rand" },
  EG: { currency: "EGP", locale: "en-EG", label: "Egyptian Pound" },
  NG: { currency: "NGN", locale: "en-NG", label: "Nigerian Naira" },
  KE: { currency: "KES", locale: "en-KE", label: "Kenyan Shilling" },
  TR: { currency: "TRY", locale: "tr-TR", label: "Turkish Lira" },
  RU: { currency: "RUB", locale: "ru-RU", label: "Russian Ruble" },
  IL: { currency: "ILS", locale: "en-IL", label: "Israeli Shekel" },
};

export const INR_META: CurrencyMeta = { currency: "INR", locale: "en-IN", label: "Indian Rupee" };

/** Curated list for the manual currency switcher (priority markets first). */
export const SUPPORTED_CURRENCIES: CurrencyMeta[] = [
  INR_META,
  { currency: "USD", locale: "en-US", label: "US Dollar" },
  { currency: "GBP", locale: "en-GB", label: "British Pound" },
  { currency: "EUR", locale: "en-IE", label: "Euro" },
  { currency: "AUD", locale: "en-AU", label: "Australian Dollar" },
  { currency: "AED", locale: "en-AE", label: "UAE Dirham" },
  { currency: "SAR", locale: "en-SA", label: "Saudi Riyal" },
  { currency: "SGD", locale: "en-SG", label: "Singapore Dollar" },
  { currency: "CAD", locale: "en-CA", label: "Canadian Dollar" },
  { currency: "NZD", locale: "en-NZ", label: "New Zealand Dollar" },
  { currency: "CHF", locale: "de-CH", label: "Swiss Franc" },
  { currency: "JPY", locale: "ja-JP", label: "Japanese Yen" },
  { currency: "QAR", locale: "en-QA", label: "Qatari Riyal" },
  { currency: "KWD", locale: "en-KW", label: "Kuwaiti Dinar" },
];

const SUPPORTED_CODES = new Set(SUPPORTED_CURRENCIES.map((c) => c.currency));

/**
 * Resolve the display currency. The manual cookie override ALWAYS wins over
 * geo-IP. Unknown/invalid values fall back to INR.
 */
export function resolveDisplayCurrency(
  country: string | null | undefined,
  cookieValue?: string | null,
): { meta: CurrencyMeta; source: "cookie" | "geo" | "default" } {
  const code = (cookieValue || "").trim().toUpperCase();
  if (code && SUPPORTED_CODES.has(code)) {
    return {
      meta: SUPPORTED_CURRENCIES.find((c) => c.currency === code) ?? INR_META,
      source: "cookie",
    };
  }
  const cc = (country || "").trim().toUpperCase();
  const mapped = cc ? COUNTRY_CURRENCY_MAP[cc] : undefined;
  if (mapped) return { meta: mapped, source: "geo" };
  return { meta: INR_META, source: "default" };
}

export interface FxSnapshot {
  base: "INR";
  rates: Record<string, number>;
  /** ISO date of the rates (provider's time_date / date). */
  rateDate: string;
  /** ISO timestamp of when we fetched. */
  fetchedAt: string;
  source: "open.er-api.com" | "frankfurter";
}

interface ErApiResponse {
  result?: string;
  time_last_update_utc?: string;
  rates?: Record<string, number>;
}

interface FrankfurterResponse {
  base?: string;
  date?: string;
  rates?: Record<string, number>;
}

function isFreshEnough(isoDate: string, maxAgeMs: number): boolean {
  const t = Date.parse(isoDate);
  if (Number.isNaN(t)) return false;
  return Date.now() - t <= maxAgeMs;
}

function validateSnapshot(rates: Record<string, number> | undefined, rateDate: string): boolean {
  if (!rates || !rateDate) return false;
  return REQUIRED_CURRENCIES.every((c) => typeof rates[c] === "number" && rates[c] > 0);
}

/**
 * Fetch FX rates server-side (never from the browser). Primary: open.er-api.com
 * (keyless, daily). Fallback: frankfurter (ECB-backed). Responses are cached
 * via Next data-cache revalidation for 24h.
 */
export async function getFxSnapshot(): Promise<FxSnapshot | null> {
  const opts = { next: { revalidate: 24 * 60 * 60 } } as RequestInit;

  try {
    const res = await fetch(FX_PRIMARY_URL, { ...opts, signal: AbortSignal.timeout(8000) });
    if (res.ok) {
      const data = (await res.json()) as ErApiResponse;
      const rateDate = data.time_last_update_utc
        ? new Date(data.time_last_update_utc).toISOString()
        : "";
      if (data.result === "success" && validateSnapshot(data.rates, rateDate)) {
        return {
          base: "INR",
          rates: data.rates as Record<string, number>,
          rateDate,
          fetchedAt: new Date().toISOString(),
          source: "open.er-api.com",
        };
      }
    }
  } catch {
    // fall through to the fallback provider
  }

  try {
    const res = await fetch(FX_FALLBACK_URL, { ...opts, signal: AbortSignal.timeout(8000) });
    if (res.ok) {
      const data = (await res.json()) as FrankfurterResponse;
      const rateDate = data.date ? new Date(`${data.date}T00:00:00Z`).toISOString() : "";
      // Frankfurter has no Gulf currencies — accept a smaller required set here.
      const ok =
        data.rates &&
        ["USD", "EUR", "GBP"].every((c) => typeof data.rates?.[c] === "number" && (data.rates?.[c] as number) > 0);
      if (ok && rateDate && isFreshEnough(rateDate, 48 * 60 * 60 * 1000)) {
        return {
          base: "INR",
          rates: data.rates as Record<string, number>,
          rateDate,
          fetchedAt: new Date().toISOString(),
          source: "frankfurter",
        };
      }
    }
  } catch {
    // no rates available
  }
  return null;
}

export interface ConvertedPrice {
  /** Converted amount, rounded to the currency's minor units. */
  amount: number;
  /** Intl-formatted string, e.g. "$283" / "د.إ1,042". */
  formatted: string;
  currency: string;
  locale: string;
  rateDate: string;
  /** True when the snapshot is older than FX_FRESH_MS (show the rate date). */
  stale: boolean;
}

/**
 * Convert an INR amount to a display currency. Returns null when conversion
 * is not possible — callers must then show the INR price only.
 * Null/NaN/non-positive INR amounts are rejected (never render $0 or NaN).
 */
export function convertInr(
  amountInr: number | null | undefined,
  meta: CurrencyMeta,
  snapshot: FxSnapshot | null,
): ConvertedPrice | null {
  if (meta.currency === "INR") return null;
  if (typeof amountInr !== "number" || !Number.isFinite(amountInr) || amountInr <= 0) return null;
  if (!snapshot || !snapshot.rates) return null;
  if (!isFreshEnough(snapshot.rateDate, FX_MAX_AGE_MS)) return null;

  const rate = snapshot.rates[meta.currency];
  if (typeof rate !== "number" || !(rate > 0)) return null;

  const nf = new Intl.NumberFormat(meta.locale, { style: "currency", currency: meta.currency });
  const fractionDigits = nf.resolvedOptions().maximumFractionDigits ?? 2;
  const factor = Math.pow(10, fractionDigits);
  const amount = Math.round(amountInr * rate * factor) / factor;

  // Floor guard: never show a converted price below the smallest sensible unit.
  const minUnit = 1 / factor;
  if (amount < minUnit) return null;

  return {
    amount,
    formatted: nf.format(amount),
    currency: meta.currency,
    locale: meta.locale,
    rateDate: snapshot.rateDate,
    stale: !isFreshEnough(snapshot.rateDate, FX_FRESH_MS),
  };
}

/** Canonical INR formatting used across price surfaces. */
export function formatInr(amountInr: number): string {
  return `₹${Math.round(amountInr).toLocaleString("en-IN")}`;
}
