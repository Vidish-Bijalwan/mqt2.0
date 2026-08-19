'use client';

import { Star, BadgeCheck } from 'lucide-react';

interface TourReviewCardProps {
  tour: string;
  slug: string;
  image: string;
  rating: number;
  reviewCount: number;
  verifiedCount: number;
}

export default function TourReviewCard({
  tour,
  slug,
  image,
  rating,
  reviewCount,
  verifiedCount,
}: TourReviewCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300">
      {/* Image — gradient with tour initial */}
      <div className="relative h-48 bg-gradient-to-br from-orange-500 to-red-600">
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-6xl font-bold text-white/20">{tour.charAt(0)}</span>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute bottom-3 left-3 right-3">
          <h3 className="text-white font-semibold">{tour}</h3>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center gap-1">
            <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
            <span className="font-semibold text-gray-900">{rating}</span>
          </div>
          <span className="text-sm text-gray-500">({reviewCount} reviews)</span>
        </div>

        <div className="flex items-center gap-1 text-green-600 text-sm mb-4">
          <BadgeCheck className="w-4 h-4" />
          {verifiedCount} verified bookings
        </div>

        <div className="flex gap-2">
          <a
            href={`/packages/${slug}`}
            className="flex-1 text-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            View Tour
          </a>
          <button className="flex-1 text-center px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
            View Reviews
          </button>
        </div>
      </div>
    </div>
  );
}
