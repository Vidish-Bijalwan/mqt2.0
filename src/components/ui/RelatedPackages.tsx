import { getPublicPackages } from "@/utils/packageCatalog";
import PackageCard from "@/components/ui/PackageCard";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const destinationClusters = [
  ["arunachal", "tawang", "bomdila", "dirang", "assam", "kaziranga", "guwahati", "meghalaya", "shillong", "cherrapunji", "mawlynnong", "dawki", "sikkim", "gangtok", "darjeeling", "nagaland", "manipur", "mizoram", "tripura"],
  ["uttarakhand", "kedarnath", "badrinath", "gangotri", "yamunotri", "chardham", "haridwar", "rishikesh", "mussoorie", "nainital", "corbett", "auli"],
  ["himachal", "shimla", "manali", "dharamshala", "dalhousie", "spiti", "kasol", "kinnaur"],
  ["kashmir", "srinagar", "gulmarg", "pahalgam", "sonmarg", "ladakh", "leh"],
  ["rajasthan", "jaipur", "jodhpur", "udaipur", "jaisalmer", "bikaner", "pushkar", "ranthambore"],
  ["kerala", "kochi", "cochin", "munnar", "thekkady", "alleppey", "kovalam", "wayanad"],
  ["tamil", "chennai", "madurai", "rameswaram", "kanyakumari", "ooty", "kodaikanal"],
  ["andaman", "portblair", "havelock", "neil"],
] as const;

const destinationSubclusters = [
  ["arunachal", "tawang", "bomdila", "dirang"],
  ["assam", "kaziranga", "guwahati"],
  ["meghalaya", "shillong", "cherrapunji", "mawlynnong", "dawki"],
  ["sikkim", "gangtok", "pelling"],
  ["darjeeling", "kalimpong"],
] as const;

function regionalAffinity(subject: string, candidate: string) {
  const broadScore = destinationClusters.reduce((score, cluster) => {
    const subjectBelongs = cluster.some((place) => subject.includes(place));
    const candidateBelongs = cluster.some((place) => candidate.includes(place));
    return score + (subjectBelongs && candidateBelongs ? 1 : 0);
  }, 0);
  const localScore = destinationSubclusters.reduce((score, cluster) => {
    const subjectBelongs = cluster.some((place) => subject.includes(place));
    const candidateBelongs = cluster.some((place) => candidate.includes(place));
    return score + (subjectBelongs && candidateBelongs ? 5 : 0);
  }, 0);
  return broadScore + localScore;
}

export default function RelatedPackages({ category, currentSlug }: { category: string, currentSlug: string }) {
  const packages = getPublicPackages();
  const current = packages.find((pkg) => pkg.slug === currentSlug);
  const stopWords = new Set([
    "tour", "tours", "tourism", "package", "packages", "days", "nights", "india",
    "with", "from", "pradesh", "sightseeing", "holiday", "trip",
  ]);
  const subjectTokens = new Set(
    `${current?.slug || ""} ${current?.title || ""} ${current?.route || ""}`
      .toLowerCase()
      .split(/[^a-z0-9]+/)
      .filter((token) => token.length > 3 && !stopWords.has(token)),
  );

  const currentSubject = `${current?.slug || ""} ${current?.title || ""} ${current?.route || ""}`.toLowerCase();

  // Exact place names are strongest. Destination clusters connect nearby tours
  // such as Arunachal and Tawang without allowing a broad "India Tours" label
  // to pull an unrelated state into the row.
  const related = packages
    .filter((pkg) => pkg.slug !== currentSlug)
    .map((pkg) => {
      const candidateSubject = `${pkg.slug} ${pkg.title} ${pkg.route}`.toLowerCase();
      const tokens = new Set(candidateSubject.split(/[^a-z0-9]+/));
      const exactMatches = Array.from(subjectTokens).filter((token) => tokens.has(token)).length;
      const regionMatches = regionalAffinity(currentSubject, candidateSubject);
      return {
        pkg,
        score: exactMatches * 10 + regionMatches + (pkg.category === category ? 2 : 0),
        sameCategory: pkg.category === category,
      };
    })
    .sort((a, b) => b.score - a.score || Number(b.sameCategory) - Number(a.sameCategory) || a.pkg.title.localeCompare(b.pkg.title))
    .slice(0, 4)
    .map(({ pkg }) => pkg);

  if (related.length === 0) return null;

  return (
    <section className="mb-8 mt-16 border-t border-[#d9e6e2] pt-12">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <p className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-[#b65d25]">Keep exploring</p>
          <h2 className="font-display mt-1 text-2xl font-bold text-[#153b35] sm:text-3xl">Related journeys worth comparing</h2>
          <p className="mt-2 text-sm text-[#657a74]">Every link below is selected from the current public package catalog.</p>
        </div>
        <Link href={`/packages?category=${encodeURIComponent(category)}`} className="hidden md:flex items-center text-legacy-orange font-bold text-sm hover:underline">
          View all in {category} <ArrowRight className="w-4 h-4 ml-1" />
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[10px]">
        {related.map(pkg => (
          <PackageCard key={pkg.slug} pkg={pkg} />
        ))}
      </div>
      
      <div className="mt-6 md:hidden text-center">
        <Link href={`/packages?category=${encodeURIComponent(category)}`} className="inline-flex items-center text-legacy-orange font-bold text-sm hover:underline">
          View all in {category} <ArrowRight className="w-4 h-4 ml-1" />
        </Link>
      </div>
    </section>
  );
}
