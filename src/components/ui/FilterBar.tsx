'use client';

import { useState } from 'react';
import { Search, SlidersHorizontal, X, ChevronDown } from 'lucide-react';
import { destinations, categories, travelerTypes } from '@/data/reviews';

interface FilterBarProps {
  onFilterChange: (filters: FilterState) => void;
  activeFilters: FilterState;
}

export interface FilterState {
  search: string;
  destination: string;
  rating: string;
  verified: boolean;
  travelerType: string;
  category: string;
  sortBy: string;
}

export default function FilterBar({ onFilterChange, activeFilters }: FilterBarProps) {
  const [showFilters, setShowFilters] = useState(false);

  const updateFilter = (key: keyof FilterState, value: string | boolean) => {
    onFilterChange({ ...activeFilters, [key]: value });
  };

  const clearFilters = () => {
    onFilterChange({
      search: '',
      destination: '',
      rating: '',
      verified: false,
      travelerType: '',
      category: '',
      sortBy: 'recent',
    });
  };

  const hasActiveFilters =
    activeFilters.destination ||
    activeFilters.rating ||
    activeFilters.verified ||
    activeFilters.travelerType ||
    activeFilters.category;

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="flex gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            aria-label="Search reviews"
            placeholder="Search reviews, destinations, tours..."
            value={activeFilters.search}
            onChange={(e) => updateFilter('search', e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
          />
          {activeFilters.search && (
            <button
              onClick={() => updateFilter('search', '')}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full"
            >
              <X className="w-4 h-4 text-gray-400" />
            </button>
          )}
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          aria-expanded={showFilters}
          aria-label="Toggle filters"
          className={`flex items-center gap-2 px-4 py-3 border rounded-xl transition-all ${
            showFilters || hasActiveFilters
              ? 'bg-blue-50 border-blue-200 text-blue-700'
              : 'border-gray-200 text-gray-700 hover:bg-gray-50'
          }`}
        >
          <SlidersHorizontal className="w-5 h-5" />
          <span className="hidden sm:inline">Filters</span>
          {hasActiveFilters && (
            <span className="w-2 h-2 bg-blue-500 rounded-full" />
          )}
        </button>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="bg-gray-50 rounded-xl p-4 space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Destination */}
            <div>
              <label htmlFor="filter-destination" className="block text-sm font-medium text-gray-700 mb-1">Destination</label>
              <div className="relative">
                <select
                  id="filter-destination"
                  value={activeFilters.destination}
                  onChange={(e) => updateFilter('destination', e.target.value)}
                  className="w-full appearance-none pl-3 pr-8 py-2 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="">All Destinations</option>
                  {destinations.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Rating */}
            <div>
              <label htmlFor="filter-rating" className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
              <div className="relative">
                <select
                  id="filter-rating"
                  value={activeFilters.rating}
                  onChange={(e) => updateFilter('rating', e.target.value)}
                  className="w-full appearance-none pl-3 pr-8 py-2 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="">All Ratings</option>
                  <option value="5">5 Stars</option>
                  <option value="4">4 Stars</option>
                  <option value="3">3 Stars</option>
                  <option value="2">2 Stars</option>
                  <option value="1">1 Star</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Traveler Type */}
            <div>
              <label htmlFor="filter-traveler-type" className="block text-sm font-medium text-gray-700 mb-1">Traveler Type</label>
              <div className="relative">
                <select
                  id="filter-traveler-type"
                  value={activeFilters.travelerType}
                  onChange={(e) => updateFilter('travelerType', e.target.value)}
                  className="w-full appearance-none pl-3 pr-8 py-2 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="">All Types</option>
                  {travelerTypes.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Category */}
            <div>
              <label htmlFor="filter-category" className="block text-sm font-medium text-gray-700 mb-1">Tour Category</label>
              <div className="relative">
                <select
                  id="filter-category"
                  value={activeFilters.category}
                  onChange={(e) => updateFilter('category', e.target.value)}
                  className="w-full appearance-none pl-3 pr-8 py-2 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="">All Categories</option>
                  {categories.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={activeFilters.verified}
                onChange={(e) => updateFilter('verified', e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Verified bookings only</span>
            </label>
            <button
              onClick={clearFilters}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Clear all filters
            </button>
          </div>
        </div>
      )}

      {/* Active Filter Chips */}
      {hasActiveFilters && !showFilters && (
        <div className="flex flex-wrap gap-2">
          {activeFilters.destination && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
              {activeFilters.destination}
              <button onClick={() => updateFilter('destination', '')} aria-label="Remove destination filter" className="hover:text-blue-900">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {activeFilters.rating && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
              {activeFilters.rating} Stars
              <button onClick={() => updateFilter('rating', '')} aria-label="Remove rating filter" className="hover:text-yellow-900">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {activeFilters.travelerType && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
              {activeFilters.travelerType}
              <button onClick={() => updateFilter('travelerType', '')} aria-label="Remove traveler type filter" className="hover:text-purple-900">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {activeFilters.category && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
              {activeFilters.category}
              <button onClick={() => updateFilter('category', '')} aria-label="Remove category filter" className="hover:text-green-900">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {activeFilters.verified && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
              Verified Only
              <button onClick={() => updateFilter('verified', false)} aria-label="Remove verified filter" className="hover:text-green-900">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
        </div>
      )}

      {/* Sort */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          Showing reviews sorted by:{' '}
          <span className="font-medium text-gray-900">
            {activeFilters.sortBy === 'recent' && 'Most Recent'}
            {activeFilters.sortBy === 'highest' && 'Highest Rated'}
            {activeFilters.sortBy === 'lowest' && 'Lowest Rated'}
            {activeFilters.sortBy === 'helpful' && 'Most Helpful'}
          </span>
        </p>
        <div className="relative">
          <label htmlFor="filter-sort" className="sr-only">Sort reviews</label>
          <select
            id="filter-sort"
            value={activeFilters.sortBy}
            onChange={(e) => updateFilter('sortBy', e.target.value)}
            className="appearance-none pl-3 pr-8 py-1.5 border border-gray-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="recent">Most Recent</option>
            <option value="highest">Highest Rated</option>
            <option value="lowest">Lowest Rated</option>
            <option value="helpful">Most Helpful</option>
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>
      </div>
    </div>
  );
}
