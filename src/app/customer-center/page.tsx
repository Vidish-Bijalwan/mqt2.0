import Link from "next/link";
import { siteConfig } from "@/data/siteConfig";
import { Phone, Mail, MessageCircle, ChevronRight } from "lucide-react";

export const metadata = {
  title: "Customer Center | My Quick Trippers",
  description:
    "Need help with booking, payments, or your trip? Contact My Quick Trippers customer support by phone, email, or WhatsApp.",
};

const QUICK_LINKS = [
  { name: "About Us", href: "/about-us" },
  { name: "Contact Us", href: "/contact-us" },
  { name: "Careers", href: "/careers" },
  { name: "Write A Review", href: "/reviews" },
  { name: "Pay Online", href: "/pay-online" },
  { name: "My Booking", href: "/my-booking" },
  { name: "Privacy Policy", href: "/privacy-policy" },
  { name: "Terms & Conditions", href: "/terms-and-conditions" },
  { name: "Site Map", href: "/site-map" },
];

export default function CustomerCenterPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CustomerService',
    name: 'My Quick Trippers Customer Center',
    url: 'https://www.myquicktrippers.com/customer-center',
    telephone: '+91-8171158569',
    email: 'info@myquicktrippers.com',
    hoursAvailable: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      opens: '10:00',
      closes: '19:00',
    },
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {/* Breadcrumb */}
      <div className="bg-legacy-nav-blue text-white text-xs py-2 px-4">
        <div className="container mx-auto w-[95%] max-w-[1600px] flex items-center">
          <Link href="/" className="hover:text-legacy-orange transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3 h-3 mx-1 opacity-70" />
          <span className="text-legacy-orange">Customer Center</span>
        </div>
      </div>

      {/* Header */}
      <div className="bg-white border-b border-gray-200 py-8 mb-8">
        <div className="container mx-auto w-[95%] max-w-[1600px]">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Customer Center</h1>
          <p className="text-gray-600 max-w-3xl">
            Request a quote, or just chat about your next vacation. We&apos;re always happy to help!
          </p>
        </div>
      </div>

      <div className="container mx-auto w-[95%] max-w-[1200px]">
        {/* Contact Channels */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white rounded border border-gray-200 shadow-sm p-6">
            <div className="w-12 h-12 bg-orange-50 text-legacy-orange rounded-full flex items-center justify-center mb-4">
              <Phone className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-gray-800 mb-1">Call Us</h2>
            <p className="text-gray-500 text-sm mb-3">Our support team is available during business hours.</p>
            <a href={`tel:${siteConfig.phoneRaw}`} className="text-legacy-orange font-bold hover:underline">
              {siteConfig.phone}
            </a>
          </div>

          <div className="bg-white rounded border border-gray-200 shadow-sm p-6">
            <div className="w-12 h-12 bg-orange-50 text-legacy-orange rounded-full flex items-center justify-center mb-4">
              <Mail className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-gray-800 mb-1">Email Us</h2>
            <p className="text-gray-500 text-sm mb-3">Send us your query and we&apos;ll get back to you shortly.</p>
            <a href={`mailto:${siteConfig.email}`} className="text-legacy-orange font-bold hover:underline break-all">
              {siteConfig.email}
            </a>
          </div>

          <div className="bg-white rounded border border-gray-200 shadow-sm p-6">
            <div className="w-12 h-12 bg-orange-50 text-legacy-orange rounded-full flex items-center justify-center mb-4">
              <MessageCircle className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-gray-800 mb-1">WhatsApp</h2>
            <p className="text-gray-500 text-sm mb-3">Chat with us directly for instant assistance.</p>
            <a
              href={siteConfig.social.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="text-legacy-orange font-bold hover:underline"
            >
              Chat on WhatsApp
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="bg-white rounded border border-gray-200 shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Helpful Resources</h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-2">
            {QUICK_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="flex items-center text-gray-600 hover:text-legacy-orange transition-colors py-1">
                  <span className="text-legacy-orange mr-2 text-[10px]">★</span>
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
