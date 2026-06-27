import React from "react";
import { motion } from "framer-motion";
import { FiPhone, FiTruck, FiShield, FiClock, FiUser } from "react-icons/fi";

const DeliveryCard = ({ driver }) => {
  if (!driver) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white rounded-2xl shadow-soft border border-himbalin-beige p-6 md:p-8"
    >
      <h3 className="font-serif text-xl font-bold text-himbalin-dark mb-6 pb-4 border-b border-gray-100">
        Delivery Details
      </h3>

      <div className="space-y-5">
        {/* Driver */}
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-himbalin-beige flex items-center justify-center shrink-0 text-himbalin-dark">
            <FiUser className="text-lg" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Your Courier</span>
            <h4 className="font-bold text-sm text-himbalin-dark">{driver.name}</h4>
          </div>
        </div>

        {/* Vehicle */}
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-himbalin-beige flex items-center justify-center shrink-0 text-himbalin-dark">
            <FiTruck className="text-lg" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Delivery Vehicle</span>
            <p className="font-semibold text-xs text-himbalin-dark">{driver.vehicle}</p>
          </div>
        </div>

        {/* Estimated Arrival */}
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-himbalin-beige flex items-center justify-center shrink-0 text-himbalin-dark">
            <FiClock className="text-lg text-himbalin-gold" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Estimated Arrival</span>
            <p className="font-bold text-sm text-himbalin-dark">{driver.estimatedArrival}</p>
          </div>
        </div>

        {/* Package Condition */}
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-himbalin-beige flex items-center justify-center shrink-0 text-himbalin-dark">
            <FiShield className="text-lg" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Package Condition</span>
            <p className="font-semibold text-xs text-himbalin-dark">{driver.condition}</p>
          </div>
        </div>

        {/* Contact Driver Action Button */}
        <div className="pt-4 border-t border-gray-50 mt-2">
          <motion.a
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            href={`tel:${driver.phone}`}
            className="flex items-center justify-center gap-2 w-full py-3 bg-[#2B1A12] text-white hover:bg-[#3D261B] rounded-xl font-bold text-sm transition-colors shadow-sm"
          >
            <FiPhone />
            <span>Call Driver ({driver.phone})</span>
          </motion.a>
        </div>
      </div>
    </motion.div>
  );
};

export default DeliveryCard;
