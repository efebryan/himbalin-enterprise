import React, { useState, useEffect, useMemo } from "react";
import { FiBell, FiTrash2, FiCheck, FiShoppingBag, FiMail, FiUserPlus, FiArrowRight, FiSearch, FiAlertTriangle, FiCheckSquare } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../../lib/supabase";
import {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification,
  deleteAllNotifications
} from "../../lib/api";

const Notifications = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all"); // 'all' | 'unread' | 'read' | 'order' | 'contact' | 'subscriber'
  const [tableMissing, setTableMissing] = useState(false);
  const [deletingAll, setDeletingAll] = useState(false);
  const [markingAll, setMarkingAll] = useState(false);

  /** Format a date string into readable date and time */
  const formatDateTime = (dateStr) => {
    if (!dateStr) return "—";
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return "—";
    return date.toLocaleDateString("en-NG", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }) + " at " + date.toLocaleTimeString("en-NG", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      const data = await getNotifications();
      setNotifications(data);
      setTableMissing(false);
    } catch (err) {
      console.error("Error loading notifications:", err);
      // 42P01 is Postgres code for "relation does not exist"
      if (err.code === "42P01") {
        setTableMissing(true);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();

    // Subscribe to realtime database changes
    const channel = supabase
      .channel("admin-notifications-page")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "notifications" },
        () => {
          fetchNotifications();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Filter & Search Logic
  const filteredNotifications = useMemo(() => {
    return notifications.filter((noti) => {
      // 1. Tab filter
      if (activeTab === "unread" && noti.read) return false;
      if (activeTab === "read" && !noti.read) return false;
      if (activeTab === "order" && noti.type !== "order") return false;
      if (activeTab === "contact" && noti.type !== "contact") return false;
      if (activeTab === "subscriber" && noti.type !== "subscriber") return false;

      // 2. Search query filter
      if (searchQuery.trim() !== "") {
        const query = searchQuery.toLowerCase();
        return (
          noti.title.toLowerCase().includes(query) ||
          noti.message.toLowerCase().includes(query)
        );
      }

      return true;
    });
  }, [notifications, activeTab, searchQuery]);

  // Tab count utilities
  const tabCounts = useMemo(() => {
    return {
      all: notifications.length,
      unread: notifications.filter(n => !n.read).length,
      read: notifications.filter(n => n.read).length,
      order: notifications.filter(n => n.type === "order").length,
      contact: notifications.filter(n => n.type === "contact").length,
      subscriber: notifications.filter(n => n.type === "subscriber").length,
    };
  }, [notifications]);

  // Handler functions
  const handleMarkRead = async (id) => {
    try {
      await markNotificationRead(id);
      fetchNotifications();
    } catch (err) {
      console.error("Failed to mark as read:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteNotification(id);
      fetchNotifications();
    } catch (err) {
      console.error("Failed to delete notification:", err);
    }
  };

  const handleMarkAllRead = async () => {
    if (tabCounts.unread === 0) return;
    setMarkingAll(true);
    try {
      await markAllNotificationsRead();
      await fetchNotifications();
    } catch (err) {
      console.error("Failed to mark all as read:", err);
    } finally {
      setMarkingAll(false);
    }
  };

  const handleDeleteAll = async () => {
    if (notifications.length === 0) return;
    if (!window.confirm("Are you sure you want to delete all notifications? This cannot be undone.")) return;
    setDeletingAll(true);
    try {
      await deleteAllNotifications();
      await fetchNotifications();
    } catch (err) {
      console.error("Failed to delete all notifications:", err);
    } finally {
      setDeletingAll(false);
    }
  };

  const handleNotificationClick = async (noti) => {
    if (!noti.read) {
      await handleMarkRead(noti.id);
    }
    if (noti.link) {
      navigate(noti.link);
    }
  };

  // Get Type Icon helper
  const getNotificationIcon = (type) => {
    switch (type) {
      case "order":
        return {
          icon: FiShoppingBag,
          colorClass: "text-blue-500 bg-blue-50 border border-blue-100",
        };
      case "contact":
        return {
          icon: FiMail,
          colorClass: "text-emerald-500 bg-emerald-50 border border-emerald-100",
        };
      case "subscriber":
        return {
          icon: FiUserPlus,
          colorClass: "text-purple-500 bg-purple-50 border border-purple-100",
        };
      default:
        return {
          icon: FiBell,
          colorClass: "text-gray-500 bg-gray-50 border border-gray-100",
        };
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-[#2B1A12] mb-1">
            Notifications Center
          </h1>
          <p className="text-gray-500 text-xs md:text-sm font-medium">
            Monitor real-time activities and updates from Himbalin Enterprise.
          </p>
        </div>

        {/* Global Action Buttons */}
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleMarkAllRead}
            disabled={tabCounts.unread === 0 || markingAll}
            className="flex items-center gap-2 px-4 py-2 border border-gray-200 hover:border-[#F4A623] rounded-full text-xs font-bold text-gray-600 hover:text-[#2B1A12] hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FiCheckSquare className="text-base" />
            <span>{markingAll ? "Processing..." : "Mark All Read"}</span>
          </button>
          <button
            onClick={handleDeleteAll}
            disabled={notifications.length === 0 || deletingAll}
            className="flex items-center gap-2 px-4 py-2 border border-red-200 hover:bg-red-50 hover:border-red-300 rounded-full text-xs font-bold text-red-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FiTrash2 className="text-base" />
            <span>{deletingAll ? "Deleting..." : "Clear All"}</span>
          </button>
        </div>
      </div>

      {/* Database Warning Banner */}
      {tableMissing && (
        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl flex gap-3 text-amber-800">
          <FiAlertTriangle className="text-xl shrink-0 mt-0.5" />
          <div>
            <h3 className="font-bold text-sm">Database Setup Required</h3>
            <p className="text-xs mt-1 leading-relaxed text-amber-700">
              The notifications table is missing from your Supabase database. Please copy the code in
              <code className="mx-1 px-1 bg-amber-100 rounded text-[11px] font-mono">supabase/notifications_setup.sql</code>
              and execute it in your **Supabase Dashboard SQL Editor** to initialize the notifications system.
            </p>
          </div>
        </div>
      )}

      {/* Toolbar: Tabs & Search */}
      <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center bg-white border border-gray-100 rounded-2xl p-4 shadow-sm mb-6">
        {/* Scrollable Tabs */}
        <div className="flex gap-1.5 overflow-x-auto pb-2 lg:pb-0 w-full lg:w-auto -mx-4 px-4 lg:mx-0 lg:px-0">
          {[
            { id: "all", label: "All" },
            { id: "unread", label: "Unread" },
            { id: "read", label: "Read" },
            { id: "order", label: "Orders" },
            { id: "contact", label: "Inquiries" },
            { id: "subscriber", label: "Subscribers" },
          ].map((tab) => {
            const count = tabCounts[tab.id];
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                  isActive
                    ? "bg-[#2B1A12] text-white"
                    : "text-gray-500 hover:text-[#2B1A12] hover:bg-gray-50"
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                    isActive
                      ? "bg-white/20 text-white"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative w-full lg:w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="text-gray-400 text-sm" />
          </div>
          <input
            type="text"
            placeholder="Search notifications..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-full text-xs
                       focus:outline-none focus:ring-2 focus:ring-[#F4A623]/20 focus:border-[#F4A623]
                       transition-all text-gray-700 placeholder-gray-400"
          />
        </div>
      </div>

      {/* Main List */}
      <div className="bg-white border border-gray-100 rounded-3xl shadow-sm overflow-hidden min-h-[400px] flex flex-col">
        {loading ? (
          <div className="flex-1 flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F4A623]" />
            <p className="text-xs text-gray-400 mt-4">Loading notifications...</p>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center py-20 px-4 text-center">
            <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mb-4">
              <FiBell className="text-gray-300 text-3xl" />
            </div>
            <h3 className="text-sm font-bold text-[#2B1A12] mb-1">No Notifications Found</h3>
            <p className="text-xs text-gray-400 max-w-sm">
              {searchQuery
                ? "No matching alerts for your current search filter."
                : "Great job! There are no alerts in this category."}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            <AnimatePresence initial={false}>
              {filteredNotifications.map((noti) => {
                const config = getNotificationIcon(noti.type);
                const Icon = config.icon;
                return (
                  <motion.div
                    key={noti.id}
                    layout
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    className={`relative p-5 md:p-6 flex gap-4 transition-colors hover:bg-gray-50/50 ${
                      !noti.read ? "bg-[#F4A623]/5" : ""
                    }`}
                  >
                    {/* Icon Column */}
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${config.colorClass}`}>
                      <Icon className="text-lg" />
                    </div>

                    {/* Content Column */}
                    <div className="flex-1 min-w-0 pr-24">
                      <div className="flex items-center gap-2">
                        <h3 className={`text-sm text-[#2B1A12] ${!noti.read ? "font-extrabold" : "font-bold"}`}>
                          {noti.title}
                        </h3>
                        {!noti.read && (
                          <span className="h-2 w-2 rounded-full bg-[#F4A623]" />
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                        {noti.message}
                      </p>
                      <span className="text-[10px] text-gray-400 mt-2 block font-medium">
                        {formatDateTime(noti.created_at)}
                      </span>
                    </div>

                    {/* Actions Column */}
                    <div className="absolute right-5 md:right-6 top-1/2 -translate-y-1/2 flex items-center gap-2">
                      {!noti.read && (
                        <button
                          onClick={() => handleMarkRead(noti.id)}
                          title="Mark as read"
                          className="p-2 rounded-xl bg-gray-50 hover:bg-emerald-50 text-gray-400 hover:text-emerald-600 transition-colors border border-gray-100"
                        >
                          <FiCheck className="text-sm" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(noti.id)}
                        title="Delete"
                        className="p-2 rounded-xl bg-gray-50 hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors border border-gray-100"
                      >
                        <FiTrash2 className="text-sm" />
                      </button>
                      {noti.link && (
                        <button
                          onClick={() => handleNotificationClick(noti)}
                          title="View Details"
                          className="p-2 rounded-xl bg-[#2B1A12] hover:bg-[#F4A623] text-white hover:text-[#2B1A12] transition-colors border border-transparent"
                        >
                          <FiArrowRight className="text-sm" />
                        </button>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
