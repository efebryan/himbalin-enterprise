import React, { useState, useEffect } from "react";
import StatCard from "../../components/admin/StatCard";
import RecentOrders from "../../components/admin/RecentOrders";
import SalesDistribution from "../../components/admin/SalesDistribution";
import EnterpriseInsights from "../../components/admin/EnterpriseInsights";

import { FiDownload } from "react-icons/fi";
import { BiMoney } from "react-icons/bi";
import { HiOutlineShoppingBag, HiOutlineChartBar } from "react-icons/hi";
import { HiOutlineUserGroup } from "react-icons/hi2";
import { getOrders, getCustomers } from "../../lib/api";

const formatExactCurrency = (number) => {
  return "₦" + number.toLocaleString("en-NG", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
};

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalSales: 0,
    salesGrowth: "0.0",
    isSalesGrowthPositive: true,
    newOrders: 0,
    ordersGrowth: "0.0",
    isOrdersGrowthPositive: true,
    totalCustomers: 0,
    customersGrowth: "0.0",
    isCustomersGrowthPositive: true,
    revenueGrowth: "0.0",
    isRevenueGrowthPositive: true
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        setLoading(true);
        const [ordersData, customersData] = await Promise.all([
          getOrders(),
          getCustomers()
        ]);
        
        let totalSales = 0;
        let newOrders = ordersData ? ordersData.length : 0;
        let totalCustomers = customersData ? customersData.length : 0;

        const now = new Date();
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

        let currentRevenue = 0;
        let previousRevenue = 0;
        let currentOrdersCount = 0;
        let previousOrdersCount = 0;

        if (ordersData) {
          ordersData.forEach(order => {
            const orderTotal = Number(order.total) || 0;
            const status = (order.status || "").toLowerCase();
            const isSuccessful = ["paid", "processing", "shipped", "completed", "delivered"].includes(status);

            if (isSuccessful) {
              totalSales += orderTotal;
            }

            const orderDate = new Date(order.created_at);
            if (orderDate >= thirtyDaysAgo) {
              if (isSuccessful) currentRevenue += orderTotal;
              currentOrdersCount++;
            } else if (orderDate >= sixtyDaysAgo && orderDate < thirtyDaysAgo) {
              if (isSuccessful) previousRevenue += orderTotal;
              previousOrdersCount++;
            }
          });
        }
        
        let currentCustomersCount = 0;
        let previousCustomersCount = 0;
        
        if (customersData) {
           customersData.forEach(customer => {
              const customerDate = new Date(customer.created_at);
              if (customerDate >= thirtyDaysAgo) {
                currentCustomersCount++;
              } else if (customerDate >= sixtyDaysAgo && customerDate < thirtyDaysAgo) {
                previousCustomersCount++;
              }
           });
        }

        const calcGrowth = (current, previous) => {
           if (previous > 0) return ((current - previous) / previous) * 100;
           if (current > 0) return 100;
           return 0;
        };

        const salesGrowth = calcGrowth(currentRevenue, previousRevenue);
        const ordersGrowth = calcGrowth(currentOrdersCount, previousOrdersCount);
        const customersGrowth = calcGrowth(currentCustomersCount, previousCustomersCount);

        setStats({
          totalSales,
          salesGrowth: Math.abs(salesGrowth).toFixed(1),
          isSalesGrowthPositive: salesGrowth >= 0,

          newOrders,
          ordersGrowth: Math.abs(ordersGrowth).toFixed(1),
          isOrdersGrowthPositive: ordersGrowth >= 0,

          totalCustomers,
          customersGrowth: Math.abs(customersGrowth).toFixed(1),
          isCustomersGrowthPositive: customersGrowth >= 0,

          revenueGrowth: salesGrowth.toFixed(1),
          isRevenueGrowthPositive: salesGrowth >= 0
        });

      } catch (error) {
        console.error("Failed to load dashboard stats", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);
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
          value={loading ? "-" : formatExactCurrency(stats.totalSales)}
          percentage={stats.salesGrowth}
          isPositive={stats.isSalesGrowthPositive}
          icon={<BiMoney />}
          iconBgColor="bg-blue-50"
          iconColor="text-blue-500"
        />
        <StatCard
          title="New Orders"
          value={loading ? "-" : stats.newOrders.toLocaleString()}
          percentage={stats.ordersGrowth}
          isPositive={stats.isOrdersGrowthPositive}
          icon={<HiOutlineShoppingBag />}
          iconBgColor="bg-[#F4A623]/10"
          iconColor="text-[#F4A623]"
        />
        <StatCard
          title="Total Customers"
          value={loading ? "-" : stats.totalCustomers.toLocaleString()}
          percentage={stats.customersGrowth}
          isPositive={stats.isCustomersGrowthPositive}
          icon={<HiOutlineUserGroup />}
          iconBgColor="bg-emerald-50"
          iconColor="text-emerald-500"
        />
        <StatCard
          title="Revenue Growth"
          value={loading ? "-" : `${stats.revenueGrowth}%`}
          percentage={stats.salesGrowth}
          isPositive={stats.isRevenueGrowthPositive}
          icon={<HiOutlineChartBar />}
          iconBgColor={stats.isRevenueGrowthPositive ? "bg-emerald-50" : "bg-red-50"}
          iconColor={stats.isRevenueGrowthPositive ? "text-emerald-500" : "text-red-400"}
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
