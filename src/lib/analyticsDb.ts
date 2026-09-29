/**
 * First-party website analytics data layer (Neon Postgres).
 *
 * Cookieless pageview analytics for myquicktrippers.com — answers "what is
 * getting traffic" without any third-party tracker:
 *   - The `@neondatabase/serverless` client is created lazily inside getDb();
 *     nothing here touches the network or reads env at module top-level, so
 *     `next build` is safe with no DATABASE_URL set.
 *   - Every helper degrades gracefully when DATABASE_URL is missing: reads
 *     return empty defaults, writes become no-ops.
 *   - All queries are parameterized (neon tagged templates). No raw SQL
 *     interpolation anywhere.
 *
 * Privacy model:
 *   - No cookies, no fingerprinting. Visitors are NOT tracked across days:
 *     session_hash = sha256(ip + "|" + user-agent + "|" + UTC date + "|" +
 *     salt), so the same visitor gets a fresh hash every day. Raw IPs are
 *     NEVER stored. Referrers are reduced to their origin (host) so query
 *     strings / PII in referrer URLs never land in the table.
 */
import { neon } from "@neondatabase/serverless";
import { createHash } from "node:crypto";

/**
 * Typed facade over the Neon serverless client (same pattern as blogDb.ts).
 * The @neondatabase/serverless 1.1.0 typings model `neon()` as
 * `NeonQueryFunction<ArrayMode, FullResults>`, whose tagged-template call
 * signature takes no type arguments — writing `sql<Row[]>`\`...\` there is a
 * type error (TS2558). We cast once, at client creation in getDb(), so every
 * query site below can use `sql<Row[]>` with honest row types.
 */
interface TypedSql {
  <Rows extends unknown[] = Record<string, unknown>[]>(
    strings: TemplateStringsArray,
    ...params: unknown[]
  ): Promise<Rows>;
  query<Rows extends unknown[] = Record<string, unknown>[]>(
    queryWithPlaceholders: string,
    params?: unknown[],
  ): Promise<Rows>;
}

type Sql = TypedSql;

/* ------------------------------------------------------------------ */
/* Row / input types                                                    */
/* ------------------------------------------------------------------ */

export interface AnalyticsEventInput {
  path: string;
  referrer: string | null;
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  device: string;
  browser: string | null;
  country: string | null;
  sessionHash: string;
}

export interface AnalyticsBucket {
  /** Bucket start in ISO (IST-aligned for the label). */
  bucket: string;
  label: string;
  pageviews: number;
  visitors: number;
}

export interface AnalyticsTopItem {
  key: string;
  views: number;
}

export type AnalyticsRange = "today" | "24h" | "7d" | "30d";

export interface AnalyticsSummary {
  range: AnalyticsRange;
  /** Start of the window (ISO). */
  since: string;
  totalPageviews: number;
  uniqueVisitors: number;
  buckets: AnalyticsBucket[];
  topPages: AnalyticsTopItem[];
  topReferrers: AnalyticsTopItem[];
  topUtmSources: AnalyticsTopItem[];
  devices: AnalyticsTopItem[];
}

const EMPTY_SUMMARY = (range: AnalyticsRange, since: string): AnalyticsSummary => ({
  range,
  since,
  totalPageviews: 0,
  uniqueVisitors: 0,
  buckets: [],
  topPages: [],
  topReferrers: [],
  topUtmSources: [],
  devices: [],
});

/* ------------------------------------------------------------------ */
/* Lazy client                                                          */
/* ------------------------------------------------------------------ */

let sqlClient: Sql | null | undefined;

export function getDb(): Sql | null {
  if (sqlClient !== undefined) return sqlClient;
  const url = process.env.DATABASE_URL;
  if (!url) {
    sqlClient = null;
    return null;
  }
  sqlClient = neon(url) as unknown as Sql;
  return sqlClient;
}

/* ------------------------------------------------------------------ */
/* Schema (runs once, CREATE TABLE IF NOT EXISTS)                        */
/* ------------------------------------------------------------------ */

const DDL_STATEMENTS: string[] = [
  `CREATE TABLE IF NOT EXISTS analytics_events (
     id bigserial PRIMARY KEY,
     ts timestamptz DEFAULT now(),
     path text NOT NULL,
     referrer text,
     utm_source text,
     utm_medium text,
     utm_campaign text,
     device text NOT NULL DEFAULT 'desktop',
     browser text,
     country text,
     session_hash text NOT NULL
   )`,
  `CREATE INDEX IF NOT EXISTS analytics_events_ts_idx ON analytics_events (ts)`,
  `CREATE INDEX IF NOT EXISTS analytics_events_path_ts_idx ON analytics_events (path, ts)`,
];

