"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    dataLayer?: Array<Record<string, string>>;
  }
}

export default function ClientRuntime() {
  useEffect(() => {
    const handleTrackedClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const trackedElement = target?.closest<HTMLElement>("[data-track]");

      if (!trackedElement) return;

      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: trackedElement.dataset.track || "",
        href: trackedElement.getAttribute("href") || "",
      });
    };

    document.addEventListener("click", handleTrackedClick);

    return () => {
      document.removeEventListener("click", handleTrackedClick);
    };
  }, []);

  useEffect(() => {
    // The previous network-first worker intercepted every image and could serve
    // stale pages. Native browser and CDN caching are faster for this media-heavy site.
    navigator.serviceWorker?.getRegistrations().then((registrations) => {
      registrations.forEach((registration) => void registration.unregister());
    }).catch(() => {});
    window.caches?.keys().then((keys) => {
      keys.filter((key) => key.startsWith("mqt-")).forEach((key) => void window.caches.delete(key));
    }).catch(() => {});
  }, []);

  return null;
}
