import { Link } from "react-router-dom";
import { useSiteSettings } from "../context/SiteSettingsContext";

const AboutNavbar = () => {
  const { settings } = useSiteSettings();
  return (
    <nav className="sticky top-0 z-50 bg-himbalin-dark text-himbalin-beige px-8 py-5 flex items-center justify-between shadow-soft">
      {/* Logo */}
      <div className="flex items-center gap-3">
        {settings?.store_logo ? (
          <img src={settings.store_logo} alt="Logo" className="w-8 h-8 object-contain rounded" />
        ) : (
          <div className="w-8 h-8 rounded bg-himbalin-gold flex items-center justify-center">
            <span className="font-serif font-bold text-himbalin-dark text-xl leading-none">
              H
            </span>
          </div>
        )}
        <Link to="/" className="font-serif text-2xl font-bold tracking-wide">
          Himbalin Enterprise
        </Link>
      </div>

      {/* Navigation Links */}
      <div className="hidden md:flex items-center gap-10 font-sans text-sm font-medium tracking-wide">
        <a href="#" className="hover:text-himbalin-gold transition-colors">
          Collections
        </a>
        <Link to="/about" className="text-himbalin-gold transition-colors">
          Our Story
        </Link>
        <a href="#" className="hover:text-himbalin-gold transition-colors">
          Process
        </a>
        <a href="#" className="hover:text-himbalin-gold transition-colors">
          Contact
        </a>
      </div>

      {/* Right Actions */}
      <div className="flex items-center">
        <button className="bg-himbalin-gold text-himbalin-dark px-6 py-2.5 rounded-sm font-medium text-sm hover:bg-yellow-500 transition-colors shadow-soft hover:shadow-hover">
          Inquire
        </button>
      </div>
    </nav>
  );
};

export default AboutNavbar;
