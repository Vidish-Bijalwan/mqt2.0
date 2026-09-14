"use client";

import { siteConfig } from "@/data/siteConfig";
import { MessageCircle } from "lucide-react";
import { useEffect } from "react";

interface StickyMobileCTAProps {
  price: string; // already formatted display price (e.g. "95,000")
  showPrice: boolean;
  packageName: string;
}

export default function StickyMobileCTA({ price, showPrice, packageName }: StickyMobileCTAProps) {
  useEffect(() => {
    document.body.classList.add("has-sticky-mobile-cta");
    return () => document.body.classList.remove("has-sticky-mobile-cta");
  }, []);

  const whatsappUrl = `${siteConfig.social.whatsapp}?text=${encodeURIComponent(
    `Hello My Quick Trippers, I am interested in the ${packageName}. Please share the available dates and a tailored quote.`,
  )}`;

  return (
    <div className="sticky-mobile-cta fixed inset-x-0 bottom-0 z-[1200] border-t border-[#d8e5e1] bg-white px-3 py-2.5 pb-[calc(0.625rem+env(safe-area-inset-bottom))] shadow-[0_-8px_24px_rgba(11,48,44,0.12)] lg:hidden">
      <div className="flex items-center gap-2.5">
        <div className="min-w-0 flex-1">
          <p className="text-[9px] font-extrabold uppercase tracking-[0.16em] text-[#798985]">{showPrice ? "Starting from" : "Built for you"}</p>
          <p className="truncate text-base font-black leading-tight text-[#153a34]">
            {showPrice ? <>INR {price}</> : "Tailored quote"}
          </p>
        </div>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          data-track="cta_whatsapp"
          aria-label={`Chat on WhatsApp about ${packageName}`}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#16865a] text-white shadow-sm transition hover:bg-[#0f7049]"
        >
          <MessageCircle className="w-5 h-5" />
        </a>
        <a
          href="#enquiry-form"
          data-track="cta_send_query"
          className="flex min-h-11 shrink-0 items-center justify-center rounded-xl bg-[#ef7a2f] px-4 text-center text-sm font-extrabold text-white transition-colors hover:bg-[#d96520] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ef7a2f] focus-visible:ring-offset-2"
        >
          Personalise trip
        </a>
      </div>
    </div>
  );
}
