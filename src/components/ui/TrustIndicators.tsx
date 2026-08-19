import Link from "next/link";
import { ShieldCheck, Clock, Users, Award } from "lucide-react";

interface TrustIndicatorsProps {
  category?: string;
}

// Trust indicators (T27) — each claim links to the page that backs it up
// (/about-us for company credentials, /reviews for traveller proof).
export default function TrustIndicators({ category }: TrustIndicatorsProps) {
  const isPilgrimage = category === 'Pilgrimage' || category === 'Helicopter';
  const travelersText = isPilgrimage ? "5000+ Pilgrims" : "5000+ Happy Travelers";

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 text-center bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <Link href="/about-us" className="flex flex-col items-center justify-center space-y-2 p-2 hover:bg-gray-50 rounded-lg transition-colors">
        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <h4 className="font-bold text-gray-800 text-sm">Govt. Approved</h4>
        <p className="text-xs text-gray-500 hidden md:block">Ministry of Tourism, India</p>
      </Link>

      <Link href="/about-us" className="flex flex-col items-center justify-center space-y-2 p-2 border-l border-gray-100 hover:bg-gray-50 rounded-lg transition-colors">
        <div className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center">
          <Award className="w-6 h-6" />
        </div>
        <h4 className="font-bold text-gray-800 text-sm">ISO Certified</h4>
        <p className="text-xs text-gray-500 hidden md:block">ISO 9001:2008 Standard</p>
      </Link>

      <Link href="/reviews" className="flex flex-col items-center justify-center space-y-2 p-2 md:border-l border-gray-100 hover:bg-gray-50 rounded-lg transition-colors">
        <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center">
          <Users className="w-6 h-6" />
        </div>
        <h4 className="font-bold text-gray-800 text-sm">{travelersText}</h4>
        <p className="text-xs text-gray-500 hidden md:block">Served successfully</p>
      </Link>

      <Link href="/about-us" className="flex flex-col items-center justify-center space-y-2 p-2 border-l border-gray-100 hover:bg-gray-50 rounded-lg transition-colors">
        <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center">
          <Clock className="w-6 h-6" />
        </div>
        <h4 className="font-bold text-gray-800 text-sm">15+ Years</h4>
        <p className="text-xs text-gray-500 hidden md:block">Of travel experience</p>
      </Link>
    </div>
  );
}
