import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { siteConfig } from "@/data/siteConfig";
import { getPublicPackages } from "@/utils/packageCatalog";
import PackageCard from "@/components/ui/PackageCard";
import EnquiryForm from "@/components/forms/EnquiryForm";
import SectionHeader from "@/components/ui/SectionHeader";
import { IMAGE_SKELETON } from "@/utils/imagePlaceholder";

export const metadata: Metadata = {
  title: "Shimla Honeymoon Packages - Romantic Shimla Manali Tours | My Quick Trippers",
  description: "Book Shimla honeymoon packages with My Quick Trippers. Romantic Shimla Manali tours, couple packages, honeymoon destinations. Best prices, romantic experiences, memorable trips.",
  keywords: [
    "Shimla honeymoon packages",
    "Shimla Manali honeymoon",
    "Romantic Shimla tours",
    "Honeymoon packages India",
    "Shimla couple packages",
    "Manali honeymoon packages",
    "Hill station honeymoon",
    "Romantic hill station tours",
    "Best honeymoon packages",
    "Shimla honeymoon from Delhi",
    "Himachal honeymoon tours",
    "Couple tour packages",
    "Romantic getaways India",
    "Honeymoon destinations India",
    "Shimla romantic tours"
  ],
  openGraph: {
    title: "Shimla Honeymoon Packages - Romantic Shimla Manali Tours",
    description: "Book Shimla honeymoon packages with My Quick Trippers. Romantic Shimla Manali tours, couple packages, honeymoon destinations.",
    url: `${siteConfig.domain}/campaigns/shimla-honeymoon`,
    siteName: siteConfig.name,
    type: "website",
    images: [
      {
        url: `${siteConfig.domain}/images/packages/shimla-honeymoon.jpg`,
        width: 1200,
        height: 630,
        alt: "Shimla Honeymoon Packages - Romantic Mountain Getaway",
      },
    ],
  },
};

const shimlaHoneymoonPackages = () => {
  const allPackages = getPublicPackages();
  return allPackages.filter(pkg => 
    pkg.title.toLowerCase().includes('shimla') ||
    pkg.title.toLowerCase().includes('manali') ||
    pkg.title.toLowerCase().includes('honeymoon') ||
    pkg.title.toLowerCase().includes('couple') ||
    pkg.category === 'Honeymoon' ||
    pkg.category === 'North India'
  ).slice(0, 12);
};

const romanticExperiences = [
  { 
    name: "Mall Road Strolls", 
    description: "Hand-in-hand walks on Shimla's famous Mall Road at sunset", 
    image: "/images/packages/mall-road.jpg",
    romanceLevel: "Classic Romance"
  },
  { 
    name: "Kufri Adventures", 
    description: "Snow activities and scenic views with your loved one", 
    image: "/images/packages/kufri.jpg",
    romanceLevel: "Adventure Romance"
  },
  { 
    name: "Manali Romance", 
    description: "Solang Valley picnics and Old Manali cafe hopping", 
    image: "/images/packages/manali-romance.jpg",
    romanceLevel: "Nature Romance"
  },
  { 
    name: "Rohtang Pass", 
    description: "Snow-capped peaks and romantic mountain drives", 
    image: "/images/packages/rohtang-pass.jpg",
    romanceLevel: "Adventure Romance"
  },
  { 
    name: "Jacobs Park", 
    description: "Peaceful moments in Shimla's beautiful gardens", 
    image: "/images/packages/jacobs-park.jpg",
    romanceLevel: "Quiet Romance"
  },
  { 
    name: "Candlelight Dinners", 
    description: "Romantic dining experiences with mountain views", 
    image: "/images/packages/candlelight-dinner.jpg",
    romanceLevel: "Luxury Romance"
  },
];

const honeymoonHighlights = [
  { icon: "❤️", title: "Romantic Settings", description: "Intimate accommodations with stunning mountain views" },
  { icon: "🌅", title: "Sunset Moments", description: "Breathtaking sunset views from your room or viewpoints" },
  { icon: "🍽️", title: "Candlelight Dinners", description: "Romantic dining experiences with local cuisine" },
  { icon: "🎁", title: "Honeymoon Specials", description: "Room decorations, flowers, and couple activities" },
  { icon: "🚗", title: "Private Transfers", description: "Comfortable private transportation for couple privacy" },
  { icon: "📸", title: "Photo Opportunities", description: "Picture-perfect locations for memorable honeymoon photos" },
];

