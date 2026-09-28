import { Suspense } from "react";
import type { Metadata } from "next";
import { siteConfig } from "@/data/siteConfig";
import RoomCreateClient from "@/components/trip-room/RoomCreateClient";

export const metadata: Metadata = {
  title: "Plan a Group Trip | My Quick Trippers",
  description:
    "Create a trip room, share one link with your group, collect votes on destination, dates, budget and more — then see real package matches for the winners.",
  alternates: {
    canonical: `${siteConfig.domain}/trip-room`,
  },
  openGraph: {
    title: "Plan a Group Trip | My Quick Trippers",
    description:
      "Create a trip room, share one link with your group, collect votes on destination, dates, budget and more.",
    url: `${siteConfig.domain}/trip-room`,
  },
};

export default function TripRoomCreatePage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6" aria-busy="true">
          <div className="h-10 w-2/3 animate-pulse rounded-lg bg-surface-card" />
          <div className="mt-6 h-24 w-full animate-pulse rounded-2xl bg-surface-card" />
          <div className="mt-4 h-24 w-full animate-pulse rounded-2xl bg-surface-card" />
        </div>
      }
    >
      <RoomCreateClient />
    </Suspense>
  );
}
