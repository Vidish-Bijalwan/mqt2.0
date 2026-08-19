"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { X, Images, ChevronLeft, ChevronRight } from "lucide-react";

interface GalleryLightboxProps {
  images: string[];
  title: string;
  captions?: string[];
}

export default function GalleryLightbox({ images, title, captions = [] }: GalleryLightboxProps) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  // Close on Escape (U23 polish)
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
      if (e.key === "ArrowRight") setIndex((i) => (i + 1) % images.length);
      if (e.key === "ArrowLeft") setIndex((i) => (i - 1 + images.length) % images.length);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, images.length]);

  const prev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIndex((i) => (i - 1 + images.length) % images.length);
  };
  const next = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIndex((i) => (i + 1) % images.length);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setIndex(0);
          setOpen(true);
        }}
        aria-label="View All Images"
        className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/45 text-white transition-colors hover:bg-black/55 cursor-pointer"
      >
        <Images className="w-7 h-7 mb-1 drop-shadow" />
        <span className="font-bold text-sm bg-white/20 px-4 py-1.5 rounded-full backdrop-blur-sm">
          View All Images
        </span>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[2000] bg-black/95 flex flex-col"
          role="dialog"
          aria-modal="true"
          aria-label={`${title} photos`}
          onClick={() => setOpen(false)}
        >
          {/* Header */}
          <div className="flex justify-between items-center px-4 md:px-8 py-3">
            <h3 className="text-white font-bold text-base md:text-lg truncate pr-4">{title}</h3>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close gallery"
              className="text-white bg-white/10 hover:bg-white/20 rounded-full p-2 transition-colors shrink-0"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Main image */}
          <div className="flex-1 relative flex items-center justify-center px-4 md:px-20 min-h-0">
            <div className="relative w-full h-full max-w-5xl mx-auto flex items-center justify-center">
              <Image
                src={images[index]}
                alt={`${title} — Photo ${index + 1}`}
                fill
                sizes="(max-width: 768px) 100vw, 80vw"
                className="object-contain"
                onClick={(e) => e.stopPropagation()}
              />
            </div>

            {/* Prev / Next */}
            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={prev}
                  aria-label="Previous image"
                  className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-10 text-white bg-white/10 hover:bg-white/25 rounded-full p-2.5 transition-colors"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  type="button"
                  onClick={next}
                  aria-label="Next image"
                  className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-10 text-white bg-white/10 hover:bg-white/25 rounded-full p-2.5 transition-colors"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
          </div>

          {/* Caption + counter */}
          <div className="text-center px-4 py-2">
            <p className="text-white/80 text-sm">
              {index + 1} / {images.length}
            </p>
            {captions[index] && (
              <p className="text-white/60 text-xs mt-0.5 line-clamp-1">{captions[index]}</p>
            )}
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex justify-center gap-2 px-4 pb-4 overflow-x-auto" onClick={(e) => e.stopPropagation()}>
              {images.map((img, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-label={`Go to photo ${i + 1}`}
                  className={`relative w-14 h-10 md:w-16 md:h-11 rounded overflow-hidden shrink-0 transition-all ${
                    i === index ? "ring-2 ring-legacy-orange opacity-100" : "opacity-50 hover:opacity-80"
                  }`}
                >
                  <Image src={img} alt="Gallery thumbnail" fill sizes="64px" className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}
