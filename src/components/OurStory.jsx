import { motion } from "framer-motion";

const OurStory = () => {
  return (
    <section className="bg-[#2B1A12] py-32 px-8 text-himbalin-beige">
      <div className="container mx-auto max-w-4xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <p className="font-sans text-himbalin-gold font-bold tracking-[0.2em] text-sm mb-6 uppercase">
            Established 1985
          </p>
          <h2 className="font-serif text-5xl md:text-6xl font-bold mb-12">
            Our Story
          </h2>

          <div className="font-sans text-lg md:text-xl text-himbalin-beige/80 leading-relaxed font-light space-y-8">
            <p>
              Founded on the principles of exquisite design and uncompromising
              quality, Himbalin Enterprise blends traditional techniques with
              contemporary aesthetics to create pieces that tell a story. What
              started as a small artisanal workshop in the heart of the valley
              has grown into a global beacon of luxury.
            </p>
            <p>
              Every curve, join, and finish is a testament to our dedication. We
              don't just build furniture; we curate environments that inspire
              and endure. Our founders believed that a home should be a
              sanctuary of beauty, and for nearly four decades, we have been the
              architects of that vision.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default OurStory;
