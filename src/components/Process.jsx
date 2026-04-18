import { FiPenTool, FiBox, FiScissors, FiCheckCircle } from "react-icons/fi";
import { motion } from "framer-motion";

const Process = () => {
  const steps = [
    {
      icon: <FiPenTool className="text-2xl text-white" />,
      title: "Conceptualization",
      description: "Where ideas meet paper, balancing form and function.",
    },
    {
      icon: <FiBox className="text-2xl text-white" />,
      title: "Material Selection",
      description: "Sourcing the finest sustainable hardwoods and textiles.",
    },
    {
      icon: <FiScissors className="text-2xl text-white" />,
      title: "Master Crafting",
      description: "Hand-carved and assembled by veteran artisans.",
    },
    {
      icon: <FiCheckCircle className="text-2xl text-white" />,
      title: "Quality Assurance",
      description: "Rigorous 50-point inspection before it reaches you.",
    },
  ];

  return (
    <section className="py-24 px-8 bg-[#221610] text-himbalin-beige">
      <div className="container mx-auto max-w-7xl">
        <h2 className="font-serif text-4xl lg:text-5xl font-bold text-center mb-20 text-white">
          Our Process
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 relative">
          {/* Subtle connecting line for desktop */}
          <div className="hidden lg:block absolute top-[2.25rem] left-[12.5%] right-[12.5%] h-px bg-himbalin-gold/30 z-0"></div>

          {steps.map((step, index) => (
            <motion.div
              key={index}
              className="flex flex-col items-center text-center relative z-10"
              whileHover={{ y: -5 }}
              transition={{ duration: 0.3 }}
            >
              <div className="w-16 h-16 rounded-full border-2 border-himbalin-gold bg-[#221610] flex items-center justify-center mb-8 shadow-sm">
                {step.icon}
              </div>
              <h3 className="font-serif text-xl font-bold mb-3 text-white">
                {step.title}
              </h3>
              <p className="font-sans text-himbalin-beige/70 text-sm leading-relaxed max-w-[250px]">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Process;
