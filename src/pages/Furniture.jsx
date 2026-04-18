import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import ShopSidebar from "../components/ShopSidebar";
import ProductCard from "../components/ProductCard";
import ShopPagination from "../components/ShopPagination";
import Footer from "../components/Footer";
import { FiGrid, FiList, FiChevronDown } from "react-icons/fi";
import PageLoader from "../components/PageLoader";
import { AnimatePresence } from "framer-motion";

const Furniture = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const products = [
    {
      id: 1,
      name: "Mid-Century Sofa",
      description: "Premium fabric, solid wood frame",
      price: 1450.0,
      rating: 4.9,
      reviews: 124,
      image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      badge: "BESTSELLER",
    },
    {
      id: 2,
      name: "Minimalist Dining Table",
      description: "Oak veneer, seats 6",
      price: 890.0,
      rating: 4.8,
      reviews: 89,
      image: "https://images.unsplash.com/photo-1577140917170-285929fb55b7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 3,
      name: "Velvet Lounge Chair",
      description: "Plush velvet, brass legs",
      price: 450.0,
      oldPrice: 550.0,
      rating: 4.7,
      reviews: 67,
      image: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      badge: "SALE",
    },
    {
      id: 4,
      name: "Nordic Coffee Table",
      description: "Round glass top, ash wood base",
      price: 280.0,
      rating: 4.6,
      reviews: 45,
      image: "https://images.unsplash.com/photo-1532372320572-cda25653a26d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 5,
      name: "Modern Platform Bed",
      description: "Upholstered headboard, queen size",
      price: 1100.0,
      rating: 5.0,
      reviews: 112,
      image: "https://images.unsplash.com/photo-1505693314120-0d443867891c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 6,
      name: "Industrial Bookshelf",
      description: "Reclaimed wood, iron pipes",
      price: 380.0,
      rating: 4.8,
      reviews: 54,
      image: "https://images.unsplash.com/photo-1594620302200-9a762244a156?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 7,
      name: "Leather Ottoman",
      description: "Top-grain Italian leather",
      price: 220.0,
      rating: 4.9,
      reviews: 34,
      image: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 8,
      name: "Classic Armoire",
      description: "Solid mahogany, vintage finish",
      price: 1850.0,
      rating: 4.9,
      reviews: 21,
      image: "https://images.unsplash.com/photo-1565538810643-b5bdb714032a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      badge: "NEW",
    },
  ];

  return (
    <>
      <AnimatePresence mode="wait">
        {loading && <PageLoader key="loader" />}
      </AnimatePresence>
      <div className="min-h-screen bg-himbalin-beige antialiased">
        <Navbar />
        <main className="pb-24">
          <div className="relative bg-himbalin-dark text-white pt-16 pb-24 px-4 md:px-8 mb-12 overflow-hidden">
            {/* Background Image with Overlay */}
            <div 
              className="absolute inset-0 z-0 bg-cover bg-center"
              style={{ backgroundImage: "url('/images/cat_furniture.png')" }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-himbalin-dark via-himbalin-dark/80 to-transparent"></div>
            </div>

            <div className="container mx-auto relative z-10">
              <nav className="flex items-center gap-2 text-sm text-white/50 mb-8 font-sans">
                <a href="/" className="hover:text-himbalin-gold transition-colors">Home</a>
                <span className="text-white/20">›</span>
                <span className="text-himbalin-gold font-medium">Furniture</span>
              </nav>
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                  <h1 className="font-serif text-5xl md:text-7xl text-white font-bold mb-4">
                    Furniture Collection
                  </h1>
                  <p className="font-sans text-white/70 text-lg max-w-2xl">
                    Discover luxury, modern, and classic furniture pieces that transform any room.
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
                  <div className="relative group">
                    <button className="flex items-center gap-2 px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm font-medium text-white hover:border-himbalin-gold transition-colors">
                      Sort by: Popularity
                      <FiChevronDown className="text-white/40" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="container mx-auto px-4 md:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
              {/* Sidebar */}
              <aside className="lg:col-span-3 bg-white rounded-2xl p-8 shadow-soft border border-gray-100">
                <ShopSidebar />
              </aside>

              {/* Product Grid */}
              <div className="lg:col-span-9">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                  {products.map((product) => (
                    <ProductCard key={product.id} {...product} />
                  ))}
                </div>

                {/* Pagination */}
                <div className="flex flex-col items-center gap-6 mt-12 pb-12">
                  <ShopPagination />
                  <p className="font-sans text-sm text-gray-400">
                    Showing{" "}
                    <span className="text-himbalin-dark font-medium">1 to 8</span> of{" "}
                    <span className="text-himbalin-dark font-medium">8</span> products
                  </p>
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

export default Furniture;
