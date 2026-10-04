import blogIndexRaw from "@/data/blogIndex.generated.json";
import { getBlogCategory, getBlogTags, getEditorialSnippet, isPublishedBlog } from "@/data/blogEditorial";
import { BLOG_POST_SEEDS_BATCH_1 } from "@/data/blogPosts/seeds/batch-1";
import { BLOG_POST_SEEDS_BATCH_2 } from "@/data/blogPosts/seeds/batch-2";
import { BLOG_POST_SEEDS_BATCH_3 } from "@/data/blogPosts/seeds/batch-3";
import { BLOG_POST_SEEDS_BATCH_4 } from "@/data/blogPosts/seeds/batch-4";
import { BLOG_POST_SEEDS_BATCH_5 } from "@/data/blogPosts/seeds/batch-5";
import { BLOG_POST_SEEDS_BATCH_6 } from "@/data/blogPosts/seeds/batch-6";
import { BLOG_POST_SEEDS_BATCH_7 } from "@/data/blogPosts/seeds/batch-7";
import { BLOG_POST_SEEDS_BATCH_8 } from "@/data/blogPosts/seeds/batch-8";
import { BLOG_POST_SEEDS_BATCH_9 } from "@/data/blogPosts/seeds/batch-9";
import { BLOG_POST_SEEDS_BATCH_10 } from "@/data/blogPosts/seeds/batch-10";
import { BLOG_POST_SEEDS_BATCH_11 } from "@/data/blogPosts/seeds/batch-11";
import { BLOG_POST_SEEDS_BATCH_12 } from "@/data/blogPosts/seeds/batch-12";
import { BLOG_POST_SEEDS_BATCH_13 } from "@/data/blogPosts/seeds/batch-13";
import { BLOG_POST_SEEDS_BATCH_15D } from "@/data/blogPosts/seeds/batch-15d";
import { BLOG_POST_SEEDS_BATCH_15C } from "@/data/blogPosts/seeds/batch-15c";
import { BLOG_POST_SEEDS_BATCH_15B } from "@/data/blogPosts/seeds/batch-15b";
import { BLOG_POST_SEEDS_BATCH_15A } from "@/data/blogPosts/seeds/batch-15a";
import type { BlogPostSeed } from "@/data/blogPosts/types";

export interface BlogIndexEntry {
  slug: string;
  title: string;
  snippet: string;
  image: string;
  category: string;
  tags: string[];
  readingTime: number;
  wordCount: number;
  /** Factory posts only: unique meta description (also used as the snippet). */
  metaDescription?: string;
  /** Factory posts only: ISO publish timestamp; drives the drip schedule. */
  publishedAt?: string;
}

// Keep article bodies out of client bundles used by the listing and sidebar.
// Only publish articles that pass the editorial quality and relevance gate.
// The legacy scrape remains available as a migration source, but never drives
// the catalogue, search results, or XML sitemap.
//
// Factory seeds carry metadata only (no bodies — those live in
// blogPosts/bodies/*, imported server-side by the post page). Seeds whose
// publishedAt is in the future are excluded: every consumer (listing,
// search, sitemap, sidebar, post route, slug status) reads ALL_BLOGS, so a
// future-dated post 404s until its slot and appears via ISR afterwards.
const FACTORY_SEEDS: BlogPostSeed[] = [
  ...BLOG_POST_SEEDS_BATCH_1,
  ...BLOG_POST_SEEDS_BATCH_2,
  ...BLOG_POST_SEEDS_BATCH_3,
  ...BLOG_POST_SEEDS_BATCH_4,
  ...BLOG_POST_SEEDS_BATCH_5,
  ...BLOG_POST_SEEDS_BATCH_6,
  ...BLOG_POST_SEEDS_BATCH_7,
  ...BLOG_POST_SEEDS_BATCH_8,
  ...BLOG_POST_SEEDS_BATCH_9,
  ...BLOG_POST_SEEDS_BATCH_10,
  ...BLOG_POST_SEEDS_BATCH_11,
  ...BLOG_POST_SEEDS_BATCH_12,
  ...BLOG_POST_SEEDS_BATCH_13,
  ...BLOG_POST_SEEDS_BATCH_15A,
  ...BLOG_POST_SEEDS_BATCH_15B,
  ...BLOG_POST_SEEDS_BATCH_15C,
  ...BLOG_POST_SEEDS_BATCH_15D,
];

function isLiveSeed(seed: BlogPostSeed) {
  return new Date(seed.publishedAt).getTime() <= Date.now();
}

type RawEntry = Omit<BlogIndexEntry, "tags" | "metaDescription" | "publishedAt">;

export const ALL_BLOGS: BlogIndexEntry[] = (
  [
    ...(blogIndexRaw as RawEntry[]),
    ...FACTORY_SEEDS.filter(isLiveSeed),
  ] as (RawEntry | BlogPostSeed)[]
)
  .filter((blog) => isPublishedBlog(blog))
  .map((blog) => {
    const seed = blog as Partial<BlogPostSeed>;
    return {
      slug: blog.slug,
      title: blog.title,
      snippet: seed.metaDescription ?? getEditorialSnippet(blog),
      image: blog.image,
      category: seed.category ?? getBlogCategory(blog),
      tags: seed.tags ?? getBlogTags(blog),
      readingTime: blog.readingTime,
      wordCount: blog.wordCount,
      ...(seed.metaDescription ? { metaDescription: seed.metaDescription } : {}),
      ...(seed.publishedAt ? { publishedAt: seed.publishedAt } : {}),
    };
  });

// Get unique categories with counts
export const CATEGORIES = ['All Articles', ...Array.from(new Set(ALL_BLOGS.map(b => b.category))).sort()];
export const categoryCounts: Record<string, number> = { 'All Articles': ALL_BLOGS.length };
ALL_BLOGS.forEach(b => { categoryCounts[b.category] = (categoryCounts[b.category] || 0) + 1; });

// Slugs present in the legacy scrape that FAIL the editorial gate
// (archive/off-brand/under-length). These are confirmed-dead catalogue
// entries, not never-existing URLs:
// - src/app/blog/[slug]/page.tsx treats them as "gone" (HTTP 410 via the
//   proxy, so search engines de-list them fast) rather than 404.
// - src/app/[...slug]/page.tsx gates them out so legacy prefixed paths
//   can't resurrect them with canonicals pointing at a 410.
export const GONE_BLOG_SLUGS: ReadonlySet<string> = new Set(
  (blogIndexRaw as { slug: string }[])
    .map((blog) => blog.slug)
    .filter((slug) => !ALL_BLOGS.some((blog) => blog.slug === slug))
);
