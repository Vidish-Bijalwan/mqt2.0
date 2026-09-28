'use client';

import { Star, BadgeCheck } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { IMAGE_SKELETON } from '@/utils/imagePlaceholder';

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
      {/* Image */}
      <div className="relative h-48 bg-gradient-to-br from-orange-500 to-red-600 overflow-hidden">
        <Image src={image} alt={tour} fill sizes="(max-width: 768px) 100vw, 33vw" loading="lazy" decoding="async" placeholder={IMAGE_SKELETON} className="object-cover" />
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
          <Link
            href={`/packages/${slug}`}
            className="flex-1 text-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            View Tour
          </Link>
        </div>
      </div>
    </div>
  );
}
