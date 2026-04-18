import { motion } from "framer-motion";

const ContactHero = () => {
  return (
    <section className="relative w-full h-[60vh] flex items-center justify-center bg-himbalin-dark overflow-hidden">
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/images/contact_hero_bg.png')",
        }}
      >
        <div className="absolute inset-0 bg-black/60"></div>
      </div>

      <div className="container mx-auto px-8 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="font-serif text-5xl md:text-7xl text-white font-bold mb-6">
            Get in Touch
          </h1>
          <p className="font-sans text-white/80 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-light">
            Experience personalized service tailored to your luxury lifestyle.
            Our consultants are ready to assist you in curating the perfect
            space.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactHero;
