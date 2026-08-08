import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { FiCalendar, FiHome, FiBriefcase, FiStar, FiCheck, FiArrowRight } from "react-icons/fi";
import PageLoader from "../components/PageLoader";
import { AnimatePresence, motion } from "framer-motion";

import { supabase } from "../lib/supabase";
import { formatPrice } from "../lib/formatCurrency";

const IconMap = {
  FiHome,
  FiBriefcase,
  FiStar,
  FiCalendar,
  FiCheck
};

const Consulting = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    heroTitle: "Consulting Services",
    heroDescription: "Partner with our award-winning interior design experts to transform your home, office, or commercial space into something extraordinary.",
    services: [],
    trustPoints: [
      { label: "Projects Completed", value: "500+" },
      { label: "Countries Served", value: "12" },
      { label: "Years of Experience", value: "15+" },
      { label: "Client Satisfaction", value: "98%" },
    ]
  });

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const { data: res, error } = await supabase.from("consulting_content").select("*").limit(1).maybeSingle();
        if (error) throw error;
        if (res) {
          setData({
            heroTitle: res.hero_title || "Consulting Services",
            heroDescription: res.hero_description || "Partner with our award-winning interior design experts to transform your home, office, or commercial space into something extraordinary.",
            services: res.services || [],
            trustPoints: res.trust_points || []
          });
        }
      } catch (err) {
        console.error("Failed to fetch consulting content", err);
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, []);

  return (
    <>
      <AnimatePresence mode="wait">
        {loading && <PageLoader key="loader" />}
      </AnimatePresence>

      <div className="min-h-screen bg-himbalin-beige antialiased">
        <Navbar />

        <main className="pb-0">
          {/* Page Hero */}
          <div className="relative bg-himbalin-dark text-white pt-16 pb-24 px-4 md:px-8 mb-16 overflow-hidden">
            <div
              className="absolute inset-0 z-0 bg-cover bg-center"
              style={{ backgroundImage: "url('/images/cat_consulting.png')" }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-himbalin-dark via-himbalin-dark/80 to-transparent" />
            </div>

            <div className="container mx-auto relative z-10">
              <nav className="flex items-center gap-2 text-sm text-white/50 mb-8 font-sans">
                <a href="/" className="hover:text-himbalin-gold transition-colors">Home</a>
                <span className="text-white/20">›</span>
                <span className="text-himbalin-gold font-medium">Consulting Services</span>
              </nav>
              <div className="max-w-3xl">
                <h1 className="font-serif text-5xl md:text-7xl text-white font-bold mb-6">
                  {data.heroTitle}
                </h1>
                <p className="font-sans text-white/70 text-lg max-w-2xl leading-relaxed">
                  {data.heroDescription}
                </p>
                <div className="mt-10 flex flex-col sm:flex-row gap-4">
                  <a
                    href="#services"
                    className="inline-flex items-center gap-2 bg-himbalin-gold text-himbalin-dark px-8 py-4 rounded-sm font-bold text-sm hover:bg-yellow-500 transition-colors shadow-soft"
                  >
                    View All Services <FiArrowRight />
                  </a>
                  <a
                    href="/contact"
                    className="inline-flex items-center gap-2 bg-transparent border border-white/30 text-white px-8 py-4 rounded-sm font-medium text-sm hover:bg-white/10 transition-colors"
                  >
                    Free Discovery Call
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Trust Strip */}
          <div className="bg-himbalin-dark/5 border-y border-himbalin-dark/10 py-10 px-8 mb-16">
            <div className="container mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {data.trustPoints.map((tp, i) => (
                <div key={i}>
                  <p className="font-serif text-4xl font-black text-himbalin-dark mb-2">{tp.value}</p>
                  <p className="font-sans text-xs text-himbalin-dark/60 uppercase tracking-[0.15em] font-bold">{tp.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Services Grid */}
          <section id="services" className="container mx-auto px-4 md:px-8 mb-24">
            <div className="text-center mb-16">
              <h2 className="font-serif text-4xl lg:text-5xl text-himbalin-dark font-bold mb-4">
                Our Services
              </h2>
              <div className="w-20 h-1 bg-himbalin-gold mx-auto rounded-full" />
              <p className="font-sans text-himbalin-dark/60 mt-6 max-w-xl mx-auto text-base">
                From a single room refresh to a full commercial build-out — choose the package that fits your ambition.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {data.services.map((service, i) => {
                const IconComponent = IconMap[service.icon] || FiHome;
                return (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-white rounded-2xl p-8 shadow-soft border border-gray-100 hover:shadow-hover transition-all duration-300 group flex flex-col"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="w-14 h-14 rounded-xl bg-himbalin-gold/10 flex items-center justify-center text-himbalin-gold group-hover:bg-himbalin-gold group-hover:text-himbalin-dark transition-all duration-300 shrink-0">
                      <IconComponent size={28} />
                    </div>
                    {service.badge && (
                      <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-himbalin-dark text-himbalin-gold border border-himbalin-gold/20">
                        {service.badge}
                      </span>
                    )}
                  </div>

                  {/* Content */}
                  <h3 className="font-serif text-xl font-bold text-himbalin-dark mb-3 group-hover:text-himbalin-gold transition-colors">
                    {service.name}
                  </h3>
                  <p className="font-sans text-sm text-himbalin-dark/60 leading-relaxed mb-6 flex-grow">
                    {service.description}
                  </p>

                  {/* Highlights */}
                  <ul className="space-y-2 mb-8">
                    {service.highlights.map((h) => (
                      <li key={h} className="flex items-center gap-2 font-sans text-xs text-himbalin-dark/70">
                        <FiCheck className="text-himbalin-gold shrink-0" size={13} />
                        {h}
                      </li>
                    ))}
                  </ul>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-6 border-t border-gray-100">
                    <div>
                      <p className="font-sans text-[10px] uppercase tracking-widest text-himbalin-dark/40 font-bold mb-1">Starting from</p>
                      <p className="font-serif text-2xl font-black text-himbalin-dark">
                        {formatPrice(service.price)}
                      </p>
                      <p className="font-sans text-[11px] text-himbalin-dark/40">{service.duration}</p>
                    </div>
                    <a
                      href="/contact"
                      className="flex items-center gap-2 bg-himbalin-gold text-himbalin-dark px-6 py-3 rounded-full text-sm font-bold hover:bg-yellow-500 transition-colors shadow-soft"
                    >
                      Book a Call <FiCalendar size={14} />
                    </a>
                  </div>
                </motion.div>
                );
              })}
            </div>
          </section>

          {/* CTA Banner */}
          <section className="bg-himbalin-dark px-8 py-24 text-center">
            <div className="container mx-auto max-w-3xl">
              <h2 className="font-serif text-4xl lg:text-5xl text-himbalin-gold font-bold mb-6">
                Not Sure Where to Start?
              </h2>
              <p className="font-sans text-himbalin-beige/70 text-lg mb-10 leading-relaxed">
                Book a free 20-minute discovery call with our lead consultant. No pressure — just a conversation about your space.
              </p>
              <a
                href="/contact"
                className="inline-flex items-center gap-3 bg-himbalin-gold text-himbalin-dark px-12 py-5 rounded-sm font-bold text-sm hover:bg-yellow-500 transition-colors shadow-soft hover:shadow-hover"
              >
                Schedule Free Call <FiCalendar size={16} />
              </a>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Consulting;
