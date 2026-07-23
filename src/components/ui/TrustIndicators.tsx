import { ShieldCheck, Clock, Users, Award } from "lucide-react";

export default function TrustIndicators() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 text-center bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <div className="flex flex-col items-center justify-center space-y-2 p-2">
        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <h4 className="font-bold text-gray-800 text-sm">Govt. Approved</h4>
        <p className="text-xs text-gray-500 hidden md:block">Ministry of Tourism, India</p>
      </div>

      <div className="flex flex-col items-center justify-center space-y-2 p-2 border-l border-gray-100">
        <div className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center">
          <Award className="w-6 h-6" />
        </div>
        <h4 className="font-bold text-gray-800 text-sm">ISO Certified</h4>
        <p className="text-xs text-gray-500 hidden md:block">ISO 9001:2008 Standard</p>
      </div>

      <div className="flex flex-col items-center justify-center space-y-2 p-2 md:border-l border-gray-100">
        <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center">
          <Users className="w-6 h-6" />
        </div>
        <h4 className="font-bold text-gray-800 text-sm">5000+ Pilgrims</h4>
        <p className="text-xs text-gray-500 hidden md:block">Served successfully</p>
      </div>

      <div className="flex flex-col items-center justify-center space-y-2 p-2 border-l border-gray-100">
        <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center">
          <Clock className="w-6 h-6" />
        </div>
        <h4 className="font-bold text-gray-800 text-sm">15+ Years</h4>
        <p className="text-xs text-gray-500 hidden md:block">Of travel experience</p>
      </div>
    </div>
  );
}
