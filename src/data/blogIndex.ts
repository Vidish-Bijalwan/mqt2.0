import blogIndexRaw from "@/data/blogIndex.generated.json";
import { getBlogCategory, getBlogTags, getEditorialSnippet, isPublishedBlog } from "@/data/blogEditorial";

export interface BlogIndexEntry {
  slug: string;
  title: string;
  snippet: string;
  image: string;
  category: string;
  tags: string[];
  readingTime: number;
  wordCount: number;
}

// Keep article bodies out of client bundles used by the listing and sidebar.
// Only publish articles that pass the editorial quality and relevance gate.
// The legacy scrape remains available as a migration source, but never drives
// the catalogue, search results, or XML sitemap.
export const ALL_BLOGS: BlogIndexEntry[] = (blogIndexRaw as Omit<BlogIndexEntry, "tags">[])
  .filter((blog) => isPublishedBlog(blog))
  .map((blog) => ({
    ...blog,
    category: getBlogCategory(blog),
    tags: getBlogTags(blog),
    snippet: getEditorialSnippet(blog),
  }));

// Get unique categories with counts
export const CATEGORIES = ['All Articles', ...Array.from(new Set(ALL_BLOGS.map(b => b.category))).sort()];
export const categoryCounts: Record<string, number> = { 'All Articles': ALL_BLOGS.length };
ALL_BLOGS.forEach(b => { categoryCounts[b.category] = (categoryCounts[b.category] || 0) + 1; });
