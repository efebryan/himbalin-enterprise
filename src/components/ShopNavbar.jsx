import { FiShoppingCart, FiSearch, FiUser } from "react-icons/fi";
import { Link } from "react-router-dom";
import { useSiteSettings } from "../context/SiteSettingsContext";

const ShopNavbar = () => {
  const { settings } = useSiteSettings();
  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 px-8 py-4 flex items-center justify-between">
      {/* Brand */}
      <div>
        {settings?.store_logo ? (
          <Link to="/" className="flex items-center">
            <img src={settings.store_logo} alt="Logo" className="h-8 sm:h-10 w-auto max-w-full object-contain" />
          </Link>
        ) : (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-himbalin-gold flex items-center justify-center shrink-0">
              <span className="font-serif font-bold text-himbalin-dark text-xl leading-none">
                H
              </span>
            </div>
            <Link
              to="/"
              className="font-serif text-xl font-bold tracking-tight text-himbalin-dark"
            >
              Himbalin Enterprise
            </Link>
          </div>
        )}
      </div>

      {/* Primary Links */}
      <div className="hidden lg:flex items-center gap-8 font-sans text-sm font-medium text-gray-600">
        <Link
          to="/shop"
          className="text-himbalin-dark font-bold border-b-2 border-himbalin-gold pb-1 transition-all"
        >
          Shop
        </Link>
        <a href="#" className="hover:text-himbalin-dark transition-colors">
          Collections
        </a>
        <Link
          to="/about"
          className="hover:text-himbalin-dark transition-colors"
        >
          About
        </Link>
        <Link
          to="/contact"
          className="hover:text-himbalin-dark transition-colors"
        >
          Contact
        </Link>
      </div>

      {/* Search Bar */}
      <div className="hidden md:flex flex-1 max-w-md mx-8 relative">
        <input
          type="text"
          placeholder="Search products..."
          className="w-full bg-gray-100/50 border-none rounded-2xl py-2.5 px-5 pl-12 text-sm text-gray-700 focus:bg-white focus:ring-1 focus:ring-himbalin-gold/20 transition-all outline-none"
        />
        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
      </div>

      {/* User Actions */}
      <div className="flex items-center gap-6">
        <button className="relative p-2 text-gray-700 hover:text-himbalin-gold transition-colors">
          <FiShoppingCart size={22} />
          <span className="absolute top-0 right-0 w-4 h-4 bg-himbalin-gold text-himbalin-dark text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white">
            3
          </span>
        </button>
        <button className="p-2 text-gray-700 hover:text-himbalin-gold transition-colors hidden sm:block">
          <FiUser size={22} />
        </button>
        <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-himbalin-gold/20 hover:border-himbalin-gold transition-all cursor-pointer">
          <img
            src="/images/portrait_sarah_jenkins.png"
            alt="User Avatar"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </nav>
  );
};

export default ShopNavbar;
