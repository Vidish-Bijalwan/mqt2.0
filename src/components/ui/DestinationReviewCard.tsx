'use client';

import { Star, ArrowRight } from 'lucide-react';

interface DestinationReviewCardProps {
  destination: string;
  image: string;
  rating: number;
  reviewCount: number;
}

export default function DestinationReviewCard({
  destination,
  image,
  rating,
  reviewCount,
}: DestinationReviewCardProps) {
  return (
    <div className="group relative bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer">
      {/* Image — gradient with destination initial */}
      <div className="relative h-40 bg-gradient-to-br from-blue-500 to-indigo-600">
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-5xl font-bold text-white/20">{destination.charAt(0)}</span>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute bottom-3 left-3 right-3">
          <h3 className="text-white font-semibold text-lg">{destination}</h3>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1">
            <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
            <span className="font-semibold text-gray-900">{rating}</span>
          </div>
          <span className="text-sm text-gray-500">{reviewCount} reviews</span>
        </div>
        <button className="flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm font-medium group-hover:gap-2 transition-all">
          View {destination} reviews
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
