import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiChevronRight, FiLock, FiChevronLeft } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PageLoader from "../components/PageLoader";
import { useCart } from "../context/CartContext";
import { formatPrice } from "../lib/formatCurrency";
import { initializePaystackCheckout } from "../lib/api";

const Checkout = () => {
  const { cartItems, subtotal } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
  });

  const shipping = 0; // FREE
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (cartItems.length === 0) return;

    setLoading(true);
    setError(null);

    try {
      const payload = {
        customerName: formData.name,
        customerEmail: formData.email,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        items: cartItems,
        total: total,
      };

      const response = await initializePaystackCheckout(payload);

      if (response && response.authorizationUrl) {
        // Redirect to Paystack
        window.location.href = response.authorizationUrl;
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  if (cartItems.length === 0 && !loading) {
    return (
      <div className="min-h-screen bg-himbalin-beige font-sans text-gray-900 flex flex-col">
        <Navbar />
        <main className="flex-grow flex flex-col items-center justify-center p-6 text-center">
          <h2 className="text-3xl font-serif font-900 text-[#1a1a1a] mb-4">Your cart is empty</h2>
          <Link to="/shop" className="text-himbalin-gold font-bold hover:underline flex items-center gap-2">
            <FiChevronLeft /> Back to Shop
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

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
            <Link to="/cart" className="text-himbalin-gold hover:underline transition-all">Cart</Link>
            <FiChevronRight className="text-gray-400" />
            <span className="text-gray-500">Checkout</span>
          </nav>

          <h1 className="text-5xl font-serif font-900 text-[#1a1a1a] mb-12">Secure Checkout</h1>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Checkout Form */}
            <div className="lg:col-span-7 bg-white rounded-3xl p-8 lg:p-10 shadow-[0_2px_15px_rgba(0,0,0,0.03)] border border-gray-100">
              <h2 className="text-2xl font-bold text-[#1a1a1a] mb-8">Billing Details</h2>
              
              {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-xl font-medium text-sm mb-6 border border-red-100">
                  {error}
                </div>
              )}

              <form onSubmit={handleCheckout} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Full Name *</label>
                    <input
                      required
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-himbalin-gold/20 focus:border-himbalin-gold transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Email Address *</label>
                    <input
                      required
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="john@example.com"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-himbalin-gold/20 focus:border-himbalin-gold transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Phone Number *</label>
                    <input
                      required
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+234..."
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-himbalin-gold/20 focus:border-himbalin-gold transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">City *</label>
                    <input
                      required
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="Lagos"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-himbalin-gold/20 focus:border-himbalin-gold transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Delivery Address *</label>
                  <textarea
                    required
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    rows="3"
                    placeholder="123 Main Street..."
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-himbalin-gold/20 focus:border-himbalin-gold transition-all resize-none"
                  ></textarea>
                </div>

                <div className="pt-6 border-t border-gray-100">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-himbalin-gold text-white rounded-full py-5 font-bold flex items-center justify-center gap-3 shadow-[0_8px_25px_rgba(245,166,35,0.25)] hover:bg-[#e0951a] transition-all disabled:opacity-70"
                  >
                    <FiLock /> Pay Now via Paystack
                  </button>
                </div>
              </form>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-3xl p-8 lg:p-10 shadow-[0_10px_40px_rgba(0,0,0,0.04)] border border-gray-50 sticky top-32">
                <h2 className="text-xl font-bold text-[#1a1a1a] mb-6">Order Summary</h2>

                <div className="max-h-60 overflow-y-auto mb-6 pr-2 space-y-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 border-b border-gray-50 pb-4 last:border-0 last:pb-0">
                      <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-lg" />
                      <div className="flex-1">
                        <h4 className="text-sm font-bold text-[#1a1a1a] line-clamp-1">{item.name}</h4>
                        <p className="text-xs text-gray-500 mt-1">Qty: {item.quantity}</p>
                      </div>
                      <div className="font-bold text-sm">
                        {formatPrice(item.price * item.quantity)}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-4 mb-8 pt-4 border-t border-gray-100">
                  <div className="flex justify-between text-gray-500 text-sm font-medium">
                    <span>Subtotal</span>
                    <span className="text-[#1a1a1a] font-bold">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-gray-500 text-sm font-medium">
                    <span>Shipping</span>
                    <span className="text-green-600 font-bold uppercase">FREE</span>
                  </div>
                  <div className="flex justify-between text-gray-500 text-sm font-medium">
                    <span>Estimated Tax</span>
                    <span className="text-[#1a1a1a] font-bold">{formatPrice(tax)}</span>
                  </div>
                </div>

                <div className="flex justify-between items-end border-t border-gray-100 pt-6">
                  <span className="text-lg font-bold text-[#1a1a1a]">Total</span>
                  <span className="text-3xl font-serif font-900 text-himbalin-gold">
                    {formatPrice(total)}
                  </span>
                </div>
              </div>
            </div>

          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Checkout;
