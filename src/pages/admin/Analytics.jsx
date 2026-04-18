import React from "react";
import { MdAnalytics } from "react-icons/md";
import { Link } from "react-router-dom";

const Analytics = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      {/* Icon */}
      <div className="w-20 h-20 bg-[#2B1A12]/5 border-2 border-[#2B1A12]/10 rounded-2xl flex items-center justify-center mb-6">
        <MdAnalytics className="text-4xl text-[#2B1A12]" />
      </div>

      <h1 className="text-3xl font-serif font-bold text-[#2B1A12] mb-3">Analytics</h1>
      <p className="text-gray-400 font-medium text-sm mb-2 max-w-sm leading-relaxed">
        Advanced analytics with revenue charts, sales forecasts, and product performance metrics are coming soon.
      </p>
      <p className="text-xs font-bold text-[#F4A623] tracking-widest uppercase mb-8">
        Coming Soon
      </p>

      <Link
        to="/admin"
        className="px-6 py-2.5 bg-[#2B1A12] text-white rounded-full text-sm font-bold hover:bg-[#3d2518] transition-colors shadow-md"
      >
        ← Back to Dashboard
      </Link>
    </div>
  );
};

export default Analytics;
