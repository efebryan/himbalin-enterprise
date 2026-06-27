import React from "react";
import { motion } from "framer-motion";
import { FiCalendar, FiMapPin, FiTruck, FiUser, FiInfo } from "react-icons/fi";

export const getStatusBadgeClass = (status) => {
  const normalized = status.toLowerCase();
  if (normalized.includes("confirmed")) return "bg-amber-50 text-amber-700 border-amber-200/50";
  if (normalized.includes("received") || normalized.includes("paid")) return "bg-emerald-50 text-emerald-700 border-emerald-200/50";
  if (normalized.includes("processing")) return "bg-blue-50 text-blue-700 border-blue-200/50";
  if (normalized.includes("dispatch") || normalized.includes("ready")) return "bg-cyan-50 text-cyan-700 border-cyan-200/50";
  if (normalized.includes("shipped")) return "bg-purple-50 text-purple-700 border-purple-200/50";
  if (normalized.includes("delivery") || normalized.includes("out")) return "bg-[#F4A623]/10 text-[#F4A623] border-[#F4A623]/20";
  if (normalized.includes("delivered")) return "bg-[#2B1A12] text-[#F5F1EC] border-transparent";
  if (normalized.includes("cancelled")) return "bg-rose-50 text-rose-700 border-rose-200/50";
  if (normalized.includes("returned")) return "bg-slate-100 text-slate-700 border-slate-300/50";
  return "bg-gray-50 text-gray-700 border-gray-200";
};

const OrderSummary = ({ order }) => {
  const {
    orderNumber,
    customerName,
    orderDate,
    estimatedDelivery,
    deliveryAddress,
    courierName,
    trackingNumber,
    currentStatus
  } = order;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white rounded-2xl shadow-soft border border-himbalin-beige p-6 md:p-8"
    >
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 pb-6 mb-6">
        <div>
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">
            Order Reference
          </span>
          <h2 className="font-serif text-2xl font-bold text-himbalin-dark">
            {orderNumber}
          </h2>
        </div>
        <div className={`px-4 py-2 rounded-full border text-xs font-bold tracking-wider uppercase ${getStatusBadgeClass(currentStatus)}`}>
          {currentStatus}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Side Info */}
        <div className="space-y-4">
          <div className="flex items-start gap-3.5">
            <div className="w-9 h-9 rounded-lg bg-himbalin-beige flex items-center justify-center shrink-0 mt-0.5 text-himbalin-dark">
              <FiUser />
            </div>
            <div>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Customer</span>
              <span className="text-sm font-semibold text-himbalin-dark">{customerName}</span>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-9 h-9 rounded-lg bg-himbalin-beige flex items-center justify-center shrink-0 mt-0.5 text-himbalin-dark">
              <FiCalendar />
            </div>
            <div>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Order Date</span>
              <span className="text-sm font-semibold text-himbalin-dark">{orderDate}</span>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-9 h-9 rounded-lg bg-himbalin-beige flex items-center justify-center shrink-0 mt-0.5 text-himbalin-dark">
              <FiCalendar className="text-himbalin-gold" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Estimated Delivery</span>
              <span className="text-sm font-bold text-himbalin-dark">{estimatedDelivery}</span>
            </div>
          </div>
        </div>

        {/* Right Side Info */}
        <div className="space-y-4">
          <div className="flex items-start gap-3.5">
            <div className="w-9 h-9 rounded-lg bg-himbalin-beige flex items-center justify-center shrink-0 mt-0.5 text-himbalin-dark">
              <FiMapPin />
            </div>
            <div>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Delivery Address</span>
              <span className="text-sm font-semibold text-himbalin-dark leading-relaxed">{deliveryAddress}</span>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-9 h-9 rounded-lg bg-himbalin-beige flex items-center justify-center shrink-0 mt-0.5 text-himbalin-dark">
              <FiTruck />
            </div>
            <div>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Courier / Method</span>
              <span className="text-sm font-semibold text-himbalin-dark">{courierName}</span>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-9 h-9 rounded-lg bg-himbalin-beige flex items-center justify-center shrink-0 mt-0.5 text-himbalin-dark">
              <FiInfo />
            </div>
            <div>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Tracking ID</span>
              <span className="text-sm font-mono font-bold text-[#F4A623]">{trackingNumber}</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default OrderSummary;
