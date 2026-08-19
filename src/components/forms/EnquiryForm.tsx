"use client";

import { useState } from "react";
import { siteConfig } from "@/data/siteConfig";

export default function EnquiryForm({ pkgName = "" }: { pkgName?: string }) {
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
      <div className="bg-green-50 border border-green-200 text-green-700 p-6 rounded-lg text-center">
        <h3 className="text-xl font-bold mb-2">Your quote request is ready.</h3>
        <p>WhatsApp has opened with your details prefilled. Send the message there to reach our travel team.</p>
        <button 
          onClick={() => setStatus("idle")}
          aria-label="Send another enquiry"
          className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
        >
          Send Another Enquiry
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-card border border-gray-100">
      <h3 className="text-2xl font-bold text-mqt-navy mb-4">Request a Free Quote</h3>
      <p className="text-gray-600 mb-6 text-sm">
        Fill out the form below and we will contact you as soon as possible.
      </p>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="enquiry-name" className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
          <input id="enquiry-name" name="name" required autoComplete="name" type="text" className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-mqt-orange outline-none" placeholder="Enter your name…" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="enquiry-email" className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
            <input id="enquiry-email" name="email" required autoComplete="email" spellCheck={false} type="email" className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-mqt-orange outline-none" placeholder="name@example.com" />
          </div>
          <div>
            <label htmlFor="enquiry-phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
            <input id="enquiry-phone" name="phone" required autoComplete="tel" inputMode="tel" type="tel" className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-mqt-orange outline-none" placeholder="98765 43210" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="enquiry-travel-date" className="block text-sm font-medium text-gray-700 mb-1">Travel Date</label>
            <input id="enquiry-travel-date" name="travelDate" type="date" className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-mqt-orange outline-none" />
          </div>
          <div>
            <label htmlFor="enquiry-travellers" className="block text-sm font-medium text-gray-700 mb-1">No. of Travellers</label>
            <input id="enquiry-travellers" name="travellers" type="number" min="1" inputMode="numeric" className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-mqt-orange outline-none" placeholder="E.g. 2" />
          </div>
        </div>

        <div>
          <label htmlFor="enquiry-message" className="block text-sm font-medium text-gray-700 mb-1">Message (Optional)</label>
          <textarea id="enquiry-message" name="message" rows={2} className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-mqt-orange outline-none" placeholder="Share any special requirements…"></textarea>
        </div>
        
        <button 
          type="submit" 
          disabled={status === "loading"}
          aria-label="Submit enquiry form"
          className="w-full py-3 bg-mqt-orange hover:bg-mqt-orange-hover text-white font-bold rounded-md transition-colors disabled:bg-gray-400"
        >
          {status === "loading" ? "Submitting..." : "Get Free Quote"}
        </button>
        <p className="text-xs text-center text-gray-500 mt-4 flex justify-center items-center gap-4">
          <span className="flex items-center"><span className="text-yellow-500 mr-1">⚡</span> We respond within 2 hours</span>
          <span className="flex items-center"><span className="text-green-500 mr-1">🔒</span> 100% Secure & Private</span>
        </p>
      </form>
    </div>
  );
}
