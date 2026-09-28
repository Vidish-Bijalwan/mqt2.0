"use client";

import { useEffect, useRef } from "react";
import { trackEvent, type AnalyticsEvent } from "@/lib/analytics";

type AttentionEvent = Extract<AnalyticsEvent, "destination_attention" | "blog_attention">;

/**
 * Fires a content-attention event once per page view when the visitor shows
 * real engagement: 50%+ scroll depth OR 30 seconds dwell. Bounces that never
 * engage fire nothing.
 */
export default function AttentionTracker({ event, page }: { event: AttentionEvent; page: string }) {
  const fired = useRef(false);

  useEffect(() => {
    const fire = () => {
      if (fired.current) return;
      fired.current = true;
      trackEvent(event, { page });
    };

    const onScroll = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      if (max > 0 && window.scrollY / max >= 0.5) fire();
    };

    const timer = window.setTimeout(fire, 30_000);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
    };
  }, [event, page]);

  return null;
}
