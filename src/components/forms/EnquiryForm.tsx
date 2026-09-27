"use client";

import { useState, useEffect, useRef } from "react";
import { siteConfig } from "@/data/siteConfig";
import { buildEnquiryWhatsappUrl } from "@/utils/enquiry";

export default function EnquiryForm({ pkgName = "", destination, embedded = false }: { pkgName?: string; destination?: string; embedded?: boolean }) {
  // `destination` is retained for campaign pages authored before `pkgName`
  // became the shared form API.
  const enquiryName = pkgName || destination || "";
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [preparedUrl, setPreparedUrl] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const successHeadingRef = useRef<HTMLHeadingElement>(null);
  const phoneInputRef = useRef<HTMLInputElement>(null);

  // On successful submit, move focus to the confirmation so screen-reader
  // users are told what happened.
  useEffect(() => {
    if (status === "success") {
      successHeadingRef.current?.focus();
    }
  }, [status]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("loading");

    const form = new FormData(e.currentTarget);
    const phone = String(form.get("phone") || "");
    // Reject phone numbers that are too short or mostly non-digits; keep
    // "+" for country codes and strip common separators for the digit count.
    const phoneDigits = phone.replace(/[^\d]/g, "");
    if (phoneDigits.length < 8 || phoneDigits.length > 15) {
      setPhoneError("Please enter a valid phone number (8–15 digits, e.g. 98765 43210).");
      phoneInputRef.current?.focus();
      setStatus("idle");
      return;
    }
    setPhoneError("");
    const whatsappUrl = buildEnquiryWhatsappUrl(siteConfig.social.whatsapp, {
      packageName: enquiryName,
      name: String(form.get("name") || ""),
      email: String(form.get("email") || ""),
      phone: String(form.get("phone") || ""),
      travelDate: String(form.get("travelDate") || ""),
      travellers: String(form.get("travellers") || ""),
      message: String(form.get("message") || ""),
    });
    
    // Track enquiry submission (analytics)
    const analytics = window as Window & { gtag?: (event: string, action: string, params: Record<string, string>) => void };
    if (analytics.gtag) {
      analytics.gtag("event", "enquiry_submit", {
        event_category: "engagement",
        event_label: enquiryName || "general",
      });
    }
    
    // There is no lead-capture API configured in this static site. Open the
    // prefilled business WhatsApp thread instead of falsely claiming a lead
    // was submitted and then discarded.
    setPreparedUrl(whatsappUrl);
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
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
        <h3 ref={successHeadingRef} tabIndex={-1} className="mb-2 text-xl font-bold">Your WhatsApp message is ready</h3>
        <p className="mb-5 text-green-700">Send the prepared message to our travel team. If WhatsApp did not open automatically, use the button below.</p>
        <div className="flex flex-col justify-center gap-3 sm:flex-row">
          <a
            href={preparedUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center justify-center rounded-lg bg-green-600 px-6 py-2 font-bold text-white transition-colors hover:bg-green-700"
          >
            Open WhatsApp
          </a>
          <button
            onClick={() => setStatus("idle")}
            aria-label="Send another enquiry"
            className="min-h-11 rounded-lg border border-green-300 bg-white px-6 py-2 font-bold text-green-800 transition-colors hover:bg-green-100"
          >
            Edit details
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={embedded ? "bg-white p-4 sm:p-6 lg:p-7" : "rounded-lg border border-gray-100 bg-white p-6 shadow-card"}>
      <h3 className="font-display mb-3 text-[26px] font-bold leading-tight text--brand-primary sm:text-3xl">Start with a free trip consultation</h3>
      <p className="mb-7 max-w-2xl text-[15px] leading-6 text--ink-muted">
        Add the essentials now. You can discuss hotels, transport, meals, and special requirements directly with the travel team.
      </p>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="enquiry-name" className="mb-1.5 block text-sm font-bold text--brand-primary">Full Name *</label>
            <input id="enquiry-name" name="name" required autoComplete="name" enterKeyHint="next" type="text" className="min-h-13 w-full rounded-xl border border--line bg--surface-card px-4 text-base outline-none transition focus:border--brand-secondary focus:ring-2 focus:ring--brand-secondary/20" placeholder="Enter your name" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="enquiry-email" className="mb-1.5 block text-sm font-bold text--brand-primary">Email Address *</label>
            <input id="enquiry-email" name="email" required autoComplete="email" enterKeyHint="next" spellCheck={false} type="email" className="min-h-13 w-full rounded-xl border border--line bg--surface-card px-4 text-base outline-none transition focus:border--brand-secondary focus:ring-2 focus:ring--brand-secondary/20" placeholder="name@example.com" />
          </div>
          <div>
            <label htmlFor="enquiry-phone" className="mb-1.5 block text-sm font-bold text--brand-primary">Phone Number *</label>
            <input ref={phoneInputRef} id="enquiry-phone" name="phone" required autoComplete="tel" enterKeyHint="next" inputMode="tel" type="tel" pattern="[0-9+()\s.-]{8,20}" title="Enter a valid phone number with 8–15 digits" aria-describedby="enquiry-phone-error" aria-invalid={phoneError ? true : undefined} onChange={() => phoneError && setPhoneError("")} className="min-h-13 w-full rounded-xl border border--line bg--surface-card px-4 text-base outline-none transition focus:border--brand-secondary focus:ring-2 focus:ring--brand-secondary/20" placeholder="98765 43210" />
            {phoneError ? (
              <p id="enquiry-phone-error" role="alert" className="mt-1.5 text-xs font-semibold text-red-600">{phoneError}</p>
            ) : (
              <p id="enquiry-phone-error" className="mt-1.5 text-xs text--ink-muted">Include your country code if you are outside India (e.g. +91).</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="enquiry-travel-date" className="mb-1.5 block text-sm font-bold text--brand-primary">Travel Date</label>
            <input id="enquiry-travel-date" name="travelDate" type="date" className="min-h-13 w-full rounded-xl border border--line bg--surface-card px-4 text-base outline-none transition focus:border--brand-secondary focus:ring-2 focus:ring--brand-secondary/20" />
          </div>
          <div>
            <label htmlFor="enquiry-travellers" className="mb-1.5 block text-sm font-bold text--brand-primary">No. of Travellers</label>
            <input id="enquiry-travellers" name="travellers" type="number" min="1" inputMode="numeric" className="min-h-13 w-full rounded-xl border border--line bg--surface-card px-4 text-base outline-none transition focus:border--brand-secondary focus:ring-2 focus:ring--brand-secondary/20" placeholder="E.g. 2" />
          </div>
        </div>

        <div>
          <label htmlFor="enquiry-message" className="mb-1.5 block text-sm font-bold text--brand-primary">Message (Optional)</label>
          <textarea id="enquiry-message" name="message" rows={4} className="w-full rounded-xl border border--line bg--surface-card p-4 text-base leading-6 outline-none transition focus:border--brand-secondary focus:ring-2 focus:ring--brand-secondary/20" placeholder="Share hotel preferences, accessibility needs, or anything else"></textarea>
        </div>
        
        <button 
          type="submit" 
          disabled={status === "loading"}
          className="min-h-13 w-full rounded-xl bg-brand-cta px-5 py-3 text-base font-extrabold text-ink shadow-[0_10px_24px_rgba(242,157,56,0.28)] transition hover:-translate-y-0.5 hover:bg-brand-cta-deep hover:shadow-[0_14px_28px_rgba(217,135,35,0.32)] disabled:bg-gray-400"
        >
          {status === "loading" ? "Preparing your message..." : "Continue on WhatsApp"}
        </button>
        <p className="mt-4 text-center text-xs leading-5 text--ink-muted">
          No payment required. Your details are used only to discuss this trip.
        </p>
      </form>
    </div>
  );
}
