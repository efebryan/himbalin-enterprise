import { motion } from "framer-motion";
import { FiChevronDown } from "react-icons/fi";

const AboutHero = () => {
  return (
    <section className="relative w-full h-[90vh] flex items-center justify-center bg-himbalin-dark overflow-hidden">
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/images/about_hero_bg.png')",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-himbalin-dark/70 via-himbalin-dark/40 to-himbalin-dark/90"></div>
      </div>

      <div className="container mx-auto px-8 relative z-10 flex flex-col items-center justify-center w-full h-full text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="max-w-4xl flex flex-col items-center"
        >
          <h1 className="font-serif text-6xl md:text-8xl text-himbalin-beige font-bold leading-tight mb-8">
            Our Heritage
          </h1>
          <p className="font-sans text-himbalin-beige/90 text-xl md:text-2xl max-w-3xl mb-16 leading-relaxed font-light">
            Crafting timeless elegance for the modern home since 1985. A legacy
            of wood, soul, and precision.
          </p>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: 1,
            duration: 1,
            repeat: Infinity,
            repeatType: "reverse",
          }}
          className="absolute bottom-12 text-himbalin-beige/60 text-4xl"
        >
          <FiChevronDown />
        </motion.div>
      </div>
    </section>
  );
};

export default AboutHero;
