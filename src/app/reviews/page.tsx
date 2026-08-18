import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Reviews - My Quick Trippers',
  description: 'Read reviews from our satisfied travelers.',
};

export default function ReviewsPage() {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <h1 className="text-3xl font-extrabold text-brand-navy mb-4">Customer Reviews</h1>
      <p className="text-gray-600">Reviews section is currently under construction.</p>
    </div>
  );
}
