import fullBlogDataRaw from "@/data/fullBlogData.json";
import Image from "next/image";
import Link from "next/link";
import { Calendar, Phone } from "lucide-react";
import { siteConfig } from "@/data/siteConfig";
import { notFound } from "next/navigation";

const fullBlogData = fullBlogDataRaw as Record<string, any>;

import { getBlogImage } from "@/data/blogImageMap";
import AutoLinker from "@/components/ui/AutoLinker";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug.toLowerCase();
  
  const blog = fullBlogData[slug] || fullBlogData[`blog__${slug}`];
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
  
  const blog = fullBlogData[slug] || fullBlogData[`blog__${slug}`];
  if (!blog) {
    notFound();
  }

  // Determine reading time
  const contentText = blog.content?.filter((c: any) => c.type === 'p').map((c: any) => c.text).join(' ') || '';
  const wordCount = contentText.split(/\s+/).filter(Boolean).length;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));
  const image = getBlogImage(slug);

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
      <div className="container mx-auto px-4 max-w-4xl mt-10 bg-white p-8 rounded shadow-sm border border-gray-200">
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
        <div className="mt-12 pt-8 border-t border-gray-200 text-center">
           <h3 className="text-xl font-bold text-legacy-nav-blue mb-4">Ready to explore this destination?</h3>
           <a href={`tel:${siteConfig.phoneRaw}`} className="inline-flex items-center bg-brand-green hover:bg-green-700 text-white font-bold px-8 py-3 rounded transition-colors">
             <Phone className="w-5 h-5 mr-2" /> Call Now: {siteConfig.phone}
           </a>
        </div>
      </div>
    </div>
    </>
  );
}
