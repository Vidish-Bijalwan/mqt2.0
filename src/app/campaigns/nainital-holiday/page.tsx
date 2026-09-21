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
  title: "Nainital Holiday Packages - Best Nainital Tour Packages | My Quick Trippers",
  description: "Book Nainital holiday packages with My Quick Trippers. Best Nainital tour packages, lake tours, mountain getaways. Family vacations, honeymoon trips, adventure activities. Best prices.",
  keywords: [
    "Nainital holiday packages",
    "Nainital tour packages",
    "Nainital tourism packages",
    "Nainital lake tours",
    "Nainital vacation packages",
    "Nainital weekend getaways",
    "Nainital family packages",
    "Nainital honeymoon packages",
    "Nainital adventure tours",
    "Best Nainital packages",
    "Nainital trip from Delhi",
    "Nainital holiday packages",
    "Uttarakhand hill station",
    "Lake district tours",
    "Nainital sightseeing"
  ],
  openGraph: {
    title: "Nainital Holiday Packages - Lake District Tours",
    description: "Book Nainital holiday packages with My Quick Trippers. Best Nainital tour packages, lake tours, mountain getaways.",
    url: `${siteConfig.domain}/campaigns/nainital-holiday`,
    siteName: siteConfig.name,
    type: "website",
    images: [
      {
        url: `${siteConfig.domain}/images/packages/nainital.jpg`,
        width: 1200,
        height: 630,
        alt: "Nainital Holiday Packages - Beautiful Lake and Mountains",
      },
    ],
  },
};

const nainitalPackages = () => {
  const allPackages = getPublicPackages();
  return allPackages.filter(pkg => 
    pkg.title.toLowerCase().includes('nainital') ||
    pkg.title.toLowerCase().includes('lake') ||
    pkg.title.toLowerCase().includes('uttarakhand') ||
    pkg.category === 'North India'
  ).slice(0, 12);
};

const nainitalAttractions = [
  { 
    name: "Naini Lake", 
    description: "Heart-shaped natural lake - boating and sunset views", 
    image: "/images/packages/naini-lake.jpg",
    activities: ["Boating", "Yachting", "Sunset views"]
  },
  { 
    name: "Naina Devi Temple", 
    description: "Sacred temple on lake's northern shore - spiritual significance", 
    image: "/images/packages/naina-devi-temple.jpg",
    activities: ["Temple visit", "Spiritual", "Scenic views"]
  },
  { 
    name: "Mall Road", 
    description: "Vibrant shopping street - local handicrafts and food", 
    image: "/images/packages/mall-road.jpg",
    activities: ["Shopping", "Local food", "Walking"]
  },
  { 
    name: "Snow View Point", 
    description: "Panoramic Himalayan views - cable car access", 
    image: "/images/packages/snow-view.jpg",
    activities: ["Cable car", "Mountain views", "Photography"]
  },
  { 
    name: "Eco Cave Gardens", 
    description: "Network of interconnected caves - adventure for families", 
    image: "/images/packages/eco-caves.jpg",
    activities: ["Adventure", "Family fun", "Exploration"]
  },
  { 
    name: "Tiffin Top", 
    description: "Scenic viewpoint - perfect for picnics and photography", 
    image: "/images/packages/tiffin-top.jpg",
    activities: ["Trekking", "Picnics", "Photography"]
  },
];

const nainitalExperiences = [
  { icon: "🚤", title: "Lake Activities", description: "Boating, yachting, and peaceful lake experiences" },
  { icon: "🏔️", title: "Mountain Views", description: "Panoramic Himalayan vistas and scenic viewpoints" },
  { icon: "🛍️", title: "Local Shopping", description: "Handicrafts, woolens, and local delicacies" },
  { icon: "🏛️", title: "Colonial Heritage", description: "British-era architecture and churches" },
  { icon: "🥾", title: "Nature Treks", description: "Easy hiking trails and nature walks" },
  { icon: "🍽️", title: "Local Cuisine", description: "Kumaoni food and lakeside dining" },
];

