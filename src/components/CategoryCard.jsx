import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const CategoryCard = ({ category }) => {
  return (
    <Link to={category.path || "/shop"} className="block h-full">
      <motion.div
        className="group relative h-[400px] min-w-[280px] rounded-2xl overflow-hidden cursor-pointer shadow-soft"
        whileHover={{ y: -5 }}
        transition={{ duration: 0.3 }}
      >
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-in-out group-hover:scale-110"
          style={{ backgroundImage: `url('${category.image}')` }}
        />

        {/* Gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-himbalin-dark/90 via-himbalin-dark/20 to-transparent opacity-70 group-hover:opacity-80 transition-opacity duration-300" />

        <div className="absolute bottom-0 left-0 p-6 w-full">
          <h3 className="text-himbalin-beige font-serif text-2xl font-semibold mb-2 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
            {category.name}
          </h3>
          <div className="w-10 h-0.5 bg-himbalin-gold transform scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300" />
        </div>
      </motion.div>
    </Link>
  );
};

export default CategoryCard;
