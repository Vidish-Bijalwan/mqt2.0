"use client";

import { useState } from "react";
import { Globe } from "lucide-react";
import {
  CURRENCY_COOKIE,
  CURRENCY_COOKIE_MAX_AGE,
  CURRENCY_LOCALSTORAGE_KEY,
  SUPPORTED_CURRENCIES,
} from "@/lib/currency";
import { CURRENCY_CHANGE_EVENT } from "./ConvertedPrice";

const AUTO_VALUE = "__auto";

function readCookie(): string | null {
  const m = document.cookie.match(new RegExp(`(?:^|;\\s*)${CURRENCY_COOKIE}=([^;]*)`));
  return m ? decodeURIComponent(m[1]).toUpperCase() : null;
}

/**
 * Manual currency selector. The visitor's choice ALWAYS overrides geo-IP
 * detection and is persisted in a cookie (server-readable) + localStorage.
 * Rendered in the footer — outside the nav/header owned by the games workstream.
 */
export default function CurrencySwitcher() {
  const [value, setValue] = useState<string>(() =>
    typeof document === "undefined" ? AUTO_VALUE : (readCookie() ?? AUTO_VALUE),
  );

  const apply = (code: string) => {
    setValue(code);
    if (code === AUTO_VALUE) {
      document.cookie = `${CURRENCY_COOKIE}=; path=/; max-age=0; SameSite=Lax`;
      try {
        window.localStorage.removeItem(CURRENCY_LOCALSTORAGE_KEY);
      } catch {
        // ignore
      }
    } else {
      document.cookie = `${CURRENCY_COOKIE}=${encodeURIComponent(code)}; path=/; max-age=${CURRENCY_COOKIE_MAX_AGE}; SameSite=Lax`;
      try {
        window.localStorage.setItem(CURRENCY_LOCALSTORAGE_KEY, code);
      } catch {
        // ignore
      }
    }
    window.dispatchEvent(new Event(CURRENCY_CHANGE_EVENT));
  };

  return (
    <label
      className="inline-flex items-center gap-2 text-xs text-white/70"
      title="Display currency — convenience only. All bookings are billed in Indian Rupees (INR)."
    >
      <Globe className="h-3.5 w-3.5" aria-hidden="true" />
      <span className="sr-only">Display currency</span>
      <select
        value={value}
        onChange={(e) => apply(e.target.value)}
        suppressHydrationWarning
        aria-label="Display currency (indicative conversion; billing stays in INR)"
        className="rounded-md border border-white/20 bg-white/10 px-2 py-1 text-xs font-semibold text-white outline-none transition-colors hover:bg-white/20 focus-visible:ring-2 focus-visible:ring-white/40 [&>option]:text-black"
      >
        <option value={AUTO_VALUE}>Auto (location)</option>
        {SUPPORTED_CURRENCIES.map((c) => (
          <option key={c.currency} value={c.currency}>
            {c.currency} — {c.label}
          </option>
        ))}
      </select>
    </label>
  );
}
