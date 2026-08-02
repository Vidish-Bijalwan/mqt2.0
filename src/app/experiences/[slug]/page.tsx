import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ChevronRight, CalendarDays, Users, CheckCircle2, ArrowRight, Phone, MessageCircle } from "lucide-react";
import { siteConfig } from "@/data/siteConfig";
import { allPackages } from "@/data/allPackages";
import { experiences, getExperienceBySlug, experienceGroups } from "@/data/experiencesData";
import { experiencesWithCounts, matchPackages } from "@/utils/experienceCounts";
import PackageListWithMore from "@/components/experiences/PackageListWithMore";
import EnquiryForm from "@/components/forms/EnquiryForm";

interface Params {
  params: Promise<{ slug: string }>;
}

/* Match real packages to this experience via the shared matcher — the SAME
   function used for card counts, so the page listing always reconciles with
   the "N Packages" shown on the explorer cards. */
function packagesForExperience(slug: string) {
  const exp = getExperienceBySlug(slug);
  if (!exp) return [];
  const matched = matchPackages(allPackages, exp);
  // Title-exact matches first
  matched.sort((a, b) => {
    const aExact = a.title.toLowerCase().includes(exp.name.toLowerCase()) ? 1 : 0;
    const bExact = b.title.toLowerCase().includes(exp.name.toLowerCase()) ? 1 : 0;
    return bExact - aExact;
  });
  return matched;
}

export function generateStaticParams() {
  return experiences.map((exp) => ({ slug: exp.slug }));
}

export async function generateMetadata({ params }: Params) {
  const { slug } = await params;
  const exp = getExperienceBySlug(slug);
  if (!exp) return { title: "Experience | My Quick Trippers" };

  return {
    title: `${exp.name} in India | Packages & Tours | My Quick Trippers`,
    description: exp.description,
    alternates: { canonical: `${siteConfig.domain}/experiences/${exp.slug}` },
    openGraph: {
      title: `${exp.name} in India | My Quick Trippers`,
      description: exp.description,
      url: `${siteConfig.domain}/experiences/${exp.slug}`,
      type: "website",
      images: [{ url: `${siteConfig.domain}${exp.image}`, width: 1200, height: 630, alt: exp.name }],
    },
  };
}

