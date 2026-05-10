import React, { useState, useEffect } from "react";
import { HiOutlineSparkles } from "react-icons/hi2";
import { getOrders, getCustomers } from "../../lib/api";
import { formatPrice } from "../../lib/formatCurrency";

const EnterpriseInsights = () => {
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        setLoading(true);
        const [ordersData, customersData] = await Promise.all([
          getOrders(),
          getCustomers(),
        ]);

        const orders = ordersData || [];
        const customers = customersData || [];

        // ── Avg Order Value ───────────────────────────────────────────────────
        const successStatuses = ["paid", "processing", "shipped", "completed", "delivered"];
        const successOrders = orders.filter((o) =>
          successStatuses.includes((o.status || "").toLowerCase())
        );
        const totalRevenue = successOrders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);
        const avgOrderValue = successOrders.length > 0 ? totalRevenue / successOrders.length : 0;

        // ── Repeat Customers ─────────────────────────────────────────────────
        // Count customers who appear more than once in orders
        const emailCounts = {};
        orders.forEach((o) => {
          const email = o.customer_email;
          if (email) emailCounts[email] = (emailCounts[email] || 0) + 1;
        });
        const repeatCount = Object.values(emailCounts).filter((c) => c > 1).length;
        const totalUniqueCustomers = Object.keys(emailCounts).length;
        const repeatRate =
          totalUniqueCustomers > 0
            ? Math.round((repeatCount / totalUniqueCustomers) * 100)
            : 0;

        // ── Conversion Rate (Orders vs. Customers) ───────────────────────────
        // Compares customers who placed at least one order vs total registered customers
        const customersWhoOrdered = new Set(orders.map((o) => o.customer_email).filter(Boolean)).size;
        const totalCustomers = customers.length;
        const conversionRate =
          totalCustomers > 0
            ? Math.round((customersWhoOrdered / totalCustomers) * 100)
            : 0;

        setInsights([
          {
            label: "Avg. Order Value",
            value: avgOrderValue > 0 ? formatPrice(avgOrderValue) : "₦0",
            trend: successOrders.length > 0 ? `${successOrders.length} orders` : "No orders",
            positive: true,
          },
          {
            label: "Repeat Customers",
            value: `${repeatRate}%`,
            trend: `${repeatCount} of ${totalUniqueCustomers}`,
            positive: repeatRate > 20,
          },
          {
            label: "Conversion Rate",
            value: `${conversionRate}%`,
            trend: `${customersWhoOrdered} ordered`,
            positive: conversionRate > 30,
          },
        ]);
      } catch (err) {
        console.error("Failed to load enterprise insights:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchInsights();
  }, []);

  return (
    <div className="bg-[#2B1A12] rounded-2xl p-8 flex-1 flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-[#F4A623] rounded-xl flex items-center justify-center shadow-md shadow-[#F4A623]/30">
          <HiOutlineSparkles className="text-xl text-[#2B1A12]" />
        </div>
        <div>
          <h2 className="text-base font-serif font-bold text-white leading-none">Enterprise Insights</h2>
          <p className="text-[11px] text-white/40 font-medium mt-0.5">Live business intelligence</p>
        </div>
      </div>

      {/* Insight Rows */}
      <div className="space-y-4 flex-1">
        {loading ? (
          <p className="text-sm text-white/40 animate-pulse text-center py-6">Calculating insights...</p>
        ) : (
          insights.map((item) => (
            <div
              key={item.label}
              className="flex justify-between items-center p-4 bg-white/5 border border-white/10 rounded-xl"
            >
              <span className="text-sm font-medium text-white/60">{item.label}</span>
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-white">{item.value}</span>
                <span
                  className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                    item.positive
                      ? "bg-emerald-500/20 text-emerald-400"
                      : "bg-amber-500/20 text-amber-400"
                  }`}
                >
                  {item.trend}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* CTA */}
      <button className="mt-6 w-full px-6 py-3 bg-[#F4A623] text-[#2B1A12] font-bold rounded-full text-sm hover:bg-[#e09520] transition-colors shadow-md shadow-[#F4A623]/20">
        Generate Full AI Report
      </button>
    </div>
  );
};

export default EnterpriseInsights;
