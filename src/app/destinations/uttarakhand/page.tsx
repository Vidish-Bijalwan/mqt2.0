import DestinationPage, { generateMetadata as destinationMetadata } from "../[slug]/page";
import { siteConfig } from "@/data/siteConfig";
import { safeJsonLd } from "@/utils/jsonLd";

export async function generateMetadata() {
  return destinationMetadata({ params: Promise.resolve({ slug: "uttarakhand" }) });
}

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: siteConfig.name,
  alternateName: siteConfig.shortName,
  url: siteConfig.domain,
  logo: `${siteConfig.domain}${siteConfig.logo}`,
  email: siteConfig.email,
  telephone: siteConfig.phone,
  sameAs: [
    siteConfig.social.facebook,
    siteConfig.social.instagram,
    siteConfig.social.twitter,
    siteConfig.social.youtube,
    siteConfig.social.linkedin,
  ],
};

export default async function UttarakhandPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(organizationJsonLd) }} />
      <DestinationPage params={Promise.resolve({ slug: "uttarakhand" })} searchParams={searchParams} />
    </>
  );
}
