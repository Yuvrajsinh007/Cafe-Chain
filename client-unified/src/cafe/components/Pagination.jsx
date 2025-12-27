import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pageNumbers = [];

  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  if (totalPages <= 1) {
    return null; // Don't render pagination if there's only one page
  }

  return (
    <nav className="flex justify-center mt-8">
      <ul className="flex items-center space-x-2">
        {pageNumbers.map(number => (
          <li key={number}>
            <button
              onClick={() => onPageChange(number)}
              className={`px-4 py-2 rounded-lg transition-colors duration-300 ${
                currentPage === number
                  ? 'bg-[#6b4f3f] text-white shadow-md'
                  : 'bg-[#ede7e1] text-[#2f2a26] hover:bg-[#dcd1c7]'
              }`}
            >
              {number}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Pagination;