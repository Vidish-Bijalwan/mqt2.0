import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Phone } from "lucide-react";
import { siteConfig } from "@/data/siteConfig";
import type { ContentBlock, ContentDocumentMap } from "@/types/content";
import { IMAGE_SKELETON } from "@/utils/imagePlaceholder";
import { ALL_BLOGS } from "@/data/blogIndex";

// Read huge JSON files on the server side
import fullBlogDataRaw from "@/data/fullBlogData.json";
import staticPagesDataRaw from "@/data/staticPagesData.json";

const fullBlogData = fullBlogDataRaw as ContentDocumentMap;
const staticPagesData = staticPagesDataRaw as ContentDocumentMap;

// Editorial gate, identical to the canonical /blog/[slug] route: a legacy
// blog record only renders here when its slug also survives in ALL_BLOGS
// (blogIndex filtered by isPublishedBlog). Records that fail the gate are
// confirmed-dead (HTTP 410 at /blog/<slug>) and must not be resurrected
// under a legacy prefix — least of all with a canonical pointing at a 410.
function gatedBlog(lastSlug: string) {
  const record = fullBlogData[lastSlug] || fullBlogData[`blog__${lastSlug}`];
  if (!record) return undefined;
  if (!ALL_BLOGS.some((blog) => blog.slug === lastSlug)) return undefined;
  return record;
}

export function generateStaticParams() {
  return [];
}

export const dynamicParams = true;

export async function generateMetadata({ params }: { params: Promise<{ slug: string[] }> }) {
  const resolvedParams = await params;
  if (!resolvedParams?.slug?.length) return { title: "Travel" };
  const lastSlug = resolvedParams.slug[resolvedParams.slug.length - 1].toLowerCase();
  
  // 1. Is it a Blog Post that passes the editorial gate?
  // Canonical is emitted ONLY when the canonical target /blog/<slug>
  // actually exists (resolves + passes the gate) — never at a 404/410.
  const blog = gatedBlog(lastSlug);
  if (blog) return { title: blog.title, alternates: { canonical: `${siteConfig.domain}/blog/${lastSlug}` } };
  
  // 2. Is it a Static Page?
  const staticPage = staticPagesData[lastSlug];
  if (staticPage) return { title: staticPage.title };
  
  // 3. Anything else 404s in the page below — keep it out of the index
  //    with no metadata and no canonical.
  return { title: "Travel", robots: { index: false, follow: false } };
}

function RenderContent({ content }: { content: ContentBlock[] }) {
  if (!content || !Array.isArray(content)) return null;
  return (
    <div className="prose max-w-none text-gray-700 leading-relaxed text-lg">
      {content.map((block, idx) => {
        if (block.type === 'p') return <p key={idx} className="mb-4">{block.text}</p>;
        // Same heading treatment as the /blog/[slug] renderer (which is
        // module-local there, so this stays a local copy): fullBlogData
        // currently only ships p/ul blocks, these are for parity/future data.
        if (block.type === 'h2') return <h2 key={idx} className="text-2xl font-bold text-gray-900 mt-8 mb-4">{block.text}</h2>;
        if (block.type === 'h3') return <h3 key={idx} className="text-xl font-bold text-gray-900 mt-6 mb-3">{block.text}</h3>;
        if (block.type === 'ul') return (
          <ul key={idx} className="list-disc pl-6 mb-6">
            {(block.items || []).map((item, i) => (
              <li key={i} className="mb-2">{item}</li>
            ))}
          </ul>
        );
        return null;
      })}
    </div>
  );
}

export default async function CatchAllPage({ params }: { params: Promise<{ slug: string[] }> }) {
  const resolvedParams = await params;
  if (!resolvedParams?.slug?.length) {
    notFound();
  }
  const lastSlug = resolvedParams.slug[resolvedParams.slug.length - 1].toLowerCase();
  
  // 1. Is it a Blog Post passing the editorial gate? (mirrors
  //    generateMetadata above so legacy prefixed paths render the post
  //    instead of falling through to 404 — gated-out posts 404 here)
  const blog = gatedBlog(lastSlug);
  if (blog) {
     return (
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

           <div className="relative h-[250px] w-full mb-8">
             <Image src={blog.image || "/images/packages/kerala.png"} alt={blog.title} fill sizes="100vw" className="object-cover" priority placeholder={IMAGE_SKELETON} />
             <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-center px-4">
                <h1 className="text-3xl md:text-5xl font-bold text-white capitalize">{blog.title}</h1>
             </div>
           </div>

           <div className="container mx-auto max-w-4xl bg-white p-8 md:p-12 rounded shadow-sm border border-gray-200">
              <RenderContent content={blog.content || []} />

              {/* Optional fallback for empty pages */}
              {(!blog.content || blog.content.length === 0) && (
                 <div className="text-center py-10">
                    <p className="text-gray-600 mb-8">This page is currently being updated by the My Quick Trippers team. Please contact us directly for any inquiries.</p>
                    <a href={`tel:${siteConfig.phoneTel}`} className="inline-flex items-center bg-legacy-orange hover:bg-orange-600 text-white font-bold px-8 py-3 rounded transition-colors">
                     <Phone className="w-5 h-5 mr-2" /> Contact Us
                   </a>
                 </div>
              )}
           </div>
        </div>
     );
  }

  // 2. Is it a generic static page? (about-us, contact-us, etc)
  const staticPage = staticPagesData[lastSlug];
  if (staticPage) {
     return (
        <div className="bg-gray-50 min-h-screen pb-16">
           <div className="bg-legacy-nav-blue text-white text-xs py-2 px-4">
             <div className="container mx-auto w-[95%] max-w-[1600px]">
               <Link href="/" className="hover:text-legacy-orange">Home</Link>
               {" » "}
               <span className="text-legacy-orange">{staticPage.title}</span>
             </div>
           </div>
           
           <div className="relative h-[250px] w-full mb-8">
             <Image src="/images/packages/kerala.png" alt={staticPage.title} fill sizes="100vw" className="object-cover" priority placeholder={IMAGE_SKELETON} />
             <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-center px-4">
                <h1 className="text-3xl md:text-5xl font-bold text-white capitalize">{staticPage.title}</h1>
             </div>
           </div>

           <div className="container mx-auto max-w-4xl bg-white p-8 md:p-12 rounded shadow-sm border border-gray-200">
              <RenderContent content={staticPage.content || []} />
              
              {/* Optional fallback for empty pages */}
              {(!staticPage.content || staticPage.content.length === 0) && (
                 <div className="text-center py-10">
                    <p className="text-gray-600 mb-8">This page is currently being updated by the My Quick Trippers team. Please contact us directly for any inquiries.</p>
                    <a href={`tel:${siteConfig.phoneTel}`} className="inline-flex items-center bg-legacy-orange hover:bg-orange-600 text-white font-bold px-8 py-3 rounded transition-colors">
                     <Phone className="w-5 h-5 mr-2" /> Contact Us
                   </a>
                 </div>
              )}
           </div>
        </div>
     );
  }

  // 3. Otherwise, return 404 since it's not a blog post or a static page
  notFound();
}
