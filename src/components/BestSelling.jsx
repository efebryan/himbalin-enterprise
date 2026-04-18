import { products } from "../data/products";
import ProductCard from "./ProductCard";
import { Link } from "react-router-dom";

const BestSelling = () => {
  return (
    <section className="py-24 px-8 bg-white">
      <div className="container mx-auto">
        <div className="flex justify-between items-end mb-16">
          <div>
            <h2 className="font-serif text-4xl lg:text-5xl text-himbalin-dark font-bold mb-4">
              Best-Selling Products
            </h2>
            <div className="w-20 h-1 bg-himbalin-gold rounded-full" />
          </div>
          <Link
            to="/shop"
            className="font-sans font-medium text-himbalin-dark hover:text-himbalin-gold transition-colors flex items-center gap-2 group"
          >
            Shop All
            <span className="transform group-hover:translate-x-1 transition-transform">
              →
            </span>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default BestSelling;
