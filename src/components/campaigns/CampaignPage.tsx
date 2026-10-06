import Link from "next/link";
import Image from "next/image";
import { siteConfig } from "@/data/siteConfig";
import PackageCard from "@/components/ui/PackageCard";
import EnquiryForm from "@/components/forms/EnquiryForm";
import SectionHeader from "@/components/ui/SectionHeader";
import { safeJsonLd } from "@/utils/jsonLd";
import {
  getCampaignPackages,
  type CampaignConfig,
  type CampaignDestination,
  type CampaignTheme,
} from "@/data/campaignConfigs";

/**
 * Theme class maps use complete literal Tailwind class strings so the
 * compiler can detect them. Never interpolate a theme token into a class.
 */
const THEMES: Record<
  CampaignTheme,
  {
    pageBg: string;
    heroGradient: string;
    heroSubText: string;
    benefitCard: string;
    benefitTitle: string;
    destTitle: string;
    badge: string;
    significance: string;
    metaLineColored: string;
    chip: string;
    faqCard: string;
    faqSummary: string;
    tipsBullet: string;
    emptyLink: string;
    enquiryBg: string;
    enquiryText: string;
  }
> = {
  amber: {
    pageBg: "bg-gradient-to-b from-amber-50 to-white",
    heroGradient: "bg-gradient-to-r from-amber-900 to-amber-700",
    heroSubText: "text-amber-100",
    benefitCard: "bg-amber-50 p-6 rounded-xl hover:shadow-lg transition-shadow",
    benefitTitle: "text-amber-900",
    destTitle: "text-amber-900",
    badge: "bg-amber-600",
    significance: "text-amber-700",
    metaLineColored: "text-amber-700 text-xs",
    chip: "bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-full",
    faqCard: "bg-amber-50 rounded-lg shadow-sm border border-amber-100",
    faqSummary: "px-6 py-4 cursor-pointer font-semibold text-amber-900 hover:bg-amber-100",
    tipsBullet: "text-amber-600",
    emptyLink: "inline-block mt-4 text-amber-600 hover:text-amber-700 font-semibold",
    enquiryBg: "bg-amber-900",
    enquiryText: "text-amber-100",
  },
  orange: {
    pageBg: "bg-gradient-to-b from-orange-50 to-white",
    heroGradient: "bg-gradient-to-r from-orange-900 to-orange-700",
    heroSubText: "text-orange-100",
    benefitCard: "bg-orange-50 p-6 rounded-xl hover:shadow-lg transition-shadow",
    benefitTitle: "text-orange-900",
    destTitle: "text-orange-900",
    badge: "bg-orange-600",
    significance: "text-orange-700",
    metaLineColored: "text-orange-700 text-xs",
    chip: "bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full",
    faqCard: "bg-orange-50 rounded-lg shadow-sm border border-orange-100",
    faqSummary: "px-6 py-4 cursor-pointer font-semibold text-orange-900 hover:bg-orange-100",
    tipsBullet: "text-orange-600",
    emptyLink: "inline-block mt-4 text-orange-600 hover:text-orange-700 font-semibold",
    enquiryBg: "bg-orange-900",
    enquiryText: "text-orange-100",
  },
  blue: {
    pageBg: "bg-gradient-to-b from-blue-50 to-white",
    heroGradient: "bg-gradient-to-r from-blue-900 to-blue-700",
    heroSubText: "text-blue-100",
    benefitCard: "bg-blue-50 p-6 rounded-xl hover:shadow-lg transition-shadow",
    benefitTitle: "text-blue-900",
    destTitle: "text-blue-900",
    badge: "bg-blue-600",
    significance: "text-blue-700",
    metaLineColored: "text-blue-700 text-xs",
    chip: "bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full",
    faqCard: "bg-blue-50 rounded-lg shadow-sm border border-blue-100",
    faqSummary: "px-6 py-4 cursor-pointer font-semibold text-blue-900 hover:bg-blue-100",
    tipsBullet: "text-blue-600",
    emptyLink: "inline-block mt-4 text-blue-600 hover:text-blue-700 font-semibold",
    enquiryBg: "bg-blue-900",
    enquiryText: "text-blue-100",
  },
  sky: {
    pageBg: "bg-gradient-to-b from-sky-50 to-white",
    heroGradient: "bg-gradient-to-r from-sky-900 to-sky-700",
    heroSubText: "text-sky-100",
    benefitCard: "bg-sky-50 p-6 rounded-xl hover:shadow-lg transition-shadow",
    benefitTitle: "text-sky-900",
    destTitle: "text-sky-900",
    badge: "bg-sky-600",
    significance: "text-sky-700",
    metaLineColored: "text-sky-700 text-xs",
    chip: "bg-sky-100 text-sky-800 text-xs px-2 py-1 rounded-full",
    faqCard: "bg-sky-50 rounded-lg shadow-sm border border-sky-100",
    faqSummary: "px-6 py-4 cursor-pointer font-semibold text-sky-900 hover:bg-sky-100",
    tipsBullet: "text-sky-600",
    emptyLink: "inline-block mt-4 text-sky-600 hover:text-sky-700 font-semibold",
    enquiryBg: "bg-sky-900",
    enquiryText: "text-sky-100",
  },
  green: {
    pageBg: "bg-gradient-to-b from-green-50 to-white",
    heroGradient: "bg-gradient-to-r from-green-900 to-green-700",
    heroSubText: "text-green-100",
    benefitCard: "bg-green-50 p-6 rounded-xl hover:shadow-lg transition-shadow",
    benefitTitle: "text-green-900",
    destTitle: "text-green-900",
    badge: "bg-green-600",
    significance: "text-green-700",
    metaLineColored: "text-green-700 text-xs",
    chip: "bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full",
    faqCard: "bg-white rounded-lg shadow-sm border border-green-100",
    faqSummary: "px-6 py-4 cursor-pointer font-semibold text-green-900 hover:bg-green-50",
    tipsBullet: "text-green-600",
    emptyLink: "inline-block mt-4 text-green-600 hover:text-green-700 font-semibold",
    enquiryBg: "bg-green-900",
    enquiryText: "text-green-100",
  },
  teal: {
    pageBg: "bg-gradient-to-b from-teal-50 to-white",
    heroGradient: "bg-gradient-to-r from-teal-900 to-teal-700",
    heroSubText: "text-teal-100",
    benefitCard: "bg-teal-50 p-6 rounded-xl hover:shadow-lg transition-shadow",
    benefitTitle: "text-teal-900",
    destTitle: "text-teal-900",
    badge: "bg-teal-600",
    significance: "text-teal-700",
    metaLineColored: "text-teal-700 text-xs",
    chip: "bg-teal-100 text-teal-800 text-xs px-2 py-1 rounded-full",
    faqCard: "bg-teal-50 rounded-lg shadow-sm border border-teal-100",
    faqSummary: "px-6 py-4 cursor-pointer font-semibold text-teal-900 hover:bg-teal-100",
    tipsBullet: "text-teal-600",
    emptyLink: "inline-block mt-4 text-teal-600 hover:text-teal-700 font-semibold",
    enquiryBg: "bg-teal-900",
    enquiryText: "text-teal-100",
  },
  pink: {
    pageBg: "bg-gradient-to-b from-pink-50 to-white",
    heroGradient: "bg-gradient-to-r from-pink-900 to-pink-700",
    heroSubText: "text-pink-100",
    benefitCard: "bg-pink-50 p-6 rounded-xl hover:shadow-lg transition-shadow",
    benefitTitle: "text-pink-900",
    destTitle: "text-pink-900",
    badge: "bg-pink-600",
    significance: "text-pink-700",
    metaLineColored: "text-pink-700 text-xs",
    chip: "bg-pink-100 text-pink-800 text-xs px-2 py-1 rounded-full",
    faqCard: "bg-pink-50 rounded-lg shadow-sm border border-pink-100",
    faqSummary: "px-6 py-4 cursor-pointer font-semibold text-pink-900 hover:bg-pink-100",
    tipsBullet: "text-pink-600",
    emptyLink: "inline-block mt-4 text-pink-600 hover:text-pink-700 font-semibold",
    enquiryBg: "bg-pink-900",
    enquiryText: "text-pink-100",
  },
};

