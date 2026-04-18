import { categories } from "../data/categories";
import CategoryCard from "./CategoryCard";
import { Link } from "react-router-dom";

const Categories = () => {
  return (
    <section className="py-24 px-8 bg-himbalin-beige">
      <div className="container mx-auto">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="font-serif text-4xl text-himbalin-dark font-bold mb-3">
              Featured Categories
            </h2>
            <div className="w-20 h-1 bg-himbalin-gold rounded-full"></div>
          </div>
          <Link
            to="/shop"
            className="font-sans font-medium text-himbalin-dark hover:text-himbalin-gold transition-colors flex items-center gap-2 group"
          >
            Explore All
            <span className="transform group-hover:translate-x-1 transition-transform">
              →
            </span>
          </Link>
        </div>

        <div
          className="flex gap-6 overflow-x-auto pb-8 snap-x snap-mandatory scrollbar-hide"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {categories.map((category) => (
            <div key={category.id} className="snap-start shrink-0">
              <CategoryCard category={category} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;
