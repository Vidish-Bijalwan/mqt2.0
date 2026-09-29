import { NextRequest, NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/adminAuth";
import { getSummary, type AnalyticsRange } from "@/lib/analyticsDb";

export const dynamic = "force-dynamic";

const VALID_RANGES: AnalyticsRange[] = ["today", "24h", "7d", "30d"];

/**
 * GET /api/analytics/summary?range=today|24h|7d|30d
 * Admin-gated (same mqt_admin cookie mechanism as /admin/blog/new).
 * Returns pageviews, unique visitors, IST-aligned time buckets, and
 * top pages / referrers / UTM sources / device split. Empty defaults when
 * DATABASE_URL is missing — never throws.
 */
export async function GET(req: NextRequest) {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const raw = new URL(req.url).searchParams.get("range") ?? "24h";
  const range: AnalyticsRange = (
    VALID_RANGES as string[]
  ).includes(raw)
    ? (raw as AnalyticsRange)
    : "24h";
  const summary = await getSummary(range);
  return NextResponse.json(summary);
}
