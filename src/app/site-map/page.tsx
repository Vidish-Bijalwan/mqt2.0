import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/data/siteConfig";
import { navLinks } from "@/data/navLinks";
import { footerLinks } from "@/data/footerLinks";
import { themeConfigs } from "@/data/themeConfig";
import { allPackages } from "@/data/allPackages";
import destinationsDataRaw from "@/data/destinationsData.json";
import { experiences } from "@/data/experiencesData";

const destinationsData = destinationsDataRaw as Record<string, unknown>;

export const metadata: Metadata = {
  title: `Site Map | ${siteConfig.name}`,
  description: `Complete site map of ${siteConfig.name} — browse all tour packages, destinations, experiences, special tours, blog posts and support pages.`,
};

interface LinkGroup {
  title: string;
  href?: string;
  links: { name: string; href: string }[];
}

export default function SiteMapPage() {
  // Package categories with counts (computed server-side)
  const categoryCounts = new Map<string, number>();
  for (const pkg of allPackages) {
    const cat = pkg.category || "Other";
    categoryCounts.set(cat, (categoryCounts.get(cat) || 0) + 1);
  }
  const categories = Array.from(categoryCounts.entries()).sort((a, b) => b[1] - a[1]);

  // Top featured packages for quick access (first 12)
  const featuredPackages = allPackages.slice(0, 12);

  const mainLinks: LinkGroup[] = [
    {
      title: "Main Pages",
      links: [
        { name: "Home", href: "/" },
        { name: "All Tour Packages", href: "/packages" },
        { name: "Experiences", href: "/experiences" },
        { name: "Blog", href: "/blog" },
        { name: "Special Tours", href: "/special-tours" },
        { name: "About Us", href: "/about-us" },
        { name: "Contact Us", href: "/contact-us" },
      ],
    },
    {
      title: "Website Support",
      links: [
        { name: "Privacy Policy", href: "/privacy-policy" },
        { name: "Terms & Conditions", href: "/terms-and-conditions" },
        { name: "Careers", href: "/careers" },
      ],
    },
  ];

  // Flatten nav mega-menus
  const navGroups: LinkGroup[] = navLinks
    .filter((item) => item.submenus)
    .map((item) => ({
      title: item.title,
      href: item.href,
      links: item.submenus!.flatMap((sub) =>
        sub.links.map((l) => ({ name: `${l.name}`, href: l.href }))
      ),
    }));

  // Only themes under /special-tours have a built route; /india-tours/pilgrimage has no page yet.
  const workingThemeConfigs = themeConfigs.filter((t) => t.href.startsWith("/special-tours/"));

  const themeLinks: LinkGroup[] = [
    {
      title: "Tour Themes",
      href: "/special-tours",
      links: workingThemeConfigs.map((t) => ({ name: t.name, href: t.href })),
    },
  ];

  return (
    <div className="bg-gray-50 min-h-screen pb-16">
      {/* Breadcrumb */}
      <div className="bg-brand-navy text-white text-xs py-2 px-4">
        <div className="container mx-auto w-full max-w-[1920px] px-2 md:px-4">
          <Link href="/" className="hover:text-brand-orange transition-colors">
            Home
          </Link>
          {" » "}
          <span className="text-brand-orange">Site Map</span>
        </div>
      </div>

      {/* Hero */}
      <div className="bg-brand-navy text-white">
        <div className="container mx-auto px-4 w-full max-w-[1920px] px-2 md:px-4 py-10">
          <h1 className="text-2xl md:text-4xl font-bold">Site Map</h1>
          <p className="mt-2 max-w-3xl text-sm md:text-base text-gray-300">
            Every page on {siteConfig.name} in one place — jump straight to packages,
            destinations, experiences, themes, blog posts or support pages.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 w-full max-w-[1920px] px-2 md:px-4 mt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {[...mainLinks, ...navGroups, ...themeLinks].map((group) => (
            <div key={group.title} className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
              <div className="bg-brand-navy text-white px-4 py-3 text-sm font-bold flex items-center justify-between">
                {group.title}
                {group.href && (
                  <Link href={group.href} className="text-[11px] font-semibold text-brand-orange hover:underline">
                    View all »
                  </Link>
                )}
              </div>
              <ul className="py-2">
                {group.links.map((link, idx) => (
                  <li key={idx}>
                    <Link
                      href={link.href}
                      className="flex items-center px-4 py-2 text-[13px] border-b border-gray-100 last:border-0 text-gray-600 hover:text-brand-orange hover:bg-orange-50 transition-colors"
                    >
                      <span className="text-brand-orange mr-2 text-[10px]">★</span>
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Destinations */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            <div className="bg-brand-navy text-white px-4 py-3 text-sm font-bold">Destinations</div>
            <ul className="py-2 max-h-[400px] overflow-y-auto">
              {Object.keys(destinationsData).filter((s) => s !== "blog").map((slug) => (
                <li key={slug}>
                  <Link
                    href={`/destinations/${slug}`}
                    className="flex items-center px-4 py-2 text-[13px] border-b border-gray-100 last:border-0 text-gray-600 hover:text-brand-orange hover:bg-orange-50 transition-colors capitalize"
                  >
                    <span className="text-brand-orange mr-2 text-[10px]">★</span>
                    {slug.replace(/-/g, " ")}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Experiences */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            <div className="bg-brand-navy text-white px-4 py-3 text-sm font-bold flex items-center justify-between">
              Experiences
              <Link href="/experiences" className="text-[11px] font-semibold text-brand-orange hover:underline">
                View all »
              </Link>
            </div>
            <ul className="py-2">
              {experiences.map((exp, idx) => (
                <li key={idx}>
                  <Link
                    href={`/experiences/${exp.slug}`}
                    className="flex items-center px-4 py-2 text-[13px] border-b border-gray-100 last:border-0 text-gray-600 hover:text-brand-orange hover:bg-orange-50 transition-colors"
                  >
                    <span className="text-brand-orange mr-2 text-[10px]">★</span>
                    {exp.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Package Categories */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            <div className="bg-brand-navy text-white px-4 py-3 text-sm font-bold">Package Categories</div>
            <ul className="py-2 max-h-[400px] overflow-y-auto">
              {categories.map(([cat, count]) => (
                <li key={cat}>
                  <Link
                    href={`/packages?category=${encodeURIComponent(cat)}`}
                    className="flex items-center justify-between px-4 py-2 text-[13px] border-b border-gray-100 last:border-0 text-gray-600 hover:text-brand-orange hover:bg-orange-50 transition-colors"
                  >
                    <span className="flex items-center">
                      <span className="text-brand-orange mr-2 text-[10px]">★</span>
                      {cat}
                    </span>
                    <span className="text-gray-400 text-xs">({count})</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Featured packages */}
        <div className="mt-10 bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <div className="bg-brand-navy text-white px-4 py-3 text-sm font-bold flex items-center justify-between">
            Featured Tour Packages
            <Link href="/packages" className="text-[11px] font-semibold text-brand-orange hover:underline">
              Browse all {allPackages.length} packages »
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-1 p-4">
            {featuredPackages.map((pkg) => (
              <Link
                key={pkg.slug}
                href={`/packages/${pkg.slug}`}
                className="flex items-center py-2 text-[13px] text-gray-600 hover:text-brand-orange transition-colors"
              >
                <span className="text-brand-orange mr-2 text-[10px]">★</span>
                <span className="line-clamp-1">{pkg.title}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Footer quick links from footer data */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title} className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
              <div className="bg-brand-navy text-white px-4 py-3 text-sm font-bold">{title}</div>
              <ul className="py-2">
                {links.map((link, idx) => (
                  <li key={idx}>
                    <Link
                      href={link.href}
                      className="flex items-center px-4 py-2 text-[13px] border-b border-gray-100 last:border-0 text-gray-600 hover:text-brand-orange hover:bg-orange-50 transition-colors"
                    >
                      <span className="text-brand-orange mr-2 text-[10px]">★</span>
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
