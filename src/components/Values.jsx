import { FiTool, FiFeather, FiCpu, FiHeart } from "react-icons/fi";
import { motion } from "framer-motion";

const Values = () => {
  const values = [
    {
      icon: <FiTool className="text-3xl text-himbalin-gold" />,
      title: "Craftsmanship",
      description:
        "Meticulously handcrafted by master artisans who treat wood like living art.",
    },
    {
      icon: <FiFeather className="text-3xl text-himbalin-gold" />,
      title: "Sustainability",
      description:
        "Ethically sourced materials and zero-waste practices for a greener future.",
    },
    {
      icon: <FiCpu className="text-3xl text-himbalin-gold" />,
      title: "Innovation",
      description:
        "Blending timeless design with modern functional needs and smart engineering.",
    },
    {
      icon: <FiHeart className="text-3xl text-himbalin-gold" />,
      title: "Client-Centric",
      description:
        "Tailored experiences designed to bring your unique interior vision to life.",
    },
  ];

  return (
    <section className="py-24 px-8 bg-himbalin-beige">
      <div className="container mx-auto max-w-6xl text-center">
        <h2 className="font-serif text-4xl lg:text-5xl text-himbalin-dark font-bold mb-6">
          Our Values
        </h2>
        <p className="font-sans text-himbalin-dark/70 text-lg max-w-2xl mx-auto mb-16 font-light">
          The pillars that define every piece we create and every relationship
          we build.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((val, idx) => (
            <motion.div
              key={idx}
              className="bg-white rounded-2xl p-8 flex flex-col items-center shadow-soft hover:shadow-hover transition-all-smooth"
              whileHover={{ y: -5 }}
            >
              <div className="w-16 h-16 rounded-full bg-himbalin-gold/10 flex items-center justify-center mb-6">
                {val.icon}
              </div>
              <h3 className="font-serif text-2xl font-bold text-himbalin-dark mb-4">
                {val.title}
              </h3>
              <p className="font-sans text-himbalin-dark/70 text-sm leading-relaxed">
                {val.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Values;
