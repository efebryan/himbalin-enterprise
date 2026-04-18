import React, { useState, useRef, useEffect } from "react";
import { FiEye, FiFilter, FiChevronDown, FiChevronUp, FiX, FiDownload } from "react-icons/fi";
import ViewOrderModal from "./ViewOrderModal";
import Toast from "../../admin/products/Toast";

const ORDER_STATUSES = ["All Status", "Processing", "Shipped", "Delivered", "Cancelled"];
const PAYMENT_STATUSES = ["All Payments", "Paid", "Pending", "Failed"];
const DATE_RANGES = ["All Time", "Today", "Last 7 Days", "Last 30 Days", "This Month"];

const INITIAL_ORDERS = [
  {
    id: "#LX-9082",
    initials: "AO",
    customer: "Amaka Okonkwo",
    date: "Apr 10, 2025",
    price: "₦1,450,000",
    items: "3 items",
    paymentStatus: "Paid",
    orderStatus: "Processing",
  },
  {
    id: "#LX-9081",
    initials: "EN",
    customer: "Emeka Nwosu",
    date: "Apr 11, 2025",
    price: "₦380,000",
    items: "1 item",
    paymentStatus: "Paid",
    orderStatus: "Shipped",
  },
  {
    id: "#LX-9080",
    initials: "FB",
    customer: "Fatima Bello",
    date: "Apr 11, 2025",
    price: "₦195,000",
    items: "2 items",
    paymentStatus: "Pending",
    orderStatus: "Processing",
  },
  {
    id: "#LX-9079",
    initials: "OA",
    customer: "Olumide Adeyinka",
    date: "Apr 12, 2025",
    price: "₦560,000",
    items: "4 items",
    paymentStatus: "Paid",
    orderStatus: "Delivered",
  },
  {
    id: "#LX-9078",
    initials: "CA",
    customer: "Chidinma Eze",
    date: "Apr 12, 2025",
    price: "₦2,100,000",
    items: "5 items",
    paymentStatus: "Failed",
    orderStatus: "Cancelled",
  },
  {
    id: "#LX-9077",
    initials: "TA",
    customer: "Tunde Afolabi",
    date: "Apr 13, 2025",
    price: "₦720,000",
    items: "2 items",
    paymentStatus: "Paid",
    orderStatus: "Processing",
  },
  {
    id: "#LX-9076",
    initials: "NG",
    customer: "Ngozi Ibe",
    date: "Apr 13, 2025",
    price: "₦95,000",
    items: "1 item",
    paymentStatus: "Paid",
    orderStatus: "Delivered",
  },
];

