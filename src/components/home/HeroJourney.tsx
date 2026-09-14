"use client";

import Image from "next/image";
import { startTransition, useEffect, useRef, useState } from "react";

const JOURNEYS = [
  { src: "/images/packages/kedarnath.jpg", label: "Kedarnath", detail: "Himalayan pilgrimages" },
  { src: "/images/packages/india-wildlife-tour-packages.jpg", label: "Wild India", detail: "Forest and wildlife journeys" },
  { src: "/images/packages/andaman.jpg", label: "Andaman", detail: "Island escapes" },
  { src: "/images/packages/agra.jpg", label: "Agra", detail: "Heritage routes" },
  { src: "/images/packages/rajasthan.jpg", label: "Rajasthan", detail: "Palaces and desert stories" },
];

export default function HeroJourney() {
  const [active, setActive] = useState(0);
  const frameRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (media.matches) return;

    let timer: number | undefined;
    let isNearViewport = false;
    const stop = () => {
      if (timer) window.clearInterval(timer);
      timer = undefined;
    };
    const start = () => {
      if (timer || document.hidden) return;
      timer = window.setInterval(() => {
        startTransition(() => setActive((current) => (current + 1) % JOURNEYS.length));
      }, 3600);
    };
    const observer = new IntersectionObserver(([entry]) => {
      isNearViewport = entry.isIntersecting;
      if (isNearViewport) start();
      else stop();
    }, { rootMargin: "120px" });
    const frame = frameRef.current;
    if (frame) observer.observe(frame);
    const onVisibilityChange = () => document.hidden || !isNearViewport ? stop() : start();
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      stop();
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, []);

  useEffect(() => {
    const next = new window.Image();
    next.src = JOURNEYS[(active + 1) % JOURNEYS.length].src;
  }, [active]);

  const journey = JOURNEYS[active];

  return (
    <div ref={frameRef} className="home-journey-frame">
      <Image
        key={journey.src}
        src={journey.src}
        alt={`${journey.label}: ${journey.detail}`}
        fill
        priority={active === 0}
        unoptimized
        decoding="async"
        sizes="(max-width: 767px) 100vw, 52vw"
        className="home-journey-image"
      />
      <div className="home-journey-caption">
        <span>{journey.label}</span>
        <strong>{journey.detail}</strong>
      </div>
      <div className="home-journey-dots" aria-label="Featured journey selector">
        {JOURNEYS.map((item, index) => (
          <button
            key={item.label}
            type="button"
            aria-label={`Show ${item.label}`}
            aria-current={index === active ? "true" : undefined}
            onClick={() => setActive(index)}
          />
        ))}
      </div>
    </div>
  );
}
