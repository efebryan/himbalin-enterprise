import { useState } from "react";
import { FiMail, FiCheck } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

const Subscribe = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubscribed(true);
    setEmail("");
  };

  return (
    <section className="py-24 px-8 bg-himbalin-gold">
      <div className="container mx-auto max-w-4xl text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-himbalin-dark/10 mb-8 border border-himbalin-dark/20">
          <FiMail className="text-3xl text-himbalin-dark" />
        </div>

        <h2 className="font-serif text-4xl lg:text-5xl text-himbalin-dark font-bold mb-6">
          Join the Inner Circle
        </h2>

        <p className="font-sans text-himbalin-dark text-lg lg:text-xl max-w-2xl mx-auto mb-12 opacity-80">
          Receive exclusive previews of new collections and interior design tips
          from our experts.
        </p>

        <AnimatePresence mode="wait">
          {subscribed ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-4"
            >
              <div className="w-16 h-16 rounded-full bg-himbalin-dark flex items-center justify-center">
                <FiCheck className="text-himbalin-gold text-3xl" />
              </div>
              <p className="font-serif text-2xl font-bold text-himbalin-dark">
                You're on the list!
              </p>
              <p className="font-sans text-himbalin-dark/70">
                Welcome to the inner circle. Expect something special soon.
              </p>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto"
            >
              <input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-grow bg-white border-none rounded-full px-8 py-4 outline-none focus:ring-2 focus:ring-himbalin-dark/50 text-himbalin-dark placeholder-himbalin-dark/40 font-sans shadow-soft"
              />
              <button
                type="submit"
                className="bg-himbalin-dark text-himbalin-gold px-10 py-4 rounded-full font-bold font-sans tracking-wide hover:bg-black transition-colors shadow-soft"
              >
                Subscribe Now
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default Subscribe;
