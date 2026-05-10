import React, { useState, useEffect } from "react";
import { getOrders } from "../../lib/api";
import OrderStatCard from "../../components/admin/orders/OrderStatCard";
import OrdersTable from "../../components/admin/orders/OrdersTable";
import GeographicInsights from "../../components/admin/orders/GeographicInsights";
import CustomerFeedback from "../../components/admin/orders/CustomerFeedback";

import { HiOutlineShoppingBag, HiOutlineChartBar } from "react-icons/hi";
import { FiTruck } from "react-icons/fi";
import { BiWallet } from "react-icons/bi";

const formatCompactNumber = (number) => {
  if (number >= 1000000) return "₦" + (number / 1000000).toFixed(1) + 'M';
  if (number >= 1000) return "₦" + (number / 1000).toFixed(1) + 'K';
  return "₦" + number.toLocaleString();
};

const Orders = () => {
  const [stats, setStats] = useState({
    ordersToday: 0,
    pendingShipments: 0,
    revenueThisMonth: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const data = await getOrders();
        
        let ordersToday = 0;
        let pendingShipments = 0;
        let revenueThisMonth = 0;

        const now = new Date();
        const todayStr = now.toDateString();
        const thisMonth = now.getMonth();
        const thisYear = now.getFullYear();

        if (data) {
          data.forEach((order) => {
            const date = new Date(order.created_at);
            if (date.toDateString() === todayStr) {
              ordersToday++;
            }

            const status = (order.status || "").toLowerCase();
            // Count 'pending' or 'processing' as pending shipments
            if (status === "pending" || status === "processing" || status === "paid") {
              pendingShipments++;
            }

            if (date.getMonth() === thisMonth && date.getFullYear() === thisYear) {
              if (["paid", "processing", "shipped", "completed", "delivered"].includes(status)) {
                revenueThisMonth += Number(order.total) || 0;
              }
            }
          });
        }

        setStats({ ordersToday, pendingShipments, revenueThisMonth });
      } catch (error) {
        console.error("Failed to fetch order stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);
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
          value={loading ? "-" : stats.ordersToday.toString()}
          subtitle="Real-time daily count"
          subtitleColor="text-emerald-500"
          subtitleIcon={<HiOutlineChartBar className="inline" />}
          icon={<HiOutlineShoppingBag />}
          iconBgColor="bg-[#F4A623]/10"
          iconColor="text-[#F4A623]"
        />
        <OrderStatCard
          title="Pending Shipments"
          value={loading ? "-" : stats.pendingShipments.toString()}
          subtitle="Require immediate attention"
          subtitleColor="text-gray-400"
          icon={<FiTruck />}
          iconBgColor="bg-blue-50"
          iconColor="text-blue-500"
        />
        <OrderStatCard
          title="Revenue (This Month)"
          value={loading ? "-" : formatCompactNumber(stats.revenueThisMonth)}
          subtitle="Current month totals"
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
