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
} from "react-icons/md";
import { RiLayoutGridFill, RiCloseLine } from "react-icons/ri";

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const location = useLocation();

  const navLinks = [
    { name: "Dashboard", path: "/admin", icon: <MdDashboard className="text-xl" />, exact: true },
    { name: "Orders", path: "/admin/orders", icon: <MdShoppingCart className="text-xl" /> },
    { name: "Products", path: "/admin/products", icon: <MdInventory className="text-xl" /> },
    { name: "Customers", path: "/admin/customers", icon: <MdPeople className="text-xl" /> },
    { name: "Reviews", path: "/admin/reviews", icon: <MdRateReview className="text-xl" /> },
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
          <div className="flex items-center gap-3">
            <div className="bg-[#F4A623] rounded p-1.5 flex items-center justify-center">
              <RiLayoutGridFill className="text-[#2B1A12] text-xl" />
            </div>
            <div>
              <h1 className="text-lg font-serif font-bold text-white leading-none">Himbalin</h1>
              <p className="text-[10px] font-semibold text-[#F4A623] tracking-wider uppercase">Enterprise Admin</p>
            </div>
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
            <img
              src="https://i.pravatar.cc/150?u=a042581f4e29026024d"
              alt="Admin"
              className="w-9 h-9 rounded-full border-2 border-[#F4A623]/40"
            />
            <div className="flex flex-col">
              <span className="text-sm font-bold text-white leading-tight">Alex Rivera</span>
              <span className="text-xs text-[#F4A623] font-medium">Admin Lead</span>
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
