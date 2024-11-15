import React from 'react';
import { MdChevronLeft, MdChevronRight } from 'react-icons/md';

interface BoardPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const BoardPagination: React.FC<BoardPaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <div className="mb-8 mt-4 flex items-center justify-center space-x-2">
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="rounded-xl p-1 text-gray-700 transition-all duration-300 ease-in-out hover:bg-gray-300 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50">
        <MdChevronLeft size={20} />
      </button>

      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`rounded-xl px-3 py-1 ${
            currentPage === page
              ? 'bg-primary text-white transition-all duration-300 ease-in-out'
              : 'bg-slate-200 text-gray-700 transition-all duration-300 ease-in-out hover:scale-105 hover:bg-gray-300 active:scale-95'
          }`}>
          {page}
        </button>
      ))}

      <button
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="rounded-xl p-1 text-gray-700 transition-all duration-300 ease-in-out hover:bg-gray-300 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50">
        <MdChevronRight size={20} />
      </button>
    </div>
  );
};

export default BoardPagination;
