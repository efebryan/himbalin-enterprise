import { useState, useEffect } from "react";
import { FiStar } from "react-icons/fi";
import { motion } from "framer-motion";
import { getPublishedReviews } from "../lib/api";

const Testimonials = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getPublishedReviews();
        setReviews(data);
      } catch (err) {
        console.error("Failed to load testimonials:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Don't render the section if there are no published reviews
  if (!loading && reviews.length === 0) return null;

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

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-himbalin-gold border-t-transparent"></div>
          </div>
        ) : (
          <div className="relative w-full overflow-hidden flex items-center group">
            {/* Left gradient fade */}
            <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#1A100B] to-transparent z-20 pointer-events-none" />
            
            <motion.div
              className="flex gap-10 pl-10"
              animate={{ x: ["0%", "-50%"] }}
              transition={{
                ease: "linear",
                duration: 30, // Adjust speed here
                repeat: Infinity,
              }}
            >
              {/* Duplicate reviews to create a seamless infinite loop */}
              {[...reviews, ...reviews, ...reviews].map((review, index) => (
                <div
                  key={`${review.id}-${index}`}
                  className="bg-himbalin-dark/50 backdrop-blur-sm border border-himbalin-beige/10 rounded-2xl p-10 flex flex-col w-[350px] md:w-[450px] shrink-0"
                >
                  <div className="flex gap-1 mb-6 text-himbalin-gold">
                    {[...Array(5)].map((_, i) => (
                      <FiStar key={i} className="fill-current text-xl" />
                    ))}
                  </div>

                  <blockquote className="font-serif text-xl md:text-2xl leading-relaxed text-himbalin-beige/90 mb-10 italic flex-grow">
                    "{review.message}"
                  </blockquote>

                  <div className="flex items-center gap-4 mt-auto">
                    <div className="w-14 h-14 rounded-full bg-himbalin-gold/20 flex items-center justify-center text-himbalin-gold font-bold text-xl border-2 border-himbalin-gold shrink-0">
                      {review.name?.charAt(0).toUpperCase() || "?"}
                    </div>
                    <div className="truncate">
                      <h4 className="font-sans font-bold text-lg text-himbalin-beige tracking-wide truncate">
                        {review.name}
                      </h4>
                      <p className="font-sans text-himbalin-gold/80 text-sm tracking-widest uppercase mt-1 truncate">
                        {review.subject || "Customer"}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>

            {/* Right gradient fade */}
            <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#1A100B] to-transparent z-20 pointer-events-none" />
          </div>
        )}
      </div>
    </section>
  );
};

export default Testimonials;
