import { useState } from "react";
import { FiHeart, FiShoppingCart, FiStar, FiCheck, FiX } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../context/CartContext";
import { formatPrice } from "../lib/formatCurrency";

const ProductCard = (props) => {
  const {
    id,
    name,
    description,
    price,
    priceUnit,
    oldPrice,
    rating,
    reviews,
    image,
    badge,
    stock,
  } = props.product || props;

  const { addToCart, isInCart } = useCart();
  const [showToast, setShowToast] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const alreadyInCart = isInCart(id);

  const handleAddToCart = () => {
    if (alreadyInCart) return; // block duplicate
    const added = addToCart({ id, name, description, price, image, priceUnit });
    if (added) {
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2500);
    }
  };

  // Defensive formatting
  const formattedPrice = typeof price === "number" ? price.toFixed(2) : "0.00";
  const formattedOldPrice = typeof oldPrice === "number" ? oldPrice.toFixed(2) : null;
  const displayRating = rating ?? 0;
  const displayReviews = reviews ?? 0;

  return (
    <>
      <div className="relative h-full flex flex-col">
        {/* Toast Notification */}
        <AnimatePresence>
          {showToast && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-2 left-1/2 -translate-x-1/2 z-50 bg-himbalin-dark text-white text-[11px] font-bold px-4 py-2 rounded-full shadow-lg flex items-center gap-2 whitespace-nowrap"
            >
              <FiCheck size={13} className="text-himbalin-gold" />
              Added to cart!
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          className="bg-white rounded-3xl overflow-hidden group shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-50 flex flex-col h-full"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          {/* Image Area */}
          <div className="relative aspect-[4/5] overflow-hidden bg-gray-50">
            <img
              src={image || "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=800"}
              alt={name || "Product"}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />

            {/* Wishlist Button */}
            <button className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm shadow-md flex items-center justify-center text-gray-900 hover:bg-himbalin-gold hover:text-himbalin-dark transition-all scale-0 group-hover:scale-100 duration-300">
              <FiHeart />
            </button>

            {/* Status Badge */}
            {badge && (
              <div className="absolute bottom-4 left-4">
                <span
                  className={`px-4 py-1.5 rounded-full font-sans text-[10px] font-black tracking-[0.1em] uppercase ${
                    badge.toString().includes("SALE")
                      ? "bg-red-500 text-white"
                      : badge.toString().includes("NEW")
                      ? "bg-himbalin-gold text-himbalin-dark"
                      : "bg-himbalin-dark text-white"
                  }`}
                >
                  {badge}
                </span>
              </div>
            )}

            {/* Already In Cart Overlay Badge */}
            {alreadyInCart && (
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1.5 rounded-full font-sans text-[10px] font-black tracking-[0.1em] uppercase bg-green-500 text-white flex items-center gap-1">
                  <FiCheck size={10} /> In Cart
                </span>
              </div>
            )}
          </div>

          {/* Content Area */}
          <div className="p-6 flex flex-col flex-1 justify-between">
            <div className="flex-1 flex flex-col">
              {/* Rating */}
              <div className="flex items-center gap-2 mb-3">
                <FiStar className="text-himbalin-gold fill-himbalin-gold" size={14} />
                <span className="font-sans text-[12px] font-bold text-himbalin-dark">
                  {displayRating}
                </span>
                <span className="font-sans text-[12px] text-gray-400">
                  ({displayReviews})
                </span>
              </div>

              {/* Info */}
              <h3 
                onClick={() => setShowModal(true)}
                className="font-serif text-lg font-bold text-himbalin-dark mb-1 hover:text-himbalin-gold transition-colors line-clamp-1 cursor-pointer"
                title="Click to view details"
              >
                {name || "Untitled Product"}
              </h3>
              <div className="mb-2">
                {stock !== undefined && stock > 0 ? (
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                    {stock} IN STOCK
                  </span>
                ) : stock === 0 ? (
                  <span className="text-[10px] font-bold text-red-600 bg-red-50 px-2.5 py-1 rounded-full border border-red-100">
                    OUT OF STOCK
                  </span>
                ) : null}
              </div>
              <p className="font-sans text-xs text-gray-400 mb-6 font-light line-clamp-2 h-8">
                {description || "No description available"}
              </p>
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-baseline gap-2 flex-wrap">
                <span className="font-serif text-xl font-black text-himbalin-dark">
                  {formatPrice(price)}
                </span>
                {priceUnit && (
                  <span className="text-[11px] text-gray-400 font-medium">
                    / {priceUnit}
                  </span>
                )}
                {oldPrice && (
                  <span className="font-sans text-sm text-gray-300 line-through">
                    {formatPrice(oldPrice)}
                  </span>
                )}
              </div>

              <motion.button
                onClick={handleAddToCart}
                whileTap={alreadyInCart ? {} : { scale: 0.9 }}
                title={alreadyInCart ? "Already in cart" : "Add to cart"}
                className={`w-10 h-10 rounded-full flex items-center justify-center shadow-md transition-all transform ${
                  alreadyInCart
                    ? "bg-green-500 text-white cursor-default"
                    : "bg-himbalin-gold text-himbalin-dark hover:bg-orange-500 hover:text-white active:scale-95"
                }`}
              >
                {alreadyInCart ? <FiCheck size={18} /> : <FiShoppingCart size={18} />}
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Product Details Modal */}
      <AnimatePresence>
        {showModal && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] transition-opacity"
            />

            {/* Modal Container */}
            <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 md:p-8 pointer-events-none">
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[85vh] overflow-hidden pointer-events-auto flex flex-col border border-gray-100"
              >
                {/* Modal Header/Image */}
                <div className="relative h-64 bg-gray-50 shrink-0">
                  <img
                    src={image || "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=800"}
                    alt={name || "Product"}
                    className="w-full h-full object-cover"
                  />
                  {badge && (
                    <div className="absolute top-4 left-4">
                      <span
                        className={`px-4 py-1.5 rounded-full font-sans text-[10px] font-black tracking-[0.1em] uppercase ${
                          badge.toString().includes("SALE")
                            ? "bg-red-500 text-white"
                            : badge.toString().includes("NEW")
                            ? "bg-himbalin-gold text-himbalin-dark"
                            : "bg-himbalin-dark text-white"
                        }`}
                      >
                        {badge}
                      </span>
                    </div>
                  )}
                  <button
                    onClick={() => setShowModal(false)}
                    className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center backdrop-blur-sm transition-all focus:outline-none"
                  >
                    <FiX size={20} />
                  </button>
                </div>

                {/* Modal Body */}
                <div className="p-6 md:p-8 overflow-y-auto space-y-4 flex-1">
                  {/* Rating & Stock */}
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-1.5">
                      <FiStar className="text-himbalin-gold fill-himbalin-gold" size={16} />
                      <span className="font-sans text-sm font-bold text-himbalin-dark">
                        {displayRating}
                      </span>
                      <span className="font-sans text-sm text-gray-400">
                        ({displayReviews} reviews)
                      </span>
                    </div>

                    <div>
                      {stock !== undefined && stock > 0 ? (
                        <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                          {stock} IN STOCK
                        </span>
                      ) : stock === 0 ? (
                        <span className="text-xs font-bold text-red-600 bg-red-50 px-3 py-1 rounded-full border border-red-100">
                          OUT OF STOCK
                        </span>
                      ) : null}
                    </div>
                  </div>

                  {/* Title */}
                  <h2 className="font-serif text-2xl font-bold text-[#2B1A12]">
                    {name || "Untitled Product"}
                  </h2>

                  {/* Divider */}
                  <div className="w-16 h-1 bg-[#F4A623] rounded-full" />

                  {/* Description */}
                  <div className="space-y-2">
                    <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                      Narration
                    </h4>
                    <p className="font-sans text-sm text-gray-600 leading-relaxed whitespace-pre-line font-light">
                      {description || "No description available."}
                    </p>
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="border-t border-gray-100 p-6 flex items-center justify-between shrink-0 bg-gray-50/50">
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <span className="font-serif text-2xl font-black text-himbalin-dark">
                      {formatPrice(price)}
                    </span>
                    {priceUnit && (
                      <span className="text-sm text-gray-500 font-medium">
                        / {priceUnit}
                      </span>
                    )}
                    {oldPrice && (
                      <span className="font-sans text-sm text-gray-300 line-through">
                        {formatPrice(oldPrice)}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setShowModal(false)}
                      className="px-5 py-2.5 rounded-full border border-gray-200 hover:bg-white text-xs font-bold text-gray-500 hover:text-himbalin-dark transition-all focus:outline-none"
                    >
                      Close
                    </button>
                    <button
                      onClick={() => {
                        handleAddToCart();
                      }}
                      disabled={stock === 0}
                      className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-bold shadow-md transition-all ${
                        alreadyInCart
                          ? "bg-green-500 text-white cursor-default"
                          : stock === 0
                          ? "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none"
                          : "bg-himbalin-gold text-himbalin-dark hover:bg-orange-500 hover:text-white"
                      }`}
                    >
                      {alreadyInCart ? (
                        <>
                          <FiCheck size={14} />
                          <span>In Cart</span>
                        </>
                      ) : stock === 0 ? (
                        <span>Out of Stock</span>
                      ) : (
                        <>
                          <FiShoppingCart size={14} />
                          <span>Add to Cart</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default ProductCard;
