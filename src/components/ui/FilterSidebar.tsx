'use client';

import { Award, IndianRupee, Calendar } from 'lucide-react';

export default function FilterSidebar() {
  return (
    <div className="w-full bg-white rounded-md border border-gray-200 overflow-hidden">
      
      {/* Speciality Tour Section */}
      <div className="border-b border-gray-200 p-4">
        <h3 className="font-bold text-gray-800 flex items-center mb-3">
          <Award className="w-4 h-4 mr-2 text-legacy-orange" />
          Speciality Tour
        </h3>
        <div className="space-y-2">
          {["Customized Holidays", "Family", "Women's Special", "Honeymoon Special", "Seniors' Special", "Road Trips"].map((item) => (
            <label key={item} className="flex items-center space-x-2 text-sm text-gray-700 cursor-pointer hover:text-legacy-orange">
              <input type="checkbox" className="rounded border-gray-300 text-legacy-orange focus:ring-legacy-orange" />
              <span>{item}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Budget Per Person Section */}
      <div className="border-b border-gray-200 p-4">
        <h3 className="font-bold text-gray-800 flex items-center mb-3">
          <IndianRupee className="w-4 h-4 mr-2 text-legacy-orange" />
          Budget Per Person ( In Rs. )
        </h3>
        <div className="space-y-2">
          {["Less Than 10,000", "10,000 - 20,000", "20,000 - 40,000", "40,000 - 60,000", "60,000 - 80,000", "Above 80,000"].map((item) => (
            <label key={item} className="flex items-center space-x-2 text-sm text-gray-700 cursor-pointer hover:text-legacy-orange">
              <input type="checkbox" className="rounded border-gray-300 text-legacy-orange focus:ring-legacy-orange" />
              <span>{item}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Duration Section */}
      <div className="p-4">
        <h3 className="font-bold text-gray-800 flex items-center mb-3">
          <Calendar className="w-4 h-4 mr-2 text-legacy-orange" />
          Duration ( in Days )
        </h3>
        <div className="space-y-2">
          {["1 Day (Full Day)", "2 Days / 1 Night", "3 Days / 2 Nights", "4 Days / 3 Nights", "5 Days / 4 Nights", "6 Days / 5 Nights", "7 Days / 6 Nights"].map((item) => (
            <label key={item} className="flex items-center space-x-2 text-sm text-gray-700 cursor-pointer hover:text-legacy-orange">
              <input type="checkbox" className="rounded border-gray-300 text-legacy-orange focus:ring-legacy-orange" />
              <span>{item}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
