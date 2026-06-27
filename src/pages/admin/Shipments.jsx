import React, { useState, useEffect } from "react";
import { getOrders, updateOrderStatus } from "../../lib/api";
import { FiSearch, FiTruck, FiCheckCircle, FiClock, FiEdit2, FiEye, FiUser, FiInfo, FiChevronDown, FiChevronUp } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

const Shipments = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTab, setSelectedTab] = useState("All");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  // Form states for status update
  const [statusVal, setStatusVal] = useState("");
  const [driverName, setDriverName] = useState("");
  const [driverVehicle, setDriverVehicle] = useState("");
  const [driverPhone, setDriverPhone] = useState("");
  const [trackingNo, setTrackingNo] = useState("");

  useEffect(() => {
    fetchShipmentData();
  }, []);

  const fetchShipmentData = async () => {
    try {
      setLoading(true);
      const data = await getOrders();
      setOrders(data || []);
    } catch (err) {
      console.error("Error fetching orders for shipping management:", err);
    } finally {
      setLoading(false);
    }
  };

  const getPersistedShipping = (orderId) => {
    const key = `hbl_shipment_${orderId}`;
    try {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  };

  const savePersistedShipping = (orderId, shippingData) => {
    const key = `hbl_shipment_${orderId}`;
    localStorage.setItem(key, JSON.stringify(shippingData));
  };

  const handleOpenStatusModal = (order) => {
    setSelectedOrder(order);
    setStatusVal(order.status || "Pending");
    
    const extra = getPersistedShipping(order.id) || {};
    setDriverName(extra.driverName || "");
    setDriverVehicle(extra.driverVehicle || "");
    setDriverPhone(extra.driverPhone || "");
    setTrackingNo(extra.trackingNo || `HBL${Math.floor(100000 + Math.random() * 900000)}`);
    
    setShowStatusModal(true);
  };

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    if (!selectedOrder) return;

    try {
      // 1. Update status in DB
      await updateOrderStatus(selectedOrder.id, statusVal);

      // 2. Persist extra driver/tracking details locally
      savePersistedShipping(selectedOrder.id, {
        driverName,
        driverVehicle,
        driverPhone,
        trackingNo
      });

      // 3. Refresh list
      await fetchShipmentData();
      setShowStatusModal(false);
      setSelectedOrder(null);
    } catch (err) {
      console.error("Failed to update status & driver info:", err);
      alert("Error updating shipment. Please try again.");
    }
  };

  const toggleExpandOrder = (id) => {
    setExpandedOrderId(expandedOrderId === id ? null : id);
  };

  // KPI Calculations
  const stats = orders.reduce(
    (acc, order) => {
      const status = (order.status || "").toLowerCase();
      acc.total += 1;
      if (status === "out for delivery" || status === "outfordelivery") acc.outForDelivery += 1;
      if (status === "shipped") acc.shipped += 1;
      if (status === "pending" || status === "processing" || status === "ready for dispatch") acc.pendingDispatch += 1;
      if (status === "delivered" || status === "completed") acc.delivered += 1;
      return acc;
    },
    { total: 0, outForDelivery: 0, shipped: 0, pendingDispatch: 0, delivered: 0 }
  );

  // Filters
  const filteredOrders = orders.filter((order) => {
    const term = searchTerm.toLowerCase();
    const customer = (order.customer_name || "").toLowerCase();
    const orderId = (order.id || "").toLowerCase();
    const paystack = (order.paystack_reference || "").toLowerCase();
    const extra = getPersistedShipping(order.id) || {};
    const tracking = (extra.trackingNo || "").toLowerCase();

    const matchesSearch = customer.includes(term) || orderId.includes(term) || paystack.includes(term) || tracking.includes(term);

    if (!matchesSearch) return false;

    const status = (order.status || "").toLowerCase();
    if (selectedTab === "Pending Dispatch") {
      return ["pending", "processing", "ready for dispatch"].includes(status);
    }
    if (selectedTab === "Shipped") {
      return status === "shipped";
    }
    if (selectedTab === "Out for Delivery") {
      return status === "out for delivery" || status === "outfordelivery";
    }
    if (selectedTab === "Delivered") {
      return status === "delivered" || status === "completed";
    }

    return true;
  });

  const getStatusColor = (status) => {
    const s = (status || "").toLowerCase();
    if (s.includes("pending")) return "bg-amber-50 text-amber-700 border-amber-200";
    if (s.includes("processing")) return "bg-blue-50 text-blue-700 border-blue-200";
    if (s.includes("dispatch")) return "bg-cyan-50 text-cyan-700 border-cyan-200";
    if (s.includes("shipped")) return "bg-purple-50 text-purple-700 border-purple-200";
    if (s.includes("delivery") || s.includes("out")) return "bg-orange-50 text-orange-700 border-orange-200";
    if (s.includes("delivered") || s.includes("completed")) return "bg-[#2B1A12] text-[#F5F1EC] border-transparent";
    return "bg-gray-50 text-gray-700 border-gray-200";
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
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-serif font-bold text-[#2B1A12] mb-1">
          Shipment Management
        </h1>
        <p className="text-gray-500 text-xs md:text-sm font-medium">
          Monitor real-time fulfillment pipelines, assign drivers, and update shipping milestones.
        </p>
      </div>

      {/* KPI Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-soft flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#2B1A12]/5 flex items-center justify-center text-[#2B1A12] shrink-0">
            <FiTruck className="text-xl" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-0.5">Total Shipments</span>
            <h3 className="text-2xl font-bold text-[#2B1A12]">{stats.total}</h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-soft flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600 shrink-0">
            <FiClock className="text-xl" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-0.5">Out For Delivery</span>
            <h3 className="text-2xl font-bold text-[#2B1A12]">{stats.outForDelivery}</h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-soft flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 shrink-0">
            <FiTruck className="text-xl text-purple-500" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-0.5">In Transit / Shipped</span>
            <h3 className="text-2xl font-bold text-[#2B1A12]">{stats.shipped}</h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-soft flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
            <FiCheckCircle className="text-xl" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-0.5">Delivered</span>
            <h3 className="text-2xl font-bold text-[#2B1A12]">{stats.delivered}</h3>
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-soft overflow-hidden">
        {/* Search & Tabs */}
        <div className="p-6 border-b border-gray-100 space-y-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                <FiSearch />
              </span>
              <input
                type="text"
                placeholder="Search Order ID, name, tracking..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 focus:border-[#F4A623] rounded-xl text-sm focus:outline-none"
              />
            </div>

            {/* Tabs */}
            <div className="flex flex-wrap gap-1.5 bg-[#FDFCFB] p-1 border border-gray-100 rounded-xl overflow-x-auto w-full md:w-auto">
              {["All", "Pending Dispatch", "Shipped", "Out for Delivery", "Delivered"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setSelectedTab(tab)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                    selectedTab === tab
                      ? "bg-[#2B1A12] text-white shadow-sm"
                      : "text-gray-500 hover:text-himbalin-dark hover:bg-white"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Shipments List */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 bg-[#FDFCFB] text-gray-400 text-[10px] font-bold uppercase tracking-wider">
                <th className="p-4 pl-6">Order Reference</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Destination</th>
                <th className="p-4">Driver / Tracking</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right pr-6">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-12 text-center text-gray-400 text-sm">
                    No shipments match the selected criteria.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const extra = getPersistedShipping(order.id) || {};
                  const isExpanded = expandedOrderId === order.id;
                  
                  return (
                    <React.Fragment key={order.id}>
                      <tr className="hover:bg-[#FDFCFB]/40 transition-colors text-sm text-himbalin-dark">
                        <td className="p-4 pl-6">
                          <div className="font-semibold text-himbalin-dark">
                            {order.paystack_reference ? `REF-${order.paystack_reference.substring(0,8)}` : `ORD-${order.id.substring(0,8)}`}
                          </div>
                          <span className="text-[10px] text-gray-400 font-mono block mt-0.5">{order.id}</span>
                        </td>
                        <td className="p-4">
                          <div className="font-bold">{order.customer_name}</div>
                          <span className="text-[10px] text-gray-400 block mt-0.5">{order.customer_email}</span>
                        </td>
                        <td className="p-4">
                          <div className="max-w-[180px] truncate font-medium">{order.address || "No Address Provided"}</div>
                          <span className="text-[10px] text-gray-400 block mt-0.5">{order.city || "Lagos"}</span>
                        </td>
                        <td className="p-4">
                          <div className="font-mono text-xs font-bold text-[#F4A623] mb-1">
                            {extra.trackingNo || `HBL-${order.id.substring(0, 8).toUpperCase()}`}
                          </div>
                          {extra.driverName ? (
                            <div className="text-[10px] text-gray-500 flex items-center gap-1">
                              <FiUser className="text-[10px] shrink-0" />
                              <span className="truncate">{extra.driverName}</span>
                            </div>
                          ) : (
                            <span className="text-[10px] text-gray-400 italic">No courier assigned</span>
                          )}
                        </td>
                        <td className="p-4">
                          <span className={`px-3 py-1 rounded-full border text-[10px] font-bold tracking-wider uppercase ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="p-4 text-right pr-6 space-x-2">
                          <button
                            onClick={() => toggleExpandOrder(order.id)}
                            className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-himbalin-dark transition-colors"
                            title="View Items"
                          >
                            {isExpanded ? <FiChevronUp /> : <FiChevronDown />}
                          </button>
                          <button
                            onClick={() => handleOpenStatusModal(order)}
                            className="p-2 hover:bg-gray-100 rounded-lg text-[#F4A623] transition-colors"
                            title="Edit Status / Driver"
                          >
                            <FiEdit2 />
                          </button>
                        </td>
                      </tr>

                      {/* Expandable Order Items Row */}
                      {isExpanded && (
                        <tr className="bg-[#FDFCFB]">
                          <td colSpan="6" className="p-6 pl-10 pr-6 border-b border-gray-100">
                            <div className="max-w-3xl">
                              <h4 className="font-bold text-xs uppercase tracking-wider text-gray-400 mb-4">
                                Shipment Contents
                              </h4>
                              <div className="space-y-3">
                                {order.items && Array.isArray(order.items) ? (
                                  order.items.map((item, idx) => (
                                    <div key={idx} className="flex justify-between items-center bg-white p-3.5 rounded-xl border border-gray-100">
                                      <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center text-xs font-bold text-himbalin-dark shrink-0">
                                          🛋️
                                        </div>
                                        <div>
                                          <div className="font-semibold text-sm">{item.name || "Luxury Furniture Piece"}</div>
                                          <div className="text-xs text-gray-400">Qty: {item.quantity || item.qty || 1}</div>
                                        </div>
                                      </div>
                                      <div className="font-serif font-bold text-sm">
                                        ₦{Number(item.price || 0).toLocaleString()}
                                      </div>
                                    </div>
                                  ))
                                ) : (
                                  <div className="text-xs text-gray-400">No items format found.</div>
                                )}
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Status & Assign Driver Modal */}
      <AnimatePresence>
        {showStatusModal && selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowStatusModal(false)}
              className="absolute inset-0 bg-black"
            ></motion.div>

            {/* Modal Body */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 md:p-8 z-10 max-h-[90vh] overflow-y-auto"
            >
              <h3 className="font-serif text-xl font-bold text-[#2B1A12] mb-6">
                Update Shipment & Courier Status
              </h3>

              <form onSubmit={handleUpdateStatus} className="space-y-5">
                {/* Status Dropdown */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Shipment Status
                  </label>
                  <select
                    value={statusVal}
                    onChange={(e) => setStatusVal(e.target.value)}
                    className="w-full bg-[#FDFCFB] border border-gray-200 focus:border-[#F4A623] rounded-xl p-3 text-sm focus:outline-none"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Paid">Paid (Processing)</option>
                    <option value="Processing">Processing (Artisan Handcraft)</option>
                    <option value="Ready for Dispatch">Ready for Dispatch</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Out for Delivery">Out for Delivery</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                    <option value="Returned">Returned</option>
                  </select>
                </div>

                {/* Tracking ID */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Tracking ID (Auto-Generated)
                  </label>
                  <input
                    type="text"
                    value={trackingNo}
                    onChange={(e) => setTrackingNo(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm font-mono text-himbalin-dark focus:outline-none"
                  />
                </div>

                {/* Driver Assignment Form */}
                <div className="border-t border-gray-100 pt-5 space-y-4">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-gray-400">
                    Assign Logistics Courier
                  </h4>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-himbalin-dark">Driver Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Michael Johnson"
                      value={driverName}
                      onChange={(e) => setDriverName(e.target.value)}
                      className="w-full bg-[#FDFCFB] border border-gray-200 focus:border-[#F4A623] rounded-xl p-3 text-sm focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-himbalin-dark">Vehicle info</label>
                      <input
                        type="text"
                        placeholder="e.g. Mercedes Sprinter"
                        value={driverVehicle}
                        onChange={(e) => setDriverVehicle(e.target.value)}
                        className="w-full bg-[#FDFCFB] border border-gray-200 focus:border-[#F4A623] rounded-xl p-3 text-sm focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-himbalin-dark">Driver Phone</label>
                      <input
                        type="text"
                        placeholder="e.g. +234..."
                        value={driverPhone}
                        onChange={(e) => setDriverPhone(e.target.value)}
                        className="w-full bg-[#FDFCFB] border border-gray-200 focus:border-[#F4A623] rounded-xl p-3 text-sm focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 pt-4 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setShowStatusModal(false)}
                    className="flex-1 py-3.5 border border-gray-200 rounded-xl text-sm font-bold text-gray-500 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3.5 bg-himbalin-gold hover:bg-yellow-500 text-himbalin-dark rounded-xl text-sm font-bold transition-colors shadow-md"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Shipments;
