import React, { useState, useRef, useEffect } from "react";
import { FiEdit2, FiTrash2, FiEye, FiFilter, FiChevronDown, FiChevronUp, FiPlus, FiX } from "react-icons/fi";
import AddProductDrawer from "./AddProductDrawer";
import ViewProductModal from "./ViewProductModal";
import DeleteConfirmModal from "./DeleteConfirmModal";
import Toast from "./Toast";

const CATEGORIES = ["All Categories", "Furniture", "Rugs", "Office", "Artificial Grass", "Other"];
const STATUSES = ["All Status", "In Stock", "Low Stock", "Out of Stock", "Draft"];

const INITIAL_PRODUCTS = [
  {
    id: "PRD-101",
    image: "https://images.unsplash.com/photo-1540574163026-643ea20ade25?auto=format&fit=crop&q=80&w=150",
    name: "Royal Leather Sofa Set",
    category: "Furniture",
    description: "Premium Italian leather sofa set with solid wood frame. Seats 5 comfortably. Available in brown, black, and tan.",
    price: "₦1,450,000",
    priceUnit: "per set",
    stock: 45,
    status: "In Stock",
    tags: ["Best Seller", "Featured"],
  },
  {
    id: "PRD-102",
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=150",
    name: "Imported Persian Rug (6×9ft)",
    category: "Rugs",
    description: "Hand-knotted Persian rug made from 100% wool. Traditional medallion design with rich color palette.",
    price: "₦380,000",
    priceUnit: "per piece",
    stock: 12,
    status: "Low Stock",
    tags: ["New Arrival"],
  },
  {
    id: "PRD-103",
    image: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&q=80&w=150",
    name: "Executive High-Back Chair",
    category: "Office",
    description: "Ergonomic high-back office chair with lumbar support, adjustable armrests, and breathable mesh back.",
    price: "₦195,000",
    priceUnit: "per piece",
    stock: 0,
    status: "Out of Stock",
    tags: [],
  },
  {
    id: "PRD-104",
    image: "https://images.unsplash.com/photo-1558603668-6570496b66f8?auto=format&fit=crop&q=80&w=150",
    name: "Premium Artificial Grass",
    category: "Artificial Grass",
    description: "High-density 40mm artificial turf, UV-resistant, pet-friendly. Ideal for gardens, playgrounds, and balconies.",
    price: "₦7,000",
    priceUnit: "per sqm",
    stock: 120,
    status: "In Stock",
    tags: ["Featured"],
  },
  {
    id: "PRD-105",
    image: "https://images.unsplash.com/photo-1505693314120-0d443867891c?auto=format&fit=crop&q=80&w=150",
    name: "Solid Wood Dining Table",
    category: "Furniture",
    description: "6-seater solid mahogany dining table with natural finish. Handcrafted by local artisans.",
    price: "₦299,000",
    priceUnit: "per piece",
    stock: 28,
    status: "In Stock",
    tags: ["New Arrival", "Best Seller"],
  },
];

