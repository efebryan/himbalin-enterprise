import React, { useState, useEffect } from "react";
import { getOrders } from "../../lib/api";
import OrderStatCard from "../../components/admin/orders/OrderStatCard";
import OrdersTable from "../../components/admin/orders/OrdersTable";
import GeographicInsights from "../../components/admin/orders/GeographicInsights";
import CustomerFeedback from "../../components/admin/orders/CustomerFeedback";

import { HiOutlineShoppingBag, HiOutlineChartBar } from "react-icons/hi";
import { FiTruck, FiCheckCircle } from "react-icons/fi";
import { BiWallet } from "react-icons/bi";

const formatCompactNumber = (number) => {
  if (number >= 1000000) return "₦" + (number / 1000000).toFixed(1) + "M";
  if (number >= 1000) return "₦" + (number / 1000).toFixed(1) + "K";
  return "₦" + number.toLocaleString();
};

const Orders = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingShipments: 0,
    totalShipped: 0,
    revenueThisMonth: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const data = await getOrders();

        let totalOrders = 0;
        let pendingShipments = 0;
        let totalShipped = 0;
        let revenueThisMonth = 0;

        const now = new Date();
        const thisMonth = now.getMonth();
        const thisYear = now.getFullYear();

        if (data) {
          // All-time total orders count
          totalOrders = data.length;

          data.forEach((order) => {
            const date = new Date(order.created_at);
            const status = (order.status || "").toLowerCase();

            // Pending shipments: orders not yet dispatched
            if (
              status === "pending" ||
              status === "processing" ||
              status === "paid"
            ) {
              pendingShipments++;
            }

            // Total shipped: orders dispatched or fully delivered
            if (
              status === "shipped" ||
              status === "delivered" ||
              status === "completed"
            ) {
              totalShipped++;
            }

            // Revenue this month: successful orders in current calendar month
            if (
              date.getMonth() === thisMonth &&
              date.getFullYear() === thisYear
            ) {
              if (
                ["paid", "processing", "shipped", "completed", "delivered"].includes(
                  status
                )
              ) {
                revenueThisMonth += Number(order.total) || 0;
              }
            }
          });
        }

        setStats({ totalOrders, pendingShipments, totalShipped, revenueThisMonth });
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
        <h1 className="text-2xl md:text-3xl font-serif font-bold text-[#2B1A12] mb-1">
          Orders Management
        </h1>
        <p className="text-gray-500 text-xs md:text-sm font-medium">
          Track, manage, and fulfill all customer orders.
        </p>
      </div>

      {/* Top Stat Cards — 4 columns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        {/* Total Orders (all-time) */}
        <OrderStatCard
          title="Total Orders"
          value={loading ? "-" : stats.totalOrders.toString()}
          subtitle="All-time order count"
          subtitleColor="text-emerald-500"
          subtitleIcon={<HiOutlineChartBar className="inline" />}
          icon={<HiOutlineShoppingBag />}
          iconBgColor="bg-[#F4A623]/10"
          iconColor="text-[#F4A623]"
        />

        {/* Pending Shipments */}
        <OrderStatCard
          title="Pending Shipments"
          value={loading ? "-" : stats.pendingShipments.toString()}
          subtitle="Require immediate attention"
          subtitleColor="text-gray-400"
          icon={<FiTruck />}
          iconBgColor="bg-blue-50"
          iconColor="text-blue-500"
        />

        {/* Total Shipped */}
        <OrderStatCard
          title="Total Shipped"
          value={loading ? "-" : stats.totalShipped.toString()}
          subtitle="Shipped & delivered orders"
          subtitleColor="text-purple-500"
          subtitleIcon={<FiCheckCircle className="inline" />}
          icon={<FiCheckCircle />}
          iconBgColor="bg-purple-50"
          iconColor="text-purple-500"
        />

        {/* Revenue This Month */}
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
