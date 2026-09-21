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
  title: "Helicopter Tours India - Helicopter Yatra & Adventure Tours | My Quick Trippers",
  description: "Book Helicopter Tours India with My Quick Trippers. Helicopter Yatra packages, Kedarnath helicopter tours, Vaishno Devi helicopter, Amarnath helicopter. Adventure flights, scenic tours. Best prices.",
  keywords: [
    "Helicopter Tours India",
    "Helicopter Yatra packages",
    "Kedarnath helicopter tour",
    "Vaishno Devi helicopter",
    "Amarnath helicopter tour",
    "Helicopter pilgrimage tours",
    "Char Dham helicopter packages",
    "Himalayan helicopter tours",
    "Helicopter sightseeing India",
    "Helicopter adventure tours",
    "Scenic helicopter flights",
    "Helicopter tour packages India",
    "Yatra by helicopter",
    "Helicopter pilgrimage India",
    "Best helicopter tours"
  ],
  openGraph: {
    title: "Helicopter Tours India - Helicopter Yatra & Adventure Tours",
    description: "Book Helicopter Tours India with My Quick Trippers. Helicopter Yatra packages, Kedarnath helicopter tours, Vaishno Devi helicopter, Amarnath helicopter.",
    url: `${siteConfig.domain}/campaigns/helicopter-tours-india`,
    siteName: siteConfig.name,
    type: "website",
    images: [
      {
        url: `${siteConfig.domain}/images/packages/helicopter-tour.jpg`,
        width: 1200,
        height: 630,
        alt: "Helicopter Tours India - Himalayan Helicopter Flights",
      },
    ],
  },
};

const helicopterPackages = () => {
  const allPackages = getPublicPackages();
  return allPackages.filter(pkg => 
    pkg.title.toLowerCase().includes('helicopter') ||
    pkg.title.toLowerCase().includes('yatra') ||
    pkg.title.toLowerCase().includes('kedarnath') ||
    pkg.title.toLowerCase().includes('vaishno devi') ||
    pkg.title.toLowerCase().includes('amarnath') ||
    pkg.category === 'Helicopter' ||
    pkg.category === 'Pilgrimage'
  ).slice(0, 12);
};

const helicopterDestinations = [
  { 
    name: "Kedarnath Helicopter", 
    description: "Sacred journey to Kedarnath Temple - skip the 16km trek", 
    duration: "15-20 min flight",
    altitude: "3,583m",
    highlights: ["Skip trekking", "Time-saving", "Scenic views"],
    image: "/images/packages/kedarnath-helicopter.jpg"
  },
  { 
    name: "Vaishno Devi Helicopter", 
    description: "Quick darshan at Mata Vaishno Devi - comfortable journey", 
    duration: "8-10 min flight",
    altitude: "1,400m",
    highlights: ["Skip 13km trek", "Senior friendly", "Quick darshan"],
    image: "/images/packages/vaishno-devi-helicopter.jpg"
  },
  { 
    name: "Amarnath Helicopter", 
    description: "Journey to holy Amarnath Cave - avoid difficult trek", 
    duration: "10-15 min flight",
    altitude: "3,888m",
    highlights: ["Safe pilgrimage", "Mountain views", "Time-efficient"],
    image: "/images/packages/amarnath-helicopter.jpg"
  },
  { 
    name: "Char Dham Helicopter", 
    description: "Complete Char Dham Yatra by helicopter - 4-5 days", 
    duration: "4-5 days total",
    altitude: "Various",
    highlights: ["Complete yatra", "Luxury travel", "Spiritual experience"],
    image: "/images/packages/char-dham-helicopter.jpg"
  },
  { 
    name: "Himalayan Sightseeing", 
    description: "Scenic helicopter tours over Himalayan peaks and valleys", 
    duration: "30-60 min flights",
    altitude: "Various",
    highlights: ["Panoramic views", "Photography", "Adventure"],
    image: "/images/packages/himalayan-helicopter.jpg"
  },
  { 
    name: "Ladakh Helicopter Tours", 
    description: "Explore remote Ladakh monasteries and lakes by air", 
    duration: "Custom tours",
    altitude: "3,500m+",
    highlights: ["Remote access", "Scenic beauty", "Cultural tours"],
    image: "/images/packages/ladakh-helicopter.jpg"
  },
];

const helicopterBenefits = [
  { icon: "⏰", title: "Time Saving", description: "Skip hours/days of trekking with quick helicopter flights" },
  { icon: "👴", title: "Senior Friendly", description: "Accessible pilgrimage for elderly and differently-abled devotees" },
  { icon: "🏔️", title: "Scenic Views", description: "Breathtaking aerial views of Himalayan landscapes" },
  { icon: "🛡️", title: "Safe Travel", description: "Avoid difficult terrain and weather-related trekking risks" },
  { icon: "🎯", title: "Direct Access", description: "Reach remote shrines and locations not accessible by road" },
  { icon: "💎", title: "Premium Experience", description: "Comfortable and luxurious pilgrimage experience" },
];

