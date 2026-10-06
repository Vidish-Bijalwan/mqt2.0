"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChevronRight, Calendar, BookOpen, Clock, Search, X, Filter } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { ALL_BLOGS, CATEGORIES, categoryCounts } from "@/data/blogIndex";
import type { BlogIndexEntry } from "@/data/blogIndex";
import BlogSidebar from "@/components/blog/BlogSidebar";
import BlogCardStats, { BlogCardStat } from "@/components/blog/BlogCardStats";
import { IMAGE_SKELETON } from "@/utils/imagePlaceholder";
import { trackEvent } from "@/lib/analytics";

const ITEMS_PER_PAGE = 24;

/** CMS post summary from GET /api/blog/posts (published only, newest first). */
export interface DbPostSummary {
  slug: string;
  title: string;
  meta_description: string;
  cover_image: string;
  category: string;
  tags: string[];
  target_keyword: string;
  published_at: string;
}

/** Card-ready shape shared by static catalogue entries and CMS posts. */
interface CardBlog {
  slug: string;
  title: string;
  snippet: string;
  image: string;
  category: string;
  tags: string[];
  /** Static posts always carry one; CMS summaries don't ship body text. */
  readingTime?: number;
  /** ISO date used for newest-first sorting. */
  publishedAt: string;
}

const LEGACY_DEFAULT_DATE = "2026-09-21";

function staticToCard(blog: BlogIndexEntry): CardBlog {
  return {
    slug: blog.slug,
    title: blog.title,
    snippet: blog.snippet,
    image: blog.image,
    category: blog.category,
    tags: blog.tags,
    readingTime: blog.readingTime,
    publishedAt: blog.publishedAt ?? LEGACY_DEFAULT_DATE,
  };
}

function dbToCard(post: DbPostSummary): CardBlog {
  return {
    slug: post.slug,
    title: post.title,
    snippet: post.meta_description,
    image: post.cover_image,
    category: post.category,
    tags: post.tags ?? [],
    publishedAt: post.published_at,
  };
}

function validateBlogSearchParams(cat: string | null, q: string | null) {
  const validCategories = ['All Articles', ...CATEGORIES];
  const category = validCategories.includes(cat || 'All Articles') ? (cat ?? 'All Articles') : 'All Articles';
  const query = (q || "")
    .replace(/[^\w\s-]/g, '')
    .trim()
    .substring(0, 100);
  return { category, query };
}

