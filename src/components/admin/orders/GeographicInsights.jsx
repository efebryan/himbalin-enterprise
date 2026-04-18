import React from "react";

const GeographicInsights = () => {
  const regions = [
    { city: "Lagos", orders: 604, percentage: 48, color: "bg-[#F4A623]" },
    { city: "Abuja", orders: 351, percentage: 28, color: "bg-[#2B1A12]" },
    { city: "Port Harcourt", orders: 176, percentage: 14, color: "bg-amber-400" },
    { city: "Kano", orders: 75, percentage: 6, color: "bg-gray-400" },
    { city: "Others", orders: 48, percentage: 4, color: "bg-gray-200" },
  ];

  return (
    <div className="bg-white rounded-2xl p-6 shadow-soft border border-gray-100 flex-1">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-serif font-bold text-[#2B1A12]">
          Order Geographic Insights
        </h3>
        <span className="text-xs font-bold text-gray-400 border border-gray-100 bg-gray-50 px-3 py-1.5 rounded-full tracking-wider uppercase">
          By City
        </span>
      </div>

      <div className="space-y-4">
        {regions.map((region) => (
          <div key={region.city}>
            <div className="flex justify-between items-center mb-1.5">
              <div className="flex items-center gap-2.5">
                <span className={`w-2.5 h-2.5 rounded-sm ${region.color}`}></span>
                <span className="text-sm font-semibold text-gray-700">{region.city}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-medium text-gray-400">{region.orders} orders</span>
                <span className="text-sm font-bold text-[#2B1A12] w-10 text-right">{region.percentage}%</span>
              </div>
            </div>
            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full ${region.color} rounded-full transition-all duration-700`}
                style={{ width: `${region.percentage}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
        <p className="text-xs text-gray-400 font-medium">
          Total: <span className="font-bold text-[#2B1A12]">1,254 orders</span>
        </p>
        <p className="text-xs text-gray-400 font-medium">
          Last updated: <span className="text-[#F4A623] font-semibold">Today</span>
        </p>
      </div>
    </div>
  );
};

export default GeographicInsights;
