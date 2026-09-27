import Image from "next/image";
import Link from "next/link";
import { Calendar, Phone } from "lucide-react";
import BlogSidebar from "@/components/blog/BlogSidebar";
import { siteConfig } from "@/data/siteConfig";
import { notFound } from "next/navigation";
import type { ContentBlock } from "@/types/content";
import { ALL_BLOGS, GONE_BLOG_SLUGS } from "@/data/blogIndex";
import { getEditorialBlocks } from "@/data/blogEditorial";

function blogFor(slug: string) {
  return ALL_BLOGS.find((blog) => blog.slug === slug);
}

export type BlogSlugStatus = "live" | "gone" | "missing";
// Middleware-adjacent 410 decision logic (the proxy in src/proxy.ts serves
// the real HTTP 410 for "gone"; this page 404s "missing"):
// - "live":    passes the editorial gate (in ALL_BLOGS) → render.
// - "gone":    exists in the legacy scrape but failed the editorial gate —
//             a confirmed-dead, de-listed post → HTTP 410 Gone.
// - "missing": never existed → normal 404.
export function getBlogSlugStatus(rawSlug: string): BlogSlugStatus {
  const slug = rawSlug.toLowerCase();
  if (ALL_BLOGS.some((blog) => blog.slug === slug)) return "live";
  if (GONE_BLOG_SLUGS.has(slug)) return "gone";
  return "missing";
}

import { getBlogImage } from "@/data/blogImageMap";
import { getBlogPostContent } from "@/data/blogPosts/content";
import AutoLinker from "@/components/ui/AutoLinker";
import { IMAGE_SKELETON } from "@/utils/imagePlaceholder";
import { safeJsonLd } from "@/utils/jsonLd";

// Pre-render a small set of entry articles. Long-tail posts render on demand
// and are cached by ISR, keeping deployments compact without changing URLs.
export function generateStaticParams() {
  return ALL_BLOGS.slice(0, 24).map((blog) => ({ slug: blog.slug }));
}

export const dynamicParams = true;

