"use client";

import { useState, useEffect, useRef } from "react";
import { siteConfig } from "@/data/siteConfig";
import { buildEnquiryWhatsappUrl } from "@/utils/enquiry";
import { trackEvent, getUtmProps } from "@/lib/analytics";

// Same email pattern the /api/enquiries route validates against — kept in
// sync so the client flags a typo before the fetch, instead of the server
// 400 dropping the form into the "couldn't save" fallback.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export default function EnquiryForm({ pkgName = "", pkgSlug, destination, embedded = false }: { pkgName?: string; pkgSlug?: string; destination?: string; embedded?: boolean }) {
  // `destination` is retained for campaign pages authored before `pkgName`
  // became the shared form API.
  const enquiryName = pkgName || destination || "";
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [preparedUrl, setPreparedUrl] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [travellersError, setTravellersError] = useState("");
  const [refId, setRefId] = useState<string | null>(null);
  const [fallbackNotice, setFallbackNotice] = useState(false);
  const successHeadingRef = useRef<HTMLHeadingElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const phoneInputRef = useRef<HTMLInputElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const travellersInputRef = useRef<HTMLInputElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);
  const startFiredRef = useRef(false);
  // Bot-speed check: the form was rendered at mount; submissions faster
  // than a human can type are rejected server-side.
  const renderedAtRef = useRef<number>(0);
  useEffect(() => {
    renderedAtRef.current = Date.now();
  }, []);
  // `enquiry_start` marks the first real interaction with the form (focus or
  // change), once per page view — a truer "started" signal than submit.
  const fireStartOnce = () => {
    if (startFiredRef.current) return;
    startFiredRef.current = true;
    trackEvent("enquiry_start", { package: enquiryName || "general" });
  };

  // Tier prefill: the package tier selector stores the visitor's choice in
  // sessionStorage before scrolling here. Carry it into the message so the
  // travel team sees which configuration was requested. One-shot read.
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("mqt-tier");
      if (!raw) return;
      const stored = JSON.parse(raw) as { packageTitle?: string; tier?: string; at?: number };
      sessionStorage.removeItem("mqt-tier");
      if (
        stored?.tier &&
        stored?.packageTitle &&
        stored.packageTitle === enquiryName &&
        messageRef.current &&
        !messageRef.current.value
      ) {
        messageRef.current.value = `I'm interested in the "${stored.tier}" option. `;
      }
    } catch {
      // Storage unavailable or malformed — form works normally.
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Trip Room prefill: the group trip room stores its consensus summary in
  // sessionStorage before navigating here. Carry it into the message so the
  // travel team sees the group's agreed destination/dates/budget. One-shot.
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("mqt-room");
      if (!raw) return;
      const stored = JSON.parse(raw) as {
        destination?: string;
        dates?: string;
        budget?: string;
        partySize?: number;
      };
      sessionStorage.removeItem("mqt-room");
      if (messageRef.current && !messageRef.current.value) {
        const bits = [
          stored?.destination ? `destination: ${stored.destination}` : "",
          stored?.dates ? `dates: ${stored.dates}` : "",
          stored?.budget ? `budget: ${stored.budget}` : "",
          stored?.partySize ? `group of ~${stored.partySize}` : "",
        ].filter(Boolean);
        if (bits.length > 0) {
          messageRef.current.value = `We're planning a group trip (${bits.join(", ")}). `;
        }
      }
    } catch {
      // Storage unavailable or malformed — form works normally.
    }
  }, []);

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
    setFallbackNotice(false);
    setRefId(null);

    const form = e.currentTarget;
    const data = new FormData(form);
    const phone = String(data.get("phone") || "");
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

    const details = {
      packageName: enquiryName,
      name: String(data.get("name") || "").trim(),
      email: String(data.get("email") || "").trim(),
      phone,
      travelDate: String(data.get("travelDate") || ""),
      travellers: String(data.get("travellers") || ""),
      message: String(data.get("message") || ""),
    };
    if (details.name.length < 2) {
      setNameError("Please enter your full name (at least 2 characters).");
      nameInputRef.current?.focus();
      setStatus("idle");
      return;
    }
    setNameError("");

    // Email is optional, but a typo'd address fails server-side validation and
    // the form would drop into the "couldn't save" fallback instead of
    // flagging the typo — catch it here with the same pattern the API uses.
    if (details.email && !EMAIL_RE.test(details.email)) {
      setEmailError("That email address doesn't look right — please check it.");
      emailInputRef.current?.focus();
      setStatus("idle");
      return;
    }
    setEmailError("");

    // The API caps travellers at 50; a larger value fails server-side with
    // the same misleading fallback — flag the range before the fetch.
    if (details.travellers) {
      const n = Number(details.travellers);
      if (!Number.isInteger(n) || n < 1 || n > 50) {
        setTravellersError("Please enter between 1 and 50 travellers.");
        travellersInputRef.current?.focus();
        setStatus("idle");
        return;
      }
    }
    setTravellersError("");

    // Submit to the real lead-capture API FIRST. The team is notified
    // server-side; the visitor still gets the WhatsApp thread to continue
    // the conversation.
    let apiOk = false;
    let ref: string | null = null;
    try {
      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: details.name,
          phone: details.phone,
          email: details.email || null,
          packageName: details.packageName || null,
          packageSlug: pkgSlug || null,
          travelDate: details.travelDate || null,
          travellers: details.travellers || null,
          message: details.message || null,
          sourceUrl: window.location.href,
          utm: getUtmProps(),
          company: String(data.get("company") || ""), // honeypot — humans leave it empty
          formRenderedAt: renderedAtRef.current,
        }),
      });
      if (res.ok) {
        const json = (await res.json()) as { ok?: boolean; ref?: string | null };
        apiOk = json.ok === true;
        ref = typeof json.ref === "string" ? json.ref : null;
      }
    } catch {
      apiOk = false;
    }

    const whatsappUrl = buildEnquiryWhatsappUrl(siteConfig.social.whatsapp, {
      ...details,
      ref,
    });
    setPreparedUrl(whatsappUrl);

    if (apiOk) {
      // Honest conversion event: the lead is genuinely stored now — this no
      // longer fires on a mere WhatsApp-open.
      trackEvent("enquiry_submit", { package: enquiryName || "general", ...getUtmProps() });
      form.reset(); // clear PII — nothing persists client-side after submit
      setRefId(ref);
      // Best effort: popup blockers may stop this; the success panel below
      // carries an explicit "Open WhatsApp" button as backup.
      window.open(whatsappUrl, "_blank", "noopener,noreferrer");
      setStatus("success");
    } else {
      // Graceful degradation: the API is unavailable or unconfigured — keep
      // the WhatsApp handoff so the lead is not lost, and say so honestly.
      trackEvent("enquiry_submit", {
        package: enquiryName || "general",
        fallback: true,
        ...getUtmProps(),
      });
      setFallbackNotice(true);
      window.open(whatsappUrl, "_blank", "noopener,noreferrer");
      setStatus("success");
    }
  };

  if (status === "success") {
    return (
      <div className="bg-green-50 border border-green-200 text-green-700 p-8 rounded-lg text-center animate-in fade-in zoom-in duration-300">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 ref={successHeadingRef} tabIndex={-1} className="mb-2 text-xl font-bold">
          {fallbackNotice ? "Your WhatsApp message is ready" : "Enquiry received"}
        </h3>
        {refId ? (
          <p className="mb-2 text-green-700">
            Reference <span className="font-mono font-bold">{refId}</span> — our travel team
            has your details and will reach out shortly.
          </p>
        ) : null}
        <p className="mb-5 text-green-700">
          {fallbackNotice
            ? "Our online form couldn't save your enquiry just now — please press send in WhatsApp so we don't lose it."
            : "Continue the conversation with our travel team on WhatsApp. If it did not open automatically, use the button below."}
        </p>
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
            Send another enquiry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={embedded ? "bg-white p-4 sm:p-6 lg:p-7" : "rounded-lg border border-gray-100 bg-white p-6 shadow-card"}>
      <h3 className="font-display mb-3 text-[26px] font-bold leading-tight text-brand-primary sm:text-3xl">Start with a free trip consultation</h3>
      <p className="mb-7 max-w-2xl text-[15px] leading-6 text-ink-muted">
        Add the essentials now. You can discuss hotels, transport, meals, and special requirements directly with the travel team.
      </p>
      
      <form onSubmit={handleSubmit} onFocus={fireStartOnce} onChange={fireStartOnce} className="space-y-4">
        {/* Honeypot: invisible to humans, bots fill it in. */}
        <div aria-hidden="true" style={{ position: "absolute", left: "-9999px", top: 0, height: 1, width: 1, overflow: "hidden" }}>
          <label>Company
            <input type="text" name="company" tabIndex={-1} autoComplete="off" />
          </label>
        </div>
        <div>
          <label htmlFor="enquiry-name" className="mb-1.5 block text-sm font-bold text-brand-primary">Full Name *</label>
            <input ref={nameInputRef} id="enquiry-name" name="name" required autoComplete="name" enterKeyHint="next" type="text" aria-describedby="enquiry-name-error" aria-invalid={nameError ? true : undefined} onChange={() => nameError && setNameError("")} className="min-h-13 w-full rounded-xl border border-line bg-surface-card px-4 text-base outline-none transition focus:border-brand-secondary focus:ring-2 focus:ring-brand-secondary/20" placeholder="Enter your name" />
            {nameError ? (
              <p id="enquiry-name-error" role="alert" className="mt-1.5 text-xs font-semibold text-red-600">{nameError}</p>
            ) : (
              <p id="enquiry-name-error" className="mt-1.5 text-xs text-ink-muted">Enter your full name as it should appear on your booking.</p>
            )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="enquiry-email" className="mb-1.5 block text-sm font-bold text-brand-primary">Email Address <span className="font-normal text-ink-muted">(optional)</span></label>
            <input ref={emailInputRef} id="enquiry-email" name="email" autoComplete="email" enterKeyHint="next" spellCheck={false} type="email" aria-describedby="enquiry-email-error" aria-invalid={emailError ? true : undefined} onChange={() => emailError && setEmailError("")} className="min-h-13 w-full rounded-xl border border-line bg-surface-card px-4 text-base outline-none transition focus:border-brand-secondary focus:ring-2 focus:ring-brand-secondary/20" placeholder="name@example.com" />
            {emailError ? (
              <p id="enquiry-email-error" role="alert" className="mt-1.5 text-xs font-semibold text-red-600">{emailError}</p>
            ) : (
              <p id="enquiry-email-error" className="mt-1.5 text-xs text-ink-muted">We&apos;ll use this only to send your trip details.</p>
            )}
          </div>
          <div>
            <label htmlFor="enquiry-phone" className="mb-1.5 block text-sm font-bold text-brand-primary">Phone Number *</label>
            <input ref={phoneInputRef} id="enquiry-phone" name="phone" required autoComplete="tel" enterKeyHint="next" inputMode="tel" type="tel" pattern="[0-9+()\s.-]{8,20}" title="Enter a valid phone number with 8–15 digits" aria-describedby="enquiry-phone-error" aria-invalid={phoneError ? true : undefined} onChange={() => phoneError && setPhoneError("")} className="min-h-13 w-full rounded-xl border border-line bg-surface-card px-4 text-base outline-none transition focus:border-brand-secondary focus:ring-2 focus:ring-brand-secondary/20" placeholder="98765 43210" />
            {phoneError ? (
              <p id="enquiry-phone-error" role="alert" className="mt-1.5 text-xs font-semibold text-red-600">{phoneError}</p>
            ) : (
              <p id="enquiry-phone-error" className="mt-1.5 text-xs text-ink-muted">Include your country code if you are outside India (e.g. +91).</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="enquiry-travel-date" className="mb-1.5 block text-sm font-bold text-brand-primary">Travel Date</label>
            <input id="enquiry-travel-date" name="travelDate" type="date" className="min-h-13 w-full rounded-xl border border-line bg-surface-card px-4 text-base outline-none transition focus:border-brand-secondary focus:ring-2 focus:ring-brand-secondary/20" />
          </div>
          <div>
            <label htmlFor="enquiry-travellers" className="mb-1.5 block text-sm font-bold text-brand-primary">No. of Travellers</label>
            <input ref={travellersInputRef} id="enquiry-travellers" name="travellers" type="number" min="1" max="50" inputMode="numeric" aria-describedby="enquiry-travellers-error" aria-invalid={travellersError ? true : undefined} onChange={() => travellersError && setTravellersError("")} className="min-h-13 w-full rounded-xl border border-line bg-surface-card px-4 text-base outline-none transition focus:border-brand-secondary focus:ring-2 focus:ring-brand-secondary/20" placeholder="E.g. 2" />
            {travellersError ? (
              <p id="enquiry-travellers-error" role="alert" className="mt-1.5 text-xs font-semibold text-red-600">{travellersError}</p>
            ) : (
              <p id="enquiry-travellers-error" className="mt-1.5 text-xs text-ink-muted">Adults + children travelling (max 50).</p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="enquiry-message" className="mb-1.5 block text-sm font-bold text-brand-primary">Message (Optional)</label>
          <textarea ref={messageRef} id="enquiry-message" name="message" rows={4} className="w-full rounded-xl border border-line bg-surface-card p-4 text-base leading-6 outline-none transition focus:border-brand-secondary focus:ring-2 focus:ring-brand-secondary/20" placeholder="Share hotel preferences, accessibility needs, or anything else"></textarea>
        </div>
        
        <button 
          type="submit" 
          disabled={status === "loading"}
          className="min-h-13 w-full rounded-xl bg-brand-cta px-5 py-3 text-base font-extrabold text-ink shadow-[0_10px_24px_rgba(242,157,56,0.28)] transition hover:-translate-y-0.5 hover:bg-brand-cta-deep hover:shadow-[0_14px_28px_rgba(217,135,35,0.32)] disabled:bg-gray-400"
        >
          {status === "loading" ? "Sending your enquiry..." : "Send Enquiry"}
        </button>
        <p className="mt-4 text-center text-xs leading-5 text-ink-muted">
          No payment required. Your details are used only to discuss this trip.
        </p>
      </form>
    </div>
  );
}