const nainitalTips = [
  "Best time: March to June and September to November for pleasant weather",
  "Book boating in advance during peak season (April-June and October)",
  "Carry light woolens even in summer as evenings can be cool",
  "Try local Kumaoni cuisine at small eateries near Mall Road",
  "Visit Naina Devi Temple early morning to avoid crowds",
  "Take the cable car to Snow View Point for best Himalayan views",
  "Explore nearby lakes like Bhimtal, Naukuchiatal, and Sattal",
  "Respect the religious significance of Naina Devi Temple",
];

const nainitalFaqs = [
  {
    question: "What is the best time to visit Nainital?",
    answer: "The best time to visit Nainital is during summer (March-June) for pleasant weather (15-25°C) and monsoon (July-September) for lush greenery. Winter (December-February) offers snow activities and beautiful views, though temperatures can drop to 0°C."
  },
  {
    question: "How many days are ideal for a Nainital trip?",
    answer: "A typical Nainital trip requires 2-3 days to cover major attractions. For a comprehensive experience including nearby lakes (Bhimtal, Naukuchiatal, Sattal) and outdoor activities, plan for 4-5 days. Weekend trips from Delhi are very popular."
  },
  {
    question: "How do I reach Nainital from Delhi?",
    answer: "Nainital is approximately 300km from Delhi. The most convenient way is by road (6-7 hours by car). Alternatively, take a train to Kathgodam (nearest railway station, 34km away) and then a taxi or bus to Nainital. Limited bus services are also available."
  },
  {
    question: "What are the must-visit places in Nainital?",
    answer: "Must-visit places include Naini Lake (boating), Naina Devi Temple, Mall Road (shopping), Snow View Point (cable car), Eco Cave Gardens, Tiffin Top, and the Governor's House. Don't miss the sunset views from the lake and explore nearby lakes like Bhimtal and Sattal."
  },
  {
    question: "Is Nainital suitable for families with children?",
    answer: "Yes, Nainital is perfect for families with children. Activities like boating on Naini Lake, visiting Eco Cave Gardens, gentle treks to Tiffin Top, and exploring nearby lakes are kid-friendly. Many hotels offer family rooms and child-friendly amenities."
  },
  {
    question: "What is included in Nainital holiday packages?",
    answer: "Our Nainital packages include accommodation in lake-view hotels, meals (breakfast and dinner), sightseeing as per itinerary, boating on Naini Lake, local transportation, and the services of experienced guides. Premium packages include additional activities and luxury accommodations."
  },
  {
    question: "What are the accommodation options in Nainital?",
    answer: "Nainital offers a range of accommodations from budget guesthouses and heritage properties to luxury lakeside resorts. Lake-view hotels are most popular but book quickly during peak season. We recommend booking in advance, especially for weekends and holidays."
  },
  {
    question: "What activities can I do in Nainital?",
    answer: "Popular activities include boating on Naini Lake, shopping on Mall Road, visiting temples, trekking to viewpoints, cable car to Snow View Point, exploring caves, photography, and enjoying local cuisine. Adventure activities like paragliding and rock climbing are also available seasonally."
  },
];

