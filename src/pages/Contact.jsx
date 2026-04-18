import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import ContactHero from "../components/ContactHero";
import ContactFormSection from "../components/ContactFormSection";
import ContactMap from "../components/ContactMap";
import Footer from "../components/Footer";
import PageLoader from "../components/PageLoader";
import { AnimatePresence } from "framer-motion";

const Contact = () => {
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
        <ContactHero />
        <ContactFormSection />
        <ContactMap />
        <Footer />
      </main>
    </>
  );
};

export default Contact;
