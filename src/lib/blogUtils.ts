/**
 * Small shared request helpers for the blog engagement API routes.
 * (Kept separate from blogDb.ts so DB and HTTP concerns don't mix.)
 */
import { createHash, randomUUID } from "node:crypto";
import type { NextRequest } from "next/server";

/** Slug validation used on every public endpoint. */
export const SLUG_RE = /^[a-z0-9-]{1,100}$/;

/** Slug validation for admin-created post slugs (3–80 chars). */
export const ADMIN_SLUG_RE = /^[a-z0-9-]{3,80}$/;

export function sha256Hex(input: string): string {
  return createHash("sha256").update(input, "utf8").digest("hex");
}

/** Client IP: first entry of x-forwarded-for, else "unknown". */
export function getClientIp(req: NextRequest): string {
  const xff = req.headers.get("x-forwarded-for");
  const first = xff?.split(",")[0]?.trim();
  return first && first.length > 0 ? first : "unknown";
}

/**
 * Engagement identity hash per SPEC: sha256(mqt_vid cookie || ip+ua).
 * A "|" separator avoids ambiguity between concatenated parts.
 */
export function viewerHashFor(req: NextRequest, mqtVid: string | undefined): string {
  const ua = req.headers.get("user-agent") ?? "";
  return sha256Hex(`${mqtVid ?? ""}|${getClientIp(req)}|${ua}`);
}

export function newViewerId(): string {
  return randomUUID();
}

/** Normalizes timestamptz values (string | Date) to ISO strings for JSON. */
export function toIsoDate(value: unknown): string {
  if (value instanceof Date) return value.toISOString();
  if (typeof value === "string" || typeof value === "number") {
    const d = new Date(value);
    if (!Number.isNaN(d.getTime())) return d.toISOString();
  }
  return new Date(0).toISOString();
}

/** Narrow an unknown JSON value to a plain record. */
export function asRecord(value: unknown): Record<string, unknown> | null {
  if (typeof value !== "object" || value === null || Array.isArray(value)) return null;
  return value as Record<string, unknown>;
}
