import { FiArrowRight } from "react-icons/fi";

const AboutFooter = () => {
  return (
    <footer className="bg-[#1A100B] text-himbalin-beige pt-20 pb-8 px-8 border-t border-himbalin-beige/10">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
          {/* Column 1: Brand */}
          <div className="lg:pr-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded bg-himbalin-gold flex items-center justify-center">
                <span className="font-serif font-bold text-himbalin-dark text-xl leading-none">
                  H
                </span>
              </div>
              <span className="font-serif text-2xl font-bold tracking-wide text-white">
                Himbalin
              </span>
            </div>
            <p className="font-sans text-himbalin-beige/70 text-sm leading-relaxed mb-8">
              Defining luxury interiors since 1985. Crafting stories in wood and
              fabric for global homes.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="font-serif text-lg font-bold mb-6 text-white">
              Quick Links
            </h4>
            <ul className="space-y-4 font-sans text-sm text-himbalin-beige/70">
              <li>
                <a
                  href="#"
                  className="hover:text-himbalin-gold transition-colors block"
                >
                  Our Story
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-himbalin-gold transition-colors block"
                >
                  Collections
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-himbalin-gold transition-colors block"
                >
                  Care Guide
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-himbalin-gold transition-colors block"
                >
                  Sustainability
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Services */}
          <div>
            <h4 className="font-serif text-lg font-bold mb-6 text-white">
              Services
            </h4>
            <ul className="space-y-4 font-sans text-sm text-himbalin-beige/70">
              <li>
                <a
                  href="#"
                  className="hover:text-himbalin-gold transition-colors block"
                >
                  Custom Commissions
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-himbalin-gold transition-colors block"
                >
                  Interior Consulting
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-himbalin-gold transition-colors block"
                >
                  Shipping & Returns
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-himbalin-gold transition-colors block"
                >
                  Showroom Booking
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div>
            <h4 className="font-serif text-lg font-bold mb-6 text-white">
              Newsletter
            </h4>
            <p className="font-sans text-xs text-himbalin-beige/70 leading-relaxed mb-4">
              Join our inner circle for exclusive previews.
            </p>
            <form className="relative">
              <input
                type="email"
                placeholder="Email address"
                className="w-full bg-white/5 border border-white/10 rounded-full py-3 px-5 text-sm text-white focus:outline-none focus:border-himbalin-gold transition-colors"
                required
              />
              <button
                type="submit"
                className="absolute right-1 top-1 bottom-1 bg-himbalin-gold text-himbalin-dark rounded-full w-10 flex items-center justify-center hover:bg-yellow-500 transition-colors"
              >
                <FiArrowRight />
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-himbalin-beige/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-sans text-xs text-himbalin-beige/50">
            &copy; {new Date().getFullYear()} Himbalin Enterprise. All rights
            reserved.
          </p>
          <div className="flex gap-6 font-sans text-xs text-himbalin-beige/70">
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

export default AboutFooter;
