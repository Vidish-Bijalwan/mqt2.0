import { NextRequest, NextResponse } from "next/server";
import { toggleLike } from "@/lib/blogDb";
import { SLUG_RE, asRecord, getClientIp, newViewerId, viewerHashFor } from "@/lib/blogUtils";

export const dynamic = "force-dynamic";

const VID_COOKIE = "mqt_vid";
const VID_MAX_AGE = 60 * 60 * 24 * 365; // 1 year

/* In-memory rate limit: 60 like posts per minute per IP. The button only
 * fires on tap, so honest traffic never trips this; it only blunts floods
 * from a single source. Per-instance on Vercel serverless, so a first
 * line of defence only. */
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
  // Prune idle entries so the map can't grow without bound.
  if (hits.size > 5000) {
    for (const [k, v] of hits) {
      if (v.length === 0 || now - v[v.length - 1] > WINDOW_MS) hits.delete(k);
    }
  }
  return false;
}

/**
 * POST /api/blog/like {slug} -> {likes, liked}
 * Toggles by liker_hash (same hashing as views: mqt_vid cookie || ip+ua, and
 * ip+ua only when the cookie is absent so cookie-refusing visitors dedupe by
 * IP+browser). Unknown slugs record nothing and return {likes: 0, liked: false}.
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

  const vid = req.cookies.get(VID_COOKIE)?.value;
  let setCookie: string | null = null;
  if (!vid) {
    // Still mint + set a cookie for cookie-accepting visitors, but hash THIS
    // request without the throwaway id: hashing a fresh random UUID per
    // request would make every cookie-refusing page load count as unique.
    // Hashing ip+ua only matches the privacy policy's "IP-and-browser-based
    // estimate" fallback for cookie refusers.
    const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
    setCookie =
      `${VID_COOKIE}=${newViewerId()}; Path=/; HttpOnly${secure}; SameSite=Lax; ` +
      `Max-Age=${VID_MAX_AGE}`;
  }

  const { likes, liked } = await toggleLike(slug, viewerHashFor(req, vid));

  const res = NextResponse.json({ likes, liked });
  if (setCookie) res.headers.set("Set-Cookie", setCookie);
  return res;
}
