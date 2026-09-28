import { NextResponse } from "next/server";
import { getFxSnapshot } from "@/lib/currency";

// Force dynamic so failures return a live 503 (never a cached one); the
// upstream FX fetch itself is cached via Next data-cache revalidation (24h).
export const dynamic = "force-dynamic";

/**
 * GET /api/fx-rates — cached INR FX snapshot for display-only conversion.
 * Hit daily by Vercel Cron (vercel.json) to keep the cache warm.
 * Never called with secrets; both providers are keyless.
 */
export async function GET() {
  const snapshot = await getFxSnapshot();
  if (!snapshot) {
    return NextResponse.json(
      { error: "fx_unavailable", message: "FX rates unavailable; showing INR prices." },
      { status: 503 },
    );
  }
  return NextResponse.json(snapshot, {
    headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" },
  });
}
