import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import ShopSidebar from "../components/ShopSidebar";
import ProductCard from "../components/ProductCard";
import ShopPagination from "../components/ShopPagination";
import Footer from "../components/Footer";
import { FiGrid, FiList, FiChevronDown } from "react-icons/fi";
import PageLoader from "../components/PageLoader";
import { AnimatePresence } from "framer-motion";

const ArtificialGrass = () => {
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
      name: "Premium Landscape Turf",
      description: "High density, realistic soft touch",
      price: 12.0,
      rating: 4.9,
      reviews: 312,
      image: "https://images.unsplash.com/photo-1596788062829-41d3ceec2f9d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      badge: "POPULAR",
    },
    {
      id: 2,
      name: "Pro Putting Green",
      description: "Golf-grade short pile turf",
      price: 18.0,
      rating: 4.8,
      reviews: 145,
      image: "https://images.unsplash.com/photo-1587327903256-2265e709b5eb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 3,
      name: "Pet-Friendly Grass",
      description: "Max drainage, odor-resistant",
      price: 15.0,
      rating: 4.7,
      reviews: 456,
      image: "https://images.unsplash.com/photo-1599839619722-39751411ea63?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      badge: "DURABLE",
    },
    {
      id: 4,
      name: "Balcony Turf Runner",
      description: "Pre-cut, bright spring green",
      price: 45.0,
      rating: 4.6,
      reviews: 89,
      image: "https://images.unsplash.com/photo-1558904541-efa843a96f0f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 5,
      name: "Natural Blend Fescue",
      description: "Brown thatch for realism",
      price: 14.0,
      rating: 4.9,
      reviews: 231,
      image: "https://images.unsplash.com/photo-1626300803450-482def4f5358?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      badge: "NATURAL LOOK",
    },
    {
      id: 6,
      name: "Heavy Duty Commercial",
      description: "High foot traffic resistance",
      price: 22.0,
      rating: 5.0,
      reviews: 67,
      image: "https://images.unsplash.com/photo-1628108155940-59dd555f2648?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 7,
      name: "Indoor Green Mat",
      description: "Soft backing, anti-slip",
      price: 35.0,
      rating: 4.5,
      reviews: 112,
      image: "https://images.unsplash.com/photo-1588611135241-118f6d7abafb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 8,
      name: "Multi-Sport Floor Grass",
      description: "Tough medium pile, impact absorbing",
      price: 26.0,
      rating: 4.8,
      reviews: 84,
      image: "https://images.unsplash.com/photo-1601267812833-2bf9fcd9ad87?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
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
              style={{ backgroundImage: "url('/images/cat_grass.png')" }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-himbalin-dark via-himbalin-dark/80 to-transparent"></div>
            </div>

            <div className="container mx-auto relative z-10">
              <nav className="flex items-center gap-2 text-sm text-white/50 mb-8 font-sans">
                <a href="/" className="hover:text-himbalin-gold transition-colors">Home</a>
                <span className="text-white/20">›</span>
                <span className="text-himbalin-gold font-medium">Artificial Grass</span>
              </nav>
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                  <h1 className="font-serif text-5xl md:text-7xl text-white font-bold mb-4">
                    Artificial Grass
                  </h1>
                  <p className="font-sans text-white/70 text-lg max-w-2xl">
                    Evergreen, low-maintenance turf solutions for residential and commercial landscapes. Prices per sq. meter.
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

export default ArtificialGrass;
