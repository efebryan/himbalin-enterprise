import React from "react";
import { RiCloseLine } from "react-icons/ri";
import { FiPackage, FiTruck, FiCheckCircle, FiXCircle } from "react-icons/fi";

const ViewOrderModal = ({ order, isOpen, onClose, onUpdateStatus }) => {
  if (!isOpen || !order) return null;

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
        return "bg-[#F4A623]/10 text-[#c07d10]";
      case "Shipped":
        return "bg-blue-50 text-blue-600";
      case "Delivered":
        return "bg-emerald-50 text-emerald-600";
      case "Cancelled":
        return "bg-red-50 text-red-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  // Determine the possible next status actions
  const getAvailableActions = (status) => {
    switch (status) {
      case "Processing":
        return [
          { label: "Mark as Shipped", value: "Shipped", icon: FiTruck, color: "bg-blue-500 hover:bg-blue-600 text-white" },
          { label: "Cancel Order", value: "Cancelled", icon: FiXCircle, color: "bg-red-500 hover:bg-red-600 text-white" },
        ];
      case "Shipped":
        return [
          { label: "Mark as Delivered", value: "Delivered", icon: FiCheckCircle, color: "bg-emerald-500 hover:bg-emerald-600 text-white" },
        ];
      case "Delivered":
        return [];
      case "Cancelled":
        return [];
      default:
        return [];
    }
  };

  const actions = getAvailableActions(order.orderStatus);

  // Progress steps
  const steps = ["Processing", "Shipped", "Delivered"];
  const cancelledOrFailed = order.orderStatus === "Cancelled";
  const currentStepIndex = steps.indexOf(order.orderStatus);

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 md:p-8">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[80vh] overflow-hidden animate-slide-in-right flex flex-col">
          {/* Header */}
          <div className="bg-[#2B1A12] px-6 py-4 flex items-center justify-between shrink-0">
            <div>
              <h2 className="text-lg font-serif font-bold text-white">
                Order Details
              </h2>
              <p className="text-xs text-[#F4A623] font-medium mt-0.5">
                {order.id}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-white/60 hover:text-white transition-colors p-1"
            >
              <RiCloseLine className="text-2xl" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 space-y-5 overflow-y-auto flex-1">
            {/* Customer Info */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#F4A623]/10 flex items-center justify-center text-sm font-bold text-[#2B1A12] border-2 border-[#F4A623]/20">
                {order.initials}
              </div>
              <div>
                <h3 className="text-base font-bold text-[#2B1A12]">
                  {order.customer}
                </h3>
                <p className="text-xs text-gray-400 font-medium">{order.date}</p>
              </div>
            </div>

            {/* Status Badges */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                  Payment
                </p>
                <span
                  className={`inline-block px-2.5 py-1 rounded text-xs font-bold ${getPaymentBadge(
                    order.paymentStatus
                  )}`}
                >
                  {order.paymentStatus}
                </span>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                  Order Status
                </p>
                <span
                  className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold ${getOrderStatusBadge(
                    order.orderStatus
                  )}`}
                >
                  {order.orderStatus}
                </span>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                  Total Price
                </p>
                <p className="text-sm font-bold text-[#2B1A12]">
                  {order.price}
                </p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                  Items
                </p>
                <p className="text-sm font-bold text-[#2B1A12]">
                  {order.items || "—"}
                </p>
              </div>
            </div>

            {/* Order Progress Tracker */}
            {!cancelledOrFailed && (
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">
                  Order Progress
                </p>
                <div className="flex items-center gap-0">
                  {steps.map((step, i) => {
                    const isCompleted = currentStepIndex >= i;
                    const isCurrent = currentStepIndex === i;
                    return (
                      <React.Fragment key={step}>
                        {i > 0 && (
                          <div
                            className={`flex-1 h-0.5 ${
                              currentStepIndex >= i
                                ? "bg-[#F4A623]"
                                : "bg-gray-200"
                            }`}
                          />
                        )}
                        <div className="flex flex-col items-center gap-1.5">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm shrink-0 ${
                              isCompleted
                                ? "bg-[#F4A623] text-[#2B1A12]"
                                : "bg-gray-100 text-gray-400"
                            } ${isCurrent ? "ring-2 ring-[#F4A623]/30" : ""}`}
                          >
                            {i === 0 ? (
                              <FiPackage className="text-xs" />
                            ) : i === 1 ? (
                              <FiTruck className="text-xs" />
                            ) : (
                              <FiCheckCircle className="text-xs" />
                            )}
                          </div>
                          <span
                            className={`text-[10px] font-bold ${
                              isCompleted ? "text-[#2B1A12]" : "text-gray-400"
                            }`}
                          >
                            {step}
                          </span>
                        </div>
                      </React.Fragment>
                    );
                  })}
                </div>
              </div>
            )}

            {cancelledOrFailed && (
              <div className="bg-red-50 border border-red-100 rounded-xl p-4 text-center">
                <FiXCircle className="mx-auto text-xl text-red-400 mb-1" />
                <p className="text-sm font-bold text-red-600">Order Cancelled</p>
                <p className="text-xs text-red-400 mt-0.5">This order has been cancelled and cannot be updated.</p>
              </div>
            )}

            {/* Quick Actions */}
            {actions.length > 0 && (
              <div className="space-y-2">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  Quick Actions
                </p>
                <div className="flex gap-2">
                  {actions.map((action) => (
                    <button
                      key={action.value}
                      onClick={() => onUpdateStatus(order.id, action.value)}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold shadow-sm transition-all flex-1 justify-center ${action.color}`}
                    >
                      <action.icon className="text-sm" />
                      {action.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-gray-100 px-6 py-3 shrink-0">
            <button
              onClick={onClose}
              className="w-full px-4 py-2.5 bg-[#2B1A12] hover:bg-[#3d2518] text-white rounded-lg text-sm font-bold transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ViewOrderModal;