const honeymoonTips = [
  "Best time: March-June for pleasant weather, December-February for snow romance",
  "Book honeymoon suites or cottages with mountain views for romantic ambiance",
  "Plan surprise romantic dinners or picnics at scenic locations",
  "Pack comfortable walking shoes for exploring but also dress up for romantic dinners",
  "Consider extending your trip to include both Shimla and Manali for variety",
  "Book spa treatments or couple massages for relaxation",
  "Plan your visit during weekdays to avoid crowds and enjoy more privacy",
  "Carry warm clothing even in summer as mountain evenings can be cool",
];

const honeymoonFaqs = [
  {
    question: "What is the best time for Shimla honeymoon?",
    answer: "The best time depends on your preference: March-June for pleasant weather (15-25°C) perfect for sightseeing, September-November for clear skies and romantic sunsets, or December-February for snow activities and cozy winter romance. Avoid monsoon (July-August) due to landslides."
  },
  {
    question: "How many days are ideal for Shimla Manali honeymoon?",
    answer: "A perfect Shimla-Manali honeymoon requires 5-7 days: 2-3 days in Shimla (Mall Road, Kufri, Jakhu Temple) and 3-4 days in Manali (Solang Valley, Rohtang Pass, Old Manali). Add 1-2 days if you want to include nearby destinations like Kullu or Kasol."
  },
  {
    question: "What are the most romantic places in Shimla and Manali?",
    answer: "Most romantic spots include Mall Road (Shimla) for sunset walks, Kufri for snow activities, Jakhu Temple for panoramic views, Solang Valley (Manali) for picnics, Old Manali for cafe hopping, Rohtang Pass for snow romance, and Hidimba Temple for spiritual moments. Don't miss candlelight dinners at mountain-view restaurants."
  },
  {
    question: "What should we pack for Shimla honeymoon?",
    answer: "Pack romantic outfits for dinners, comfortable walking shoes, warm clothing (even in summer), sunscreen, camera for memorable photos, personal medications, and any special items for romantic surprises. Layering is key as temperatures vary significantly between day and night."
  },
  {
    question: "Are Shimla honeymoon packages suitable for all budgets?",
    answer: "Yes, honeymoon packages range from budget-friendly to luxury options. Budget packages include comfortable hotels and basic sightseeing, mid-range offer better hotels and more experiences, while luxury packages feature 5-star resorts, private transfers, romantic dinners, and exclusive experiences. We customize based on your budget."
  },
  {
    question: "What are the accommodation options for honeymooners?",
    answer: "Options range from cozy honeymoon suites in hotels to private cottages, luxury resorts with mountain views, and heritage properties. We recommend booking rooms with balconies, mountain views, and honeymoon special arrangements like decorations, flowers, and romantic setups."
  },
  {
    question: "Can we customize our Shimla honeymoon itinerary?",
    answer: "Absolutely! We specialize in creating personalized honeymoon experiences. Whether you want adventure activities, quiet romantic moments, cultural experiences, or specific dining preferences, we'll customize your itinerary to match your dream honeymoon vision."
  },
  {
    question: "What romantic activities can we do in Shimla and Manali?",
    answer: "Romantic activities include sunset walks on Mall Road, candlelight dinners at mountain-view restaurants, picnics in Solang Valley, spa treatments for couples, exploring Old Manali's cafes, snow activities together, visiting scenic viewpoints like Kufri and Rohtang Pass, and enjoying peaceful moments in nature."
  },
];

