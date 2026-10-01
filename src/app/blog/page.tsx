import { Suspense } from "react";
import { ALL_BLOGS } from "@/data/blogIndex";
import { siteConfig } from "@/data/siteConfig";
import { safeJsonLd } from "@/utils/jsonLd";
import { BlogIndexContent, type DbPostSummary } from "./BlogIndexClient";

/**
 * Server-rendered blog index wrapper.
 *
 * Merges published CMS posts (Neon blog_posts via /admin/blog/new) into the
 * blog-index ItemList JSON-LD server-side — CMS wins on slug collision,
 * newest first, top 12 — so crawlers discover CMS posts even though the
 * index grid itself is client-rendered. The same CMS list is passed to the
 * client component as initialCmsPosts, so the browser skips its own
 * /api/blog/posts fetch on the first paint.
 */
export default async function BlogIndexPage() {
  let cmsPosts: DbPostSummary[] = [];
  try {
    const { listPublishedPosts } = await import("@/lib/blogDb");
    cmsPosts = await listPublishedPosts();
  } catch {
    cmsPosts = [];
  }

  // Same merge rule the client grid uses: DB wins on slug collision.
  const bySlug = new Map<string, { title: string; snippet: string; image: string; publishedAt: string }>();
  for (const blog of ALL_BLOGS) {
    bySlug.set(blog.slug, {
      title: blog.title,
      snippet: blog.snippet,
      image: blog.image,
      // Legacy static posts without a stored date share one default — same
      // fallback the client cards use (see LEGACY_DEFAULT_DATE there).
      publishedAt: blog.publishedAt ?? "2026-09-21",
    });
  }
  for (const post of cmsPosts) {
    bySlug.set(post.slug, {
      title: post.title,
      snippet: post.meta_description,
      image: post.cover_image,
      publishedAt: post.published_at ?? "2026-09-21",
    });
  }
  const ranked = Array.from(bySlug.entries())
    .sort((a, b) => new Date(b[1].publishedAt).getTime() - new Date(a[1].publishedAt).getTime())
    .slice(0, 12);

  const blogIndexJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${siteConfig.name} Travel Blog`,
    description: `Explore destination guides, practical travel tips, pilgrimage advice and trip inspiration from ${siteConfig.name}.`,
    url: `${siteConfig.domain}/blog`,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: ranked.map(([slug, post], i) => ({
        "@type": "ListItem",
        position: i + 1,
        item: {
          "@type": "BlogPosting",
          headline: post.title,
          description: post.snippet,
          url: `${siteConfig.domain}/blog/${slug}`,
          image: post.image.startsWith("http") ? post.image : `${siteConfig.domain}${post.image}`,
          author: { "@type": "Organization", name: siteConfig.name, url: siteConfig.domain },
        },
      })),
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(blogIndexJsonLd) }} />
      <Suspense fallback={<div className="min-h-screen bg-gray-50" />}>
        <BlogIndexContent initialCmsPosts={cmsPosts} />
      </Suspense>
    </>
  );
}
