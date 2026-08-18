import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pay Online - My Quick Trippers',
  description: 'Secure online payment portal for My Quick Trippers tour packages.',
};

export default function PayOnlinePage() {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <h1 className="text-3xl font-extrabold text-brand-navy mb-4">Pay Online</h1>
      <p className="text-gray-600">Online payment integration coming soon.</p>
    </div>
  );
}
