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
  title: "Chardham Yatra Packages - Best Yamunotri Gangotri Kedarnath Badrinath Tours",
  description: "Book sacred Chardham Yatra packages with My Quick Trippers. Complete Yamunotri Gangotri Kedarnath Badrinath pilgrimage tours. Helicopter services, expert guidance, best prices.",
  keywords: [
    "Chardham Yatra",
    "Chardham Yatra packages",
    "Yamunotri Gangotri Kedarnath Badrinath",
    "Chardham pilgrimage tour",
    "Uttarakhand pilgrimage",
    "Char Dham Yatra by helicopter",
    "Chardham tour packages 2024",
    "Best Chardham Yatra packages",
    "Affordable Chardham Yatra",
    "Chardham Yatra from Delhi",
    "Chardham Yatra from Haridwar",
    "Sacred pilgrimage India",
    "Hindu pilgrimage sites",
    "Uttarakhand tourism",
    "Badrinath Kedarnath tour"
  ],
  openGraph: {
    title: "Chardham Yatra Packages - Sacred Pilgrimage Tours",
    description: "Book sacred Chardham Yatra packages with My Quick Trippers. Complete Yamunotri Gangotri Kedarnath Badrinath pilgrimage tours.",
    url: `${siteConfig.domain}/campaigns/chardham-yatra`,
    siteName: siteConfig.name,
    type: "website",
    images: [
      {
        url: `${siteConfig.domain}/images/packages/char-dham.jpg`,
        width: 1200,
        height: 630,
        alt: "Chardham Yatra - Sacred Pilgrimage Tour",
      },
    ],
  },
};

const chardhamPackages = () => {
  const allPackages = getPublicPackages();
  return allPackages.filter(pkg => 
    pkg.title.toLowerCase().includes('char dham') ||
    pkg.title.toLowerCase().includes('chardham') ||
    pkg.title.toLowerCase().includes('yamunotri') ||
    pkg.title.toLowerCase().includes('gangotri') ||
    pkg.title.toLowerCase().includes('kedarnath') ||
    pkg.title.toLowerCase().includes('badrinath') ||
    pkg.title.toLowerCase().includes('pilgrimage') ||
    pkg.category === 'Pilgrimage'
  ).slice(0, 12);
};

const chardhamTemples = [
  { 
    name: "Yamunotri", 
    description: "Source of Yamuna River - Dedicated to Goddess Yamuna", 
    altitude: "3,293m",
    location: "Uttarkashi district",
    image: "/images/packages/yamunotri.jpg",
    significance: "First stop of Chardham Yatra, known for thermal springs"
  },
  { 
    name: "Gangotri", 
    description: "Source of Ganges River - Dedicated to Goddess Ganga", 
    altitude: "3,100m",
    location: "Uttarkashi district",
    image: "/images/packages/gangotri.jpg",
    significance: "Most sacred river in Hinduism, temple near Bhagirathi River"
  },
  { 
    name: "Kedarnath", 
    description: "One of 12 Jyotirlingas - Dedicated to Lord Shiva", 
    altitude: "3,583m",
    location: "Rudraprayag district",
    image: "/images/packages/kedarnath.jpg",
    significance: "Highest among Jyotirlingas, near Mandakini River"
  },
  { 
    name: "Badrinath", 
    description: "Dedicated to Lord Vishnu - Part of Char Dham", 
    altitude: "3,133m",
    location: "Chamoli district",
    image: "/images/packages/badrinath.jpg",
    significance: "Most important Vaishnavite temple, between Nar and Narayan mountains"
  },
];

const yatraHighlights = [
  { icon: "🙏", title: "Sacred Pilgrimage", description: "Visit four most holy Hindu temples in the Himalayas" },
  { icon: "🏔️", title: "Himalayan Beauty", description: "Experience breathtaking mountain landscapes and scenic valleys" },
  { icon: "🚁", title: "Helicopter Options", description: "Choose helicopter services for convenient and quick darshan" },
  { icon: "🏨", title: "Comfortable Stay", description: "Quality accommodations and hygienic food throughout the journey" },
  { icon: "👨‍👩‍👧‍👦", title: "Family Friendly", description: "Safe and well-organized tours suitable for all age groups" },
  { icon: "📿", title: "Spiritual Experience", description: "Professional guides providing religious and historical insights" },
];

