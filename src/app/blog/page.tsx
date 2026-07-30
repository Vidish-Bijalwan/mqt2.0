"use client";

import fullBlogDataRaw from "@/data/fullBlogData.json";
import { getBlogImage } from "@/data/blogImageMap";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight, Calendar, BookOpen, Clock, Search, X, Filter } from "lucide-react";
import { useState, useMemo } from "react";

const fullBlogData = fullBlogDataRaw as Record<string, { title: string; content: any[]; url?: string }>;

// Extract and process all blogs
const ALL_BLOGS = Object.entries(fullBlogData).map(([key, data], globalIdx) => {
  const cleanSlug = key.startsWith('blog__') ? key.replace('blog__', '') : key;
  const contentText = data.content?.filter(c => c.type === 'p').map(c => c.text).join(' ') || '';
  const wordCount = contentText.split(/\s+/).filter(Boolean).length;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  // Detect category from title/content
  const combined = (data.title + ' ' + contentText.substring(0, 300)).toLowerCase();
  let category = 'Travel';
  if (/pilgrim|yatra|temple|dham|jyotirlinga|spiritual|shrine/.test(combined)) category = 'Pilgrimage';
  else if (/adventure|trek|safari|rafting|camping|bungee|sport/.test(combined)) category = 'Adventure';
  else if (/beach|island|sea|coastal|cruise|goa|andaman|maldives/.test(combined)) category = 'Beaches';
  else if (/hill station|mountain|glacier|snowfall|valley|shimla|manali|ooty|munnar/.test(combined)) category = 'Hill Stations';
  else if (/food|restaurant|coffee|tea|cuisine|street food|dish/.test(combined)) category = 'Food & Cuisine';
  else if (/festival|culture|dance|art|museum|heritage|craft/.test(combined)) category = 'Cultural';
  else if (/tip|guide|budget|plan|pack|travel insurance|solo/.test(combined)) category = 'Travel Tips';
  else if (/hotel|resort|homestay|hostel|accommodation/.test(combined)) category = 'Hotels';
  else if (/buddhis|meditation|monastery/.test(combined)) category = 'Buddhist';
  else if (/honeymoon|romantic|couple/.test(combined)) category = 'Honeymoon';
  else if (/wildlife|national park|tiger|bird|sanctuary/.test(combined)) category = 'Wildlife';

  return {
    slug: cleanSlug,
    title: data.title?.replace(/ - My Quick Trippers Blog$/, '').replace(/ \| My Quick Trippers$/, '') || cleanSlug.replace(/-/g, ' '),
    snippet: contentText.substring(0, 160).trim() + (contentText.length > 160 ? '...' : '') || 'Discover this amazing destination...',
    image: getBlogImage(key, globalIdx),
    category,
    readingTime,
    wordCount,
  };
}).filter(b => b.wordCount > 30); // Filter out near-empty entries

// Get unique categories with counts
const CATEGORIES = ['All Articles', ...Array.from(new Set(ALL_BLOGS.map(b => b.category))).sort()];
const categoryCounts: Record<string, number> = { 'All Articles': ALL_BLOGS.length };
ALL_BLOGS.forEach(b => { categoryCounts[b.category] = (categoryCounts[b.category] || 0) + 1; });

const ITEMS_PER_PAGE = 24;

