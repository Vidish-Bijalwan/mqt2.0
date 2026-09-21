import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { siteConfig } from "@/data/siteConfig";
import { getPublicPackages, isInternationalPackage } from "@/utils/packageCatalog";
import PackageCard from "@/components/ui/PackageCard";
import EnquiryForm from "@/components/forms/EnquiryForm";
import SectionHeader from "@/components/ui/SectionHeader";
import { IMAGE_SKELETON } from "@/utils/imagePlaceholder";

export const metadata: Metadata = {
  title: "Dubai Tour Packages - Best Dubai Travel Deals | My Quick Trippers",
  description: "Book premium Dubai tour packages with My Quick Trippers. Best Dubai travel deals, Burj Khalifa, desert safari, shopping tours. Visa assistance, best prices, 24/7 support.",
  keywords: [
    "Dubai tour packages",
    "Dubai travel packages",
    "Dubai holiday packages",
    "Dubai tourism packages",
    "Best Dubai tour packages",
    "Dubai trip packages",
    "Dubai vacation packages",
    "Dubai sightseeing tours",
    "Dubai desert safari packages",
    "Dubai shopping tours",
    "Dubai honeymoon packages",
    "Dubai family tour packages",
    "Dubai visa packages",
    "Dubai tour from India",
    "Affordable Dubai packages",
    "Dubai luxury tours"
  ],
  openGraph: {
    title: "Dubai Tour Packages - Premium Dubai Travel Deals",
    description: "Book premium Dubai tour packages with My Quick Trippers. Best Dubai travel deals, Burj Khalifa, desert safari, shopping tours.",
    url: `${siteConfig.domain}/campaigns/dubai-tour-packages`,
    siteName: siteConfig.name,
    type: "website",
    images: [
      {
        url: `${siteConfig.domain}/images/packages/dubai.jpg`,
        width: 1200,
        height: 630,
        alt: "Dubai Tour Packages - Burj Khalifa and Desert Safari",
      },
    ],
  },
};

const dubaiPackages = () => {
  const allPackages = getPublicPackages();
  return allPackages.filter(pkg => 
    pkg.title.toLowerCase().includes('dubai') ||
    pkg.title.toLowerCase().includes('uae') ||
    pkg.title.toLowerCase().includes('abu dhabi') ||
    isInternationalPackage(pkg)
  ).slice(0, 12);
};

const dubaiAttractions = [
  { 
    name: "Burj Khalifa", 
    description: "World's tallest building - observation deck and luxury experiences", 
    image: "/images/packages/burj-khalifa.jpg",
    highlights: ["124th floor observation", "At the Top experience", "Dubai Fountain views"]
  },
  { 
    name: "Desert Safari", 
    description: "Adventure in Arabian desert - dune bashing, camel rides, BBQ dinner", 
    image: "/images/packages/desert-safari.jpg",
    highlights: ["Dune bashing", "Camel riding", "Traditional BBQ dinner"]
  },
  { 
    name: "Palm Jumeirah", 
    description: "Artificial island - luxury resorts, beaches, and Atlantis", 
    image: "/images/packages/palm-jumeirah.jpg",
    highlights: ["Atlantis resort", "Palm monorail", "Beach activities"]
  },
  { 
    name: "Dubai Mall", 
    description: "World's largest shopping mall - luxury brands, aquarium, entertainment", 
    image: "/images/packages/dubai-mall.jpg",
    highlights: ["1200+ stores", "Underwater zoo", "Ice rink"]
  },
  { 
    name: "Dubai Marina", 
    description: "Waterfront district - luxury yachts, dining, skyline views", 
    image: "/images/packages/dubai-marina.jpg",
    highlights: ["Yacht cruises", "Fine dining", "Skyline views"]
  },
  { 
    name: "Old Dubai", 
    description: "Historic district - souks, museums, traditional architecture", 
    image: "/images/packages/old-dubai.jpg",
    highlights: ["Gold Souk", "Spice Souk", "Dubai Museum"]
  },
];

const dubaiExperiences = [
  { icon: "🏗️", title: "Modern Architecture", description: "Futuristic skyscrapers and engineering marvels" },
  { icon: "🏜️", title: "Desert Adventures", description: "Thrilling dune bashing and traditional Bedouin experiences" },
  { icon: "🛍️", title: "Luxury Shopping", description: "World-class malls and traditional souks" },
  { icon: "🎡", title: "Entertainment Hub", description: "Theme parks, water parks, and nightlife" },
  { icon: "🍽️", title: "Culinary Excellence", description: "International cuisine and fine dining experiences" },
  { icon: "🏖️", title: "Beach Luxury", description: "Pristine beaches and water sports activities" },
];