const yatraTips = [
  "Best time: May-June and September-October for pleasant weather",
  "Carry warm clothing as temperatures can drop significantly at high altitudes",
  "Start physical preparation 2-3 months before the yatra for fitness",
  "Carry essential medicines and first aid kit for high altitude conditions",
  "Book accommodations in advance, especially during peak season",
  "Respect local customs and dress modestly when visiting temples",
  "Stay hydrated and carry water purification tablets",
  "Keep emergency contacts and your tour operator details handy",
];

const chardhamFaqs = [
  {
    question: "What is the Chardham Yatra?",
    answer: "Chardham Yatra is a sacred pilgrimage tour covering four holy shrines in Uttarakhand: Yamunotri, Gangotri, Kedarnath, and Badrinath. It's believed that completing this yatra washes away all sins and helps attain moksha (liberation)."
  },
  {
    question: "What is the best time for Chardham Yatra?",
    answer: "The best time is during summer (May-June) when weather is pleasant, and post-monsoon (September-October) when skies are clear. Avoid monsoon (July-August) due to landslides and winter (November-April) when temples remain closed."
  },
  {
    question: "How long does the Chardham Yatra take?",
    answer: "A traditional Chardham Yatra takes 10-12 days by road. Helicopter tours can complete it in 4-5 days. The duration depends on the chosen mode of transport, weather conditions, and time spent at each temple."
  },
  {
    question: "Is Chardham Yatra suitable for senior citizens?",
    answer: "Yes, with proper preparation. Senior citizens should opt for helicopter packages to avoid strenuous trekking, carry medications, and choose tours with comfortable pacing. Medical fitness check is recommended before undertaking the journey."
  },
  {
    question: "What documents are required for Chardham Yatra?",
    answer: "Valid ID proof (Aadhar card, passport, etc.), medical certificate for senior citizens, and passport-size photographs are essential. Some areas may require inner line permits or forest permits which your tour operator will arrange."
  },
  {
    question: "What is included in Chardham Yatra packages?",
    answer: "Our packages include accommodation in hotels/ashrams, transportation (private vehicle or helicopter), meals (breakfast and dinner), temple darshan assistance, priest services for puja, and the support of experienced tour guides throughout the journey."
  },
  {
    question: "How difficult is the Chardham Yatra trek?",
    answer: "The difficulty varies. Yamunotri involves a 6km trek, Kedarnath has a 16km trek (or helicopter option), while Gangotri and Badrinath are accessible by road. Choose helicopter packages for easier access or prepare physically for the trekking routes."
  },
  {
    question: "What are the accommodation options during Chardham Yatra?",
    answer: "Options range from basic dharamshalas and guest houses to comfortable hotels and luxury resorts. We recommend booking quality accommodations in advance, especially near Kedarnath where options are limited due to terrain constraints."
  },
];

