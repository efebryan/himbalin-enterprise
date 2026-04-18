import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FiArrowLeft, FiHome, FiShoppingBag } from "react-icons/fi";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-himbalin-beige antialiased flex flex-col">
      <Navbar />

      <main className="flex-grow flex items-center justify-center px-6 py-24">
        <div className="container mx-auto max-w-3xl text-center">
          {/* Decorative Number */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative mb-8 select-none"
          >
            <span className="font-serif text-[180px] md:text-[260px] font-black leading-none text-himbalin-dark/5 block">
              404
            </span>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="w-20 h-20 rounded-full bg-himbalin-gold/10 border-2 border-himbalin-gold/30 flex items-center justify-center mx-auto mb-4">
                  <span className="text-himbalin-gold text-4xl font-serif font-bold">!</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Text */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-himbalin-dark mb-4">
              Page Not Found
            </h1>
            <div className="w-20 h-1 bg-himbalin-gold mx-auto rounded-full mb-6" />
            <p className="font-sans text-himbalin-dark/60 text-lg leading-relaxed max-w-lg mx-auto mb-12">
              It seems this page has been moved, renamed, or perhaps it never existed.
              Let us guide you back to something beautiful.
            </p>
          </motion.div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 bg-himbalin-dark text-himbalin-beige px-8 py-4 rounded-sm font-medium text-sm hover:bg-black transition-colors shadow-soft hover:shadow-hover"
            >
              <FiHome size={16} />
              Back to Home
            </Link>
            <Link
              to="/shop"
              className="inline-flex items-center justify-center gap-2 bg-himbalin-gold text-himbalin-dark px-8 py-4 rounded-sm font-medium text-sm hover:bg-yellow-500 transition-colors shadow-soft hover:shadow-hover"
            >
              <FiShoppingBag size={16} />
              Explore Shop
            </Link>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-16 pt-10 border-t border-himbalin-dark/10"
          >
            <p className="font-sans text-xs uppercase tracking-[0.2em] font-bold text-himbalin-dark/40 mb-6">
              Popular Pages
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              {[
                { label: "Furniture", to: "/furniture" },
                { label: "Rugs", to: "/rugs" },
                { label: "Office", to: "/office" },
                { label: "Artificial Grass", to: "/artificial-grass" },
                { label: "Consulting", to: "/consulting" },
                { label: "About Us", to: "/about" },
                { label: "Contact", to: "/contact" },
              ].map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="font-sans text-sm text-himbalin-dark/60 hover:text-himbalin-gold transition-colors px-4 py-2 bg-himbalin-dark/5 rounded-full hover:bg-himbalin-gold/10"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default NotFound;