const helicopterTips = [
  "Book helicopter tickets well in advance, especially during peak pilgrimage seasons",
  "Check weather conditions before travel - flights are weather-dependent",
  "Carry valid ID proof and required documents for helicopter travel",
  "Arrive at helipad at least 1-2 hours before scheduled departure",
  "Pack light as there are strict weight limits for helicopter baggage",
  "Wear comfortable clothing and carry medications for high-altitude conditions",
  "Be prepared for last-minute schedule changes due to weather",
  "Choose morning flights for better weather conditions and clearer views",
];

const helicopterFaqs = [
  {
    question: "What are the benefits of helicopter pilgrimage tours?",
    answer: "Helicopter tours save significant time (hours/days of trekking reduced to minutes), are senior-friendly, provide safe access to remote shrines, offer breathtaking aerial views, and make pilgrimage accessible for differently-abled devotees. They're ideal for those with time constraints or physical limitations."
  },
  {
    question: "Which pilgrimage sites offer helicopter services in India?",
    answer: "Major helicopter pilgrimage services include Kedarnath (Uttarakhand), Vaishno Devi (Jammu & Kashmir), Amarnath (Jammu & Kashmir), Char Dham (Yamunotri, Gangotri, Kedarnath, Badrinath), and remote temples in Himachal Pradesh and Ladakh. Seasonal services are also available for other high-altitude shrines."
  },
  {
    question: "How much do helicopter pilgrimage tours cost?",
    answer: "Helicopter tour costs vary by destination and season. Kedarnath helicopter costs approximately ₹3,000-7,000 per person one-way, Vaishno Devi around ₹1,000-2,000, and complete Char Dham helicopter packages range from ₹1.5-3 lakhs per person. Prices are higher during peak seasons and include different service levels."
  },
  {
    question: "Are helicopter tours safe for pilgrimage?",
    answer: "Yes, helicopter tours are generally safe when operated by certified operators with experienced pilots. Services to major pilgrimage sites like Kedarnath and Vaishno Devi have good safety records. However, flights are weather-dependent and may be cancelled due to adverse conditions for passenger safety."
  },
  {
    question: "What is the booking process for helicopter pilgrimage tours?",
    answer: "Book through authorized operators or government websites (for some shrines). Provide required documents (ID proof, age certificate for senior concessions), make advance payment, and receive confirmed booking with schedule. Some shrines have online booking systems while others require manual booking through authorized agents."
  },
  {
    question: "What should I carry for helicopter pilgrimage tours?",
    answer: "Carry valid ID proof, booking confirmation, light baggage (within weight limits), comfortable clothing, medications, snacks, and water. Avoid heavy items as helicopters have strict weight restrictions. Dress in layers as temperatures vary significantly between altitudes."
  },
  {
    question: "Are helicopter tours suitable for families with children?",
    answer: "Yes, helicopter tours are family-friendly and children above 2 years usually require full tickets. However, consider altitude sickness for young children and elderly family members. Some operators have age restrictions or medical fitness requirements for high-altitude flights."
  },
  {
    question: "What happens if helicopter flights are cancelled due to weather?",
    answer: "Weather cancellations are common in mountainous regions. Most operators offer rescheduling for the next available flight or full refund if cancellation is extended. For important pilgrimages, consider keeping buffer days for weather delays or having backup trekking arrangements as contingency."
  },
];

