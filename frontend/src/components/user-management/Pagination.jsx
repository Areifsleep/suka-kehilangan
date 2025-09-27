import React from "react";

import { Button } from "@/components/ui/button";

const Pagination = ({ currentPage, totalPages, total, currentCount, onPageChange }) => {
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  const renderPageNumbers = () => {
    const pages = [];

    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || Math.abs(i - currentPage) <= 1) {
        pages.push(
          <Button
            key={i}
            variant={i === currentPage ? "default" : "outline"}
            size="sm"
            onClick={() => handlePageChange(i)}
            className={i === currentPage ? "bg-green-700 text-white hover:bg-green-800" : ""}
          >
            {i}
          </Button>
        );
      } else if (i === 2 && currentPage > 3) {
        pages.push(
          <span
            key={i}
            className="px-2 text-gray-500"
          >
            …
          </span>
        );
      } else if (i === totalPages - 1 && currentPage < totalPages - 2) {
        pages.push(
          <span
            key={i}
            className="px-2 text-gray-500"
          >
            …
          </span>
        );
      }
    }

    return pages;
  };

  return (
    <div className="flex items-center justify-between mt-6">
      <div className="text-sm text-gray-600">
        Menampilkan {currentCount} dari {total} user
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(1)}
          disabled={currentPage === 1}
        >
          «
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          ‹
        </Button>

        {renderPageNumbers()}

        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          ›
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(totalPages)}
          disabled={currentPage === totalPages}
        >
          »
        </Button>
      </div>
    </div>
  );
};

export default Pagination;
