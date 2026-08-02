import { allPackages } from "@/data/allPackages";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, Clock, MapPin, Phone, MessageCircleQuestion, HelpCircle } from "lucide-react";
import EnquiryForm from "@/components/forms/EnquiryForm";
import ItineraryAccordion from "@/components/ui/ItineraryAccordion";
import PackageOverview from "@/components/ui/PackageOverview";
import TrustIndicators from "@/components/ui/TrustIndicators";
import RelatedPackages from "@/components/ui/RelatedPackages";
import BlockRenderer from "@/components/ui/BlockRenderer";
import { siteConfig } from "@/data/siteConfig";
import fs from 'fs';
import path from 'path';

// Load the newly generated rich package details payload (Legacy)
let packageDetails: Record<string, any> = {};
try {
  const dataPath = path.join(process.cwd(), 'src/data/packageDetails.json');
  packageDetails = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
} catch (e) {
  console.log("Error loading packageDetails.json", e);
}

// Load V2 Package Details (Agent 3 output)
let packageDetailsV2: Record<string, any> = {};
try {
  const dataPathV2 = path.join(process.cwd(), 'src/data/packageDetailsV2.json');
  packageDetailsV2 = JSON.parse(fs.readFileSync(dataPathV2, 'utf-8'));
} catch (e) {
  console.log("Error loading packageDetailsV2.json", e);
}

// Load V3 Package Details (clean, structured blocks regenerated from the
// scraped folder — junk chrome removed, lists/headings/images structured)
let packageDetailsV3: Record<string, any> = {};
try {
  const dataPathV3 = path.join(process.cwd(), 'src/data/packageDetailsV3.json');
  packageDetailsV3 = JSON.parse(fs.readFileSync(dataPathV3, 'utf-8'));
} catch (e) {
  console.log("Error loading packageDetailsV3.json", e);
}

function detailsV2For(slug: string) {
  return packageDetailsV2[slug] || packageDetailsV2[`${slug}.html`] || packageDetailsV2[`${slug}.htm`];
}

function detailsV3For(slug: string) {
  return packageDetailsV3[slug];
}

function getFallbackImage(slug: string, category: string) {
  return `/images/packages/${slug}.jpg`;
}

