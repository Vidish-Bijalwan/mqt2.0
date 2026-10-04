/**
 * POST /api/enquiries — real server-side lead capture.
 *
 * The form submits here FIRST. On success (201) the lead is stored in the
 * `enquiries` table and the team is notified on WhatsApp; the client then
 * opens the prefilled WhatsApp thread with the reference id.
 *
 * On ANY failure (DB not configured, insert error, rate limit, validation)
 * the client falls back to the WhatsApp handoff — no lead is ever silently
 * dropped. Nothing here logs PII.
 */

import { storeEnquiry, isLeadStoreConfigured, markWhatsappNotified, countRecentEnquiriesByIpHash } from "@/lib/leadStore";
import { notifyTeamOnWhatsapp, isWhatsappConfigured } from "@/lib/leadNotify";
import { ipHashFor } from "@/lib/analyticsDb";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// --- basic per-instance rate limiting (10 submissions / hour / IP) ---
// Vercel runs many instances, so this is a first line of defence only,
// not a global guarantee. Honeypot + timing checks back it up.
const RATE_LIMIT = 10;
const WINDOW_MS = 60 * 60 * 1000;
// DB-backed cap (5 enquiries / day / IP hash): survives Vercel serverless
// instance resets, unlike the in-memory limiter above. The hash is
// daily-rotating + salted (see ipHashFor) — raw IPs are never stored.
const DAILY_CAP = 5;
const hits = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const times = (hits.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  if (times.length >= RATE_LIMIT) {
    hits.set(ip, times);
    return true;
  }
  times.push(now);
  hits.set(ip, times);
  // Prune idle entries so the map can't grow without bound.
  if (hits.size > 5000) {
    for (const [k, v] of hits) {
      if (v.length === 0 || now - v[v.length - 1] > WINDOW_MS) hits.delete(k);
    }
  }
  return false;
}

function clientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim().slice(0, 64);
  return "unknown";
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

interface EnquiryPayload {
  name?: unknown;
  phone?: unknown;
  email?: unknown;
  packageSlug?: unknown;
  packageName?: unknown;
  travelDate?: unknown;
  travellers?: unknown;
  message?: unknown;
  sourceUrl?: unknown;
  utm?: Record<string, unknown>;
  company?: unknown; // honeypot — must stay empty
  formRenderedAt?: unknown; // client timestamp ms — bot-speed check
}

function bad(message: string, status = 400) {
  return Response.json({ ok: false, error: message }, { status });
}

