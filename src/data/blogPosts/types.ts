import type { ContentBlock } from "@/types/content";

/**
 * Metadata for one factory-produced blog post.
 * Seeds MUST NOT contain article bodies: blogIndex.ts is imported by client
 * components (BlogSidebar, blog listing), so bodies live separately in
 * bodies/batch-N.ts and are only ever imported server-side.
 */
export interface BlogPostSeed {
  /** URL slug, lowercase-hyphenated, unique across all batches. */
  slug: string;
  /** Full post title (also used in <title>). Must pass the editorial gate. */
  title: string;
  /** Unique meta description, <=160 chars, includes the target keyword. */
  metaDescription: string;
  /** Existing image path, e.g. "/images/blog/kedarnath.webp". Verify with ls. */
  image: string;
  /** One of the 8 BlogCategory names in src/data/blogEditorial.ts. */
  category: string;
  /** 4-8 tags. */
  tags: string[];
  /** ceil(wordCount / 200). */
  readingTime: number;
  /** Real word count of the body text. Must be >= 1200 (gate needs >= 800). */
  wordCount: number;
  /** ISO timestamp with +05:30, e.g. "2026-09-28T09:17:00+05:30". */
  publishedAt: string;
  /** Primary keyword this post targets (editorial use). */
  targetKeyword: string;
}

/** Article bodies keyed by slug. Server-only: never import from client code. */
export type BlogPostBodies = Record<string, ContentBlock[]>;
