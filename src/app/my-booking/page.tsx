import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My Booking - My Quick Trippers',
  description: 'Manage your My Quick Trippers tour package booking.',
};

export default function MyBookingPage() {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <h1 className="text-3xl font-extrabold text-brand-navy mb-4">My Booking</h1>
      <p className="text-gray-600">Booking management integration is coming soon.</p>
    </div>
  );
}
