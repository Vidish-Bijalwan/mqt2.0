/**
 * Blog engagement + CMS data layer (Neon Postgres).
 *
 * - The `@neondatabase/serverless` client is created lazily inside `getDb()`;
 *   nothing here touches the network or reads env at module top-level, so
 *   `next build` is safe with no DATABASE_URL set.
 * - Every helper degrades gracefully when DATABASE_URL is missing: reads
 *   return empty defaults, writes become no-ops (upsertPost returns null).
 * - All queries are parameterized (neon tagged templates / sql.query with
 *   bound params). No raw SQL interpolation anywhere.
 */
import { neon } from "@neondatabase/serverless";
import { ipHashFor } from "./analyticsDb";

/**
 * Typed facade over the Neon serverless client.
 *
 * The @neondatabase/serverless 1.1.0 typings model `neon()` as
 * `NeonQueryFunction<ArrayMode extends boolean, FullResults extends boolean>`,
 * whose tagged-template call signature takes no type arguments — writing
 * `sql<Row[]>`\`...\` there is a type error (TS2558). We cast once, at client
 * creation in getDb(), so every query site below can use `sql<Row[]>` with
 * honest row types. The underlying rows are always Record<string, any>[] at
 * runtime, so the cast is safe.
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
/* Row types                                                           */
/* ------------------------------------------------------------------ */

