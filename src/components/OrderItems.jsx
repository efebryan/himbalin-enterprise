import React from "react";
import { motion } from "framer-motion";

const OrderItems = ({ items }) => {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const formatPrice = (value) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0
    }).format(value);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white rounded-2xl shadow-soft border border-himbalin-beige p-6 md:p-8"
    >
      <h3 className="font-serif text-xl font-bold text-himbalin-dark mb-6 pb-4 border-b border-gray-100">
        Order Summary Items
      </h3>

      <div className="divide-y divide-gray-100">
        {items.map((item) => (
          <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex items-center gap-4">
            <img
              src={item.image}
              alt={item.name}
              className="w-16 h-16 rounded-xl object-cover border border-gray-100 shrink-0"
            />
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-sm text-himbalin-dark truncate">
                {item.name}
              </h4>
              <p className="text-xs text-gray-400 font-medium">
                Qty: {item.quantity}
              </p>
            </div>
            <div className="text-right">
              <span className="font-serif font-bold text-sm text-himbalin-dark">
                {formatPrice(item.price * item.quantity)}
              </span>
              {item.quantity > 1 && (
                <span className="block text-[10px] text-gray-400">
                  {formatPrice(item.price)} each
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-6 border-t border-gray-100 flex items-center justify-between font-bold">
        <span className="text-sm uppercase tracking-wider text-gray-500 font-bold">
          Subtotal
        </span>
        <span className="font-serif text-lg text-himbalin-dark">
          {formatPrice(subtotal)}
        </span>
      </div>
    </motion.div>
  );
};

export default OrderItems;
