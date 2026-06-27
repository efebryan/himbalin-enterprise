import React from "react";
import { motion } from "framer-motion";
import { FiPhoneCall, FiMessageSquare, FiMail } from "react-icons/fi";

const SupportSection = () => {
  return (
    <div className="bg-[#1A100B] text-himbalin-beige py-16 px-6 md:px-12 rounded-2xl relative overflow-hidden border border-white/5">
      {/* Background overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-himbalin-gold/5 via-transparent to-transparent"></div>

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <h3 className="font-serif text-2xl md:text-3xl font-bold tracking-tight mb-2">
          Need Assistance?
        </h3>
        <p className="text-himbalin-beige/60 text-sm max-w-lg mx-auto mb-8 leading-relaxed font-sans">
          Our dedicated luxury concierge team is available to assist you with any questions regarding your delivery.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
          {/* Call Support */}
          <motion.a
            whileHover={{ scale: 1.03, backgroundColor: "rgba(255, 255, 255, 0.08)" }}
            whileTap={{ scale: 0.97 }}
            href="tel:+15552346678"
            className="flex flex-col items-center justify-center p-6 bg-white/5 border border-white/10 rounded-xl transition-all"
          >
            <FiPhoneCall className="text-2xl text-himbalin-gold mb-3" />
            <span className="font-semibold text-sm">Call Support</span>
            <span className="text-[10px] text-himbalin-beige/40 mt-1 font-sans">Immediate Call</span>
          </motion.a>

          {/* Live Chat */}
          <motion.button
            whileHover={{ scale: 1.03, backgroundColor: "rgba(255, 255, 255, 0.08)" }}
            whileTap={{ scale: 0.97 }}
            onClick={() => alert("Concierge Live Chat will start shortly.")}
            className="flex flex-col items-center justify-center p-6 bg-white/5 border border-white/10 rounded-xl transition-all"
          >
            <FiMessageSquare className="text-2xl text-himbalin-gold mb-3" />
            <span className="font-semibold text-sm">Live Chat</span>
            <span className="text-[10px] text-himbalin-beige/40 mt-1 font-sans">24/7 Concierge</span>
          </motion.button>

          {/* Email Support */}
          <motion.a
            whileHover={{ scale: 1.03, backgroundColor: "rgba(255, 255, 255, 0.08)" }}
            whileTap={{ scale: 0.97 }}
            href="mailto:support@himbalin.com?subject=Delivery Assistance"
            className="flex flex-col items-center justify-center p-6 bg-white/5 border border-white/10 rounded-xl transition-all"
          >
            <FiMail className="text-2xl text-himbalin-gold mb-3" />
            <span className="font-semibold text-sm">Email Support</span>
            <span className="text-[10px] text-himbalin-beige/40 mt-1 font-sans">Replies within 1 hour</span>
          </motion.a>
        </div>
      </div>
    </div>
  );
};

export default SupportSection;
