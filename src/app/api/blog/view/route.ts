import { NextRequest, NextResponse } from "next/server";
import { recordView, getViewCount } from "@/lib/blogDb";
import { SLUG_RE, asRecord, getClientIp, newViewerId, viewerHashFor } from "@/lib/blogUtils";

export const dynamic = "force-dynamic";

const VID_COOKIE = "mqt_vid";
const VID_MAX_AGE = 60 * 60 * 24 * 365; // 1 year

/* In-memory rate limit: 60 view posts per minute per IP. The view beacon
 * fires once per page load, so honest traffic never trips this; it only
 * blunts floods from a single source. Per-instance on Vercel serverless,
 * so a first line of defence — but each write already dedupes by
 * viewer_hash, so a flood only costs queries, not row growth. */
const RATE_LIMIT = 60;
const WINDOW_MS = 60_000;
const hits = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= RATE_LIMIT) {
    hits.set(ip, recent);
    return true;
  }
  recent.push(now);
  hits.set(ip, recent);
  return false;
}

/**
 * POST /api/blog/view {slug} -> {views}
 * Dedupes by viewer_hash = sha256(mqt_vid cookie || ip+ua); sets the mqt_vid
 * cookie (1y, httpOnly, SameSite=Lax) when absent.
 */
export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  const slug = asRecord(body)?.slug;
  if (typeof slug !== "string" || !SLUG_RE.test(slug)) {
    return NextResponse.json({ error: "Invalid slug" }, { status: 400 });
  }

  if (isRateLimited(getClientIp(req))) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  let vid = req.cookies.get(VID_COOKIE)?.value;
  let setCookie: string | null = null;
  if (!vid) {
    vid = newViewerId();
    const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
    setCookie =
      `${VID_COOKIE}=${vid}; Path=/; HttpOnly${secure}; SameSite=Lax; ` +
      `Max-Age=${VID_MAX_AGE}`;
  }

  await recordView(slug, viewerHashFor(req, vid));
  const views = await getViewCount(slug);

  const res = NextResponse.json({ views });
  if (setCookie) res.headers.set("Set-Cookie", setCookie);
  return res;
}
