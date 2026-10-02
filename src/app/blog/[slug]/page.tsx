import Image from "next/image";
import Link from "next/link";
import { cache } from "react";
import { Calendar, Phone, User, ChevronRight } from "lucide-react";
import BlogSidebar from "@/components/blog/BlogSidebar";
import BlogShareButtons from "@/components/blog/BlogShareButtons";
import BlogEngagement from "@/components/blog/BlogEngagement";
import { siteConfig } from "@/data/siteConfig";
import { notFound } from "next/navigation";
import type { ContentBlock } from "@/types/content";
import { ALL_BLOGS, GONE_BLOG_SLUGS } from "@/data/blogIndex";
import type { BlogIndexEntry } from "@/data/blogIndex";
import { getEditorialBlocks } from "@/data/blogEditorial";
import { getBlogImage, getBlogImageCredit } from "@/data/blogImageMap";
import { getBlogPostContent } from "@/data/blogPosts/content";
import AutoLinker from "@/components/ui/AutoLinker";
import { IMAGE_SKELETON } from "@/utils/imagePlaceholder";
import AttentionTracker from "@/components/analytics/AttentionTracker";
import { safeJsonLd } from "@/utils/jsonLd";
import { markdownToBlocks } from "@/lib/blogMarkdown";

function blogFor(slug: string) {
  return ALL_BLOGS.find((blog) => blog.slug === slug);
}

export type BlogSlugStatus = "live" | "gone" | "missing";
// Middleware-adjacent 410 decision logic (the proxy in src/proxy.ts serves
// the real HTTP 410 for "gone"; this page 404s "missing"):
// - "live":    passes the editorial gate (in ALL_BLOGS) → render.
// - "gone":    exists in the legacy scrape but failed the editorial gate —
//             a confirmed-dead, de-listed post → HTTP 410 Gone.
// - "missing": never existed → normal 404 (or a CMS post — checked below).
export function getBlogSlugStatus(rawSlug: string): BlogSlugStatus {
  const slug = rawSlug.toLowerCase();
  if (ALL_BLOGS.some((blog) => blog.slug === slug)) return "live";
  if (GONE_BLOG_SLUGS.has(slug)) return "gone";
  return "missing";
}

/** CMS-authored post summaries for related-post ranking (Neon blog_posts). */
interface DbPostSummary {
  slug: string;
  title: string;
  category: string;
  tags: string[];
}

/**
 * Fetch published CMS post summaries for the related-posts pool. Same guards
 * as getDbBlogPost: skipped entirely when DATABASE_URL is absent so
 * `next build` never touches the DB; drafts and future-dated posts are
 * filtered by listPublishedPosts itself.
 */
const getCmsPostSummaries = cache(async (): Promise<DbPostSummary[]> => {
  if (!process.env.DATABASE_URL) return [];
  try {
    const { listPublishedPosts } = await import("@/lib/blogDb");
    return listPublishedPosts();
  } catch {
    return [];
  }
});

/** CMS-authored post row shape from src/lib/blogDb. */
interface DbBlogPost {
  id: string;
  slug: string;
  title: string;
  meta_description: string;
  cover_image: string;
  category: string;
  tags: string[];
  target_keyword: string;
  body_md: string;
  published_at: string | null;
  created_at?: string;
  updated_at?: string;
}

/**
 * Fetch a CMS-authored post from Neon. Skipped entirely when DATABASE_URL is
 * absent, so `next build` never touches the DB. Drafts (published_at null)
 * and future-dated posts stay invisible. Cached per request so
 * generateMetadata and the page share a single lookup.
 */
