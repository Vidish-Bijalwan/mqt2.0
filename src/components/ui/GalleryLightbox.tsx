"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { X, Images, ChevronLeft, ChevronRight } from "lucide-react";
import { IMAGE_SKELETON } from "@/utils/imagePlaceholder";

interface GalleryLightboxProps {
  images: string[];
  title: string;
  captions?: string[];
}
export default function GalleryLightbox({ images, title, captions = [] }: GalleryLightboxProps) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const mounted = useSyncExternalStore(
    () => () => undefined,
    () => true,
    () => false,
  );
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
      if (e.key === "ArrowRight") setIndex((i) => (i + 1) % images.length);
      if (e.key === "ArrowLeft") setIndex((i) => (i - 1 + images.length) % images.length);
    };
    window.addEventListener("keydown", handler);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handler);
    };
  }, [open, images.length]);

  const prev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIndex((i) => (i - 1 + images.length) % images.length);
  };
  const next = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIndex((i) => (i + 1) % images.length);
  };

  const closeGallery = () => {
    setOpen(false);
    window.requestAnimationFrame(() => triggerRef.current?.focus());
  };

  const galleryDialog = open ? (
    <div
      className="fixed inset-0 z-[9999] flex h-[100dvh] w-screen flex-col overflow-hidden bg-[#041714]/98 text-white overscroll-contain"
      role="dialog"
      aria-modal="true"
      aria-label={`${title} photos`}
      onClick={closeGallery}
    >
      <div className="flex shrink-0 items-center justify-between gap-4 border-b border-white/10 px-4 py-3 sm:px-6 sm:py-4">
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#f4a266]">Journey gallery</p>
          <h3 className="mt-1 truncate text-sm font-bold sm:text-lg">{title}</h3>
        </div>
        <button
          ref={closeRef}
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            closeGallery();
          }}
          aria-label="Close gallery"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/10 transition-colors hover:bg-white/20 focus-visible:ring-2 focus-visible:ring-white"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div
        className="relative min-h-0 flex-1 touch-pan-y px-2 py-3 sm:px-16 sm:py-5"
        onClick={(event) => event.stopPropagation()}
        onTouchStart={(event) => {
          touchStartX.current = event.changedTouches[0]?.clientX ?? null;
        }}
        onTouchEnd={(event) => {
          if (touchStartX.current === null || images.length < 2) return;
          const distance = (event.changedTouches[0]?.clientX ?? touchStartX.current) - touchStartX.current;
          if (Math.abs(distance) > 45) {
            setIndex((current) => distance < 0
              ? (current + 1) % images.length
              : (current - 1 + images.length) % images.length);
          }
          touchStartX.current = null;
        }}
      >
        <div className="relative mx-auto h-full w-full max-w-6xl overflow-hidden rounded-xl bg-black/25 sm:rounded-2xl">
          <Image
            key={images[index]}
            src={images[index]}
            alt={captions[index] || `${title} - photo ${index + 1}`}
            fill
            priority
            sizes="100vw"
            placeholder={IMAGE_SKELETON}
            className="object-contain"
          />
        </div>

        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={prev}
              aria-label="Previous image"
              className="absolute left-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-[#071f1b]/80 text-white shadow-xl backdrop-blur transition hover:bg-[#123b34] sm:left-7"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Next image"
              className="absolute right-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-[#071f1b]/80 text-white shadow-xl backdrop-blur transition hover:bg-[#123b34] sm:right-7"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </>
        )}
      </div>

      <div className="shrink-0 border-t border-white/10 bg-[#061c19] px-4 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-3 sm:px-6 sm:pb-5">
        <div className="mx-auto flex max-w-6xl items-start justify-between gap-4">
          <p className="min-h-10 max-w-3xl text-xs leading-5 text-white/70 sm:text-sm">
            {captions[index] || `A view from the ${title} journey`}
          </p>
          <p className="shrink-0 rounded-full bg-white/10 px-3 py-1 text-xs font-bold tabular-nums text-white/85">
            {index + 1} / {images.length}
          </p>
        </div>

        {images.length > 1 && (
          <div className="mx-auto mt-3 flex max-w-6xl snap-x gap-2 overflow-x-auto pb-1" onClick={(event) => event.stopPropagation()}>
            {images.map((img, imageIndex) => (
              <button
                key={img}
                type="button"
                onClick={() => setIndex(imageIndex)}
                aria-label={`View photo ${imageIndex + 1}`}
                aria-current={imageIndex === index ? "true" : undefined}
                className={`relative h-12 w-16 shrink-0 snap-start overflow-hidden rounded-lg transition sm:h-14 sm:w-20 ${
                  imageIndex === index
                    ? "ring-2 ring-[#ef7a2f] ring-offset-2 ring-offset-[#061c19]"
                    : "opacity-45 hover:opacity-80"
                }`}
              >
                <Image src={img} alt={`Photo ${imageIndex + 1} of ${title}`} fill sizes="80px" loading="lazy" decoding="async" placeholder={IMAGE_SKELETON} className="object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  ) : null;

  if (images.length === 0) return null;

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => {
          setIndex(0);
          setOpen(true);
        }}
        aria-label={images.length > 1 ? `View all ${images.length} photos` : "View tour photo"}
        className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/30 bg-[#061c19]/72 px-4 text-sm font-bold text-white shadow-lg backdrop-blur-md transition hover:bg-[#061c19]/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
      >
        <Images className="h-4 w-4" />
        <span>{images.length > 1 ? `${images.length} photos` : "View photo"}</span>
      </button>
      {mounted && galleryDialog ? createPortal(galleryDialog, document.body) : null}
    </>
  );
}
