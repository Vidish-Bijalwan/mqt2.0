import Link from "next/link";
import Image from "next/image";
import { siteConfig } from "@/data/siteConfig";
import { footerLinks } from "@/data/footerLinks";
import { MapPin, Phone, Mail, MessageCircle } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-brand-navy text-white text-[13px]">
      <div className="container mx-auto px-4 w-[95%] max-w-[1600px] pt-12 pb-6">
        
        {/* Top Section - Contacts & App Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10 pb-8 border-b border-brand-navy-light">
          {/* Regional Offices */}
          <div>
            <h4 className="text-[15px] text-gray-200 mb-3">Regional Associates Offices</h4>
            <div className="text-gray-400 space-y-1">
              <p><strong className="text-gray-200">Head Office</strong> - {siteConfig.address.full}</p>
              <p><strong className="text-gray-200">Branch Offices</strong> - Delhi | Ujjain | Hyderabad | Pune | Kashmir | Bengaluru | Dehradun</p>
              <p><strong className="text-gray-200">Overseas Offices</strong> - USA | Sri Lanka | Nepal</p>
            </div>
          </div>

          {/* Customer Support & Socials */}
          <div className="flex flex-col md:items-center">
            <div className="mb-4 text-center md:text-left">
               <h4 className="text-[15px] text-gray-200 mb-1">Customer Support</h4>
               <p className="text-gray-400 text-[11px] mb-2">Request a quote, or just chat about your next vacation.<br/>We're always happy to help!</p>
               <div className="flex items-center text-legacy-orange font-bold text-lg mb-1">
                 <Phone className="w-4 h-4 mr-2 text-brand-green" /> {siteConfig.phone}
               </div>
               <div className="flex items-center text-gray-300">
                 <Mail className="w-4 h-4 mr-2" /> {siteConfig.email}
               </div>
            </div>
            
            <div className="flex flex-col items-center md:items-start w-full">
              <h4 className="text-[13px] text-gray-200 mb-1">Connect with us</h4>
              <p className="text-gray-400 text-[11px] mb-2">We regularly post about trending packages<br/>and travel knowledge.</p>
              <div className="flex space-x-2">
                 <a href={siteConfig.social.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="w-10 h-10 rounded-full bg-legacy-social-fb flex items-center justify-center text-white text-xs hover:opacity-80">f</a>
                 <a href={siteConfig.social.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="w-10 h-10 rounded-full bg-gray-500 flex items-center justify-center text-white hover:opacity-80"><span className="text-[10px] font-bold">IG</span></a>
                 <a href={siteConfig.social.twitter} target="_blank" rel="noopener noreferrer" aria-label="Twitter / X" className="w-10 h-10 rounded-full bg-black flex items-center justify-center text-white text-[10px] hover:opacity-80">X</a>
                 <a href={siteConfig.social.youtube} target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="w-10 h-10 rounded-full bg-legacy-social-yt flex items-center justify-center text-white hover:opacity-80"><span className="text-[10px] font-bold">YT</span></a>
                 <a href={siteConfig.social.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="w-10 h-10 rounded-full bg-legacy-social-in flex items-center justify-center text-white hover:opacity-80"><span className="text-[10px] font-bold">in</span></a>
                 <a href={siteConfig.social.whatsapp} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="w-10 h-10 rounded-full bg-legacy-social-wa flex items-center justify-center text-white hover:opacity-80"><MessageCircle className="w-3 h-3"/></a>
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="flex flex-col items-end">
             <div>
                <h4 className="text-[15px] text-gray-200 mb-1">Get in Touch</h4>
                <p className="text-gray-400 text-[11px] mb-3">Call or WhatsApp us for instant support.</p>
                <div className="flex space-x-2">
                   <a href="tel:8171158569" className="bg-legacy-orange hover:bg-orange-600 text-white rounded-md px-4 py-2 text-sm font-semibold transition-colors">
                      📞 Call Now
                   </a>
                   <a href="https://wa.me/918171158569" target="_blank" rel="noopener noreferrer" className="bg-green-600 hover:bg-green-700 text-white rounded-md px-4 py-2 text-sm font-semibold transition-colors">
                      💬 WhatsApp
                   </a>
                </div>
             </div>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mb-12">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 mb-3">
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-legacy-orange/40 shrink-0">
                <Image
                  src="/images/mqt-logo-256.webp"
                  alt="My Quick Trippers"
                  width={40}
                  height={40}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-lg font-extrabold text-white leading-tight">
                My Quick <span className="text-legacy-orange">Trippers</span>
              </span>
            </Link>
            <p className="text-[11px] text-gray-400 leading-relaxed mb-3">
              {siteConfig.tagline} — {siteConfig.description}
            </p>
            <p className="text-[11px] text-gray-500">
              Govt. Approved · ISO 9001 - 2008 Certified
            </p>
          </div>
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-[15px] text-gray-200 mb-4">{title}</h4>
              <ul className="space-y-2">
                {links.map((link, idx) => (
                  <li key={idx} className="flex items-center">
                    <span className="w-1.5 h-1.5 bg-white mr-2 block"></span>
                    <Link href={link.href} className="text-gray-400 hover:text-white transition-colors">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Recognitions */}
        <div className="mb-8">
           <p className="text-gray-300 mb-1 text-sm">Recognized by Ministry of Tourism, Government of India.</p>
        </div>

        {/* Copyright */}
        <div className="border-t border-legacy-footer-border pt-6 flex flex-col md:flex-row justify-between items-center text-[11px] text-gray-400">
          <div>
            Made with ❤️ in India<br/>
            © 2009 - {new Date().getFullYear()} {siteConfig.name} Pvt. Ltd. All Rights Reserved.
          </div>
          <div className="text-center mt-4 md:mt-0">
             <div className="text-gray-200 mb-1 text-[13px]">Website Support</div>
             <div className="flex flex-wrap items-center justify-center gap-x-2 text-gray-400">
               <Link href="/privacy-policy" className="hover:text-legacy-orange transition-colors">Privacy Policy</Link>
               <span>&gt;</span>
               <Link href="/terms-and-conditions" className="hover:text-legacy-orange transition-colors">Terms & Conditions</Link>
               <span>&gt;</span>
               <Link href="/site-map" className="hover:text-legacy-orange transition-colors">Site Map</Link>
             </div>
          </div>
          <div className="mt-4 md:mt-0 text-right">
             <div className="text-gray-200 mb-1 text-[13px]">Payments on website are secure</div>
             <div className="flex space-x-1">
                <div className="bg-white px-2 py-1 text-[10px] text-black font-bold rounded">MasterCard</div>
                <div className="bg-white px-2 py-1 text-[10px] text-blue-800 font-bold rounded italic">VISA</div>
                <div className="bg-white px-2 py-1 text-[10px] text-blue-500 font-bold rounded">PayPal</div>
                <div className="bg-white px-2 py-1 text-[10px] text-blue-400 font-bold rounded">AMEX</div>
             </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
