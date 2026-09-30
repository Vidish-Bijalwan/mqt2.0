/**
 * Lead storage layer — Neon serverless Postgres.
 *
 * "Simple database" by design: one table (`enquiries`, see
 * db/migrations/001_enquiries.sql), one insert path, no ORM.
 *
 * The connection string comes ONLY from the DATABASE_URL env var.
 * When it is absent (or the insert fails) callers must fall back to the
 * WhatsApp handoff so no lead is ever silently lost.
 */

import { neon } from "@neondatabase/serverless";

export interface EnquiryRecord {
  name: string;
  phone: string;
  email: string | null;
  packageSlug: string | null;
  packageName: string | null;
  travelDate: string | null; // YYYY-MM-DD
  travellers: number | null;
  message: string | null;
  sourceUrl: string | null;
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  utmTerm: string | null;
  utmContent: string | null;
  gclid: string | null;
  /** Daily-rotating salted IP hash (raw IP is never stored). Null = unknown. */
  ipHash?: string | null;
}

export interface StoredEnquiry {
  id: string;
  createdAt: string;
}

export function isLeadStoreConfigured(): boolean {
  return Boolean(process.env.DATABASE_URL);
}

/* Idempotent schema additions on top of db/migrations/001_enquiries.sql
 * (the base table is created by that migration; the route layer calls
 * ensureSchema() before inserting so the ip_hash column + index exist on
 * live DBs that were migrated before it was added). */
let schemaPromise: Promise<void> | null = null;

export function ensureSchema(): Promise<void> {
  if (!schemaPromise) {
    schemaPromise = (async () => {
      const databaseUrl = process.env.DATABASE_URL;
      if (!databaseUrl) return;
      const sql = neon(databaseUrl);
      await sql`ALTER TABLE enquiries ADD COLUMN IF NOT EXISTS ip_hash text`;
      await sql`CREATE INDEX IF NOT EXISTS idx_enquiries_ip_hash_created ON enquiries (ip_hash, created_at DESC)`;
    })();
    // Allow a later call to retry if schema creation failed (e.g. cold DB).
    schemaPromise.catch(() => {
      schemaPromise = null;
    });
  }
  return schemaPromise;
}

/** Insert one enquiry row. Throws on any failure — callers decide fallback. */
export async function storeEnquiry(record: EnquiryRecord): Promise<StoredEnquiry> {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error("lead-store-not-configured");
  }
  await ensureSchema();
  const sql = neon(databaseUrl);
  const rows = await sql`
    INSERT INTO enquiries (
      name, phone, email, package_slug, package_name,
      travel_date, travellers, message, source_url,
      utm_source, utm_medium, utm_campaign, utm_term, utm_content, gclid,
      ip_hash
    ) VALUES (
      ${record.name}, ${record.phone}, ${record.email},
      ${record.packageSlug}, ${record.packageName},
      ${record.travelDate}, ${record.travellers}, ${record.message},
      ${record.sourceUrl}, ${record.utmSource}, ${record.utmMedium},
      ${record.utmCampaign}, ${record.utmTerm}, ${record.utmContent},
      ${record.gclid}, ${record.ipHash ?? null}
    )
    RETURNING id, created_at
  `;
  const row = rows[0] as { id: string; created_at: string };
  return { id: row.id, createdAt: row.created_at };
}

/**
 * Anti-spam: how many enquiries this IP hash has submitted in the trailing
 * window. Backs the per-IP daily cap in the enquiries route. Empty hashes
 * return 0 so the cap never groups unidentifiable clients together.
 */
export async function countRecentEnquiriesByIpHash(
  ipHash: string,
  windowHours = 24,
): Promise<number> {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl || !ipHash) return 0;
  const sql = neon(databaseUrl);
  await ensureSchema();
  const rows = await sql`
    SELECT COUNT(*)::int AS n
    FROM enquiries
    WHERE ip_hash = ${ipHash}
      AND created_at > now() - make_interval(hours => ${windowHours})`;
  const row = rows[0] as { n: number } | undefined;
  return row?.n ?? 0;
}

/** Mark the row as WhatsApp-notified. Best effort — never throws. */
export async function markWhatsappNotified(id: string): Promise<void> {
  try {
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) return;
    const sql = neon(databaseUrl);
    await sql`UPDATE enquiries SET whatsapp_notified = TRUE WHERE id = ${id}`;
  } catch {
    // Notification bookkeeping must never break the request.
  }
}