const dubaiTips = [
  "Best time: November to March for pleasant weather (20-30°C)",
  "Dress modestly in public areas, especially in religious sites",
  "Book Burj Khalifa tickets in advance to avoid queues",
  "Carry sunscreen and stay hydrated during outdoor activities",
  "Respect local customs during Ramadan (eating/drinking in public)",
  "Use metro for cost-effective transportation around the city",
  "Bargaining is expected in traditional souks but not in malls",
  "Friday is the holy day - many businesses close for Friday prayers",
];

const dubaiFaqs = [
  {
    question: "Do Indian citizens need a visa for Dubai?",
    answer: "Yes, Indian citizens require a visa to visit Dubai. We provide visa assistance services with our Dubai tour packages. The visa process typically takes 3-4 working days and requires passport copies, photographs, and confirmed hotel bookings."
  },
  {
    question: "What is the best time to visit Dubai?",
    answer: "The best time to visit Dubai is between November and March when the weather is pleasant (20-30°C). Summer months (June-August) are extremely hot (40-50°C) but offer great deals on hotels and activities. Consider visiting during Dubai Shopping Festival (January-February) for amazing deals."
  },
  {
    question: "How many days are ideal for a Dubai trip?",
    answer: "A typical Dubai trip requires 4-5 days to cover major attractions. For a comprehensive experience including desert safari, Abu Dhabi day trip, and luxury experiences, plan for 6-7 days. Short 3-day trips are possible for focused city tours."
  },
  {
    question: "What is included in Dubai tour packages?",
    answer: "Our Dubai packages include flight tickets, visa assistance, airport transfers, accommodation in quality hotels, selected sightseeing tours (Burj Khalifa, desert safari, city tour), daily breakfast, and the services of local guides. Premium packages include additional experiences and luxury accommodations."
  },
  {
    question: "Is Dubai family-friendly?",
    answer: "Absolutely! Dubai is one of the most family-friendly destinations with numerous attractions like Dubai Aquarium, KidZania, Miracle Garden, water parks, and safe beaches. Many hotels offer family rooms, kids' clubs, and child-friendly amenities."
  },
  {
    question: "What are the must-visit places in Dubai?",
    answer: "Must-visit places include Burj Khalifa (world's tallest building), Dubai Mall, Dubai Fountain, Palm Jumeirah, Dubai Marina, Desert Safari, Old Dubai (souks), and Dubai Frame. Don't miss the Dubai Fountain show and consider a day trip to Abu Dhabi for Sheikh Zayed Mosque."
  },
  {
    question: "What is the currency in Dubai and how should I manage money?",
    answer: "The currency is UAE Dirham (AED). Indian rupees are not accepted, so you'll need to carry Dirhams or use international credit/debit cards. ATMs are widely available. It's advisable to carry some cash for small purchases and tips."
  },
  {
    question: "What are the shopping options in Dubai?",
    answer: "Dubai offers world-class shopping from luxury malls (Dubai Mall, Mall of the Emirates) to traditional souks (Gold Souk, Spice Souk). Visit during Dubai Shopping Festival (January-February) for incredible discounts. Duty-free shopping is available at Dubai International Airport."
  },
];

