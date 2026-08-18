import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Careers - My Quick Trippers',
  description: 'Join the team at My Quick Trippers.',
};

export default function CareersPage() {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <h1 className="text-3xl font-extrabold text-brand-navy mb-4">Careers</h1>
      <p className="text-gray-600">Check back later for open positions.</p>
    </div>
  );
}
