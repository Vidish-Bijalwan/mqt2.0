"use client";

import { MessageCircle, Phone } from "lucide-react";
import { siteConfig } from "@/data/siteConfig";
import { usePathname } from "next/navigation";

export default function FloatingButtons() {
  const pathname = usePathname();
  if (/^\/packages\/[^/]+/.test(pathname)) return null;

  return (
    <div className="floating-contact-buttons hidden sm:flex fixed bottom-6 right-6 flex-col space-y-4 z-50">
      <a 
        href={siteConfig.social.whatsapp}
        target="_blank"
        rel="noopener noreferrer"
        data-track="floating_whatsapp_btn"
        className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg transition-transform hover:scale-110 flex items-center justify-center"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle className="w-6 h-6" />
      </a>
      <a 
        href={`tel:${siteConfig.phoneRaw}`}
        data-track="floating_call"
        className="bg-brand-green hover:bg-green-700 text-white p-4 rounded-full shadow-lg transition-transform hover:scale-110 flex items-center justify-center"
        aria-label="Call Us"
      >
        <Phone className="w-6 h-6" />
      </a>
    </div>
  );
}