export async function POST(req: Request) {
  // 1. Lead store must exist — otherwise tell the client to fall back.
  if (!isLeadStoreConfigured()) {
    console.error("[enquiries] DATABASE_URL not configured — client must use WhatsApp fallback");
    return Response.json({ ok: false, fallback: "whatsapp" }, { status: 503 });
  }

  // 2. Rate limit before doing any work.
  const ip = clientIp(req);
  if (isRateLimited(ip)) {
    return bad("Too many enquiries from this address. Please try again later.", 429);
  }
  // DB-backed daily cap: survives serverless instance resets, unlike the
  // in-memory limiter above. Counted before validation so a flood of
  // malformed posts still counts against the cap. Unknown IPs are skipped
  // so the cap never groups unidentifiable clients together.
  const enquiryIpHash = ip === "unknown" ? "" : ipHashFor(ip);
  if (enquiryIpHash && (await countRecentEnquiriesByIpHash(enquiryIpHash)) >= DAILY_CAP) {
    return bad("Too many enquiries from this address today. Please try again tomorrow.", 429);
  }

  // 3. Parse + validate.
  let payload: EnquiryPayload;
  try {
    payload = (await req.json()) as EnquiryPayload;
  } catch {
    return bad("Invalid request body.");
  }

  // Honeypot: bots fill hidden fields; humans never see it.
  if (typeof payload.company === "string" && payload.company.trim() !== "") {
    // Pretend success so bots can't probe the defence.
    return Response.json({ ok: true, id: null, ref: null, spam: true }, { status: 201 });
  }

  // Timing: submitted faster than a human can type is a bot. Lenient 500ms.
  if (typeof payload.formRenderedAt === "number") {
    const elapsed = Date.now() - payload.formRenderedAt;
    if (elapsed >= 0 && elapsed < 500) {
      return Response.json({ ok: true, id: null, ref: null, spam: true }, { status: 201 });
    }
  }

  const name = String(payload.name || "").trim().slice(0, 100);
  const phoneRaw = String(payload.phone || "");
  const phoneDigits = phoneRaw.replace(/[^\d]/g, "");
  const emailRaw = String(payload.email || "").trim().slice(0, 200);
  const packageSlug = String(payload.packageSlug || "").trim().slice(0, 200) || null;
  const packageName = String(payload.packageName || "").trim().slice(0, 200) || null;
  const travelDateRaw = String(payload.travelDate || "").trim();
  const message = String(payload.message || "").trim().slice(0, 2000) || null;
  const sourceUrl = String(payload.sourceUrl || "").slice(0, 500) || null;

  if (name.length < 2) return bad("Please enter your name.");
  if (phoneDigits.length < 8 || phoneDigits.length > 15) {
    return bad("Please enter a valid phone number.");
  }
  // Email is OPTIONAL — a missing email is fine; a malformed one is not.
  const email = emailRaw === "" ? null : emailRaw;
  if (email !== null && !EMAIL_RE.test(email)) {
    return bad("Please enter a valid email address, or leave it blank.");
  }

  let travelDate: string | null = null;
  if (travelDateRaw !== "") {
    if (!DATE_RE.test(travelDateRaw)) return bad("Invalid travel date.");
    // Past travel dates are a data-quality bug downstream — compare against
    // "today" in IST (the team's operating timezone), not the server clock.
    const todayIst = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Kolkata",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date());
    if (travelDateRaw < todayIst) return bad("Travel date can't be in the past.");
    travelDate = travelDateRaw;
  }

  let travellers: number | null = null;
  if (payload.travellers !== undefined && payload.travellers !== null && String(payload.travellers) !== "") {
    const n = Number(payload.travellers);
    if (!Number.isInteger(n) || n < 1 || n > 50) return bad("Invalid number of travellers.");
    travellers = n;
  }

  const utm = payload.utm && typeof payload.utm === "object" ? payload.utm : {};
  const utmStr = (k: string) =>
    typeof utm[k] === "string" ? (utm[k] as string).slice(0, 200) : null;

  // 4. Store. Any failure -> 503 so the client falls back to WhatsApp.
  let stored: { id: string; createdAt: string };
  try {
    stored = await storeEnquiry({
      name,
      phone: phoneDigits,
      email,
      packageSlug,
      packageName,
      travelDate,
      travellers,
      message,
      sourceUrl,
      utmSource: utmStr("utm_source"),
      utmMedium: utmStr("utm_medium"),
      utmCampaign: utmStr("utm_campaign"),
      utmTerm: utmStr("utm_term"),
      utmContent: utmStr("utm_content"),
      gclid: utmStr("gclid"),
      ipHash: enquiryIpHash || null,
    });
  } catch (err) {
    console.error(
      "[enquiries] store failed:",
      err instanceof Error ? err.message : "unknown"
    );
    return Response.json({ ok: false, fallback: "whatsapp" }, { status: 503 });
  }

  // 5. Notify the team on WhatsApp (best effort — lead is already stored).
  let notified = false;
  if (isWhatsappConfigured()) {
    notified = await notifyTeamOnWhatsapp({
      name,
      phone: phoneDigits,
      packageName,
      createdAt: stored.createdAt,
    });
    if (notified) {
      await markWhatsappNotified(stored.id);
    }
  } else {
    console.error("[enquiries] WhatsApp not configured — team notification skipped");
  }

  const ref = stored.id.replace(/-/g, "").slice(0, 8).toUpperCase();
  return Response.json({ ok: true, id: stored.id, ref, notified }, { status: 201 });
}

// Disallow other methods explicitly (Next returns 405 by default, but be clear).
export async function GET() {
  return bad("Method not allowed.", 405);
}
