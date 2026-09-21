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
  title: "Dehradun Adventure Packages - Adventure Tours & Activities | My Quick Trippers",
  description: "Book Dehradun adventure packages with My Quick Trippers. Adventure tours, trekking, river rafting, camping, wildlife safaris. Best adventure activities, thrilling experiences, expert guides.",
  keywords: [
    "Dehradun adventure packages",
    "Dehradun adventure tours",
    "Adventure activities Dehradun",
    "Trekking packages Dehradun",
    "River rafting Dehradun",
    "Camping packages Dehradun",
    "Wildlife safari Dehradun",
    "Adventure sports Dehradun",
    "Dehradun trip packages",
    "Uttarakhand adventure tours",
    "Rishikesh adventure packages",
    "Mussoorie adventure tours",
    "Adventure weekend getaways",
    "Outdoor activities Dehradun",
    "Best adventure packages"
  ],
  openGraph: {
    title: "Dehradun Adventure Packages - Adventure Tours & Activities",
    description: "Book Dehradun adventure packages with My Quick Trippers. Adventure tours, trekking, river rafting, camping, wildlife safaris.",
    url: `${siteConfig.domain}/campaigns/dehradun-adventure`,
    siteName: siteConfig.name,
    type: "website",
    images: [
      {
        url: `${siteConfig.domain}/images/packages/dehradun-adventure.jpg`,
        width: 1200,
        height: 630,
        alt: "Dehradun Adventure Packages - Adventure Activities in Uttarakhand",
      },
    ],
  },
};

const dehradunAdventurePackages = () => {
  const allPackages = getPublicPackages();
  return allPackages.filter(pkg => 
    pkg.title.toLowerCase().includes('dehradun') ||
    pkg.title.toLowerCase().includes('adventure') ||
    pkg.title.toLowerCase().includes('trekking') ||
    pkg.title.toLowerCase().includes('rafting') ||
    pkg.title.toLowerCase().includes('camping') ||
    pkg.title.toLowerCase().includes('rishikesh') ||
    pkg.title.toLowerCase().includes('mussoorie') ||
    pkg.category === 'Adventure' ||
    pkg.category === 'North India'
  ).slice(0, 12);
};

const adventureActivities = [
  { 
    name: "River Rafting", 
    description: "Thrilling white-water rafting on Ganges and Yamuna rivers", 
    difficulty: "Moderate to Extreme",
    bestSeason: "March-June, September-November",
    image: "/images/packages/river-rafting.jpg"
  },
  { 
    name: "Trekking Expeditions", 
    description: "Scenic mountain treks from easy to challenging levels", 
    difficulty: "Easy to Difficult",
    bestSeason: "March-June, September-November",
    image: "/images/packages/trekking.jpg"
  },
  { 
    name: "Wildlife Safari", 
    description: "Rajaji National Park safari - elephants, tigers, and more", 
    difficulty: "Easy",
    bestSeason: "November-June",
    image: "/images/packages/wildlife-safari.jpg"
  },
  { 
    name: "Camping Experiences", 
    description: "Riverside and mountain camping under the stars", 
    difficulty: "Easy",
    bestSeason: "March-June, September-November",
    image: "/images/packages/camping.jpg"
  },
  { 
    name: "Rock Climbing", 
    description: "Professional rock climbing and rappelling adventures", 
    difficulty: "Moderate",
    bestSeason: "March-June, September-November",
    image: "/images/packages/rock-climbing.jpg"
  },
  { 
    name: "Paragliding", 
    description: "Soar over the mountains with certified instructors", 
    difficulty: "Easy",
    bestSeason: "March-June, September-November",
    image: "/images/packages/paragliding.jpg"
  },
];

const adventureHighlights = [
  { icon: "🏔️", title: "Himalayan Terrain", description: "Perfect landscape for outdoor adventures and thrill activities" },
  { icon: "🌊", title: "River Adventures", description: "Ganges and Yamuna rivers offer world-class rafting experiences" },
  { icon: "🐅", title: "Wildlife Encounters", description: "Rajaji National Park - home to elephants, tigers, and diverse wildlife" },
  { icon: "⛺", title: "Camping Paradise", description: "Scenic campsites with stunning mountain and river views" },
  { icon: "🧗", title: "Adventure Sports", description: "Rock climbing, rappelling, zip-lining, and more for thrill seekers" },
  { icon: "🎯", title: "Expert Guidance", description: "Certified instructors and experienced guides for safe adventures" },
];

