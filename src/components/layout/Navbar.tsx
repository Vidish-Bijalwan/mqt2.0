"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { siteConfig } from "@/data/siteConfig";
import { navLinks } from "@/data/navLinks";
import { Menu, X, Phone, Mail, MessageCircle, ChevronDown, ChevronRight } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedMobile, setExpandedMobile] = useState<string | null>(null);
  const [expandedMobileRegion, setExpandedMobileRegion] = useState<string | null>(null);

  return (
    <nav className="bg-white w-full relative z-[1000]">
      {/* 1. Top Bar - Orange */}
      <div className="bg-legacy-orange text-white text-[13px] hidden lg:block">
        <div className="container mx-auto px-4 py-1.5 flex justify-between items-center w-[95%] max-w-[1600px]">
          <div className="flex items-center space-x-6">
            <span className="flex items-center"><Mail className="w-3.5 h-3.5 mr-1.5" /> {siteConfig.email}</span>
            <span className="flex items-center"><Phone className="w-3.5 h-3.5 mr-1.5" /> Customer Care: {siteConfig.phone}</span>
          </div>
          <div className="flex items-center">
            <Link href="/careers" className="hover:underline px-3 nav-divider">We Are Hiring!</Link>
            <Link href="/reviews" className="hover:underline px-3 nav-divider">Write A Review</Link>
            <Link href="/pay-online" className="hover:underline px-3 nav-divider bg-green-700 font-bold">Pay Online</Link>
            <Link href="/my-booking" className="hover:underline px-3 nav-divider bg-black text-white font-bold">My Booking</Link>
            <div className="px-3 flex items-center bg-gray-100 text-gray-800">
              <span className="mr-1">🇬🇧</span> English <span className="text-[10px] ml-1">▼</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Header */}
      <div className="container mx-auto px-4 py-3 flex justify-between items-center w-[95%] max-w-[1600px]">
        {/* Logo Area */}
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center">
             <div className="flex flex-col">
               <div className="flex items-center h-12">
                 <Image src="/images/mqt-logo.png" alt="My Quick Trippers" width={180} height={48} className="object-contain h-full" style={{ width: "auto" }} priority />
               </div>
             </div>
          </Link>

          {/* Awards Badges */}
          <div className="hidden md:flex items-center ml-8 border-l pl-8 gap-4 border-gray-200">
             <div className="flex flex-col">
               <span className="text-sm font-bold text-gray-800">Govt. Approved</span>
               <span className="text-xs text-gray-500 font-medium">ISO 9001 - 2008 Certified</span>
             </div>
          </div>
        </div>
        
        {/* Social Icons */}
        <div className="hidden lg:flex space-x-2">
           <a href="#" className="w-8 h-8 rounded-full bg-[#3b5998] flex items-center justify-center text-white hover:opacity-80 transition-opacity">
              <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
           </a>
           <a href="#" className="w-8 h-8 rounded-full bg-[#1da1f2] flex items-center justify-center text-white hover:opacity-80 transition-opacity">
              <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
           </a>
           <a href="#" className="w-8 h-8 rounded-full bg-[#cd201f] flex items-center justify-center text-white hover:opacity-80 transition-opacity">
              <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
           </a>
           <a href="#" className="w-8 h-8 rounded-full bg-[#c32aa3] flex items-center justify-center text-white hover:opacity-80 transition-opacity">
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
           </a>
           <a href="#" className="w-8 h-8 rounded-full bg-[#25D366] flex items-center justify-center text-white hover:opacity-80 transition-opacity"><MessageCircle className="w-4 h-4"/></a>
           <a href="#" className="w-8 h-8 rounded-full bg-[#007bb5] flex items-center justify-center text-white hover:opacity-80 transition-opacity">
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

      {/* 3. Navigation Bar (Dark Blue) */}
      <div className="bg-legacy-nav-blue text-white w-full hidden lg:block">
         <div className="container mx-auto w-[95%] max-w-[1600px] flex relative">
            {/* Home Icon */}
            <Link href="/" className="bg-legacy-orange p-3.5 flex items-center justify-center hover:bg-legacy-orange-hover transition-colors nav-divider">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                 <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
               </svg>
            </Link>

            {/* Nav Links */}
            <div className="flex flex-wrap text-[14px]">
               {navLinks.map((item, idx) => (
                  <div key={idx} className={`${item.megaMenu ? 'static' : 'relative'} group nav-divider`}>
                     {/* Nav item trigger */}
                     {item.submenus || item.links ? (
                       <div className="px-4 py-3.5 flex items-center cursor-pointer hover:bg-legacy-nav-blue-hover transition-colors">
                          {item.title} 
                          <span className="ml-1 text-[10px]">▼</span>
                       </div>
                     ) : (
                       <Link href={item.href || "#"} className="px-4 py-3.5 flex items-center cursor-pointer hover:bg-legacy-nav-blue-hover transition-colors">
                          {item.title}
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
