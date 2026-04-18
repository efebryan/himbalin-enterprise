import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import AboutHero from "../components/AboutHero";
import OurStory from "../components/OurStory";
import Values from "../components/Values";
import FounderNote from "../components/FounderNote";
import Process from "../components/Process";
import Footer from "../components/Footer";
import PageLoader from "../components/PageLoader";
import { AnimatePresence } from "framer-motion";

const About = () => {
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
        <AboutHero />
        <OurStory />
        <Values />
        <FounderNote />
        <Process />
        <Footer />
      </main>
    </>
  );
};

export default About;
