import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAdminAuth } from "../../context/AdminAuthContext";

/**
 * ProtectedAdminRoute
 * Wraps admin pages. Redirects unauthenticated users to /adminlogin/login
 * while preserving the intended destination in location state.
 */
const ProtectedAdminRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAdminAuth();
  const location = useLocation();

  // While session is being hydrated, render nothing (avoids flash redirect)
  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-[#f9fafb]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-[#F5A623] border-t-transparent animate-spin" />
          <p className="text-xs text-gray-400 font-medium">Verifying session…</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/adminlogin/login"
        state={{ from: location }}
        replace
      />
    );
  }

  return children;
};

export default ProtectedAdminRoute;
