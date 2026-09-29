/**
 * Admin auth helpers.
 *
 * The admin cookie value is hex(HMAC_SHA256(ADMIN_PASSWORD, "mqt-admin")).
 * Verification uses crypto.timingSafeEqual. Nothing here throws when
 * ADMIN_PASSWORD is missing — isAdminRequest() simply returns false and the
 * login route returns 503 so the admin UI can show setup instructions.
 */
import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const ADMIN_COOKIE = "mqt_admin";

export function signAdmin(password: string): string {
  return createHmac("sha256", password).update("mqt-admin").digest("hex");
}

/**
 * Timing-safe admin check. Async, takes no arguments — it reads the
 * `mqt_admin` cookie itself via next/headers (Next 16: cookies() is async).
 * Must be called from a request context (route handler / server component).
 * Returns false when ADMIN_PASSWORD is missing or the cookie is absent.
 */
export async function isAdminRequest(): Promise<boolean> {
  const secret = process.env.ADMIN_PASSWORD;
  if (!secret) return false;
  const store = await cookies();
  const token = store.get(ADMIN_COOKIE)?.value;
  if (!token) return false;
  const expected = signAdmin(secret);
  const a = Buffer.from(token, "utf8");
  const b = Buffer.from(expected, "utf8");
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

function cookieHeader(value: string, maxAgeSeconds: number): string {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  return (
    `${ADMIN_COOKIE}=${value}; Path=/; HttpOnly${secure}; SameSite=Lax; ` +
    `Max-Age=${maxAgeSeconds}`
  );
}

/** 200 + sets the httpOnly admin cookie (7 days). */
export function loginResponse(): NextResponse {
  const secret = process.env.ADMIN_PASSWORD ?? "";
  return NextResponse.json(
    { ok: true },
    { headers: { "Set-Cookie": cookieHeader(signAdmin(secret), 60 * 60 * 24 * 7) } },
  );
}

/** Clears the admin cookie. */
export function logoutResponse(): NextResponse {
  return NextResponse.json(
    { ok: true },
    { headers: { "Set-Cookie": cookieHeader("", 0) } },
  );
}

/**
 * Timing-safe check of a candidate password against ADMIN_PASSWORD.
 * Returns false (not an error) when ADMIN_PASSWORD is not configured.
 */
export function isCorrectPassword(candidate: string): boolean {
  const secret = process.env.ADMIN_PASSWORD;
  if (!secret) return false;
  const a = Buffer.from(signAdmin(candidate), "utf8");
  const b = Buffer.from(signAdmin(secret), "utf8");
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}
