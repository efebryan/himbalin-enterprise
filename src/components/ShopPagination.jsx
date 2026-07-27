import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const ShopPagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const handlePrev = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  };

  const getVisiblePages = () => {
    const delta = 1;
    const range = [];
    const rangeWithDots = [];
    let l;

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - delta && i <= currentPage + delta)
      ) {
        range.push(i);
      }
    }

    for (let i of range) {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push("...");
        }
      }
      rangeWithDots.push(i);
      l = i;
    }

    return rangeWithDots;
  };

  return (
    <div className="flex items-center gap-2 sm:gap-3">
      <button
        onClick={handlePrev}
        disabled={currentPage === 1}
        className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center border transition-all ${
          currentPage === 1
            ? "border-gray-100 text-gray-300 cursor-not-allowed"
            : "border-gray-200 text-gray-500 hover:border-himbalin-gold hover:text-himbalin-dark"
        }`}
      >
        <FiChevronLeft size={16} />
      </button>

      {getVisiblePages().map((num, idx) => {
        if (num === "...") {
          return (
            <span key={`dots-${idx}`} className="text-gray-300 px-1 sm:px-2">
              ...
            </span>
          );
        }
        return (
          <button
            key={num}
            onClick={() => onPageChange(num)}
            className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full font-sans text-xs sm:text-sm font-bold transition-all ${
              num === currentPage
                ? "bg-himbalin-gold text-himbalin-dark shadow-md"
                : "border border-gray-100 text-gray-500 hover:border-himbalin-gold hover:text-himbalin-dark"
            }`}
          >
            {num}
          </button>
        );
      })}

      <button
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center border transition-all ${
          currentPage === totalPages
            ? "border-gray-100 text-gray-300 cursor-not-allowed"
            : "border-gray-200 text-gray-500 hover:border-himbalin-gold hover:text-himbalin-dark"
        }`}
      >
        <FiChevronRight size={16} />
      </button>
    </div>
  );
};

export default ShopPagination;
