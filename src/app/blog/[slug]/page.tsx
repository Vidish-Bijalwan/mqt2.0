import fullBlogDataRaw from "@/data/fullBlogData.json";
import fullBlogDataCleanRaw from "@/data/fullBlogDataClean.json";
import Image from "next/image";
import Link from "next/link";
import { Calendar, Phone } from "lucide-react";
import BlogSidebar from "@/components/blog/BlogSidebar";
import { siteConfig } from "@/data/siteConfig";
import { notFound } from "next/navigation";

// Prefer the cleaned content (junk nav/form blocks removed); fall back to the
// original scrape for any post missing from the cleaned set.
const fullBlogData = fullBlogDataRaw as Record<string, any>;
const fullBlogDataClean = fullBlogDataCleanRaw as Record<string, any>;

function blogFor(slug: string) {
  const clean = fullBlogDataClean[slug] || fullBlogDataClean[`blog__${slug}`];
  return clean || fullBlogData[slug] || fullBlogData[`blog__${slug}`];
}

import { getBlogImage } from "@/data/blogImageMap";
import AutoLinker from "@/components/ui/AutoLinker";

// Pre-render all real blog posts as static HTML; revalidate daily so new
// posts appear without a full rebuild. Junk archive keys (travel-theme__*,
// blog__*) are excluded from the static set and render on demand.
export function generateStaticParams() {
  return Object.keys(fullBlogData)
    .filter((k) => !k.includes('__'))
    .map((slug) => ({ slug }));
}

export const dynamicParams = true;

export const revalidate = 86400; // 24h ISR

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug.toLowerCase();
  
  const blog = blogFor(slug);
  if (!blog) return { title: `Blog | My Quick Trippers` };

  const image = getBlogImage(slug);
  const contentText = blog.content?.filter((c: any) => c.type === 'p').map((c: any) => c.text).join(' ').substring(0, 160) || '';

  return {
    title: `${blog.title} | My Quick Trippers`,
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
function RenderContent({ content }: { content: any[] }) {
  if (!content || !Array.isArray(content)) return null;
  return (
    <div className="prose max-w-none text-gray-700 leading-relaxed text-lg">
      {content.map((block, idx) => {
        if (block.type === 'p') return <p key={idx} className="mb-4"><AutoLinker text={block.text} /></p>;
        if (block.type === 'h2') return <h2 key={idx} className="text-2xl font-bold text-gray-900 mt-8 mb-4">{block.text}</h2>;
        if (block.type === 'h3') return <h3 key={idx} className="text-xl font-bold text-gray-900 mt-6 mb-3">{block.text}</h3>;
        if (block.type === 'ul') return (
          <ul key={idx} className="list-disc pl-6 mb-6">
            {block.items.map((item: string, i: number) => (
              <li key={i} className="mb-2">{item}</li>
            ))}
          </ul>
        );
        return null;
      })}
    </div>
  );
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug.toLowerCase();
  
  const blog = blogFor(slug);
  if (!blog) {
    notFound();
  }

  // Determine reading time
  const contentText = blog.content?.filter((c: any) => c.type === 'p').map((c: any) => c.text).join(' ') || '';
  const wordCount = contentText.split(/\s+/).filter(Boolean).length;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));
  const image = getBlogImage(slug);

  // Related posts — rank other posts by shared words in title + headings (U24)
  const currentWords = new Set(
    `${blog.title} ${(blog.headings?.h2 || []).join(' ')}`.toLowerCase().replace(/[^a-z0-9 ]/g, ' ').split(/\s+/).filter((w: string) => w.length > 3)
  );
  const related = Object.keys(fullBlogData)
    .filter((k) => !k.includes('__') && k !== slug && k !== `blog__${slug}`)
    .map((k) => {
      const b = fullBlogData[k];
      const words = new Set(
        `${b.title || ''} ${(b.headings?.h2 || []).join(' ')}`.toLowerCase().replace(/[^a-z0-9 ]/g, ' ').split(/\s+/).filter((w: string) => w.length > 3)
      );
      let score = 0;
      words.forEach((w) => { if (currentWords.has(w)) score++; });
      return { slug: k.replace(/^blog__/, ''), title: b.title || k, score };
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
      "@type": "Person",
      "name": "Rajesh Kumar, MQT India"
    },
    "publisher": {
      "@type": "Organization",
      "name": "My Quick Trippers",
      "logo": {
        "@type": "ImageObject",
        "url": `${siteConfig.domain}/logo/mqt-india-logo.png`
      }
    },
    "datePublished": new Date().toISOString().split('T')[0], // Using current date as fallback
    "description": contentText.substring(0, 200)
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
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
          <span>Published on My Quick Trippers</span>
          <span className="mx-2">•</span>
          <span>{readingTime} min read</span>
        </div>
        <div className="relative w-full h-[400px] mb-8 rounded overflow-hidden bg-gray-200">
           <Image src={getBlogImage(slug)} alt={blog.title} fill sizes="(max-width: 768px) 100vw, 800px" className="object-cover" priority />
        </div>
        <RenderContent content={blog.content} />

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
