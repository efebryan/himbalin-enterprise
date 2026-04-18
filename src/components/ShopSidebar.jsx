import { useState } from "react";
import { FiChevronDown, FiFilter, FiRotateCcw } from "react-icons/fi";

const CATEGORIES = [
  "All Products",
  "Furniture",
  "Home Decor",
  "Floor & Outdoor",
];

const MATERIALS = ["Oak", "Ceramic", "Linen", "Brass"];
const AVAILABILITY_OPTIONS = ["In Stock", "Express Delivery"];
const PRICE_MIN = 0;

// Collapsible section wrapper
const Section = ({ title, children, defaultOpen = true }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center justify-between w-full mb-5 group"
      >
        <h4 className="font-sans font-bold text-sm text-himbalin-dark">
          {title}
        </h4>
        <FiChevronDown
          className={`text-gray-400 group-hover:text-himbalin-dark transition-all ${
            open ? "rotate-0" : "-rotate-90"
          }`}
        />
      </button>
      {open && children}
    </div>
  );
};

const ShopSidebar = ({
  activeCategory,
  onCategoryChange,
  priceRange,
  maxPrice,
  onPriceChange,
  activeAvailability,
  onAvailabilityToggle,
  activeMaterials,
  onMaterialToggle,
  onReset,
  hasActiveFilters,
}) => {
  // Local slider dragging state
  const handleMinSlider = (e) => {
    const val = Number(e.target.value);
    if (val < priceRange[1]) onPriceChange([val, priceRange[1]]);
  };

  const handleMaxSlider = (e) => {
    const val = Number(e.target.value);
    if (val > priceRange[0]) onPriceChange([priceRange[0], val]);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-himbalin-dark">
          <FiFilter className="text-himbalin-gold" />
          <h3 className="font-sans font-black text-xs uppercase tracking-[0.2em]">
            Filters
          </h3>
        </div>
        {hasActiveFilters && (
          <button
            onClick={onReset}
            className="flex items-center gap-1 text-[10px] font-bold text-himbalin-gold hover:text-himbalin-dark transition-colors uppercase tracking-wide"
          >
            <FiRotateCcw size={10} />
            Reset
          </button>
        )}
      </div>

      <div className="w-full h-px bg-gray-100" />

      {/* ── Categories ── */}
      <Section title="Categories">
        <div className="space-y-2.5">
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                <div
                  onClick={() => onCategoryChange(cat)}
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all shrink-0 ${
                    isActive
                      ? "border-himbalin-gold bg-himbalin-gold"
                      : "border-gray-200 group-hover:border-himbalin-gold"
                  }`}
                >
                  {isActive && (
                    <div className="w-2 h-2 rounded-full bg-himbalin-dark" />
                  )}
                </div>
                <span
                  onClick={() => onCategoryChange(cat)}
                  className={`font-sans text-sm transition-colors ${
                    isActive
                      ? "text-himbalin-dark font-semibold"
                      : "text-gray-500 group-hover:text-himbalin-dark"
                  }`}
                >
                  {cat}
                </span>
              </label>
            );
          })}
        </div>
      </Section>

      <div className="w-full h-px bg-gray-100" />

      {/* ── Price Range ── */}
      <Section title="Price Range">
        <div className="space-y-4">
          {/* Display */}
          <div className="flex justify-between items-center">
            <span className="font-sans text-xs font-bold text-himbalin-dark bg-himbalin-beige px-3 py-1.5 rounded-lg">
              ${priceRange[0]}
            </span>
            <span className="font-sans text-xs text-gray-400">to</span>
            <span className="font-sans text-xs font-bold text-himbalin-dark bg-himbalin-beige px-3 py-1.5 rounded-lg">
              {priceRange[1] >= maxPrice ? `$${maxPrice}+` : `$${priceRange[1]}`}
            </span>
          </div>

          {/* Track */}
          <div className="relative h-6 flex items-center">
            {/* Background track */}
            <div className="absolute w-full h-1.5 bg-gray-100 rounded-full" />
            {/* Active range fill */}
            <div
              className="absolute h-1.5 bg-himbalin-gold rounded-full"
              style={{
                left: `${(priceRange[0] / maxPrice) * 100}%`,
                right: `${100 - (priceRange[1] / maxPrice) * 100}%`,
              }}
            />
            {/* Min slider */}
            <input
              type="range"
              min={PRICE_MIN}
              max={maxPrice}
              step={10}
              value={priceRange[0]}
              onChange={handleMinSlider}
              className="absolute w-full h-1.5 opacity-0 cursor-pointer z-20"
            />
            {/* Max slider (layered on top) */}
            <input
              type="range"
              min={PRICE_MIN}
              max={maxPrice}
              step={10}
              value={priceRange[1]}
              onChange={handleMaxSlider}
              className="absolute w-full h-1.5 opacity-0 cursor-pointer z-20"
            />
            {/* Thumb: min */}
            <div
              className="absolute w-4 h-4 bg-white border-2 border-himbalin-gold rounded-full shadow-md z-10 pointer-events-none"
              style={{ left: `calc(${(priceRange[0] / maxPrice) * 100}% - 8px)` }}
            />
            {/* Thumb: max */}
            <div
              className="absolute w-4 h-4 bg-white border-2 border-himbalin-gold rounded-full shadow-md z-10 pointer-events-none"
              style={{ left: `calc(${(priceRange[1] / maxPrice) * 100}% - 8px)` }}
            />
          </div>

          <div className="flex justify-between text-[10px] font-sans font-bold text-gray-300 uppercase tracking-widest">
            <span>$0</span>
            <span>${maxPrice}+</span>
          </div>
        </div>
      </Section>

      <div className="w-full h-px bg-gray-100" />

      {/* ── Availability ── */}
      <Section title="Availability">
        <div className="space-y-2.5">
          {AVAILABILITY_OPTIONS.map((opt) => {
            const isActive = activeAvailability.includes(opt);
            return (
              <label key={opt} className="flex items-center gap-3 cursor-pointer group">
                <div
                  onClick={() => onAvailabilityToggle(opt)}
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all shrink-0 ${
                    isActive
                      ? "border-himbalin-gold bg-himbalin-gold"
                      : "border-gray-200 group-hover:border-himbalin-gold"
                  }`}
                >
                  {isActive && (
                    <svg
                      className="w-3 h-3 text-himbalin-dark"
                      fill="none"
                      viewBox="0 0 12 12"
                      stroke="currentColor"
                      strokeWidth={2.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2 6l3 3 5-5"
                      />
                    </svg>
                  )}
                </div>
                <span
                  onClick={() => onAvailabilityToggle(opt)}
                  className={`font-sans text-sm transition-colors ${
                    isActive
                      ? "text-himbalin-dark font-semibold"
                      : "text-gray-500 group-hover:text-himbalin-dark"
                  }`}
                >
                  {opt}
                </span>
              </label>
            );
          })}
        </div>
      </Section>

      <div className="w-full h-px bg-gray-100" />

      {/* ── Material (choice chips) ── */}
      <Section title="Material">
        <div className="flex flex-wrap gap-2">
          {MATERIALS.map((mat) => {
            const isActive = activeMaterials.includes(mat);
            return (
              <button
                key={mat}
                onClick={() => onMaterialToggle(mat)}
                className={`px-4 py-2 rounded-full font-sans text-xs font-semibold border transition-all ${
                  isActive
                    ? "border-himbalin-gold bg-himbalin-gold text-himbalin-dark shadow-soft"
                    : "border-gray-200 text-gray-500 hover:border-himbalin-gold hover:bg-himbalin-beige hover:text-himbalin-dark"
                }`}
              >
                {mat}
              </button>
            );
          })}
        </div>
      </Section>
    </div>
  );
};

export default ShopSidebar;
