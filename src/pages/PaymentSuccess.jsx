import React, { useEffect, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { FiCheckCircle, FiChevronRight } from "react-icons/fi";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useCart } from "../context/CartContext";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const reference = searchParams.get("reference") || searchParams.get("trxref");
  const { clearCart } = useCart();
  const hasCleared = useRef(false);

  // Clear the cart once on mount after successful payment
  useEffect(() => {
    if (!hasCleared.current) {
      clearCart();
      hasCleared.current = true;
    }
  }, [clearCart]);

  return (
    <div className="min-h-screen bg-himbalin-beige font-sans text-gray-900 flex flex-col">
      <Navbar />

      <main className="flex-grow flex items-center justify-center p-6 py-20">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="bg-white rounded-[40px] p-12 max-w-lg w-full text-center shadow-[0_20px_60px_rgba(0,0,0,0.05)] border border-gray-100"
        >
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8"
          >
            <FiCheckCircle size={48} className="text-green-500" />
          </motion.div>

          <h1 className="text-4xl font-serif font-900 text-[#1a1a1a] mb-4">Payment Successful!</h1>
          
          <p className="text-gray-500 font-medium mb-8 leading-relaxed">
            Thank you for your purchase. Your order has been received and is being processed. 
            We'll send you an email with the delivery details shortly.
          </p>

          {reference && (
            <div className="bg-gray-50 rounded-2xl p-4 mb-8 border border-gray-100">
              <p className="text-sm text-gray-500 font-medium mb-1">Transaction Reference</p>
              <p className="font-mono font-bold text-[#1a1a1a]">{reference}</p>
            </div>
          )}

          <div className="space-y-4">
            <Link
              to="/shop"
              className="w-full bg-himbalin-gold text-white rounded-full py-5 font-bold flex items-center justify-center gap-3 shadow-[0_8px_25px_rgba(245,166,35,0.25)] hover:bg-[#e0951a] transition-all"
            >
              Continue Shopping <FiChevronRight />
            </Link>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default PaymentSuccess;
