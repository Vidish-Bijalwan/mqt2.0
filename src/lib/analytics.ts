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
  | "enquiry_started"
  | "enquiry_completed"
  | "trip_twin_started"
  | "trip_twin_completed"
  | "trip_twin_shared"
  | "trip_room_created"
  | "trip_room_invite"
  | "trip_room_vote"
  | "package_shared"
  | "booking_started"
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
