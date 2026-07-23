import Link from "next/link";
import { siteConfig } from "@/data/siteConfig";
import { footerLinks } from "@/data/footerLinks";
import { MapPin, Phone, Mail, MessageCircle } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-legacy-footer-bg text-white text-[13px]">
      <div className="container mx-auto px-4 w-[95%] max-w-[1600px] pt-12 pb-6">
        
        {/* Top Section - Contacts & App Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10 pb-8 border-b border-legacy-footer-border">
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
                 <Phone className="w-4 h-4 mr-2 text-legacy-orange" /> {siteConfig.phone}
               </div>
               <div className="flex items-center text-gray-300">
                 <Mail className="w-4 h-4 mr-2" /> {siteConfig.email}
               </div>
            </div>
            
            <div className="flex flex-col items-center md:items-start w-full">
              <h4 className="text-[13px] text-gray-200 mb-1">Connect with us</h4>
              <p className="text-gray-400 text-[11px] mb-2">We regularly post about trending packages<br/>and travel knowledge.</p>
              <div className="flex space-x-2">
                 <a href="#" className="w-6 h-6 rounded-full bg-legacy-social-fb flex items-center justify-center text-white text-xs hover:opacity-80">f</a>
                 <a href="#" className="w-6 h-6 rounded-full bg-gray-500 flex items-center justify-center text-white hover:opacity-80"><span className="text-[9px] font-bold">IG</span></a>
                 <a href="#" className="w-6 h-6 rounded-full bg-black flex items-center justify-center text-white text-[9px] hover:opacity-80">X</a>
                 <a href="#" className="w-6 h-6 rounded-full bg-legacy-social-yt flex items-center justify-center text-white hover:opacity-80"><span className="text-[9px] font-bold">YT</span></a>
                 <a href="#" className="w-6 h-6 rounded-full bg-legacy-social-in flex items-center justify-center text-white hover:opacity-80"><span className="text-[9px] font-bold">in</span></a>
                 <a href="#" className="w-6 h-6 rounded-full bg-legacy-social-wa flex items-center justify-center text-white hover:opacity-80"><MessageCircle className="w-3 h-3"/></a>
              </div>
            </div>
          </div>

          {/* Mobile App */}
          <div className="flex flex-col items-end">
             <div>
                <h4 className="text-[15px] text-gray-200 mb-1">Our Mobile App</h4>
                <p className="text-gray-400 text-[11px] mb-3">Enjoy exclusive discounts and deals on holiday packages.</p>
                <div className="flex space-x-2">
                   {/* Placeholders for App Store buttons */}
                   <div className="bg-black border border-gray-600 rounded-md px-3 py-1 flex items-center cursor-pointer hover:bg-gray-800">
                      <div className="text-white text-xl mr-2">🍏</div>
                      <div className="leading-none">
                         <div className="text-[9px] text-gray-300">Download on the</div>
                         <div className="text-sm font-semibold">App Store</div>
                      </div>
                   </div>
                   <div className="bg-black border border-gray-600 rounded-md px-3 py-1 flex items-center cursor-pointer hover:bg-gray-800">
                      <div className="text-white text-xl mr-2">▶</div>
                      <div className="leading-none">
                         <div className="text-[9px] text-gray-300">GET IT ON</div>
                         <div className="text-sm font-semibold">Google Play</div>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mb-12">
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

        {/* Recognitions Banner Placeholder */}
        <div className="mb-8">
           <p className="text-gray-300 mb-3 text-sm">Recognized by Ministry of Tourism, Government of India.</p>
           <div className="w-full bg-white p-3 flex justify-between items-center overflow-x-auto rounded">
              {/* Placeholders for multiple recognition logos */}
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(i => (
                 <div key={i} className="h-10 w-16 bg-gray-200 border border-gray-300 shrink-0 mx-2 flex items-center justify-center text-[10px] text-gray-500">LOGO</div>
              ))}
           </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-legacy-footer-border pt-6 flex flex-col md:flex-row justify-between items-center text-[11px] text-gray-400">
          <div>
            Made with ❤️ in India<br/>
            © 2009 - {new Date().getFullYear()} {siteConfig.name} Pvt. Ltd. All Rights Reserved.
          </div>
          <div className="text-center mt-4 md:mt-0">
             <div className="text-gray-200 mb-1 text-[13px]">Website Support</div>
             &gt; Privacy Policy &nbsp; &gt; Terms & Conditions &nbsp; &gt; Site Map
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
