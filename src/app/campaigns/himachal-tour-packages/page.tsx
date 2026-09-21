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
  title: "Himachal Tour Packages - Best Shimla Manali Tours | My Quick Trippers",
  description: "Explore best Himachal Tour Packages with My Quick Trippers. Book Shimla Manali tours, Dharamshala trips, Kullu Manali honeymoon packages. Expert guidance, best prices, 24/7 support.",
  keywords: [
    "Himachal Tour Packages",
    "Shimla Manali tour packages",
    "Manali honeymoon packages",
    "Dharamshala tour packages",
    "Kullu Manali tours",
    "Himachal Pradesh tourism",
    "Hill station tours India",
    "Mountain tour packages",
    "Shimla holiday packages",
    "Manali adventure tours",
    "Spiti Valley tours",
    "Dalhousie tour packages",
    "Kasol tour packages",
    "Best Himachal tours",
    "Affordable Himachal packages"
  ],
  openGraph: {
    title: "Himachal Tour Packages - Best Shimla Manali Tours",
    description: "Explore best Himachal Tour Packages with My Quick Trippers. Book Shimla Manali tours, Dharamshala trips, Kullu Manali honeymoon packages.",
    url: `${siteConfig.domain}/campaigns/himachal-tour-packages`,
    siteName: siteConfig.name,
    type: "website",
    images: [
      {
        url: `${siteConfig.domain}/images/packages/himachal-pradesh.jpg`,
        width: 1200,
        height: 630,
        alt: "Himachal Tour Packages - Shimla Manali Tours",
      },
    ],
  },
};

const himachalPackages = () => {
  const allPackages = getPublicPackages();
  return allPackages.filter(pkg => 
    pkg.title.toLowerCase().includes('himachal') ||
    pkg.title.toLowerCase().includes('shimla') ||
    pkg.title.toLowerCase().includes('manali') ||
    pkg.title.toLowerCase().includes('kullu') ||
    pkg.title.toLowerCase().includes('dharamshala') ||
    pkg.title.toLowerCase().includes('dalhousie') ||
    pkg.title.toLowerCase().includes('spiti') ||
    pkg.title.toLowerCase().includes('kasol') ||
    pkg.category === 'North India'
  ).slice(0, 12);
};

const himachalDestinations = [
  { name: "Shimla", description: "Queen of Hills - colonial charm and scenic beauty", image: "/images/packages/shimla.jpg" },
  { name: "Manali", description: "Adventure hub - Rohtang Pass, Solang Valley", image: "/images/packages/manali.jpg" },
  { name: "Dharamshala", description: "Spiritual capital - Tibetan culture and monasteries", image: "/images/packages/dharamshala.jpg" },
  { name: "Kullu", description: "Valley of Gods - apple orchards and river rafting", image: "/images/packages/kullu.jpg" },
  { name: "Dalhousie", description: "Colonial hill station - pine forests and churches", image: "/images/packages/dalhousie.jpg" },
  { name: "Spiti Valley", description: "Cold desert - monasteries and high altitude lakes", image: "/images/packages/spiti.jpg" },
];

const himachalExperiences = [
  { icon: "🏔️", title: "Mountain Adventures", description: "Trekking, paragliding, river rafting in Kullu Manali" },
  { icon: "🏛️", title: "Colonial Heritage", description: "British architecture in Shimla and Dalhousie" },
  { icon: "🙏", title: "Spiritual Journeys", description: "Tibetan monasteries in Dharamshala and McLeodganj" },
  { icon: "🌲", title: "Nature Escapes", description: "Pine forests, apple orchards, and scenic valleys" },
  { icon: "❄️", title: "Winter Wonderlands", description: "Snow activities in Rohtang Pass and Solang Valley" },
  { icon: "🚗", title: "Road Trips", description: "Scenic drives through Himalayan mountain roads" },
];

const himachalFaqs = [
  {
    question: "What is the best time to visit Himachal Pradesh?",
    answer: "The best time depends on your preferences: Summer (April-June) for pleasant weather and sightseeing, Monsoon (July-September) for lush greenery, Winter (December-March) for snow activities in Manali and Shimla."
  },
  {
    question: "How many days are ideal for a Himachal tour?",
    answer: "A typical Himachal tour ranges from 5-7 days for Shimla-Manali, 7-10 days for covering multiple destinations like Shimla-Manali-Dharamshala, and 12-15 days for comprehensive Spiti Valley tours."
  },
  {
    question: "What are the must-visit places in Himachal Pradesh?",
    answer: "Must-visit places include Shimla (Mall Road, Kufri), Manali (Rohtang Pass, Solang Valley), Dharamshala (McLeodganj, Dalai Lama Temple), Kullu Valley, Dalhousie, Khajjiar, and Spiti Valley for adventure seekers."
  },
  {
    question: "Are Himachal tour packages suitable for families?",
    answer: "Yes, Himachal tour packages are perfect for families with easy sightseeing, comfortable accommodations, kid-friendly activities, and safe transportation. We offer customized family packages with appropriate pacing."
  },
  {
    question: "What is included in Himachal tour packages?",
    answer: "Our Himachal tour packages include accommodation in hotels/resorts, transportation (private vehicle or coach), sightseeing as per itinerary, meals (breakfast and dinner as specified), and the services of experienced local guides."
  },
  {
    question: "How can I reach Himachal Pradesh?",
    answer: "Himachal is well-connected by air (Chandigarh, Kullu-Manali airports), rail (Kalka-Shimla toy train, Pathankot for Dalhousie), and road (excellent road network from Delhi, Chandigarh, and other major cities)."
  },
];

