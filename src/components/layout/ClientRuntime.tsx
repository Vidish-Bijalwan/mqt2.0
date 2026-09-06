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
    if (!("serviceWorker" in navigator)) return;

    const registerServiceWorker = () => {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    };

    if (document.readyState === "complete") {
      registerServiceWorker();
      return;
    }

    window.addEventListener("load", registerServiceWorker, { once: true });

    return () => {
      window.removeEventListener("load", registerServiceWorker);
    };
  }, []);

  return null;
}
