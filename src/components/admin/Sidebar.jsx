import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  MdDashboard,
  MdShoppingCart,
  MdInventory,
  MdPeople,
  MdAnalytics,
  MdSettings,
  MdRateReview,
  MdLocalShipping,
  MdReceipt,
} from "react-icons/md";
import { RiCloseLine } from "react-icons/ri";
import { useSiteSettings } from "../../context/SiteSettingsContext";
import { useAdminAuth } from "../../context/AdminAuthContext";

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const location = useLocation();
  const { settings } = useSiteSettings();
  const { admin } = useAdminAuth();

  const adminName = admin?.full_name || "Admin";
  const adminRole = admin?.role === "super_admin" ? "Super Admin" : "Administrator";
  const adminInitials = adminName.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);

  const navLinks = [
    { name: "Dashboard", path: "/admin", icon: <MdDashboard className="text-xl" />, exact: true },
    { name: "Orders", path: "/admin/orders", icon: <MdShoppingCart className="text-xl" /> },
    { name: "Products", path: "/admin/products", icon: <MdInventory className="text-xl" /> },
    { name: "Customers", path: "/admin/customers", icon: <MdPeople className="text-xl" /> },
    { name: "Reviews", path: "/admin/reviews", icon: <MdRateReview className="text-xl" /> },
    { name: "Shipment", path: "/admin/shipment", icon: <MdLocalShipping className="text-xl" /> },
    { name: "Invoice", path: "/admin/invoice", icon: <MdReceipt className="text-xl" /> },
    { name: "Analytics", path: "/admin/analytics", icon: <MdAnalytics className="text-xl" /> },
    { name: "Settings", path: "/admin/settings", icon: <MdSettings className="text-xl" /> },
  ];

  const isActive = (link) => {
    if (link.exact) return location.pathname === link.path;
    return location.pathname.startsWith(link.path);
  };

  return (
    <div 
      className={`fixed lg:static top-0 left-0 h-screen w-[280px] lg:w-64 bg-[#2B1A12] flex flex-col justify-between shrink-0 z-50 transition-transform duration-300 ease-in-out ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      }`}
    >
      {/* Top Section */}
      <div>
        {/* Logo and Close Button */}
        <div className="p-6 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center w-full max-w-[80%]">
            {settings?.store_logo ? (
              <img src={settings.store_logo} alt="Logo" className="h-8 sm:h-10 w-auto max-w-full object-contain" />
            ) : (
              <div className="flex items-center gap-3">
                <div className="bg-[#F4A623] rounded p-1.5 flex items-center justify-center shrink-0">
                  <span className="font-serif font-bold text-[#2B1A12] text-xl leading-none">H</span>
                </div>
                <div>
                  <h1 className="text-lg font-serif font-bold text-white leading-none">
                    {settings?.store_name?.split(" ")[0] || "Himbalin"}
                  </h1>
                  <p className="text-[10px] font-semibold text-[#F4A623] tracking-wider uppercase">Enterprise Admin</p>
                </div>
              </div>
            )}
          </div>
          <button 
            className="lg:hidden text-white/50 hover:text-white p-1"
            onClick={() => setSidebarOpen(false)}
          >
            <RiCloseLine className="text-2xl" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="mt-[5px] px-4 flex flex-col gap-1 overflow-y-auto">
          {navLinks.map((link) => {
            const active = isActive(link);
            return (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${
                  active
                    ? "bg-[#F4A623] text-[#2B1A12] shadow-md shadow-[#F4A623]/20"
                    : "text-white/60 hover:text-white hover:bg-white/10"
                }`}
              >
                {link.icon}
                {link.name}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section */}
      <div className="p-4 border-t border-white/10 space-y-2 pb-6 lg:pb-4">
        {/* Profile */}
        <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
          <div className="flex items-center gap-3">
            {admin?.avatar_url ? (
              <img
                src={admin.avatar_url}
                alt={adminName}
                className="w-9 h-9 rounded-full border-2 border-[#F4A623]/40 object-cover"
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#F5A623] to-[#e0951a] flex items-center justify-center text-[#2B1A12] text-xs font-bold border-2 border-[#F4A623]/40">
                {adminInitials}
              </div>
            )}
            <div className="flex flex-col">
              <span className="text-sm font-bold text-white leading-tight">{adminName.split(" ")[0]}</span>
              <span className="text-xs text-[#F4A623] font-medium">{adminRole}</span>
            </div>
          </div>
          <Link to="/admin/settings" onClick={() => setSidebarOpen(false)} className="text-white/30 hover:text-white/70 transition-colors p-1">
            <MdSettings className="text-lg" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
