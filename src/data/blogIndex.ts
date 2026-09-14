import blogIndexRaw from "@/data/blogIndex.generated.json";

export interface BlogIndexEntry {
  slug: string;
  title: string;
  snippet: string;
  image: string;
  category: string;
  readingTime: number;
  wordCount: number;
}

// Keep article bodies out of client bundles used by the listing and sidebar.
export const ALL_BLOGS = blogIndexRaw as BlogIndexEntry[];

// Get unique categories with counts
export const CATEGORIES = ['All Articles', ...Array.from(new Set(ALL_BLOGS.map(b => b.category))).sort()];
export const categoryCounts: Record<string, number> = { 'All Articles': ALL_BLOGS.length };
ALL_BLOGS.forEach(b => { categoryCounts[b.category] = (categoryCounts[b.category] || 0) + 1; });
