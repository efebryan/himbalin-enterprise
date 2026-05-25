import React, { useState, useRef, useEffect } from "react";
import { FiSearch, FiBell, FiHelpCircle, FiMenu, FiLogOut, FiUser, FiChevronDown, FiShield, FiTrash2, FiCheck, FiMail, FiShoppingBag, FiUserPlus } from "react-icons/fi";
import { useLocation, useNavigate } from "react-router-dom";
import { useAdminAuth } from "../../context/AdminAuthContext";
import { supabase } from "../../lib/supabase";
import { getNotifications, markNotificationRead, markAllNotificationsRead, deleteNotification } from "../../lib/api";

const PAGE_TITLES = {
  "/admin":            "Welcome",
  "/admin/orders":     "Orders",
  "/admin/products":   "Products",
  "/admin/customers":  "Customers",
  "/admin/analytics":  "Analytics",
  "/admin/settings":   "Settings",
};

const ROLE_LABELS = {
  super_admin: "Super Admin",
  admin:       "Administrator",
};

const Navbar = ({ toggleSidebar }) => {
  const location  = useNavigate ? useLocation() : { pathname: "/admin" };
  const navigate  = useNavigate();
  const { admin, signOut } = useAdminAuth();

  const pageTitle  = PAGE_TITLES[location.pathname] || "Admin";
  const greeting   = admin
    ? `${pageTitle}, ${admin.full_name?.split(" ")[0] || "Admin"}`
    : pageTitle;

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [signingOut,   setSigningOut]   = useState(false);
  const dropdownRef = useRef(null);

  // ── Notification State ──
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notiDropdownOpen, setNotiDropdownOpen] = useState(false);
  const notiDropdownRef = useRef(null);

  // Load notifications from DB
  const fetchNotifications = async () => {
    try {
      const data = await getNotifications();
      setNotifications(data);
      setUnreadCount(data.filter(n => !n.read).length);
    } catch (err) {
      console.warn("[Notifications] Failed to load:", err.message);
    }
  };

  useEffect(() => {
    fetchNotifications();

    // Subscribe to realtime notification updates
    const channel = supabase
      .channel("admin-notifications-realtime")
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

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
      if (notiDropdownRef.current && !notiDropdownRef.current.contains(e.target)) {
        setNotiDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSignOut = async () => {
    setSigningOut(true);
    try {
      await signOut();
      navigate("/adminlogin/login", { replace: true });
    } finally {
      setSigningOut(false);
    }
  };

  // Avatar initials fallback
  const initials = admin?.full_name
    ? admin.full_name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
    : "AD";

  return (
    <div className="h-16 md:h-20 bg-[#f9fafb] border-b border-gray-200 flex items-center justify-between px-4 md:px-8 shrink-0">
      {/* Left — hamburger + title */}
      <div className="flex items-center gap-3 md:gap-0">
        <button
          onClick={toggleSidebar}
          className="lg:hidden text-gray-500 hover:text-[#2B1A12] transition-colors p-2 -ml-2 rounded-lg hover:bg-white focus:outline-none focus:ring-2 focus:ring-[#F4A623]/50"
          aria-label="Toggle sidebar"
        >
          <FiMenu className="text-2xl" />
        </button>
        <div>
          <h2 className="text-lg md:text-xl font-serif font-bold text-[#2B1A12] leading-none">
            {greeting}
          </h2>
          <p className="hidden sm:block text-xs text-gray-400 font-medium mt-0.5">
            {new Date().toLocaleDateString("en-GB", {
              weekday: "long", year: "numeric", month: "long", day: "numeric",
            })}
          </p>
        </div>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* Search */}
        <div className="relative hidden lg:block">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <FiSearch className="text-gray-400 text-sm" />
          </div>
          <input
            type="text"
            placeholder="Search..."
            className="w-56 pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-full text-sm
                       focus:outline-none focus:ring-2 focus:ring-[#F4A623]/20 focus:border-[#F4A623]
                       transition-all text-gray-700 placeholder-gray-400 shadow-sm"
          />
        </div>

        {/* Notification bell + Dropdown */}
        <div className="relative" ref={notiDropdownRef}>
          <button
            onClick={() => setNotiDropdownOpen(v => !v)}
            className="relative text-gray-500 hover:text-[#2B1A12] transition-colors p-2 rounded-full hover:bg-white focus:outline-none"
            aria-label="Notifications"
          >
            <FiBell className="text-lg md:text-xl" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 block h-4 w-4 text-[9px] font-bold text-white bg-[#F4A623] rounded-full ring-2 ring-[#f9fafb] flex items-center justify-center">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>

          {notiDropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-80 md:w-96 bg-white rounded-xl shadow-lg border border-gray-100 z-50 overflow-hidden">
              {/* Header */}
              <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-[#2B1A12]">Notifications</h3>
                  {unreadCount > 0 && (
                    <p className="text-[11px] text-gray-400 font-medium">
                      You have {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
                    </p>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={async () => {
                      try {
                        await markAllNotificationsRead();
                        fetchNotifications();
                      } catch (err) {
                        console.error(err);
                      }
                    }}
                    className="text-[11px] font-semibold text-[#F4A623] hover:text-[#e09520] transition-colors"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              {/* Body */}
              <div className="max-h-72 overflow-y-auto divide-y divide-gray-50">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center">
                    <FiBell className="mx-auto text-gray-300 text-3xl mb-2" />
                    <p className="text-xs text-gray-400">No notifications yet.</p>
                  </div>
                ) : (
                  notifications.slice(0, 5).map((noti) => {
                    let Icon = FiBell;
                    let iconColorClass = "text-gray-400 bg-gray-50";
                    if (noti.type === "order") {
                      Icon = FiShoppingBag;
                      iconColorClass = "text-blue-500 bg-blue-50";
                    } else if (noti.type === "contact") {
                      Icon = FiMail;
                      iconColorClass = "text-emerald-500 bg-emerald-50";
                    } else if (noti.type === "subscriber") {
                      Icon = FiUserPlus;
                      iconColorClass = "text-purple-500 bg-purple-50";
                    }

                    return (
                      <div
                        key={noti.id}
                        onClick={async () => {
                          setNotiDropdownOpen(false);
                          if (!noti.read) {
                            try {
                              await markNotificationRead(noti.id);
                              fetchNotifications();
                            } catch (err) {
                              console.error(err);
                            }
                          }
                          if (noti.link) {
                            navigate(noti.link);
                          }
                        }}
                        className={`group relative p-4 flex gap-3 cursor-pointer hover:bg-gray-50 transition-colors ${
                          !noti.read ? "bg-[#F4A623]/5" : ""
                        }`}
                      >
                        {/* Type Icon */}
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${iconColorClass}`}>
                          <Icon className="text-base" />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0 pr-8">
                          <h4 className={`text-xs font-bold truncate text-[#2B1A12] ${!noti.read ? "font-extrabold" : "font-semibold"}`}>
                            {noti.title}
                          </h4>
                          <p className="text-[11px] text-gray-505 mt-0.5 line-clamp-2 leading-relaxed">
                            {noti.message}
                          </p>
                          <span className="text-[9px] text-gray-400 mt-1 block font-medium">
                            {new Date(noti.created_at).toLocaleTimeString("en-GB", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })} - {new Date(noti.created_at).toLocaleDateString("en-GB", {
                              day: "numeric",
                              month: "short",
                            })}
                          </span>
                        </div>

                        {/* Inline Actions (shown on hover) */}
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-white md:bg-transparent pl-2">
                          {!noti.read && (
                            <button
                              onClick={async (e) => {
                                e.stopPropagation();
                                try {
                                  await markNotificationRead(noti.id);
                                  fetchNotifications();
                                } catch (err) {
                                  console.error(err);
                                }
                              }}
                              title="Mark as read"
                              className="p-1 rounded-md hover:bg-gray-100 text-gray-400 hover:text-emerald-600 transition-colors"
                            >
                              <FiCheck className="text-sm" />
                            </button>
                          )}
                          <button
                            onClick={async (e) => {
                              e.stopPropagation();
                              try {
                                await deleteNotification(noti.id);
                                fetchNotifications();
                              } catch (err) {
                                  console.error(err);
                                }
                            }}
                            title="Delete"
                            className="p-1 rounded-md hover:bg-gray-100 text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <FiTrash2 className="text-sm" />
                          </button>
                        </div>

                        {/* Unread indicator dot */}
                        {!noti.read && (
                          <span className="absolute top-4 right-4 w-1.5 h-1.5 rounded-full bg-[#F4A623]" />
                        )}
                      </div>
                    );
                  })
                )}
              </div>

              {/* Footer */}
              <button
                onClick={() => {
                  setNotiDropdownOpen(false);
                  navigate("/admin/notifications");
                }}
                className="w-full text-center py-2.5 bg-gray-50 hover:bg-gray-100 border-t border-gray-100 text-xs font-bold text-[#2B1A12] transition-colors block"
              >
                View All Notifications
              </button>
            </div>
          )}
        </div>

        {/* Help */}
        <button className="text-gray-500 hover:text-[#2B1A12] transition-colors p-2 rounded-full hover:bg-white focus:outline-none hidden sm:block">
          <FiHelpCircle className="text-lg md:text-xl" />
        </button>

        {/* ── Admin avatar + dropdown ───────────────────────────────── */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(v => !v)}
            aria-haspopup="true"
            aria-expanded={dropdownOpen}
            className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-xl hover:bg-white border border-transparent hover:border-gray-200 transition-all focus:outline-none focus:ring-2 focus:ring-[#F4A623]/30"
          >
            {/* Avatar */}
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#F5A623] to-[#e0951a] flex items-center justify-center text-white text-xs font-bold shadow-sm shrink-0">
              {admin?.avatar_url ? (
                <img src={admin.avatar_url} alt={initials} className="w-full h-full rounded-full object-cover" />
              ) : (
                initials
              )}
            </div>
            <div className="hidden md:block text-left">
              <p className="text-[#2B1A12] text-xs font-bold leading-none">
                {admin?.full_name?.split(" ")[0] || "Admin"}
              </p>
              <p className="text-gray-400 text-[10px] mt-0.5">
                {ROLE_LABELS[admin?.role] || "Administrator"}
              </p>
            </div>
            <FiChevronDown
              size={12}
              className={`text-gray-400 transition-transform duration-200 hidden md:block ${dropdownOpen ? "rotate-180" : ""}`}
            />
          </button>

          {/* Dropdown */}
          {dropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-xl shadow-lg border border-gray-100 py-1.5 z-50 overflow-hidden">
              {/* Header */}
              <div className="px-4 py-2.5 border-b border-gray-50">
                <p className="text-[#2B1A12] text-xs font-bold truncate">{admin?.full_name}</p>
                <p className="text-gray-400 text-[10px] truncate">{admin?.email}</p>
                <div className="flex items-center gap-1 mt-1">
                  <FiShield size={9} className="text-[#F5A623]" />
                  <span className="text-[10px] text-[#F5A623] font-semibold">
                    {ROLE_LABELS[admin?.role] || "Administrator"}
                  </span>
                </div>
              </div>

              {/* Menu items */}
              <button
                onClick={() => { navigate("/admin/settings"); setDropdownOpen(false); }}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs text-gray-600 hover:bg-gray-50 hover:text-[#2B1A12] transition-colors text-left"
              >
                <FiUser size={13} className="text-gray-400" />
                My Profile
              </button>

              <div className="h-px bg-gray-50 my-1" />

              <button
                onClick={handleSignOut}
                disabled={signingOut}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs text-red-500 hover:bg-red-50 transition-colors text-left disabled:opacity-60"
              >
                <FiLogOut size={13} />
                {signingOut ? "Signing out…" : "Sign Out"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
