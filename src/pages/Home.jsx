import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Categories from "../components/Categories";
import BestSelling from "../components/BestSelling";
import WhyChoose from "../components/WhyChoose";
import Testimonials from "../components/Testimonials";
import Subscribe from "../components/Subscribe";
import Footer from "../components/Footer";
import PageLoader from "../components/PageLoader";
import { AnimatePresence } from "framer-motion";

const Home = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <AnimatePresence mode="wait">
        {loading && <PageLoader key="loader" />}
      </AnimatePresence>
      <main className="min-h-screen bg-himbalin-beige selection:bg-himbalin-gold selection:text-himbalin-dark antialiased">
        <Navbar />
        <Hero />
        <Categories />
        <BestSelling />
        <WhyChoose />
        <Testimonials />
        <Subscribe />
        <Footer />
      </main>
    </>
  );
};

export default Home;
