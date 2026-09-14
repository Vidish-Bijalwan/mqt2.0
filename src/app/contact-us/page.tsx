import type { Metadata } from 'next';
import { Mail, Phone, MapPin, Clock, MessageCircle } from 'lucide-react';
import EnquiryForm from '@/components/forms/EnquiryForm';
import { siteConfig } from '@/data/siteConfig';

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with My Quick Trippers for tour packages, bookings, and travel queries. Call us at +91-8171158569 or visit our Delhi office.',
};

const offices = [
  {
    title: 'Head Office',
    address: siteConfig.offices.head,
    hours: 'Mon - Sat: 10:00 AM - 7:00 PM',
  },
  {
    title: 'Office Locations',
    address: siteConfig.offices.branches.join(' | '),
    hours: 'Mon - Sat: 10:00 AM - 6:00 PM',
  },
];

export default function ContactUsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-r from-slate-900 to-slate-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Contact <span className="text-legacy-orange">Us</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Have questions about a tour package? Need help planning your trip? We&apos;re here to help!
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left: Contact Form */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Send Us a Message</h2>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <EnquiryForm />
            </div>
          </div>

          {/* Right: Contact Info */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Get in Touch</h2>

            {/* Quick Contact Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <a
                href={`tel:${siteConfig.phoneRaw}`}
                className="flex items-center gap-4 bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center shrink-0">
                  <Phone className="w-6 h-6 text-legacy-orange" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Call Us</p>
                  <p className="text-sm text-gray-600">{siteConfig.phone}</p>
                </div>
              </a>

              <a
                href={`mailto:${siteConfig.email}`}
                className="flex items-center gap-4 bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                  <Mail className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Email Us</p>
                  <p className="text-sm text-gray-600">{siteConfig.email}</p>
                </div>
              </a>

              <a
                href={siteConfig.social.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                  <MessageCircle className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">WhatsApp</p>
                  <p className="text-sm text-gray-600">Chat with us</p>
                </div>
              </a>

              <div className="flex items-center gap-4 bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center shrink-0">
                  <Clock className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Working Hours</p>
                  <p className="text-sm text-gray-600">Mon - Sat: 10AM - 7PM</p>
                </div>
              </div>
            </div>

            {/* Office Addresses */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Our Offices</h3>
              {offices.map((office) => (
                <div key={office.title} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-legacy-orange shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-gray-900">{office.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">{office.address}</p>
                      <p className="text-sm text-gray-500 mt-1">{office.hours}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
