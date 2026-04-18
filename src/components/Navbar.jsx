import React, { useState } from "react";
import { FiShoppingCart, FiMenu, FiX } from "react-icons/fi";
import { Link, NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../context/CartContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { cartCount } = useCart();

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About Us", path: "/about" },
    { name: "Shop", path: "/shop" },
    { name: "Contact Us", path: "/contact" },
  ];

  const activeClass = "text-himbalin-gold";
  const inactiveClass = "hover:text-himbalin-gold transition-colors";

  return (
    <nav className="sticky top-0 z-50 bg-himbalin-dark text-himbalin-beige px-6 md:px-8 py-5 flex items-center justify-between shadow-soft">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded bg-himbalin-gold flex items-center justify-center">
          <span className="font-serif font-bold text-himbalin-dark text-xl leading-none">
            H
          </span>
        </div>
        <Link to="/" className="font-serif text-2xl font-bold tracking-wide">
          Himbalin
        </Link>
      </div>

      {/* Navigation Links (Desktop) */}
      <div className="hidden md:flex items-center gap-8 font-sans text-sm font-medium tracking-wide">
        {navLinks.map((link) => (
          <NavLink
            key={link.name}
            to={link.path}
            end={link.path === "/"}
            className={({ isActive }) =>
              `relative transition-colors ${isActive ? activeClass : inactiveClass}`
            }
          >
            {({ isActive }) => (
              <>
                {link.name}
                {isActive && (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-himbalin-gold rounded-full"
                  />
                )}
              </>
            )}
          </NavLink>
        ))}
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-1 md:gap-6">
        {/* Cart Button (Hidden on Mobile) */}
        <Link
          to="/cart"
          className="relative hidden md:flex bg-himbalin-gold text-himbalin-dark px-5 py-2.5 rounded-full items-center gap-2 font-medium text-sm hover:bg-yellow-500 transition-colors shadow-soft hover:shadow-hover"
        >
          <FiShoppingCart className="text-lg" />
          <span>Cart</span>
          <AnimatePresence>
            {cartCount > 0 && (
              <motion.span
                key={cartCount}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                className="absolute -top-2 -right-2 min-w-[20px] h-5 bg-himbalin-dark text-himbalin-gold text-[10px] font-black rounded-full flex items-center justify-center px-1 shadow-md"
              >
                {cartCount > 99 ? "99+" : cartCount}
              </motion.span>
            )}
          </AnimatePresence>
        </Link>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 text-himbalin-beige hover:text-himbalin-gold transition-colors"
        >
          {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] md:hidden"
            />

            {/* Side Menu (Slide from Right) */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-[280px] bg-himbalin-dark shadow-2xl z-[70] md:hidden flex flex-col p-8"
            >
              <div className="flex items-center justify-between mb-12">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded bg-himbalin-gold flex items-center justify-center">
                    <span className="font-serif font-bold text-himbalin-dark text-xl leading-none">H</span>
                  </div>
                  <span className="font-serif text-2xl font-bold tracking-wide">Himbalin</span>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-white/40 hover:text-white"
                >
                  <FiX size={24} />
                </button>
              </div>

              <div className="flex flex-col gap-6">
                {/* Mobile Cart Link */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0 }}
                >
                  <Link
                    to="/cart"
                    onClick={() => setIsOpen(false)}
                    className="relative flex items-center gap-3 bg-himbalin-gold/10 text-himbalin-gold p-4 rounded-2xl font-bold mb-4"
                  >
                    <FiShoppingCart size={20} />
                    <span>View Shopping Cart</span>
                    {cartCount > 0 && (
                      <motion.span
                        key={cartCount}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="ml-auto min-w-[24px] h-6 bg-himbalin-gold text-himbalin-dark text-[11px] font-black rounded-full flex items-center justify-center px-1.5"
                      >
                        {cartCount > 99 ? "99+" : cartCount}
                      </motion.span>
                    )}
                  </Link>
                </motion.div>

                {navLinks.map((link, index) => (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: (index + 1) * 0.1 }}
                  >
                    <NavLink
                      to={link.path}
                      end={link.path === "/"}
                      onClick={() => setIsOpen(false)}
                      className={({ isActive }) =>
                        `text-lg font-medium transition-colors flex items-center justify-between group ${
                          isActive ? "text-himbalin-gold" : "text-white/80 hover:text-himbalin-gold"
                        }`
                      }
                    >
                      {link.name}
                      <span className="w-2 h-2 rounded-full bg-himbalin-gold opacity-0 group-hover:opacity-100 transition-opacity" />
                    </NavLink>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
