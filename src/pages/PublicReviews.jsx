import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PageLoader from "../components/PageLoader";
import { AnimatePresence, motion } from "framer-motion";
import { getPublishedReviews } from "../lib/api";
import { FiStar } from "react-icons/fi";

const PublicReviews = () => {
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const data = await getPublishedReviews();
        setReviews(data);
      } catch (err) {
        console.error("Failed to load reviews:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  return (
    <>
      <AnimatePresence mode="wait">
        {loading && <PageLoader key="loader" />}
      </AnimatePresence>
      <div className="min-h-screen bg-himbalin-beige antialiased flex flex-col">
        <Navbar />
        
        <main className="flex-grow pb-24">
          {/* Hero Section */}
          <div className="relative bg-himbalin-dark text-white pt-16 pb-24 px-4 md:px-8 mb-12 overflow-hidden">
            <div 
              className="absolute inset-0 z-0 bg-cover bg-center opacity-30"
              style={{ backgroundImage: "url('https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=2000')" }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-himbalin-dark to-transparent" />
            
            <div className="container mx-auto relative z-10 text-center max-w-3xl">
              <nav className="flex justify-center items-center gap-2 text-sm text-white/50 mb-8 font-sans">
                <a href="/" className="hover:text-himbalin-gold transition-colors">Home</a>
                <span className="text-white/20">›</span>
                <span className="text-himbalin-gold font-medium">Reviews</span>
              </nav>
              <h1 className="font-serif text-5xl md:text-7xl text-white font-bold mb-6">
                Client Experiences
              </h1>
              <p className="font-sans text-white/70 text-lg">
                Discover what our clients have to say about our luxury collections and bespoke services.
              </p>
            </div>
          </div>

          <div className="container mx-auto px-4 md:px-8">
            {reviews.length === 0 && !loading ? (
              <div className="text-center py-24 bg-white rounded-2xl shadow-soft border border-gray-100">
                <h3 className="font-serif text-2xl font-bold text-himbalin-dark mb-3">
                  No Reviews Yet
                </h3>
                <p className="text-gray-500">Check back later for client experiences.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {reviews.map((review, index) => (
                  <motion.div
                    key={review.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-2xl p-8 shadow-soft border border-gray-100 hover:shadow-hover transition-all flex flex-col h-full relative overflow-hidden group"
                  >
                    {/* Decorative quote mark */}
                    <div className="absolute -top-4 -right-2 text-8xl font-serif text-himbalin-gold/10 group-hover:text-himbalin-gold/20 transition-colors pointer-events-none">
                      "
                    </div>

                    <div className="flex gap-1 mb-6 text-himbalin-gold relative z-10">
                      {[...Array(5)].map((_, i) => (
                        <FiStar key={i} className="fill-current text-sm" />
                      ))}
                    </div>

                    <blockquote className="font-serif text-xl leading-relaxed text-himbalin-dark/90 mb-8 flex-grow relative z-10">
                      "{review.message}"
                    </blockquote>

                    <div className="flex items-center gap-4 mt-auto pt-6 border-t border-gray-100 relative z-10">
                      <div className="w-12 h-12 rounded-full bg-himbalin-gold/10 flex items-center justify-center text-himbalin-gold font-bold text-lg">
                        {review.name?.charAt(0).toUpperCase() || "?"}
                      </div>
                      <div>
                        <h4 className="font-sans font-bold text-base text-himbalin-dark">
                          {review.name}
                        </h4>
                        <p className="font-sans text-himbalin-gold font-bold text-xs tracking-widest uppercase mt-0.5">
                          {review.subject || "Customer"}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default PublicReviews;
