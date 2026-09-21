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
  title: "Buddhist Tours India - Buddhist Pilgrimage Packages | My Quick Trippers",
  description: "Book Buddhist Tours India with My Quick Trippers. Buddhist pilgrimage packages to Bodh Gaya, Sarnath, Kushinagar, Lumbini. Buddhist circuit tours, spiritual journeys. Best prices.",
  keywords: [
    "Buddhist Tours India",
    "Buddhist pilgrimage packages",
    "Buddhist circuit India",
    "Bodh Gaya tour packages",
    "Sarnath tour packages",
    "Kushinagar tour packages",
    "Lumbini tour packages",
    "Buddhist spiritual tours",
    "Buddhist heritage sites",
    "Buddhist temple tours",
    "India Buddhist pilgrimage",
    "Buddhist tourism India",
    "Buddhist circuit tour",
    "Buddhist monasteries India",
    "Buddhist heritage tour"
  ],
  openGraph: {
    title: "Buddhist Tours India - Buddhist Pilgrimage Packages",
    description: "Book Buddhist Tours India with My Quick Trippers. Buddhist pilgrimage packages to Bodh Gaya, Sarnath, Kushinagar, Lumbini.",
    url: `${siteConfig.domain}/campaigns/buddhist-tours-india`,
    siteName: siteConfig.name,
    type: "website",
    images: [
      {
        url: `${siteConfig.domain}/images/packages/buddhist-tour.jpg`,
        width: 1200,
        height: 630,
        alt: "Buddhist Tours India - Buddhist Pilgrimage Sites",
      },
    ],
  },
};

const buddhistPackages = () => {
  const allPackages = getPublicPackages();
  return allPackages.filter(pkg => 
    pkg.title.toLowerCase().includes('buddhist') ||
    pkg.title.toLowerCase().includes('bodh gaya') ||
    pkg.title.toLowerCase().includes('sarnath') ||
    pkg.title.toLowerCase().includes('kushinagar') ||
    pkg.title.toLowerCase().includes('lumbini') ||
    pkg.title.toLowerCase().includes('pilgrimage') ||
    pkg.category === 'Pilgrimage'
  ).slice(0, 12);
};

const buddhistSites = [
  { 
    name: "Bodh Gaya", 
    description: "Where Buddha attained enlightenment - Mahabodhi Temple", 
    location: "Bihar",
    significance: "Most sacred Buddhist site, UNESCO World Heritage",
    image: "/images/packages/bodh-gaya.jpg"
  },
  { 
    name: "Sarnath", 
    description: "Where Buddha gave first sermon - Dhamek Stupa", 
    location: "Uttar Pradesh",
    significance: "Birthplace of Buddhist Sangha",
    image: "/images/packages/sarnath.jpg"
  },
  { 
    name: "Kushinagar", 
    description: "Where Buddha attained Mahaparinirvana - Parinirvana Stupa", 
    location: "Uttar Pradesh",
    significance: "Final resting place of Buddha",
    image: "/images/packages/kushinagar.jpg"
  },
  { 
    name: "Lumbini", 
    description: "Birthplace of Buddha - Maya Devi Temple", 
    location: "Nepal",
    significance: "Birthplace of Siddhartha Gautama",
    image: "/images/packages/lumbini.jpg"
  },
  { 
    name: "Rajgir", 
    description: "Where Buddha spent many years - Gridhakuta Hill", 
    location: "Bihar",
    significance: "First Buddhist council site",
    image: "/images/packages/rajgir.jpg"
  },
  { 
    name: "Vaishali", 
    description: "Where Buddha preached last sermon - Ashoka Pillar", 
    location: "Bihar",
    significance: "Second Buddhist council site",
    image: "/images/packages/vaishali.jpg"
  },
];

const buddhistExperiences = [
  { icon: "🙏", title: "Spiritual Awakening", description: "Follow Buddha's footsteps to enlightenment" },
  { icon: "🏛️", title: "Ancient Heritage", description: "Explore UNESCO World Heritage Buddhist sites" },
  { icon: "🧘", title: "Meditation Retreats", description: "Experience peace at ancient meditation sites" },
  { icon: "📿", title: "Buddhist Philosophy", description: "Learn about Buddha's teachings and philosophy" },
  { icon: "🏔️", title: "Sacred Landscapes", description: "Journey through spiritually significant regions" },
  { icon: "🌸", title: "Cultural Immersion", description: "Experience Buddhist traditions and monastic life" },
];