const OrdersTable = () => {
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [viewOrder, setViewOrder] = useState(null);
  const [toast, setToast] = useState({ visible: false, message: "", type: "success" });

  // Filters
  const [selectedStatus, setSelectedStatus] = useState("All Status");
  const [selectedPayment, setSelectedPayment] = useState("All Payments");
  const [selectedDateRange, setSelectedDateRange] = useState("All Time");
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const [dateDropdownOpen, setDateDropdownOpen] = useState(false);
  const [paymentDropdownOpen, setPaymentDropdownOpen] = useState(false);

  const statusRef = useRef(null);
  const dateRef = useRef(null);
  const paymentRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (statusRef.current && !statusRef.current.contains(e.target)) {
        setStatusDropdownOpen(false);
      }
      if (dateRef.current && !dateRef.current.contains(e.target)) {
        setDateDropdownOpen(false);
      }
      if (paymentRef.current && !paymentRef.current.contains(e.target)) {
        setPaymentDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter logic
  const filteredOrders = orders.filter((order) => {
    const matchesStatus =
      selectedStatus === "All Status" || order.orderStatus === selectedStatus;
    const matchesPayment =
      selectedPayment === "All Payments" || order.paymentStatus === selectedPayment;
    // Date range filtering is illustrative (mock data doesn't have real dates)
    return matchesStatus && matchesPayment;
  });

  const activeFilterCount =
    (selectedStatus !== "All Status" ? 1 : 0) +
    (selectedPayment !== "All Payments" ? 1 : 0) +
    (selectedDateRange !== "All Time" ? 1 : 0);

  // Badge helpers
  const getPaymentBadge = (status) => {
    switch (status) {
      case "Paid":
        return "bg-emerald-100 text-emerald-700";
      case "Pending":
        return "bg-[#F4A623]/10 text-[#c07d10]";
      case "Failed":
        return "bg-red-50 text-red-500";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const getOrderStatusBadge = (status) => {
    switch (status) {
      case "Processing":
        return { bg: "bg-[#F4A623]/10", text: "text-[#c07d10]", dot: "bg-[#F4A623]" };
      case "Shipped":
        return { bg: "bg-blue-50", text: "text-blue-600", dot: "bg-blue-500" };
      case "Delivered":
        return { bg: "bg-emerald-50", text: "text-emerald-600", dot: "bg-emerald-500" };
      case "Cancelled":
        return { bg: "bg-red-50", text: "text-red-600", dot: "bg-red-500" };
      default:
        return { bg: "bg-gray-100", text: "text-gray-600", dot: "bg-gray-400" };
    }
  };

  // Actions
  const handleUpdateOrderStatus = (orderId, newStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, orderStatus: newStatus } : o))
    );
    setViewOrder(null);
    setToast({
      visible: true,
      message: `Order ${orderId} marked as ${newStatus}.`,
      type: "success",
    });
  };

  const clearFilters = () => {
    setSelectedStatus("All Status");
    setSelectedPayment("All Payments");
    setSelectedDateRange("All Time");
  };

  const closeAllDropdowns = () => {
    setStatusDropdownOpen(false);
    setDateDropdownOpen(false);
    setPaymentDropdownOpen(false);
  };

  return (
    <>
      <div className="bg-white rounded-2xl shadow-soft border border-gray-100 mb-8 overflow-hidden">
        {/* Header and Toolbar */}
        <div className="p-4 md:p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <h2 className="text-lg md:text-xl font-serif font-bold text-[#2B1A12]">All Orders</h2>
            {activeFilterCount > 0 && (
              <span className="text-[10px] font-bold bg-[#F4A623] text-[#2B1A12] px-2 py-0.5 rounded-full">
                {activeFilterCount} filter{activeFilterCount > 1 ? "s" : ""}
              </span>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-2 md:gap-3 w-full md:w-auto">
            {/* Order Status Dropdown */}
            <div className="relative flex-1 md:flex-none" ref={statusRef}>
              <button
                onClick={() => {
                  setStatusDropdownOpen(!statusDropdownOpen);
                  setDateDropdownOpen(false);
                  setPaymentDropdownOpen(false);
                }}
                className={`flex items-center gap-1 md:gap-2 px-3 md:px-4 py-1.5 md:py-2 border rounded-lg text-xs md:text-sm font-semibold transition-colors justify-center w-full md:w-auto ${
                  selectedStatus !== "All Status"
                    ? "border-[#F4A623] bg-[#F4A623]/5 text-[#2B1A12]"
                    : "border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
              >
                {selectedStatus}
                {statusDropdownOpen ? <FiChevronUp className="shrink-0" /> : <FiChevronDown className="shrink-0" />}
              </button>

              {statusDropdownOpen && (
                <div className="absolute top-full left-0 mt-1.5 w-full md:w-48 bg-white border border-gray-200 rounded-xl shadow-lg z-30 overflow-hidden">
                  {ORDER_STATUSES.map((status) => (
                    <button
                      key={status}
                      onClick={() => {
                        setSelectedStatus(status);
                        setStatusDropdownOpen(false);
                      }}
                      className={`block w-full text-left px-4 py-2.5 text-sm font-medium transition-colors ${
                        selectedStatus === status
                          ? "bg-[#F4A623]/10 text-[#2B1A12] font-bold"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Date Range Dropdown */}
            <div className="relative flex-1 md:flex-none" ref={dateRef}>
              <button
                onClick={() => {
                  setDateDropdownOpen(!dateDropdownOpen);
                  setStatusDropdownOpen(false);
                  setPaymentDropdownOpen(false);
                }}
                className={`flex items-center gap-1 md:gap-2 px-3 md:px-4 py-1.5 md:py-2 border rounded-lg text-xs md:text-sm font-semibold transition-colors justify-center w-full md:w-auto ${
                  selectedDateRange !== "All Time"
                    ? "border-[#F4A623] bg-[#F4A623]/5 text-[#2B1A12]"
                    : "border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
              >
                {selectedDateRange}
                {dateDropdownOpen ? <FiChevronUp className="shrink-0" /> : <FiChevronDown className="shrink-0" />}
              </button>

              {dateDropdownOpen && (
                <div className="absolute top-full left-0 mt-1.5 w-full md:w-48 bg-white border border-gray-200 rounded-xl shadow-lg z-30 overflow-hidden">
                  {DATE_RANGES.map((range) => (
                    <button
                      key={range}
                      onClick={() => {
                        setSelectedDateRange(range);
                        setDateDropdownOpen(false);
                      }}
                      className={`block w-full text-left px-4 py-2.5 text-sm font-medium transition-colors ${
                        selectedDateRange === range
                          ? "bg-[#F4A623]/10 text-[#2B1A12] font-bold"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      {range}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Payment Filter Dropdown */}
            <div className="relative flex-1 md:flex-none" ref={paymentRef}>
              <button
                onClick={() => {
                  setPaymentDropdownOpen(!paymentDropdownOpen);
                  setStatusDropdownOpen(false);
                  setDateDropdownOpen(false);
                }}
                className={`flex items-center gap-1 md:gap-2 px-3 md:px-4 py-1.5 md:py-2 border rounded-lg text-xs md:text-sm font-semibold transition-colors justify-center w-full md:w-auto ${
                  selectedPayment !== "All Payments"
                    ? "border-[#F4A623] bg-[#F4A623]/5 text-[#2B1A12]"
                    : "border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100"
                }`}
              >
                <FiFilter className="shrink-0" />
                {selectedPayment !== "All Payments" ? selectedPayment : "Payment"}
              </button>

              {paymentDropdownOpen && (
                <div className="absolute top-full left-0 md:right-0 md:left-auto mt-1.5 w-full md:w-48 bg-white border border-gray-200 rounded-xl shadow-lg z-30 overflow-hidden">
                  {PAYMENT_STATUSES.map((status) => (
                    <button
                      key={status}
                      onClick={() => {
                        setSelectedPayment(status);
                        setPaymentDropdownOpen(false);
                      }}
                      className={`block w-full text-left px-4 py-2.5 text-sm font-medium transition-colors ${
                        selectedPayment === status
                          ? "bg-[#F4A623]/10 text-[#2B1A12] font-bold"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Clear Filters */}
            {activeFilterCount > 0 && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1 px-3 py-1.5 md:py-2 text-xs md:text-sm font-semibold text-red-500 hover:bg-red-50 border border-red-200 rounded-lg transition-colors"
              >
                <FiX className="text-sm" /> Clear
              </button>
            )}

            {/* Export */}
            <button className="bg-[#F4A623] hover:bg-[#e09520] text-[#2B1A12] px-4 md:px-5 py-1.5 md:py-2 rounded-lg font-bold shadow-sm transition-all text-xs md:text-sm flex items-center gap-1 md:gap-2 flex-1 md:flex-none justify-center">
              <FiDownload className="text-sm" /> Export
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-max">
            <thead>
              <tr className="bg-white border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-bold text-gray-400 tracking-wider uppercase">Order ID</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 tracking-wider uppercase">Customer Name</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 tracking-wider uppercase">Date</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 tracking-wider uppercase">Total Price</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 tracking-wider uppercase">Payment</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 tracking-wider uppercase">Order Status</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 tracking-wider uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-16 text-center">
                    <p className="text-gray-400 font-semibold text-sm">No orders found.</p>
                    <p className="text-gray-300 text-xs mt-1">Try adjusting your filters.</p>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const orderBadge = getOrderStatusBadge(order.orderStatus);
                  return (
                    <tr key={order.id} className="hover:bg-[#f9fafb] transition-colors">
                      <td className="px-6 py-4 text-sm font-bold text-[#F4A623]">{order.id}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[#F4A623]/10 flex items-center justify-center text-xs font-bold text-[#2B1A12] border border-[#F4A623]/20">
                            {order.initials}
                          </div>
                          <span className="text-sm font-bold text-[#2B1A12]">{order.customer}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-500">{order.date}</td>
                      <td className="px-6 py-4 text-sm font-bold text-[#2B1A12]">{order.price}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded text-xs font-bold ${getPaymentBadge(order.paymentStatus)}`}>
                          {order.paymentStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center w-max gap-1.5 ${orderBadge.bg} ${orderBadge.text}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${orderBadge.dot}`}></span>
                          {order.orderStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => setViewOrder(order)}
                          title="View order details"
                          className="text-gray-400 hover:text-[#2B1A12] transition-colors p-1.5 rounded-md hover:bg-gray-100"
                        >
                          <FiEye className="text-lg" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="p-4 md:p-6 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <span className="text-xs md:text-sm font-semibold text-gray-500">
            Showing {filteredOrders.length} of {orders.length} orders
          </span>
        </div>
      </div>

      {/* View Order Modal */}
      <ViewOrderModal
        order={viewOrder}
        isOpen={!!viewOrder}
        onClose={() => setViewOrder(null)}
        onUpdateStatus={handleUpdateOrderStatus}
      />

      {/* Toast */}
      <Toast
        message={toast.message}
        type={toast.type}
        visible={toast.visible}
        onClose={() => setToast((prev) => ({ ...prev, visible: false }))}
      />
    </>
  );
};

export default OrdersTable;
