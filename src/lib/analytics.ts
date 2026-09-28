"use client";

/**
 * Typed analytics wrapper over the project's EXISTING analytics system
 * (@vercel/analytics — already mounted in src/app/layout.tsx).
 *
 * No new libraries, no gtag, no GTM. Events are fired with Vercel's `track`.
 * All calls are SSR-safe and never throw into the UI.
 */

import { track } from "@vercel/analytics";

export type AnalyticsEvent =
  | "package_view"
  | "price_section_view"
  | "tier_selected"
  | "value_stack_opened"
  | "availability_clicked"
  | "enquiry_start"
  | "enquiry_submit"
  | "trip_twin_started"
  | "trip_twin_completed"
  | "trip_twin_shared"
  | "trip_room_created"
  | "trip_room_invite"
  | "trip_room_vote"
  | "whatsapp_click"
  | "phone_click"
  | "email_click"
  | "booking_cta_click"
  | "search_query"
  | "destination_attention"
  | "blog_attention"
  | "content_shared"
  | "voucher_game_spin"
  | "voucher_game_won";

export type AnalyticsProps = Record<string, string | number | boolean | undefined>;

export function trackEvent(event: AnalyticsEvent, props?: AnalyticsProps): void {
  try {
    if (typeof window === "undefined") return;
    const clean: Record<string, string | number | boolean> = {};
    if (props) {
      for (const [k, v] of Object.entries(props)) {
        if (v !== undefined) clean[k] = v;
      }
    }
    track(event, clean);
  } catch {
    // Analytics must never break the product.
  }
}

const UTM_STORAGE_KEY = "mqt-utm";

/**
 * First-touch UTM capture. Called once per session from ClientRuntime:
 * reads utm_source/medium/campaign/term/content and gclid from the landing
 * URL and stashes them in sessionStorage. Never overwritten mid-session.
 */
export function captureUtmFromUrl(): void {
  try {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem(UTM_STORAGE_KEY)) return; // first touch wins
    const params = new URLSearchParams(window.location.search);
    const utm: Record<string, string> = {};
    for (const key of ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "gclid"]) {
      const value = params.get(key);
      if (value) utm[key] = value.slice(0, 200);
    }
    if (Object.keys(utm).length > 0) {
      sessionStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(utm));
    }
  } catch {
    // Storage unavailable — analytics degrades silently.
  }
}

/**
 * Props for attribution on conversion events. Never contains user-entered
 * text (name/email/phone/message) — only campaign identifiers.
 */
export function getUtmProps(): AnalyticsProps {
  try {
    if (typeof window === "undefined") return {};
    const raw = sessionStorage.getItem(UTM_STORAGE_KEY);
    if (!raw) return {};
    const utm = JSON.parse(raw) as Record<string, unknown>;
    const clean: AnalyticsProps = {};
    for (const key of ["utm_source", "utm_medium", "utm_campaign", "gclid"]) {
      if (typeof utm[key] === "string") clean[key] = utm[key] as string;
    }
    return clean;
  } catch {
    return {};
  }
}