export function generateStaticParams() {
  return allPackages.map((pkg) => ({ slug: pkg.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const pkgV3 = detailsV3For(slug);
  const pkgV2 = detailsV2For(slug);
  const pkg = packageDetails[slug] || allPackages.find(p => p.slug === slug);
  
  const seoSource = pkgV3?.seo || pkgV2?.seo;
  if (seoSource) {
    // Return preserved SEO tags from scraping (V3 clean data preferred)
    return {
      title: seoSource.page_title || seoSource.title,
      description: seoSource.meta_description,
      alternates: {
        canonical: seoSource.canonical_url || `${siteConfig.domain}/packages/${slug}`,
      },
      openGraph: seoSource.og_tags ? {
        title: seoSource.og_tags['og:title'],
        description: seoSource.og_tags['og:description'],
        url: seoSource.og_tags['og:url'],
        type: 'article',
        images: [{ url: seoSource.og_tags['og:image'] }],
      } : undefined,
    };
  }

  const title = pkg ? `${pkg.title} | My Quick Trippers` : `${slug.replace(/-/g, ' ').toUpperCase()} | My Quick Trippers`;
  const description = pkg?.overview?.substring(0, 160) || `Book the best ${title} with My Quick Trippers.`;

  return { 
    title,
    description,
    alternates: {
      canonical: `${siteConfig.domain}/packages/${slug}`,
    },
    openGraph: {
      title,
      description,
      url: `${siteConfig.domain}/packages/${slug}`,
      type: 'article',
      images: [{ url: `${siteConfig.domain}${getFallbackImage(slug, pkg?.category || '')}`, width: 1200, height: 630, alt: title }],
    },
  };
}

export default async function PackageDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const pkg = allPackages.find((p) => p.slug === slug);
  
  if (!pkg) {
    notFound();
  }

  // Get rich details — V3 (clean) preferred, then V2, then legacy
  const detailsV3 = detailsV3For(pkg.slug);
  const detailsV2 = detailsV2For(pkg.slug);
  const details = packageDetails[pkg.slug] || { overview: '', highlights: [], itinerary: [], faqs: [] };
  const blocks = detailsV3?.blocks || detailsV2?.blocks || null;

  // Real gallery images: the package cover plus in-content images from the
  // cleaned blocks (deduped), so the photo grid shows actual photos instead
  // of gray placeholder boxes.
  const galleryImages = [
    pkg.image,
    ...(blocks || [])
      .filter((b: any) => b.type === 'image' && b.url)
      .map((b: any) => b.url),
  ].filter((url: string, idx: number, arr: string[]) => url && arr.indexOf(url) === idx).slice(0, 5);

  let jsonLd = detailsV2?.seo?.json_ld ? detailsV2.seo.json_ld : {
    "@context": "https://schema.org",
    "@graph": [
    {
      "@type": ["TouristTrip", "Product"],
      "name": pkg.title,
      "description": details.overview || pkg.description || `Enjoy a wonderful trip: ${pkg.title}`,
      "image": `${siteConfig.domain}${getFallbackImage(slug, pkg.category)}`,
      "touristType": [
        "Leisure",
        "Family"
      ],
      "offers": {
        "@type": "Offer",
        "priceCurrency": "INR",
        "price": pkg.price ? pkg.price.replace(/[^0-9]/g, '') || "15000" : "15000",
        "availability": "https://schema.org/InStock",
        "url": `${siteConfig.domain}/packages/${slug}`
      }
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": siteConfig.domain
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": pkg.category || "Packages",
          "item": `${siteConfig.domain}/packages?category=${encodeURIComponent(pkg.category || 'all')}`
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": pkg.title,
          "item": `${siteConfig.domain}/packages/${slug}`
        }
      ]
    }
  ]
  };

  if (!detailsV2?.seo?.json_ld) {
    if (details.faqs && details.faqs.length > 0) {
      jsonLd["@graph"].push({
        "@type": "FAQPage",
        "mainEntity": details.faqs.map((faq: any) => ({
          "@type": "Question",
          "name": faq.q,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": faq.a
          }
        }))
      });
    }
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="bg-gray-50 min-h-screen pb-16 font-sans">
      
      {/* Breadcrumb Area */}
      <div className="bg-legacy-nav-blue text-white text-xs py-2 px-4 shadow-sm relative z-10">
        <div className="container mx-auto w-[95%] max-w-[1600px] flex items-center gap-2">
          <Link href="/" className="hover:text-legacy-orange">Home</Link>
          {" » "}
          <Link href="/india-tours" className="hover:text-legacy-orange">{pkg.category}</Link>
          {" » "}
          <span className="text-gray-300 truncate">{pkg.title}</span>
        </div>
      </div>

      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 w-[95%] max-w-[1600px] py-4 md:py-6">
           <h1 className="text-2xl md:text-3xl font-bold text-gray-800">{pkg.title}</h1>
           {/* Duplicate breadcrumbs removed per UX audit */}
        </div>
      </div>

      <div className="container mx-auto px-4 w-[95%] max-w-[1600px] mt-6">
        
        {/* Photo Gallery Grid — real images from package cover + content */}
        {galleryImages.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-8 rounded-lg overflow-hidden shadow-sm">
            <div className="col-span-2 row-span-2 relative h-[260px] md:h-[450px] group">
              <Image src={galleryImages[0]} alt={pkg.title} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover transition-transform duration-700 group-hover:scale-105" priority />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
            </div>
            {galleryImages.slice(1).map((img, idx) => (
              <div key={idx} className={`relative h-[130px] md:h-[222px] group ${idx >= 3 ? 'hidden md:block' : ''}`}>
                <Image src={img} alt={`${pkg.title} — Photo ${idx + 1}`} fill sizes="(max-width: 768px) 50vw, 25vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
              </div>
            ))}
            {galleryImages.length > 1 && galleryImages.slice(1).length < 4 && (
              <div className="hidden md:flex relative h-[222px] group bg-gray-800">
                <Image src={galleryImages[0]} alt={pkg.title} fill sizes="25vw" className="object-cover opacity-60 transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center">
                  <span className="text-white font-bold text-sm bg-white/20 px-4 py-2 rounded-full backdrop-blur-sm">View Package</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Trust Indicators (Social Proof alternative) */}
        <TrustIndicators />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Left Content */}
          <div className="lg:col-span-2 space-y-8">
            
            {blocks ? (
              <div className="bg-white p-6 md:p-8 rounded-lg shadow-sm border border-gray-100">
                <BlockRenderer blocks={blocks} />
              </div>
            ) : (
              <>
                {/* Tour Overview (Legacy) */}
                {(details.overview || pkg.description) && (
                  <div className="bg-white p-6 md:p-8 rounded-lg shadow-sm border border-gray-100">
                    <div className="flex items-center mb-6 pb-4 border-b border-gray-100">
                      <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center mr-4">
                        <Image src="/logo.png" alt="MQT" width={24} height={24} className="opacity-50" />
                      </div>
                      <h2 className="text-2xl font-bold text-gray-800">Tour Overview</h2>
                    </div>
                    <PackageOverview content={details.overview || pkg.description} packageTitle={pkg.title} />
                  </div>
                )}

            {/* Highlights */}
            {details.highlights.length > 0 && (
              <div className="bg-white p-6 md:p-8 rounded-lg shadow-sm border border-gray-100">
                <div className="flex items-center mb-6 pb-4 border-b border-gray-100">
                  <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center mr-4">
                     <CheckCircle2 className="text-legacy-orange w-5 h-5" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800">Tour Highlights</h2>
                </div>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {details.highlights.map((highlight: string, idx: number) => (
                    <li key={idx} className="flex items-start text-[15px] text-gray-600">
                      <CheckCircle2 className="w-5 h-5 mr-3 text-green-500 shrink-0 mt-0.5" />
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Booking Form Inline (Moved Up for better conversion) */}
            <div id="enquiry-form" className="bg-legacy-nav-blue text-white rounded-lg shadow-lg overflow-hidden mt-6 mb-8">
               <div className="p-6 md:p-8 text-center border-b border-white/10">
                  <h2 className="text-xl md:text-2xl font-bold mb-2">Plan Your Perfect Holiday!</h2>
                  <p className="text-blue-100 text-sm">Fill out the form below and get an affordable itinerary within hours.</p>
               </div>
               <div className="p-6 bg-white text-gray-800">
                  <EnquiryForm pkgName={pkg.title} />
               </div>
            </div>

            {/* Itinerary */}
            {details.itinerary.length > 0 && (
              <div className="bg-white p-6 md:p-8 rounded-lg shadow-sm border border-gray-100">
                <div className="flex items-center mb-6 pb-4 border-b border-gray-100">
                  <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center mr-4">
                     <MapPin className="text-legacy-orange w-5 h-5" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800">Tour Itinerary</h2>
                </div>
                
                <ItineraryAccordion itinerary={details.itinerary} />
                
              </div>
            )}

            {/* Value Props */}
            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
               <div>
                  <div className="w-16 h-16 mx-auto bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-4 text-2xl">🛡️</div>
                  <h4 className="font-bold text-gray-800 mb-2">Hassle-Free Booking</h4>
                  <p className="text-sm text-gray-500">Enjoy low deposits, flexible cancellation options, and personalized support.</p>
               </div>
               <div>
                  <div className="w-16 h-16 mx-auto bg-green-50 text-green-500 rounded-full flex items-center justify-center mb-4 text-2xl">✨</div>
                  <h4 className="font-bold text-gray-800 mb-2">Lifelong Memories</h4>
                  <p className="text-sm text-gray-500">Curated trips offering the perfect balance of exploration and relaxation.</p>
               </div>
               <div>
                  <div className="w-16 h-16 mx-auto bg-orange-50 text-orange-500 rounded-full flex items-center justify-center mb-4 text-2xl">🤝</div>
                  <h4 className="font-bold text-gray-800 mb-2">Trusted Companion</h4>
                  <p className="text-sm text-gray-500">Join millions of travelers who have trusted us to help them discover the world.</p>
               </div>
            </div>

            {/* FAQs */}
            {details.faqs && details.faqs.length > 0 && (
              <div className="bg-white p-6 md:p-8 rounded-lg shadow-sm border border-gray-100">
                <div className="flex items-center mb-6 pb-4 border-b border-gray-100">
                  <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center mr-4">
                    <MessageCircleQuestion className="text-legacy-orange" size={20} />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800">Frequently Asked Questions</h2>
                </div>
                <div className="space-y-4">
                  {details.faqs.map((faq: any, i: number) => (
                    <div key={i} className="border border-gray-100 rounded-lg p-4 bg-gray-50/50">
                        <h3 className="font-bold text-gray-800 mb-2 flex items-start gap-2">
                          <HelpCircle size={18} className="text-legacy-orange shrink-0 mt-1" />
                          {faq.q}
                        </h3>
                        <p className="text-gray-600 pl-7 text-sm leading-relaxed">{faq.a}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            </>
            )}

          </div>

          {/* Sticky Right Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
               
               {/* Price Card */}
               <div className="bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden">
                  <div className="p-6">
                     <div className="flex justify-between items-start mb-2">
                        <div>
                           <p className="text-sm text-gray-500 font-medium uppercase tracking-wide">Starting from</p>
                           <div className="text-3xl font-bold text-gray-900 mt-1">
                              {pkg.price || "Contact Us"}
                           </div>
                           <p className="text-xs text-gray-400 mt-1">Starting Price Per Adult</p>
                        </div>
                     </div>

                     <div className="space-y-3 mt-6 pt-6 border-t border-gray-100">
                        {pkg.duration && (
                           <div className="flex justify-between text-sm">
                              <span className="text-gray-500 flex items-center"><Clock className="w-4 h-4 mr-2" /> Duration:</span>
                              <span className="font-semibold text-gray-800">{pkg.duration}</span>
                           </div>
                        )}
                        <div className="flex justify-between text-sm">
                           <span className="text-gray-500 flex items-center"><MapPin className="w-4 h-4 mr-2" /> Start/End:</span>
                           <span className="font-semibold text-gray-800 capitalize">{pkg.route || 'Delhi'}</span>
                        </div>
                     </div>

                     {/* What's Included */}
                     <div className="mt-6 pt-6 border-t border-gray-100">
                        <p className="text-xs font-bold text-gray-800 uppercase tracking-wide mb-3">What&apos;s Included</p>
                        <div className="space-y-2 text-sm text-gray-600">
                           <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" /> Accommodation (3-Star Hotels)</div>
                           <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" /> Daily Breakfast & Dinner</div>
                           <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" /> AC Transport + Train Tickets</div>
                           <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" /> Temple Darshan Arrangements</div>
                           <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" /> Experienced Tour Guide</div>
                        </div>
                     </div>

                     {/* Price Breakdown */}
                     <div className="mt-6 pt-6 border-t border-gray-100">
                        <details className="group">
                           <summary className="text-xs font-bold text-legacy-orange uppercase tracking-wide mb-2 cursor-pointer list-none flex justify-between items-center">
                              <span>View Price Details</span>
                              <span className="transition group-open:rotate-180">▼</span>
                           </summary>
                           <div className="space-y-2 text-sm text-gray-600 mt-3 pl-1">
                              <div className="flex justify-between"><span>Accommodation</span> <span>₹28,000</span></div>
                              <div className="flex justify-between"><span>Meals</span> <span>₹9,200</span></div>
                              <div className="flex justify-between"><span>Transport</span> <span>₹6,500</span></div>
                              <div className="flex justify-between"><span>Guide & Support</span> <span>₹1,305</span></div>
                              <div className="flex justify-between font-bold text-gray-900 border-t border-gray-100 pt-2 mt-2"><span>Total per adult</span> <span>{pkg.price || "Contact Us"}</span></div>
                           </div>
                        </details>
                     </div>

                     <div className="mt-8 space-y-3">
                        <a href="#enquiry-form" className="w-full block text-center bg-legacy-nav-blue text-white font-bold py-3 rounded-md hover:bg-blue-900 transition-colors shadow-md">
                           Get Instant Quote
                        </a>
                     </div>
                  </div>
               </div>

            </div>
          </div>

        </div>
        
        <RelatedPackages category={pkg.category || 'Trending'} currentSlug={pkg.slug} />
      </div>
    </div>
    </>
  );
}
