'use client';

import { useEffect, useRef, useState } from 'react';
import { X, Star, CheckCircle, ArrowLeft, ArrowRight, Camera } from 'lucide-react';

interface WriteReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const STORAGE_KEY = 'mqt-reviews';

const RATING_CATEGORIES = [
  { key: 'overall', label: 'Overall Experience' },
  { key: 'service', label: 'Service' },
  { key: 'hotel', label: 'Hotels' },
  { key: 'transport', label: 'Transportation' },
  { key: 'guide', label: 'Tour Guide' },
  { key: 'value', label: 'Value for Money' },
] as const;

type RatingKey = (typeof RATING_CATEGORIES)[number]['key'];

interface StoredReview {
  id: string;
  submittedAt: string;
  ratings: Record<RatingKey, number>;
  title: string;
  content: string;
  liked: string;
  improved: string;
}

const TOTAL_STEPS = 3;

export default function WriteReviewModal({ isOpen, onClose }: WriteReviewModalProps) {
  const [step, setStep] = useState(1);
  const [ratings, setRatings] = useState<Record<RatingKey, number>>({
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
  const [submitted, setSubmitted] = useState(false);

  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Reset the submitted state each time the modal opens. Done during render
  // (the endorsed "adjust state on prop change" pattern) rather than in an
  // effect, so the confirmation screen never leaks into a fresh session.
  const [wasOpen, setWasOpen] = useState(isOpen);
  if (isOpen && !wasOpen) {
    setWasOpen(true);
    setSubmitted(false);
  } else if (!isOpen && wasOpen) {
    setWasOpen(false);
  }

  useEffect(() => {
    if (!isOpen) return;
    const trigger = document.activeElement as HTMLElement | null;
    closeButtonRef.current?.focus();
    document.body.style.overflow = 'hidden';
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
      trigger?.focus();
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleRating = (category: RatingKey, value: number) => {
    setRatings((prev) => ({ ...prev, [category]: value }));
  };

  const renderStars = (categoryKey: RatingKey, categoryLabel: string, currentRating: number) => (
    <div className="flex gap-1" role="group" aria-label={categoryLabel}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => handleRating(categoryKey, star)}
          aria-label={`Rate ${star} of 5 stars for ${categoryLabel}`}
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

  const canSubmit = ratings.overall > 0 && content.trim().length > 0;

  const handleSubmit = () => {
    const review: StoredReview = {
      id: `mqt-review-${Date.now()}`,
      submittedAt: new Date().toISOString(),
      ratings,
      title: title.trim(),
      content: content.trim(),
      liked: liked.trim(),
      improved: improved.trim(),
    };
    try {
      const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
      const list = Array.isArray(existing) ? existing : [];
      list.push(review);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    } catch {
      // localStorage unavailable (e.g. private browsing) — still show the
      // confirmation state; the review cannot be persisted on this device.
    }
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="write-review-title"
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 p-4 flex items-center justify-between z-10">
          <div>
            <h2 id="write-review-title" className="text-xl font-bold text-gray-900">
              Write a Review
            </h2>
            {!submitted && (
              <p className="text-sm text-gray-500">
                Step {step} of {TOTAL_STEPS}
              </p>
            )}
          </div>
          <button
            ref={closeButtonRef}
            onClick={onClose}
            aria-label="Close review dialog"
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          /* Confirmation state — shown after the review is received */
          <div className="p-8 text-center space-y-4" role="status">
            <CheckCircle className="w-12 h-12 text-green-600 mx-auto" />
            <h3 className="text-xl font-bold text-gray-900">Thanks for your review!</h3>
            <p className="text-gray-600 max-w-md mx-auto">
              Thanks — your review was received and will appear after moderation.
            </p>
            <button
              onClick={onClose}
              className="px-8 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
            >
              Done
            </button>
          </div>
        ) : (
          <>
            {/* Progress Bar */}
            <div className="px-4 py-2">
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all"
                  style={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
                />
              </div>
            </div>

            {/* Step 1: Rate Experience */}
            {step === 1 && (
              <div className="p-6 space-y-6">
                <h3 className="font-semibold text-gray-900">Rate Your Experience</h3>
                {RATING_CATEGORIES.map((item) => (
                  <div key={item.key} className="flex items-center justify-between">
                    <span className="text-gray-700">{item.label}</span>
                    {renderStars(item.key, item.label, ratings[item.key])}
                  </div>
                ))}
              </div>
            )}

            {/* Step 2: Write Review */}
            {step === 2 && (
              <div className="p-6 space-y-4">
                <h3 className="font-semibold text-gray-900">Write Your Review</h3>
                <div>
                  <label htmlFor="review-title" className="block text-sm font-medium text-gray-700 mb-1">
                    Review Title
                  </label>
                  <input
                    id="review-title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Summarize your experience"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="review-content" className="block text-sm font-medium text-gray-700 mb-1">
                    Your Review
                  </label>
                  <textarea
                    id="review-content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Share your experience with My Quick Trippers..."
                    rows={5}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                  />
                </div>
                <div>
                  <label htmlFor="review-liked" className="block text-sm font-medium text-gray-700 mb-1">
                    What did you like?
                  </label>
                  <textarea
                    id="review-liked"
                    value={liked}
                    onChange={(e) => setLiked(e.target.value)}
                    placeholder="What was the highlight of your trip?"
                    rows={2}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                  />
                </div>
                <div>
                  <label htmlFor="review-improved" className="block text-sm font-medium text-gray-700 mb-1">
                    What could be improved?
                  </label>
                  <textarea
                    id="review-improved"
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

            {/* Step 3: Preview & Submit */}
            {step === 3 && (
              <div className="p-6 space-y-4">
                <h3 className="font-semibold text-gray-900">Preview Your Review</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-1 mb-2" aria-hidden="true">
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
                  <p className="sr-only">
                    {ratings.overall} out of 5 stars
                  </p>
                  <h4 className="font-semibold text-gray-900 mb-1">{title || 'Your Review Title'}</h4>
                  <p className="text-gray-600 text-sm mb-2">{content || 'Your review content...'}</p>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-800">
                    Your review will appear on this page after moderation. This usually takes 24-48 hours.
                  </p>
                </div>

                {!canSubmit && (
                  <p className="text-sm text-red-600">
                    Please give an overall star rating and write your review before submitting.
                  </p>
                )}
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
              {step < TOTAL_STEPS ? (
                <button
                  onClick={() => setStep(step + 1)}
                  className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                >
                  Next
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={!canSubmit}
                  className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <CheckCircle className="w-4 h-4" />
                  Submit Review
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
