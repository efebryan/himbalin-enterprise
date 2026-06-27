import React from "react";
import { motion } from "framer-motion";
import { FiMap, FiTruck } from "react-icons/fi";

const MapPlaceholder = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white rounded-2xl shadow-soft border border-himbalin-beige p-6 md:p-8"
    >
      <h3 className="font-serif text-xl font-bold text-himbalin-dark mb-6 pb-4 border-b border-gray-100">
        Live Delivery Location
      </h3>

      <div className="relative h-64 md:h-80 bg-himbalin-dark rounded-xl overflow-hidden flex flex-col items-center justify-center border border-himbalin-dark/10 shadow-inner">
        {/* Stylized background lines mimicking roads/grids */}
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-himbalin-gold/20 via-transparent to-transparent"></div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(244,166,35,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(244,166,35,0.06)_1px,transparent_1px)] bg-[size:30px_30px]"></div>

        {/* Abstract road route */}
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <motion.path
            d="M 50 180 Q 150 50, 250 180 T 450 180 T 650 100"
            fill="none"
            stroke="rgba(244, 166, 35, 0.2)"
            strokeWidth="6"
            strokeLinecap="round"
          />
          <motion.path
            d="M 50 180 Q 150 50, 250 180 T 450 180 T 650 100"
            fill="none"
            stroke="#F4A623"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray="10 250"
            animate={{
              strokeDashoffset: [0, -260]
            }}
            transition={{
              repeat: Infinity,
              duration: 8,
              ease: "linear"
            }}
          />
        </svg>

        {/* Animated truck icon */}
        <motion.div
          animate={{
            x: [-120, 120],
            y: [20, -20, 20]
          }}
          transition={{
            repeat: Infinity,
            repeatType: "reverse",
            duration: 10,
            ease: "easeInOut"
          }}
          className="relative z-10 bg-himbalin-gold text-himbalin-dark p-3.5 rounded-full shadow-lg shadow-[#F4A623]/25 flex items-center justify-center"
        >
          <FiTruck className="text-2xl animate-bounce" />
        </motion.div>

        {/* Info panel */}
        <div className="relative z-10 mt-6 text-center px-4 max-w-sm">
          <div className="flex items-center justify-center gap-1.5 text-himbalin-gold font-bold text-xs uppercase tracking-wider mb-2">
            <FiMap />
            <span>Map Simulation Mode</span>
          </div>
          <p className="text-himbalin-beige/60 text-xs leading-relaxed font-sans">
            Map integration will be available in the production version. Live GPS tracking operates in real-time on active shipments.
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default MapPlaceholder;
