import React from "react";

const SalesDistribution = () => {
  const regions = [
    { name: "Lagos", percentage: 48, color: "bg-[#F4A623]", textColor: "text-[#2B1A12]" },
    { name: "Abuja", percentage: 28, color: "bg-[#2B1A12]", textColor: "text-[#2B1A12]" },
    { name: "Port Harcourt", percentage: 14, color: "bg-amber-400", textColor: "text-[#2B1A12]" },
    { name: "Other Regions", percentage: 10, color: "bg-gray-300", textColor: "text-gray-500" },
  ];

  return (
    <div className="bg-white rounded-2xl p-6 shadow-soft border border-gray-100 flex-1">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-serif font-bold text-[#2B1A12]">Sales by Region</h2>
        <span className="text-xs font-bold text-gray-400 tracking-wider uppercase bg-gray-50 border border-gray-100 px-3 py-1.5 rounded-full">
          This Quarter
        </span>
      </div>

      <div className="space-y-5">
        {regions.map((region) => (
          <div key={region.name}>
            <div className="flex justify-between items-center mb-1.5">
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${region.color}`}></span>
                <span className="text-sm font-semibold text-gray-600">{region.name}</span>
              </div>
              <span className="text-sm font-bold text-[#2B1A12]">{region.percentage}%</span>
            </div>
            <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full ${region.color} rounded-full transition-all duration-700`}
                style={{ width: `${region.percentage}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary Row */}
      <div className="mt-6 pt-5 border-t border-gray-100 grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-gray-400 font-semibold mb-0.5">Top Market</p>
          <p className="text-base font-bold text-[#2B1A12]">Lagos State</p>
        </div>
        <div>
          <p className="text-xs text-gray-400 font-semibold mb-0.5">Total Orders</p>
          <p className="text-base font-bold text-[#2B1A12]">1,254</p>
        </div>
      </div>
    </div>
  );
};

export default SalesDistribution;
