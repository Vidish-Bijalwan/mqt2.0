import Link from "next/link";
import { siteConfig } from "@/data/siteConfig";
import { FileText, Calendar, Phone, Mail } from "lucide-react";

export interface LegalSection {
  title: string;
  body: string[];
}

interface LegalPageProps {
  title: string;
  subtitle: string;
  effectiveDate: string;
  sections: LegalSection[];
}

/**
 * Shared layout for legal pages (Privacy Policy, Terms & Conditions).
 * Renders a breadcrumb, a hero header, and numbered sections with
 * a sticky in-page nav on desktop.
 */
export default function LegalPage({ title, subtitle, effectiveDate, sections }: LegalPageProps) {
  return (
    <div className="bg-gray-50 min-h-screen pb-16">
      {/* Breadcrumb */}
      <div className="bg-brand-navy text-white text-xs py-2 px-4">
        <div className="container mx-auto w-full max-w-[1920px] px-2 md:px-4">
          <Link href="/" className="hover:text-brand-orange transition-colors">
            Home
          </Link>
          {" » "}
          <span className="text-brand-orange">{title}</span>
        </div>
      </div>

      {/* Hero */}
      <div className="bg-brand-navy text-white">
        <div className="container mx-auto px-4 w-full max-w-[1920px] px-2 md:px-4 py-10">
          <div className="flex items-start gap-4">
            <div className="hidden sm:flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-brand-orange/15 text-brand-orange">
              <FileText className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl md:text-4xl font-bold">{title}</h1>
              <p className="mt-2 max-w-3xl text-sm md:text-base text-gray-300">{subtitle}</p>
              <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-gray-300">
                <span className="inline-flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-brand-orange" />
                  Effective Date: {effectiveDate}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5 text-brand-orange" />
                  {siteConfig.phone}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5 text-brand-orange" />
                  {siteConfig.email}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 w-full max-w-[1920px] px-2 md:px-4 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-8">
          {/* Sticky in-page nav */}
          <aside className="hidden lg:block">
            <nav className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden sticky top-24">
              <div className="bg-brand-navy text-white px-4 py-3 text-sm font-bold">On this page</div>
              <ul className="py-2 max-h-[60vh] overflow-y-auto">
                {sections.map((section, idx) => (
                  <li key={idx}>
                    <a
                      href={`#section-${idx + 1}`}
                      className="block px-4 py-2 text-[13px] border-b border-gray-100 last:border-0 text-gray-600 hover:text-brand-orange hover:bg-orange-50 transition-colors"
                    >
                      {idx + 1}. {section.title}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>

          {/* Content */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 md:p-10">
            {sections.map((section, idx) => (
              <section key={idx} id={`section-${idx + 1}`} className="mb-8 last:mb-0 scroll-mt-24">
                <h2 className="flex items-start gap-3 text-lg md:text-xl font-bold text-brand-navy mb-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-orange text-white text-xs font-bold mt-0.5">
                    {idx + 1}
                  </span>
                  {section.title}
                </h2>
                <div className="space-y-3 ml-0 md:ml-10">
                  {section.body.map((para, pidx) => (
                    <p key={pidx} className="text-gray-700 leading-relaxed text-[15px]">
                      {para}
                    </p>
                  ))}
                </div>
              </section>
            ))}

            {/* Contact footer card */}
            <div className="mt-10 rounded-lg bg-brand-orange-light border border-brand-orange/20 p-6">
              <h3 className="font-bold text-brand-navy mb-2">Questions about this policy?</h3>
              <p className="text-sm text-gray-700 mb-4">
                We&apos;re happy to clarify any part of this document. Reach out to our team — we usually respond within one business day.
              </p>
              <div className="flex flex-wrap gap-3">
                <a
                  href={`tel:${siteConfig.phoneRaw}`}
                  className="inline-flex items-center gap-2 rounded-md bg-brand-orange hover:bg-brand-orange-dark text-white text-sm font-semibold px-4 py-2.5 transition-colors"
                >
                  <Phone className="h-4 w-4" /> {siteConfig.phone}
                </a>
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="inline-flex items-center gap-2 rounded-md bg-white border border-brand-navy/20 hover:border-brand-orange hover:text-brand-orange text-brand-navy text-sm font-semibold px-4 py-2.5 transition-colors"
                >
                  <Mail className="h-4 w-4" /> {siteConfig.email}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
