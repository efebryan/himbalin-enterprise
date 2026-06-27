import React from "react";
import { motion } from "framer-motion";
import { FiCheck, FiTruck, FiClock, FiSettings, FiActivity } from "react-icons/fi";

const getTimelineIcon = (status, completed, isCurrent) => {
  if (completed && !isCurrent) {
    return <FiCheck className="text-sm text-himbalin-dark font-bold" />;
  }
  if (isCurrent) {
    if (status.toLowerCase().includes("delivery")) {
      return <FiTruck className="text-sm text-himbalin-dark" />;
    }
    if (status.toLowerCase().includes("processing")) {
      return <FiSettings className="text-sm text-himbalin-dark animate-spin" style={{ animationDuration: "6s" }} />;
    }
    return <FiActivity className="text-sm text-himbalin-dark" />;
  }
  return <FiClock className="text-sm text-gray-400" />;
};

const TrackingTimeline = ({ timeline }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const stepVariants = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 100 } }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="bg-white rounded-2xl shadow-soft border border-himbalin-beige p-6 md:p-8"
    >
      <h3 className="font-serif text-xl font-bold text-himbalin-dark mb-8 pb-4 border-b border-gray-100">
        Delivery Progress
      </h3>

      <div className="relative pl-8 md:pl-10 space-y-10">
        {/* Continuous vertical timeline connector line */}
        <div className="absolute left-4 md:left-5 top-2 bottom-2 w-0.5 bg-gray-100"></div>

        {timeline.map((step, idx) => {
          const isCompleted = step.completed;
          const isCurrent = step.isCurrent;
          
          return (
            <motion.div 
              key={idx}
              variants={stepVariants}
              className="relative flex flex-col md:flex-row md:items-start gap-3 md:gap-8 group"
            >
              {/* Dynamic Line Connector for Completed Path */}
              {idx < timeline.length - 1 && timeline[idx + 1].completed && (
                <div className="absolute left-[-16px] md:left-[-20px] top-6 h-10 w-0.5 bg-himbalin-gold z-10"></div>
              )}

              {/* Status Circle Indicator */}
              <div className="absolute left-[-32px] md:left-[-40px] top-0.5 z-20">
                {isCurrent ? (
                  <div className="relative flex items-center justify-center">
                    <span className="absolute inline-flex h-9 w-9 rounded-full bg-himbalin-gold/35 animate-ping"></span>
                    <div className="relative w-8 h-8 rounded-full bg-himbalin-gold flex items-center justify-center shadow-md">
                      {getTimelineIcon(step.status, isCompleted, isCurrent)}
                    </div>
                  </div>
                ) : (
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all ${
                    isCompleted 
                      ? "bg-himbalin-gold/20 border-himbalin-gold/40 text-himbalin-dark shadow-sm" 
                      : "bg-[#FDFCFB] border-gray-200 text-gray-400"
                  }`}>
                    {getTimelineIcon(step.status, isCompleted, isCurrent)}
                  </div>
                )}
              </div>

              {/* Step Content */}
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                  <h4 className={`font-semibold text-sm md:text-base ${
                    isCurrent 
                      ? "text-himbalin-dark font-bold" 
                      : isCompleted 
                        ? "text-himbalin-dark/90" 
                        : "text-gray-400"
                  }`}>
                    {step.status}
                  </h4>
                  <span className={`text-[11px] font-bold tracking-wide uppercase ${
                    isCurrent 
                      ? "text-[#F4A623]" 
                      : "text-gray-400"
                  }`}>
                    {step.date}
                  </span>
                </div>
                <p className={`text-xs md:text-sm leading-relaxed max-w-xl ${
                  isCurrent 
                    ? "text-himbalin-dark/80 font-medium" 
                    : isCompleted 
                      ? "text-gray-500" 
                      : "text-gray-400/80"
                }`}>
                  {step.description}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default TrackingTimeline;
