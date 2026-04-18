import React from "react";
import { FiMoreHorizontal, FiChevronDown } from "react-icons/fi";

const RecentOrders = () => {
  const orders = [
    {
      id: "#ORD-7721",
      customer: "Amaka Okonkwo",
      avatar: "https://i.pravatar.cc/150?u=amaka",
      product: "Royal Leather Sofa Set",
      amount: "₦1,450,000",
      status: "Completed",
      date: "Apr 10, 2025",
    },
    {
      id: "#ORD-7720",
      customer: "Emeka Nwosu",
      avatar: "https://i.pravatar.cc/150?u=emeka",
      product: "Imported Persian Rug (6×9ft)",
      amount: "₦380,000",
      status: "Processing",
      date: "Apr 11, 2025",
    },
    {
      id: "#ORD-7719",
      customer: "Fatima Bello",
      avatar: "https://i.pravatar.cc/150?u=fatima",
      product: "Executive Office Chair",
      amount: "₦195,000",
      status: "Shipped",
      date: "Apr 12, 2025",
    },
    {
      id: "#ORD-7718",
      customer: "Chukwuemeka Adeyemi",
      avatar: "https://i.pravatar.cc/150?u=chukwu",
      product: "Artificial Grass Installation (80sqm)",
      amount: "₦560,000",
      status: "Cancelled",
      date: "Apr 12, 2025",
    },
  ];

  const getStatusBadgeStyles = (status) => {
    switch (status) {
      case "Completed":
        return "bg-emerald-100 text-emerald-700";
      case "Processing":
        return "bg-[#F4A623]/10 text-[#c07d10]";
      case "Shipped":
        return "bg-blue-100 text-blue-600";
      case "Cancelled":
        return "bg-red-50 text-red-500";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-soft border border-gray-100 mb-8 overflow-hidden">
      {/* Header */}
      <div className="p-4 md:p-6 flex flex-wrap justify-between items-center gap-4 border-b border-gray-100">
        <h2 className="text-lg md:text-xl font-serif font-bold text-[#2B1A12]">Recent Orders</h2>
        <button className="flex items-center gap-2 px-3 py-1.5 border border-gray-200 rounded-full text-xs md:text-sm font-semibold text-gray-500 hover:bg-gray-50 transition-colors shrink-0">
          Last 7 days <FiChevronDown />
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
              <th className="px-6 py-4 text-xs font-bold text-gray-400 tracking-wider uppercase">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-[#f9fafb] transition-colors">
                <td className="px-6 py-4 text-sm font-semibold text-[#F4A623]">{order.id}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <img src={order.avatar} alt={order.customer} className="w-8 h-8 rounded-full bg-gray-200 border border-gray-200" />
                    <span className="text-sm font-bold text-[#2B1A12]">{order.customer}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm font-medium text-gray-600">{order.product}</td>
                <td className="px-6 py-4 text-sm font-bold text-[#2B1A12]">{order.amount}</td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${getStatusBadgeStyles(order.status)}`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm font-medium text-gray-500">{order.date}</td>
                <td className="px-6 py-4">
                  <button className="text-gray-400 hover:text-[#2B1A12] transition-colors">
                    <FiMoreHorizontal className="text-xl" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer / Pagination */}
      <div className="p-4 md:p-6 border-t border-gray-100 flex flex-wrap justify-between items-center gap-4 bg-gray-50/50">
        <span className="text-xs md:text-sm font-semibold text-gray-500">Showing 4 of 1,254 orders</span>
        <div className="flex gap-2 w-full sm:w-auto justify-between sm:justify-end">
          <button
            className="px-4 py-2 border border-gray-200 rounded-full text-xs md:text-sm font-bold text-gray-400 hover:bg-gray-100 transition-colors disabled:opacity-50 flex-1 sm:flex-none text-center"
            disabled
          >
            Previous
          </button>
          <button className="px-4 py-2 bg-[#F4A623] rounded-full text-xs md:text-sm font-bold text-[#2B1A12] hover:bg-[#e09520] shadow-md transition-all flex-1 sm:flex-none text-center">
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecentOrders;
