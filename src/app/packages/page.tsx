import PackageListCard from "@/components/ui/PackageListCard";
import { getPublicPackages, packageDurationGroup } from "@/utils/packageCatalog";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight } from "lucide-react";
import EnquiryForm from "@/components/forms/EnquiryForm";

export const metadata = {
  title: "All India Tour Packages | My Quick Trippers",
  description: "Browse curated India and international tour packages by My Quick Trippers. Explore journeys of three days or more by destination, theme, and duration.",
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
  searchParams: Promise<{ category?: string; page?: string; filter?: string; q?: string; duration?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const selectedCategory = resolvedSearchParams.category || "All";
  const selectedDuration = resolvedSearchParams.duration || "All";
  const selectedFilter = (resolvedSearchParams.q || resolvedSearchParams.filter || "").toLowerCase().replace(/-/g, " ").trim();
  const currentPage = parseInt(resolvedSearchParams.page || "1", 10);
  const PER_PAGE = 10;
  const publicPackages = getPublicPackages();

  const categoryFiltered = selectedCategory === "All"
    ? publicPackages
    : publicPackages.filter((p) => p.category === selectedCategory);

  // ?filter=<keyword> — keyword search over title/category/slug/description.
  // The legacy redirects (redirects.json) and /international-tours land here.
  const textFiltered = selectedFilter
    ? categoryFiltered.filter((p) => {
        const haystack = `${p.title} ${p.category} ${p.slug} ${p.description}`.toLowerCase();
        return haystack.includes(selectedFilter);
      })
    : categoryFiltered;
  const filtered = selectedDuration === "All"
    ? textFiltered
    : textFiltered.filter((pkg) => packageDurationGroup(pkg) === selectedDuration);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const paged = filtered.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE);

  const pageTitle = selectedCategory === "All" ? "Tour Packages" : `${selectedCategory} Tour Packages`;
  const queryFor = (page: number) => {
    const params = new URLSearchParams();
    if (selectedCategory !== "All") params.set("category", selectedCategory);
    if (selectedDuration !== "All") params.set("duration", selectedDuration);
    if (selectedFilter) params.set("q", selectedFilter);
    if (page > 1) params.set("page", String(page));
    const qs = params.toString();
    return qs ? `/packages?${qs}` : "/packages";
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-16">
      {/* Hero Banner — title over image like reference listing pages */}
      <div className="relative h-[220px] md:h-[280px] w-full overflow-hidden">
        <Image
          src="/images/hero/hero-bg-1.svg"
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
          <div className="order-2 space-y-6 lg:order-1 lg:w-72 lg:shrink-0">
            {/* Category Filters */}
            <div className="overflow-hidden rounded-xl border border-brand-sage/50 bg-white shadow-sm lg:sticky lg:top-24">
              <div className="bg-legacy-nav-blue text-white px-4 py-3 text-sm font-bold">
                Filter by Category
              </div>
              <div className="flex overflow-x-auto py-2 lg:block lg:overflow-visible">
                {CATEGORIES.map((cat) => {
                  const count = cat === "All" ? publicPackages.length : publicPackages.filter(p => p.category === cat).length;
                  return (
                    <Link
                      key={cat}
                      href={(() => {
                        const params = new URLSearchParams();
                        if (cat !== "All") params.set("category", cat);
                        if (selectedDuration !== "All") params.set("duration", selectedDuration);
                        if (selectedFilter) params.set("q", selectedFilter);
                        const query = params.toString();
                        return query ? `/packages?${query}` : "/packages";
                      })()}
                      className={`block shrink-0 whitespace-nowrap border-b border-r border-gray-100 px-4 py-2 text-sm transition-colors last:border-r-0 lg:border-r-0 lg:last:border-b-0 hover:bg-brand-paper hover:text-brand-forest ${
                        selectedCategory === cat ? "bg-brand-paper font-bold text-brand-forest" : "text-gray-600"
                      }`}
                    >
                      <span className="text-legacy-orange mr-1.5 text-[10px]">›</span>
                      {cat} <span className="text-gray-400 text-xs">({count})</span>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Quick Enquiry */}
            <div className="overflow-hidden rounded-xl border border-brand-sage/50 bg-brand-paper shadow-sm">
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
          <div className="order-1 min-w-0 flex-1 lg:order-2">
            <form action="/packages" className="mb-5 rounded-xl border border-brand-sage/50 bg-brand-paper p-3 md:p-4 shadow-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-[minmax(0,1fr)_170px_120px] gap-3">
                <label className="sr-only" htmlFor="package-search">Search packages</label>
                <input
                  id="package-search"
                  name="q"
                  defaultValue={selectedFilter}
                  placeholder="Search a destination, theme, or tour"
                  className="min-h-11 w-full rounded-lg border border-brand-sage bg-white px-3 text-sm text-gray-800 outline-none transition focus:border-brand-river focus:ring-2 focus:ring-brand-river/20"
                />
                <label className="sr-only" htmlFor="package-duration">Trip duration</label>
                <select id="package-duration" name="duration" defaultValue={selectedDuration} className="min-h-11 rounded-lg border border-brand-sage bg-white px-3 text-sm text-gray-800 outline-none transition focus:border-brand-river focus:ring-2 focus:ring-brand-river/20">
                  <option value="All">Any duration</option>
                  <option value="3-5">3 to 5 days</option>
                  <option value="6-9">6 to 9 days</option>
                  <option value="10+">10+ days</option>
                  <option value="custom">Custom duration</option>
                </select>
                {selectedCategory !== "All" && <input type="hidden" name="category" value={selectedCategory} />}
                <button type="submit" className="min-h-11 rounded-lg bg-brand-forest px-4 text-sm font-bold text-white transition hover:bg-brand-forest-deep focus:outline-none focus:ring-2 focus:ring-brand-river focus:ring-offset-2">
                  Apply filters
                </button>
              </div>
            </form>
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