export default function DubaiTourPackagesPage() {
  const packages = dubaiPackages();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    "name": siteConfig.name,
    "description": "Best Dubai Tour Packages - Premium Dubai travel deals with Burj Khalifa, desert safari, shopping tours",
    "url": `${siteConfig.domain}/campaigns/dubai-tour-packages`,
    "telephone": siteConfig.phone,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": siteConfig.address.street,
      "addressLocality": siteConfig.address.city,
      "addressRegion": siteConfig.address.state,
      "addressCountry": siteConfig.address.country
    },
    "priceRange": "$$$",
    "areaServed": ["Dubai", "UAE", "Abu Dhabi", "Sharjah"],
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Dubai Tour Packages",
      "itemListElement": packages.map((pkg, index) => ({
        "@type": "Offer",
        "itemOffered": {
          "@type": "TouristTrip",
          "name": pkg.title,
          "description": pkg.description || `Experience ${pkg.title} with My Quick Trippers`,
          "touristType": ["Family", "Couple", "Adventure", "Luxury"]
        },
        "position": index + 1
      }))
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      
      {/* Hero Section */}
      <section className="relative h-[400px] md:h-[500px] bg-gradient-to-r from-blue-900 to-blue-700 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/packages/dubai.jpg"
            alt="Dubai Tour Packages - Burj Khalifa and Modern Skyline"
            fill
            className="object-cover opacity-40"
            priority
          />
        </div>
        <div className="relative z-10 container mx-auto px-4 h-full flex items-center">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
              Dubai Tour Packages
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-6">
              Experience Luxury & Adventure in the City of Gold
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="#packages" className="bg-white hover:bg-gray-100 text-blue-900 px-6 py-3 rounded-lg font-semibold transition-colors">
                View Packages
              </Link>
              <Link href="#enquiry" className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
                Get Free Quote
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Dubai Experiences */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <SectionHeader 
            title="Why Choose Dubai?" 
            subtitle="Discover the perfect blend of modern luxury, Arabian culture, and thrilling adventures"
          />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
            {dubaiExperiences.map((exp, index) => (
              <div key={index} className="bg-blue-50 p-6 rounded-xl hover:shadow-lg transition-shadow">
                <div className="text-4xl mb-4">{exp.icon}</div>
                <h3 className="text-xl font-bold text-blue-900 mb-2">{exp.title}</h3>
                <p className="text-gray-600">{exp.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Top Attractions */}
      <section className="py-16 bg-gradient-to-b from-blue-50 to-white">
        <div className="container mx-auto px-4">
          <SectionHeader 
            title="Top Dubai Attractions" 
            subtitle="Must-visit landmarks and experiences in the emirate"
          />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            {dubaiAttractions.map((attraction, index) => (
              <div key={index} className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                <div className="relative h-48">
                  <Image
                    src={attraction.image}
                    alt={`${attraction.name} - ${attraction.description}`}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-xl font-bold text-blue-900 mb-2">{attraction.name}</h3>
                  <p className="text-gray-600 text-sm mb-3">{attraction.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {attraction.highlights.map((highlight, i) => (
                      <span key={i} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                        {highlight}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tour Packages */}
      <section id="packages" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <SectionHeader 
            title="Dubai Tour Packages" 
            subtitle="Choose from our carefully curated Dubai packages - luxury, family, adventure, and budget options"
          />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            {packages.map((pkg) => (
              <PackageCard key={pkg.slug} pkg={pkg} />
            ))}
          </div>
          {packages.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">No Dubai packages currently available. Check back soon!</p>
              <Link href="/packages" className="inline-block mt-4 text-blue-600 hover:text-blue-700 font-semibold">
                View All International Packages →
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Travel Tips */}
      <section className="py-16 bg-gradient-to-b from-blue-50 to-white">
        <div className="container mx-auto px-4">
          <SectionHeader 
            title="Essential Dubai Travel Tips" 
            subtitle="Important guidelines for a smooth and enjoyable Dubai experience"
          />
          <div className="max-w-4xl mx-auto mt-12">
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <ul className="space-y-4">
                {dubaiTips.map((tip, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="text-blue-600 text-xl">✓</span>
                    <span className="text-gray-700">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <SectionHeader 
            title="Frequently Asked Questions" 
            subtitle="Everything you need to know about Dubai tours"
          />
          <div className="max-w-3xl mx-auto mt-12 space-y-6">
            {dubaiFaqs.map((faq, index) => (
              <details key={index} className="bg-blue-50 rounded-lg shadow-sm border border-blue-100">
                <summary className="px-6 py-4 cursor-pointer font-semibold text-blue-900 hover:bg-blue-100">
                  {faq.question}
                </summary>
                <div className="px-6 pb-4 text-gray-600">
                  {faq.answer}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Enquiry Form */}
      <section id="enquiry" className="py-16 bg-blue-900">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-4">Plan Your Dubai Dream Vacation</h2>
            <p className="text-blue-100">
              Get a customized quote for your Dubai tour package. Our experts will help you plan the perfect Dubai experience with visa assistance and best deals.
            </p>
          </div>
          <div className="max-w-xl mx-auto">
            <EnquiryForm destination="Dubai" />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 bg-yellow-500">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Ready to Experience Dubai Luxury?
          </h2>
          <p className="text-yellow-100 mb-6 max-w-2xl mx-auto">
            Book your Dubai tour package today and experience the magic of the desert city. Best deals guaranteed with visa assistance!
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="tel:+918171158569" className="bg-white hover:bg-gray-100 text-yellow-600 px-6 py-3 rounded-lg font-semibold transition-colors">
              Call: +91-8171158569
            </Link>
            <Link href="https://wa.me/918171158569" className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
              WhatsApp Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
