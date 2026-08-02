import Link from "next/link";
import Image from "next/image";
import { ChevronRight } from "lucide-react";
import { siteConfig } from "@/data/siteConfig";
import { experiencesWithCounts } from "@/utils/experienceCounts";
import { experiences } from "@/data/experiencesData";
import ExperienceExplorer from "@/components/home/ExperienceExplorer";

export const metadata = {
  title: "Experiences in India | Adventure, Spiritual, Luxury & More | My Quick Trippers",
  description:
    "Discover unforgettable journeys across India — adventure sports, spiritual escapes, luxury travel, wellness retreats, wildlife safaris, cruises, festivals and more. Explore all experience categories.",
  alternates: {
    canonical: `${siteConfig.domain}/experiences`,
  },
  openGraph: {
    title: "Experiences in India | My Quick Trippers",
    description:
      "Discover unforgettable journeys, thrilling adventures, spiritual escapes, luxury travel, wellness retreats, wildlife safaris, cruises and more across India.",
    url: `${siteConfig.domain}/experiences`,
    type: "website",
    images: [{ url: `${siteConfig.domain}/images/packages/adventure.jpg`, width: 1200, height: 630, alt: "Experiences in India" }],
  },
};

export default function ExperiencesPage() {
  const items = experiencesWithCounts();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Experiences in India",
    description: metadata.description,
    url: `${siteConfig.domain}/experiences`,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: experiences.map((exp, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: exp.name,
        url: `${siteConfig.domain}/experiences/${exp.slug}`,
      })),
    },
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
            <span className="text-legacy-orange font-semibold">Experiences</span>
          </div>
        </div>

        {/* Hero */}
        <div className="relative h-[260px] w-full">
          <Image
            src="/images/packages/adventure.jpg"
            alt="Experiences in India"
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" aria-hidden="true" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-amber-300">What can you experience in India?</p>
            <h1 className="mt-2 text-3xl md:text-5xl font-extrabold text-white">Experience The Best Of India</h1>
            <p className="mt-3 max-w-2xl text-sm md:text-base text-gray-200">
              {experiences.length} curated categories — adventures, spiritual journeys, luxury escapes, wellness
              retreats, wildlife safaris, cruises and more. Find yours and start exploring.
            </p>
          </div>
        </div>

        {/* Explorer */}
        <div className="container mx-auto w-full max-w-[1600px] px-2 md:px-4 py-12">
          <ExperienceExplorer
            experiences={items.map((e) => ({
              slug: e.slug,
              name: e.name,
              group: e.group,
              image: e.image,
              tagline: e.tagline,
              packageCount: e.packageCount,
            }))}
          />
        </div>
      </div>
    </>
  );
}
