import { NextResponse } from "next/server";
import { listPublishedPosts } from "@/lib/blogDb";
import { toIsoDate } from "@/lib/blogUtils";

export const dynamic = "force-dynamic";

/**
 * GET /api/blog/posts
 * -> {posts:[{slug,title,meta_description,cover_image,category,tags,target_keyword,published_at}]}
 * published-only (published_at <= now()), newest first. No DB -> [].
 */
export async function GET() {
  const posts = (await listPublishedPosts()).map((p) => ({
    slug: p.slug,
    title: p.title,
    meta_description: p.meta_description,
    cover_image: p.cover_image,
    category: p.category,
    tags: p.tags ?? [],
    target_keyword: p.target_keyword ?? "",
    published_at: toIsoDate(p.published_at),
  }));
  return NextResponse.json({ posts });
}
