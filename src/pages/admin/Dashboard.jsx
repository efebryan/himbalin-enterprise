import React from "react";
import StatCard from "../../components/admin/StatCard";
import RecentOrders from "../../components/admin/RecentOrders";
import SalesDistribution from "../../components/admin/SalesDistribution";
import EnterpriseInsights from "../../components/admin/EnterpriseInsights";

import { FiDownload } from "react-icons/fi";
import { BiMoney } from "react-icons/bi";
import { HiOutlineShoppingBag, HiOutlineChartBar } from "react-icons/hi";
import { HiOutlineUserGroup } from "react-icons/hi2";

const Dashboard = () => {
  return (
    <>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-6 md:mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-[#2B1A12] mb-1">
            Dashboard Overview
          </h1>
          <p className="text-gray-500 text-xs md:text-sm font-medium">
            Real-time performance metrics for Himbalin Enterprise.
          </p>
        </div>
        <button className="flex items-center gap-2 bg-[#F4A623] hover:bg-[#e09520] text-[#2B1A12] px-4 md:px-5 py-2 md:py-2.5 rounded-full font-bold shadow-md shadow-[#F4A623]/25 transition-all text-xs md:text-sm whitespace-nowrap">
          <FiDownload className="text-lg md:text-base" />
          <span className="inline">Export Report</span>
        </button>
      </div>

      {/* Stat Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Sales"
          value="₦45.2M"
          percentage="12.5"
          isPositive={true}
          icon={<BiMoney />}
          iconBgColor="bg-blue-50"
          iconColor="text-blue-500"
        />
        <StatCard
          title="New Orders"
          value="1,254"
          percentage="8.2"
          isPositive={true}
          icon={<HiOutlineShoppingBag />}
          iconBgColor="bg-[#F4A623]/10"
          iconColor="text-[#F4A623]"
        />
        <StatCard
          title="Total Customers"
          value="2,420"
          percentage="5.1"
          isPositive={true}
          icon={<HiOutlineUserGroup />}
          iconBgColor="bg-emerald-50"
          iconColor="text-emerald-500"
        />
        <StatCard
          title="Revenue Growth"
          value="24.5%"
          percentage="2.4"
          isPositive={false}
          icon={<HiOutlineChartBar />}
          iconBgColor="bg-red-50"
          iconColor="text-red-400"
        />
      </div>

      {/* Recent Orders Table */}
      <RecentOrders />

      {/* Bottom Grid */}
      <div className="flex flex-col lg:flex-row gap-6 pb-8">
        <SalesDistribution />
        <EnterpriseInsights />
      </div>
    </>
  );
};

export default Dashboard;
