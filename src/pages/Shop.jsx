import React, { useState, useEffect, useMemo } from "react";
import Navbar from "../components/Navbar";
import ShopSidebar from "../components/ShopSidebar";
import ProductCard from "../components/ProductCard";
import ShopPagination from "../components/ShopPagination";
import Footer from "../components/Footer";
import { FiGrid, FiList, FiChevronDown, FiX, FiFilter } from "react-icons/fi";
import PageLoader from "../components/PageLoader";
import { AnimatePresence, motion } from "framer-motion";
import { getProducts, getCategories } from "../lib/api";
import { formatPrice } from "../lib/formatCurrency";

const SORT_OPTIONS = [
  { label: "Popularity", value: "popularity" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
  { label: "Highest Rated", value: "rating" },
  { label: "Most Reviewed", value: "reviews" },
];

// ─── Component ────────────────────────────────────────────────────────────────
const Shop = () => {
  const [loading, setLoading] = useState(true);
  const [allProducts, setAllProducts] = useState([]);
  const [categories, setCategories] = useState(["All Products", "Furniture", "Home Decor", "Floor & Outdoor"]);

  // Filter state
  const [activeCategory, setActiveCategory] = useState("All Products");
  const [activeAvailability, setActiveAvailability] = useState([]);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [activeMaterials, setActiveMaterials] = useState([]);
  const [sortBy, setSortBy] = useState("popularity");
  const [viewMode, setViewMode] = useState("grid"); // "grid" | "list"
  const [showSortMenu, setShowSortMenu] = useState(false);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodData, catData] = await Promise.all([
          getProducts(),
          getCategories()
        ]);
        setAllProducts(prodData);
        if (catData && catData.length > 0) {
          setCategories(["All Products", ...catData.map((c) => c.name)]);
        }
      } catch (err) {
        console.error("Failed to load products or categories:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // ── Derived: filtered + sorted list ──────────────────────────────────────
  const filtered = useMemo(() => {
    let list = [...allProducts];

    // Category
    if (activeCategory !== "All Products") {
      list = list.filter((p) => p.category === activeCategory);
    }

    // Availability
    if (activeAvailability.length > 0) {
      list = list.filter((p) => activeAvailability.includes(p.availability));
    }

    // Material
    if (activeMaterials.length > 0) {
      list = list.filter((p) => activeMaterials.includes(p.material));
    }

    // Sort
    switch (sortBy) {
      case "price_asc":
        list.sort((a, b) => a.price - b.price);
        break;
      case "price_desc":
        list.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        list.sort((a, b) => b.rating - a.rating);
        break;
      case "reviews":
        list.sort((a, b) => b.reviews - a.reviews);
        break;
      default:
        break; // original order = "popularity"
    }

    return list;
  }, [allProducts, activeCategory, activeAvailability, activeMaterials, sortBy]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory, activeAvailability, activeMaterials, sortBy]);

  // ── Helpers ───────────────────────────────────────────────────────────────
  const toggleMaterial = (mat) =>
    setActiveMaterials((prev) =>
      prev.includes(mat) ? prev.filter((m) => m !== mat) : [...prev, mat]
    );

  const toggleAvailability = (opt) =>
    setActiveAvailability((prev) =>
      prev.includes(opt) ? prev.filter((a) => a !== opt) : [...prev, opt]
    );

  const resetAll = () => {
    setActiveCategory("All Products");
    setActiveAvailability([]);
    setActiveMaterials([]);
    setSortBy("popularity");
    setCurrentPage(1);
  };

  const hasActiveFilters =
    activeCategory !== "All Products" ||
    activeAvailability.length > 0 ||
    activeMaterials.length > 0;

  const currentSortLabel =
    SORT_OPTIONS.find((o) => o.value === sortBy)?.label ?? "Popularity";

  // Compute pagination
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginatedProducts = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <>
      <AnimatePresence mode="wait">
        {loading && <PageLoader key="loader" />}
      </AnimatePresence>
      <div className="min-h-screen bg-himbalin-beige antialiased">
        <Navbar />

        <main className="pb-24">
          {/* Hero Header */}
          <div className="relative bg-himbalin-dark text-white pt-16 pb-24 px-4 md:px-8 mb-12 overflow-hidden">
            <div
              className="absolute inset-0 z-0 bg-cover bg-center"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=2000')",
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-himbalin-dark via-himbalin-dark/80 to-transparent" />
            </div>

            <div className="container mx-auto relative z-10">
              <nav className="flex items-center gap-2 text-sm text-white/50 mb-8 font-sans">
                <a href="/" className="hover:text-himbalin-gold transition-colors">
                  Home
                </a>
                <span className="text-white/20">›</span>
                <span className="text-himbalin-gold font-medium">Shop</span>
              </nav>

              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                  <h1 className="font-serif text-5xl md:text-7xl text-white font-bold mb-4">
                    Premium Collection
                  </h1>
                  <p className="font-sans text-white/70 text-lg max-w-2xl">
                    Curated essentials for a sophisticated lifestyle. Discover
                    our latest artisan-crafted pieces.
                  </p>
                </div>

                {/* View Toggle + Sort */}
                <div className="flex items-center gap-2 sm:gap-4">
                  {/* Mobile Filters Toggle */}
                  <button
                    onClick={() => setShowMobileFilters(true)}
                    className="lg:hidden flex items-center gap-2 px-3 py-2.5 sm:px-4 bg-white/5 border border-white/10 rounded-lg text-sm font-medium text-white hover:border-himbalin-gold transition-colors"
                  >
                    <FiFilter size={18} />
                    <span className="hidden sm:inline">Filters</span>
                  </button>

                  {/* Grid / List toggle */}
                  <div className="flex bg-white/5 rounded-lg border border-white/10 p-1">
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`p-2 rounded-md transition-colors ${
                        viewMode === "grid"
                          ? "bg-white/10 text-himbalin-gold"
                          : "text-white/40 hover:text-white"
                      }`}
                    >
                      <FiGrid size={20} />
                    </button>
                    <button
                      onClick={() => setViewMode("list")}
                      className={`p-2 rounded-md transition-colors ${
                        viewMode === "list"
                          ? "bg-white/10 text-himbalin-gold"
                          : "text-white/40 hover:text-white"
                      }`}
                    >
                      <FiList size={20} />
                    </button>
                  </div>

                  {/* Sort Dropdown */}
                  <div className="relative">
                    <button
                      onClick={() => setShowSortMenu((v) => !v)}
                      className="flex items-center gap-2 px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm font-medium text-white hover:border-himbalin-gold transition-colors"
                    >
                      Sort: {currentSortLabel}
                      <FiChevronDown
                        className={`text-white/40 transition-transform ${
                          showSortMenu ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    <AnimatePresence>
                      {showSortMenu && (
                        <motion.div
                          initial={{ opacity: 0, y: -8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                          className="absolute right-0 top-full mt-2 w-52 bg-white rounded-xl shadow-hover border border-gray-100 z-50 overflow-hidden"
                        >
                          {SORT_OPTIONS.map((opt) => (
                            <button
                              key={opt.value}
                              onClick={() => {
                                setSortBy(opt.value);
                                setShowSortMenu(false);
                              }}
                              className={`w-full text-left px-5 py-3 font-sans text-sm transition-colors ${
                                sortBy === opt.value
                                  ? "bg-himbalin-gold/10 text-himbalin-dark font-bold"
                                  : "text-gray-600 hover:bg-himbalin-beige hover:text-himbalin-dark"
                              }`}
                            >
                              {opt.label}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="container mx-auto px-4 md:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
              {/* Desktop Sidebar */}
              <aside className="hidden lg:block lg:col-span-3 bg-white rounded-2xl p-8 shadow-soft border border-gray-100 sticky top-24">
                <ShopSidebar
                  activeCategory={activeCategory}
                  onCategoryChange={setActiveCategory}
                  activeAvailability={activeAvailability}
                  onAvailabilityToggle={toggleAvailability}
                  activeMaterials={activeMaterials}
                  onMaterialToggle={toggleMaterial}
                  onReset={resetAll}
                  hasActiveFilters={hasActiveFilters}
                  categories={categories}
                />
              </aside>

              {/* Mobile Sidebar Overlay */}
              <AnimatePresence>
                {showMobileFilters && (
                  <>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={() => setShowMobileFilters(false)}
                      className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    />
                    <motion.div
                      initial={{ x: "-100%" }}
                      animate={{ x: 0 }}
                      exit={{ x: "-100%" }}
                      transition={{ type: "tween", duration: 0.3 }}
                      className="fixed inset-y-0 left-0 w-[280px] sm:w-[320px] bg-white shadow-2xl z-50 lg:hidden flex flex-col h-full"
                    >
                      <div className="flex items-center justify-between p-6 border-b border-gray-100">
                        <h2 className="font-serif text-xl font-bold text-himbalin-dark">Filters</h2>
                        <button
                          onClick={() => setShowMobileFilters(false)}
                          className="p-2 bg-gray-50 hover:bg-gray-100 rounded-full text-gray-500 transition-colors"
                        >
                          <FiX size={20} />
                        </button>
                      </div>
                      <div className="flex-1 overflow-y-auto p-6">
                        <ShopSidebar
                          activeCategory={activeCategory}
                          onCategoryChange={setActiveCategory}
                          activeAvailability={activeAvailability}
                          onAvailabilityToggle={toggleAvailability}
                          activeMaterials={activeMaterials}
                          onMaterialToggle={toggleMaterial}
                          onReset={resetAll}
                          hasActiveFilters={hasActiveFilters}
                          categories={categories}
                        />
                      </div>
                      <div className="p-6 border-t border-gray-100">
                        <button
                          onClick={() => setShowMobileFilters(false)}
                          className="w-full bg-himbalin-gold text-himbalin-dark py-3 rounded-full font-bold shadow-soft hover:bg-yellow-500 transition-colors"
                        >
                          Apply Filters
                        </button>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>

              {/* Product Area */}
              <div className="lg:col-span-9">
                {/* Active filter chips */}
                {hasActiveFilters && (
                  <div className="flex flex-wrap gap-2 mb-6">
                    {activeCategory !== "All Products" && (
                      <Chip
                        label={activeCategory}
                        onRemove={() => setActiveCategory("All Products")}
                      />
                    )}
                    {activeMaterials.map((m) => (
                      <Chip key={m} label={m} onRemove={() => toggleMaterial(m)} />
                    ))}
                    {activeAvailability.map((a) => (
                      <Chip
                        key={a}
                        label={a}
                        onRemove={() => toggleAvailability(a)}
                      />
                    ))}
                    <button
                      onClick={resetAll}
                      className="px-3 py-1 rounded-full text-xs font-bold text-red-500 border border-red-200 hover:bg-red-50 transition-colors"
                    >
                      Clear all
                    </button>
                  </div>
                )}

                {/* Result count */}
                <p className="font-sans text-sm text-himbalin-dark/50 mb-6">
                  <span className="font-bold text-himbalin-dark">
                    Showing {paginatedProducts.length}
                  </span>{" "}
                  of {filtered.length} {filtered.length === 1 ? "product" : "products"}
                </p>

                {/* Empty state */}
                {filtered.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-24 bg-white rounded-2xl border border-gray-100"
                  >
                    <p className="text-5xl mb-4">🔍</p>
                    <h3 className="font-serif text-2xl font-bold text-himbalin-dark mb-3">
                      No products found
                    </h3>
                    <p className="font-sans text-himbalin-dark/50 mb-6">
                      Try adjusting your filters
                    </p>
                    <button
                      onClick={resetAll}
                      className="bg-himbalin-gold text-himbalin-dark px-8 py-3 rounded-full font-bold text-sm hover:bg-yellow-500 transition-colors"
                    >
                      Reset Filters
                    </button>
                  </motion.div>
                ) : viewMode === "grid" ? (
                  <motion.div
                    layout
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-16"
                  >
                    <AnimatePresence mode="popLayout">
                      {paginatedProducts.map((product) => (
                        <motion.div
                          key={product.id}
                          layout
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ duration: 0.25 }}
                        >
                          <ProductCard product={product} />
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </motion.div>
                ) : (
                  // List view
                  <div className="flex flex-col gap-4 mb-16">
                    <AnimatePresence mode="popLayout">
                      {paginatedProducts.map((product) => (
                        <motion.div
                          key={product.id}
                          layout
                          initial={{ opacity: 0, x: -16 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -16 }}
                          transition={{ duration: 0.2 }}
                        >
                          <ProductListRow product={product} />
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                )}

                {/* Pagination (only when there is more than 1 page) */}
                {totalPages > 1 && (
                  <div className="flex flex-col items-center gap-6 mt-4 pb-12">
                    <ShopPagination 
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={(page) => {
                        setCurrentPage(page);
                        window.scrollTo({ top: 400, behavior: "smooth" });
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

// ─── Chip ─────────────────────────────────────────────────────────────────────
const Chip = ({ label, onRemove }) => (
  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-himbalin-dark text-himbalin-gold text-xs font-bold">
    {label}
    <button onClick={onRemove} className="hover:text-white transition-colors">
      <FiX size={11} />
    </button>
  </span>
);

// ─── List View Row ────────────────────────────────────────────────────────────
import { useCart } from "../context/CartContext";
import { FiShoppingCart, FiStar, FiCheck, FiMinus, FiPlus, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { useState as useLocalState } from "react";

const ProductListRow = ({ product }) => {
  const { addToCart, isInCart, cartItems, updateQuantity, removeFromCart } = useCart();
  const [toast, setToast] = useLocalState(false);
  const [showModal, setShowModal] = useLocalState(false);
  const [currentImageIndex, setCurrentImageIndex] = useLocalState(0);
  const inCart = isInCart(product.id);
  const cartItem = cartItems.find((item) => item.id === product.id);

  const displayImages = product.images && product.images.length > 0 ? product.images : [product.image].filter(Boolean);

  const handleAdd = () => {
    if (inCart) return;
    addToCart(product);
    setToast(true);
    setTimeout(() => setToast(false), 2000);
  };

  return (
    <>
      <div className="bg-white rounded-2xl p-3 sm:p-5 border border-gray-100 shadow-soft flex gap-3 sm:gap-5 items-start sm:items-center group hover:shadow-hover transition-all duration-300">
        <img
          src={product.image}
          alt={product.name}
          className="w-16 h-16 sm:w-28 sm:h-28 object-cover rounded-xl shrink-0 group-hover:scale-105 transition-transform duration-500 cursor-pointer"
          onClick={() => setShowModal(true)}
        />
        <div className="flex-grow min-w-0 flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Info Area */}
          <div className="min-w-0 flex-grow">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <div className="flex items-center gap-1">
                <FiStar className="text-himbalin-gold fill-himbalin-gold" size={12} />
                <span className="font-sans text-xs font-bold text-himbalin-dark">
                  {product.rating}
                </span>
                <span className="font-sans text-xs text-gray-400">
                  ({product.reviews})
                </span>
              </div>
              {product.badge && (
                <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-himbalin-dark text-himbalin-gold">
                  {product.badge}
                </span>
              )}
            </div>
            <h3 
              onClick={() => setShowModal(true)}
              className="font-serif text-sm sm:text-lg font-bold text-himbalin-dark truncate group-hover:text-himbalin-gold transition-colors cursor-pointer hover:underline"
              title="Click to view details"
            >
              {product.name}
            </h3>
            <p className="font-sans text-[11px] sm:text-xs text-gray-400 mb-1.5 line-clamp-1 sm:line-clamp-none">
              {product.description}
            </p>
            <span className="font-sans text-[9px] sm:text-[10px] uppercase tracking-widest text-himbalin-dark/40 font-bold">
              {product.category}
            </span>
          </div>

          {/* Price & Actions Area */}
          <div className="flex md:flex-col items-center md:items-end justify-between md:justify-start gap-2 shrink-0 w-full md:w-auto pt-2.5 md:pt-0 border-t md:border-t-0 border-gray-100">
            <div>
              <p className="font-serif text-sm sm:text-xl font-black text-himbalin-dark whitespace-nowrap leading-tight">
                {formatPrice(product.price)}
                {product.priceUnit && (
                  <span className="text-[10px] sm:text-[11px] text-gray-400 font-medium ml-0.5">
                    / {product.priceUnit}
                  </span>
                )}
              </p>
              {product.oldPrice && (
                <p className="font-sans text-[11px] text-gray-300 line-through text-left md:text-right">
                  {formatPrice(product.oldPrice)}
                </p>
              )}
            </div>
            {inCart && cartItem ? (
              <div className="flex items-center bg-[#fcfbf9] rounded-full border border-gray-100 p-0.5 shadow-sm shrink-0">
                <button
                  onClick={() => {
                    if (cartItem.quantity === 1) {
                      removeFromCart(product.id);
                    } else {
                      updateQuantity(product.id, -1);
                    }
                  }}
                  className="w-7 h-7 flex items-center justify-center hover:bg-gray-200 rounded-full transition-all text-gray-600"
                >
                  <FiMinus size={11} />
                </button>
                <span className="px-2 text-center font-bold text-xs min-w-[1.2rem] select-none text-himbalin-dark">
                  {cartItem.quantity}
                </span>
                <button
                  onClick={() => updateQuantity(product.id, 1)}
                  className="w-7 h-7 flex items-center justify-center hover:bg-gray-200 rounded-full transition-all text-gray-600"
                >
                  <FiPlus size={11} />
                </button>
              </div>
            ) : (
              <button
                onClick={handleAdd}
                className="flex items-center gap-1.5 px-2.5 py-1.5 sm:px-4 sm:py-2 rounded-full text-[10px] sm:text-xs font-bold transition-all whitespace-nowrap shrink-0 bg-himbalin-gold text-himbalin-dark hover:bg-yellow-500"
              >
                <FiShoppingCart size={12} />
                <span>Add to Cart</span>
              </button>
            )}
          </div>
        </div>
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
                    src={displayImages[currentImageIndex] || "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=800"}
                    alt={product.name || "Product"}
                    className="w-full h-full object-cover"
                  />
                  {displayImages.length > 1 && (
                    <>
                      <div
                        className="absolute inset-y-0 left-0 w-1/3 z-10 cursor-pointer flex items-center justify-start pl-4"
                        onClick={(e) => {
                          e.stopPropagation();
                          setCurrentImageIndex((prev) => (prev === 0 ? displayImages.length - 1 : prev - 1));
                        }}
                      >
                        <div className="w-8 h-8 rounded-full bg-white/70 backdrop-blur-sm flex items-center justify-center text-himbalin-dark shadow-md hover:bg-white transition-colors">
                          <FiChevronLeft size={20} />
                        </div>
                      </div>
                      <div
                        className="absolute inset-y-0 right-0 w-1/3 z-10 cursor-pointer flex items-center justify-end pr-4"
                        onClick={(e) => {
                          e.stopPropagation();
                          setCurrentImageIndex((prev) => (prev === displayImages.length - 1 ? 0 : prev + 1));
                        }}
                      >
                        <div className="w-8 h-8 rounded-full bg-white/70 backdrop-blur-sm flex items-center justify-center text-himbalin-dark shadow-md hover:bg-white transition-colors">
                          <FiChevronRight size={20} />
                        </div>
                      </div>
                      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-20">
                        {displayImages.map((_, i) => (
                          <div
                            key={i}
                            className={`h-1.5 rounded-full transition-all ${
                              i === currentImageIndex ? "w-4 bg-himbalin-gold" : "w-1.5 bg-white/50"
                            }`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                  {product.badge && (
                    <div className="absolute top-4 left-4 z-20">
                      <span
                        className={`px-4 py-1.5 rounded-full font-sans text-[10px] font-black tracking-[0.1em] uppercase ${
                          product.badge.toString().includes("SALE")
                            ? "bg-red-500 text-white"
                            : product.badge.toString().includes("NEW")
                            ? "bg-himbalin-gold text-himbalin-dark"
                            : "bg-himbalin-dark text-white"
                        }`}
                      >
                        {product.badge}
                      </span>
                    </div>
                  )}
                  <button
                    onClick={() => setShowModal(false)}
                    className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center backdrop-blur-sm transition-all focus:outline-none z-20"
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
                        {product.rating ?? 0}
                      </span>
                      <span className="font-sans text-sm text-gray-400">
                        ({product.reviews ?? 0} reviews)
                      </span>
                    </div>

                    <div>
                      {product.stock !== undefined && product.stock > 0 ? (
                        <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                          {product.stock} IN STOCK
                        </span>
                      ) : product.stock === 0 ? (
                        <span className="text-xs font-bold text-red-600 bg-red-50 px-3 py-1 rounded-full border border-red-100">
                          OUT OF STOCK
                        </span>
                      ) : null}
                    </div>
                  </div>

                  {/* Title */}
                  <h2 className="font-serif text-2xl font-bold text-[#2B1A12]">
                    {product.name || "Untitled Product"}
                  </h2>

                  {/* Divider */}
                  <div className="w-16 h-1 bg-[#F4A623] rounded-full" />

                  {/* Description */}
                  <div className="space-y-2">
                    <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                      Narration
                    </h4>
                    <p className="font-sans text-sm text-gray-600 leading-relaxed whitespace-pre-line font-light">
                      {product.description || "No description available."}
                    </p>
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="border-t border-gray-100 p-6 flex items-center justify-between shrink-0 bg-gray-50/50">
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <span className="font-serif text-2xl font-black text-himbalin-dark">
                      {formatPrice(product.price)}
                    </span>
                    {product.priceUnit && (
                      <span className="text-sm text-gray-500 font-medium">
                        / {product.priceUnit}
                      </span>
                    )}
                    {product.oldPrice && (
                      <span className="font-sans text-sm text-gray-300 line-through">
                        {formatPrice(product.oldPrice)}
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
                        handleAdd();
                      }}
                      disabled={product.stock === 0}
                      className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-bold shadow-md transition-all ${
                        inCart
                          ? "bg-green-500 text-white cursor-default"
                          : product.stock === 0
                          ? "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none"
                          : "bg-himbalin-gold text-himbalin-dark hover:bg-orange-500 hover:text-white"
                      }`}
                    >
                      {inCart ? (
                        <>
                          <FiCheck size={14} />
                          <span>In Cart</span>
                        </>
                      ) : product.stock === 0 ? (
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

export default Shop;