export default async function ExperiencePage({ params }: Params) {
  const { slug } = await params;
  const exp = getExperienceBySlug(slug);
  if (!exp) notFound();

  const packages = packagesForExperience(slug);
  const allItems = experiencesWithCounts();
  const related = allItems
    .filter((e) => e.slug !== exp.slug && e.group === exp.group)
    .slice(0, 4);
  const otherGroups = experienceGroups.filter((g) => g !== exp.group).slice(0, 4);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${siteConfig.domain}/` },
          { "@type": "ListItem", position: 2, name: "Experiences", item: `${siteConfig.domain}/experiences` },
          { "@type": "ListItem", position: 3, name: exp.name, item: `${siteConfig.domain}/experiences/${exp.slug}` },
        ],
      },
      {
        "@type": "TouristAttraction",
        name: `${exp.name} in India`,
        description: exp.description,
        url: `${siteConfig.domain}/experiences/${exp.slug}`,
        image: `${siteConfig.domain}${exp.image}`,
      },
      {
        "@type": "FAQPage",
        mainEntity: exp.faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="bg-gray-50 min-h-screen pb-16">
        {/* Breadcrumb */}
        <div className="bg-white border-b border-gray-200 text-gray-600 text-[13px] py-2 px-4 shadow-sm">
          <div className="container mx-auto w-full max-w-[1600px] px-2 md:px-4 flex items-center">
            <Link href="/" className="font-semibold hover:text-legacy-orange">Home</Link>
            <ChevronRight className="w-3 h-3 mx-1" />
            <Link href="/experiences" className="font-semibold hover:text-legacy-orange">Experiences</Link>
            <ChevronRight className="w-3 h-3 mx-1" />
            <span className="capitalize">{exp.name}</span>
          </div>
        </div>

        {/* Hero banner */}
        <div className="relative h-[280px] md:h-[340px] w-full">
          <Image src={exp.image} alt={exp.name} fill sizes="100vw" className="object-cover" priority />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" aria-hidden="true" />
          <div className="absolute inset-0 flex flex-col justify-end p-4 md:p-10">
            <div className="container mx-auto w-full max-w-[1600px]">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-300">{exp.group} Experiences</p>
              <h1 className="mt-2 text-3xl md:text-5xl font-extrabold text-white">{exp.name} in India</h1>
              <p className="mt-3 max-w-2xl text-sm md:text-base text-gray-200">{exp.tagline}.</p>
              <div className="mt-4 flex flex-wrap gap-3 text-xs font-semibold text-white">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 backdrop-blur-md ring-1 ring-white/25">
                  <CalendarDays className="h-3.5 w-3.5 text-amber-300" aria-hidden="true" />
                  {exp.bestSeason}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 backdrop-blur-md ring-1 ring-white/25">
                  <Users className="h-3.5 w-3.5 text-amber-300" aria-hidden="true" />
                  {exp.idealFor}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto w-full max-w-[1600px] px-2 md:px-4 mt-10">
          {/* Intro / SEO description */}
          <div className="max-w-3xl">
            <h2 className="text-2xl font-bold text-gray-900">Explore {exp.name} Tours</h2>
            <p className="mt-3 text-gray-600 leading-relaxed">{exp.description}</p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2 text-sm">
              <div className="flex items-start gap-2">
                <CalendarDays className="mt-0.5 h-4 w-4 shrink-0 text-brand-orange" aria-hidden="true" />
                <div>
                  <p className="font-semibold text-gray-900">Best Season</p>
                  <p className="text-gray-600">{exp.bestSeason}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Users className="mt-0.5 h-4 w-4 shrink-0 text-brand-orange" aria-hidden="true" />
                <div>
                  <p className="font-semibold text-gray-900">Ideal For</p>
                  <p className="text-gray-600">{exp.idealFor}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Main 2-column layout */}
          <div className="mt-10 flex flex-col lg:flex-row gap-8">
            {/* Left: package listing */}
            <div className="w-full lg:w-3/4">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">
                  {packages.length > 0 ? `${packages.length} ` : ""}Packages
                  {packages.length > 0 ? `for ${exp.name}` : ""}
                </h2>
              </div>

              {packages.length > 0 ? (
                <PackageListWithMore packages={packages} />
              ) : (
                <div className="rounded-card border border-dashed border-gray-300 bg-white py-14 text-center">
                  <p className="text-lg font-semibold text-gray-700">
                    No dedicated packages listed yet for {exp.name}
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    Tell us what you have in mind and our experts will build a custom itinerary for you.
                  </p>
                  <Link
                    href="#enquiry"
                    className="mt-5 inline-flex items-center gap-2 rounded-full bg-brand-orange px-6 py-2.5 text-sm font-bold text-white transition-colors hover:bg-brand-orange-dark"
                  >
                    Request a Custom Quote
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </div>
              )}
            </div>

            {/* Right: sticky sidebar */}
            <div className="w-full lg:w-1/4 shrink-0">
              <div id="enquiry" className="lg:sticky lg:top-6 space-y-6">
                <EnquiryForm pkgName={`${exp.name} Tours`} />

                {/* Why book with us */}
                <div className="rounded-card border border-gray-200 bg-white p-5 shadow-card-soft">
                  <h3 className="text-base font-bold text-gray-900 mb-3">Why Book With Us</h3>
                  <ul className="space-y-2.5 text-sm text-gray-600">
                    {["Govt. approved & ISO 9001 certified", "Customizable itineraries, 24×7 support", "Best price guarantee & transparent billing", "Trusted by 10,000+ happy travellers"].map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-green" aria-hidden="true" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-4 space-y-2">
                    <a href="tel:+918171158569" className="flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-brand-orange">
                      <Phone className="h-4 w-4 text-brand-orange" aria-hidden="true" /> +91-8171158569
                    </a>
                    <a href="https://wa.me/918171158569" className="flex items-center gap-2 text-sm font-semibold text-green-600 hover:text-green-700">
                      <MessageCircle className="h-4 w-4" aria-hidden="true" /> Chat on WhatsApp
                    </a>
                  </div>
                </div>

                {/* Related categories */}
                <div className="rounded-card border border-gray-200 bg-white p-5 shadow-card-soft">
                  <h3 className="text-base font-bold text-gray-900 mb-3">More Experiences</h3>
                  <ul className="space-y-1">
                    {otherGroups.map((g) => {
                      const target = allItems.find((e) => e.group === g);
                      if (!target) return null;
                      return (
                        <li key={g}>
                          <Link
                            href={`/experiences/${target.slug}`}
                            className="flex items-center justify-between py-1.5 text-sm text-gray-600 hover:text-brand-orange transition-colors"
                          >
                            {target.name}
                            <ChevronRight className="h-4 w-4" aria-hidden="true" />
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ */}
          <div className="mt-14 max-w-3xl">
            <h2 className="text-2xl font-bold text-gray-900">{exp.name} — Frequently Asked Questions</h2>
            <div className="mt-5 space-y-3">
              {exp.faqs.map((faq, i) => (
                <details
                  key={i}
                  className="group rounded-card border border-gray-200 bg-white shadow-card-soft open:shadow-card-lift"
                >
                  <summary className="flex cursor-pointer items-center justify-between gap-3 p-4 text-sm font-semibold text-gray-900 list-none [&::-webkit-details-marker]:hidden">
                    {faq.q}
                    <ChevronRight className="h-4 w-4 shrink-0 text-brand-orange transition-transform duration-200 group-open:rotate-90" aria-hidden="true" />
                  </summary>
                  <p className="px-4 pb-4 text-sm leading-relaxed text-gray-600">{faq.a}</p>
                </details>
              ))}
            </div>
          </div>

          {/* Related experiences */}
          {related.length > 0 && (
            <div className="mt-14">
              <div className="flex items-end justify-between">
                <h2 className="text-2xl font-bold text-gray-900">
                  People who explored {exp.name} also liked
                </h2>
                <Link href="/experiences" className="text-sm font-bold text-brand-orange-text hover:text-brand-orange-dark">
                  View all →
                </Link>
              </div>
              <div className="mt-5 grid grid-cols-2 md:grid-cols-4 gap-4">
                {related.map((r) => (
                  <Link
                    key={r.slug}
                    href={`/experiences/${r.slug}`}
                    className="group relative block h-[180px] overflow-hidden rounded-card shadow-card-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-card-lift"
                  >
                    <Image
                      src={r.image}
                      alt={r.name}
                      fill
                      sizes="(max-width: 768px) 50vw, 25vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.06]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" aria-hidden="true" />
                    <div className="absolute inset-x-0 bottom-0 p-3">
                      <h3 className="text-sm font-bold text-white">{r.name}</h3>
                      <p className="text-[11px] text-gray-300">{r.packageCount} packages</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
