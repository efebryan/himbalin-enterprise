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
  activeAvailability,
  onAvailabilityToggle,
  activeMaterials,
  onMaterialToggle,
  onReset,
  hasActiveFilters,
  categories = CATEGORIES,
}) => {

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
          {categories.map((cat) => {
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
