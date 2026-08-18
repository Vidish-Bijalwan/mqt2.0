import { allPackages } from "@/data/allPackages";
import PackageCard from "@/components/ui/PackageCard";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function RelatedPackages({ category, currentSlug }: { category: string, currentSlug: string }) {
  // Find related packages in the same category, excluding the current one
  const related = allPackages
    .filter(pkg => pkg.category === category && pkg.slug !== currentSlug)
    .slice(0, 4); // Get up to 4 related packages

  if (related.length === 0) return null;

  return (
    <div className="mt-16 mb-8 border-t border-gray-200 pt-12">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Similar Tours You Might Like</h2>
          <p className="text-gray-500 text-sm mt-1">Explore other packages in {category}</p>
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
    </div>
  );
}
