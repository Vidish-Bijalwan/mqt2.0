'use client';

import { Star } from 'lucide-react';

interface RatingBreakdownProps {
  overall: number;
  totalReviews: number;
  verifiedReviews: number;
  distribution: Array<{ stars: number; count: number; percentage: number }>;
  categoryBreakdown: Array<{ category: string; rating: number }>;
  onFilterByRating?: (stars: number) => void;
}

export default function RatingBreakdown({
  overall,
  totalReviews,
  verifiedReviews,
  distribution,
  categoryBreakdown,
  onFilterByRating,
}: RatingBreakdownProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      {/* Overall Rating */}
      <div className="text-center mb-6 pb-6 border-b border-gray-100">
        <div className="text-6xl font-bold text-gray-900 mb-2">{overall}</div>
        <div className="flex items-center justify-center gap-1 mb-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`w-6 h-6 ${
                star <= Math.round(overall) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'
              }`}
            />
          ))}
        </div>
        <p className="text-gray-600">
          Based on <span className="font-semibold text-gray-900">{totalReviews.toLocaleString()}</span> reviews
        </p>
        <p className="text-sm text-green-600 mt-1">
          ✓ {verifiedReviews.toLocaleString()} verified travelers
        </p>
      </div>

      {/* Star Distribution */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Rating Distribution</h3>
        <div className="space-y-2">
          {distribution.map((item) => (
            <button
              key={item.stars}
              onClick={() => onFilterByRating?.(item.stars)}
              className="w-full flex items-center gap-3 group hover:bg-gray-50 rounded-lg p-1 transition-colors"
            >
              <span className="text-sm font-medium text-gray-700 w-8">{item.stars} ★</span>
              <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full transition-all group-hover:from-yellow-500 group-hover:to-orange-500"
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
              <span className="text-sm text-gray-500 w-16 text-right">{item.count.toLocaleString()}</span>
              <span className="text-sm font-medium text-gray-700 w-10 text-right">{item.percentage}%</span>
            </button>
          ))}
        </div>
      </div>

      {/* Category Breakdown */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Category Ratings</h3>
        <div className="space-y-3">
          {categoryBreakdown.map((item) => (
            <div key={item.category}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-gray-600">{item.category}</span>
                <span className="text-sm font-semibold text-gray-900">{item.rating}</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
                  style={{ width: `${(item.rating / 5) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