let schemaPromise: Promise<void> | null = null;

export function ensureSchema(): Promise<void> {
  if (!schemaPromise) {
    schemaPromise = (async () => {
      const sql = getDb();
      if (!sql) return;
      for (const stmt of DDL_STATEMENTS) {
        await sql.query(stmt);
      }
    })();
    // Allow a later call to retry if schema creation failed (e.g. cold DB).
    schemaPromise.catch(() => {
      schemaPromise = null;
    });
  }
  return schemaPromise;
}

/* ------------------------------------------------------------------ */
/* Identity + parsing helpers                                           */
/* ------------------------------------------------------------------ */

/** Daily-rotating anonymous session id. Raw IP is never stored. */
export function sessionHashFor(ip: string, userAgent: string): string {
  const date = new Date().toISOString().slice(0, 10); // UTC date
  const salt = process.env.ANALYTICS_SALT ?? "mqt-analytics-salt";
  return createHash("sha256")
    .update(`${ip}|${userAgent}|${date}|${salt}`, "utf8")
    .digest("hex");
}

/** Obvious bot / crawler UAs are skipped at the track endpoint. */
const BOT_UA_RE =
  /bot|crawler|spider|crawling|slurp|mediapartners|baidu|yandex|sogou|exabot|facebot|ia_archiver|ahrefs|semrush|mj12bot|dotbot|petalbot|headless|lighthouse|pagespeed/i;

export function isBotUserAgent(ua: string): boolean {
  return BOT_UA_RE.test(ua);
}

export function deviceFromUserAgent(ua: string): string {
  if (/ipad|tablet|playbook|silk(?!\s*mac)/i.test(ua)) return "tablet";
  if (/mobile|android|iphone|ipod|blackberry|iemobile|opera mini/i.test(ua))
    return "mobile";
  return "desktop";
}

export function browserFromUserAgent(ua: string): string | null {
  const m =
    ua.match(/(Edg|OPR|Firefox|Chrome|Safari)\/(\d+)/i) ?? ua.match(/(MSIE|Trident)/i);
  if (!m) return null;
  const name = m[1].toLowerCase();
  if (name === "edg") return "Edge";
  if (name === "opr") return "Opera";
  if (name === "trident" || name === "msie") return "IE";
  return name.charAt(0).toUpperCase() + name.slice(1);
}

/** Reduce a referrer to its origin host; never store full URLs w/ queries. */
export function referrerHost(referrer: string): string | null {
  const trimmed = referrer.trim();
  if (!trimmed) return null;
  try {
    return new URL(trimmed).host || null;
  } catch {
    return null;
  }
}

/* ------------------------------------------------------------------ */
/* Writes                                                               */
/* ------------------------------------------------------------------ */

export async function recordEvent(input: AnalyticsEventInput): Promise<void> {
  const sql = getDb();
  if (!sql) return;
  await ensureSchema();
  await sql`
    INSERT INTO analytics_events
      (path, referrer, utm_source, utm_medium, utm_campaign, device, browser, country, session_hash)
    VALUES
      (${input.path}, ${input.referrer}, ${input.utmSource}, ${input.utmMedium},
       ${input.utmCampaign}, ${input.device}, ${input.browser}, ${input.country}, ${input.sessionHash})`;
}

/* ------------------------------------------------------------------ */
/* Summary queries                                                      */
/* ------------------------------------------------------------------ */

const IST_OFFSET_MIN = 330;

/** Midnight at the start of the current IST day, as a Date (UTC instant). */
function istDayStart(now: Date = new Date()): Date {
  const istNow = new Date(now.getTime() + (IST_OFFSET_MIN + now.getTimezoneOffset()) * 60000);
  const y = istNow.getUTCFullYear();
  const m = istNow.getUTCMonth();
  const d = istNow.getUTCDate();
  return new Date(Date.UTC(y, m, d) - IST_OFFSET_MIN * 60000);
}

const istDateFmt = new Intl.DateTimeFormat("en-IN", {
  timeZone: "Asia/Kolkata",
  day: "2-digit",
  month: "short",
});
const istHourFmt = new Intl.DateTimeFormat("en-IN", {
  timeZone: "Asia/Kolkata",
  hour: "2-digit",
  minute: "2-digit",
  hour12: true,
});

