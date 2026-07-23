"use client";

import { useState } from "react";

export default function EnquiryForm({ pkgName = "" }: { pkgName?: string }) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("loading");
    
    // Simulate API call
    setTimeout(() => {
      setStatus("success");
    }, 1500);
  };

  if (status === "success") {
    return (
      <div className="bg-green-50 border border-green-200 text-green-700 p-6 rounded-lg text-center">
        <h3 className="text-xl font-bold mb-2">Thank you for your enquiry!</h3>
        <p>Our travel expert will get back to you shortly with the best quote.</p>
        <button 
          onClick={() => setStatus("idle")}
          className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
        >
          Send Another Enquiry
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-card border border-gray-100">
      <h3 className="text-2xl font-bold text-mqt-navy mb-4">Request a Free Quote</h3>
      <p className="text-gray-600 mb-6 text-sm">
        Fill out the form below and we will contact you as soon as possible.
      </p>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
          <input required type="text" className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-mqt-orange outline-none" placeholder="Enter your name" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
            <input required type="email" className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-mqt-orange outline-none" placeholder="Enter your email" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
            <input required type="tel" className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-mqt-orange outline-none" placeholder="Enter your phone number" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Travel Date</label>
            <input type="date" className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-mqt-orange outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">No. of Travellers</label>
            <input type="number" min="1" className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-mqt-orange outline-none" placeholder="E.g. 2" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Message (Optional)</label>
          <textarea rows={2} className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-mqt-orange outline-none" placeholder="Any special requirements?"></textarea>
        </div>
        
        <button 
          type="submit" 
          disabled={status === "loading"}
          className="w-full py-3 bg-mqt-orange hover:bg-mqt-orange-hover text-white font-bold rounded-md transition-colors disabled:bg-gray-400"
        >
          {status === "loading" ? "Submitting..." : "Get Free Quote"}
        </button>
        <p className="text-xs text-center text-gray-500 mt-4 flex justify-center items-center gap-4">
          <span className="flex items-center"><span className="text-yellow-500 mr-1">⚡</span> We respond within 2 hours</span>
          <span className="flex items-center"><span className="text-green-500 mr-1">🔒</span> 100% Secure & Private</span>
        </p>
      </form>
    </div>
  );
}
