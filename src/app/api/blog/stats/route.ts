import { NextResponse } from "next/server";
import { getStats } from "@/lib/blogDb";
import { SLUG_RE } from "@/lib/blogUtils";

export const dynamic = "force-dynamic";

/**
 * GET /api/blog/stats?slugs=a,b
 * -> {"a":{"views":1,"likes":2,"comments":3}}
 * Missing slug -> zeros; no DATABASE_URL -> all zeros.
 */
export async function GET(req: Request) {
  const param = new URL(req.url).searchParams.get("slugs") ?? "";
  const slugs = param
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s.length > 0 && SLUG_RE.test(s));
  const stats = await getStats(slugs);
  return NextResponse.json(stats);
}
