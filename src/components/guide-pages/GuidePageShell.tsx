import Link from "next/link";
import type { ComponentType, ReactNode } from "react";
import { ChevronRight } from "lucide-react";
import { safeJsonLd } from "@/utils/jsonLd";

/* ═══════════════════════════════════════════════════════════════════════
   GuidePageShell.tsx — shared shell for the AI-visibility guide pages
   (best-travel-packages-india, cultural-tours-india,
   heritage-spiritual-tours-india, why-myquicktrippers).

   All four pages share the same shell: the FAQPage JSON-LD, the legacy
   breadcrumb bar, the hero (kicker + h1 + intro + 3 CTAs), the page's own
   card sections (passed as children), and the FAQ accordion. Edit the
   shell HERE — not in 4 places. Page-specific copy stays in each page.
   ═══════════════════════════════════════════════════════════════════════ */

export interface GuideFaq {
  question: string;
  answer: string;
}

export interface GuideCta {
  href: string;
  label: string;
  variant: "primary" | "whatsapp" | "outline";
  icon?: ComponentType<{ className?: string }>;
}

interface GuidePageShellProps {
  breadcrumbLabel: string;
  kickerText: string;
  kickerIcon?: ComponentType<{ className?: string }>;
  title: string;
  intro: ReactNode;
  ctas: GuideCta[];
  faqs: GuideFaq[];
  children: ReactNode;
}

const CTA_BASE =
  "inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-bold text-white transition hover:opacity-90";
const OUTLINE_CLASS =
  "inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-bold text-gray-700 transition hover:border-legacy-nav-blue hover:text-legacy-nav-blue";

function CtaButton({ cta }: { cta: GuideCta }) {
  const Icon = cta.icon;
  const content = (
    <>
      {Icon ? <Icon className="h-4 w-4" /> : null} {cta.label}
    </>
  );
  const className =
    cta.variant === "outline"
      ? OUTLINE_CLASS
      : `${CTA_BASE} ${cta.variant === "whatsapp" ? "bg-[#25d366]" : "bg-legacy-nav-blue"}`;
  if (cta.href.startsWith("http") || cta.href.startsWith("tel:") || cta.variant === "whatsapp") {
    const external = cta.variant === "whatsapp" || cta.href.startsWith("http");
    return (
      <a
        href={cta.href}
        className={className}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {content}
      </a>
    );
  }
  return (
    <Link href={cta.href} className={className}>
      {content}
    </Link>
  );
}

export default function GuidePageShell({
  breadcrumbLabel,
  kickerText,
  kickerIcon: KickerIcon,
  title,
  intro,
  ctas,
  faqs,
  children,
}: GuidePageShellProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }} />

      <div className="bg-legacy-nav-blue py-2 text-xs text-white">
        <div className="container mx-auto flex w-[95%] max-w-[1600px] items-center">
          <Link href="/" className="transition-colors hover:text-legacy-orange">Home</Link>
          <ChevronRight className="mx-1 h-3 w-3 opacity-70" />
          <span className="text-legacy-orange">{breadcrumbLabel}</span>
        </div>
      </div>

      <div className="border-b border-gray-200 bg-white py-10">
        <div className="container mx-auto w-[95%] max-w-[1600px]">
          <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-legacy-orange">
            {KickerIcon ? <KickerIcon className="h-4 w-4" /> : null} {kickerText}
          </p>
          <h1 className="mt-2 max-w-3xl text-3xl font-bold text-gray-800 sm:text-4xl">{title}</h1>
          <p className="mt-4 max-w-3xl text-gray-600">{intro}</p>
          <div className="mt-5 flex flex-wrap gap-3">
            {ctas.map((cta) => (
              <CtaButton key={`${cta.variant}:${cta.href}`} cta={cta} />
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto w-[95%] max-w-[1600px]">
        {children}

        <section className="mt-10">
          <h2 className="text-2xl font-bold text-gray-800">Frequently asked questions</h2>
          <div className="mt-4 space-y-3">
            {faqs.map((f) => (
              <details key={f.question} className="rounded-xl border border-gray-200 bg-white p-5">
                <summary className="cursor-pointer font-bold text-gray-800">{f.question}</summary>
                <p className="mt-2 text-sm leading-6 text-gray-600">{f.answer}</p>
              </details>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