export default function BlogIndexPage() {
  const [activeCategory, setActiveCategory] = useState('All Articles');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const filteredBlogs = useMemo(() => {
    let result = ALL_BLOGS;
    if (activeCategory !== 'All Articles') {
      result = result.filter(b => b.category === activeCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(b => b.title.toLowerCase().includes(q) || b.snippet.toLowerCase().includes(q));
    }
    return result;
  }, [activeCategory, searchQuery]);

  const totalPages = Math.ceil(filteredBlogs.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentBlogs = filteredBlogs.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  const featuredBlogs = filteredBlogs.slice(0, 3);

  const handleCategoryChange = (cat: string) => {
    setActiveCategory(cat);
    setCurrentPage(1);
  };

  const handleSearch = (q: string) => {
    setSearchQuery(q);
    setCurrentPage(1);
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
            '/images/blog/kashmir-places-to-visit.jpg',
            '/images/blog/best-beaches-in-india.jpg',
            '/images/blog/famous-indian-hill-stations.jpg',
            '/images/blog/temples-in-india.jpg',
            '/images/blog/adventure-places-in-india.jpg',
            '/images/blog/waterfalls-in-kerala.webp',
            '/images/blog/12-jyotirlingas-in-india.jpg',
            '/images/blog/stepwells-in-gujarat.jpg',
          ].map((src, i) => (
            <div key={i} className="relative w-full h-full">
              <Image src={src} alt="" fill className="object-cover" sizes="25vw" />
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
            Discover guides, tips, and inspiration across our {ALL_BLOGS.length} articles.
          </p>

          {/* Search Bar */}
          <div className="relative max-w-xl mx-auto mb-8">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder={`Search ${ALL_BLOGS.length}+ travel articles...`}
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-12 pr-12 py-4 rounded-full bg-white text-gray-800 text-base border-2 border-legacy-orange/40 focus:border-legacy-orange focus:outline-none shadow-lg placeholder-gray-400"
            />
            {searchQuery && (
              <button onClick={() => handleSearch('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
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

      {/* ===== FEATURED ARTICLES ===== */}
      {activeCategory === 'All Articles' && !searchQuery && currentPage === 1 && (
        <section className="bg-slate-100 py-12 border-b border-gray-200">
          <div className="container mx-auto w-[95%] max-w-[1400px]">
            <div className="flex items-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800">Featured Articles</h2>
              <div className="w-12 h-1 bg-legacy-orange ml-4 rounded-full"></div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {featuredBlogs.map((blog, i) => (
                <Link key={blog.slug} href={`/blog/${blog.slug}`} className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-lg hover:border-legacy-orange/50 transition-all duration-300 group overflow-hidden flex flex-col">
                  <div className="relative h-56 overflow-hidden">
                    <Image src={blog.image} alt={blog.title} fill className="object-cover group-hover:scale-110 transition-transform duration-700" sizes="(max-width: 768px) 100vw, 33vw" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    <span className="absolute top-3 left-3 bg-legacy-orange text-white text-xs font-bold px-3 py-1 rounded-full shadow">{blog.category}</span>
                    <div className="absolute bottom-3 left-3 right-3">
                      <h3 className="text-white font-bold text-lg leading-tight line-clamp-2 drop-shadow-md">{blog.title}</h3>
                    </div>
                  </div>
                  <div className="p-5 flex-grow flex flex-col">
                    <div className="flex items-center text-xs text-gray-400 mb-3">
                      <Calendar className="w-3 h-3 mr-1" /> My Quick Trippers
                      <span className="mx-2">•</span>
                      <Clock className="w-3 h-3 mr-1" /> {blog.readingTime} min read
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
              <button onClick={() => handleCategoryChange('All Articles')} className="flex-shrink-0 px-3 py-2 text-sm text-red-500 hover:bg-red-50 rounded-full font-medium flex items-center">
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
              Showing <span className="font-semibold text-gray-800">{startIndex + 1}–{Math.min(startIndex + ITEMS_PER_PAGE, filteredBlogs.length)}</span> of <span className="font-semibold text-gray-800">{filteredBlogs.length}</span> articles
              {activeCategory !== 'All Articles' && <span> in <span className="text-legacy-orange font-semibold">{activeCategory}</span></span>}
              {searchQuery && <span> matching &quot;<span className="text-legacy-orange font-semibold">{searchQuery}</span>&quot;</span>}
            </p>
          </div>

          {currentBlogs.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
                    <div className="flex items-center text-xs text-gray-400 mb-2.5">
                      <Calendar className="w-3 h-3 mr-1" />
                      <span>MQT</span>
                      <span className="mx-1.5">•</span>
                      <Clock className="w-3 h-3 mr-1" />
                      <span>{blog.readingTime} min read</span>
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
              <button onClick={() => { setSearchQuery(''); setActiveCategory('All Articles'); }} className="bg-legacy-orange text-white px-6 py-2.5 rounded-full font-semibold hover:bg-orange-600 transition-colors">
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
      </section>
    </div>
  );
}
