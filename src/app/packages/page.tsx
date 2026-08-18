import { allPackages } from "@/data/allPackages";
import PackageListCard from "@/components/ui/PackageListCard";
import { Package } from "@/data/allPackages";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight } from "lucide-react";
import EnquiryForm from "@/components/forms/EnquiryForm";

export const metadata = {
  title: "All India Tour Packages | My Quick Trippers",
  description: "Browse 1000+ curated India and international tour packages by My Quick Trippers. Best deals on Pilgrimage, North India, South India, International tours.",
};

const CATEGORIES = [
  "All",
  "North India",
  "South India",
  "West India",
  "East India",
  "North East India",
  "Pilgrimage",
  "International",
  "Honeymoon",
  "Adventure",
  "Helicopter",
  "Wildlife",
];

export default async function PackagesPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; page?: string; filter?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const selectedCategory = resolvedSearchParams.category || "All";
  const selectedFilter = (resolvedSearchParams.filter || "").toLowerCase().replace(/-/g, " ");
  const currentPage = parseInt(resolvedSearchParams.page || "1", 10);
  const PER_PAGE = 10;

  const categoryFiltered = selectedCategory === "All"
    ? allPackages
    : allPackages.filter((p) => p.category === selectedCategory);

  // ?filter=<keyword> — keyword search over title/category/slug/description.
  // The legacy redirects (redirects.json) and /international-tours land here.
  const filtered = selectedFilter
    ? categoryFiltered.filter((p) => {
        const haystack = `${p.title} ${p.category} ${p.slug} ${p.description}`.toLowerCase();
        return haystack.includes(selectedFilter);
      })
    : categoryFiltered;

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const paged = filtered.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE);

  const pageTitle = selectedCategory === "All" ? "Tour Packages" : `${selectedCategory} Tour Packages`;
  const queryFor = (page: number) => {
    const params = new URLSearchParams();
    if (selectedCategory !== "All") params.set("category", selectedCategory);
    if (selectedFilter) params.set("filter", resolvedSearchParams.filter || "");
    if (page > 1) params.set("page", String(page));
    const qs = params.toString();
    return qs ? `/packages?${qs}` : "/packages";
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-16">
      {/* Hero Banner — title over image like reference listing pages */}
      <div className="relative h-[220px] md:h-[280px] w-full overflow-hidden">
        <Image
          src="/images/hero/hero-bg-1.jpg"
          alt="Tour Packages"
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-legacy-nav-blue/70" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-3xl md:text-5xl font-bold text-white capitalize drop-shadow-md">
            {pageTitle}
          </h1>
          <div className="flex items-center gap-1.5 mt-3 text-[13px] text-gray-200">
            <Link href="/" className="hover:text-legacy-orange transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 opacity-70" />
            <span className="text-legacy-orange font-semibold">{pageTitle}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 w-full max-w-[1920px] px-2 md:px-4 mt-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar */}
          <div className="lg:w-72 shrink-0 space-y-6">
            {/* Category Filters */}
            <div className="bg-white rounded border border-gray-200 shadow-sm overflow-hidden sticky top-24">
              <div className="bg-legacy-nav-blue text-white px-4 py-3 text-sm font-bold">
                Filter by Category
              </div>
              <div className="py-2">
                {CATEGORIES.map((cat) => {
                  const count = cat === "All" ? allPackages.length : allPackages.filter(p => p.category === cat).length;
                  return (
                    <Link
                      key={cat}
                      href={`/packages?category=${encodeURIComponent(cat)}`}
                      className={`block px-4 py-2 text-sm border-b border-gray-100 last:border-0 hover:text-legacy-orange hover:bg-gray-50 transition-colors ${
                        selectedCategory === cat ? "text-legacy-orange font-bold bg-orange-50" : "text-gray-600"
                      }`}
                    >
                      <span className="text-legacy-orange mr-1.5 text-[9px]">›</span>
                      {cat} <span className="text-gray-400 text-xs">({count})</span>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Quick Enquiry */}
            <div className="bg-[#fff9e6] border border-yellow-200 rounded overflow-hidden shadow-sm">
              <div className="bg-legacy-nav-blue text-white px-4 py-3 text-sm font-bold text-center relative">
                Get a Best Deal Quick Enquiry
                <span className="absolute left-1/2 -translate-x-1/2 -bottom-2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-legacy-nav-blue" />
              </div>
              <div className="p-4">
                <p className="text-[11px] text-gray-600 mb-3">
                  Tell us your travel plans and we&apos;ll design the best package for you!
                </p>
                <EnquiryForm pkgName={selectedFilter ? `Filter: ${selectedFilter}` : pageTitle} />
              </div>
            </div>
          </div>

          {/* Package List */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-500">
                Showing <b className="text-gray-800">{paged.length}</b> of <b className="text-gray-800">{filtered.length}</b> packages
              </p>
              <span className="hidden md:inline text-xs text-gray-400">
                {selectedFilter ? `Search: "${selectedFilter}"` : `${selectedCategory} packages`}
              </span>
            </div>

            {paged.length === 0 ? (
              <div className="text-center py-16 text-gray-500">
                No packages found for this category.
              </div>
            ) : (
              <>
                <div className="space-y-4">
                  {paged.map((pkg) => (
                    <PackageListCard key={pkg.slug} pkg={pkg} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center mt-10 gap-2 flex-wrap">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
                      <Link
                        key={pg}
                        href={queryFor(pg)}
                        className={`px-4 py-2 border text-sm font-medium rounded transition-colors ${
                          pg === safePage
                            ? "bg-legacy-orange text-white border-legacy-orange"
                            : "bg-white text-gray-600 border-gray-300 hover:border-legacy-orange hover:text-legacy-orange"
                        }`}
                      >
                        {pg}
                      </Link>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
