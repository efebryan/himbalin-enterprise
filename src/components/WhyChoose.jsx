import { FiAward, FiTool, FiMessageSquare } from "react-icons/fi";

const WhyChoose = () => {
  const features = [
    {
      icon: <FiAward className="text-3xl text-himbalin-dark" />,
      title: "Premium Quality",
      description:
        "We source only the finest materials from around the world to ensure every piece is a masterpiece.",
    },
    {
      icon: <FiTool className="text-3xl text-himbalin-dark" />,
      title: "Expert Craftsmanship",
      description:
        "Our artisans blend traditional techniques with modern design for timeless furniture.",
    },
    {
      icon: <FiMessageSquare className="text-3xl text-himbalin-dark" />,
      title: "Design Consulting",
      description:
        "Personalized interior advice to help you create a space that reflects your unique personality.",
    },
  ];

  return (
    <section className="py-24 px-8 bg-himbalin-beige">
      <div className="container mx-auto max-w-6xl text-center">
        <h2 className="font-serif text-4xl lg:text-5xl text-himbalin-dark font-bold mb-16">
          Why Choose Himbalin?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-20">
          {features.map((feature, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className="w-20 h-20 rounded-full bg-himbalin-gold/20 flex items-center justify-center mb-6 text-himbalin-gold">
                {feature.icon}
              </div>
              <h3 className="font-serif text-2xl font-bold text-himbalin-dark mb-4">
                {feature.title}
              </h3>
              <p className="font-sans text-himbalin-dark/70 text-base leading-relaxed max-w-sm">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChoose;