const getDbBlogPost = cache(async (slug: string): Promise<DbBlogPost | null> => {
  if (!process.env.DATABASE_URL) return null;
  try {
    // Supports both backend shapes: getDb() returning a client with
    // getPostBySlug, or a standalone getPostBySlug export.
    const mod = (await import("@/lib/blogDb")) as {
      getDb?: () => { getPostBySlug?: (slug: string) => Promise<DbBlogPost | null> } | null | undefined;
      getPostBySlug?: (slug: string) => Promise<DbBlogPost | null>;
    };
    let post: DbBlogPost | null = null;
    const db = typeof mod.getDb === "function" ? mod.getDb() : null;
    if (db && typeof db.getPostBySlug === "function") {
      post = await db.getPostBySlug(slug);
    } else if (typeof mod.getPostBySlug === "function") {
      post = await mod.getPostBySlug(slug);
    }
    if (!post || !post.published_at) return null;
    if (new Date(post.published_at).getTime() > Date.now()) return null;
    return post;
  } catch {
    return null;
  }
});

/** Normalized post view shared by the static catalogue and CMS posts. */
interface ResolvedPost {
  slug: string;
  title: string;
  snippet: string;
  /** Image for metadata/JSON-LD (blog.image || getBlogImage fallback). */
  image: string;
  /** Exact cover src for the hero (static posts use getBlogImage(slug)). */
  coverImage: string;
  /** Optional CC photo credit for the hero, rendered as a figcaption. */
  coverCredit?: string;
  category: string;
  tags: string[];
  publishedAt: string;
  readingTime: number;
  blocks: ContentBlock[];
}

function staticPostView(blog: BlogIndexEntry, slug: string): ResolvedPost {
  const factoryContent = getBlogPostContent(slug);
  const blocks = factoryContent ?? getEditorialBlocks(blog);
  const contentText = blocks
    .filter((block) => block.type === "p")
    .map((block) => block.text || "")
    .join(" ");
  const wordCount = contentText.split(/\s+/).filter(Boolean).length;
  return {
    slug,
    title: blog.title,
    snippet: blog.snippet,
    image: blog.image || getBlogImage(slug),
    coverImage: getBlogImage(slug),
    coverCredit: getBlogImageCredit(slug),
    category: blog.category,
    tags: blog.tags,
    publishedAt: blog.publishedAt ?? "2026-09-21",
    readingTime: blog.readingTime ?? Math.max(1, Math.ceil(wordCount / 200)),
    blocks,
  };
}

function dbPostView(post: DbBlogPost): ResolvedPost {
  const blocks = markdownToBlocks(post.body_md);
  const contentText = blocks
    .filter((block) => block.type === "p")
    .map((block) => block.text || "")
    .join(" ");
  const wordCount = contentText.split(/\s+/).filter(Boolean).length;
  return {
    slug: post.slug,
    title: post.title,
    snippet: post.meta_description,
    image: post.cover_image,
    coverImage: post.cover_image,
    category: post.category,
    tags: post.tags ?? [],
    publishedAt: post.published_at as string,
    readingTime: Math.max(1, Math.ceil(wordCount / 200)),
    blocks,
  };
}