const WHATSAPP_BUTTON_CLASS =
  "bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors";

function DestinationCard({
  item,
  theme,
}: {
  item: CampaignDestination;
  theme: (typeof THEMES)[CampaignTheme];
}) {
  const hasMore =
    Boolean(item.location) ||
    Boolean(item.metaLine) ||
    Boolean(item.significance) ||
    Boolean(item.chips);
  const descClass = `text-gray-600 text-sm${hasMore ? ` ${item.descriptionMb || "mb-2"}` : ""}`;
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
      <div className="relative h-48">
        <Image
          src={item.image}
          alt={`${item.name} - ${item.description}`}
          fill
          className="object-cover"
        />
        {item.badge && (
          <div
            className={`absolute top-2 right-2 ${theme.badge} text-white px-3 py-1 rounded-full text-sm font-semibold`}
          >
            {item.badge}
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className={`text-xl font-bold ${theme.destTitle} mb-2`}>{item.name}</h3>
        <p className={descClass}>{item.description}</p>
        {item.location && (
          <p className="text-gray-500 text-xs mb-2">📍 {item.location}</p>
        )}
        {item.metaLine && (
          <p className={item.metaLineGray ? "text-gray-500 text-xs mb-3" : theme.metaLineColored}>
            {item.metaLine}
          </p>
        )}
        {item.significance && (
          <p className={`${theme.significance} text-sm font-medium`}>{item.significance}</p>
        )}
        {item.chips && (
          <div className="flex flex-wrap gap-2">
            {item.chips.map((chip, i) => (
              <span key={i} className={theme.chip}>
                {chip}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function DestinationOverlayLink({ item }: { item: CampaignDestination }) {
  // Never derive the slug from the display name: name edits (or punctuation)
  // would silently create dead links. Explicit slugs live in campaignConfigs.
  const slug = item.slug ?? item.name.toLowerCase().replace(/\s+/g, "-");
  return (
    <Link
      href={`/destinations/${slug}`}
      className="group relative h-64 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
    >
      <Image
        src={item.image}
        alt={`${item.name} - ${item.description}`}
        fill
        className="object-cover group-hover:scale-105 transition-transform duration-300"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <h3 className="text-xl font-bold text-white">{item.name}</h3>
        <p className="text-gray-200 text-sm">{item.description}</p>
      </div>
    </Link>
  );
}

export default function CampaignPage({ config }: { config: CampaignConfig }) {
  const theme = THEMES[config.theme];
  const packages = getCampaignPackages(config);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    name: siteConfig.name,
    description: config.jsonLd.description,
    url: `${siteConfig.domain}/campaigns/${config.slug}`,
    telephone: siteConfig.phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: siteConfig.address.street,
      addressLocality: siteConfig.address.city,
      addressRegion: siteConfig.address.state,
      addressCountry: siteConfig.address.country,
    },
    priceRange: config.jsonLd.priceRange,
    areaServed: config.jsonLd.areaServed,
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: config.jsonLd.catalogName,
      itemListElement: packages.map((pkg, index) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "TouristTrip",
          name: pkg.title,
          description: pkg.description || `Experience ${pkg.title} with My Quick Trippers`,
          touristType: config.jsonLd.touristType,
        },
        position: index + 1,
      })),
    },
  };

  const benefitsSection = (sectionBg: string) => (
    <section className={`py-16 ${sectionBg}`}>
      <div className="container mx-auto px-4">
        <SectionHeader title={config.benefits.title} subtitle={config.benefits.subtitle} />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          {config.benefits.items.map((item, index) => (
            <div key={index} className={config.benefits.cardClassName || theme.benefitCard}>
              <div className="text-4xl mb-4">{item.icon}</div>
              <h3 className={`text-xl font-bold ${theme.benefitTitle} mb-2`}>{item.title}</h3>
              <p className="text-gray-600">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );

  const destinationsSection = (sectionBg: string) => (
    <section className={`py-16 ${sectionBg}`}>
      <div className="container mx-auto px-4">
        <SectionHeader
          title={config.destinations.title}
          subtitle={config.destinations.subtitle}
        />
        <div className={config.destinations.gridClassName || "grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12"}>
          {config.destinations.items.map((item, index) =>
            config.destinations.overlayLinks ? (
              <DestinationOverlayLink key={index} item={item} />
            ) : (
              <DestinationCard key={index} item={item} theme={theme} />
            )
          )}
        </div>
      </div>
    </section>
  );

  const tipsSection = config.tips ? (
    <section className={`py-16 ${theme.pageBg}`}>
      <div className="container mx-auto px-4">
        <SectionHeader title={config.tips.title} subtitle={config.tips.subtitle} />
        <div className="max-w-4xl mx-auto mt-12">
          <div className="bg-white rounded-xl p-8 shadow-lg">
            <ul className="space-y-4">
              {config.tips.items.map((tip, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className={`${theme.tipsBullet} text-xl`}>{config.tips!.bullet}</span>
                  <span className="text-gray-700">{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  ) : null;

  return (
    <div className={`min-h-screen ${theme.pageBg}`}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }}
      />

      {/* Hero Section */}
      <section className={`relative h-[400px] md:h-[500px] ${theme.heroGradient} overflow-hidden`}>
        <div className="absolute inset-0">
          <Image
            src={config.heroImage}
            alt={config.heroImageAlt}
            fill
            className="object-cover opacity-40"
            priority
          />
        </div>
        <div className="relative z-10 container mx-auto px-4 h-full flex items-center">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
              {config.heroTitle}
            </h1>
            <p className={`text-xl md:text-2xl ${theme.heroSubText} mb-6`}>
              {config.heroSubtitle}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="#packages" className={config.heroPrimaryBtn.className}>
                {config.heroPrimaryBtn.text}
              </Link>
              <Link href="#enquiry" className={config.heroSecondaryBtn.className}>
                {config.heroSecondaryBtn.text}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {config.destinations.first
        ? destinationsSection("bg-white")
        : benefitsSection("bg-white")}

      {config.destinations.first
        ? benefitsSection(theme.pageBg)
        : destinationsSection(theme.pageBg)}

      {/* Tour Packages */}
      <section id="packages" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <SectionHeader
            title={config.packages.title}
            subtitle={config.packages.subtitle}
          />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            {packages.map((pkg) => (
              <PackageCard key={pkg.slug} pkg={pkg} />
            ))}
          </div>
          {packages.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">{config.packages.emptyText}</p>
              <Link href="/packages" className={theme.emptyLink}>
                {config.packages.emptyLinkText}
              </Link>
            </div>
          )}
        </div>
      </section>

      {tipsSection}

      {/* FAQ Section */}
      <section className={`py-16 ${config.tips ? "bg-white" : theme.pageBg}`}>
        <div className="container mx-auto px-4">
          <SectionHeader
            title="Frequently Asked Questions"
            subtitle={config.faqSubtitle}
          />
          <div className="max-w-3xl mx-auto mt-12 space-y-6">
            {config.faqs.map((faq, index) => (
              <details key={index} className={theme.faqCard}>
                <summary className={theme.faqSummary}>{faq.question}</summary>
                <div className="px-6 pb-4 text-gray-600">{faq.answer}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Enquiry Form */}
      <section id="enquiry" className={`py-16 ${theme.enquiryBg}`}>
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-4">{config.enquiry.title}</h2>
            <p className={theme.enquiryText}>{config.enquiry.subtitle}</p>
          </div>
          <div className="max-w-xl mx-auto">
            <EnquiryForm destination={config.enquiry.destination} />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={config.cta.sectionClassName}>
        <div className="container mx-auto px-4 text-center">
          <h2 className={config.cta.titleClassName}>{config.cta.title}</h2>
          <p className={config.cta.textClassName}>{config.cta.text}</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="tel:+918171158569" className={config.cta.callButtonClassName}>
              Call: +91-8171158569
            </Link>
            <Link href="https://wa.me/918171158569" className={WHATSAPP_BUTTON_CLASS}>
              WhatsApp Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
