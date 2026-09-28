"use client";

import { useEffect } from "react";
import { trackEvent, captureUtmFromUrl, type AnalyticsEvent } from "@/lib/analytics";

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
    // First-touch UTM capture for lead attribution (sessionStorage).
    captureUtmFromUrl();

    /**
     * Delegated contact-click tracking. Any outbound contact link fires its
     * event automatically — no per-component wiring needed:
     *   wa.me links  -> whatsapp_click
     *   tel: links   -> phone_click
     *   mailto:      -> email_click
     * An explicit `data-analytics-event` on the element (or a labelled
     * ancestor) always wins — used for booking CTAs. `data-analytics-placement`
     * (or the legacy `data-track`) records where the click happened.
     */
    const resolveClickEvent = (
      el: HTMLAnchorElement | HTMLButtonElement,
    ): { event: AnalyticsEvent; channel?: string } | null => {
      const labelled = el.closest<HTMLElement>("[data-analytics-event]");
      if (labelled?.dataset.analyticsEvent) {
        return {
          event: labelled.dataset.analyticsEvent as AnalyticsEvent,
          channel: labelled.dataset.analyticsChannel,
        };
      }
      if (!(el instanceof HTMLAnchorElement)) return null;
      const href = el.getAttribute("href") || "";
      if (href.startsWith("https://wa.me") || href.startsWith("http://wa.me")) return { event: "whatsapp_click" };
      if (href.startsWith("tel:")) return { event: "phone_click" };
      if (href.startsWith("mailto:")) return { event: "email_click" };
      return null;
    };

    const resolvePlacement = (el: HTMLElement): string => {
      const labelled = el.closest<HTMLElement>("[data-analytics-placement]");
      if (labelled?.dataset.analyticsPlacement) return labelled.dataset.analyticsPlacement;
      const tracked = el.closest<HTMLElement>("[data-track]");
      if (tracked?.dataset.track) return tracked.dataset.track;
      return "unknown";
    };

    const handleAnalyticsClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const clickable = target?.closest("a, button") as HTMLAnchorElement | HTMLButtonElement | null;
      if (!clickable) return;
      const resolved = resolveClickEvent(clickable);
      if (!resolved) return;
      trackEvent(resolved.event, {
        page: window.location.pathname,
        placement: resolvePlacement(clickable),
        ...(resolved.channel ? { channel: resolved.channel } : {}),
      });
    };

    // Capture phase so the event fires even if another handler later
    // calls preventDefault on the click.
    document.addEventListener("click", handleAnalyticsClick, true);
    return () => {
      document.removeEventListener("click", handleAnalyticsClick, true);
    };
  }, []);

  useEffect(() => {
    // The previous network-first worker intercepted every image and could serve
    // stale pages. Native browser and CDN caching are faster for this media-heavy site.
    navigator.serviceWorker?.getRegistrations().then((registrations) => {
      registrations.forEach((registration) => void registration.unregister());
    }).catch((error) => {
      console.warn('Failed to unregister service worker:', error);
    });
    window.caches?.keys().then((keys) => {
      keys.filter((key) => key.startsWith("mqt-")).forEach((key) => void window.caches.delete(key));
    }).catch((error) => {
      console.warn('Failed to clear caches:', error);
    });
  }, []);

  return null;
}