const adventureTips = [
  "Best time: March-June and September-November for optimal adventure conditions",
  "Book adventure activities in advance, especially during peak seasons",
  "Carry appropriate gear - comfortable shoes, quick-dry clothes, sunscreen",
  "Follow safety instructions from guides for all adventure activities",
  "Stay hydrated and carry energy snacks during outdoor activities",
  "Inform about any medical conditions before attempting adventure sports",
  "Choose difficulty levels based on your fitness and experience",
  "Respect nature and follow eco-friendly practices during outdoor activities",
];

const adventureFaqs = [
  {
    question: "What adventure activities are available in Dehradun?",
    answer: "Dehradun offers diverse adventure activities including river rafting (Ganges, Yamuna), trekking (various difficulty levels), wildlife safaris (Rajaji National Park), camping (riverside, mountain), rock climbing, rappelling, paragliding, zip-lining, and bungee jumping. Each activity has different difficulty levels and seasonal availability."
  },
  {
    question: "What is the best time for adventure activities in Dehradun?",
    answer: "The best time is March-June (summer) for pleasant weather and September-November (post-monsoon) for clear skies and good river conditions. Avoid monsoon (July-August) due to safety concerns with water activities and landslides. Winter (December-February) is good for lower-altitude activities."
  },
  {
    question: "Is Dehradun suitable for adventure beginners?",
    answer: "Yes, Dehradun is perfect for adventure beginners. Most activities offer different difficulty levels from easy to extreme. Professional instructors provide training, safety briefings, and guidance. Beginners can start with easy treks, basic rafting, and simple camping before progressing to more challenging activities."
  },
  {
    question: "How safe are adventure activities in Dehradun?",
    answer: "Adventure activities in Dehradun are generally safe when conducted by certified operators with proper safety equipment and trained instructors. We work with reputable adventure companies that follow international safety standards. However, adventure sports carry inherent risks, so follow all safety instructions and choose appropriate difficulty levels."
  },
  {
    question: "What should I pack for Dehradun adventure trips?",
    answer: "Pack comfortable outdoor clothing, quick-dry fabrics, sturdy walking shoes/hiking boots, sunscreen, sunglasses, hat, insect repellent, personal medications, flashlight, power bank, and a small backpack. For specific activities like rafting, carry water shoes and dry clothes. Layering is essential due to temperature variations."
  },
  {
    question: "Are adventure activities suitable for families?",
    answer: "Many adventure activities in Dehradun are family-friendly. Easy treks, wildlife safaris, basic camping, and gentle rafting stretches are suitable for families with children. However, more extreme activities like difficult rafting, rock climbing, and paragliding have age and fitness restrictions. We can customize family adventure packages."
  },
  {
    question: "What is included in adventure packages?",
    answer: "Our adventure packages include accommodation (tents/hotels), meals (as specified), adventure equipment rental, professional guides/instructors, safety gear, transportation to activity sites, permits and fees, and basic first aid support. Premium packages include additional activities and better accommodation options."
  },
  {
    question: "Can we combine adventure activities with sightseeing?",
    answer: "Absolutely! Dehradun's location allows perfect combination of adventure and sightseeing. Combine rafting with Rishikesh visits, trekking with Mussoorie sightseeing, wildlife safaris with temple visits, and camping with local cultural experiences. We create balanced itineraries that offer both adventure and cultural exploration."
  },
];

