import Link from 'next/link';
import { ChevronRight, MessageCircle, Phone, ShieldCheck } from 'lucide-react';

const WHATSAPP_REVIEW_URL =
  'https://wa.me/918171158569?text=' +
  encodeURIComponent(
    'Hi My Quick Trippers! I recently travelled with you and would like to share my review.'
  );

/**
 * Customer reviews — honest state.
 *
 * We removed a previously published review corpus because it was seed/sample
 * data, not verified traveller feedback. This page now states plainly how
 * reviews are collected and offers the real channel (WhatsApp) for travellers
 * to share theirs. No aggregateRating markup is emitted until genuine,
 * verifiable reviews exist.
 */
export default function ReviewsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-legacy-nav-blue text-white text-xs py-2 px-4">
        <div className="container mx-auto w-[95%] max-w-[1600px] flex items-center">
          <Link href="/" className="hover:text-legacy-orange transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3 h-3 mx-1 opacity-70" />
          <span className="text-legacy-orange">Customer Reviews</span>
        </div>
      </div>

      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-16 md:py-24">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Customer <span className="text-orange-500">Reviews</span>
          </h1>
          <p className="text-xl text-gray-300 mb-6">
            Honest reviews, from real travellers — nothing else.
          </p>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 text-left">
            <div className="flex items-start gap-3">
              <ShieldCheck className="w-6 h-6 text-orange-500 shrink-0 mt-1" />
              <div className="text-gray-300 text-sm md:text-base leading-relaxed">
                <p className="mb-3">
                  <span className="text-white font-semibold">
                    We removed the review counts previously shown on this page.
                  </span>{' '}
                  They were sample data, not feedback collected from verified
                  travellers — and we would rather show you nothing than
                  something we cannot stand behind.
                </p>
                <p>
                  From here, every review published on this page will come from
                  a real My Quick Trippers traveller, collected after their
                  trip, with the destination and travel month shown.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-5xl mx-auto px-4 py-12 md:py-16">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-10">
          How reviews work from here
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              step: '1',
              title: 'Travel with us',
              body: 'Book any package or custom trip with My Quick Trippers.',
            },
            {
              step: '2',
              title: 'We ask after your trip',
              body: 'Our team follows up for your honest feedback — good or bad.',
            },
            {
              step: '3',
              title: 'Verified reviews go live',
              body: 'Only feedback from confirmed bookings is published, with trip details.',
            },
          ].map((s) => (
            <div
              key={s.step}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6"
            >
              <div className="w-10 h-10 rounded-full bg-orange-500 text-white font-bold flex items-center justify-center mb-4">
                {s.step}
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{s.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-3xl mx-auto px-4 pb-16 md:pb-24 text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
          Travelled with us recently?
        </h2>
        <p className="text-gray-600 mb-8">
          Share your experience — it helps fellow travellers choose with
          confidence, and it helps us improve.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <a
            href={WHATSAPP_REVIEW_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-semibold transition-colors"
          >
            <MessageCircle className="w-5 h-5" />
            Share your review on WhatsApp
          </a>
          <a
            href="tel:+918171158569"
            className="flex items-center gap-2 px-8 py-3 border border-gray-300 hover:bg-gray-100 text-gray-900 rounded-xl font-semibold transition-colors"
          >
            <Phone className="w-5 h-5" />
            +91 81711 58569
          </a>
        </div>
        <p className="text-xs text-gray-500 mt-6">
          By sharing, you agree we may publish your first name, destination and
          travel month alongside your review.
        </p>
      </section>
    </div>
  );
}
