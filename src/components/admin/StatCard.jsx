import React from "react";
import { FiTrendingUp, FiTrendingDown } from "react-icons/fi";

const StatCard = ({ title, value, percentage, isPositive, icon, iconBgColor, iconColor }) => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-soft border border-gray-100 flex flex-col justify-between h-40 hover:shadow-hover transition-all duration-300">
      <div className="flex justify-between items-start">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${iconBgColor}`}>
          <span className={`text-2xl ${iconColor}`}>{icon}</span>
        </div>
        <div
          className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
            isPositive
              ? "bg-emerald-50 text-emerald-600"
              : "bg-red-50 text-red-500"
          }`}
        >
          {isPositive ? <FiTrendingUp className="text-xs" /> : <FiTrendingDown className="text-xs" />}
          {isPositive ? "+" : "-"}{percentage}%
        </div>
      </div>
      <div>
        <p className="text-sm font-semibold text-gray-400 mb-1">{title}</p>
        <h3 className="text-3xl font-bold text-[#2B1A12]">{value}</h3>
      </div>
    </div>
  );
};

export default StatCard;
