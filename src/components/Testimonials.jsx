import { testimonials } from "../data/testimonials";
import { FiStar } from "react-icons/fi";
import { motion } from "framer-motion";

const Testimonials = () => {
  return (
    <section className="py-24 px-8 bg-[#1A100B] text-himbalin-beige relative overflow-hidden">
      {/* Decorative large quote marks */}
      <div className="absolute top-10 right-20 text-[20rem] font-serif text-himbalin-gold/5 leading-none select-none z-0">
        &rdquo;
      </div>

      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl lg:text-5xl text-himbalin-gold font-bold mb-4">
            What Our Clients Say
          </h2>
          <div className="w-24 h-1 bg-himbalin-beige/20 mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {testimonials.map((testimonial) => (
            <motion.div
              key={testimonial.id}
              className="bg-himbalin-dark/50 backdrop-blur-sm border border-himbalin-beige/10 rounded-2xl p-10 relative"
              whileHover={{ y: -5 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex gap-1 mb-6 text-himbalin-gold">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <FiStar key={i} className="fill-current text-xl" />
                ))}
              </div>

              <blockquote className="font-serif text-2xl leading-relaxed text-himbalin-beige/90 mb-10 italic">
                "{testimonial.text}"
              </blockquote>

              <div className="flex items-center gap-4 mt-auto">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-14 h-14 rounded-full object-cover border-2 border-himbalin-gold"
                />
                <div>
                  <h4 className="font-sans font-bold text-lg text-himbalin-beige tracking-wide">
                    {testimonial.name}
                  </h4>
                  <p className="font-sans text-himbalin-gold/80 text-sm tracking-widest uppercase mt-1">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
