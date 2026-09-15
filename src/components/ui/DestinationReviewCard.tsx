'use client';

import { Star, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { IMAGE_SKELETON } from '@/utils/imagePlaceholder';

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
    <Link
      href={`/packages?filter=${encodeURIComponent(destination.toLowerCase())}`}
      className="group relative block overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:shadow-lg"
    >
      {/* Image */}
      <div className="relative h-40 bg-gradient-to-br from-blue-500 to-indigo-600 overflow-hidden">
        <Image src={image} alt={destination} fill sizes="(max-width: 768px) 50vw, 25vw" loading="lazy" decoding="async" placeholder={IMAGE_SKELETON} className="object-cover" />
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
        <span className="flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm font-medium group-hover:gap-2 transition-all">
          Explore {destination} tours
          <ArrowRight className="w-4 h-4" />
        </span>
      </div>
    </Link>
  );
}