export const revalidate = 86400; // 24h ISR

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug.toLowerCase();

  // Gated-out slugs get no canonical and no indexable metadata.
  // ("gone" slugs are served as HTTP 410 by the proxy; "missing" as 404.)
  if (getBlogSlugStatus(slug) !== "live") {
    return {
      title: { absolute: "Travel Blog | My Quick Trippers" },
      robots: { index: false, follow: false },
    };
  }

  const blog = blogFor(slug);
  if (!blog) return { title: { absolute: "Travel Blog | My Quick Trippers" } };

  const image = blog.image || getBlogImage(slug);
  const contentText = blog.snippet;

  return {
    title: { absolute: `${blog.title} | My Quick Trippers` },
    description: contentText,
    alternates: {
      canonical: `${siteConfig.domain}/blog/${slug}`,
    },
    openGraph: {
      title: blog.title,
      description: contentText,
      url: `${siteConfig.domain}/blog/${slug}`,
      type: 'article',
      images: [{ url: `${siteConfig.domain}${image}`, width: 1200, height: 630, alt: blog.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: blog.title,
      description: contentText,
      images: [`${siteConfig.domain}${image}`],
    }
  };
}
function RenderContent({ content }: { content: ContentBlock[] }) {
  if (!content || !Array.isArray(content)) return null;
  return (
    <div className="prose max-w-none text-gray-700 leading-relaxed text-lg">
      {content.map((block, idx) => {
        if (block.type === 'p') return <p key={idx} className="mb-4"><AutoLinker text={block.text || ''} /></p>;
        if (block.type === 'h2') return <h2 key={idx} className="text-2xl font-bold text-gray-900 mt-8 mb-4">{block.text}</h2>;
        if (block.type === 'h3') return <h3 key={idx} className="text-xl font-bold text-gray-900 mt-6 mb-3">{block.text}</h3>;
        if (block.type === 'ul') return (
          <ul key={idx} className="list-disc pl-6 mb-6">
            {(block.items || []).map((item, i) => (
              <li key={i} className="mb-2">{item}</li>
            ))}
          </ul>
        );
        if (block.type === 'ol') return (
          <ol key={idx} className="list-decimal pl-6 mb-6 space-y-2">
            {(block.items || []).map((item, i) => (
              <li key={i} className="mb-1 pl-1">{item}</li>
            ))}
          </ol>
        );
        return null;
      })}
    </div>
  );
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug.toLowerCase();

  const status = getBlogSlugStatus(slug);
  if (status !== "live") {
    // "gone" slugs are intercepted upstream by the proxy with a real
    // HTTP 410; "missing" slugs were never real. Either way this render
    // path must not serve content — fall back to the 404 page.
    notFound();
  }

  const blog = blogFor(slug);
  if (!blog) {
    notFound();
  }

  // Determine reading time. Factory posts carry their own counted values;
  // legacy posts keep the template-content computation.
  const factoryContent = getBlogPostContent(slug);
  const editorialBlocks = factoryContent ?? getEditorialBlocks(blog);
  const contentText = editorialBlocks.filter((block) => block.type === 'p').map((block) => block.text || '').join(' ');
  const wordCount = contentText.split(/\s+/).filter(Boolean).length;
  const readingTime = factoryContent && blog.readingTime ? blog.readingTime : Math.max(1, Math.ceil(wordCount / 200));
  const image = blog.image || getBlogImage(slug);

  // Related posts are ranked by the same category/tag taxonomy used by search.
  const currentWords = new Set(
    `${blog.title} ${blog.category} ${blog.tags.join(' ')}`.toLowerCase().replace(/[^a-z0-9 ]/g, ' ').split(/\s+/).filter((w: string) => w.length > 3)
  );
  const related = ALL_BLOGS
    .filter((candidate) => candidate.slug !== slug)
    .map((candidate) => {
      const words = new Set(
        `${candidate.title} ${candidate.category} ${candidate.tags.join(' ')}`.toLowerCase().replace(/[^a-z0-9 ]/g, ' ').split(/\s+/).filter((w: string) => w.length > 3)
      );
      let score = 0;
      words.forEach((w) => { if (currentWords.has(w)) score++; });
      return { slug: candidate.slug, title: candidate.title, score };
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": siteConfig.domain },
      { "@type": "ListItem", "position": 2, "name": "Blog", "item": `${siteConfig.domain}/blog` },
      { "@type": "ListItem", "position": 3, "name": blog.title, "item": `${siteConfig.domain}/blog/${slug}` },
    ],
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `${siteConfig.domain}/blog/${slug}`
    },
    "headline": blog.title,
    "image": `${siteConfig.domain}${image}`,
    "author": {
      "@type": "Organization",
      "name": siteConfig.name
    },
    "publisher": {
      "@type": "Organization",
      "name": "My Quick Trippers",
      "logo": {
        "@type": "ImageObject",
        "url": `${siteConfig.domain}/logo/mqt-india-logo.png`
      }
    },
    "datePublished": blog.publishedAt ?? "2026-09-21",
    "dateModified": blog.publishedAt ?? "2026-09-21",
    "description": contentText.substring(0, 200)
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbLd) }} />
      <div className="bg-gray-50 min-h-screen pb-16">
      <div className="bg-legacy-nav-blue text-white text-xs py-2 px-4">
        <div className="container mx-auto w-[95%] max-w-[1600px]">
          <Link href="/" className="hover:text-legacy-orange">Home</Link>
          {" » "}
          <Link href="/blog" className="hover:text-legacy-orange">Blog</Link>
          {" » "}
          <span className="text-legacy-orange">{blog.title}</span>
        </div>
      </div>
      <div className="container mx-auto px-4 max-w-6xl mt-10">
      <div className="lg:grid lg:grid-cols-[1fr_320px] lg:gap-8">
      <div className="bg-white p-6 md:p-8 rounded shadow-sm border border-gray-200 mb-8 lg:mb-0">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">{blog.title}</h1>
        <div className="flex items-center text-gray-500 text-sm mb-8 pb-4 border-b">
          <Calendar className="w-4 h-4 mr-2" />
          <span>{blog.publishedAt ? `Published ${new Date(blog.publishedAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}` : "Published on My Quick Trippers"}</span>
          <span className="mx-2">•</span>
          <span>{readingTime} min read</span>
        </div>
        <div className="relative w-full h-[400px] mb-8 rounded overflow-hidden bg-gray-200">
           <Image src={getBlogImage(slug)} alt={blog.title} fill sizes="(max-width: 768px) 100vw, 800px" className="object-cover" priority placeholder={IMAGE_SKELETON} />
        </div>
        <RenderContent content={editorialBlocks} />

        {/* Related posts (U24) — cross-links readers to more content instead of dead-ending */}
        {related.length > 0 && (
          <div className="mt-10">
            <h3 className="text-xl font-bold text-legacy-nav-blue mb-4">Related Posts</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  href={`/blog/${r.slug}`}
                  className="bg-gray-50 hover:bg-orange-50 border border-gray-200 hover:border-legacy-orange rounded-lg p-4 transition-colors"
                >
                  <span className="text-[15px] font-semibold text-gray-800 hover:text-legacy-orange line-clamp-3">
                    {r.title}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="mt-12 pt-8 border-t border-gray-200 text-center">
           <h3 className="text-xl font-bold text-legacy-nav-blue mb-4">Ready to explore this destination?</h3>
           <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
             <Link href="/packages" className="inline-flex items-center bg-legacy-orange hover:bg-orange-600 text-white font-bold px-8 py-3 rounded transition-colors">
               Browse Tour Packages
             </Link>
             <a href={`tel:${siteConfig.phoneRaw}`} className="inline-flex items-center bg-brand-green hover:bg-green-700 text-white font-bold px-8 py-3 rounded transition-colors">
               <Phone className="w-5 h-5 mr-2" /> Call Now: {siteConfig.phone}
             </a>
           </div>
        </div>
      </div>

      {/* Sidebar (reference-style: search + recent posts + categories + help) */}
      <BlogSidebar showSearch showHelpCard />
      </div>
      </div>
    </div>
    </>
  );
}