export default function ShimlaHoneymoonPage() {
  const packages = shimlaHoneymoonPackages();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    "name": siteConfig.name,
    "description": "Best Shimla Honeymoon Packages - Romantic Shimla Manali tours, couple packages, honeymoon destinations",
    "url": `${siteConfig.domain}/campaigns/shimla-honeymoon`,
    "telephone": siteConfig.phone,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": siteConfig.address.street,
      "addressLocality": siteConfig.address.city,
      "addressRegion": siteConfig.address.state,
      "addressCountry": siteConfig.address.country
    },
    "priceRange": "$$",
    "areaServed": ["Shimla", "Manali", "Kullu", "Kufri", "Himachal Pradesh"],
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Shimla Honeymoon Packages",
      "itemListElement": packages.map((pkg, index) => ({
        "@type": "Offer",
        "itemOffered": {
          "@type": "TouristTrip",
          "name": pkg.title,
          "description": pkg.description || `Experience ${pkg.title} with My Quick Trippers`,
          "touristType": ["Couple", "Honeymoon", "Romantic", "Luxury"]
        },
        "position": index + 1
      }))
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      
      {/* Hero Section */}
      <section className="relative h-[400px] md:h-[500px] bg-gradient-to-r from-pink-900 to-pink-700 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/packages/shimla-honeymoon.jpg"
            alt="Shimla Honeymoon Packages - Romantic Mountain Getaway"
            fill
            className="object-cover opacity-40"
            priority
          />
        </div>
        <div className="relative z-10 container mx-auto px-4 h-full flex items-center">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
              Shimla Honeymoon Packages
            </h1>
            <p className="text-xl md:text-2xl text-pink-100 mb-6">
              Romantic Beginnings in the Himalayas
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="#packages" className="bg-white hover:bg-gray-100 text-pink-900 px-6 py-3 rounded-lg font-semibold transition-colors">
                View Packages
              </Link>
              <Link href="#enquiry" className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
                Plan Your Honeymoon
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Honeymoon Highlights */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <SectionHeader 
            title="Why Choose Shimla for Honeymoon?" 
            subtitle="Experience romance in the lap of Himalayas with intimate moments and breathtaking views"
          />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
            {honeymoonHighlights.map((highlight, index) => (
              <div key={index} className="bg-pink-50 p-6 rounded-xl hover:shadow-lg transition-shadow">
                <div className="text-4xl mb-4">{highlight.icon}</div>
                <h3 className="text-xl font-bold text-pink-900 mb-2">{highlight.title}</h3>
                <p className="text-gray-600">{highlight.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Romantic Experiences */}
      <section className="py-16 bg-gradient-to-b from-pink-50 to-white">
        <div className="container mx-auto px-4">
          <SectionHeader 
            title="Romantic Experiences" 
            subtitle="Unforgettable moments for your perfect honeymoon"
          />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            {romanticExperiences.map((experience, index) => (
              <div key={index} className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                <div className="relative h-48">
                  <Image
                    src={experience.image}
                    alt={`${experience.name} - ${experience.description}`}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-2 right-2 bg-pink-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    {experience.romanceLevel}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-xl font-bold text-pink-900 mb-2">{experience.name}</h3>
                  <p className="text-gray-600 text-sm">{experience.description}</p>
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
            title="Shimla Honeymoon Packages" 
            subtitle="Choose from our romantic honeymoon packages - from cozy getaways to luxury experiences"
          />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            {packages.map((pkg) => (
              <PackageCard key={pkg.slug} pkg={pkg} />
            ))}
          </div>
          {packages.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">No honeymoon packages currently available. Check back soon!</p>
              <Link href="/packages" className="inline-block mt-4 text-pink-600 hover:text-pink-700 font-semibold">
                View All Himachal Packages →
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Travel Tips */}
      <section className="py-16 bg-gradient-to-b from-pink-50 to-white">
        <div className="container mx-auto px-4">
          <SectionHeader 
            title="Essential Honeymoon Tips" 
            subtitle="Important guidelines for a perfect romantic getaway"
          />
          <div className="max-w-4xl mx-auto mt-12">
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <ul className="space-y-4">
                {honeymoonTips.map((tip, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="text-pink-600 text-xl">❤️</span>
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
            subtitle="Everything you need to know about Shimla honeymoon tours"
          />
          <div className="max-w-3xl mx-auto mt-12 space-y-6">
            {honeymoonFaqs.map((faq, index) => (
              <details key={index} className="bg-pink-50 rounded-lg shadow-sm border border-pink-100">
                <summary className="px-6 py-4 cursor-pointer font-semibold text-pink-900 hover:bg-pink-100">
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
      <section id="enquiry" className="py-16 bg-pink-900">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-4">Plan Your Dream Honeymoon</h2>
            <p className="text-pink-100">
              Let our experts help you create the perfect romantic getaway. Customized honeymoon packages with special arrangements for couples.
            </p>
          </div>
          <div className="max-w-xl mx-auto">
            <EnquiryForm destination="Shimla Honeymoon" />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 bg-pink-500">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Begin Your Love Story in the Mountains
          </h2>
          <p className="text-pink-100 mb-6 max-w-2xl mx-auto">
            Book your Shimla honeymoon package today and create magical memories in the Himalayas. Perfect settings for your perfect beginning.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="tel:+918171158569" className="bg-white hover:bg-gray-100 text-pink-600 px-6 py-3 rounded-lg font-semibold transition-colors">
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
