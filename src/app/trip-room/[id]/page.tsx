import { Suspense } from "react";
import type { Metadata } from "next";
import RoomVoteClient from "@/components/trip-room/RoomVoteClient";

// Room URLs are unguessable but public share links — keep them out of search.
export const metadata: Metadata = {
  title: "Group Trip Room | My Quick Trippers",
  description: "Vote with your group on destination, dates, budget and more — then see real package matches.",
  robots: { index: false, follow: false },
};

export default async function TripRoomPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
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
      <RoomVoteClient roomId={id} />
    </Suspense>
  );
}
