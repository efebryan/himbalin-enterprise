import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import ProductCard from "../components/ProductCard";
import Footer from "../components/Footer";
import { FiGrid, FiList } from "react-icons/fi";
import PageLoader from "../components/PageLoader";
import { AnimatePresence } from "framer-motion";
import { getProducts } from "../lib/api";

const Rugs = () => {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getProducts({ category: "Rugs" });
        setProducts(data);
      } catch (err) {
        console.error("Failed to load rugs products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <>
      <AnimatePresence mode="wait">
        {loading && <PageLoader key="loader" />}
      </AnimatePresence>
      <div className="min-h-screen bg-himbalin-beige antialiased">
        <Navbar />
        <main className="pb-24">
          <div className="relative bg-himbalin-dark text-white pt-16 pb-24 px-4 md:px-8 mb-12 overflow-hidden">
            <div 
              className="absolute inset-0 z-0 bg-cover bg-center"
              style={{ backgroundImage: "url('/images/cat_rugs.png')" }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-himbalin-dark via-himbalin-dark/80 to-transparent"></div>
            </div>

            <div className="container mx-auto relative z-10">
              <nav className="flex items-center gap-2 text-sm text-white/50 mb-8 font-sans">
                <a href="/" className="hover:text-himbalin-gold transition-colors">Home</a>
                <span className="text-white/20">›</span>
                <span className="text-himbalin-gold font-medium">Rugs Collection</span>
              </nav>
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                  <h1 className="font-serif text-5xl md:text-7xl text-white font-bold mb-4">
                    Exquisite Rugs Collection
                  </h1>
                  <p className="font-sans text-white/70 text-lg max-w-2xl">
                    Elevate your space with our curated selection of premium rugs. Discover unique textures and timeless designs.
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex bg-white/5 rounded-lg border border-white/10 p-1">
                    <button className="p-2 text-himbalin-gold bg-white/10 rounded-md transition-colors">
                      <FiGrid size={20} />
                    </button>
                    <button className="p-2 text-white/40 hover:text-white transition-colors">
                      <FiList size={20} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="container mx-auto px-4 md:px-8">
            {products.length === 0 && !loading ? (
              <div className="text-center py-24">
                <p className="text-gray-400 font-medium">No rugs found.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-16">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}

            {products.length > 0 && (
              <div className="flex flex-col items-center gap-6 pb-12">
                <p className="font-sans text-sm text-gray-400">
                  Showing{" "}
                  <span className="text-himbalin-dark font-medium">{products.length}</span> rugs
                </p>
              </div>
            )}
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Rugs;
