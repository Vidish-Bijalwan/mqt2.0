import { allPackages } from "@/data/allPackages";
import PackageCard from "@/components/ui/PackageCard";
import { Package } from "@/data/allPackages";
import Link from "next/link";

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
  searchParams: Promise<{ category?: string; page?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const selectedCategory = resolvedSearchParams.category || "All";
  const currentPage = parseInt(resolvedSearchParams.page || "1", 10);
  const PER_PAGE = 24;

  const filtered = selectedCategory === "All"
    ? allPackages
    : allPackages.filter((p) => p.category === selectedCategory);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paged = filtered.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

  return (
    <div className="bg-gray-50 min-h-screen pb-16">
      
      {/* Breadcrumb */}
      <div className="bg-legacy-nav-blue text-white text-xs py-2 px-4">
        <div className="container mx-auto w-full max-w-[1920px] px-2 md:px-4">
          <Link href="/" className="hover:text-legacy-orange">Home</Link>
          {" » "}
          <span className="text-legacy-orange">Tour Packages</span>
        </div>
      </div>

      {/* Page Header */}
      <div className="bg-white border-b border-gray-200 py-6">
        <div className="container mx-auto px-4 w-full max-w-[1920px] px-2 md:px-4">
          <h1 className="text-2xl font-bold text-legacy-nav-blue">
            {selectedCategory === "All" ? "All Tour Packages" : `${selectedCategory} Tour Packages`}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Showing {paged.length} of {filtered.length} packages
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 w-full max-w-[1920px] px-2 md:px-4 mt-8">
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Sidebar Filters */}
          <div className="md:w-56 shrink-0">
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
                      {cat} <span className="text-gray-400 text-xs">({count})</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Package Grid */}
          <div className="flex-1">
            {paged.length === 0 ? (
              <div className="text-center py-16 text-gray-500">No packages found for this category.</div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[10px]">
                  {paged.map((pkg) => (
                    <PackageCard key={pkg.slug} pkg={pkg} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center mt-10 gap-2 flex-wrap">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
                      <Link
                        key={pg}
                        href={`/packages?category=${encodeURIComponent(selectedCategory)}&page=${pg}`}
                        className={`px-4 py-2 border text-sm font-medium rounded transition-colors ${
                          pg === currentPage
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
