import type { Metadata } from "next";
import TripTwinQuiz from "@/components/trip-twin/TripTwinQuiz";

export const metadata: Metadata = {
  title: "Find Your Trip Twin — Travel Personality Quiz",
  description:
    "Answer 8 quick questions to discover your traveler personality — Himalayan Nomad, Heritage Wanderer, Beach Drifter and more — and get three real MyQuickTrippers trips matched to you.",
  openGraph: {
    title: "Find Your Trip Twin | MyQuickTrippers",
    description:
      "What's your traveler personality? Take the 30-second quiz and get three trips picked for your twin.",
    type: "website",
  },
};

export default function TripTwinPage() {
  return (
    <main className="min-h-screen bg-surface-canvas">
      <TripTwinQuiz />
    </main>
  );
}