function BlogIndexContent({ initialCmsPosts }: { initialCmsPosts?: DbPostSummary[] | null }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const { category: validCategory, query: validQuery } = validateBlogSearchParams(searchParams.get('cat'), searchParams.get('q'));
  const [activeCategory, setActiveCategory] = useState(validCategory);
  const [searchQuery, setSearchQuery] = useState(validQuery);
  const [currentPage, setCurrentPage] = useState(1);
  // null = not loaded yet; [] = no CMS posts (static only). The server page
  // pre-fetches published CMS posts and passes them in; the client fetch is
  // then skipped (initialCmsPosts !== undefined) and only used as a fallback.
  const [dbPosts, setDbPosts] = useState<DbPostSummary[] | null>(initialCmsPosts ?? null);

  // Merge CMS posts client-side: DB wins on slug collision, newest first.
  // Any failure falls back to the static catalogue silently.
  useEffect(() => {
    if (initialCmsPosts !== undefined) return;
    let cancelled = false;
    fetch("/api/blog/posts")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (cancelled) return;
        const posts =
          data && typeof data === "object" && Array.isArray((data as { posts?: unknown }).posts)
            ? ((data as { posts: DbPostSummary[] }).posts.filter(
                (p) => p && typeof p.slug === "string" && typeof p.title === "string"
              ))
            : [];
        setDbPosts(posts);
      })
      .catch(() => {
        if (!cancelled) setDbPosts([]);
      });
    return () => {
      cancelled = true;
    };
  }, [initialCmsPosts]);

  const mergedBlogs = useMemo<CardBlog[]>(() => {
    const bySlug = new Map<string, CardBlog>();
    for (const blog of ALL_BLOGS) bySlug.set(blog.slug, staticToCard(blog));
    for (const post of dbPosts ?? []) bySlug.set(post.slug, dbToCard(post));
    return Array.from(bySlug.values()).sort(
      (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
  }, [dbPosts]);

  // Sync local filter state when the URL params change (e.g. back/forward
  // navigation). React-endorsed "adjust state during render" pattern — no effect needed.
  const [prevParams, setPrevParams] = useState({ validCategory, validQuery });
  if (prevParams.validCategory !== validCategory || prevParams.validQuery !== validQuery) {
    setPrevParams({ validCategory, validQuery });
    setActiveCategory(validCategory);
    setSearchQuery(validQuery);
    setCurrentPage(1);
  }

  const updateUrl = (category: string, query: string) => {
    const next = new URLSearchParams();
    if (category !== 'All Articles') next.set('cat', category);
    if (query) next.set('q', query);
    const queryString = next.toString();
    router.replace(queryString ? `${pathname}?${queryString}` : pathname, { scroll: false });
  };

  const filteredBlogs = useMemo(() => {
    let result = mergedBlogs;
    if (activeCategory !== 'All Articles') {
      result = result.filter(b => b.category === activeCategory);
    }
    if (searchQuery.trim()) {
      const terms = searchQuery
        .toLowerCase()
        .split(/\s+/)
        .filter((term) => term.length > 1 && !['blog', 'article', 'travel'].includes(term));
      result = result.filter((blog) => {
        const searchable = [blog.title, blog.category, blog.snippet, ...blog.tags].join(' ').toLowerCase();
        return (terms.length ? terms : [searchQuery.trim().toLowerCase()]).every((term) => searchable.includes(term));
      });
    }
    return result;
  }, [mergedBlogs, activeCategory, searchQuery]);

  const totalPages = Math.ceil(filteredBlogs.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentBlogs = filteredBlogs.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  const featuredBlogs = filteredBlogs.slice(0, 3);

  // One batched stats fetch covers every visible card (featured + grid).
  const statSlugs = useMemo(
    () => Array.from(new Set([...featuredBlogs, ...currentBlogs].map((b) => b.slug))),
    [featuredBlogs, currentBlogs]
  );

  const handleCategoryChange = (cat: string) => {
    setActiveCategory(cat);
    setCurrentPage(1);
    updateUrl(cat, searchQuery);
  };

  const handleSearch = (q: string) => {
    // Sanitize but keep spaces in state: trimming here would erase a trailing
    // space the moment the user types it, so typed multi-word queries collapse
    // ("kedarnath " -> "kedarnath" -> next char appends as "kedarnathyatra").
    // Trim only where the trimmed value is consumed (filter/URL/tracking).
    const sanitized = q.replace(/[^\w\s-]/g, '').substring(0, 100);
    setSearchQuery(sanitized);
    setCurrentPage(1);
    const trimmed = sanitized.trim();
    updateUrl(activeCategory, trimmed);
    // Query is sanitized above (word chars/spaces/hyphens, max 100) — never raw PII.
    if (trimmed) {
      trackEvent("search_query", { query: trimmed, page: "/blog" });
    }
  };

  // Generate page numbers with ellipsis
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push('...');
      for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
        pages.push(i);
      }
      if (currentPage < totalPages - 2) pages.push('...');
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-legacy-nav-blue text-white text-xs py-2 px-4">
        <div className="container mx-auto w-[95%] max-w-[1600px] flex items-center">
          <Link href="/" className="hover:text-legacy-orange transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3 mx-1 opacity-70" />
          <span className="text-legacy-orange">Blog</span>
        </div>
      </div>

      {/* ===== HERO SECTION ===== */}
      <section className="relative w-full min-h-[420px] md:min-h-[460px] flex items-center justify-center overflow-hidden">
        {/* Collage Background */}
        <div className="absolute inset-0 grid grid-cols-4 grid-rows-2 gap-0">
          {[
            '/images/packages/kashmir-hq.webp',
            '/images/blog/best-beaches-in-india.webp',
            '/images/blog/famous-indian-hill-stations.webp',
            '/images/blog/temples-in-india.webp',
            '/images/blog/adventure-places-in-india.webp',
            '/images/blog/waterfalls-in-kerala.webp',
            '/images/blog/12-jyotirlingas-in-india.webp',
            '/images/blog/stepwells-in-gujarat.webp',
          ].map((src, i) => (
            <div key={i} className="relative w-full h-full">
              <Image src={src} alt="Travel blog hero image" fill className="object-cover" sizes="25vw" placeholder={IMAGE_SKELETON} />
            </div>
          ))}
        </div>
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0f172a]/85 via-[#0f172a]/75 to-[#0f172a]/90"></div>

        {/* Hero Content */}
        <div className="relative z-10 text-center px-4 max-w-3xl mx-auto py-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 drop-shadow-lg">
            MQT Travel Blog
          </h1>
          <p className="text-white/80 text-lg md:text-xl mb-8">
            Discover guides, tips, and inspiration across our {mergedBlogs.length} articles.
          </p>

          {/* Search Bar */}
          <div className="relative max-w-xl mx-auto mb-8">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder={`Search ${mergedBlogs.length}+ travel articles...`}
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              maxLength={100}
              className="w-full pl-12 pr-12 py-4 rounded-full bg-white text-gray-800 text-base border-2 border-legacy-orange/40 focus:border-legacy-orange focus:outline-none shadow-lg placeholder-gray-400"
            />
            {searchQuery && (
              <button onClick={() => handleSearch('')} aria-label="Clear search" className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Category Pills */}
          <div className="flex flex-wrap justify-center gap-2">
            {CATEGORIES.slice(0, 8).map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                aria-label={`Filter by ${cat}`}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                  activeCategory === cat
                    ? 'bg-legacy-orange text-white shadow-md scale-105'
                    : 'bg-white/15 text-white/90 hover:bg-white/25 backdrop-blur-sm border border-white/20'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      <BlogCardStats slugs={statSlugs}>
      {/* ===== FEATURED ARTICLES ===== */}
      {activeCategory === 'All Articles' && !searchQuery && currentPage === 1 && (
        <section className="bg-slate-100 py-12 border-b border-gray-200">
          <div className="container mx-auto w-[95%] max-w-[1400px]">
            <div className="flex items-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800">Featured Articles</h2>
              <div className="w-12 h-1 bg-legacy-orange ml-4 rounded-full"></div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {featuredBlogs.map((blog) => (
                <Link key={blog.slug} href={`/blog/${blog.slug}`} className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-lg hover:border-legacy-orange/50 transition-all duration-300 group overflow-hidden flex flex-col">
                  <div className="relative h-56 overflow-hidden">
                    <Image src={blog.image} alt={blog.title} fill className="object-cover group-hover:scale-110 transition-transform duration-700" sizes="(max-width: 768px) 100vw, 33vw" loading="lazy" decoding="async" placeholder={IMAGE_SKELETON} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    <span className="absolute top-3 left-3 bg-legacy-orange text-white text-xs font-bold px-3 py-1 rounded-full shadow">{blog.category}</span>
                    <div className="absolute bottom-3 left-3 right-3">
                      <h3 className="text-white font-bold text-lg leading-tight line-clamp-2 drop-shadow-md">{blog.title}</h3>
                    </div>
                  </div>
                  <div className="p-5 flex-grow flex flex-col">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-gray-400 mb-3">
                      <span className="inline-flex items-center"><Calendar className="w-3 h-3 mr-1" /> My Quick Trippers</span>
                      {typeof blog.readingTime === "number" && (
                        <span className="inline-flex items-center"><span className="mx-1">•</span><Clock className="w-3 h-3 mr-1" /> {blog.readingTime} min read</span>
                      )}
                      <span className="inline-flex items-center"><span className="mx-1">•</span><BlogCardStat slug={blog.slug} /></span>
                    </div>
                    <p className="text-gray-600 text-sm line-clamp-3 mb-4 flex-grow">{blog.snippet}</p>
                    <span className="text-legacy-orange text-sm font-semibold flex items-center group-hover:translate-x-1 transition-transform">
                      Read Article <ChevronRight className="w-4 h-4 ml-1" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===== STICKY FILTER BAR ===== */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto w-[95%] max-w-[1400px] py-3">
          <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide">
            <Filter className="w-4 h-4 text-gray-400 flex-shrink-0" />
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeCategory === cat
                    ? 'bg-legacy-orange text-white shadow-sm'
                    : 'bg-gray-100 text-gray-600 border border-gray-200 hover:border-legacy-orange hover:text-legacy-orange'
                }`}
              >
                {cat} <span className="ml-1 text-xs opacity-70">({categoryCounts[cat] || 0})</span>
              </button>
            ))}
            {activeCategory !== 'All Articles' && (
              <button onClick={() => handleCategoryChange('All Articles')} aria-label="Clear category filter" className="flex-shrink-0 px-3 py-2 text-sm text-red-500 hover:bg-red-50 rounded-full font-medium flex items-center">
                <X className="w-3 h-3 mr-1" /> Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ===== MAIN BLOG GRID ===== */}
      <section className="py-10">
        <div className="container mx-auto w-[95%] max-w-[1400px]">
          {/* Results header */}
          <div className="flex justify-between items-center mb-6">
            <p className="text-sm text-gray-500">
              Showing <span className="font-semibold text-gray-800">{filteredBlogs.length ? `${startIndex + 1}–${Math.min(startIndex + ITEMS_PER_PAGE, filteredBlogs.length)}` : '0'}</span> of <span className="font-semibold text-gray-800">{filteredBlogs.length}</span> articles
              {activeCategory !== 'All Articles' && <span> in <span className="text-legacy-orange font-semibold">{activeCategory}</span></span>}
              {searchQuery && <span> matching &quot;<span className="text-legacy-orange font-semibold">{searchQuery}</span>&quot;</span>}
            </p>
          </div>

          <div className="lg:grid lg:grid-cols-[1fr_340px] lg:gap-8">
          <div>
          {currentBlogs.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {currentBlogs.map((blog, idx) => (
                <Link
                  key={blog.slug + idx}
                  href={`/blog/${blog.slug}`}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 hover:border-legacy-orange/40 transition-all duration-300 group flex flex-col overflow-hidden"
                >
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={blog.image}
                      alt={blog.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      loading="lazy"
                      decoding="async"
                      placeholder={IMAGE_SKELETON}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    {/* Category badge */}
                    <span className="absolute top-3 left-3 bg-legacy-orange/90 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide shadow">
                      {blog.category}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="p-5 flex-grow flex flex-col">
                    {/* Metadata */}
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-gray-400 mb-2.5">
                      <span className="inline-flex items-center"><Calendar className="w-3 h-3 mr-1" /> MQT</span>
                      {typeof blog.readingTime === "number" && (
                        <span className="inline-flex items-center"><span className="mx-1">•</span><Clock className="w-3 h-3 mr-1" /> {blog.readingTime} min read</span>
                      )}
                      <span className="inline-flex items-center"><span className="mx-1">•</span><BlogCardStat slug={blog.slug} /></span>
                    </div>

                    {/* Title */}
                    <h3 className="text-base font-bold text-gray-800 mb-2 line-clamp-2 group-hover:text-legacy-orange transition-colors leading-snug">
                      {blog.title}
                    </h3>

                    {/* Snippet */}
                    <p className="text-gray-500 text-sm line-clamp-3 mb-4 flex-grow leading-relaxed">
                      {blog.snippet}
                    </p>

                    {/* Read link */}
                    <span className="text-legacy-orange text-sm font-semibold flex items-center group-hover:translate-x-1 transition-transform mt-auto">
                      <BookOpen className="w-4 h-4 mr-1.5" /> Read Article
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-xl border border-gray-200">
              <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-700 mb-2">No articles found</h3>
              <p className="text-gray-500 mb-6">Try adjusting your search or filter criteria.</p>
              <button onClick={() => { setSearchQuery(''); setActiveCategory('All Articles'); }} aria-label="View all articles" className="bg-legacy-orange text-white px-6 py-2.5 rounded-full font-semibold hover:bg-orange-600 transition-colors">
                View All Articles
              </button>
            </div>
          )}

          {/* ===== PAGINATION ===== */}
          {totalPages > 1 && (
            <div className="mt-12 flex flex-col items-center gap-4">
              <p className="text-sm text-gray-500">
                Showing {startIndex + 1}–{Math.min(startIndex + ITEMS_PER_PAGE, filteredBlogs.length)} of {filteredBlogs.length} articles
              </p>
              <div className="flex items-center gap-1.5">
                {/* Previous */}
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  aria-label="Previous page"
                  className={`px-4 py-2.5 rounded-lg text-sm font-medium min-h-[40px] transition-colors ${
                    currentPage === 1
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-white text-gray-700 border border-gray-300 hover:border-legacy-orange hover:text-legacy-orange'
                  }`}
                >
                  Previous
                </button>

                {/* Page numbers (hidden on mobile) */}
                <div className="hidden sm:flex items-center gap-1.5">
                  {getPageNumbers().map((page, i) =>
                    page === '...' ? (
                      <span key={`ellipsis-${i}`} className="px-2 py-2.5 text-gray-400">…</span>
                    ) : (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page as number)}
                        className={`min-w-[40px] h-[40px] rounded-lg text-sm font-medium transition-all ${
                          currentPage === page
                            ? 'bg-legacy-orange text-white shadow-md'
                            : 'bg-white text-gray-700 border border-gray-200 hover:border-legacy-orange hover:text-legacy-orange'
                        }`}
                      >
                        {page}
                      </button>
                    )
                  )}
                </div>

                {/* Mobile page indicator */}
                <span className="sm:hidden px-4 py-2.5 text-sm text-gray-600 font-medium">
                  {currentPage} / {totalPages}
                </span>

                {/* Next */}
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  aria-label="Next page"
                  className={`px-4 py-2.5 rounded-lg text-sm font-medium min-h-[40px] transition-colors ${
                    currentPage === totalPages
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-legacy-orange text-white hover:bg-orange-600 shadow-sm'
                  }`}
                >
                  Next
                </button>
              </div>
            </div>
          )}
          </div>

          {/* ===== SIDEBAR (reference-style: Recent Posts + Categories) ===== */}
          <div className="mt-10 lg:mt-0">
            <BlogSidebar activeCategory={activeCategory} onSelectCategory={handleCategoryChange} />
          </div>
          </div>
        </div>
      </section>
      </BlogCardStats>
    </div>
  );
}

// The default export lives in ./page.tsx (a server component): it merges
// published CMS posts into the blog-index ItemList JSON-LD server-side and
// passes them to this client component as initialCmsPosts.
export { BlogIndexContent };
