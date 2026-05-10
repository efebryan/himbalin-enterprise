import React, { useState, useEffect, useMemo } from "react";
import Navbar from "../components/Navbar";
import ShopSidebar from "../components/ShopSidebar";
import ProductCard from "../components/ProductCard";
import ShopPagination from "../components/ShopPagination";
import Footer from "../components/Footer";
import { FiGrid, FiList, FiChevronDown, FiX } from "react-icons/fi";
import PageLoader from "../components/PageLoader";
import { AnimatePresence, motion } from "framer-motion";
import { getProducts } from "../lib/api";
import { formatPrice } from "../lib/formatCurrency";

const SORT_OPTIONS = [
  { label: "Popularity", value: "popularity" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
  { label: "Highest Rated", value: "rating" },
  { label: "Most Reviewed", value: "reviews" },
];

const PRICE_MAX = 3000000;

// ─── Component ────────────────────────────────────────────────────────────────
const Shop = () => {
  const [loading, setLoading] = useState(true);
  const [allProducts, setAllProducts] = useState([]);

  // Filter state
  const [activeCategory, setActiveCategory] = useState("All Products");
  const [priceRange, setPriceRange] = useState([0, PRICE_MAX]);
  const [activeAvailability, setActiveAvailability] = useState([]);
  const [activeMaterials, setActiveMaterials] = useState([]);
  const [sortBy, setSortBy] = useState("popularity");
  const [viewMode, setViewMode] = useState("grid"); // "grid" | "list"
  const [showSortMenu, setShowSortMenu] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getProducts();
        setAllProducts(data);
      } catch (err) {
        console.error("Failed to load products:", err);
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

    // Price
    list = list.filter(
      (p) => p.price >= priceRange[0] && p.price <= priceRange[1]
    );

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
  }, [allProducts, activeCategory, priceRange, activeAvailability, activeMaterials, sortBy]);

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
    setPriceRange([0, PRICE_MAX]);
    setActiveAvailability([]);
    setActiveMaterials([]);
    setSortBy("popularity");
  };

  const hasActiveFilters =
    activeCategory !== "All Products" ||
    priceRange[0] > 0 ||
    priceRange[1] < PRICE_MAX ||
    activeAvailability.length > 0 ||
    activeMaterials.length > 0;

  const currentSortLabel =
    SORT_OPTIONS.find((o) => o.value === sortBy)?.label ?? "Popularity";

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
                <div className="flex items-center gap-4">
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
              {/* Sidebar */}
              <aside className="lg:col-span-3 bg-white rounded-2xl p-8 shadow-soft border border-gray-100 sticky top-24">
                <ShopSidebar
                  activeCategory={activeCategory}
                  onCategoryChange={setActiveCategory}
                  priceRange={priceRange}
                  maxPrice={PRICE_MAX}
                  onPriceChange={setPriceRange}
                  activeAvailability={activeAvailability}
                  onAvailabilityToggle={toggleAvailability}
                  activeMaterials={activeMaterials}
                  onMaterialToggle={toggleMaterial}
                  onReset={resetAll}
                  hasActiveFilters={hasActiveFilters}
                />
              </aside>

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
                    {(priceRange[0] > 0 || priceRange[1] < PRICE_MAX) && (
                      <Chip
                        label={`${formatPrice(priceRange[0])} – ${formatPrice(priceRange[1])}`}
                        onRemove={() => setPriceRange([0, PRICE_MAX])}
                      />
                    )}
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
                    {filtered.length}
                  </span>{" "}
                  {filtered.length === 1 ? "product" : "products"} found
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
                    <AnimatePresence>
                      {filtered.map((product) => (
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
                    <AnimatePresence>
                      {filtered.map((product) => (
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

                {/* Pagination (only when there are results) */}
                {filtered.length > 0 && (
                  <div className="flex flex-col items-center gap-6 mt-4 pb-12">
                    <ShopPagination />
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
import { FiShoppingCart, FiStar, FiCheck } from "react-icons/fi";
import { useState as useLocalState } from "react";

const ProductListRow = ({ product }) => {
  const { addToCart, isInCart } = useCart();
  const [toast, setToast] = useLocalState(false);
  const inCart = isInCart(product.id);

  const handleAdd = () => {
    if (inCart) return;
    addToCart(product);
    setToast(true);
    setTimeout(() => setToast(false), 2000);
  };

  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-soft flex gap-5 items-center group hover:shadow-hover transition-all duration-300">
      <img
        src={product.image}
        alt={product.name}
        className="w-24 h-24 object-cover rounded-xl shrink-0 group-hover:scale-105 transition-transform duration-500"
      />
      <div className="flex-grow min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <FiStar className="text-himbalin-gold fill-himbalin-gold" size={12} />
          <span className="font-sans text-xs font-bold text-himbalin-dark">
            {product.rating}
          </span>
          <span className="font-sans text-xs text-gray-400">
            ({product.reviews})
          </span>
          {product.badge && (
            <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-himbalin-dark text-himbalin-gold">
              {product.badge}
            </span>
          )}
        </div>
        <h3 className="font-serif text-lg font-bold text-himbalin-dark truncate group-hover:text-himbalin-gold transition-colors">
          {product.name}
        </h3>
        <p className="font-sans text-xs text-gray-400 mb-2">{product.description}</p>
        <span className="font-sans text-[10px] uppercase tracking-widest text-himbalin-dark/40 font-bold">
          {product.category}
        </span>
      </div>
      <div className="flex flex-col items-end gap-3 shrink-0">
        <div>
          <p className="font-serif text-xl font-black text-himbalin-dark">
            {formatPrice(product.price)}
          </p>
          {product.oldPrice && (
            <p className="font-sans text-xs text-gray-300 line-through text-right">
              {formatPrice(product.oldPrice)}
            </p>
          )}
        </div>
        <button
          onClick={handleAdd}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all ${
            inCart
              ? "bg-green-500 text-white cursor-default"
              : "bg-himbalin-gold text-himbalin-dark hover:bg-yellow-500"
          }`}
        >
          {inCart ? <FiCheck size={13} /> : <FiShoppingCart size={13} />}
          {inCart ? "In Cart" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
};

export default Shop;
