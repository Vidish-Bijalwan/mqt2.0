"use client";

import { useEffect, useRef } from "react";
import { trackEvent } from "@/lib/analytics";

/** Fires package_view once per page view. No UI. */
export default function PackageViewTracker({ slug, category }: { slug: string; category: string }) {
  const fired = useRef(false);
  useEffect(() => {
    if (fired.current) return;
    fired.current = true;
    trackEvent("package_view", { slug, category });
  }, [slug, category]);
  return null;
}