export default function DehradunAdventurePage() {
  const packages = dehradunAdventurePackages();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    "name": siteConfig.name,
    "description": "Best Dehradun Adventure Packages - Adventure tours, trekking, river rafting, camping, wildlife safaris",
    "url": `${siteConfig.domain}/campaigns/dehradun-adventure`,
    "telephone": siteConfig.phone,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": siteConfig.address.street,
      "addressLocality": siteConfig.address.city,
      "addressRegion": siteConfig.address.state,
      "addressCountry": siteConfig.address.country
    },
    "priceRange": "$$",
    "areaServed": ["Dehradun", "Rishikesh", "Mussoorie", "Rajaji National Park", "Uttarakhand"],
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Dehradun Adventure Packages",
      "itemListElement": packages.map((pkg, index) => ({
        "@type": "Offer",
        "itemOffered": {
          "@type": "TouristTrip",
          "name": pkg.title,
          "description": pkg.description || `Experience ${pkg.title} with My Quick Trippers`,
          "touristType": ["Adventure", "Family", "Group", "Solo Traveler"]
        },
        "position": index + 1
      }))
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      
      {/* Hero Section */}
      <section className="relative h-[400px] md:h-[500px] bg-gradient-to-r from-orange-900 to-orange-700 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/packages/dehradun-adventure.jpg"
            alt="Dehradun Adventure Packages - Adventure Activities in Uttarakhand"
            fill
            className="object-cover opacity-40"
            priority
          />
        </div>
        <div className="relative z-10 container mx-auto px-4 h-full flex items-center">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
              Dehradun Adventure Packages
            </h1>
            <p className="text-xl md:text-2xl text-orange-100 mb-6">
              Thrill and Excitement in the Doon Valley
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="#packages" className="bg-white hover:bg-gray-100 text-orange-900 px-6 py-3 rounded-lg font-semibold transition-colors">
                View Packages
              </Link>
              <Link href="#enquiry" className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
                Plan Your Adventure
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Adventure Highlights */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <SectionHeader 
            title="Why Choose Dehradun for Adventure?" 
            subtitle="Experience the perfect blend of thrill, nature, and Himalayan beauty"
          />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
            {adventureHighlights.map((highlight, index) => (
              <div key={index} className="bg-orange-50 p-6 rounded-xl hover:shadow-lg transition-shadow">
                <div className="text-4xl mb-4">{highlight.icon}</div>
                <h3 className="text-xl font-bold text-orange-900 mb-2">{highlight.title}</h3>
                <p className="text-gray-600">{highlight.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Adventure Activities */}
      <section className="py-16 bg-gradient-to-b from-orange-50 to-white">
        <div className="container mx-auto px-4">
          <SectionHeader 
            title="Adventure Activities" 
            subtitle="Thrilling experiences for every adventure enthusiast"
          />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            {adventureActivities.map((activity, index) => (
              <div key={index} className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                <div className="relative h-48">
                  <Image
                    src={activity.image}
                    alt={`${activity.name} - ${activity.description}`}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-2 right-2 bg-orange-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    {activity.difficulty}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-xl font-bold text-orange-900 mb-2">{activity.name}</h3>
                  <p className="text-gray-600 text-sm mb-2">{activity.description}</p>
                  <p className="text-orange-700 text-xs">Best Season: {activity.bestSeason}</p>
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
            title="Dehradun Adventure Packages" 
            subtitle="Choose from our thrilling adventure packages - from beginner to expert level"
          />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            {packages.map((pkg) => (
              <PackageCard key={pkg.slug} pkg={pkg} />
            ))}
          </div>
          {packages.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">No adventure packages currently available. Check back soon!</p>
              <Link href="/packages" className="inline-block mt-4 text-orange-600 hover:text-orange-700 font-semibold">
                View All Adventure Packages →
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Travel Tips */}
      <section className="py-16 bg-gradient-to-b from-orange-50 to-white">
        <div className="container mx-auto px-4">
          <SectionHeader 
            title="Essential Adventure Tips" 
            subtitle="Important guidelines for a safe and thrilling adventure experience"
          />
          <div className="max-w-4xl mx-auto mt-12">
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <ul className="space-y-4">
                {adventureTips.map((tip, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="text-orange-600 text-xl">🎯</span>
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
            subtitle="Everything you need to know about Dehradun adventure tours"
          />
          <div className="max-w-3xl mx-auto mt-12 space-y-6">
            {adventureFaqs.map((faq, index) => (
              <details key={index} className="bg-orange-50 rounded-lg shadow-sm border border-orange-100">
                <summary className="px-6 py-4 cursor-pointer font-semibold text-orange-900 hover:bg-orange-100">
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
      <section id="enquiry" className="py-16 bg-orange-900">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-4">Plan Your Adventure Trip</h2>
            <p className="text-orange-100">
              Get a customized quote for your Dehradun adventure package. Our experts will help you plan the perfect thrilling experience with safety and excitement.
            </p>
          </div>
          <div className="max-w-xl mx-auto">
            <EnquiryForm destination="Dehradun Adventure" />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 bg-orange-500">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Ready for Your Next Adventure?
          </h2>
          <p className="text-orange-100 mb-6 max-w-2xl mx-auto">
            Book your Dehradun adventure package today and experience the thrill of Himalayan adventures. Safe, exciting, and unforgettable experiences await!
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
