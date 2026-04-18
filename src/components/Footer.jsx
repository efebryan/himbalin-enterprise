import { FiInstagram, FiFacebook, FiTwitter } from "react-icons/fi";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-[#1A100B] text-himbalin-beige pt-20 pb-8 px-8 border-t border-himbalin-beige/10">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
          {/* Column 1: Brand */}
          <div className="lg:pr-8">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded bg-himbalin-gold flex items-center justify-center">
                <span className="font-serif font-bold text-himbalin-dark text-xl leading-none">
                  H
                </span>
              </div>
              <span className="font-serif text-2xl font-bold tracking-wide">
                Himbalin
              </span>
            </div>
            <p className="font-sans text-himbalin-beige/70 text-sm leading-relaxed mb-8">
              Curating luxury interiors and timeless furniture for the
              discerning homeowner. Transforming spaces into experiences since
              2012.
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-himbalin-gold hover:text-himbalin-dark hover:border-himbalin-gold transition-all"
              >
                <FiInstagram />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-himbalin-gold hover:text-himbalin-dark hover:border-himbalin-gold transition-all"
              >
                <FiFacebook />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-himbalin-gold hover:text-himbalin-dark hover:border-himbalin-gold transition-all"
              >
                <FiTwitter />
              </a>
            </div>
          </div>

          {/* Column 2: Collections */}
          <div>
            <h4 className="font-serif text-lg font-bold mb-6 text-white">
              Collections
            </h4>
            <ul className="space-y-4 font-sans text-sm text-himbalin-beige/70">
              <li>
                <Link
                  to="/furniture"
                  className="hover:text-himbalin-gold transition-colors block"
                >
                  Furniture
                </Link>
              </li>
              <li>
                <Link
                  to="/office"
                  className="hover:text-himbalin-gold transition-colors block"
                >
                  Executive Office
                </Link>
              </li>
              <li>
                <Link
                  to="/rugs"
                  className="hover:text-himbalin-gold transition-colors block"
                >
                  Luxury Rugs
                </Link>
              </li>
              <li>
                <Link
                  to="/artificial-grass"
                  className="hover:text-himbalin-gold transition-colors block"
                >
                  Artificial Grass
                </Link>
              </li>
              <li>
                <Link
                  to="/shop"
                  className="hover:text-himbalin-gold transition-colors block"
                >
                  All Products
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Company */}
          <div>
            <h4 className="font-serif text-lg font-bold mb-6 text-white">
              Company
            </h4>
            <ul className="space-y-4 font-sans text-sm text-himbalin-beige/70">
              <li>
                <Link
                  to="/about"
                  className="hover:text-himbalin-gold transition-colors block"
                >
                  Our Story
                </Link>
              </li>
              <li>
                <Link
                  to="/consulting"
                  className="hover:text-himbalin-gold transition-colors block"
                >
                  Consulting Services
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="hover:text-himbalin-gold transition-colors block"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  to="/cart"
                  className="hover:text-himbalin-gold transition-colors block"
                >
                  Shopping Cart
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Location */}
          <div>
            <h4 className="font-serif text-lg font-bold mb-6 text-white">
              Our Location
            </h4>
            <div className="bg-white/5 p-1 rounded-xl mb-4 border border-white/10 relative h-24 overflow-hidden group">
              {/* Map background */}
              <div
                className="absolute inset-0 bg-cover bg-center opacity-60 group-hover:opacity-80 transition-opacity"
                style={{
                  backgroundImage: "url('/images/contact_map_static_istanbul.png')",
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-himbalin-gold text-3xl drop-shadow-md">
                  📍
                </div>
              </div>
            </div>
            <p className="font-sans text-sm text-himbalin-beige/70 leading-relaxed mb-2">
              12 Victoria Island Crescent,
              <br />
              Lagos, Nigeria
            </p>
            <p className="font-sans text-sm text-himbalin-beige/50 leading-relaxed mb-6">
              Levent Loft, Büyükdere Cd. No:201,
              <br />
              İstanbul, Turkey
            </p>
            <a
              href="mailto:contact@himbalin.com"
              className="font-serif text-himbalin-gold hover:text-white transition-colors"
            >
              contact@himbalin.com
            </a>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-himbalin-beige/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-sans text-xs text-himbalin-beige/50">
            &copy; {new Date().getFullYear()} Himbalin Enterprises. All rights
            reserved.
          </p>
          <div className="flex gap-6 font-sans text-xs text-himbalin-beige/70">
            <a href="#" className="hover:text-himbalin-gold transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-himbalin-gold transition-colors">
              Terms of Service
            </a>
            <a href="#" className="hover:text-himbalin-gold transition-colors">
              Shipping &amp; Returns
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
