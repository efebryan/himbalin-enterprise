import React from "react";
import OrderStatCard from "../../components/admin/orders/OrderStatCard";
import OrdersTable from "../../components/admin/orders/OrdersTable";
import GeographicInsights from "../../components/admin/orders/GeographicInsights";
import CustomerFeedback from "../../components/admin/orders/CustomerFeedback";

import { HiOutlineShoppingBag, HiOutlineChartBar } from "react-icons/hi";
import { FiTruck } from "react-icons/fi";
import { BiWallet } from "react-icons/bi";

const Orders = () => {
  return (
    <>
      {/* Page Header */}
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-serif font-bold text-[#2B1A12] mb-1">Orders Management</h1>
        <p className="text-gray-500 text-xs md:text-sm font-medium">
          Track, manage, and fulfill all customer orders.
        </p>
      </div>

      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <OrderStatCard
          title="Total Orders Today"
          value="142"
          subtitle="+12% from yesterday"
          subtitleColor="text-emerald-500"
          subtitleIcon={<HiOutlineChartBar className="inline" />}
          icon={<HiOutlineShoppingBag />}
          iconBgColor="bg-[#F4A623]/10"
          iconColor="text-[#F4A623]"
        />
        <OrderStatCard
          title="Pending Shipments"
          value="28"
          subtitle="Require immediate attention"
          subtitleColor="text-gray-400"
          icon={<FiTruck />}
          iconBgColor="bg-blue-50"
          iconColor="text-blue-500"
        />
        <OrderStatCard
          title="Revenue (This Month)"
          value="₦84.3M"
          subtitle="Target: ₦100M"
          subtitleColor="text-emerald-500"
          subtitleIcon={<BiWallet className="inline" />}
          icon={<BiWallet />}
          iconBgColor="bg-emerald-50"
          iconColor="text-emerald-500"
        />
      </div>

      {/* Orders Data Table */}
      <OrdersTable />

      {/* Bottom Widgets */}
      <div className="flex flex-col lg:flex-row gap-6 pb-8">
        <GeographicInsights />
        <CustomerFeedback />
      </div>
    </>
  );
};

export default Orders;
