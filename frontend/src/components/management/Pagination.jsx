import React from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

export const Pagination = ({ currentPage, totalPages, hasNext, hasPrev, onPageChange, className = "" }) => {
  const getPageNumbers = () => {
    // Logika ini sudah cukup baik dan tidak perlu diubah
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    // Tampilkan halaman pertama jika tidak termasuk dalam jangkauan
    if (currentPage - delta > 2) {
      rangeWithDots.push(1);
      if (currentPage - delta > 3) {
        rangeWithDots.push("...");
      }
    } else {
      for (let i = 1; i < currentPage - delta; i++) {
        if (i < 2 || totalPages - i < 2 || Math.abs(i - currentPage) <= delta) rangeWithDots.push(i);
      }
    }

    for (let i = Math.max(1, currentPage - delta); i <= Math.min(totalPages, currentPage + delta); i++) {
      range.push(i);
    }

    rangeWithDots.push(...range);

    // Tampilkan halaman terakhir jika tidak termasuk dalam jangkauan
    if (currentPage + delta < totalPages - 1) {
      if (currentPage + delta < totalPages - 2) {
        rangeWithDots.push("...");
      }
      rangeWithDots.push(totalPages);
    } else {
      for (let i = currentPage + delta + 1; i <= totalPages; i++) {
        if (i < 2 || totalPages - i < 2 || Math.abs(i - currentPage) <= delta) rangeWithDots.push(i);
      }
    }

    // Filter duplikat jika ada
    return [...new Set(rangeWithDots)];
  };

  if (totalPages <= 1) return null;

  const pageNumbers = getPageNumbers();

  return (
    <div className={`flex items-center justify-between flex-wrap gap-2 ${className}`}>
      {/* Tombol Previous */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={!hasPrev}
        className={`
          flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-green-50 hover:text-green-700
          ${!hasPrev ? "cursor-not-allowed opacity-50" : "cursor-pointer"}
        `}
      >
        <FiChevronLeft className="w-4 h-4 sm:mr-1" />
        <span className="hidden sm:inline">Previous</span>
      </button>

      {/* Nomor Halaman */}
      {/* Ditambahkan flex-wrap untuk menangani kasus layar sangat sempit */}
      <div className="flex space-x-1 flex-wrap justify-center gap-1">
        {pageNumbers.map((pageNumber, index) => {
          if (pageNumber === "...") {
            return (
              <span
                key={`dots-${index}`}
                className="px-3 py-2 text-gray-500"
              >
                ...
              </span>
            );
          }

          return (
            <button
              key={pageNumber}
              onClick={() => onPageChange(pageNumber)}
              className={`
                px-3 py-2 text-sm font-medium rounded-md
                ${
                  pageNumber === currentPage
                    ? "bg-green-600 text-white border-green-600"
                    : "text-gray-700 bg-white border border-gray-300 hover:bg-green-50 hover:text-green-900"
                }
              `}
            >
              {pageNumber}
            </button>
          );
        })}
      </div>

      {/* Tombol Next */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!hasNext}
        className={`
          flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-green-50 hover:text-green-700
          ${!hasNext ? "cursor-not-allowed opacity-50" : "cursor-pointer"}
        `}
      >
        <span className="hidden sm:inline">Next</span>
        <FiChevronRight className="w-4 h-4 sm:ml-1" />
      </button>
    </div>
  );
};
