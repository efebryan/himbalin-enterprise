import React from "react";

const OrderStatCard = ({ title, value, subtitle, subtitleColor, subtitleIcon, icon, iconBgColor, iconColor }) => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-soft border border-gray-100 flex justify-between items-center h-36 hover:shadow-hover transition-all duration-300">
      <div className="flex flex-col justify-between h-full">
        <p className="text-sm font-semibold text-gray-400">{title}</p>
        <h3 className="text-3xl font-bold text-[#2B1A12] my-1">{value}</h3>
        <p className={`text-xs font-semibold ${subtitleColor} flex items-center gap-1`}>
          {subtitleIcon}
          {subtitle}
        </p>
      </div>
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${iconBgColor} shrink-0`}>
        <span className={`text-2xl ${iconColor}`}>{icon}</span>
      </div>
    </div>
  );
};

export default OrderStatCard;
