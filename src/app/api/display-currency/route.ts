import { NextRequest, NextResponse } from "next/server";
import { CURRENCY_COOKIE, resolveDisplayCurrency } from "@/lib/currency";

// Force dynamic: reads the per-request country header + cookie.
export const dynamic = "force-dynamic";

/**
 * GET /api/display-currency — resolve the visitor's display currency.
 * Precedence: mqt_currency cookie (manual override) → x-vercel-ip-country
 * geo hint → INR default. Dev-only override: ?__country=US.
 */
export async function GET(req: NextRequest) {
  const devCountry = req.nextUrl.searchParams.get("__country");
  const country =
    devCountry && process.env.NODE_ENV !== "production"
      ? devCountry
      : req.headers.get("x-vercel-ip-country");
  const cookieValue = req.cookies.get(CURRENCY_COOKIE)?.value ?? null;
  const { meta, source } = resolveDisplayCurrency(country, cookieValue);

  return NextResponse.json(
    {
      currency: meta.currency,
      locale: meta.locale,
      label: meta.label,
      country: (country || "").toUpperCase() || null,
      source,
    },
    { headers: { "Cache-Control": "private, no-store" } },
  );
}
