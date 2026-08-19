'use client';

import { useState, useEffect } from 'react';
import { X, ChevronDown, Check } from 'lucide-react';
import { destinations, categories, travelerTypes } from '@/data/reviews';

interface FilterValues {
  destination: string;
  rating: string;
  travelerType: string;
  category: string;
  verified: boolean;
  search: string;
  sortBy: string;
}

interface MobileFilterSheetProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterValues;
  onApply: (filters: FilterValues) => void;
}

export default function MobileFilterSheet({
  isOpen,
  onClose,
  filters,
  onApply,
}: MobileFilterSheetProps) {
  const [localFilters, setLocalFilters] = useState(filters);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const updateFilter = (key: string, value: string | boolean) => {
    setLocalFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearAll = () => {
    setLocalFilters({
      destination: '',
      rating: '',
      travelerType: '',
      category: '',
      verified: false,
      search: '',
      sortBy: 'recent',
    });
  };

  const applyFilters = () => {
    onApply(localFilters);
    onClose();
  };

  const activeCount = Object.values(localFilters).filter(
    (v) => v !== '' && v !== false
  ).length;

  return (
    <div className="fixed inset-0 z-[2000] lg:hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 transition-opacity"
        onClick={onClose}
      />

      {/* Sheet */}
      <div className="absolute bottom-0 inset-x-0 bg-white rounded-t-2xl max-h-[85vh] overflow-hidden flex flex-col animate-in slide-in-from-bottom duration-300">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-gray-900">Filters</h3>
            {activeCount > 0 && (
              <span className="bg-legacy-orange text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {activeCount}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            aria-label="Close filters"
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Filter Options */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
          {/* Destination */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Destination
            </label>
            <div className="relative">
              <select
                value={localFilters.destination}
                onChange={(e) => updateFilter('destination', e.target.value)}
                className="w-full appearance-none px-4 py-3 border border-gray-200 rounded-xl bg-white text-gray-900 focus:ring-2 focus:ring-legacy-orange focus:border-transparent"
              >
                <option value="">All Destinations</option>
                {destinations.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rating
            </label>
            <div className="flex gap-2 flex-wrap">
              {['', '5', '4', '3', '2', '1'].map((rating) => (
                <button
                  key={rating}
                  onClick={() => updateFilter('rating', rating)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    localFilters.rating === rating
                      ? 'bg-legacy-orange text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {rating ? `${rating} ★` : 'All'}
                </button>
              ))}
            </div>
          </div>

          {/* Traveler Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Traveler Type
            </label>
            <div className="flex gap-2 flex-wrap">
              {['', ...travelerTypes].map((type) => (
                <button
                  key={type}
                  onClick={() => updateFilter('travelerType', type)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    localFilters.travelerType === type
                      ? 'bg-legacy-orange text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {type || 'All'}
                </button>
              ))}
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tour Category
            </label>
            <div className="relative">
              <select
                value={localFilters.category}
                onChange={(e) => updateFilter('category', e.target.value)}
                className="w-full appearance-none px-4 py-3 border border-gray-200 rounded-xl bg-white text-gray-900 focus:ring-2 focus:ring-legacy-orange focus:border-transparent"
              >
                <option value="">All Categories</option>
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Verified Only */}
          <div className="flex items-center justify-between py-2">
            <span className="text-sm font-medium text-gray-700">
              Verified bookings only
            </span>
            <button
              onClick={() => updateFilter('verified', !localFilters.verified)}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                localFilters.verified ? 'bg-legacy-orange' : 'bg-gray-300'
              }`}
              role="switch"
              aria-checked={localFilters.verified}
              aria-label="Toggle verified bookings only"
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                  localFilters.verified ? 'translate-x-6' : ''
                }`}
              />
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-gray-200 flex gap-3">
          <button
            onClick={clearAll}
            className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
          >
            Clear All
          </button>
          <button
            onClick={applyFilters}
            className="flex-1 py-3 bg-legacy-orange text-white rounded-xl font-medium hover:bg-orange-600 transition-colors"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
}
