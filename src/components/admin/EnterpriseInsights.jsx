import React from "react";
import { HiOutlineSparkles } from "react-icons/hi2";

const EnterpriseInsights = () => {
  const insights = [
    { label: "Avg. Order Value", value: "₦685,000", trend: "+8.2%" },
    { label: "Repeat Customers", value: "38%", trend: "+4.1%" },
    { label: "Cart Abandonment", value: "21%", trend: "-3.5%" },
  ];

  return (
    <div className="bg-[#2B1A12] rounded-2xl p-8 flex-1 flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-[#F4A623] rounded-xl flex items-center justify-center shadow-md shadow-[#F4A623]/30">
          <HiOutlineSparkles className="text-xl text-[#2B1A12]" />
        </div>
        <div>
          <h2 className="text-base font-serif font-bold text-white leading-none">Enterprise Insights</h2>
          <p className="text-[11px] text-white/40 font-medium mt-0.5">AI-powered business intelligence</p>
        </div>
      </div>

      {/* Insight Rows */}
      <div className="space-y-4 flex-1">
        {insights.map((item) => (
          <div
            key={item.label}
            className="flex justify-between items-center p-4 bg-white/5 border border-white/10 rounded-xl"
          >
            <span className="text-sm font-medium text-white/60">{item.label}</span>
            <div className="flex items-center gap-3">
              <span className="text-sm font-bold text-white">{item.value}</span>
              <span
                className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                  item.trend.startsWith("+")
                    ? "bg-emerald-500/20 text-emerald-400"
                    : "bg-red-500/20 text-red-400"
                }`}
              >
                {item.trend}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <button className="mt-6 w-full px-6 py-3 bg-[#F4A623] text-[#2B1A12] font-bold rounded-full text-sm hover:bg-[#e09520] transition-colors shadow-md shadow-[#F4A623]/20">
        Generate Full AI Report
      </button>
    </div>
  );
};

export default EnterpriseInsights;
