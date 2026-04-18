import React from "react";
import { motion } from "framer-motion";

const PageLoader = () => {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white"
    >
      <div className="relative">
        {/* Pulsing Outer Ring */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute inset-0 -m-8 rounded-full bg-himbalin-gold"
        />

        {/* Logo Container */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative bg-himbalin-dark text-himbalin-gold w-24 h-24 rounded-full flex items-center justify-center shadow-[0_10px_40px_rgba(43,26,18,0.15)]"
        >
          <span className="font-serif text-5xl font-black">H</span>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        className="mt-8 text-center"
      >
        <p className="text-himbalin-dark/40 text-[10px] uppercase font-black tracking-[0.3em] ml-1">
          Himbalin Enterprise
        </p>
        <div className="flex justify-center gap-1.5 mt-4">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.3, 1, 0.3],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.2,
              }}
              className="w-1.5 h-1.5 bg-himbalin-gold rounded-full"
            />
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default PageLoader;