const buddhistTips = [
  "Best time: October to March for pleasant weather across Buddhist circuit",
  "Dress modestly when visiting temples and monasteries",
  "Remove shoes before entering temple premises",
  "Maintain silence and respect during meditation sessions",
  "Carry light woolens for winter months in northern regions",
  "Learn basic Buddhist etiquette before visiting monasteries",
  "Book accommodations in advance during Buddhist festivals",
  "Respect local customs and photography restrictions at religious sites",
];

const buddhistFaqs = [
  {
    question: "What is the Buddhist Circuit in India?",
    answer: "The Buddhist Circuit is a pilgrimage route covering the most important sites in Buddha's life: Lumbini (birth), Bodh Gaya (enlightenment), Sarnath (first sermon), and Kushinagar (death). This sacred journey follows the footsteps of Siddhartha Gautama and attracts millions of pilgrims annually."
  },
  {
    question: "What is the best time to visit Buddhist sites in India?",
    answer: "The best time is from October to March when the weather is pleasant across the Buddhist circuit. Avoid extreme summer (April-June) and monsoon (July-September) seasons. Visit during Buddha Purnima (May) for special celebrations and ceremonies."
  },
  {
    question: "How many days are needed for Buddhist pilgrimage tours?",
    answer: "A comprehensive Buddhist circuit tour covering major sites requires 10-12 days. Focused tours to specific regions (Bodh Gaya-Sarnath, or Lumbini-Kushinagar) can be done in 5-7 days. Extended tours including Tibetan monasteries in Ladakh and Dharamshala require 15-20 days."
  },
  {
    question: "What are the must-visit Buddhist sites in India?",
    answer: "Must-visit sites include Bodh Gaya (Mahabodhi Temple, Bodhi Tree), Sarnath (Dhamek Stupa, Ashoka Pillar), Kushinagar (Parinirvana Stupa), Rajgir (Gridhakuta Hill), Vaishali (Ashoka Pillar), and Nalanda (ancient university). Don't miss the Tibetan monasteries in Dharamshala and Ladakh."
  },
  {
    question: "Are Buddhist pilgrimage tours suitable for international visitors?",
    answer: "Yes, Buddhist tours are very popular among international visitors. Many sites have English signage, guides are available in multiple languages, and accommodations cater to international travelers. The spiritual significance and historical importance make these sites universally appealing."
  },
  {
    question: "What is included in Buddhist tour packages?",
    answer: "Our Buddhist packages include accommodation in guesthouses/hotels near holy sites, transportation between destinations, guided tours to important temples and stupas, assistance with puja ceremonies, meals (mostly vegetarian), and spiritual guidance from experienced Buddhist guides."
  },
  {
    question: "What are the accommodation options near Buddhist sites?",
    answer: "Options range from basic dharamshalas and guesthouses to comfortable hotels and monastic stays. Bodh Gaya and Sarnath have good international hotel options. Some monasteries offer simple accommodation for pilgrims seeking an authentic spiritual experience."
  },
  {
    question: "What should I know about Buddhist temple etiquette?",
    answer: "Important etiquette includes dressing modestly (covered shoulders and knees), removing shoes before entering temples, maintaining silence, not pointing feet at Buddha images, asking permission before photography, and being respectful during prayer and meditation sessions. Many sites have specific dress codes."
  },
];

