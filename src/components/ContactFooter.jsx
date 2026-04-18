import {
  FaInstagram,
  FaFacebookF,
  FaPinterestP,
  FaGlobe,
} from "react-icons/fa";

const ContactFooter = () => {
  return (
    <footer className="bg-[#4D3227] text-white pt-24 pb-12 px-8">
      <div className="container mx-auto max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 lg:gap-8 border-b border-white/10 pb-20">
          {/* Column 1: Brand Info */}
          <div className="lg:pr-12">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-8 h-8 rounded bg-himbalin-gold flex items-center justify-center">
                <span className="font-serif font-bold text-himbalin-dark text-xl leading-none">
                  H
                </span>
              </div>
              <span className="font-serif text-2xl font-bold tracking-wide">
                Himbalin
              </span>
            </div>
            <p className="font-sans text-xs text-white/60 leading-relaxed mb-8">
              Curating global excellence in furniture and textiles since 1984.
              Elevate your living with our bespoke artisan designs.
            </p>
          </div>

          {/* Column 2: Showrooms */}
          <div>
            <h4 className="font-sans font-black text-[10px] uppercase tracking-[0.3em] mb-10 text-himbalin-gold/80">
              Showrooms
            </h4>
            <ul className="space-y-6 font-sans text-xs text-white/80">
              <li className="hover:text-himbalin-gold transition-colors cursor-pointer">
                Lagos, Nigeria
              </li>
              <li className="hover:text-himbalin-gold transition-colors cursor-pointer">
                Istanbul, Turkey
              </li>
              <li className="hover:text-himbalin-gold transition-colors cursor-pointer text-white/40">
                London, UK (Opening 2024)
              </li>
            </ul>
          </div>

          {/* Column 3: Services */}
          <div>
            <h4 className="font-sans font-black text-[10px] uppercase tracking-[0.3em] mb-10 text-himbalin-gold/80">
              Services
            </h4>
            <ul className="space-y-6 font-sans text-xs text-white/80">
              <li className="hover:text-himbalin-gold transition-colors cursor-pointer">
                Bespoke Furniture
              </li>
              <li className="hover:text-himbalin-gold transition-colors cursor-pointer">
                Interior Styling
              </li>
              <li className="hover:text-himbalin-gold transition-colors cursor-pointer">
                Turkey Rug Sourcing
              </li>
              <li className="hover:text-himbalin-gold transition-colors cursor-pointer">
                Global Delivery
              </li>
            </ul>
          </div>

          {/* Column 4: Social */}
          <div>
            <h4 className="font-sans font-black text-[10px] uppercase tracking-[0.3em] mb-10 text-himbalin-gold/80">
              Follow Us
            </h4>
            <div className="flex gap-4">
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-himbalin-gold hover:text-himbalin-dark transition-all text-sm"
              >
                <FaFacebookF />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-himbalin-gold hover:text-himbalin-dark transition-all text-sm"
              >
                <FaInstagram />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-himbalin-gold hover:text-himbalin-dark transition-all text-sm"
              >
                <FaGlobe />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-12 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="font-sans text-[10px] text-white/40 uppercase tracking-widest">
            © 2023 Himbalin Enterprise. All rights reserved.
          </p>
          <div className="flex gap-10 font-sans text-[10px] text-white/40 uppercase tracking-widest">
            <a href="#" className="hover:text-himbalin-gold transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-himbalin-gold transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default ContactFooter;
