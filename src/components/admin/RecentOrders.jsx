import React, { useState, useEffect } from "react";
import { FiMoreHorizontal, FiChevronDown, FiRefreshCw } from "react-icons/fi";
import { getOrders } from "../../lib/api";
import { formatPrice } from "../../lib/formatCurrency";

const RecentOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await getOrders();
      // Take only the 5 most recent
      setOrders((data || []).slice(0, 5));
    } catch (err) {
      console.error("Failed to load recent orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const getStatusBadgeStyles = (status) => {
    switch (status) {
      case "Paid":
      case "Completed":
      case "Delivered":
        return "bg-emerald-100 text-emerald-700";
      case "Processing":
        return "bg-[#F4A623]/10 text-[#c07d10]";
      case "Shipped":
        return "bg-blue-100 text-blue-600";
      case "Cancelled":
      case "Failed":
        return "bg-red-50 text-red-500";
      case "Pending":
        return "bg-amber-50 text-amber-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  /** Get initials from customer name */
  const getInitials = (name) => {
    if (!name) return "??";
    return name
      .split(" ")
      .map((w) => w[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  /** Format a date string */
  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-NG", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  /** Get a short product summary from the items jsonb */
  const getProductSummary = (items) => {
    if (!items || !Array.isArray(items)) return "—";
    const count = items.reduce((sum, i) => sum + (i.quantity || 1), 0);
    const firstName = items[0]?.name || "Product";
    if (items.length === 1 && count === 1) return firstName;
    return `${firstName}${items.length > 1 ? ` + ${items.length - 1} more` : ""} (${count} items)`;
  };

  return (
    <div className="bg-white rounded-2xl shadow-soft border border-gray-100 mb-8 overflow-hidden">
      {/* Header */}
      <div className="p-4 md:p-6 flex flex-wrap justify-between items-center gap-4 border-b border-gray-100">
        <h2 className="text-lg md:text-xl font-serif font-bold text-[#2B1A12]">Recent Orders</h2>
        <button
          onClick={fetchOrders}
          className="flex items-center gap-2 px-3 py-1.5 border border-gray-200 rounded-full text-xs md:text-sm font-semibold text-gray-500 hover:bg-gray-50 transition-colors shrink-0"
        >
          <FiRefreshCw className={loading ? "animate-spin" : ""} /> Refresh
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-max">
          <thead>
            <tr className="bg-white border-b border-gray-100">
              <th className="px-6 py-4 text-xs font-bold text-gray-400 tracking-wider uppercase">Order ID</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 tracking-wider uppercase">Customer</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 tracking-wider uppercase">Product</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 tracking-wider uppercase">Amount</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 tracking-wider uppercase">Status</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 tracking-wider uppercase">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              <tr>
                <td colSpan={6} className="px-6 py-16 text-center">
                  <FiRefreshCw className="animate-spin mx-auto text-2xl text-gray-300 mb-3" />
                  <p className="text-gray-400 text-sm font-medium">Loading orders...</p>
                </td>
              </tr>
            ) : orders.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-16 text-center">
                  <p className="text-gray-400 font-semibold text-sm">No orders yet.</p>
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order.id} className="hover:bg-[#f9fafb] transition-colors">
                  <td className="px-6 py-4 text-sm font-semibold text-[#F4A623]">
                    #{order.id.slice(0, 8)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#F4A623]/10 flex items-center justify-center text-xs font-bold text-[#2B1A12] border border-[#F4A623]/20">
                        {getInitials(order.customer_name)}
                      </div>
                      <span className="text-sm font-bold text-[#2B1A12]">{order.customer_name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-600 max-w-[200px] truncate">
                    {getProductSummary(order.items)}
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-[#2B1A12]">{formatPrice(order.total)}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${getStatusBadgeStyles(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-500">{formatDate(order.created_at)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="p-4 md:p-6 border-t border-gray-100 flex flex-wrap justify-between items-center gap-4 bg-gray-50/50">
        <span className="text-xs md:text-sm font-semibold text-gray-500">
          Showing {orders.length} most recent orders
        </span>
      </div>
    </div>
  );
};

export default RecentOrders;