export default function HelicopterToursIndiaPage() {
  const packages = helicopterPackages();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    "name": siteConfig.name,
    "description": "Best Helicopter Tours India - Helicopter Yatra packages, Kedarnath helicopter tours, Vaishno Devi helicopter, Amarnath helicopter",
    "url": `${siteConfig.domain}/campaigns/helicopter-tours-india`,
    "telephone": siteConfig.phone,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": siteConfig.address.street,
      "addressLocality": siteConfig.address.city,
      "addressRegion": siteConfig.address.state,
      "addressCountry": siteConfig.address.country
    },
    "priceRange": "$$$",
    "areaServed": ["Kedarnath", "Vaishno Devi", "Amarnath", "Char Dham", "Ladakh", "Himalayas"],
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Helicopter Tours India",
      "itemListElement": packages.map((pkg, index) => ({
        "@type": "Offer",
        "itemOffered": {
          "@type": "TouristTrip",
          "name": pkg.title,
          "description": pkg.description || `Experience ${pkg.title} with My Quick Trippers`,
          "touristType": ["Pilgrimage", "Adventure", "Luxury", "Senior Citizens"]
        },
        "position": index + 1
      }))
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      
      {/* Hero Section */}
      <section className="relative h-[400px] md:h-[500px] bg-gradient-to-r from-sky-900 to-sky-700 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/packages/helicopter-tour.jpg"
            alt="Helicopter Tours India - Himalayan Helicopter Flights"
            fill
            className="object-cover opacity-40"
            priority
          />
        </div>
        <div className="relative z-10 container mx-auto px-4 h-full flex items-center">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
              Helicopter Tours India
            </h1>
            <p className="text-xl md:text-2xl text-sky-100 mb-6">
              Divine Journeys from the Skies
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="#packages" className="bg-white hover:bg-gray-100 text-sky-900 px-6 py-3 rounded-lg font-semibold transition-colors">
                View Packages
              </Link>
              <Link href="#enquiry" className="bg-sky-500 hover:bg-sky-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
                Book Your Flight
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Helicopter Benefits */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <SectionHeader 
            title="Why Choose Helicopter Tours?" 
            subtitle="Experience pilgrimage and adventure with comfort, speed, and breathtaking aerial views"
          />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
            {helicopterBenefits.map((benefit, index) => (
              <div key={index} className="bg-sky-50 p-6 rounded-xl hover:shadow-lg transition-shadow">
                <div className="text-4xl mb-4">{benefit.icon}</div>
                <h3 className="text-xl font-bold text-sky-900 mb-2">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Helicopter Destinations */}
      <section className="py-16 bg-gradient-to-b from-sky-50 to-white">
        <div className="container mx-auto px-4">
          <SectionHeader 
            title="Popular Helicopter Destinations" 
            subtitle="Sacred shrines and scenic locations accessible by helicopter"
          />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            {helicopterDestinations.map((destination, index) => (
              <div key={index} className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                <div className="relative h-48">
                  <Image
                    src={destination.image}
                    alt={`${destination.name} - ${destination.description}`}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-2 right-2 bg-sky-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    {destination.duration}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-xl font-bold text-sky-900 mb-2">{destination.name}</h3>
                  <p className="text-gray-600 text-sm mb-2">{destination.description}</p>
                  <p className="text-gray-500 text-xs mb-3">Altitude: {destination.altitude}</p>
                  <div className="flex flex-wrap gap-2">
                    {destination.highlights.map((highlight, i) => (
                      <span key={i} className="bg-sky-100 text-sky-800 text-xs px-2 py-1 rounded-full">
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
            title="Helicopter Tour Packages" 
            subtitle="Choose from our premium helicopter pilgrimage and adventure tours"
          />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            {packages.map((pkg) => (
              <PackageCard key={pkg.slug} pkg={pkg} />
            ))}
          </div>
          {packages.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">No helicopter packages currently available. Check back soon!</p>
              <Link href="/packages" className="inline-block mt-4 text-sky-600 hover:text-sky-700 font-semibold">
                View All Pilgrimage Packages →
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Travel Tips */}
      <section className="py-16 bg-gradient-to-b from-sky-50 to-white">
        <div className="container mx-auto px-4">
          <SectionHeader 
            title="Essential Helicopter Tour Tips" 
            subtitle="Important guidelines for a safe and enjoyable helicopter journey"
          />
          <div className="max-w-4xl mx-auto mt-12">
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <ul className="space-y-4">
                {helicopterTips.map((tip, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="text-sky-600 text-xl">✓</span>
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
            subtitle="Everything you need to know about helicopter tours"
          />
          <div className="max-w-3xl mx-auto mt-12 space-y-6">
            {helicopterFaqs.map((faq, index) => (
              <details key={index} className="bg-sky-50 rounded-lg shadow-sm border border-sky-100">
                <summary className="px-6 py-4 cursor-pointer font-semibold text-sky-900 hover:bg-sky-100">
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
      <section id="enquiry" className="py-16 bg-sky-900">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-4">Book Your Helicopter Journey</h2>
            <p className="text-sky-100">
              Get a customized quote for helicopter pilgrimage or adventure tours. Our experts will help you plan the perfect aerial journey.
            </p>
          </div>
          <div className="max-w-xl mx-auto">
            <EnquiryForm destination="Helicopter Tour" />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 bg-sky-500">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Take Flight to Sacred Destinations
          </h2>
          <p className="text-sky-100 mb-6 max-w-2xl mx-auto">
            Book your helicopter tour today and experience divine journeys from the skies. Safe, comfortable, and time-efficient pilgrimage.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="tel:+918171158569" className="bg-white hover:bg-gray-100 text-sky-600 px-6 py-3 rounded-lg font-semibold transition-colors">
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
