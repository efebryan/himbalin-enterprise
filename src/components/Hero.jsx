import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="relative w-full h-[85vh] flex items-center bg-himbalin-dark overflow-hidden">
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/images/home_hero_bg.png')",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-himbalin-dark/90 via-himbalin-dark/60 to-transparent"></div>
      </div>

      <div className="container mx-auto px-8 relative z-10 flex flex-col items-center justify-center w-full h-full text-center">
        {/* Content */}
        <div className="w-full max-w-4xl flex flex-col justify-center items-center h-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col items-center"
          >
            <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl text-himbalin-beige font-bold leading-tight mb-6">
              Elevate Your <br /> Space
            </h1>
            <p className="font-sans text-himbalin-beige/80 text-lg md:text-xl max-w-2xl mb-10 leading-relaxed font-light">
              Experience the pinnacle of luxury interiors and handcrafted
              furniture designed for sophisticated living.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center w-full">
              <Link
                to="/shop"
                className="bg-himbalin-gold text-himbalin-dark px-10 py-4 rounded-sm font-medium hover:bg-yellow-500 transition-colors shadow-soft hover:shadow-hover"
              >
                Shop Collection
              </Link>
              <Link
                to="/about"
                className="bg-transparent border border-himbalin-beige/30 text-himbalin-beige px-10 py-4 rounded-sm font-medium hover:bg-white/10 transition-colors backdrop-blur-sm"
              >
                Our Heritage
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
