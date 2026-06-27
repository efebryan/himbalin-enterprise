import React from "react";
import { motion } from "framer-motion";

const TrackingHero = () => {
  return (
    <div className="relative bg-himbalin-dark text-himbalin-beige py-24 px-6 md:px-12 overflow-hidden flex flex-col items-center justify-center text-center">
      {/* Decorative backdrop elements for premium luxury feel */}
      <div className="absolute inset-0 opacity-15">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[80%] rounded-full bg-himbalin-gold blur-[120px]"></div>
        <div className="absolute bottom-[-30%] right-[-10%] w-[60%] h-[90%] rounded-full bg-himbalin-gold blur-[150px]"></div>
      </div>
      
      {/* Subtle warehouse/delivery grid overlay pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(244,166,35,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(244,166,35,0.03)_1px,transparent_1px)] bg-[size:40px_40px]"></div>

      <div className="relative z-10 max-w-3xl mx-auto">
        <motion.span 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 0.8, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-xs md:text-sm font-bold tracking-[0.2em] text-himbalin-gold uppercase mb-4 block"
        >
          Exclusive Delivery Services
        </motion.span>
        
        <motion.h1 
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="font-serif text-4xl md:text-6xl font-bold tracking-tight mb-6"
        >
          Track Your Order
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 0.8, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="font-sans text-sm md:text-lg text-himbalin-beige/80 max-w-xl mx-auto leading-relaxed"
        >
          Stay updated with every stage of your furniture delivery, from confirmation to arrival at your residence.
        </motion.p>
      </div>
    </div>
  );
};

export default TrackingHero;
