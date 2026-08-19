'use client';

import { useState } from 'react';
import { X, Star, Upload, CheckCircle, ArrowLeft, ArrowRight, Camera } from 'lucide-react';

interface WriteReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function WriteReviewModal({ isOpen, onClose }: WriteReviewModalProps) {
  const [step, setStep] = useState(1);
  const [bookingId, setBookingId] = useState('');
  const [email, setEmail] = useState('');
  const [verified, setVerified] = useState(false);
  const [ratings, setRatings] = useState({
    overall: 0,
    service: 0,
    hotel: 0,
    transport: 0,
    guide: 0,
    value: 0,
  });
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [liked, setLiked] = useState('');
  const [improved, setImproved] = useState('');
  const [travelerType, setTravelerType] = useState('');
  const [travelers, setTravelers] = useState('');
  const [travelMonth, setTravelMonth] = useState('');

  if (!isOpen) return null;

  const handleVerify = () => {
    // Simulate verification
    if (bookingId && email) {
      setVerified(true);
      setTimeout(() => setStep(2), 1000);
    }
  };

  const handleRating = (category: string, value: number) => {
    setRatings((prev) => ({ ...prev, [category]: value }));
  };

  const renderStars = (category: string, currentRating: number) => (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          onClick={() => handleRating(category, star)}
          className="focus:outline-none"
        >
          <Star
            className={`w-6 h-6 transition-colors ${
              star <= currentRating
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-200 hover:text-yellow-200'
            }`}
          />
        </button>
      ))}
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 p-4 flex items-center justify-between z-10">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Write a Review</h2>
            <p className="text-sm text-gray-500">Step {step} of 4</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="px-4 py-2">
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
        </div>

        {/* Step 1: Verify Booking */}
        {step === 1 && (
          <div className="p-6 space-y-4">
            <h3 className="font-semibold text-gray-900">Verify Your Booking</h3>
            <p className="text-sm text-gray-600">
              Enter your booking details to verify your trip with My Quick Trippers.
            </p>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Booking ID</label>
              <input
                type="text"
                value={bookingId}
                onChange={(e) => setBookingId(e.target.value)}
                placeholder="e.g., MQT-2026-12345"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email or Phone</label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com or +91 XXXXX XXXXX"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            {verified ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-2 text-green-700">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-medium">Booking verified!</span>
                </div>
                <p className="text-sm text-green-600 mt-1">Kashmir Tour Package · March 2026</p>
              </div>
            ) : (
              <button
                onClick={handleVerify}
                className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
              >
                Verify Booking
              </button>
            )}
          </div>
        )}

        {/* Step 2: Rate Experience */}
        {step === 2 && (
          <div className="p-6 space-y-6">
            <h3 className="font-semibold text-gray-900">Rate Your Experience</h3>
            {[
              { key: 'overall', label: 'Overall Experience' },
              { key: 'service', label: 'Service' },
              { key: 'hotel', label: 'Hotels' },
              { key: 'transport', label: 'Transportation' },
              { key: 'guide', label: 'Tour Guide' },
              { key: 'value', label: 'Value for Money' },
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between">
                <span className="text-gray-700">{item.label}</span>
                {renderStars(item.key, ratings[item.key as keyof typeof ratings])}
              </div>
            ))}
          </div>
        )}

        {/* Step 3: Write Review */}
        {step === 3 && (
          <div className="p-6 space-y-4">
            <h3 className="font-semibold text-gray-900">Write Your Review</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Review Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Summarize your experience"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Your Review</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Share your experience with My Quick Trippers..."
                rows={5}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">What did you like?</label>
              <textarea
                value={liked}
                onChange={(e) => setLiked(e.target.value)}
                placeholder="What was the highlight of your trip?"
                rows={2}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">What could be improved?</label>
              <textarea
                value={improved}
                onChange={(e) => setImproved(e.target.value)}
                placeholder="Any suggestions for us?"
                rows={2}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
              />
            </div>

            {/* Photo Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Upload Photos (Optional)</label>
              <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center hover:border-blue-400 transition-colors cursor-pointer">
                <Camera className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Drag & drop photos or click to upload</p>
                <p className="text-xs text-gray-400 mt-1">JPG, PNG up to 5MB each</p>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Preview & Submit */}
        {step === 4 && (
          <div className="p-6 space-y-4">
            <h3 className="font-semibold text-gray-900">Preview Your Review</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-1 mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-5 h-5 ${
                      star <= ratings.overall
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-200'
                    }`}
                  />
                ))}
              </div>
              <h4 className="font-semibold text-gray-900 mb-1">{title || 'Your Review Title'}</h4>
              <p className="text-gray-600 text-sm mb-2">{content || 'Your review content...'}</p>
              <p className="text-xs text-gray-400">Kashmir Tour Package · March 2026</p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                Your review will be published after verification. This usually takes 24-48 hours.
              </p>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-100 p-4 flex justify-between">
          {step > 1 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
          ) : (
            <div />
          )}
          {step < 4 ? (
            <button
              onClick={() => setStep(step + 1)}
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
            >
              Next
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={onClose}
              className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
            >
              <CheckCircle className="w-4 h-4" />
              Submit Review
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
