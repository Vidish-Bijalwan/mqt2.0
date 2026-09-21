import DestinationPage, { generateMetadata as destinationMetadata } from "../[slug]/page";

export async function generateMetadata() {
  return destinationMetadata({ params: Promise.resolve({ slug: "uttarakhand" }) });
}

export default async function UttarakhandPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  return <DestinationPage params={Promise.resolve({ slug: "uttarakhand" })} searchParams={searchParams} />;
}