export interface BlogPostRow {
  id: string;
  slug: string;
  title: string;
  meta_description: string;
  cover_image: string;
  category: string;
  tags: string[];
  target_keyword: string;
  body_md: string;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface PublishedPostRow {
  slug: string;
  title: string;
  meta_description: string;
  cover_image: string;
  category: string;
  tags: string[];
  target_keyword: string;
  published_at: string;
}

export interface BlogCommentRow {
  id: string;
  slug: string;
  author_name: string;
  author_email: string | null;
  body: string;
  created_at: string;
  approved: boolean;
}

export interface PublicComment {
  id: string;
  author_name: string;
  body: string;
  created_at: string;
}

export interface BlogEngagementStats {
  views: number;
  likes: number;
  comments: number;
}

export interface UpsertPostInput {
  slug: string;
  title: string;
  meta_description: string;
  cover_image: string;
  category: string;
  tags: string[];
  target_keyword: string;
  body_md: string;
  status: "draft" | "published";
}

interface CountRow {
  slug: string;
  n: number;
}

/* ------------------------------------------------------------------ */
/* Lazy client                                                         */
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
/* Schema (runs once, CREATE TABLE IF NOT EXISTS)                       */
/* ------------------------------------------------------------------ */

const DDL_STATEMENTS: string[] = [
  `CREATE TABLE IF NOT EXISTS blog_posts (
     id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
     slug text UNIQUE NOT NULL,
     title text NOT NULL,
     meta_description text NOT NULL,
     cover_image text NOT NULL,
     category text NOT NULL,
     tags text[] NOT NULL DEFAULT '{}',
     target_keyword text NOT NULL DEFAULT '',
     body_md text NOT NULL DEFAULT '',
     published_at timestamptz,
     created_at timestamptz DEFAULT now(),
     updated_at timestamptz DEFAULT now()
   )`,
  `CREATE TABLE IF NOT EXISTS blog_views (
     slug text NOT NULL,
     viewer_hash text NOT NULL,
     viewed_at timestamptz DEFAULT now(),
     PRIMARY KEY (slug, viewer_hash)
   )`,
  `CREATE TABLE IF NOT EXISTS blog_likes (
     slug text NOT NULL,
     liker_hash text NOT NULL,
     created_at timestamptz DEFAULT now(),
     PRIMARY KEY (slug, liker_hash)
   )`,
  `CREATE TABLE IF NOT EXISTS blog_comments (
     id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
     slug text NOT NULL,
     author_name text NOT NULL,
     author_email text,
     body text NOT NULL,
     created_at timestamptz DEFAULT now(),
     approved boolean DEFAULT true
   )`,
  `ALTER TABLE blog_comments ADD COLUMN IF NOT EXISTS author_ip text`,
  `CREATE INDEX IF NOT EXISTS blog_comments_slug_created_idx ON blog_comments (slug, created_at DESC)`,
  `CREATE INDEX IF NOT EXISTS blog_comments_ip_created_idx ON blog_comments (author_ip, created_at DESC)`,
  `CREATE INDEX IF NOT EXISTS blog_views_slug_idx ON blog_views (slug)`,
  `CREATE INDEX IF NOT EXISTS blog_likes_slug_idx ON blog_likes (slug)`,
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
/* Posts                                                               */
/* ------------------------------------------------------------------ */

export async function getPostBySlug(slug: string): Promise<BlogPostRow | null> {
  const sql = getDb();
  if (!sql) return null;
  await ensureSchema();
  const rows = await sql<BlogPostRow[]>`
    SELECT id, slug, title, meta_description, cover_image, category, tags,
           target_keyword, body_md, published_at, created_at, updated_at
    FROM blog_posts
    WHERE slug = ${slug}
    LIMIT 1`;
  return rows[0] ?? null;
}

export async function listPublishedPosts(): Promise<PublishedPostRow[]> {
  const sql = getDb();
  if (!sql) return [];
  await ensureSchema();
  return sql<PublishedPostRow[]>`
    SELECT slug, title, meta_description, cover_image, category, tags,
           target_keyword, published_at
    FROM blog_posts
    WHERE published_at IS NOT NULL AND published_at <= now()
    ORDER BY published_at DESC`;
}

export async function slugExists(slug: string): Promise<boolean> {
  const sql = getDb();
  if (!sql) return false;
  await ensureSchema();
  const rows = await sql`SELECT 1 FROM blog_posts WHERE slug = ${slug} LIMIT 1`;
  return rows.length > 0;
}

export async function upsertPost(input: UpsertPostInput): Promise<string | null> {
  const sql = getDb();
  if (!sql) return null;
  await ensureSchema();
  const publishing = input.status === "published";
  const publishedAt: string | null = publishing ? new Date().toISOString() : null;
  const rows = await sql<{ slug: string }[]>`
    INSERT INTO blog_posts
      (slug, title, meta_description, cover_image, category, tags, target_keyword, body_md, published_at)
    VALUES
      (${input.slug}, ${input.title}, ${input.meta_description}, ${input.cover_image},
       ${input.category}, ${input.tags}, ${input.target_keyword}, ${input.body_md}, ${publishedAt})
    ON CONFLICT (slug) DO UPDATE SET
      title = EXCLUDED.title,
      meta_description = EXCLUDED.meta_description,
      cover_image = EXCLUDED.cover_image,
      category = EXCLUDED.category,
      tags = EXCLUDED.tags,
      target_keyword = EXCLUDED.target_keyword,
      body_md = EXCLUDED.body_md,
      updated_at = now(),
      published_at = CASE
        WHEN EXCLUDED.published_at IS NULL THEN NULL
        ELSE COALESCE(blog_posts.published_at, EXCLUDED.published_at)
      END
    RETURNING slug`;
  return rows[0]?.slug ?? null;
}

/* ------------------------------------------------------------------ */
/* Views                                                               */
/* ------------------------------------------------------------------ */

export async function recordView(slug: string, viewerHash: string): Promise<void> {
  const sql = getDb();
  if (!sql) return;
  await ensureSchema();
  await sql`
    INSERT INTO blog_views (slug, viewer_hash)
    VALUES (${slug}, ${viewerHash})
    ON CONFLICT (slug, viewer_hash) DO NOTHING`;
}

export async function getViewCount(slug: string): Promise<number> {
  const sql = getDb();
  if (!sql) return 0;
  await ensureSchema();
  const rows = await sql<{ n: number }[]>`
    SELECT COUNT(*)::int AS n FROM blog_views WHERE slug = ${slug}`;
  return rows[0]?.n ?? 0;
}

/* ------------------------------------------------------------------ */
/* Likes                                                               */
/* ------------------------------------------------------------------ */

export async function toggleLike(
  slug: string,
  likerHash: string,
): Promise<{ likes: number; liked: boolean }> {
  const sql = getDb();
  if (!sql) return { likes: 0, liked: false };
  await ensureSchema();
  const existing = await sql`
    SELECT 1 FROM blog_likes
    WHERE slug = ${slug} AND liker_hash = ${likerHash}
    LIMIT 1`;
  let liked: boolean;
  if (existing.length > 0) {
    await sql`
      DELETE FROM blog_likes
      WHERE slug = ${slug} AND liker_hash = ${likerHash}`;
    liked = false;
  } else {
    await sql`
      INSERT INTO blog_likes (slug, liker_hash)
      VALUES (${slug}, ${likerHash})
      ON CONFLICT (slug, liker_hash) DO NOTHING`;
    liked = true;
  }
  const likes = await getLikeCount(slug);
  return { likes, liked };
}

export async function getLikeCount(slug: string): Promise<number> {
  const sql = getDb();
  if (!sql) return 0;
  await ensureSchema();
  const rows = await sql<{ n: number }[]>`
    SELECT COUNT(*)::int AS n FROM blog_likes WHERE slug = ${slug}`;
  return rows[0]?.n ?? 0;
}

/* ------------------------------------------------------------------ */
/* Comments                                                            */
/* ------------------------------------------------------------------ */

export async function listComments(slug: string): Promise<PublicComment[]> {
  const sql = getDb();
  if (!sql) return [];
  await ensureSchema();
  return sql<PublicComment[]>`
    SELECT id, author_name, body, created_at
    FROM blog_comments
    WHERE slug = ${slug} AND approved = true
    ORDER BY created_at DESC
    LIMIT 50`;
}

export async function addComment(
  slug: string,
  name: string,
  email: string | null,
  body: string,
  authorIp: string | null = null,
): Promise<PublicComment | null> {
  const sql = getDb();
  if (!sql) return null;
  await ensureSchema();
  // Privacy: never store the raw client IP. author_ip holds the
  // daily-rotating salted hash from ipHashFor (same posture as the analytics
  // and lead-capture tables). Rows written before this change may hold raw
  // IPs; they simply won't match future hashed lookups.
  const storedIp = authorIp ? ipHashFor(authorIp) : null;
  const rows = await sql<PublicComment[]>`
    INSERT INTO blog_comments (slug, author_name, author_email, body, author_ip)
    VALUES (${slug}, ${name}, ${email}, ${body}, ${storedIp})
    RETURNING id, author_name, body, created_at`;
  return rows[0] ?? null;
}

/**
 * Anti-spam: how many comments this IP has submitted in the trailing window.
 * Backs the per-IP daily cap in the comments route. Unknown IPs ("") return 0
 * so the cap never groups unidentifiable clients together. `ip` is the raw
 * client IP — it is hashed with ipHashFor before the lookup, matching what
 * addComment stores. (The salt rotates daily, so the trailing window is
 * effectively "since UTC midnight", matching the documented daily cap.)
 */
export async function countRecentCommentsByIp(
  ip: string,
  windowHours = 24,
): Promise<number> {
  const sql = getDb();
  if (!sql || !ip) return 0;
  await ensureSchema();
  const hash = ipHashFor(ip);
  if (!hash) return 0;
  const rows = await sql<{ n: number }[]>`
    SELECT COUNT(*)::int AS n
    FROM blog_comments
    WHERE author_ip = ${hash}
      AND created_at > now() - make_interval(hours => ${windowHours})`;
  return rows[0]?.n ?? 0;
}

/* ------------------------------------------------------------------ */
/* Batched stats (missing slug -> zeros; no DB -> all zeros)           */
/* ------------------------------------------------------------------ */

export async function getStats(slugs: string[]): Promise<Record<string, BlogEngagementStats>> {
  const unique = [...new Set(slugs.filter((s) => typeof s === "string" && s.length > 0))];
  const out: Record<string, BlogEngagementStats> = {};
  for (const s of unique) out[s] = { views: 0, likes: 0, comments: 0 };
  const sql = getDb();
  if (!sql || unique.length === 0) return out;
  await ensureSchema();
  const [views, likes, comments] = await Promise.all([
    sql<CountRow[]>`
      SELECT slug, COUNT(*)::int AS n FROM blog_views
      WHERE slug = ANY(${unique}) GROUP BY slug`,
    sql<CountRow[]>`
      SELECT slug, COUNT(*)::int AS n FROM blog_likes
      WHERE slug = ANY(${unique}) GROUP BY slug`,
    sql<CountRow[]>`
      SELECT slug, COUNT(*)::int AS n FROM blog_comments
      WHERE slug = ANY(${unique}) AND approved = true GROUP BY slug`,
  ]);
  for (const row of views) {
    if (out[row.slug]) out[row.slug].views = row.n;
  }
  for (const row of likes) {
    if (out[row.slug]) out[row.slug].likes = row.n;
  }
  for (const row of comments) {
    if (out[row.slug]) out[row.slug].comments = row.n;
  }
  return out;
}
