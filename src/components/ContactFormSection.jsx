import { FiMail, FiPhone, FiMapPin, FiSettings, FiCheck } from "react-icons/fi";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ContactFormSection = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };
  return (
    <section className="py-24 px-8 bg-white">
      <div className="container mx-auto max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Form Column */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-10 shadow-soft border border-himbalin-beige">
            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center justify-center text-center py-16"
                >
                  <div className="w-20 h-20 rounded-full bg-himbalin-gold/10 flex items-center justify-center mb-6">
                    <FiCheck className="text-himbalin-gold text-4xl" />
                  </div>
                  <h3 className="font-serif text-3xl font-bold text-himbalin-dark mb-4">
                    Message Sent!
                  </h3>
                  <p className="font-sans text-himbalin-dark/60 leading-relaxed max-w-sm">
                    Thank you for reaching out. Our team will get back to you within 24 hours.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-8 font-sans text-sm text-himbalin-gold hover:text-himbalin-dark transition-colors font-bold underline"
                  >
                    Send another message
                  </button>
                </motion.div>
              ) : (
                <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <h2 className="font-serif text-3xl font-bold text-himbalin-dark mb-10">
                    Send us a Message
                  </h2>
                  <form className="space-y-8" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                        <label className="font-sans text-xs font-bold text-himbalin-dark uppercase tracking-wider">
                          Name
                        </label>
                        <input
                          type="text"
                          placeholder="Your full name"
                          required
                          className="w-full bg-himbalin-beige/30 border-none rounded-xl py-4 px-6 text-himbalin-dark focus:ring-2 focus:ring-himbalin-gold/50 transition-all outline-none"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="font-sans text-xs font-bold text-himbalin-dark uppercase tracking-wider">
                          Email Address
                        </label>
                        <input
                          type="email"
                          placeholder="email@example.com"
                          required
                          className="w-full bg-himbalin-beige/30 border-none rounded-xl py-4 px-6 text-himbalin-dark focus:ring-2 focus:ring-himbalin-gold/50 transition-all outline-none"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="font-sans text-xs font-bold text-himbalin-dark uppercase tracking-wider">
                        Subject
                      </label>
                      <select className="w-full bg-himbalin-beige/30 border-none rounded-xl py-4 px-6 text-himbalin-dark focus:ring-2 focus:ring-himbalin-gold/50 transition-all outline-none appearance-none">
                        <option>Bespoke Furniture Inquiry</option>
                        <option>Interior Styling Consultation</option>
                        <option>Lagos Showroom Visit</option>
                        <option>Istanbul Showroom Visit</option>
                        <option>General Feedback</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="font-sans text-xs font-bold text-himbalin-dark uppercase tracking-wider">
                        Message
                      </label>
                      <textarea
                        placeholder="How can we help you today?"
                        rows="5"
                        required
                        className="w-full bg-himbalin-beige/30 border-none rounded-xl py-4 px-6 text-himbalin-dark focus:ring-2 focus:ring-himbalin-gold/50 transition-all outline-none resize-none"
                      ></textarea>
                    </div>

                    <button
                      type="submit"
                      className="bg-himbalin-gold text-himbalin-dark px-10 py-4 rounded-xl font-bold text-sm hover:bg-yellow-500 transition-colors shadow-soft hover:shadow-hover mt-4 uppercase tracking-widest"
                    >
                      Submit Inquiry
                    </button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Contact Info Column */}
          <div className="lg:col-span-5 space-y-12">
            <div className="space-y-8">
              <h2 className="font-serif text-3xl font-bold text-himbalin-dark border-b border-himbalin-beige pb-4">
                Direct Contact
              </h2>

              <div className="flex gap-6 items-start group">
                <div className="w-12 h-12 rounded-xl bg-himbalin-gold/10 flex items-center justify-center shrink-0 group-hover:bg-himbalin-gold transition-colors">
                  <FiSettings className="text-himbalin-gold text-xl group-hover:text-himbalin-dark transition-colors" />
                </div>
                <div>
                  <h4 className="font-sans font-bold text-himbalin-dark mb-1">
                    Bespoke Consulting
                  </h4>
                  <p className="font-sans text-sm text-himbalin-dark/60">
                    bespoke@himbalin.com
                  </p>
                  <p className="font-sans text-sm text-himbalin-dark/60 mt-1">
                    +234 (0) 800 BESPOKE
                  </p>
                </div>
              </div>

              <div className="flex gap-6 items-start group">
                <div className="w-12 h-12 rounded-xl bg-himbalin-gold/10 flex items-center justify-center shrink-0 group-hover:bg-himbalin-gold transition-colors">
                  <FiMail className="text-himbalin-gold text-xl group-hover:text-himbalin-dark transition-colors" />
                </div>
                <div>
                  <h4 className="font-sans font-bold text-himbalin-dark mb-1">
                    General Inquiries
                  </h4>
                  <p className="font-sans text-sm text-himbalin-dark/60">
                    concierge@himbalin.com
                  </p>
                  <p className="font-sans text-sm text-himbalin-dark/60 mt-1">
                    +90 (212) 555 0199
                  </p>
                </div>
              </div>
            </div>

            {/* Showroom Cards */}
            <div className="bg-[#F5F1EC] rounded-3xl p-10 space-y-8">
              <h3 className="font-serif text-2xl font-bold text-himbalin-dark mb-2">
                Visit Our Showrooms
              </h3>
              <p className="font-sans text-sm italic text-himbalin-dark/70 mb-8 border-b border-himbalin-dark/10 pb-6">
                Experience our curated collections and luxury Turkey rugs in
                person.
              </p>

              <div className="space-y-6">
                <div>
                  <h5 className="font-sans font-black text-himbalin-dark text-[10px] uppercase tracking-[0.2em] mb-3">
                    Lagos, Nigeria
                  </h5>
                  <p className="font-sans text-sm text-himbalin-dark/80 leading-relaxed">
                    12 Victoria Island Crescent,
                    <br />
                    Lagos State, Nigeria
                  </p>
                  <p className="font-sans text-[11px] text-himbalin-dark/50 mt-2 font-bold uppercase">
                    Mon - Sat: 9am - 6pm
                  </p>
                </div>

                <div>
                  <h5 className="font-sans font-black text-himbalin-dark text-[10px] uppercase tracking-[0.2em] mb-3">
                    Istanbul, Turkey
                  </h5>
                  <p className="font-sans text-sm text-himbalin-dark/80 leading-relaxed">
                    Levent Loft, Büyükdere Cd. No:201,
                    <br />
                    34394 Şişli/İstanbul
                  </p>
                  <p className="font-sans text-[11px] text-himbalin-dark/50 mt-2 font-bold uppercase">
                    Mon - Fri: 10am - 7pm
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactFormSection;
