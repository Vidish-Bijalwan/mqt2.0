import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Group Tours - My Quick Trippers',
  description: 'Fixed-departure group tour packages from My Quick Trippers.',
};

export default function GroupToursPage() {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <h1 className="text-3xl font-extrabold text-brand-navy mb-4">Group Tours</h1>
      <p className="text-gray-600">Group tour packages will be listed here soon.</p>
    </div>
  );
}
