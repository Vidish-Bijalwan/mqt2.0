import fullBlogDataRaw from "@/data/fullBlogData.json";
import Image from "next/image";
import Link from "next/link";
import { Calendar, Phone } from "lucide-react";
import { siteConfig } from "@/data/siteConfig";
import { notFound } from "next/navigation";

const fullBlogData = fullBlogDataRaw as Record<string, any>;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug.toLowerCase();
  
  const blog = fullBlogData[slug] || fullBlogData[`blog__${slug}`];
  if (blog) return { title: `${blog.title} | My Quick Trippers` };
  
  return { title: `Blog | My Quick Trippers` };
}

function RenderContent({ content }: { content: any[] }) {
  if (!content || !Array.isArray(content)) return null;
  return (
    <div className="prose max-w-none text-gray-700 leading-relaxed text-lg">
      {content.map((block, idx) => {
        if (block.type === 'p') return <p key={idx} className="mb-4">{block.text}</p>;
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
      <div className="container mx-auto px-4 max-w-4xl mt-10 bg-white p-8 rounded shadow-sm border border-gray-200">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">{blog.title}</h1>
        <div className="flex items-center text-gray-500 text-sm mb-8 pb-4 border-b">
          <Calendar className="w-4 h-4 mr-2" />
          <span>Published on My Quick Trippers</span>
        </div>
        <div className="relative w-full h-[400px] mb-8 rounded overflow-hidden bg-gray-200">
           <Image src="/images/packages/kashmir.webp" alt={blog.title} fill sizes="(max-width: 768px) 100vw, 800px" className="object-cover" priority />
        </div>
        <RenderContent content={blog.content} />
        <div className="mt-12 pt-8 border-t border-gray-200 text-center">
           <h3 className="text-xl font-bold text-legacy-nav-blue mb-4">Ready to explore this destination?</h3>
           <a href={`tel:${siteConfig.phoneRaw}`} className="inline-flex items-center bg-legacy-orange hover:bg-orange-600 text-white font-bold px-8 py-3 rounded transition-colors">
             <Phone className="w-5 h-5 mr-2" /> Call Now: {siteConfig.phone}
           </a>
        </div>
      </div>
    </div>
  );
}
