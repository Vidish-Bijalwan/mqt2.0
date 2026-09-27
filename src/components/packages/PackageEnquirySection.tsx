import EnquiryForm from "@/components/forms/EnquiryForm";

/** The "Make it yours" enquiry block under the tabs. */
export default function PackageEnquirySection({ pkgTitle }: { pkgTitle: string }) {
  return (
    <section id="enquiry-form" className="scroll-mt-24 overflow-hidden rounded-[24px] bg-[#0b302c] shadow-[0_22px_60px_rgba(7,38,34,0.2)]">
      <div className="px-6 pb-5 pt-8 text-white sm:px-9 sm:pt-10">
        <p className="text-[11px] font-extrabold uppercase tracking-[0.24em] text-[#f0a164]">Make it yours</p>
        <h2 className="font-display mt-2 text-[28px] font-bold leading-tight sm:text-4xl">Tell us how you want to travel</h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-white/70">Share your dates, group size, and preferences. Your message opens directly in WhatsApp for a real conversation with the travel team.</p>
      </div>
      <div className="bg-white p-2 sm:p-4"><EnquiryForm pkgName={pkgTitle} embedded /></div>
    </section>
  );
}
