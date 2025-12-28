import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) pageNumbers.push(i);

  if (totalPages <= 1) return null;

  return (
    <nav className="flex justify-center mt-12">
      <ul className="flex items-center gap-2 bg-white p-2 rounded-2xl shadow-sm border border-gray-100">
        <li>
            <button 
                onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-xl hover:bg-gray-100 text-gray-500 disabled:opacity-30 disabled:hover:bg-transparent"
            >
                <ChevronLeft className="w-5 h-5" />
            </button>
        </li>
        
        {pageNumbers.map(number => (
          <li key={number}>
            <button
              onClick={() => onPageChange(number)}
              className={`w-10 h-10 rounded-xl text-sm font-bold transition-all ${
                currentPage === number
                  ? 'bg-[#4A3A2F] text-white shadow-md transform scale-105'
                  : 'text-gray-600 hover:bg-amber-50 hover:text-amber-700'
              }`}
            >
              {number}
            </button>
          </li>
        ))}

        <li>
            <button 
                onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-xl hover:bg-gray-100 text-gray-500 disabled:opacity-30 disabled:hover:bg-transparent"
            >
                <ChevronRight className="w-5 h-5" />
            </button>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;