export default function HimachalTourPackagesPage() {
  const packages = himachalPackages();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    "name": siteConfig.name,
    "description": "Best Himachal Tour Packages - Shimla Manali tours, Dharamshala trips, Kullu Manali honeymoon packages",
    "url": `${siteConfig.domain}/campaigns/himachal-tour-packages`,
    "telephone": siteConfig.phone,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": siteConfig.address.street,
      "addressLocality": siteConfig.address.city,
      "addressRegion": siteConfig.address.state,
      "addressCountry": siteConfig.address.country
    },
    "priceRange": "$$",
    "areaServed": ["Himachal Pradesh", "Shimla", "Manali", "Dharamshala", "Kullu", "Dalhousie", "Spiti Valley"],
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Himachal Tour Packages",
      "itemListElement": packages.map((pkg, index) => ({
        "@type": "Offer",
        "itemOffered": {
          "@type": "TouristTrip",
          "name": pkg.title,
          "description": pkg.description || `Experience ${pkg.title} with My Quick Trippers`,
          "touristType": ["Adventure", "Family", "Honeymoon", "Spiritual"]
        },
        "position": index + 1
      }))
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      
      {/* Hero Section */}
      <section className="relative h-[400px] md:h-[500px] bg-gradient-to-r from-green-900 to-green-700 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/packages/himachal-pradesh.jpg"
            alt="Himachal Tour Packages - Stunning Himalayan Mountains"
            fill
            className="object-cover opacity-40"
            priority
          />
        </div>
        <div className="relative z-10 container mx-auto px-4 h-full flex items-center">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
              Himachal Tour Packages
            </h1>
            <p className="text-xl md:text-2xl text-green-100 mb-6">
              Discover the Magic of Himalayas - Shimla, Manali, Dharamshala & More
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="#packages" className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
                View Packages
              </Link>
              <Link href="#enquiry" className="bg-white hover:bg-gray-100 text-green-900 px-6 py-3 rounded-lg font-semibold transition-colors">
                Get Free Quote
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Himachal */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <SectionHeader 
            title="Why Choose Himachal Pradesh?" 
            subtitle="Experience the perfect blend of adventure, spirituality, and natural beauty in the Himalayas"
          />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
            {himachalExperiences.map((exp, index) => (
              <div key={index} className="bg-green-50 p-6 rounded-xl hover:shadow-lg transition-shadow">
                <div className="text-4xl mb-4">{exp.icon}</div>
                <h3 className="text-xl font-bold text-green-900 mb-2">{exp.title}</h3>
                <p className="text-gray-600">{exp.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="py-16 bg-gradient-to-b from-green-50 to-white">
        <div className="container mx-auto px-4">
          <SectionHeader 
            title="Popular Himachal Destinations" 
            subtitle="Explore the most sought-after hill stations and valleys"
          />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            {himachalDestinations.map((dest, index) => (
              <Link 
                key={index} 
                href={`/destinations/${dest.name.toLowerCase().replace(/\s+/g, '-')}`}
                className="group relative h-64 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
              >
                <Image
                  src={dest.image}
                  alt={`${dest.name} - ${dest.description}`}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-xl font-bold text-white">{dest.name}</h3>
                  <p className="text-gray-200 text-sm">{dest.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Tour Packages */}
      <section id="packages" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <SectionHeader 
            title="Best Himachal Tour Packages" 
            subtitle="Curated itineraries for every traveler - families, couples, adventurers, and spiritual seekers"
          />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            {packages.map((pkg) => (
              <PackageCard key={pkg.slug} pkg={pkg} />
            ))}
          </div>
          {packages.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">No Himachal packages currently available. Check back soon!</p>
              <Link href="/packages" className="inline-block mt-4 text-green-600 hover:text-green-700 font-semibold">
                View All Packages →
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gradient-to-b from-green-50 to-white">
        <div className="container mx-auto px-4">
          <SectionHeader 
            title="Frequently Asked Questions" 
            subtitle="Everything you need to know about Himachal tours"
          />
          <div className="max-w-3xl mx-auto mt-12 space-y-6">
            {himachalFaqs.map((faq, index) => (
              <details key={index} className="bg-white rounded-lg shadow-sm border border-green-100">
                <summary className="px-6 py-4 cursor-pointer font-semibold text-green-900 hover:bg-green-50">
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
      <section id="enquiry" className="py-16 bg-green-900">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-4">Plan Your Himachal Adventure</h2>
            <p className="text-green-100">
              Get a customized quote for your Himachal tour package. Our experts will help you plan the perfect Himalayan getaway.
            </p>
          </div>
          <div className="max-w-xl mx-auto">
            <EnquiryForm destination="Himachal Pradesh" />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 bg-orange-500">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Ready to Explore the Himalayas?
          </h2>
          <p className="text-orange-100 mb-6 max-w-2xl mx-auto">
            Book your Himachal tour package today and create memories that last a lifetime. Best prices guaranteed!
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="tel:+918171158569" className="bg-white hover:bg-gray-100 text-orange-600 px-6 py-3 rounded-lg font-semibold transition-colors">
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