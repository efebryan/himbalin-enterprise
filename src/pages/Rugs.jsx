import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import ShopSidebar from "../components/ShopSidebar";
import ProductCard from "../components/ProductCard";
import ShopPagination from "../components/ShopPagination";
import Footer from "../components/Footer";
import { FiGrid, FiList, FiChevronDown } from "react-icons/fi";
import PageLoader from "../components/PageLoader";
import { AnimatePresence } from "framer-motion";

const Rugs = () => {
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
      name: "Persian Vintage Rug",
      description: "Hand-knotted wool, intricate patterns",
      price: 1200.0,
      rating: 4.9,
      reviews: 84,
      image:
        "https://images.unsplash.com/photo-1590124231662-7901da37ebda?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      badge: "NEW ARRIVAL",
    },
    {
      id: 2,
      name: "Modern Geometric Runner",
      description: "Soft plush, contemporary design",
      price: 250.0,
      rating: 4.7,
      reviews: 125,
      image:
        "https://images.unsplash.com/photo-1596482188201-ed6ae9ce14e9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 3,
      name: "Natural Jute Area Rug",
      description: "Eco-friendly natural fibers",
      price: 180.0,
      oldPrice: 220.0,
      rating: 4.6,
      reviews: 45,
      image:
        "https://images.unsplash.com/photo-1581577782352-78d227b4b1a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      badge: "SALE -18%",
    },
    {
      id: 4,
      name: "Minimalist Shag Rug",
      description: "Ultra-soft deep pile comfort",
      price: 340.0,
      rating: 5.0,
      reviews: 56,
      image:
        "https://images.unsplash.com/photo-1582582621959-48d27397dc69?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 5,
      name: "Bohemian Woven Kilim",
      description: "Vibrant colors, flat weave",
      price: 290.0,
      rating: 4.8,
      reviews: 112,
      image:
        "https://images.unsplash.com/photo-1600166898405-da9535204843?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 6,
      name: "Abstract Splash Rug",
      description: "Artistic multi-color blend",
      price: 450.0,
      rating: 4.9,
      reviews: 34,
      image:
        "https://images.unsplash.com/photo-1598928308491-a270fc9de3e8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 7,
      name: "Classic Oriental Rug",
      description: "Timeless floral motifs",
      price: 890.0,
      rating: 4.8,
      reviews: 67,
      image:
        "https://images.unsplash.com/photo-1528659556885-356bc02976dc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 8,
      name: "Luxury Silk Blend Rug",
      description: "Iridescent finish, elegant feel",
      price: 1550.0,
      rating: 5.0,
      reviews: 21,
      image:
        "https://images.unsplash.com/photo-1534889156217-d643df14f14a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      badge: "LIMITED EDITION",
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
          {/* Breadcrumbs & Header Section */}
          <div className="relative bg-himbalin-dark text-white pt-16 pb-24 px-4 md:px-8 mb-12 overflow-hidden">
            {/* Background Image with Overlay */}
            <div 
              className="absolute inset-0 z-0 bg-cover bg-center"
              style={{ backgroundImage: "url('/images/cat_rugs.png')" }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-himbalin-dark via-himbalin-dark/80 to-transparent"></div>
            </div>

            <div className="container mx-auto relative z-10">
              {/* Breadcrumbs */}
              <nav className="flex items-center gap-2 text-sm text-white/50 mb-8 font-sans">
                <a
                  href="/"
                  className="hover:text-himbalin-gold transition-colors"
                >
                  Home
                </a>
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
                    <span className="text-himbalin-dark font-medium">8</span> rugs
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

export default Rugs;
