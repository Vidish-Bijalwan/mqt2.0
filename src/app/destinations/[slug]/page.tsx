import { allPackages } from "@/data/allPackages";
import { destinations } from "@/data/contentData";
import destinationsDataRaw from "@/data/destinationsData.json";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import PackageListCard from "@/components/ui/PackageListCard";
import EmptyState from "@/components/ui/EmptyState";
import FilterSidebar from "@/components/ui/FilterSidebar";
import DestinationDescription from "@/components/ui/DestinationDescription";

const destinationsData = destinationsDataRaw as Record<string, any>;

const destinationKeywords: Record<string, string[]> = {
  "uttarakhand": ["haridwar", "rishikesh", "nainital", "mussoorie", "corbett", "auli", "kedarnath", "badrinath", "gangotri", "yamunotri", "dehradun", "joshimath", "almora", "ranikhet"],
  "himachal-pradesh": ["shimla", "manali", "dharamshala", "dalhousie", "kullu", "spiti", "kinnaur", "rohtang", "kasauli"],
  "uttar-pradesh": ["agra", "varanasi", "mathura", "vrindavan", "ayodhya", "prayagraj", "lucknow", "sarnath"],
  "kashmir": ["srinagar", "gulmarg", "pahalgam", 'sonmarg', 'kashmir', "amarnath", "katra", "vaishno devi", "jammu"],
  "goa": ["goa", "panjim", "calangute", "baga"],
  "gujarat": ["ahmedabad", "somnath", "dwarka", "gir", "kutch", "statue of unity", "rajkot"],
  "rajasthan": ["jaipur", "udaipur", "jodhpur", "jaisalmer", "pushkar", "bikaner", "mount abu", "ranthambore"],
  "maharashtra": ["mumbai", "pune", "lonavala", "mahabaleshwar", "shirdi", "aurangabad", "ajanta", "ellora"],
  "kerala": ["munnar", "thekkady", "alleppey", "kovalam", "kumarakom", "wayanad", "cochin", "trivandrum"],
  "tamil-nadu": ["chennai", "ooty", "kodaikanal", "madurai", "rameshwaram", "kanyakumari", "mahabalipuram"],
  "karnataka": ["bangalore", "mysore", "coorg", "hampi", "bandipur", "gokarna"],
  "madhya-pradesh": ["khajuraho", "kanha", "bandhavgarh", "gwalior", "ujjain", "bhopal", "indore"],
  "darjeeling": ["darjeeling", "kalimpong", "kurseong"],
  "sikkim": ["gangtok", "pelling", "lachung", "nathula"],
  "assam": ["guwahati", "kaziranga", "majuli", "shillong", "cherrapunji", "meghalaya"],
};

import { siteConfig } from "@/data/siteConfig";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug.toLowerCase();
  const dest = destinations.find(d => d.slug.toLowerCase() === slug);
  const destData = destinationsData[slug];
  
  const title = dest ? `${dest.name} Tour Packages | My Quick Trippers` : `${slug.replace(/-/g, ' ').toUpperCase()} | My Quick Trippers`;
  const description = destData?.content?.filter((c: any) => c.type === 'p').map((c: any) => c.text).join(' ').substring(0, 160) || `Explore the best ${title} with My Quick Trippers.`;

  return { 
    title,
    description,
    alternates: {
      canonical: `${siteConfig.domain}/destinations/${slug}`,
    },
    openGraph: {
      title,
      description,
      url: `${siteConfig.domain}/destinations/${slug}`,
      type: 'website',
      images: [{ url: `${siteConfig.domain}/images/hero/hero-bg-1.jpg`, width: 1200, height: 630, alt: title }],
    },
  };
}

export default async function DestinationPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug.toLowerCase();
  
  const dest = destinations.find(d => d.slug.toLowerCase() === slug);
  const destData = destinationsData[slug];
  const titleName = dest ? dest.name : (destData?.title || slug.replace(/-/g, ' '));
  
  // Find matching packages
  const matchedPackages = allPackages.filter(p => {
    const term = slug.toLowerCase();
    
    // Direct matches
    if (p.slug.toLowerCase().includes(term)) return true;
    if (p.category.toLowerCase().includes(term)) return true;
    if (p.route && p.route.toLowerCase().includes(term)) return true;
    
    // Keyword matches (cities inside the state)
    const keywords = destinationKeywords[term] || [];
    for (const kw of keywords) {
      if (p.slug.toLowerCase().includes(kw)) return true;
      if (p.category.toLowerCase().includes(kw)) return true;
      if (p.route && p.route.toLowerCase().includes(kw)) return true;
    }
    
    // special mapping for generic paths
    if (term === 'india-tours' || term === 'india-tour-packages') return p.category.includes('India Tours') || p.category.includes('North India') || p.category.includes('South India');
    if (term === 'international-tours' || term === 'international') return p.category === 'International';
    if (term === 'pilgrimage-tours' || term === 'pilgrimage') return p.category === 'Pilgrimage';
    
    return false;
  });

  if (!dest && !destData && matchedPackages.length === 0) {
    notFound();
  }

  // Deduplicate packages based on slug
  const uniquePackages = Array.from(new Map(matchedPackages.map((p) => [p.slug, p])).values());

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TouristDestination",
    "name": titleName,
    "description": destData?.content?.filter((c: any) => c.type === 'p').map((c: any) => c.text).join(' ').substring(0, 200) || `Explore ${titleName}`,
    "url": `${siteConfig.domain}/destinations/${slug}`,
    "touristType": [
      "Leisure",
      "Adventure",
      "Family"
    ]
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="bg-gray-50 min-h-screen pb-16">
      
      {/* Breadcrumbs Top Bar */}
      <div className="bg-white border-b border-gray-200 text-gray-600 text-[13px] py-2 px-4 shadow-sm mb-6">
        <div className="container mx-auto w-full max-w-7xl px-2 md:px-4 flex items-center">
          <Link href="/" className="font-semibold hover:text-legacy-orange">Home</Link>
          <ChevronRight className="w-3 h-3 mx-1" />
          <Link href="/india-tours" className="font-semibold hover:text-legacy-orange">India</Link>
          <ChevronRight className="w-3 h-3 mx-1" />
          <span className="capitalize">{titleName} Tour Packages</span>
        </div>
      </div>

      <div className="container mx-auto px-4 w-full max-w-7xl px-2 md:px-4">
        
        {/* Render Destination Guide Content at the top */}
        <DestinationDescription title={titleName} content={destData?.content || []} />
        
        {/* Main 2-Column Layout */}
        <div className="flex flex-col lg:flex-row gap-6">
          
          {/* Left Sidebar (25% on lg screens) */}
          <div className="w-full lg:w-1/4 shrink-0">
             <FilterSidebar />
          </div>
          
          {/* Right Package List (75% on lg screens) */}
          <div className="w-full lg:w-3/4 flex-1">
            
            {uniquePackages.length > 0 ? (
              <div className="flex flex-col space-y-4">
                {uniquePackages.map((pkg, idx) => (
                  <PackageListCard key={`${pkg.slug}-${idx}`} pkg={pkg} />
                ))}
              </div>
            ) : (
              <EmptyState titleName={titleName} />
            )}
            
          </div>
          
        </div>
        
        </div>
      </div>
    </>
  );
}