export default function ChardhamYatraPage() {
  const packages = chardhamPackages();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    "name": siteConfig.name,
    "description": "Best Chardham Yatra Packages - Sacred pilgrimage tours to Yamunotri Gangotri Kedarnath Badrinath",
    "url": `${siteConfig.domain}/campaigns/chardham-yatra`,
    "telephone": siteConfig.phone,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": siteConfig.address.street,
      "addressLocality": siteConfig.address.city,
      "addressRegion": siteConfig.address.state,
      "addressCountry": siteConfig.address.country
    },
    "priceRange": "$$",
    "areaServed": ["Uttarakhand", "Yamunotri", "Gangotri", "Kedarnath", "Badrinath", "Himalayas"],
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Chardham Yatra Packages",
      "itemListElement": packages.map((pkg, index) => ({
        "@type": "Offer",
        "itemOffered": {
          "@type": "TouristTrip",
          "name": pkg.title,
          "description": pkg.description || `Experience ${pkg.title} with My Quick Trippers`,
          "touristType": ["Pilgrimage", "Spiritual", "Family", "Senior Citizens"]
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
            src="/images/packages/char-dham.jpg"
            alt="Chardham Yatra - Sacred Pilgrimage in Himalayas"
            fill
            className="object-cover opacity-40"
            priority
          />
        </div>
        <div className="relative z-10 container mx-auto px-4 h-full flex items-center">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
              Chardham Yatra Packages
            </h1>
            <p className="text-xl md:text-2xl text-orange-100 mb-6">
              Sacred Journey to Yamunotri, Gangotri, Kedarnath & Badrinath
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="#packages" className="bg-white hover:bg-gray-100 text-orange-600 px-6 py-3 rounded-lg font-semibold transition-colors">
                View Packages
              </Link>
              <Link href="#enquiry" className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
                Plan Your Yatra
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Chardham Temples */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <SectionHeader 
            title="The Four Sacred Abodes" 
            subtitle="Journey to the holiest Hindu temples in the Himalayas"
          />
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
            {chardhamTemples.map((temple, index) => (
              <div key={index} className="bg-orange-50 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                <div className="relative h-48">
                  <Image
                    src={temple.image}
                    alt={`${temple.name} - ${temple.description}`}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-2 right-2 bg-orange-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    {temple.altitude}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-xl font-bold text-orange-900 mb-2">{temple.name}</h3>
                  <p className="text-gray-600 text-sm mb-2">{temple.description}</p>
                  <p className="text-gray-500 text-xs mb-2">📍 {temple.location}</p>
                  <p className="text-orange-700 text-sm font-medium">{temple.significance}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Yatra Highlights */}
      <section className="py-16 bg-gradient-to-b from-orange-50 to-white">
        <div className="container mx-auto px-4">
          <SectionHeader 
            title="Why Choose Our Chardham Yatra?" 
            subtitle="Experience a spiritually enriching journey with comfort and devotion"
          />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
            {yatraHighlights.map((highlight, index) => (
              <div key={index} className="bg-white p-6 rounded-xl hover:shadow-lg transition-shadow border border-orange-100">
                <div className="text-4xl mb-4">{highlight.icon}</div>
                <h3 className="text-xl font-bold text-orange-900 mb-2">{highlight.title}</h3>
                <p className="text-gray-600">{highlight.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tour Packages */}
      <section id="packages" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <SectionHeader 
            title="Chardham Yatra Tour Packages" 
            subtitle="Choose from our carefully curated pilgrimage packages - road trips, helicopter tours, and custom itineraries"
          />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            {packages.map((pkg) => (
              <PackageCard key={pkg.slug} pkg={pkg} />
            ))}
          </div>
          {packages.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">No Chardham packages currently available. Check back soon!</p>
              <Link href="/packages" className="inline-block mt-4 text-orange-600 hover:text-orange-700 font-semibold">
                View All Pilgrimage Packages →
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Yatra Tips */}
      <section className="py-16 bg-gradient-to-b from-orange-50 to-white">
        <div className="container mx-auto px-4">
          <SectionHeader 
            title="Essential Yatra Tips" 
            subtitle="Important guidelines for a safe and spiritually fulfilling pilgrimage"
          />
          <div className="max-w-4xl mx-auto mt-12">
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <ul className="space-y-4">
                {yatraTips.map((tip, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="text-orange-600 text-xl">✓</span>
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
            subtitle="Everything you need to know about Chardham Yatra"
          />
          <div className="max-w-3xl mx-auto mt-12 space-y-6">
            {chardhamFaqs.map((faq, index) => (
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
            <h2 className="text-3xl font-bold text-white mb-4">Begin Your Sacred Journey</h2>
            <p className="text-orange-100">
              Let our experts help you plan the perfect Chardham Yatra. Get personalized packages, helicopter options, and spiritual guidance.
            </p>
          </div>
          <div className="max-w-xl mx-auto">
            <EnquiryForm destination="Chardham Yatra" />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-orange-900 mb-4">
            Embark on Your Spiritual Journey Today
          </h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Book your Chardham Yatra package and experience divine blessings in the sacred Himalayas. Early booking recommended for best rates.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="tel:+918171158569" className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
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