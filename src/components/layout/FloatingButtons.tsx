"use client";

import { MessageCircle, Phone } from "lucide-react";
import { siteConfig } from "@/data/siteConfig";

export default function FloatingButtons() {
  return (
    <div className="fixed bottom-6 right-6 flex flex-col space-y-4 z-50">
      <a 
        href={siteConfig.social.whatsapp}
        target="_blank"
        rel="noreferrer"
        className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg transition-transform hover:scale-110 flex items-center justify-center"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle className="w-6 h-6" />
      </a>
      <a 
        href={`tel:${siteConfig.phoneRaw}`}
        className="bg-brand-green hover:bg-green-700 text-white p-4 rounded-full shadow-lg transition-transform hover:scale-110 flex items-center justify-center"
        aria-label="Call Us"
      >
        <Phone className="w-6 h-6" />
      </a>
    </div>
  );
}
