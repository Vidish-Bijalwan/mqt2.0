"use client";

import { siteConfig } from '@/data/siteConfig';

interface EmptyStateProps {
  titleName?: string;
}

export default function EmptyState({ titleName = 'these' }: EmptyStateProps) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center max-w-2xl mx-auto p-8 bg-gradient-to-br from-orange-50 to-white rounded-2xl shadow-lg border border-orange-100">
        <div className="mb-6">
          <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-12 h-12 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            No packages match your filters
          </h2>
          <p className="text-gray-600 mb-6">
            We couldn&apos;t find any {titleName} itineraries matching your exact criteria. 
            Try adjusting your budget or duration, or contact us for a custom itinerary.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
          <a 
            href="#enquiry-form"
            className="bg-legacy-nav-blue text-white font-bold py-3 px-8 rounded-md hover:bg-blue-900 transition-colors shadow-md flex items-center justify-center"
          >
            <span className="mr-2">📞</span>
            Get Custom Quote
          </a>
          <button 
            onClick={() => window.location.reload()}
            className="border border-legacy-nav-blue text-legacy-nav-blue font-bold py-3 px-8 rounded-md hover:bg-blue-50 transition-colors flex items-center justify-center"
          >
            <span className="mr-2">🔄</span>
            Reset Filters
          </button>
        </div>
        
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-600 mb-2">
            Or speak to our travel experts directly:
          </p>
          <a 
            href={`tel:${siteConfig.phoneRaw}`}
            className="text-xl font-bold text-legacy-orange hover:text-orange-700 block"
          >
            📱 {siteConfig.phone}
          </a>
        </div>
      </div>
    </div>
  );
}
