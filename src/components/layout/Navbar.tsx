"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { siteConfig } from "@/data/siteConfig";
import { navLinks } from "@/data/navLinks";
import { Menu, X, Phone, Mail, MessageCircle, ChevronDown, ChevronRight } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedMobile, setExpandedMobile] = useState<string | null>(null);
  const [expandedMobileRegion, setExpandedMobileRegion] = useState<string | null>(null);

  // Lock body scroll while the mobile menu is open (U26)
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  return (
    <nav className="bg-white w-full relative z-[1000]">
      {/* 1. Top Bar - Gradient Premium */}
      <div className="bg-gradient-to-r from-legacy-orange to-[#f58120] text-white text-[13px] hidden lg:block shadow-sm">
        <div className="container mx-auto px-4 py-2 flex justify-between items-center w-[95%] max-w-[1600px] font-medium tracking-wide">
          <div className="flex items-center space-x-6">
            <a href={`mailto:${siteConfig.email}`} className="flex items-center hover:text-white/80 transition-colors"><Mail className="w-4 h-4 mr-2 opacity-90" /> {siteConfig.email}</a>
            <a href={`tel:${siteConfig.phoneRaw}`} className="flex items-center hover:text-white/80 transition-colors"><Phone className="w-4 h-4 mr-2 opacity-90" /> Customer Care: {siteConfig.phone}</a>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/careers" className="hover:text-white/80 transition-colors text-xs font-semibold uppercase tracking-wider">We Are Hiring!</Link>
            <span className="text-white/30">|</span>
            <Link href="/reviews" className="hover:text-white/80 transition-colors text-xs font-semibold uppercase tracking-wider">Write A Review</Link>
            <Link href="/pay-online" className="bg-white/10 hover:bg-white/20 px-4 py-1.5 rounded-full backdrop-blur-sm transition-all text-xs font-bold uppercase tracking-wider flex items-center shadow-sm">Pay Online</Link>
            <Link href="/my-booking" className="bg-gray-900 hover:bg-black text-white px-4 py-1.5 rounded-full transition-all text-xs font-bold uppercase tracking-wider shadow-md">My Booking</Link>
            <div className="ml-2 px-3 py-1.5 flex items-center bg-white text-gray-800 rounded-full text-xs font-bold cursor-pointer hover:bg-gray-50 transition-colors shadow-sm">
              <span className="mr-1.5 text-sm">🇬🇧</span> English <span className="text-[9px] ml-1.5 text-gray-400">▼</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Header — 80px desktop, 56px mobile (reference is ~50px) */}
      <div className="container mx-auto px-4 h-14 md:h-20 flex justify-between items-center w-[95%] max-w-[1600px]">
        {/* Logo Area — emblem + wordmark + tagline (reference-style lockup) */}
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-3 group">
             <div className="w-9 h-9 md:w-12 md:h-12 rounded-full overflow-hidden border-2 border-legacy-orange/40 shadow-sm group-hover:border-legacy-orange transition-colors shrink-0">
              <Image
                src="/images/mqt-logo-256.webp"
                alt="My Quick Trippers"
                width={48}
                height={48}
                className="w-full h-full object-cover"
                priority
              />
             </div>
             <div className="flex flex-col leading-tight">
               <span className="text-lg md:text-[22px] font-extrabold text-gray-900 tracking-tight whitespace-nowrap">
                 My Quick <span className="text-legacy-orange">Trippers</span>
               </span>
               <span className="text-[9px] md:text-[10px] text-gray-500 font-semibold uppercase tracking-[0.14em] whitespace-nowrap">
                 Your Journey, Our Expertise
               </span>
             </div>
          </Link>

          {/* Awards Badges Removed as per request */}
        </div>
        
        {/* Social Icons */}
        <div className="hidden lg:flex space-x-2.5">
           <a href={siteConfig.social.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="w-8 h-8 rounded-full bg-[#3b5998] flex items-center justify-center text-white hover:scale-110 shadow-sm hover:shadow-md transition-all duration-200">
              <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
           </a>
           <a href={siteConfig.social.twitter} target="_blank" rel="noopener noreferrer" aria-label="Twitter / X" className="w-8 h-8 rounded-full bg-[#1da1f2] flex items-center justify-center text-white hover:scale-110 shadow-sm hover:shadow-md transition-all duration-200">
              <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
           </a>
           <a href={siteConfig.social.youtube} target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="w-8 h-8 rounded-full bg-[#cd201f] flex items-center justify-center text-white hover:scale-110 shadow-sm hover:shadow-md transition-all duration-200">
              <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
           </a>
           <a href={siteConfig.social.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#f09433] via-[#e6683c] to-[#bc1888] flex items-center justify-center text-white hover:scale-110 shadow-sm hover:shadow-md transition-all duration-200">
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
           </a>
           <a href={siteConfig.social.whatsapp} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="w-8 h-8 rounded-full bg-[#25D366] flex items-center justify-center text-white hover:scale-110 shadow-sm hover:shadow-md transition-all duration-200"><MessageCircle className="w-4 h-4"/></a>
           <a href={siteConfig.social.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="w-8 h-8 rounded-full bg-[#007bb5] flex items-center justify-center text-white hover:scale-110 shadow-sm hover:shadow-md transition-all duration-200">
              <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
           </a>
        </div>

        {/* Mobile menu button */}
        <div className="lg:hidden flex items-center">
          <button onClick={() => setIsOpen(!isOpen)} className="text-legacy-nav-blue">
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* 3. Navigation Bar (Dark Blue) — 40px like reference header_bot */}
      <div className="bg-legacy-nav-blue text-white w-full hidden lg:block">
         <div className="container mx-auto w-[95%] max-w-[1600px] flex relative">
            {/* Home Icon — orange cell 40px tall like reference */}
            <Link href="/" className="bg-legacy-orange w-14 h-10 flex items-center justify-center hover:bg-legacy-orange-hover transition-colors nav-divider shrink-0">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                 <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
               </svg>
            </Link>

            {/* Nav Links */}
            <div className="flex flex-wrap text-[14px] font-bold">
               {navLinks.map((item, idx) => (
                  <div key={idx} className={`${item.megaMenu ? 'static' : 'relative'} group nav-divider`}>
                     {/* Nav item trigger */}
                     {item.submenus || item.links ? (
                       <div className="px-5 h-10 flex items-center cursor-pointer hover:text-legacy-orange transition-all duration-300 relative overflow-hidden">
                          {item.title} 
                          <span className="ml-1.5 text-[9px] opacity-70 group-hover:opacity-100 group-hover:rotate-180 transition-transform duration-300">▼</span>
                          <span className="absolute bottom-0 left-0 w-full h-[2px] bg-legacy-orange transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                       </div>
                     ) : (
                       <Link href={item.href || "#"} className="px-5 h-10 flex items-center cursor-pointer hover:text-legacy-orange transition-all duration-300 relative overflow-hidden">
                          {item.title}
                          <span className="absolute bottom-0 left-0 w-full h-[2px] bg-legacy-orange transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                       </Link>
                     )}
                     
                     {/* ===== MEGA MENU DROPDOWN ===== */}
                     {item.megaMenu && item.submenus && (
                        <div className="absolute top-full left-0 right-0 bg-white shadow-2xl border-t-[3px] border-legacy-orange opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 text-gray-700">
                           <div className={`grid gap-0 divide-x divide-gray-100 p-0`} 
                                style={{ gridTemplateColumns: `repeat(${item.submenus.length}, minmax(130px, 1fr))` }}>
                              {item.submenus.map((region, ridx) => (
                                 <div key={ridx} className="px-5 py-4">
                                    {/* Region Header */}
                                    <h4 className="text-legacy-orange font-bold text-[13px] mb-3 pb-2 border-b border-orange-100 uppercase tracking-wide">
                                       {region.title}
                                    </h4>
                                    {/* State Links */}
                                    <ul className="space-y-0">
                                       {region.links.map((link, lidx) => (
                                          <li key={lidx}>
                                             <Link 
                                                href={link.href} 
                                                className="flex items-center py-[6px] text-[13px] text-gray-700 hover:text-legacy-orange transition-colors group/link"
                                             >
                                                <span className="text-legacy-orange mr-2 text-[8px] opacity-70 group-hover/link:opacity-100">★</span>
                                                {link.name}
                                             </Link>
                                          </li>
                                       ))}
                                    </ul>
                                    {/* View More Button */}
                                    <Link 
                                       href={item.href || "#"}
                                       className="mt-3 inline-block text-[11px] font-bold text-legacy-orange border border-legacy-orange px-3 py-1 rounded-sm hover:bg-legacy-orange hover:text-white transition-colors uppercase tracking-wider"
                                    >
                                       View More »
                                    </Link>
                                 </div>
                              ))}
                           </div>
                        </div>
                     )}

                     {/* ===== SIMPLE DROPDOWN (for Pilgrimage, etc.) ===== */}
                     {!item.megaMenu && item.links && (
                        <div className="absolute top-full left-0 w-64 bg-white shadow-lg border-t-2 border-legacy-orange opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 text-gray-700 text-[13px]">
                           {item.links.map((link, lidx) => (
                              <Link key={lidx} href={link.href} className="block px-4 py-2.5 hover:bg-gray-50 hover:text-legacy-orange border-b border-gray-100 last:border-0 transition-colors">
                                 <span className="text-legacy-orange mr-2 text-[8px]">★</span>
                                 {link.name}
                              </Link>
                           ))}
                        </div>
                     )}

                     {/* ===== NON-MEGA SUBMENUS (fallback) ===== */}
                     {!item.megaMenu && item.submenus && (
                        <div className="absolute top-full left-0 w-64 bg-white shadow-lg border-t-2 border-legacy-orange opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 text-gray-700 text-[13px]">
                           {item.submenus.map((sub, sidx) => (
                              <div key={sidx}>
                                 <div className="px-4 py-2 bg-gray-50 font-bold border-b border-gray-100 text-legacy-orange">{sub.title}</div>
                                 {sub.links.map((link, lidx) => (
                                    <Link key={lidx} href={link.href} className="block px-4 py-2 hover:bg-gray-50 hover:text-legacy-orange border-b border-gray-100 last:border-0">
                                       {link.name}
                                    </Link>
                                 ))}
                              </div>
                           ))}
                        </div>
                     )}
                  </div>
               ))}
            </div>
         </div>
      </div>

      {/* ===== MOBILE NAV ===== */}
      {isOpen && (
        <div className="lg:hidden bg-legacy-nav-blue text-white px-4 pt-2 pb-4 shadow-lg absolute w-full left-0 z-50 max-h-[80vh] overflow-y-auto">
          <Link href="/" className="block py-3 border-b border-gray-700" onClick={() => setIsOpen(false)}>Home</Link>
          {navLinks.map((item, idx) => (
            <div key={idx} className="border-b border-gray-700">
              {item.submenus || item.links ? (
                <>
                  <button 
                    className="flex items-center justify-between w-full py-3 text-left font-medium"
                    onClick={() => setExpandedMobile(expandedMobile === item.title ? null : item.title)}
                  >
                    {item.title}
                    <ChevronDown className={`w-4 h-4 transition-transform ${expandedMobile === item.title ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {expandedMobile === item.title && (
                    <div className="pb-3">
                      {item.submenus && item.submenus.map((region) => (
                        <div key={region.title} className="mb-1">
                          <button 
                            className="flex items-center justify-between w-full px-4 py-2 text-legacy-orange font-bold text-sm"
                            onClick={() => setExpandedMobileRegion(expandedMobileRegion === region.title ? null : region.title)}
                          >
                            {region.title}
                            <ChevronRight className={`w-3 h-3 transition-transform ${expandedMobileRegion === region.title ? 'rotate-90' : ''}`} />
                          </button>
                          {expandedMobileRegion === region.title && (
                            <div className="pl-6 space-y-1 pb-2">
                              {region.links.map((link, lidx) => (
                                <Link key={lidx} href={link.href} className="block text-sm text-gray-300 py-1.5 hover:text-white" onClick={() => setIsOpen(false)}>
                                  <span className="text-legacy-orange mr-2 text-[8px]">★</span>
                                  {link.name}
                                </Link>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                      {item.links && item.links.map((link, lidx) => (
                        <Link key={lidx} href={link.href} className="block px-4 text-sm text-gray-300 py-2 hover:text-white" onClick={() => setIsOpen(false)}>
                          <span className="text-legacy-orange mr-2 text-[8px]">★</span>
                          {link.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <Link href={item.href || "#"} className="block py-3 font-medium" onClick={() => setIsOpen(false)}>
                  {item.title}
                </Link>
              )}
            </div>
          ))}
          
          <div className="mt-4 pt-4 border-t border-gray-700 flex flex-col space-y-4">
             <a href={`tel:${siteConfig.phoneRaw}`} className="flex items-center text-brand-green font-bold">
               <Phone className="w-5 h-5 mr-2" /> Call: {siteConfig.phone}
             </a>
          </div>
        </div>
      )}
    </nav>
  );
}
