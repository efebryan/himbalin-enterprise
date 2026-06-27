import React, { useState } from "react";
import { motion } from "framer-motion";
import { FiSearch, FiAlertCircle } from "react-icons/fi";

const TrackingForm = ({ onTrack, error }) => {
  const [trackingId, setTrackingId] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (trackingId.trim()) {
      onTrack(trackingId.trim());
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="max-w-xl mx-auto -mt-10 px-6 relative z-20"
    >
      <div className="bg-white rounded-2xl shadow-xl border border-himbalin-beige p-8 md:p-10">
        <h3 className="font-serif text-2xl font-bold text-himbalin-dark mb-2 text-center">
          Enter Your Tracking Number
        </h3>
        <p className="text-gray-500 text-sm text-center mb-8">
          Retrieve real-time shipping details using your tracking number or Order ID.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-himbalin-dark/70 uppercase tracking-wider block">
              Tracking Number or Order ID
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <FiSearch className="text-lg" />
              </span>
              <input
                type="text"
                value={trackingId}
                onChange={(e) => setTrackingId(e.target.value)}
                placeholder="e.g. HBL938492 or HM-2026-00481"
                required
                className="w-full bg-[#FDFCFB] border border-gray-200 focus:border-himbalin-gold rounded-xl py-3.5 pl-11 pr-4 text-sm text-himbalin-dark placeholder-gray-400 focus:outline-none transition-colors"
              />
            </div>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-100 rounded-xl p-4 text-sm"
            >
              <FiAlertCircle className="text-lg shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}

          <div className="flex justify-center pt-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full bg-[#2B1A12] text-white py-4 rounded-xl font-bold tracking-wider hover:bg-[#3D261B] transition-colors shadow-lg text-sm"
            >
              Track Order
            </motion.button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default TrackingForm;
