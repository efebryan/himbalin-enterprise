import React, { useState, useEffect } from "react";
import { HiOutlineTrendingUp, HiOutlineUsers, HiOutlineShoppingBag } from "react-icons/hi";
import { MdOutlineEmail } from "react-icons/md";
import { supabase } from "../../lib/supabase";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { format, subDays } from "date-fns";

const COLORS = ["#F4A623", "#2B1A12", "#10B981", "#EF4444", "#3B82F6"];

const Analytics = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalCustomers: 0,
    totalSubscribers: 0,
  });

  const [revenueData, setRevenueData] = useState([]);
  const [orderStatusData, setOrderStatusData] = useState([]);

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);

      // Fetch all required data in parallel
      const [
        { data: orders, error: ordersError },
        { count: customersCount, error: custError },
        { count: subscribersCount, error: subError },
      ] = await Promise.all([
        supabase.from("orders").select("*"),
        supabase.from("customers").select("*", { count: "exact", head: true }),
        supabase.from("subscribers").select("*", { count: "exact", head: true }),
      ]);

      if (ordersError) console.error(ordersError);

      const validOrders = orders || [];

      // 1. Calculate KPIs
      const totalRevenue = validOrders.reduce((sum, order) => {
        // Assume 'Cancelled' orders don't count towards revenue
        if (order.status !== 'Cancelled') {
           return sum + Number(order.total || 0);
        }
        return sum;
      }, 0);

      setStats({
        totalRevenue,
        totalOrders: validOrders.length,
        totalCustomers: customersCount || 0,
        totalSubscribers: subscribersCount || 0,
      });

      // 2. Prepare Revenue Chart Data (Last 7 Days)
      const last7Days = Array.from({ length: 7 }).map((_, i) => {
        const d = subDays(new Date(), 6 - i);
        return {
          date: format(d, "MMM dd"),
          fullDate: d,
          revenue: 0,
        };
      });

      validOrders.forEach((order) => {
        if (order.status !== 'Cancelled' && order.created_at) {
          const orderDate = new Date(order.created_at);
          const formattedDate = format(orderDate, "MMM dd");
          const dayIndex = last7Days.findIndex((d) => d.date === formattedDate);
          if (dayIndex !== -1) {
            last7Days[dayIndex].revenue += Number(order.total || 0);
          }
        }
      });

      setRevenueData(last7Days);

      // 3. Prepare Order Status Pie Chart Data
      const statusCounts = {};
      validOrders.forEach((order) => {
        const status = order.status || 'Pending';
        statusCounts[status] = (statusCounts[status] || 0) + 1;
      });

      const pieData = Object.keys(statusCounts).map((key) => ({
        name: key,
        value: statusCounts[key],
      }));

      setOrderStatusData(pieData);

    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(value);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-[#F4A623] border-t-transparent"></div>
      </div>
    );
  }

  return (
    <>
      {/* Page Header */}
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-serif font-bold text-[#2B1A12] mb-1">Analytics Dashboard</h1>
        <p className="text-gray-500 text-xs md:text-sm font-medium">
          Comprehensive overview of your business performance.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
        <div className="bg-white p-5 md:p-6 rounded-2xl shadow-soft border border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#F4A623]/10 flex items-center justify-center shrink-0">
            <HiOutlineTrendingUp className="text-2xl text-[#F4A623]" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 tracking-wider uppercase mb-1">Total Revenue</p>
            <h3 className="text-xl md:text-2xl font-bold text-[#2B1A12]">{formatCurrency(stats.totalRevenue)}</h3>
          </div>
        </div>

        <div className="bg-white p-5 md:p-6 rounded-2xl shadow-soft border border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
            <HiOutlineShoppingBag className="text-2xl text-blue-500" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 tracking-wider uppercase mb-1">Total Orders</p>
            <h3 className="text-xl md:text-2xl font-bold text-[#2B1A12]">{stats.totalOrders}</h3>
          </div>
        </div>

        <div className="bg-white p-5 md:p-6 rounded-2xl shadow-soft border border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
            <HiOutlineUsers className="text-2xl text-emerald-500" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 tracking-wider uppercase mb-1">Customers</p>
            <h3 className="text-xl md:text-2xl font-bold text-[#2B1A12]">{stats.totalCustomers}</h3>
          </div>
        </div>

        <div className="bg-white p-5 md:p-6 rounded-2xl shadow-soft border border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center shrink-0">
            <MdOutlineEmail className="text-2xl text-purple-500" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 tracking-wider uppercase mb-1">Subscribers</p>
            <h3 className="text-xl md:text-2xl font-bold text-[#2B1A12]">{stats.totalSubscribers}</h3>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Revenue Area Chart */}
        <div className="bg-white p-5 md:p-6 rounded-2xl shadow-soft border border-gray-100 lg:col-span-2">
          <h3 className="text-lg font-bold text-[#2B1A12] mb-6">Revenue (Last 7 Days)</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F4A623" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#F4A623" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: '#9ca3af' }} 
                  dy={10} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: '#9ca3af' }}
                  tickFormatter={(val) => `₦${(val / 1000).toFixed(0)}k`}
                />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  formatter={(value) => [formatCurrency(value), "Revenue"]}
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#F4A623" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorRevenue)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Order Status Pie Chart */}
        <div className="bg-white p-5 md:p-6 rounded-2xl shadow-soft border border-gray-100">
          <h3 className="text-lg font-bold text-[#2B1A12] mb-6">Order Status</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={orderStatusData}
                  cx="50%"
                  cy="45%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {orderStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </>
  );
};

export default Analytics;
