"use client";

import React, {
  useRef,
  useEffect,
  useState,
  useCallback,
  useReducer,
} from "react";
import Image from "next/image";
import Link from "next/link";
import { posterItems, type PosterItem } from "@/data/posterData";

/* ───────────────────────── constants ───────────────────────── */
const LOOP_DURATION_S = 90; // slow ambient scroll

/* ─────────────── lightbox zoom / pan state ─────────────── */
interface LBState {
  scale: number;
  x: number;
  y: number;
}
type LBAction =
  | { type: "zoom"; delta: number }
  | { type: "pan"; dx: number; dy: number }
  | { type: "reset" }
  | { type: "setScale"; scale: number };

const MIN_SCALE = 1;
const MAX_SCALE = 5;
const ZOOM_STEP = 0.4;

function lbReducer(state: LBState, action: LBAction): LBState {
  switch (action.type) {
    case "zoom": {
      const next = Math.min(MAX_SCALE, Math.max(MIN_SCALE, state.scale + action.delta));
      // when zooming out to 1, snap pan to center
      const x = next === 1 ? 0 : state.x;
      const y = next === 1 ? 0 : state.y;
      return { scale: next, x, y };
    }
    case "pan":
      return { ...state, x: state.x + action.dx, y: state.y + action.dy };
    case "reset":
      return { scale: 1, x: 0, y: 0 };
    case "setScale":
      return { ...state, scale: Math.min(MAX_SCALE, Math.max(MIN_SCALE, action.scale)) };
    default:
      return state;
  }
}

/* ─────────────── PosterLightbox component ─────────────── */
function PosterLightbox({
  poster,
  onClose,
}: {
  poster: PosterItem;
  onClose: () => void;
}) {
  const [lb, dispatch] = useReducer(lbReducer, { scale: 1, x: 0, y: 0 });
  const imgRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ startX: number; startY: number; lbX: number; lbY: number } | null>(null);
  const lastPinchDist = useRef<number | null>(null);

  // Full-res poster path (from the POSTERS folder copy)
  const fullSrc = poster.imageUrl.replace("/images/posters/", "/images/posters/full/");

  /* keyboard */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "+" || e.key === "=") dispatch({ type: "zoom", delta: ZOOM_STEP });
      if (e.key === "-") dispatch({ type: "zoom", delta: -ZOOM_STEP });
      if (e.key === "0") dispatch({ type: "reset" });
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  /* scroll-wheel zoom */
  const onWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    dispatch({ type: "zoom", delta: e.deltaY < 0 ? ZOOM_STEP : -ZOOM_STEP });
  }, []);

  /* mouse drag pan */
  const onMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    dragRef.current = { startX: e.clientX, startY: e.clientY, lbX: lb.x, lbY: lb.y };
  }, [lb]);

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!dragRef.current || lb.scale === 1) return;
    const dx = e.clientX - dragRef.current.startX;
    const dy = e.clientY - dragRef.current.startY;
    dispatch({ type: "pan", dx: dx - (lb.x - dragRef.current.lbX), dy: dy - (lb.y - dragRef.current.lbY) });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lb]);

  const onMouseUp = useCallback(() => { dragRef.current = null; }, []);

  /* touch pinch zoom */
  const onTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      lastPinchDist.current = Math.sqrt(dx * dx + dy * dy);
    }
  }, []);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2 && lastPinchDist.current !== null) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const delta = (dist - lastPinchDist.current) * 0.01;
      dispatch({ type: "zoom", delta });
      lastPinchDist.current = dist;
    }
  }, []);

  const onTouchEnd = useCallback(() => { lastPinchDist.current = null; }, []);

  const isDraggable = lb.scale > 1;

  return (
    <div
      className="poster-lb-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`Full poster: ${poster.name}`}
    >
      {/* ── top bar ── */}
      <div className="poster-lb-topbar" onClick={(e) => e.stopPropagation()}>
        <span className="poster-lb-title">{poster.name}</span>
        <div className="poster-lb-controls">
          <button
            className="poster-lb-btn"
            onClick={() => dispatch({ type: "zoom", delta: -ZOOM_STEP })}
            title="Zoom out (−)"
            aria-label="Zoom out"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /><line x1="8" y1="11" x2="14" y2="11" />
            </svg>
          </button>
          <span className="poster-lb-scale">{Math.round(lb.scale * 100)}%</span>
          <button
            className="poster-lb-btn"
            onClick={() => dispatch({ type: "zoom", delta: ZOOM_STEP })}
            title="Zoom in (+)"
            aria-label="Zoom in"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /><line x1="11" y1="8" x2="11" y2="14" /><line x1="8" y1="11" x2="14" y2="11" />
            </svg>
          </button>
          <button
            className="poster-lb-btn"
            onClick={() => dispatch({ type: "reset" })}
            title="Reset (0)"
            aria-label="Reset zoom"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="1 4 1 10 7 10" /><path d="M3.51 15a9 9 0 1 0 .49-3.37" />
            </svg>
          </button>
          <button
            className="poster-lb-close"
            onClick={onClose}
            aria-label="Close lightbox (Esc)"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      </div>

      {/* ── image area ── */}
      <div
        className="poster-lb-stage"
        ref={imgRef}
        onClick={(e) => e.stopPropagation()}
        onWheel={onWheel}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        style={{ cursor: isDraggable ? "grab" : "default" }}
      >
        <img
          src={fullSrc}
          alt={`${poster.name} full tour poster`}
          className="poster-lb-img"
          style={{
            transform: `scale(${lb.scale}) translate(${lb.x / lb.scale}px, ${lb.y / lb.scale}px)`,
            cursor: isDraggable ? (dragRef.current ? "grabbing" : "grab") : "default",
          }}
          draggable={false}
        />
      </div>

      {/* ── bottom bar ── */}
      <div className="poster-lb-bottombar" onClick={(e) => e.stopPropagation()}>
        <p className="poster-lb-hint">
          Scroll to zoom · Drag to pan · <kbd>+</kbd>/<kbd>−</kbd> keys · <kbd>0</kbd> to reset · <kbd>Esc</kbd> to close
        </p>
        <Link href={poster.href} className="poster-lb-cta" onClick={onClose}>
          Explore {poster.name} Packages →
        </Link>
      </div>
    </div>
  );
}