export default function NainitalHolidayPage() {
  const packages = nainitalPackages();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    "name": siteConfig.name,
    "description": "Best Nainital Holiday Packages - Lake tours, mountain getaways, family vacations, honeymoon trips",
    "url": `${siteConfig.domain}/campaigns/nainital-holiday`,
    "telephone": siteConfig.phone,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": siteConfig.address.street,
      "addressLocality": siteConfig.address.city,
      "addressRegion": siteConfig.address.state,
      "addressCountry": siteConfig.address.country
    },
    "priceRange": "$$",
    "areaServed": ["Nainital", "Uttarakhand", "Kumaon", "Bhimtal", "Sattal"],
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Nainital Holiday Packages",
      "itemListElement": packages.map((pkg, index) => ({
        "@type": "Offer",
        "itemOffered": {
          "@type": "TouristTrip",
          "name": pkg.title,
          "description": pkg.description || `Experience ${pkg.title} with My Quick Trippers`,
          "touristType": ["Family", "Couple", "Adventure", "Nature"]
        },
        "position": index + 1
      }))
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      
      {/* Hero Section */}
      <section className="relative h-[400px] md:h-[500px] bg-gradient-to-r from-teal-900 to-teal-700 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/packages/nainital.jpg"
            alt="Nainital Holiday Packages - Beautiful Lake and Mountains"
            fill
            className="object-cover opacity-40"
            priority
          />
        </div>
        <div className="relative z-10 container mx-auto px-4 h-full flex items-center">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
              Nainital Holiday Packages
            </h1>
            <p className="text-xl md:text-2xl text-teal-100 mb-6">
              Escape to the Lake District of India
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="#packages" className="bg-white hover:bg-gray-100 text-teal-900 px-6 py-3 rounded-lg font-semibold transition-colors">
                View Packages
              </Link>
              <Link href="#enquiry" className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
                Plan Your Trip
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Nainital Experiences */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <SectionHeader 
            title="Why Choose Nainital?" 
            subtitle="Experience the perfect blend of natural beauty, colonial charm, and serene lake life"
          />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
            {nainitalExperiences.map((exp, index) => (
              <div key={index} className="bg-teal-50 p-6 rounded-xl hover:shadow-lg transition-shadow">
                <div className="text-4xl mb-4">{exp.icon}</div>
                <h3 className="text-xl font-bold text-teal-900 mb-2">{exp.title}</h3>
                <p className="text-gray-600">{exp.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Top Attractions */}
      <section className="py-16 bg-gradient-to-b from-teal-50 to-white">
        <div className="container mx-auto px-4">
          <SectionHeader 
            title="Top Nainital Attractions" 
            subtitle="Must-visit landmarks and experiences in the lake district"
          />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            {nainitalAttractions.map((attraction, index) => (
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
                  <h3 className="text-xl font-bold text-teal-900 mb-2">{attraction.name}</h3>
                  <p className="text-gray-600 text-sm mb-3">{attraction.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {attraction.activities.map((activity, i) => (
                      <span key={i} className="bg-teal-100 text-teal-800 text-xs px-2 py-1 rounded-full">
                        {activity}
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
            title="Nainital Holiday Packages" 
            subtitle="Choose from our carefully curated Nainital packages - family vacations, honeymoon trips, and weekend getaways"
          />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            {packages.map((pkg) => (
              <PackageCard key={pkg.slug} pkg={pkg} />
            ))}
          </div>
          {packages.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">No Nainital packages currently available. Check back soon!</p>
              <Link href="/packages" className="inline-block mt-4 text-teal-600 hover:text-teal-700 font-semibold">
                View All Uttarakhand Packages →
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Travel Tips */}
      <section className="py-16 bg-gradient-to-b from-teal-50 to-white">
        <div className="container mx-auto px-4">
          <SectionHeader 
            title="Essential Nainital Travel Tips" 
            subtitle="Important guidelines for a memorable lake district experience"
          />
          <div className="max-w-4xl mx-auto mt-12">
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <ul className="space-y-4">
                {nainitalTips.map((tip, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="text-teal-600 text-xl">✓</span>
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
            subtitle="Everything you need to know about Nainital tours"
          />
          <div className="max-w-3xl mx-auto mt-12 space-y-6">
            {nainitalFaqs.map((faq, index) => (
              <details key={index} className="bg-teal-50 rounded-lg shadow-sm border border-teal-100">
                <summary className="px-6 py-4 cursor-pointer font-semibold text-teal-900 hover:bg-teal-100">
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
      <section id="enquiry" className="py-16 bg-teal-900">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-4">Plan Your Nainital Getaway</h2>
            <p className="text-teal-100">
              Get a customized quote for your Nainital holiday package. Our experts will help you plan the perfect lake district vacation.
            </p>
          </div>
          <div className="max-w-xl mx-auto">
            <EnquiryForm destination="Nainital" />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 bg-teal-500">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Ready for a Lakeside Retreat?
          </h2>
          <p className="text-teal-100 mb-6 max-w-2xl mx-auto">
            Book your Nainital holiday package today and experience the serenity of the lake district. Best prices guaranteed!
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="tel:+918171158569" className="bg-white hover:bg-gray-100 text-teal-600 px-6 py-3 rounded-lg font-semibold transition-colors">
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