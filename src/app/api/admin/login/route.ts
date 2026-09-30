import { NextRequest, NextResponse } from "next/server";
import { isCorrectPassword, loginResponse } from "@/lib/adminAuth";
import { asRecord, getClientIp } from "@/lib/blogUtils";

export const dynamic = "force-dynamic";

/* In-memory rate limit: 10 login attempts per hour per IP. Per-instance on
 * Vercel serverless, so a first line of defence only — the constant delay
 * on every 401 below is what makes online guessing slow regardless. */
const RATE_LIMIT = 10;
const WINDOW_MS = 60 * 60 * 1000;
const attempts = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (attempts.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= RATE_LIMIT) {
    attempts.set(ip, recent);
    return true;
  }
  recent.push(now);
  attempts.set(ip, recent);
  // Prune idle entries so the map can't grow without bound.
  if (attempts.size > 5000) {
    for (const [k, v] of attempts) {
      if (v.length === 0 || now - v[v.length - 1] > WINDOW_MS) attempts.delete(k);
    }
  }
  return false;
}

/**
 * POST /api/admin/login {password} -> sets the mqt_admin cookie, or
 * 401 on wrong password. 503 when ADMIN_PASSWORD is not configured.
 */
export async function POST(req: NextRequest) {
  if (!process.env.ADMIN_PASSWORD) {
    return NextResponse.json(
      { error: "ADMIN_PASSWORD not configured" },
      { status: 503 },
    );
  }
  // Rate limit every attempt (even malformed ones) before doing any work.
  if (isRateLimited(getClientIp(req))) {
    return NextResponse.json(
      { error: "Too many login attempts — please try again later" },
      { status: 429 },
    );
  }
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  const password = asRecord(body)?.password;
  if (typeof password !== "string" || password.length === 0) {
    return NextResponse.json({ error: "Password required" }, { status: 400 });
  }
  if (!isCorrectPassword(password)) {
    // Slow down online password guessing; timingSafeEqual inside
    // isCorrectPassword only defeats side-channels, not brute force.
    await new Promise((r) => setTimeout(r, 400));
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }
  return loginResponse();
}
