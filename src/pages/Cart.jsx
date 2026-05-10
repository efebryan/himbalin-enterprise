import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiChevronRight, FiMinus, FiPlus, FiTrash2, FiLock, FiChevronLeft, FiShoppingCart } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PageLoader from "../components/PageLoader";
import { useCart } from "../context/CartContext";
import { formatPrice } from "../lib/formatCurrency";

const Cart = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const { cartItems, removeFromCart, updateQuantity, subtotal } = useCart();
  const [showEmptyModal, setShowEmptyModal] = useState(false);

  const handleRemove = (id) => {
    const isLastItem = cartItems.length <= 1;
    removeFromCart(id);
    if (isLastItem) {
      setShowEmptyModal(true);
    }
  };

  const shipping = 0; // FREE
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  return (
    <>
      <AnimatePresence mode="wait">
        {loading && <PageLoader key="loader" />}
      </AnimatePresence>
      <div className="min-h-screen bg-himbalin-beige font-sans text-gray-900 relative">
        <Navbar />

        <main className="max-w-7xl mx-auto px-6 py-12">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-sm font-medium mb-12">
            <Link to="/" className="text-himbalin-gold hover:underline transition-all">Home</Link>
            <FiChevronRight className="text-gray-400" />
            <span className="text-gray-500">Shopping Cart</span>
          </nav>

          {/* Title */}
          <h1 className="text-5xl font-serif font-900 text-[#1a1a1a] mb-12">
            Your Shopping Cart
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Items List */}
            <div className="lg:col-span-8 space-y-6">
              <AnimatePresence>
                {cartItems.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="bg-white rounded-2xl p-6 shadow-[0_2px_15px_rgba(0,0,0,0.03)] border border-gray-100 flex flex-col sm:flex-row items-center gap-6"
                  >
                    <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded-xl" />

                    <div className="flex-grow text-center sm:text-left">
                      <h3 className="text-lg font-bold text-[#1a1a1a] mb-1">{item.name}</h3>
                      <p className={`text-xs font-semibold mb-2 ${item.status === "In Stock" ? "text-green-600" : "text-himbalin-gold"}`}>
                        {item.status}
                      </p>
                      <p className="text-gray-500 font-medium">{formatPrice(item.price)}</p>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="flex items-center bg-[#fcfbf9] rounded-full border border-gray-100 p-1">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="p-2 hover:bg-gray-200 rounded-full transition-all text-gray-600"
                        >
                          <FiMinus size={14} />
                        </button>
                        <span className="w-8 text-center font-bold text-sm">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="p-2 hover:bg-gray-200 rounded-full transition-all text-gray-600"
                        >
                          <FiPlus size={14} />
                        </button>
                      </div>

                      <button
                        onClick={() => handleRemove(item.id)}
                        className="flex items-center gap-1.5 text-gray-400 hover:text-red-500 transition-all font-bold text-xs uppercase"
                      >
                        <FiTrash2 size={16} />
                        <span>REMOVE</span>
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {cartItems.length === 0 && (
                <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-gray-100">
                  <FiShoppingCart size={48} className="mx-auto text-gray-200 mb-4" />
                  <p className="text-gray-500 font-medium mb-6">Your cart is empty</p>
                  <Link to="/shop" className="text-himbalin-gold font-bold hover:underline flex items-center justify-center gap-2">
                    <FiChevronLeft /> Back to Shop
                  </Link>
                </div>
              )}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-4">
              <div className="bg-white rounded-[32px] p-10 shadow-[0_10px_40px_rgba(0,0,0,0.04)] border border-gray-50 sticky top-32">
                <h2 className="text-xl font-bold text-[#1a1a1a] mb-8">Order Summary</h2>

                <div className="space-y-4 mb-10">
                  <div className="flex justify-between text-gray-500 font-medium">
                    <span>Subtotal</span>
                    <span className="text-[#1a1a1a] font-bold">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-gray-500 font-medium">
                    <span>Shipping</span>
                    <span className="text-green-600 font-bold uppercase tracking-wide">FREE</span>
                  </div>
                  <div className="flex justify-between text-gray-500 font-medium">
                    <span>Estimated Tax</span>
                    <span className="text-[#1a1a1a] font-bold">{formatPrice(tax)}</span>
                  </div>
                </div>

                <div className="flex justify-between items-end border-t border-gray-50 pt-8 mb-8">
                  <span className="text-lg font-bold text-[#1a1a1a]">Total</span>
                  <span className="text-4xl font-serif font-900 text-himbalin-gold">
                    {formatPrice(total)}
                  </span>
                </div>

                <div className="space-y-4">
                  <Link
                    to={cartItems.length === 0 ? "#" : "/checkout"}
                    className={`w-full bg-himbalin-gold text-white rounded-full py-5 font-bold flex items-center justify-center gap-3 shadow-[0_8px_25px_rgba(245,166,35,0.25)] hover:bg-[#e0951a] transition-all ${cartItems.length === 0 ? "opacity-50 cursor-not-allowed pointer-events-none" : ""}`}
                  >
                    <FiLock /> Proceed to Checkout
                  </Link>

                  <Link to="/shop" className="w-full bg-white border border-gray-100 text-gray-400 rounded-full py-5 font-bold flex items-center justify-center hover:bg-gray-50 transition-all">
                    Continue Shopping
                  </Link>
                </div>

                <div className="mt-10 text-center">
                  <p className="text-gray-400 text-[10px] uppercase font-black tracking-widest mb-4">Secure Payments</p>
                  <div className="flex justify-center gap-6 text-gray-400 opacity-60">
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v4z"/></svg>
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/></svg>
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M21 16.5C21 16.88 20.79 17.21 20.47 17.38L12.57 21.82C12.41 21.94 12.21 22 12 22C11.79 22 11.59 21.94 11.43 21.82L3.53 17.38C3.21 17.21 3 16.88 3 16.5V7.5C3 7.12 3.21 6.79 3.53 6.62L11.43 2.18C11.59 2.06 11.79 2 12 2C12.21 2 12.41 2.06 12.57 2.18L20.47 6.62C20.79 6.79 21 7.12 21 7.5V16.5Z"/></svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Empty Cart Modal */}
        <AnimatePresence>
          {showEmptyModal && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/20 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="bg-white rounded-[40px] p-12 max-w-md w-full text-center shadow-[0_20px_60px_rgba(0,0,0,0.1)] relative"
              >
                <div className="w-24 h-24 bg-himbalin-gold/10 rounded-full flex items-center justify-center mx-auto mb-8">
                  <FiShoppingCart size={40} className="text-himbalin-gold" />
                </div>

                <h2 className="text-3xl font-serif font-900 text-[#1a1a1a] mb-4">Your cart is empty</h2>
                <p className="text-gray-500 font-medium mb-10 leading-relaxed px-4">
                  Looks like you haven't added anything to your cart yet. Let's find something special for you.
                </p>

                <div className="flex flex-col gap-4">
                  <Link
                    to="/shop"
                    className="w-full bg-himbalin-gold text-white rounded-full py-5 font-bold flex items-center justify-center gap-3 shadow-[0_8px_25px_rgba(245,166,35,0.25)] hover:bg-[#e0951a] transition-all uppercase tracking-wider text-sm"
                    onClick={() => setShowEmptyModal(false)}
                  >
                    Start Shopping
                  </Link>
                  <button
                    onClick={() => setShowEmptyModal(false)}
                    className="text-gray-400 font-bold hover:text-gray-600 transition-all text-xs uppercase tracking-widest"
                  >
                    Close
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        <Footer />
      </div>
    </>
  );
};

export default Cart;
