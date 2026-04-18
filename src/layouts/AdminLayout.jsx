import React, { useState } from "react";
import { Outlet, Link } from "react-router-dom";
import Sidebar from "../components/admin/Sidebar";
import Navbar from "../components/admin/Navbar";

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-[#f9fafb] overflow-hidden font-sans antialiased relative">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden relative w-full lg:min-w-0">
        <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        {/* Scrollable Main Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto relative flex flex-col w-full">
          <div className="px-4 md:px-6 lg:px-8 pb-4 md:pb-6 lg:pb-8 pt-[5px] flex-1 w-full max-w-full">
            <Outlet />
          </div>

          {/* Sticky Footer */}
          <footer className="sticky bottom-0 z-20 bg-white/80 backdrop-blur-md border-t border-gray-200 py-3.5 px-4 md:px-8 text-[10px] md:text-xs text-gray-400 flex flex-col sm:flex-row justify-between items-center shrink-0 shadow-[0_-4px_6px_-1px_rgb(0,0,0,0.04)] gap-2 sm:gap-0">
            <p className="text-center sm:text-left">
              &copy; {new Date().getFullYear()}{" "}
              <span className="font-semibold text-[#2B1A12]">Himbalin Enterprise</span>. All rights reserved.
            </p>
            <div className="flex gap-4">
              <Link to="/contact" className="hover:text-[#F4A623] transition-colors font-medium">
                Support
              </Link>
              <Link to="/" className="hover:text-[#F4A623] transition-colors font-medium">
                Privacy Policy
              </Link>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
