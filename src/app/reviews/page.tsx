'use client';

import { useState, useMemo } from 'react';
import { Star, PenLine, Map, TrendingUp } from 'lucide-react';
import ReviewCard from '@/components/ui/ReviewCard';
import RatingBreakdown from '@/components/ui/RatingBreakdown';
import FilterBar, { type FilterState } from '@/components/ui/FilterBar';
import DestinationReviewCard from '@/components/ui/DestinationReviewCard';
import TourReviewCard from '@/components/ui/TourReviewCard';
import WriteReviewModal from '@/components/ui/WriteReviewModal';
import {
  reviews,
  destinationSummaries,
  popularTourReviews,
  ratingDistribution,
} from '@/data/reviews';

export default function ReviewsPage() {
  const [showWriteModal, setShowWriteModal] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    destination: '',
    rating: '',
    verified: false,
    travelerType: '',
    category: '',
    sortBy: 'recent',
  });

  const filteredReviews = useMemo(() => {
    let result = [...reviews];

    // Search
    if (filters.search) {
      const query = filters.search.toLowerCase();
      result = result.filter(
        (r) =>
          r.title.toLowerCase().includes(query) ||
          r.content.toLowerCase().includes(query) ||
          r.destination.toLowerCase().includes(query) ||
          r.tour.toLowerCase().includes(query)
      );
    }

    // Destination
    if (filters.destination) {
      result = result.filter((r) => r.destination === filters.destination);
    }

    // Rating
    if (filters.rating) {
      result = result.filter((r) => r.rating === parseInt(filters.rating));
    }

    // Verified only
    if (filters.verified) {
      result = result.filter((r) => r.isVerified);
    }

    // Traveler type
    if (filters.travelerType) {
      result = result.filter((r) => r.travelerType === filters.travelerType);
    }

    // Sort
    switch (filters.sortBy) {
      case 'highest':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'lowest':
        result.sort((a, b) => a.rating - b.rating);
        break;
      case 'helpful':
        result.sort((a, b) => b.helpful - a.helpful);
        break;
      case 'recent':
      default:
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return result;
  }, [filters]);

  const featuredReviews = reviews.filter((r) => r.isFeatured);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'My Quick Trippers',
    url: 'https://www.myquicktrippers.com',
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: ratingDistribution.overall,
      reviewCount: ratingDistribution.totalReviews,
      bestRating: 5,
      worstRating: 1,
    },
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Customer <span className="text-orange-500">Reviews</span>
          </h1>
          <p className="text-xl text-gray-300 mb-2">Real experiences. Real travelers. Real journeys.</p>
          <p className="text-gray-400 max-w-2xl mx-auto mb-8">
            See what travelers who explored India and the world with My Quick Trippers have to say.
          </p>

          {/* Quick Stats */}
          <div className="flex flex-wrap justify-center gap-6 mb-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl px-6 py-4">
              <div className="flex items-center gap-2">
                <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                <span className="text-3xl font-bold">{ratingDistribution.overall}</span>
                <span className="text-gray-400">/5</span>
              </div>
              <p className="text-sm text-gray-400">Overall Rating</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl px-6 py-4">
              <span className="text-3xl font-bold">{ratingDistribution.totalReviews.toLocaleString()}</span>
              <p className="text-sm text-gray-400">Total Reviews</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl px-6 py-4">
              <span className="text-3xl font-bold">{ratingDistribution.verifiedReviews.toLocaleString()}</span>
              <p className="text-sm text-gray-400">Verified Travelers</p>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => setShowWriteModal(true)}
              aria-label="Write a review"
              className="flex items-center gap-2 px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-semibold transition-colors"
            >
              <PenLine className="w-5 h-5" />
              Write a Review
            </button>
            <a
              href="/packages"
              className="flex items-center gap-2 px-8 py-3 border border-white/30 hover:bg-white/10 text-white rounded-xl font-semibold transition-colors"
            >
              <Map className="w-5 h-5" />
              Explore Tours
            </a>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Sidebar - Rating Breakdown */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <RatingBreakdown
                overall={ratingDistribution.overall}
                totalReviews={ratingDistribution.totalReviews}
                verifiedReviews={ratingDistribution.verifiedReviews}
                distribution={ratingDistribution.distribution}
                categoryBreakdown={ratingDistribution.categoryBreakdown}
                onFilterByRating={(stars) =>
                  setFilters((prev) => ({ ...prev, rating: stars.toString() }))
                }
              />
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Filter Bar */}
            <FilterBar onFilterChange={setFilters} activeFilters={filters} />

            {/* Featured Reviews */}
            {!filters.destination && !filters.rating && !filters.search && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <TrendingUp className="w-6 h-6 text-orange-500" />
                  Featured Traveler Stories
                </h2>
                <div className="space-y-4">
                  {featuredReviews.slice(0, 2).map((review) => (
                    <ReviewCard key={review.id} review={review} />
                  ))}
                </div>
              </div>
            )}

            {/* All Reviews */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {filteredReviews.length} Review{filteredReviews.length !== 1 ? 's' : ''}
              </h2>
              <div className="space-y-4">
                {filteredReviews.length > 0 ? (
                  filteredReviews.map((review) => (
                    <ReviewCard key={review.id} review={review} />
                  ))
                ) : (
                  <div className="bg-white rounded-xl p-12 text-center">
                    <Star className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No reviews found</h3>
                    <p className="text-gray-500 mb-4">
                      Try adjusting your filters or search terms.
                    </p>
                    <button
                      onClick={() =>
                        setFilters({
                          search: '',
                          destination: '',
                          rating: '',
                          verified: false,
                          travelerType: '',
                          category: '',
                          sortBy: 'recent',
                        })
                      }
                      className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Clear all filters
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Destination Reviews Section */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            What Travelers Say About Our Destinations
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {destinationSummaries.map((dest) => (
              <DestinationReviewCard key={dest.destination} {...dest} />
            ))}
          </div>
        </section>

        {/* Popular Tour Reviews Section */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Reviews From Our Most Popular Tours
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularTourReviews.map((tour) => (
              <TourReviewCard key={tour.slug} {...tour} />
            ))}
          </div>
        </section>
      </div>

      {/* Mobile floating Write Review CTA */}
      <button
        onClick={() => setShowWriteModal(true)}
        aria-label="Write a review"
        className="lg:hidden fixed bottom-20 left-6 z-50 flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-5 py-3 rounded-full shadow-lg transition-all duration-300 hover:scale-105 font-semibold text-sm"
      >
        <PenLine className="w-4 h-4" />
        Write Review
      </button>

      {/* Write Review Modal */}
      <WriteReviewModal isOpen={showWriteModal} onClose={() => setShowWriteModal(false)} />
    </div>
  );
}
