'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Star, ThumbsUp, Share2, MoreVertical, BadgeCheck, Flag, ChevronDown, ChevronUp } from 'lucide-react';
import type { Review } from '@/data/reviews';

interface ReviewCardProps {
  review: Review;
  showDestination?: boolean;
}

export default function ReviewCard({ review, showDestination = true }: ReviewCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [helpfulClicked, setHelpfulClicked] = useState(false);

  const isLong = review.content.length > 250;
  const displayContent = isLong && !expanded ? review.content.slice(0, 250) + '...' : review.content;

  return (
    <div className={`bg-white rounded-xl shadow-sm border ${review.isFeatured ? 'border-orange-200 ring-1 ring-orange-100' : 'border-gray-100'} p-5 md:p-6 hover:shadow-md transition-shadow`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shrink-0">
            <img src={review.avatar} alt={review.name} className="w-full h-full object-cover" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-semibold text-gray-900">{review.name}</h4>
              {review.isVerified && (
                <span className="inline-flex items-center gap-1 text-xs font-medium text-green-700 bg-green-50 px-2 py-0.5 rounded-full">
                  <BadgeCheck className="w-3.5 h-3.5" />
                  Verified Booking
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              {showDestination && (
                <span className="text-blue-600 hover:underline cursor-pointer">{review.destination}</span>
              )}
              <span>·</span>
              <span>{review.travelDate}</span>
              <span>·</span>
              <span>{review.travelers} traveler{review.travelers > 1 ? 's' : ''}</span>
            </div>
          </div>
        </div>
        <div className="relative">
          <button
            onClick={() => setShowMoreMenu(!showMoreMenu)}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <MoreVertical className="w-5 h-5 text-gray-400" />
          </button>
          {showMoreMenu && (
            <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-lg shadow-lg z-10 w-40 py-1">
              <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center gap-2">
                <Flag className="w-4 h-4" />
                Report Review
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Stars */}
      <div className="flex items-center gap-1 mb-3">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-5 h-5 ${
              star <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'
            }`}
          />
        ))}
        <span className="ml-2 text-sm font-medium text-gray-700">{review.rating}.0</span>
      </div>

      {/* Title */}
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{review.title}</h3>

      {/* Content */}
      <p className="text-gray-600 leading-relaxed mb-3">{displayContent}</p>
      {isLong && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1 mb-3"
        >
          {expanded ? (
            <>Show less <ChevronUp className="w-4 h-4" /></>
          ) : (
            <>Read full review <ChevronDown className="w-4 h-4" /></>
          )}
        </button>
      )}

      {/* Tour badge */}
      <div className="flex items-center gap-2 mb-3">
        <span className="text-sm text-gray-500">Tour:</span>
        <a
          href={`/packages/${review.tourSlug}`}
          className="text-sm font-medium text-blue-600 hover:underline"
        >
          {review.tour}
        </a>
      </div>

      {/* Photos — gradient placeholders (real images can be added later) */}
      {review.photos.length > 0 && (
        <div className="flex gap-2 mb-4 overflow-x-auto" role="img" aria-label={`${review.photos.length} traveler photos`}>
          {review.photos.map((photo, idx) => (
            <div key={idx} className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
              <span className="text-blue-400 text-xs font-medium">Photo {idx + 1}</span>
            </div>
          ))}
        </div>
      )}

      {/* Category ratings */}
      <div className="grid grid-cols-3 md:grid-cols-5 gap-2 mb-4">
        {Object.entries(review.categoryRatings).map(([key, value]) => (
          <div key={key} className="text-center">
            <div className="text-xs text-gray-500 capitalize mb-1">
              {key === 'guide' ? 'Guide' : key}
            </div>
            <div className="flex items-center justify-center gap-0.5">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  className={`w-3 h-3 ${
                    s <= value ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'
                  }`}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setHelpfulClicked(!helpfulClicked)}
            className={`flex items-center gap-1.5 text-sm transition-colors ${
              helpfulClicked ? 'text-blue-600 font-medium' : 'text-gray-500 hover:text-blue-600'
            }`}
          >
            <ThumbsUp className={`w-4 h-4 ${helpfulClicked ? 'fill-current' : ''}`} />
            Helpful ({review.helpful + (helpfulClicked ? 1 : 0)})
          </button>
          <button className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-blue-600 transition-colors">
            <Share2 className="w-4 h-4" />
            Share
          </button>
        </div>
        {review.isFeatured && (
          <span className="text-xs font-medium text-orange-600 bg-orange-50 px-2 py-1 rounded-full">
            ★ Featured Review
          </span>
        )}
      </div>

      {/* Company Response */}
      {review.response && (
        <div className="mt-4 bg-blue-50 rounded-lg p-4 border-l-4 border-blue-500">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-bold">
              MQT
            </div>
            <div>
              <span className="font-semibold text-gray-900 text-sm">{review.response.author}</span>
              <span className="text-xs text-gray-500 ml-2">{review.response.role}</span>
            </div>
          </div>
          <p className="text-sm text-gray-700 leading-relaxed">{review.response.content}</p>
          <p className="text-xs text-gray-400 mt-2">{review.response.createdAt}</p>
        </div>
      )}
    </div>
  );
}
