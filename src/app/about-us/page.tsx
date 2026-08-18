import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us - My Quick Trippers',
  description: 'Learn more about My Quick Trippers, an ISO 9001:2008 certified travel agency.',
};

export default function AboutUsPage() {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <h1 className="text-3xl font-extrabold text-brand-navy mb-4">About Us</h1>
      <p className="text-gray-600">Information about My Quick Trippers is coming soon.</p>
    </div>
  );
}