/* ─────────────── Main Marquee component ─────────────── */
export default function PosterMarquee() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [selectedPoster, setSelectedPoster] = useState<PosterItem | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mq.matches);
    const h = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mq.addEventListener("change", h);
    return () => mq.removeEventListener("change", h);
  }, []);

  useEffect(() => {
    const h = () => setIsPaused(document.hidden);
    document.addEventListener("visibilitychange", h);
    return () => document.removeEventListener("visibilitychange", h);
  }, []);

  // Lock body scroll when lightbox is open
  useEffect(() => {
    document.body.style.overflow = selectedPoster ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [selectedPoster]);

  // double items for seamless loop
  const items: PosterItem[] = [...posterItems, ...posterItems];

  return (
    <>
      <div
        className="pm-wrapper"
        aria-label="Featured tour destinations"
        role="region"
      >
        <div className="pm-mask">
          <div
            ref={trackRef}
            className="pm-track"
            style={{
              animationPlayState: isPaused || prefersReducedMotion ? "paused" : "running",
              animationDuration: `${LOOP_DURATION_S}s`,
            }}
          >
            {items.map((item, i) => (
              <button
                key={`${item.name}-${i}`}
                className="pm-card"
                onClick={() => setSelectedPoster(item)}
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
                aria-label={`View ${item.name} tour poster`}
              >
                <Image
                  src={item.imageUrl}
                  alt={`${item.name} destination poster`}
                  fill
                  className="pm-card__img"
                  loading="lazy"
                  sizes="(max-width: 768px) 220px, 320px"
                />
                <div className="pm-card__overlay">
                  <span className="pm-card__label">{item.name}</span>
                  <span className="pm-card__cta">Click to view</span>
                </div>
              </button>
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
