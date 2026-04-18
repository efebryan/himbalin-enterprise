import React, { useState, useRef, useEffect } from "react";
import { FiSearch, FiBell, FiHelpCircle, FiMenu, FiLogOut, FiUser, FiChevronDown, FiShield } from "react-icons/fi";
import { useLocation, useNavigate } from "react-router-dom";
import { useAdminAuth } from "../../context/AdminAuthContext";

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

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
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

        {/* Notification bell */}
        <button className="relative text-gray-500 hover:text-[#2B1A12] transition-colors p-2 rounded-full hover:bg-white focus:outline-none">
          <FiBell className="text-lg md:text-xl" />
          <span className="absolute top-1.5 right-1.5 block h-2 w-2 rounded-full bg-[#F4A623] ring-2 ring-[#f9fafb]" />
        </button>

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
