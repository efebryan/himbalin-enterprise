import React from "react";
import { FiAlertTriangle } from "react-icons/fi";

const DeleteConfirmModal = ({ product, isOpen, onCancel, onConfirm }) => {
  if (!isOpen || !product) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] transition-opacity"
        onClick={onCancel}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-slide-in-right">
          {/* Icon + Message */}
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-red-50 border-2 border-red-100 rounded-full flex items-center justify-center mx-auto mb-5">
              <FiAlertTriangle className="text-2xl text-red-500" />
            </div>
            <h3 className="text-lg font-serif font-bold text-[#2B1A12] mb-2">
              Delete Product?
            </h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              Are you sure you want to delete{" "}
              <span className="font-bold text-[#2B1A12]">
                {product.name}
              </span>
              ? This action cannot be undone.
            </p>
          </div>

          {/* Actions */}
          <div className="border-t border-gray-100 px-6 py-4 flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => onConfirm(product.id)}
              className="flex-1 px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-bold shadow-md transition-all"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default DeleteConfirmModal;
