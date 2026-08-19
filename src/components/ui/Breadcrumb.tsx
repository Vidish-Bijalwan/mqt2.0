import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.label,
      ...(item.href ? { item: `https://www.myquicktrippers.com${item.href}` } : {}),
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav aria-label="Breadcrumb" className="bg-legacy-nav-blue text-white text-xs py-2 px-4">
        <div className="container mx-auto w-[95%] max-w-[1600px] flex items-center flex-wrap">
          {items.map((item, i) => (
            <span key={i} className="flex items-center">
              {i > 0 && <ChevronRight className="w-3 h-3 mx-1 opacity-70" />}
              {item.href ? (
                <Link href={item.href} className="hover:text-legacy-orange transition-colors">
                  {item.label}
                </Link>
              ) : (
                <span className="text-legacy-orange">{item.label}</span>
              )}
            </span>
          ))}
        </div>
      </nav>
    </>
  );
}