interface BucketRow {
  bucket: string;
  pageviews: number;
  visitors: number;
}
interface KeyCountRow {
  key: string;
  views: number;
}
interface TotalsRow {
  pageviews: number;
  visitors: number;
}

export function rangeStart(range: AnalyticsRange, now: Date = new Date()): Date {
  switch (range) {
    case "today":
      return istDayStart(now);
    case "24h":
      return new Date(now.getTime() - 24 * 3600_000);
    case "7d":
      return new Date(now.getTime() - 7 * 24 * 3600_000);
    case "30d":
      return new Date(now.getTime() - 30 * 24 * 3600_000);
  }
}

function buildBuckets(range: AnalyticsRange, since: Date, rows: BucketRow[]): AnalyticsBucket[] {
  const hourly = range === "today" || range === "24h";
  const stepMs = hourly ? 3600_000 : 24 * 3600_000;
  // SQL buckets are IST-aligned (date_trunc on ts AT TIME ZONE 'Asia/Kolkata');
  // IST has no DST, so align the JS grid the same way: shift by +330min,
  // floor to the step, shift back.
  const shifted = since.getTime() + IST_OFFSET_MIN * 60000;
  const start = new Date(Math.floor(shifted / stepMs) * stepMs - IST_OFFSET_MIN * 60000);
  const byBucket = new Map<string, BucketRow>();
  for (const r of rows) byBucket.set(new Date(r.bucket).getTime().toString(), r);
  const out: AnalyticsBucket[] = [];
  const now = Date.now();
  for (let i = 0; i < 40; i++) {
    const t = new Date(start.getTime() + i * stepMs);
    if (t.getTime() > now) break;
    const hit = byBucket.get(t.getTime().toString());
    out.push({
      bucket: t.toISOString(),
      label: hourly ? istHourFmt.format(t) : istDateFmt.format(t),
      pageviews: hit?.pageviews ?? 0,
      visitors: hit?.visitors ?? 0,
    });
  }
  return out;
}

export async function getSummary(range: AnalyticsRange): Promise<AnalyticsSummary> {
  const since = rangeStart(range);
  const sinceIso = since.toISOString();
  const sql = getDb();
  if (!sql) return EMPTY_SUMMARY(range, sinceIso);
  await ensureSchema();

  const truncUnit = range === "today" || range === "24h" ? "hour" : "day";
  const [totals, bucketRows, pages, referrers, utms, devices] = await Promise.all([
    sql<TotalsRow[]>`
      SELECT COUNT(*)::int AS pageviews, COUNT(DISTINCT session_hash)::int AS visitors
      FROM analytics_events WHERE ts >= ${sinceIso}`,
    sql<BucketRow[]>`
      SELECT date_trunc(${truncUnit}, ts AT TIME ZONE 'Asia/Kolkata') AT TIME ZONE 'Asia/Kolkata' AS bucket,
             COUNT(*)::int AS pageviews, COUNT(DISTINCT session_hash)::int AS visitors
      FROM analytics_events WHERE ts >= ${sinceIso}
      GROUP BY 1 ORDER BY 1`,
    sql<KeyCountRow[]>`
      SELECT path AS key, COUNT(*)::int AS views
      FROM analytics_events WHERE ts >= ${sinceIso}
      GROUP BY path ORDER BY views DESC LIMIT 20`,
    sql<KeyCountRow[]>`
      SELECT referrer AS key, COUNT(*)::int AS views
      FROM analytics_events WHERE ts >= ${sinceIso} AND referrer IS NOT NULL
      GROUP BY referrer ORDER BY views DESC LIMIT 15`,
    sql<KeyCountRow[]>`
      SELECT utm_source AS key, COUNT(*)::int AS views
      FROM analytics_events WHERE ts >= ${sinceIso} AND utm_source IS NOT NULL
      GROUP BY utm_source ORDER BY views DESC LIMIT 15`,
    sql<KeyCountRow[]>`
      SELECT device AS key, COUNT(*)::int AS views
      FROM analytics_events WHERE ts >= ${sinceIso}
      GROUP BY device ORDER BY views DESC`,
  ]);

  return {
    range,
    since: sinceIso,
    totalPageviews: totals[0]?.pageviews ?? 0,
    uniqueVisitors: totals[0]?.visitors ?? 0,
    buckets: buildBuckets(range, since, bucketRows),
    topPages: pages,
    topReferrers: referrers,
    topUtmSources: utms,
    devices,
  };
}
