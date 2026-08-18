"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Clock, Search, Phone, MessageCircle } from "lucide-react";
import { useState } from "react";
import { ALL_BLOGS, CATEGORIES, categoryCounts } from "@/data/blogIndex";
import { siteConfig } from "@/data/siteConfig";

interface BlogSidebarProps {
  /** Active category (listing) — highlights the row */
  activeCategory?: string;
  /** Listing handler; when omitted, categories navigate to /blog?cat=… */
  onSelectCategory?: (cat: string) => void;
  /** Show the search box (post pages) */
  showSearch?: boolean;
  /** Show the compact help card (post pages) */
  showHelpCard?: boolean;
}

export default function BlogSidebar({
  activeCategory,
  onSelectCategory,
  showSearch = false,
  showHelpCard = false,
}: BlogSidebarProps) {
  const router = useRouter();
  const [q, setQ] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const term = q.trim();
    router.push(term ? `/blog?q=${encodeURIComponent(term)}` : "/blog");
  };

  const handleCategory = (cat: string) => {
    if (onSelectCategory) {
      onSelectCategory(cat);
    } else {
      router.push(cat === "All Articles" ? "/blog" : `/blog?cat=${encodeURIComponent(cat)}`);
    }
  };

  return (
    <aside className="space-y-8 lg:sticky lg:top-24 self-start">
      {/* Search widget (reference-style) */}
      {showSearch && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h3 className="font-bold text-gray-800 text-lg mb-4 flex items-center">
            Search
            <span className="w-8 h-1 bg-legacy-orange ml-3 rounded-full"></span>
          </h3>
          <form onSubmit={handleSearch} className="flex">
            <input
              type="text"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Enter your search keyword..."
              className="flex-1 min-w-0 px-3.5 py-2.5 rounded-l-lg border border-gray-300 text-sm text-gray-700 focus:border-legacy-orange focus:outline-none"
            />
            <button
              type="submit"
              className="bg-legacy-orange hover:bg-orange-600 text-white px-4 rounded-r-lg flex items-center transition-colors"
              aria-label="Search articles"
            >
              <Search className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* Recent Posts widget */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h3 className="font-bold text-gray-800 text-lg mb-5 flex items-center">
          Recent Posts
          <span className="w-8 h-1 bg-legacy-orange ml-3 rounded-full"></span>
        </h3>
        <ul className="space-y-4">
          {ALL_BLOGS.slice(0, 5).map((blog) => (
            <li key={blog.slug}>
              <Link href={`/blog/${blog.slug}`} className="group flex gap-3">
                <div className="relative w-20 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                  <Image
                    src={blog.image}
                    alt={blog.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    sizes="80px"
                  />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-700 group-hover:text-legacy-orange leading-snug line-clamp-2 transition-colors">
                    {blog.title}
                  </p>
                  <p className="text-xs text-gray-400 mt-1 flex items-center">
                    <Clock className="w-3 h-3 mr-1" /> {blog.readingTime} min read
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Categories widget */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h3 className="font-bold text-gray-800 text-lg mb-5 flex items-center">
          Categories
          <span className="w-8 h-1 bg-legacy-orange ml-3 rounded-full"></span>
        </h3>
        <ul className="space-y-2.5">
          {CATEGORIES.filter((c) => c !== "All Articles").map((cat) => (
            <li key={cat}>
              <button
                onClick={() => handleCategory(cat)}
                className={`group w-full flex items-center justify-between text-sm transition-colors ${
                  activeCategory === cat ? "text-legacy-orange font-semibold" : "text-gray-600 hover:text-legacy-orange"
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <span
                    className={`w-2 h-2 rounded-full transition-colors ${
                      activeCategory === cat ? "bg-legacy-orange" : "bg-legacy-orange/70 group-hover:bg-legacy-orange"
                    }`}
                  ></span>
                  {cat}
                </span>
                <span
                  className={`text-xs ${
                    activeCategory === cat ? "text-legacy-orange" : "text-gray-400 group-hover:text-legacy-orange"
                  }`}
                >
                  {categoryCounts[cat] || 0}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Compact help card */}
      {showHelpCard && (
        <div className="bg-legacy-nav-blue rounded-xl p-6 text-white shadow-sm">
          <h3 className="font-bold text-lg mb-2">Need help planning your trip?</h3>
          <p className="text-white/70 text-sm mb-5">
            Talk to our travel experts — free itinerary advice, no obligation.
          </p>
          <div className="space-y-2.5">
            <a
              href={`tel:${siteConfig.phoneRaw}`}
              className="w-full flex items-center justify-center gap-2 bg-brand-green hover:bg-green-700 text-white text-sm font-bold py-2.5 rounded-lg transition-colors"
            >
              <Phone className="w-4 h-4" /> {siteConfig.phone}
            </a>
            <a
              href={siteConfig.social.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1eb857] text-white text-sm font-bold py-2.5 rounded-lg transition-colors"
            >
              <MessageCircle className="w-4 h-4" /> Chat on WhatsApp
            </a>
          </div>
        </div>
      )}
    </aside>
  );
}
