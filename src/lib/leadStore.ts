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
}

export interface StoredEnquiry {
  id: string;
  createdAt: string;
}

export function isLeadStoreConfigured(): boolean {
  return Boolean(process.env.DATABASE_URL);
}

/** Insert one enquiry row. Throws on any failure — callers decide fallback. */
export async function storeEnquiry(record: EnquiryRecord): Promise<StoredEnquiry> {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error("lead-store-not-configured");
  }
  const sql = neon(databaseUrl);
  const rows = await sql`
    INSERT INTO enquiries (
      name, phone, email, package_slug, package_name,
      travel_date, travellers, message, source_url,
      utm_source, utm_medium, utm_campaign, utm_term, utm_content, gclid
    ) VALUES (
      ${record.name}, ${record.phone}, ${record.email},
      ${record.packageSlug}, ${record.packageName},
      ${record.travelDate}, ${record.travellers}, ${record.message},
      ${record.sourceUrl}, ${record.utmSource}, ${record.utmMedium},
      ${record.utmCampaign}, ${record.utmTerm}, ${record.utmContent},
      ${record.gclid}
    )
    RETURNING id, created_at
  `;
  const row = rows[0] as { id: string; created_at: string };
  return { id: row.id, createdAt: row.created_at };
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
