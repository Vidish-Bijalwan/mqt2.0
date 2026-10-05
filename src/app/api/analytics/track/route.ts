import { NextRequest, NextResponse } from "next/server";
import {
  browserFromUserAgent,
  countRecentEventsByIpHash,
  deviceFromUserAgent,
  getDb,
  ipHashFor,
  isBotUserAgent,
  recordEvent,
  referrerHost,
  sessionHashFor,
} from "@/lib/analyticsDb";
import { asRecord, getClientIp } from "@/lib/blogUtils";

export const dynamic = "force-dynamic";

/* In-memory rate limit: 60 beacon posts per minute per IP. The beacon fires
 * once per page load, so honest traffic never trips this; it only blunts
 * floods from a single source.
 * DB-backed rate limit: 1000 events per day per IP hash (added below).
 * In-memory is per-instance on Vercel serverless, so the DB cap is the real
 * flood protection. */
const RATE_LIMIT = 60;
const WINDOW_MS = 60_000;
const DAILY_CAP = 1000;
const hits = new Map<string, number[]>();

/* Daily-cap COUNT cache: the DB-backed cap (PR #59) ran a COUNT(*) over the
 * trailing-24h window on EVERY pageview before the INSERT, doubling DB query
 * volume per beacon on the Neon free plan. This small per-instance map
 * remembers the last COUNT per ipHash for the current UTC day: cached counts
 * comfortably below the cap skip the COUNT query entirely (the cached count
 * is bumped after each successful insert below). The COUNT query re-runs on
 * cache miss and when the cached count nears the cap, where a stale
 * fast-path read could over-admit. ipHashFor's salt rotates daily, so a new
 * day's hashes never collide with stale keys. */
const COUNT_CACHE_REVERIFY_MARGIN = 100;
const countCache = new Map<string, { date: string; count: number }>();

function utcDay(): string {
  return new Date().toISOString().slice(0, 10);
}

/** True when the DB-backed daily cap is known (or freshly confirmed) to be hit. */
async function isDailyCapped(ipHash: string): Promise<boolean> {
  const today = utcDay();
  const cached = countCache.get(ipHash);
  if (cached && cached.date === today && cached.count < DAILY_CAP - COUNT_CACHE_REVERIFY_MARGIN) {
    return false; // comfortably below cap — skip the COUNT query
  }
  let count: number;
  try {
    count = await countRecentEventsByIpHash(ipHash);
  } catch {
    // Never break the beacon on a DB error — degrade open for this beacon.
    return false;
  }
  countCache.set(ipHash, { date: today, count });
  // Prune idle entries so the map can't grow without bound (yesterday's
  // salted hashes never match again, so stale-date rows are unreachable).
  if (countCache.size > 5000) {
    for (const [k, v] of countCache) {
      if (v.date !== today) countCache.delete(k);
    }
  }
  return count >= DAILY_CAP;
}

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

function cleanStr(value: unknown, max: number): string | null {
  if (typeof value !== "string") return null;
  const t = value.trim().slice(0, max);
  return t.length > 0 ? t : null;
}

/**
 * POST /api/analytics/track {path, referrer?, utm_source?, utm_medium?, utm_campaign?}
 * Cookieless first-party pageview beacon. Always 204 (never break the page):
 *   - respects Do-Not-Track (header checked server-side too)
 *   - skips /admin/* paths and obvious bot user-agents
 *   - 60/min/IP in-memory rate limit + 1000/day/IP DB-backed cap
 *     (daily salted IP hash; raw IP is never stored)
 *   - raw IP is never stored; session_hash rotates daily
 * The DB layer degrades to a no-op when DATABASE_URL is missing, so this
 * stays 204 in every environment.
 */
export async function POST(req: NextRequest) {
  const noContent = () => new NextResponse(null, { status: 204 });

  // Do-Not-Track honored server-side as well as client-side.
  if (req.headers.get("dnt") === "1" || req.headers.get("sec-gpc") === "1") {
    return noContent();
  }

  const ua = req.headers.get("user-agent") ?? "";
  if (isBotUserAgent(ua)) return noContent();

  const ip = getClientIp(req);
  if (isRateLimited(ip)) return noContent();

  // DB-backed daily cap: survives Vercel serverless instance resets, unlike
  // the in-memory limiter above. Counted before the body parse so a flood of
  // malformed posts still counts against the cap. The COUNT query itself is
  // cached per ipHash (see isDailyCapped) so honest beacons skip it.
  const ipHash = ipHashFor(ip);
  if (ipHash && (await isDailyCapped(ipHash))) {
    return noContent();
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return noContent();
  }
  const rec = asRecord(body);

  const path = cleanStr(rec?.path, 500);
  if (!path || !path.startsWith("/")) return noContent();
  // The beacon itself skips /admin/*, but never trust the client.
  if (path === "/admin" || path.startsWith("/admin/")) return noContent();

  const db = getDb();
  if (!db) return noContent();

  try {
    await recordEvent({
      path,
      referrer: rec?.referrer ? referrerHost(String(rec.referrer)) : null,
      utmSource: cleanStr(rec?.utm_source, 100),
      utmMedium: cleanStr(rec?.utm_medium, 100),
      utmCampaign: cleanStr(rec?.utm_campaign, 100),
      device: deviceFromUserAgent(ua),
      browser: browserFromUserAgent(ua),
      country: req.headers.get("x-vercel-ip-country")?.slice(0, 2) ?? null,
      sessionHash: sessionHashFor(ip, ua),
      ipHash: ipHash || null,
    });
    // Keep the daily-cap COUNT cache current without another query.
    if (ipHash) {
      const today = utcDay();
      const cached = countCache.get(ipHash);
      if (cached && cached.date === today) cached.count += 1;
    }
  } catch {
    // Never fail the beacon on a DB error.
  }
  return noContent();
}
