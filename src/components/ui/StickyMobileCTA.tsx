"use client";

import { siteConfig } from "@/data/siteConfig";
import { MessageCircle } from "lucide-react";

interface StickyMobileCTAProps {
  price: string; // already formatted display price (e.g. "95,000")
  showPrice: boolean;
}

export default function StickyMobileCTA({ price, showPrice }: StickyMobileCTAProps) {
  return (
    <div className="lg:hidden fixed bottom-0 inset-x-0 z-[1200] bg-white border-t border-gray-200 shadow-[0_-4px_20px_rgba(0,0,0,0.12)] px-4 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
      <div className="flex items-center gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-[10px] text-gray-500 font-semibold uppercase tracking-wide">Starting from</p>
          <p className="text-lg font-extrabold text-gray-900 leading-tight truncate">
            {showPrice ? <>INR {price}</> : "Pricing on request"}
          </p>
        </div>
        <a
          href={`tel:${siteConfig.phoneRaw}`}
          data-track="cta_call"
          aria-label="Call us"
          className="shrink-0 w-11 h-11 rounded-full bg-brand-green text-white flex items-center justify-center"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
          </svg>
        </a>
        <a
          href={siteConfig.social.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          data-track="cta_whatsapp"
          aria-label="Chat on WhatsApp"
          className="shrink-0 w-11 h-11 rounded-full bg-[#25D366] text-white flex items-center justify-center"
        >
          <MessageCircle className="w-5 h-5" />
        </a>
        <a
          href="#enquiry-form"
          data-track="cta_send_query"
          className="shrink-0 flex-1 max-w-[160px] bg-legacy-orange hover:bg-orange-600 text-white font-bold text-sm py-3 rounded-md text-center transition-colors"
        >
          Send Query
        </a>
      </div>
    </div>
  );
}
