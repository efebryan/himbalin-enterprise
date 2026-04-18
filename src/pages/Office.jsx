import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import ShopSidebar from "../components/ShopSidebar";
import ProductCard from "../components/ProductCard";
import ShopPagination from "../components/ShopPagination";
import Footer from "../components/Footer";
import { FiGrid, FiList, FiChevronDown } from "react-icons/fi";
import PageLoader from "../components/PageLoader";
import { AnimatePresence } from "framer-motion";

const Office = () => {
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
      name: "Ergonomic Mesh Chair",
      description: "Lumbar support, adjustable arms",
      price: 350.0,
      rating: 4.8,
      reviews: 215,
      image: "https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      badge: "POPULAR",
    },
    {
      id: 2,
      name: "Executive Wooden Desk",
      description: "Walnut finish, built-in storage",
      price: 890.0,
      rating: 4.9,
      reviews: 64,
      image: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 3,
      name: "Adjustable Standing Desk",
      description: "Dual motor, programmable height",
      price: 599.0,
      rating: 4.7,
      reviews: 142,
      image: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 4,
      name: "Modern Task Lamp",
      description: "LED, color temperature control",
      price: 85.0,
      rating: 4.6,
      reviews: 88,
      image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 5,
      name: "Filing Cabinet",
      description: "Steel construction, 3 drawers",
      price: 180.0,
      rating: 4.5,
      reviews: 32,
      image: "https://images.unsplash.com/photo-1558487661-9d4f01e2ad64?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 6,
      name: "Conference Table",
      description: "Seats 8, power modules included",
      price: 1250.0,
      rating: 5.0,
      reviews: 12,
      image: "https://images.unsplash.com/photo-1497215848136-c56b5efb6562?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 7,
      name: "Leather Executive Chair",
      description: "Premium leather, massaging feature",
      price: 650.0,
      rating: 4.9,
      reviews: 74,
      image: "https://images.unsplash.com/photo-1580480055273-228ff5388ef8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      badge: "PREMIUM",
    },
    {
      id: 8,
      name: "Acoustic Room Divider",
      description: "Sound absorbing felt panels",
      price: 420.0,
      rating: 4.7,
      reviews: 45,
      image: "https://images.unsplash.com/photo-1600607688969-a5bfcd64bd40?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
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
              style={{ backgroundImage: "url('/images/cat_office.png')" }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-himbalin-dark via-himbalin-dark/80 to-transparent"></div>
            </div>

            <div className="container mx-auto relative z-10">
              <nav className="flex items-center gap-2 text-sm text-white/50 mb-8 font-sans">
                <a href="/" className="hover:text-himbalin-gold transition-colors">Home</a>
                <span className="text-white/20">›</span>
                <span className="text-himbalin-gold font-medium">Office Setup</span>
              </nav>
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                  <h1 className="font-serif text-5xl md:text-7xl text-white font-bold mb-4">
                    Office Setup
                  </h1>
                  <p className="font-sans text-white/70 text-lg max-w-2xl">
                    Create the perfect workspace with our professional and ergonomic office collection.
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

export default Office;
