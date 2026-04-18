import React from "react";
import { RiCloseLine } from "react-icons/ri";

const ViewProductModal = ({ product, isOpen, onClose }) => {
  if (!isOpen || !product) return null;

  const getStatusBadge = (status) => {
    switch (status) {
      case "In Stock":
        return "bg-emerald-50 text-emerald-600";
      case "Low Stock":
        return "bg-[#F4A623]/10 text-[#c07d10]";
      case "Out of Stock":
        return "bg-red-50 text-red-600";
      case "Draft":
        return "bg-gray-100 text-gray-500";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 md:p-8">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[80vh] overflow-hidden animate-slide-in-right flex flex-col">
          {/* Header */}
          <div className="bg-[#2B1A12] px-6 py-4 flex items-center justify-between shrink-0">
            <div>
              <h2 className="text-lg font-serif font-bold text-white">
                Product Details
              </h2>
              <p className="text-xs text-[#F4A623] font-medium mt-0.5">
                {product.id}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-white/60 hover:text-white transition-colors p-1"
            >
              <RiCloseLine className="text-2xl" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 space-y-5 overflow-y-auto flex-1">
            {/* Product Image */}
            <div className="w-full h-40 rounded-xl overflow-hidden border border-gray-100">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Product Name */}
            <div>
              <h3 className="text-xl font-serif font-bold text-[#2B1A12] mb-1">
                {product.name}
              </h3>
              {product.description && (
                <p className="text-sm text-gray-500 leading-relaxed">
                  {product.description}
                </p>
              )}
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                  Category
                </p>
                <p className="text-sm font-bold text-[#2B1A12]">
                  {product.category}
                </p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                  Price
                </p>
                <p className="text-sm font-bold text-[#2B1A12]">
                  {product.price}
                </p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                  Stock
                </p>
                <p className="text-sm font-bold text-[#2B1A12]">
                  {product.stock} units
                </p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                  Status
                </p>
                <span
                  className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold ${getStatusBadge(
                    product.status
                  )}`}
                >
                  {product.status}
                </span>
              </div>
            </div>

            {/* Tags */}
            {product.tags && product.tags.length > 0 && (
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Tags
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 rounded-full text-xs font-bold bg-[#F4A623]/10 text-[#c07d10] border border-[#F4A623]/20"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-gray-100 px-6 py-3 shrink-0">
            <button
              onClick={onClose}
              className="w-full px-4 py-2.5 bg-[#2B1A12] hover:bg-[#3d2518] text-white rounded-lg text-sm font-bold transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ViewProductModal;