export default function BuddhistToursIndiaPage() {
  const packages = buddhistPackages();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    "name": siteConfig.name,
    "description": "Best Buddhist Tours India - Buddhist pilgrimage packages to Bodh Gaya, Sarnath, Kushinagar, Lumbini",
    "url": `${siteConfig.domain}/campaigns/buddhist-tours-india`,
    "telephone": siteConfig.phone,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": siteConfig.address.street,
      "addressLocality": siteConfig.address.city,
      "addressRegion": siteConfig.address.state,
      "addressCountry": siteConfig.address.country
    },
    "priceRange": "$$",
    "areaServed": ["Bodh Gaya", "Sarnath", "Kushinagar", "Lumbini", "Rajgir", "Vaishali", "Bihar", "Uttar Pradesh"],
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Buddhist Tours India",
      "itemListElement": packages.map((pkg, index) => ({
        "@type": "Offer",
        "itemOffered": {
          "@type": "TouristTrip",
          "name": pkg.title,
          "description": pkg.description || `Experience ${pkg.title} with My Quick Trippers`,
          "touristType": ["Pilgrimage", "Spiritual", "Cultural", "Educational"]
        },
        "position": index + 1
      }))
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      
      {/* Hero Section */}
      <section className="relative h-[400px] md:h-[500px] bg-gradient-to-r from-amber-900 to-amber-700 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/packages/buddhist-tour.jpg"
            alt="Buddhist Tours India - Ancient Buddhist Temples and Monasteries"
            fill
            className="object-cover opacity-40"
            priority
          />
        </div>
        <div className="relative z-10 container mx-auto px-4 h-full flex items-center">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
              Buddhist Tours India
            </h1>
            <p className="text-xl md:text-2xl text-amber-100 mb-6">
              Follow the Path of Enlightenment
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="#packages" className="bg-white hover:bg-gray-100 text-amber-900 px-6 py-3 rounded-lg font-semibold transition-colors">
                View Packages
              </Link>
              <Link href="#enquiry" className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
                Begin Your Journey
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Buddhist Experiences */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <SectionHeader 
            title="Why Choose Buddhist Tours?" 
            subtitle="Experience spiritual transformation along the sacred path of Buddha"
          />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
            {buddhistExperiences.map((exp, index) => (
              <div key={index} className="bg-amber-50 p-6 rounded-xl hover:shadow-lg transition-shadow">
                <div className="text-4xl mb-4">{exp.icon}</div>
                <h3 className="text-xl font-bold text-amber-900 mb-2">{exp.title}</h3>
                <p className="text-gray-600">{exp.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sacred Buddhist Sites */}
      <section className="py-16 bg-gradient-to-b from-amber-50 to-white">
        <div className="container mx-auto px-4">
          <SectionHeader 
            title="Sacred Buddhist Sites" 
            subtitle="Journey to the most important places in Buddha's life"
          />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            {buddhistSites.map((site, index) => (
              <div key={index} className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                <div className="relative h-48">
                  <Image
                    src={site.image}
                    alt={`${site.name} - ${site.description}`}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-2 right-2 bg-amber-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    {site.location}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-xl font-bold text-amber-900 mb-2">{site.name}</h3>
                  <p className="text-gray-600 text-sm mb-2">{site.description}</p>
                  <p className="text-amber-700 text-sm font-medium">{site.significance}</p>
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
            title="Buddhist Pilgrimage Packages" 
            subtitle="Choose from our spiritually enriching Buddhist circuit tours and pilgrimage packages"
          />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            {packages.map((pkg) => (
              <PackageCard key={pkg.slug} pkg={pkg} />
            ))}
          </div>
          {packages.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">No Buddhist tour packages currently available. Check back soon!</p>
              <Link href="/packages" className="inline-block mt-4 text-amber-600 hover:text-amber-700 font-semibold">
                View All Pilgrimage Packages →
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Travel Tips */}
      <section className="py-16 bg-gradient-to-b from-amber-50 to-white">
        <div className="container mx-auto px-4">
          <SectionHeader 
            title="Essential Buddhist Pilgrimage Tips" 
            subtitle="Important guidelines for a respectful and spiritually fulfilling journey"
          />
          <div className="max-w-4xl mx-auto mt-12">
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <ul className="space-y-4">
                {buddhistTips.map((tip, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="text-amber-600 text-xl">✓</span>
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
            subtitle="Everything you need to know about Buddhist pilgrimage tours"
          />
          <div className="max-w-3xl mx-auto mt-12 space-y-6">
            {buddhistFaqs.map((faq, index) => (
              <details key={index} className="bg-amber-50 rounded-lg shadow-sm border border-amber-100">
                <summary className="px-6 py-4 cursor-pointer font-semibold text-amber-900 hover:bg-amber-100">
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
      <section id="enquiry" className="py-16 bg-amber-900">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-4">Begin Your Spiritual Journey</h2>
            <p className="text-amber-100">
              Let our experts help you plan a transformative Buddhist pilgrimage. Experience the peace and wisdom of Buddha's sacred path.
            </p>
          </div>
          <div className="max-w-xl mx-auto">
            <EnquiryForm destination="Buddhist Pilgrimage" />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 bg-amber-500">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Walk the Path of Enlightenment
          </h2>
          <p className="text-amber-100 mb-6 max-w-2xl mx-auto">
            Book your Buddhist pilgrimage tour today and experience spiritual transformation along the sacred Buddhist circuit.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="tel:+918171158569" className="bg-white hover:bg-gray-100 text-amber-600 px-6 py-3 rounded-lg font-semibold transition-colors">
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
