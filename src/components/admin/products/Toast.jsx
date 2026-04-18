import React, { useEffect } from "react";
import { FiCheck, FiEdit3 } from "react-icons/fi";

const Toast = ({ message, type = "success", visible, onClose }) => {
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => onClose(), 3000);
      return () => clearTimeout(timer);
    }
  }, [visible, onClose]);

  if (!visible) return null;

  const styles = {
    success: {
      bg: "bg-emerald-50 border-emerald-200",
      icon: "bg-emerald-500",
      text: "text-emerald-800",
      IconComp: FiCheck,
    },
    draft: {
      bg: "bg-[#F4A623]/10 border-[#F4A623]/30",
      icon: "bg-[#F4A623]",
      text: "text-[#2B1A12]",
      IconComp: FiEdit3,
    },
  };

  const s = styles[type] || styles.success;

  return (
    <div className="fixed top-6 right-6 z-[100] animate-slide-in-right">
      <div
        className={`flex items-center gap-3 px-5 py-3.5 rounded-xl border shadow-lg ${s.bg}`}
      >
        <div
          className={`w-7 h-7 rounded-full ${s.icon} flex items-center justify-center shrink-0`}
        >
          <s.IconComp className="text-white text-sm" />
        </div>
        <span className={`text-sm font-bold ${s.text}`}>{message}</span>
      </div>
    </div>
  );
};

export default Toast;
