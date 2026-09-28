"use client";

import { useEffect, useState } from "react";
import { Info } from "lucide-react";
import {
  CURRENCY_COOKIE,
  CURRENCY_LOCALSTORAGE_KEY,
  FX_ATTRIBUTION,
  convertInr,
  resolveDisplayCurrency,
  type ConvertedPrice as ConvertedPriceData,
  type FxSnapshot,
} from "@/lib/currency";

/** Broadcast when the visitor changes currency via the switcher. */
export const CURRENCY_CHANGE_EVENT = "mqt:currency-change";

interface ResolvedState {
  status: "loading" | "inr" | "converted" | "unavailable";
  converted?: ConvertedPriceData;
}

// Module-level caches so a listing page with N price components issues one
// /api/fx-rates and one /api/display-currency request instead of N.
let currencyCodePromise: Promise<string> | null = null;
let fxSnapshotPromise: Promise<FxSnapshot | null> | null = null;

function invalidateCaches() {
  currencyCodePromise = null;
  fxSnapshotPromise = null;
}

function getFxSnapshot(): Promise<FxSnapshot | null> {
  if (!fxSnapshotPromise) {
    fxSnapshotPromise = fetch("/api/fx-rates", { credentials: "same-origin" })
      .then((res) => (res.ok ? res.json() : null))
      .catch(() => null)
      .then((snapshot) => {
        if (!snapshot) fxSnapshotPromise = null; // allow retry on failure
        return snapshot as FxSnapshot | null;
      });
  }
  return fxSnapshotPromise;
}

function readCookie(): string | null {
  if (typeof document === "undefined") return null;
  const m = document.cookie.match(new RegExp(`(?:^|;\\s*)${CURRENCY_COOKIE}=([^;]*)`));
  return m ? decodeURIComponent(m[1]) : null;
}

async function resolveCurrencyCode(): Promise<string> {
  if (currencyCodePromise) return currencyCodePromise;
  currencyCodePromise = (async () => {
    // Manual override wins: cookie first, then the persisted localStorage copy.
    const cookie = readCookie();
    if (cookie) return cookie.toUpperCase();
    try {
      const stored = window.localStorage.getItem(CURRENCY_LOCALSTORAGE_KEY);
      if (stored) {
        // Restore the cookie so server components stay consistent on next load.
        document.cookie = `${CURRENCY_COOKIE}=${encodeURIComponent(stored)}; path=/; max-age=${30 * 24 * 60 * 60}; SameSite=Lax`;
        return stored.toUpperCase();
      }
    } catch {
      // storage unavailable — continue with geo resolution
    }
    try {
      const res = await fetch("/api/display-currency", { credentials: "same-origin" });
      if (res.ok) {
        const data = await res.json();
        if (typeof data.currency === "string") return data.currency.toUpperCase();
      }
    } catch {
      // geo resolution failed — INR fallback
    }
    return "INR";
  })();
  return currencyCodePromise;
}

/** Pure async computation — returns the next state instead of setting it. */
async function computeState(amountInr: number | null | undefined): Promise<ResolvedState> {
  if (typeof amountInr !== "number" || !Number.isFinite(amountInr) || amountInr <= 0) {
    return { status: "unavailable" };
  }
  const code = await resolveCurrencyCode();
  if (code === "INR") return { status: "inr" };
  try {
    const snapshot = await getFxSnapshot();
    if (!snapshot) return { status: "unavailable" };
    const { meta } = resolveDisplayCurrency(null, code);
    const converted = convertInr(amountInr, meta, snapshot);
    return converted ? { status: "converted", converted } : { status: "unavailable" };
  } catch {
    return { status: "unavailable" };
  }
}

/**
 * Convenience-only converted price hint rendered next to the canonical INR
 * price. Renders nothing when the visitor's currency is INR or when FX rates
 * are unavailable/stale — the INR price (already in the HTML) stands alone.
 */
export default function ConvertedPrice({
  amountInr,
  className,
}: {
  amountInr: number | null | undefined;
  className?: string;
}) {
  const [state, setState] = useState<ResolvedState>({ status: "loading" });

  useEffect(() => {
    let cancelled = false;
    const load = () => {
      computeState(amountInr).then((next) => {
        if (!cancelled) setState(next);
      });
    };
    load();
    const onCurrencyChange = () => {
      invalidateCaches();
      load();
    };
    window.addEventListener(CURRENCY_CHANGE_EVENT, onCurrencyChange);
    return () => {
      cancelled = true;
      window.removeEventListener(CURRENCY_CHANGE_EVENT, onCurrencyChange);
    };
  }, [amountInr]);

  if (state.status !== "converted" || !state.converted) return null;
  const c = state.converted;
  const rateDate = new Date(c.rateDate).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  const disclaimer =
    `Indicative conversion for reference only. All bookings are billed and settled in Indian Rupees (INR). ` +
    `Rates as of ${rateDate}. ${FX_ATTRIBUTION}.`;

  return (
    <span
      className={className}
      title={disclaimer}
      aria-label={disclaimer}
      style={{ display: "inline-flex", alignItems: "center", gap: 3, cursor: "help" }}
    >
      <span aria-hidden="true">≈</span>
      <span>
        {c.formatted} {c.currency}
      </span>
      <Info className="h-3 w-3 opacity-60" aria-hidden="true" />
    </span>
  );
}
