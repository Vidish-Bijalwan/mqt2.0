"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState, useRef, useCallback } from "react";
import { siteConfig } from "@/data/siteConfig";
import { navLinks } from "@/data/navLinks";
import { Menu, X, Phone, Mail, MessageCircle, ChevronDown, ChevronRight } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedMobile, setExpandedMobile] = useState<string | null>(null);
  const [expandedMobileRegion, setExpandedMobileRegion] = useState<string | null>(null);
  const [hoveredMenu, setHoveredMenu] = useState<string | null>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const navBarRef = useRef<HTMLDivElement>(null);
  const [megaMenuTop, setMegaMenuTop] = useState(0);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const calculateTop = useCallback(() => {
    if (navBarRef.current) {
      setMegaMenuTop(navBarRef.current.getBoundingClientRect().bottom);
    }
  }, []);

  const handleMenuEnter = useCallback((title: string) => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    calculateTop();
    setHoveredMenu(title);
  }, [calculateTop]);

  const handleMenuLeave = useCallback(() => {
    hoverTimeoutRef.current = setTimeout(() => {
      setHoveredMenu(null);
    }, 120);
  }, []);

  return (
    <nav className="bg-white w-full relative z-[1000]">
      {/* ── 1. Top Bar ── */}
      <div className="bg-gradient-to-r from-[#e65100] via-[#f57c00] to-[#ff9800] text-white text-[13px] hidden lg:block">
        <div className="container mx-auto px-4 py-2.5 flex justify-between items-center w-[95%] max-w-[1600px] font-medium tracking-wide">
          <div className="flex items-center space-x-6">
            <a href={`mailto:${siteConfig.email}`} className="flex items-center hover:text-white/80 transition-colors">
              <Mail className="w-4 h-4 mr-2" /> {siteConfig.email}
            </a>
            <a href={`tel:${siteConfig.phoneRaw}`} className="flex items-center hover:text-white/80 transition-colors">
              <Phone className="w-4 h-4 mr-2" /> Customer Care: {siteConfig.phone}
            </a>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/careers" className="hover:text-white/80 transition-colors text-xs font-bold uppercase tracking-wider">We Are Hiring!</Link>
            <span className="text-white/40">|</span>
            <Link href="/reviews" className="hover:text-white/80 transition-colors text-xs font-bold uppercase tracking-wider">Write A Review</Link>
            <Link href="/pay-online" className="bg-white/15 hover:bg-white/25 px-4 py-1.5 rounded-full backdrop-blur-sm transition-colors text-xs font-bold uppercase tracking-wider">Pay Online</Link>
            <Link href="/my-booking" className="bg-gray-900 hover:bg-black text-white px-4 py-1.5 rounded-full transition-colors text-xs font-bold uppercase tracking-wider">My Booking</Link>
            <button type="button" aria-label="Language selector" className="ml-2 px-3 py-1.5 flex items-center bg-white text-gray-800 rounded-full text-xs font-bold">
              <span className="mr-1.5 text-sm">🇬🇧</span> English
            </button>
          </div>
        </div>
      </div>

      {/* ── 2. Main Header ── */}
      <div className="container mx-auto px-4 h-[70px] md:h-[85px] flex justify-between items-center w-[95%] max-w-[1600px]">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-11 h-11 md:w-14 md:h-14 rounded-full overflow-hidden border-3 border-[#f97316] shadow-md group-hover:shadow-lg group-hover:border-[#ea580c] transition-all shrink-0">
            <Image src="/images/mqt-logo-256.webp" alt="My Quick Trippers" width={56} height={56} className="w-full h-full object-cover" priority />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-xl md:text-[26px] font-black text-gray-900 tracking-tight whitespace-nowrap">
              My Quick <span className="text-[#f97316]">Trippers</span>
            </span>
            <span className="text-[10px] md:text-[11px] text-gray-500 font-semibold uppercase tracking-[0.16em] whitespace-nowrap">
              Your Journey, Our Expertise
            </span>
          </div>
        </Link>
        
        {/* Social Icons */}
        <div className="hidden lg:flex items-center space-x-2">
          <a href={siteConfig.social.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="w-9 h-9 rounded-full bg-[#3b5998] flex items-center justify-center text-white hover:scale-110 transition-all duration-200">
            <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
          </a>
          <a href={siteConfig.social.youtube} target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="w-9 h-9 rounded-full bg-[#cd201f] flex items-center justify-center text-white hover:scale-110 transition-all duration-200">
            <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
          </a>
          <a href={siteConfig.social.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#f09433] via-[#e6683c] to-[#bc1888] flex items-center justify-center text-white hover:scale-110 transition-all duration-200">
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
          </a>
          <a href={siteConfig.social.whatsapp} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="w-9 h-9 rounded-full bg-[#25D366] flex items-center justify-center text-white hover:scale-110 transition-all duration-200">
            <MessageCircle className="w-4 h-4"/>
          </a>
          <a href={siteConfig.social.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="w-9 h-9 rounded-full bg-[#007bb5] flex items-center justify-center text-white hover:scale-110 transition-all duration-200">
            <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-1.236 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
          </a>
        </div>

        {/* Mobile menu button */}
        <div className="lg:hidden flex items-center">
          <button type="button" onClick={() => setIsOpen(!isOpen)} aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"} aria-expanded={isOpen} className="min-h-12 min-w-12 inline-flex items-center justify-center rounded-md text-[#1a2744]">
            {isOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
          </button>
        </div>
      </div>

      {/* ── 3. Main Navigation Bar (FAT & BOLD) ── */}
      <div ref={navBarRef} className="bg-[#1a2744] text-white w-full hidden lg:block relative">
        <div className="container mx-auto w-[95%] max-w-[1600px] flex relative">
          {/* Home Icon */}
          <Link href="/" className="bg-[#f97316] w-[60px] h-[48px] flex items-center justify-center hover:bg-[#ea580c] transition-colors shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
          </Link>

          {/* Nav Links — FAT items */}
          <div className="flex flex-1 min-w-0 flex-nowrap text-[13px] xl:text-[14px] font-bold">
            {navLinks.map((item, idx) => (
              <div 
                key={idx} 
                className="relative"
                onMouseEnter={() => (item.submenus || item.links) && handleMenuEnter(item.title)}
                onMouseLeave={() => (item.submenus || item.links) && handleMenuLeave()}
              >
                {item.submenus || item.links ? (
                  <button
                    type="button"
                    aria-label={`Open ${item.title} menu`}
                    className={`px-3 xl:px-4 h-[48px] whitespace-nowrap flex items-center cursor-pointer transition-all duration-150 ${
                      hoveredMenu === item.title 
                        ? 'text-[#f97316] bg-white/10' 
                        : 'hover:text-[#f97316] hover:bg-white/5'
                    }`}
                  >
                    {item.title} 
                    <ChevronDown className={`ml-1.5 w-3.5 h-3.5 transition-transform duration-200 ${hoveredMenu === item.title ? 'rotate-180' : ''}`} />
                  </button>
                ) : (
                  <Link href={item.href || "#"} className="px-3 xl:px-4 h-[48px] whitespace-nowrap flex items-center hover:text-[#f97316] hover:bg-white/5 transition-all duration-150">
                    {item.title}
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════
           MEGA MENU — fixed, full-width, fat with lots of padding
         ══════════════════════════════════════════════════════════════════ */}
      {hoveredMenu && navLinks.find(n => n.title === hoveredMenu && n.megaMenu && n.submenus) && (() => {
        const activeItem = navLinks.find(n => n.title === hoveredMenu)!;
        return (
          <div
            className="hidden lg:block"
            style={{ position: 'fixed', top: megaMenuTop, left: 0, width: '100vw', zIndex: 9999 }}
            onMouseEnter={() => handleMenuEnter(hoveredMenu)}
            onMouseLeave={handleMenuLeave}
          >
            {/* Orange accent bar */}
            <div className="h-[4px] bg-gradient-to-r from-[#f97316] via-[#fb923c] to-[#f97316]" />
            <div className="bg-white shadow-[0_12px_40px_rgba(0,0,0,0.18)] border-b border-gray-200">
              <div className="container mx-auto w-[95%] max-w-[1600px]">
                <div className="grid" style={{ gridTemplateColumns: `repeat(${activeItem.submenus!.length}, minmax(170px, 1fr))` }}>
                  {activeItem.submenus!.map((region, ridx) => (
                    <div key={ridx} className="px-6 py-6 border-r border-gray-100 last:border-r-0">
                      <h4 className="text-[#f97316] font-extrabold text-[14px] mb-4 pb-3 border-b-2 border-orange-100 uppercase tracking-wider">
                        {region.title}
                      </h4>
                      <ul className="space-y-1">
                        {region.links.map((link, lidx) => (
                          <li key={lidx}>
                            <Link href={link.href} className="flex items-center py-[8px] text-[14px] text-gray-700 hover:text-[#f97316] hover:bg-orange-50/60 transition-colors rounded-md px-2 -mx-2">
                              <span className="text-[#f97316] mr-2.5 text-[11px]">★</span>
                              {link.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                      <Link href={activeItem.href || "#"} className="mt-4 inline-block text-[11px] font-bold text-[#f97316] border-2 border-[#f97316] px-4 py-2 rounded hover:bg-[#f97316] hover:text-white transition-all uppercase tracking-wider">
                        View More →
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ══════════════════════════════════════════════════════════════════
           SIMPLE DROPDOWN — fixed, full-width, fat
         ══════════════════════════════════════════════════════════════════ */}
      {hoveredMenu && navLinks.find(n => n.title === hoveredMenu && !n.megaMenu && n.links) && (() => {
        const activeItem = navLinks.find(n => n.title === hoveredMenu)!;
        return (
          <div
            className="hidden lg:block"
            style={{ position: 'fixed', top: megaMenuTop, left: 0, width: '100vw', zIndex: 9999 }}
            onMouseEnter={() => handleMenuEnter(hoveredMenu)}
            onMouseLeave={handleMenuLeave}
          >
            <div className="h-[3px] bg-[#f97316]" />
            <div className="bg-white shadow-[0_8px_30px_rgba(0,0,0,0.15)]">
              <div className="container mx-auto w-[95%] max-w-[1600px] py-5">
                <div className="flex flex-wrap gap-x-2 gap-y-2">
                  {activeItem.links!.map((link, lidx) => (
                    <Link key={lidx} href={link.href} className="flex items-center py-2.5 px-4 text-[14px] font-medium text-gray-700 hover:bg-orange-50 hover:text-[#f97316] rounded-lg transition-all border border-transparent hover:border-orange-100">
                      <span className="text-[#f97316] mr-2.5 text-[11px]">★</span>
                      {link.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ══════════════════════════════════════════════════════════════════
           NON-MEGA SUBMENUS — fixed, full-width, fat
         ══════════════════════════════════════════════════════════════════ */}
      {hoveredMenu && navLinks.find(n => n.title === hoveredMenu && !n.megaMenu && n.submenus) && (() => {
        const activeItem = navLinks.find(n => n.title === hoveredMenu)!;
        return (
          <div
            className="hidden lg:block"
            style={{ position: 'fixed', top: megaMenuTop, left: 0, width: '100vw', zIndex: 9999 }}
            onMouseEnter={() => handleMenuEnter(hoveredMenu)}
            onMouseLeave={handleMenuLeave}
          >
            <div className="h-[3px] bg-[#f97316]" />
            <div className="bg-white shadow-[0_8px_30px_rgba(0,0,0,0.15)]">
              <div className="container mx-auto w-[95%] max-w-[1600px] py-6">
                <div className="flex flex-wrap gap-x-10 gap-y-4">
                  {activeItem.submenus!.map((sub, sidx) => (
                    <div key={sidx}>
                      <div className="font-extrabold text-[#f97316] text-[14px] mb-3 uppercase tracking-wider">{sub.title}</div>
                      <div className="flex flex-wrap gap-x-6 gap-y-1">
                        {sub.links.map((link, lidx) => (
                          <Link key={lidx} href={link.href} className="flex items-center py-2 text-[14px] text-gray-700 hover:text-[#f97316] transition-colors">
                            <span className="text-[#f97316] mr-2 text-[10px]">★</span>
                            {link.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ══════════════════════════════════════════════════════════════════
           MOBILE NAV
         ══════════════════════════════════════════════════════════════════ */}
      {isOpen && (
        <div className="lg:hidden bg-[#1a2744] text-white px-4 pt-3 pb-5 shadow-xl absolute w-full left-0 z-50 max-h-[80vh] overflow-y-auto">
          <Link href="/" className="block py-3.5 border-b border-white/10 font-medium text-[15px]" onClick={() => setIsOpen(false)}>Home</Link>
          {navLinks.map((item, idx) => (
            <div key={idx} className="border-b border-white/10">
              {item.submenus || item.links ? (
                <>
                  <button 
                    className="flex items-center justify-between w-full py-3.5 text-left font-medium text-[15px]"
                    onClick={() => setExpandedMobile(expandedMobile === item.title ? null : item.title)}
                  >
                    {item.title}
                    <ChevronDown className={`w-4 h-4 transition-transform ${expandedMobile === item.title ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {expandedMobile === item.title && (
                    <div className="pb-3 pl-2">
                      {item.submenus && item.submenus.map((region) => (
                        <div key={region.title} className="mb-1">
                          <button 
                            className="flex items-center justify-between w-full px-4 py-2.5 text-[#f97316] font-bold text-[14px]"
                            onClick={() => setExpandedMobileRegion(expandedMobileRegion === region.title ? null : region.title)}
                          >
                            {region.title}
                            <ChevronRight className={`w-3.5 h-3.5 transition-transform ${expandedMobileRegion === region.title ? 'rotate-90' : ''}`} />
                          </button>
                          {expandedMobileRegion === region.title && (
                            <div className="pl-6 space-y-1 pb-2">
                              {region.links.map((link, lidx) => (
                                <Link key={lidx} href={link.href} className="block text-[14px] text-gray-300 py-2 hover:text-white" onClick={() => setIsOpen(false)}>
                                  <span className="text-[#f97316] mr-2 text-[10px]">★</span>
                                  {link.name}
                                </Link>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                      {item.links && item.links.map((link, lidx) => (
                        <Link key={lidx} href={link.href} className="block px-4 text-[14px] text-gray-300 py-2.5 hover:text-white" onClick={() => setIsOpen(false)}>
                          <span className="text-[#f97316] mr-2 text-[10px]">★</span>
                          {link.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <Link href={item.href || "#"} className="block py-3.5 font-medium text-[15px]" onClick={() => setIsOpen(false)}>
                  {item.title}
                </Link>
              )}
            </div>
          ))}
          
          <div className="mt-4 pt-4 border-t border-white/20">
            <a href={`tel:${siteConfig.phoneRaw}`} className="flex items-center text-[#4ade80] font-bold text-[15px]">
              <Phone className="w-5 h-5 mr-2" /> Call: {siteConfig.phone}
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