const ProductsTable = () => {
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [viewProduct, setViewProduct] = useState(null);
  const [deleteProduct, setDeleteProduct] = useState(null);
  const [toast, setToast] = useState({ visible: false, message: "", type: "success" });

  // Filters
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedStatus, setSelectedStatus] = useState("All Status");
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);

  const categoryRef = useRef(null);
  const filterRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (categoryRef.current && !categoryRef.current.contains(e.target)) {
        setCategoryDropdownOpen(false);
      }
      if (filterRef.current && !filterRef.current.contains(e.target)) {
        setFilterDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter logic
  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      selectedCategory === "All Categories" || product.category === selectedCategory;
    const matchesStatus =
      selectedStatus === "All Status" || product.status === selectedStatus;
    return matchesCategory && matchesStatus;
  });

  const activeFilterCount =
    (selectedCategory !== "All Categories" ? 1 : 0) +
    (selectedStatus !== "All Status" ? 1 : 0);

  const getStatusBadge = (status) => {
    switch (status) {
      case "In Stock":
        return { bg: "bg-emerald-50", text: "text-emerald-600", dot: "bg-emerald-500" };
      case "Low Stock":
        return { bg: "bg-[#F4A623]/10", text: "text-[#c07d10]", dot: "bg-[#F4A623]" };
      case "Out of Stock":
        return { bg: "bg-red-50", text: "text-red-600", dot: "bg-red-500" };
      case "Draft":
        return { bg: "bg-gray-100", text: "text-gray-500", dot: "bg-gray-400" };
      default:
        return { bg: "bg-gray-100", text: "text-gray-600", dot: "bg-gray-400" };
    }
  };

  // ── Actions ──

  const handleSaveProduct = (product, isDraft, isEdit) => {
    if (isEdit) {
      setProducts((prev) =>
        prev.map((p) => (p.id === product.id ? product : p))
      );
      setToast({
        visible: true,
        message: "Product updated successfully!",
        type: "success",
      });
    } else {
      setProducts((prev) => [product, ...prev]);
      setToast({
        visible: true,
        message: isDraft ? "Product saved as draft." : "Product saved successfully!",
        type: isDraft ? "draft" : "success",
      });
    }
    setDrawerOpen(false);
    setEditProduct(null);
  };

  const handleEdit = (product) => {
    setEditProduct(product);
    setDrawerOpen(true);
  };

  const handleView = (product) => {
    setViewProduct(product);
  };

  const handleDeleteClick = (product) => {
    setDeleteProduct(product);
  };

  const handleDeleteConfirm = (productId) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    setDeleteProduct(null);
    setToast({
      visible: true,
      message: "Product deleted.",
      type: "success",
    });
  };

  const clearFilters = () => {
    setSelectedCategory("All Categories");
    setSelectedStatus("All Status");
  };

  return (
    <>
      <div className="bg-white rounded-2xl shadow-soft border border-gray-100 mb-8 overflow-hidden">
        {/* Header and Toolbar */}
        <div className="p-4 md:p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <h2 className="text-lg md:text-xl font-serif font-bold text-[#2B1A12]">All Products</h2>
            {activeFilterCount > 0 && (
              <span className="text-[10px] font-bold bg-[#F4A623] text-[#2B1A12] px-2 py-0.5 rounded-full">
                {activeFilterCount} filter{activeFilterCount > 1 ? "s" : ""}
              </span>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-2 md:gap-3 w-full md:w-auto">
            {/* Category Dropdown */}
            <div className="relative flex-1 md:flex-none" ref={categoryRef}>
              <button
                onClick={() => {
                  setCategoryDropdownOpen(!categoryDropdownOpen);
                  setFilterDropdownOpen(false);
                }}
                className={`flex items-center gap-1 md:gap-2 px-3 md:px-4 py-1.5 md:py-2 border rounded-lg text-xs md:text-sm font-semibold transition-colors justify-center w-full md:w-auto ${
                  selectedCategory !== "All Categories"
                    ? "border-[#F4A623] bg-[#F4A623]/5 text-[#2B1A12]"
                    : "border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
              >
                {selectedCategory}
                {categoryDropdownOpen ? (
                  <FiChevronUp className="shrink-0" />
                ) : (
                  <FiChevronDown className="shrink-0" />
                )}
              </button>

              {categoryDropdownOpen && (
                <div className="absolute top-full left-0 mt-1.5 w-full md:w-48 bg-white border border-gray-200 rounded-xl shadow-lg z-30 overflow-hidden">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        setSelectedCategory(cat);
                        setCategoryDropdownOpen(false);
                      }}
                      className={`block w-full text-left px-4 py-2.5 text-sm font-medium transition-colors ${
                        selectedCategory === cat
                          ? "bg-[#F4A623]/10 text-[#2B1A12] font-bold"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Status Filter Dropdown */}
            <div className="relative flex-1 md:flex-none" ref={filterRef}>
              <button
                onClick={() => {
                  setFilterDropdownOpen(!filterDropdownOpen);
                  setCategoryDropdownOpen(false);
                }}
                className={`flex items-center gap-1 md:gap-2 px-3 md:px-4 py-1.5 md:py-2 border rounded-lg text-xs md:text-sm font-semibold transition-colors justify-center w-full md:w-auto ${
                  selectedStatus !== "All Status"
                    ? "border-[#F4A623] bg-[#F4A623]/5 text-[#2B1A12]"
                    : "border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100"
                }`}
              >
                <FiFilter className="shrink-0" />
                {selectedStatus !== "All Status" ? selectedStatus : "Filters"}
              </button>

              {filterDropdownOpen && (
                <div className="absolute top-full left-0 md:right-0 md:left-auto mt-1.5 w-full md:w-48 bg-white border border-gray-200 rounded-xl shadow-lg z-30 overflow-hidden">
                  {STATUSES.map((status) => (
                    <button
                      key={status}
                      onClick={() => {
                        setSelectedStatus(status);
                        setFilterDropdownOpen(false);
                      }}
                      className={`block w-full text-left px-4 py-2.5 text-sm font-medium transition-colors ${
                        selectedStatus === status
                          ? "bg-[#F4A623]/10 text-[#2B1A12] font-bold"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Clear Filters */}
            {activeFilterCount > 0 && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1 px-3 py-1.5 md:py-2 text-xs md:text-sm font-semibold text-red-500 hover:bg-red-50 border border-red-200 rounded-lg transition-colors"
              >
                <FiX className="text-sm" /> Clear
              </button>
            )}

            {/* Add Product */}
            <button
              onClick={() => {
                setEditProduct(null);
                setDrawerOpen(true);
              }}
              className="bg-[#F4A623] hover:bg-[#e09520] text-[#2B1A12] px-4 md:px-5 py-1.5 md:py-2 rounded-lg font-bold shadow-sm transition-all text-xs md:text-sm flex items-center justify-center gap-1 md:gap-2 flex-1 md:flex-none"
            >
              <FiPlus className="text-sm md:text-base" /> Add Product
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-max">
            <thead>
              <tr className="bg-white border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-bold text-gray-400 tracking-wider uppercase">Product</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 tracking-wider uppercase">Category</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 tracking-wider uppercase">Price</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 tracking-wider uppercase">Stock</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 tracking-wider uppercase">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 tracking-wider uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center">
                    <p className="text-gray-400 font-semibold text-sm">No products found.</p>
                    <p className="text-gray-300 text-xs mt-1">Try adjusting your filters.</p>
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => {
                  const statusBadge = getStatusBadge(product.status);
                  return (
                    <tr key={product.id} className="hover:bg-[#f9fafb] transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-12 h-12 rounded-lg object-cover border border-gray-100"
                          />
                          <div>
                            <span className="block text-sm font-bold text-[#2B1A12]">{product.name}</span>
                            <span className="block text-xs font-medium text-gray-400 mt-0.5">{product.id}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-500">{product.category}</td>
                      <td className="px-6 py-4 text-sm font-bold text-[#2B1A12]">{product.price}</td>
                      <td className="px-6 py-4 text-sm font-bold text-gray-700">{product.stock}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center w-max gap-1.5 ${statusBadge.bg} ${statusBadge.text}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${statusBadge.dot}`}></span>
                          {product.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleView(product)}
                            title="View product"
                            className="text-gray-400 hover:text-blue-500 transition-colors p-1.5 rounded-md hover:bg-blue-50"
                          >
                            <FiEye className="text-base" />
                          </button>
                          <button
                            onClick={() => handleEdit(product)}
                            title="Edit product"
                            className="text-gray-400 hover:text-[#F4A623] transition-colors p-1.5 rounded-md hover:bg-[#F4A623]/10"
                          >
                            <FiEdit2 className="text-base" />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(product)}
                            title="Delete product"
                            className="text-gray-400 hover:text-red-500 transition-colors p-1.5 rounded-md hover:bg-red-50"
                          >
                            <FiTrash2 className="text-base" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer / Info */}
        <div className="p-4 md:p-6 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <span className="text-xs md:text-sm font-semibold text-gray-500">
            Showing {filteredProducts.length} of {products.length} products
          </span>
        </div>
      </div>

      {/* Add / Edit Product Drawer */}
      <AddProductDrawer
        isOpen={drawerOpen}
        onClose={() => {
          setDrawerOpen(false);
          setEditProduct(null);
        }}
        onSave={handleSaveProduct}
        editProduct={editProduct}
      />

      {/* View Product Modal */}
      <ViewProductModal
        product={viewProduct}
        isOpen={!!viewProduct}
        onClose={() => setViewProduct(null)}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        product={deleteProduct}
        isOpen={!!deleteProduct}
        onCancel={() => setDeleteProduct(null)}
        onConfirm={handleDeleteConfirm}
      />

      {/* Toast Notification */}
      <Toast
        message={toast.message}
        type={toast.type}
        visible={toast.visible}
        onClose={() => setToast((prev) => ({ ...prev, visible: false }))}
      />
    </>
  );
};

export default ProductsTable;
