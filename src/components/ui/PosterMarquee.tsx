"use client";

import React, {
  useRef,
  useEffect,
  useState,
} from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { posterItems, type PosterItem } from "@/data/posterData";
import { IMAGE_SKELETON } from "@/utils/imagePlaceholder";

/* The lightbox (zoom/pan reducer, pinch handlers) loads on demand so it never
   ships in the eager home client bundle. */
const PosterLightbox = dynamic(() => import("./PosterLightbox"), {
  ssr: false,
});

/* ───────────────────────── constants ───────────────────────── */
const LOOP_DURATION_S = 46;

/* ─────────────── Main Marquee component ─────────────── */
export default function PosterMarquee() {
  const trackRef = useRef<HTMLDivElement>(null);
  const maskRef = useRef<HTMLDivElement>(null);
  const [isInteractionPaused, setIsInteractionPaused] = useState(false);
  const [isDocumentHidden, setIsDocumentHidden] = useState(false);
  const [selectedPoster, setSelectedPoster] = useState<PosterItem | null>(null);
  const [isInView, setIsInView] = useState(true);
  /* True when the touch CSS branch applies (native swipe rail instead of the
     CSS marquee) and the user hasn't asked for reduced motion — then the rail
     also auto-advances so phones get the same "scrolling carousel" feel. */
  const [autoAdvance, setAutoAdvance] = useState(false);
  const resumeTimer = useRef<number | null>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const observer = new IntersectionObserver(([entry]) => setIsInView(entry.isIntersecting), {
      rootMargin: "160px",
    });
    observer.observe(track);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const h = () => setIsDocumentHidden(document.hidden);
    h();
    document.addEventListener("visibilitychange", h);
    return () => document.removeEventListener("visibilitychange", h);
  }, []);

  // Lock body scroll when lightbox is open
  useEffect(() => {
    document.body.style.overflow = selectedPoster ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [selectedPoster]);

  // Detect the touch swipe-rail branch (mirrors the CSS media query).
  useEffect(() => {
    const touch = window.matchMedia("(hover: none) and (pointer: coarse)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setAutoAdvance(touch.matches && !reduced.matches);
    update();
    touch.addEventListener("change", update);
    reduced.addEventListener("change", update);
    return () => {
      touch.removeEventListener("change", update);
      reduced.removeEventListener("change", update);
      if (resumeTimer.current) window.clearTimeout(resumeTimer.current);
    };
  }, []);

  // On touch devices the CSS marquee is replaced by a native swipe rail.
  // Auto-advance it one card at a time so phones get visible motion too;
  // any touch pauses it, and it resumes after 5s idle.
  useEffect(() => {
    if (!autoAdvance) return;
    const mask = maskRef.current;
    if (!mask) return;
    if (isInteractionPaused || isDocumentHidden || !isInView) return;
    const id = window.setInterval(() => {
      const card = mask.querySelector<HTMLElement>(".pm-card");
      const step = card ? card.offsetWidth + 10 : 280;
      const nearEnd = mask.scrollLeft + mask.clientWidth >= mask.scrollWidth - 24;
      if (nearEnd) mask.scrollTo({ left: 0, behavior: "smooth" });
      else mask.scrollBy({ left: step, behavior: "smooth" });
    }, 3400);
    return () => window.clearInterval(id);
  }, [autoAdvance, isInteractionPaused, isDocumentHidden, isInView]);

  const pauseForTouch = () => {
    setIsInteractionPaused(true);
    if (resumeTimer.current) window.clearTimeout(resumeTimer.current);
  };
  const resumeAfterTouch = () => {
    if (resumeTimer.current) window.clearTimeout(resumeTimer.current);
    resumeTimer.current = window.setTimeout(() => setIsInteractionPaused(false), 5000);
  };

  // Two identical groups make the CSS loop mathematically exact. The group padding
  // carries the inter-group gap, so the reset never reveals a half-gap jump.
  const loopItems = posterItems.slice(0, 12);
  const isAnimationPaused = isInteractionPaused || isDocumentHidden || !isInView;

  return (
    <>
      <div
        className="pm-wrapper"
        aria-label="Featured tour destinations"
        role="region"
      >
        <div
          className="pm-mask"
          ref={maskRef}
          onTouchStart={pauseForTouch}
          onTouchEnd={resumeAfterTouch}
          onTouchCancel={resumeAfterTouch}
        >
          <div
            ref={trackRef}
            className="pm-track"
            style={{
              animationPlayState: isAnimationPaused ? "paused" : "running",
              animationDuration: `${LOOP_DURATION_S}s`,
            }}
          >
            {[0, 1].map((groupIndex) => (
              <div
                key={groupIndex}
                className={`pm-track__group${groupIndex === 1 ? " pm-track__group--duplicate" : ""}`}
                aria-hidden={groupIndex === 1}
              >
                {loopItems.map((item, itemIndex) => (
                  <button
                    key={`${item.name}-${groupIndex}`}
                    className={`pm-card${itemIndex >= 8 ? " pm-card--mobile-extra" : ""}`}
                    onClick={() => setSelectedPoster(item)}
                    onMouseEnter={() => setIsInteractionPaused(true)}
                    onMouseLeave={() => setIsInteractionPaused(false)}
                    onFocus={() => setIsInteractionPaused(true)}
                    onBlur={() => setIsInteractionPaused(false)}
                    aria-label={`View ${item.name} tour poster`}
                    tabIndex={groupIndex === 1 ? -1 : undefined}
                  >
                    <Image
                      src={item.imageUrl}
                      alt={`${item.name} destination poster`}
                      fill
                      className="pm-card__img"
                      /* All marquee posters are below the fold — keep every
                         one lazy so they never compete with the LCP hero for
                         bandwidth. */
                      loading="lazy"
                      fetchPriority={groupIndex === 0 && itemIndex >= 4 ? "low" : undefined}
                      decoding="async"
                      quality={55}
                      sizes="(max-width: 768px) 220px, 260px"
                      placeholder={IMAGE_SKELETON}
                    />
                    <div className="pm-card__overlay">
                      <span className="pm-card__label">{item.name}</span>
                      <span className="pm-card__cta">Click to view</span>
                    </div>
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {selectedPoster && (
        <PosterLightbox
          poster={selectedPoster}
          onClose={() => setSelectedPoster(null)}
        />
      )}
    </>
  );
}