async function resolvePost(slug: string): Promise<ResolvedPost | null> {
  const status = getBlogSlugStatus(slug);
  if (status === "live") {
    const blog = blogFor(slug);
    return blog ? staticPostView(blog, slug) : null;
  }
  if (status === "missing") {
    const dbPost = await getDbBlogPost(slug);
    return dbPost ? dbPostView(dbPost) : null;
  }
  return null; // "gone": the proxy serves HTTP 410 upstream
}

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
  // ("gone" slugs are served as HTTP 410 by the proxy; "missing" as 404
  // unless a published CMS post exists under that slug.)
  const post = await resolvePost(slug);
  if (!post) {
    return {
      title: { absolute: "Travel Blog | My Quick Trippers" },
      robots: { index: false, follow: false },
    };
  }

  const image = post.image.startsWith("http") ? post.image : `${siteConfig.domain}${post.image}`;

  return {
    title: { absolute: `${post.title} | My Quick Trippers` },
    description: post.snippet,
    alternates: {
      canonical: `${siteConfig.domain}/blog/${slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.snippet,
      url: `${siteConfig.domain}/blog/${slug}`,
      type: 'article',
      images: [{ url: image, width: 1200, height: 630, alt: post.title }],
      publishedTime: post.publishedAt,
      modifiedTime: post.publishedAt,
      authors: ['My Quick Trippers'],
      section: post.category,
      tags: post.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.snippet,
      images: [image],
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
        if (block.type === 'takeaways') return (
          <aside key={idx} className="not-prose my-6 rounded-xl border border-amber-200 bg-amber-50 p-6">
            <p className="text-sm font-bold uppercase tracking-widest text-amber-800 mb-3">Key takeaways</p>
            <ul className="space-y-2.5">
              {(block.items || []).map((item, i) => (
                <li key={i} className="flex gap-2.5 text-gray-800 leading-relaxed">
                  <span aria-hidden="true" className="mt-0.5 font-bold text-amber-600">✓</span>
                  <span><AutoLinker text={item} /></span>
                </li>
              ))}
            </ul>
          </aside>
        );
        if (block.type === 'pullquote') return (
          <blockquote key={idx} className="not-prose my-8 border-l-4 border-amber-500 pl-6 py-1">
            <p className="text-2xl font-medium italic leading-snug text-gray-900">&ldquo;{block.text}&rdquo;</p>
          </blockquote>
        );
        if (block.type === 'sources') return (
          <div key={idx} className="not-prose mt-6 rounded-xl border border-gray-200 bg-gray-50 p-6">
            <ul className="space-y-2.5">
              {(block.items || []).map((item, i) => (
                <li key={i} className="flex gap-2.5 text-gray-700 leading-relaxed">
                  <span aria-hidden="true" className="font-bold text-gray-400">{i + 1}.</span>
                  <span><AutoLinker text={item} /></span>
                </li>
              ))}
            </ul>
          </div>
        );
        return null;
      })}
    </div>
  );
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug.toLowerCase();

  const post = await resolvePost(slug);
  if (!post) {
    // "gone" slugs are intercepted upstream by the proxy with a real
    // HTTP 410; "missing" slugs were never real (or are unpublished CMS
    // posts). Either way this render path must not serve content —
    // fall back to the 404 page.
    notFound();
  }

  // Visible publish date: legacy posts without a stored date fall back to the
  // same default used in the JSON-LD so the meta line always shows a date.
  const publishedLabel = new Date(post.publishedAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });

  // Related posts are ranked by the same category/tag taxonomy used by search.
  const currentWords = new Set(
    `${post.title} ${post.category} ${post.tags.join(' ')}`.toLowerCase().replace(/[^a-z0-9 ]/g, ' ').split(/\s+/).filter((w: string) => w.length > 3)
  );
  // The pool unions the static catalogue with published CMS posts (Neon), so
  // CMS-authored posts appear as related posts and cross-link into the static
  // catalogue instead of sitting orphaned.
  const cmsSummaries = await getCmsPostSummaries();
  const staticSlugSet = new Set(ALL_BLOGS.map((blog) => blog.slug));
  const relatedPool: { slug: string; title: string; category: string; tags: string[] }[] = [
    ...ALL_BLOGS,
    ...cmsSummaries
      .filter((candidate) => !staticSlugSet.has(candidate.slug))
      .map((candidate) => ({
        slug: candidate.slug,
        title: candidate.title,
        category: candidate.category,
        tags: candidate.tags ?? [],
      })),
  ];
  const related = relatedPool
    .filter((candidate) => candidate.slug !== post.slug)
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
      { "@type": "ListItem", "position": 3, "name": post.title, "item": `${siteConfig.domain}/blog/${slug}` },
    ],
  };

  const contentText = post.blocks
    .filter((block) => block.type === 'p')
    .map((block) => block.text || '')
    .join(' ');
  const jsonLdImage = post.image.startsWith("http") ? post.image : `${siteConfig.domain}${post.image}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `${siteConfig.domain}/blog/${slug}`
    },
    "headline": post.title,
    "image": jsonLdImage,
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
    "datePublished": post.publishedAt,
    "dateModified": post.publishedAt,
    "description": contentText.substring(0, 200) || post.snippet
  };

  // FAQ rich snippet: derive Q&A pairs from a trailing "Frequently Asked
  // Questions" section (h2 followed by h3 question + p answer pairs).
  const faqPairs: Array<{ question: string; answer: string }> = (() => {
    const idx = post.blocks.findIndex(
      (b) => b.type === "h2" && /frequently asked questions/i.test(b.text || "")
    );
    if (idx === -1) return [];
    const pairs: Array<{ question: string; answer: string }> = [];
    let current: { question: string; answer: string } | null = null;
    for (let i = idx + 1; i < post.blocks.length; i++) {
      const b = post.blocks[i];
      if (b.type === "h2") break;
      if (b.type === "h3") {
        if (current) pairs.push(current);
        current = { question: b.text || "", answer: "" };
      } else if (b.type === "p" && current && !current.answer) {
        current.answer = b.text || "";
      }
    }
    if (current) pairs.push(current);
    return pairs.filter((p) => p.question && p.answer);
  })();

  const faqLd = faqPairs.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqPairs.map((p) => ({
      "@type": "Question",
      "name": p.question,
      "acceptedAnswer": { "@type": "Answer", "text": p.answer },
    })),
  } : null;

  return (
    <>
      <AttentionTracker event="blog_attention" page={`/blog/${slug}`} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbLd) }} />
      {faqLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(faqLd) }} />
      )}
      <div className="bg-gray-50 min-h-screen pb-16">
      <div className="bg-legacy-nav-blue text-white text-xs py-2 px-4">
        <div className="container mx-auto w-[95%] max-w-[1600px] flex items-center">
          <Link href="/" className="hover:text-legacy-orange">Home</Link>
          <ChevronRight className="w-3 h-3 mx-1 opacity-70" />
          <Link href="/blog" className="hover:text-legacy-orange">Blog</Link>
          <ChevronRight className="w-3 h-3 mx-1 opacity-70" />
          <span className="text-legacy-orange truncate">{post.title}</span>
        </div>
      </div>
      <div className="container mx-auto px-4 max-w-6xl mt-10">
      <div className="lg:grid lg:grid-cols-[1fr_320px] lg:gap-8">
      <div className="bg-white p-6 md:p-8 rounded shadow-sm border border-gray-200 mb-8 lg:mb-0">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">{post.title}</h1>
        <div className="flex flex-wrap items-center text-gray-500 text-sm mb-8 pb-4 border-b">
          <User className="w-4 h-4 mr-2" />
          <span>By My Quick Trippers</span>
          <span className="mx-2">•</span>
          <Calendar className="w-4 h-4 mr-2" />
          <span>Published {publishedLabel}</span>
          <span className="mx-2">•</span>
          <span>{post.readingTime} min read</span>
        </div>
        <figure className="mb-8">
          <div className="relative w-full h-[400px] rounded overflow-hidden bg-gray-200">
            <Image src={post.coverImage} alt={post.title} fill sizes="(max-width: 768px) 100vw, 800px" className="object-cover" priority placeholder={IMAGE_SKELETON} />
          </div>
          {post.coverCredit && (
            <figcaption className="mt-2 text-xs text-gray-500">Photo: {post.coverCredit}</figcaption>
          )}
        </figure>
        <RenderContent content={post.blocks} />
        <BlogShareButtons title={post.title} url={`${siteConfig.domain}/blog/${slug}`} />

        <BlogEngagement key={slug} slug={slug} />

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
             <a href={`tel:${siteConfig.phoneTel}`} className="inline-flex items-center bg-brand-green hover:bg-green-700 text-white font-bold px-8 py-3 rounded transition-colors">
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
