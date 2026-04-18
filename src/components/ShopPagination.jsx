import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const ShopPagination = () => {
  return (
    <div className="flex items-center gap-3">
      <button className="w-10 h-10 rounded-full flex items-center justify-center border border-gray-100 text-gray-400 hover:border-himbalin-gold hover:text-himbalin-dark transition-all">
        <FiChevronLeft />
      </button>

      {[1, 2, 3].map((num) => (
        <button
          key={num}
          className={`w-10 h-10 rounded-full font-sans text-sm font-bold transition-all ${
            num === 1
              ? "bg-himbalin-gold text-himbalin-dark shadow-md"
              : "border border-gray-100 text-gray-500 hover:border-himbalin-gold hover:text-himbalin-dark"
          }`}
        >
          {num}
        </button>
      ))}

      <span className="text-gray-300 px-2">...</span>

      <button className="w-10 h-10 rounded-full border border-gray-100 text-gray-500 font-sans text-sm font-bold hover:border-himbalin-gold hover:text-himbalin-dark transition-all">
        8
      </button>

      <button className="w-10 h-10 rounded-full flex items-center justify-center border border-gray-100 text-gray-400 hover:border-himbalin-gold hover:text-himbalin-dark transition-all">
        <FiChevronRight />
      </button>
    </div>
  );
};

export default ShopPagination;
