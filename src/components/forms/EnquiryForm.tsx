"use client";

import { useState } from "react";
import { siteConfig } from "@/data/siteConfig";

export default function EnquiryForm({ pkgName = "", embedded = false }: { pkgName?: string; embedded?: boolean }) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("loading");

    const form = new FormData(e.currentTarget);
    const message = [
      "Hello My Quick Trippers, I would like a quote.",
      pkgName ? `Package: ${pkgName}` : "",
      `Name: ${form.get("name")}`,
      `Email: ${form.get("email")}`,
      `Phone: ${form.get("phone")}`,
      form.get("travelDate") ? `Travel date: ${form.get("travelDate")}` : "",
      form.get("travellers") ? `Travellers: ${form.get("travellers")}` : "",
      form.get("message") ? `Message: ${form.get("message")}` : "",
    ].filter(Boolean).join("\n");
    
    // Track enquiry submission (analytics)
    const analytics = window as Window & { gtag?: (event: string, action: string, params: Record<string, string>) => void };
    if (analytics.gtag) {
      analytics.gtag("event", "enquiry_submit", {
        event_category: "engagement",
        event_label: pkgName || "general",
      });
    }
    
    // There is no lead-capture API configured in this static site. Open the
    // prefilled business WhatsApp thread instead of falsely claiming a lead
    // was submitted and then discarded.
    window.open(`${siteConfig.social.whatsapp}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
    setStatus("success");
  };

  if (status === "success") {
    return (
      <div className="bg-green-50 border border-green-200 text-green-700 p-8 rounded-lg text-center animate-in fade-in zoom-in duration-300">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-xl font-bold mb-2">Your WhatsApp message is ready</h3>
        <p className="text-green-600 mb-4">WhatsApp has opened with your details. Send the message to our travel team.</p>
        <button 
          onClick={() => setStatus("idle")}
          aria-label="Send another enquiry"
          className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
        >
          Send Another Enquiry
        </button>
      </div>
    );
  }

  return (
    <div className={embedded ? "bg-white p-4 sm:p-6" : "rounded-lg border border-gray-100 bg-white p-6 shadow-card"}>
      <h3 className="mb-3 text-2xl font-extrabold text-[#123b35]">Start with a free trip consultation</h3>
      <p className="mb-6 max-w-2xl text-sm leading-6 text-[#687a75]">
        Add the essentials now. You can discuss hotels, transport, meals, and special requirements directly with the travel team.
      </p>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="enquiry-name" className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
            <input id="enquiry-name" name="name" required autoComplete="name" type="text" className="min-h-12 w-full rounded-xl border border-[#cad9d5] bg-[#fbfdfc] px-4 outline-none transition focus:border-[#28796b] focus:ring-2 focus:ring-[#28796b]/20" placeholder="Enter your name" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="enquiry-email" className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
            <input id="enquiry-email" name="email" required autoComplete="email" spellCheck={false} type="email" className="min-h-12 w-full rounded-xl border border-[#cad9d5] bg-[#fbfdfc] px-4 outline-none transition focus:border-[#28796b] focus:ring-2 focus:ring-[#28796b]/20" placeholder="name@example.com" />
          </div>
          <div>
            <label htmlFor="enquiry-phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
            <input id="enquiry-phone" name="phone" required autoComplete="tel" inputMode="tel" type="tel" className="min-h-12 w-full rounded-xl border border-[#cad9d5] bg-[#fbfdfc] px-4 outline-none transition focus:border-[#28796b] focus:ring-2 focus:ring-[#28796b]/20" placeholder="98765 43210" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="enquiry-travel-date" className="block text-sm font-medium text-gray-700 mb-1">Travel Date</label>
            <input id="enquiry-travel-date" name="travelDate" type="date" className="min-h-12 w-full rounded-xl border border-[#cad9d5] bg-[#fbfdfc] px-4 outline-none transition focus:border-[#28796b] focus:ring-2 focus:ring-[#28796b]/20" />
          </div>
          <div>
            <label htmlFor="enquiry-travellers" className="block text-sm font-medium text-gray-700 mb-1">No. of Travellers</label>
            <input id="enquiry-travellers" name="travellers" type="number" min="1" inputMode="numeric" className="min-h-12 w-full rounded-xl border border-[#cad9d5] bg-[#fbfdfc] px-4 outline-none transition focus:border-[#28796b] focus:ring-2 focus:ring-[#28796b]/20" placeholder="E.g. 2" />
          </div>
        </div>

        <div>
          <label htmlFor="enquiry-message" className="block text-sm font-medium text-gray-700 mb-1">Message (Optional)</label>
          <textarea id="enquiry-message" name="message" rows={3} className="w-full rounded-xl border border-[#cad9d5] bg-[#fbfdfc] p-4 outline-none transition focus:border-[#28796b] focus:ring-2 focus:ring-[#28796b]/20" placeholder="Share hotel preferences, accessibility needs, or anything else"></textarea>
        </div>
        
        <button 
          type="submit" 
          disabled={status === "loading"}
          aria-label="Submit enquiry form"
          className="min-h-12 w-full rounded-xl bg-[#ef7a2f] px-5 py-3 font-extrabold text-white transition-colors hover:bg-[#d96520] disabled:bg-gray-400"
        >
          {status === "loading" ? "Preparing your message..." : "Continue on WhatsApp"}
        </button>
        <p className="mt-4 text-center text-xs leading-5 text-[#71817d]">
          No payment required. Your details are used only to discuss this trip.
        </p>
      </form>
    </div>
  );
}
