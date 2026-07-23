"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Package } from '@/data/allPackages';
import { getPackageImage } from '@/utils/imageMapper';

export default function PackageListCard({ pkg }: { pkg: Package }) {
  const [imgSrc, setImgSrc] = useState(getPackageImage(pkg));

  const displayPrice = pkg.price && pkg.price !== "" ? pkg.price : "On Request";
  const hasPrice = displayPrice !== "On Request";

  // Parse start/end from route
  const routeParts = pkg.route ? pkg.route.split(/[→➝–]/).map(s => s.trim()).filter(Boolean) : [];
  const startCity = routeParts[0] || "Delhi";
  const endCity = routeParts.length > 1 ? routeParts[routeParts.length - 1] : startCity;

  return (
    <div className="bg-white border border-gray-200 overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 flex flex-col md:flex-row relative">
      
      {/* ========== LEFT: IMAGE SECTION (fixed 260px on desktop) ========== */}
      <div className="relative w-full md:w-[260px] h-[200px] md:h-auto md:min-h-[230px] shrink-0 overflow-hidden bg-gray-100">
        <Link href={`/packages/${pkg.slug}`} className="block w-full h-full relative">
          <Image
            src={imgSrc}
            alt={pkg.title}
            fill
            sizes="(max-width: 768px) 100vw, 260px"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            onError={() => setImgSrc('/images/hero/hero-bg-2.jpg')} // Dynamic fallback
          />
          
          {/* Proper MQT Badge overlay */}
          <div className="absolute top-0 left-0 bg-legacy-orange text-white text-[10px] font-bold px-3 py-1 rounded-br-lg shadow-sm z-10">
            MQT
          </div>

          {/* Proper Duration badge overlay without overlapping the center text */}
          {pkg.duration && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10">
              <span className="bg-black/70 backdrop-blur-sm text-white text-[11px] font-bold px-4 py-1.5 rounded-full shadow-md whitespace-nowrap border border-white/20">
                {pkg.duration}
              </span>
            </div>
          )}
        </Link>
      </div>

      {/* ========== MIDDLE: DETAILS SECTION ========== */}
      <div className="flex-1 min-w-0 p-3 md:p-4 flex flex-col justify-between border-x-0 md:border-x border-gray-100">
        {/* Title */}
        <div className="mb-2">
          <Link href={`/packages/${pkg.slug}`}>
            <h3 className="text-[14px] md:text-[15px] font-bold text-gray-900 hover:text-legacy-nav-blue transition-colors mb-1 leading-snug line-clamp-2">
              {pkg.title}
            </h3>
          </Link>
        </div>

        {/* Route Info Table */}
        <div className="text-[12px] text-gray-600 space-y-1.5 mb-4">
          <div className="flex">
            <span className="text-gray-800 font-semibold min-w-[130px] shrink-0">Starting & Ending ➝</span>
            <span className="truncate">{startCity} | {endCity}</span>
          </div>
          <div className="flex">
            <span className="text-gray-800 font-semibold min-w-[130px] shrink-0">Destinations ➝</span>
            <span className="line-clamp-1">{pkg.route || "Multiple destinations"}</span>
          </div>
        </div>

        {/* Amenities Row */}
        <div className="mt-auto">
          <p className="text-[11px] font-bold text-gray-800 uppercase tracking-wide mb-3">Customized Holidays</p>
          <div className="flex items-center gap-6 text-gray-500">
            <div className="flex flex-col items-center group-hover:text-legacy-nav-blue transition-colors">
               <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 21V7a2 2 0 012-2h14a2 2 0 012 2v14"/><path d="M3 11h18"/><path d="M7 11V7"/><path d="M11 11V7"/><path d="M15 11V7"/><path d="M7 15h.01"/><path d="M11 15h.01"/><path d="M15 15h.01"/><path d="M7 19h.01"/><path d="M11 19h.01"/><path d="M15 19h.01"/></svg>
               <span className="text-[10px] mt-1">Hotel</span>
            </div>
            <div className="flex flex-col items-center group-hover:text-legacy-nav-blue transition-colors">
               <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 002-2V2"/><path d="M7 2v20"/><path d="M21 15V2a5 5 0 00-5 5v6c0 1.1.9 2 2 2h3zm0 0v7"/></svg>
               <span className="text-[10px] mt-1">Meals</span>
            </div>
            <div className="flex flex-col items-center group-hover:text-legacy-nav-blue transition-colors">
               <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="1" y="3" width="15" height="13" rx="2"/><path d="M16 8h4l3 5v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
               <span className="text-[10px] mt-1">Transfers</span>
            </div>
            <div className="flex flex-col items-center group-hover:text-legacy-nav-blue transition-colors">
               <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M14.5 4h-5L7 7H4a2 2 0 00-2 2v9a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>
               <span className="text-[10px] mt-1">Sightseeing</span>
            </div>
          </div>
        </div>
      </div>

      {/* ========== RIGHT: PRICING BOX (fixed 190px on desktop) ========== */}
      <div className="w-full md:w-[190px] bg-gray-50/80 p-3 flex flex-col items-center justify-center text-center shrink-0">
        {/* Price Display */}
        <div className="mb-3">
          <p className="text-[11px] text-gray-500 mb-1 font-semibold uppercase tracking-wider">Starting from</p>
          <div className="flex items-baseline justify-center gap-1">
            {hasPrice ? (
               <>
                 <span className="text-[13px] font-bold text-gray-800">INR</span>
                 <span className="text-[20px] font-extrabold text-gray-900 leading-none">{displayPrice}</span>
               </>
            ) : (
               <span className="text-[16px] font-extrabold text-legacy-orange leading-none">{displayPrice}</span>
            )}
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="w-full space-y-1.5">
          <button className="w-full py-1.5 px-2 bg-white hover:bg-gray-100 border border-gray-300 text-gray-700 text-[11px] font-bold rounded flex items-center justify-center gap-1 transition-colors shadow-sm whitespace-nowrap">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 7l-8.97 5.7a1.94 1.94 0 01-2.06 0L2 7"/></svg>
            Send Query
          </button>
          <Link
            href={`/packages/${pkg.slug}`}
            className="block w-full py-1.5 px-2 bg-legacy-orange hover:bg-orange-600 text-white text-[11px] font-bold rounded text-center transition-colors shadow-sm whitespace-nowrap"
          >
            View Details
          </Link>
        </div>
        
        <a href="https://wa.me/918171158569" className="mt-4 flex items-center text-[11px] font-semibold text-green-600 hover:text-green-700">
           <svg className="w-3.5 h-3.5 mr-1.5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
           Discuss On WhatsApp
        </a>
      </div>
    </div>
  );
}
