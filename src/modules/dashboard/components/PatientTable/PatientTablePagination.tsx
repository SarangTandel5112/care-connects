/**
 * Patient Table Pagination Component
 * Handles page navigation for patient table
 * Following Single Responsibility Principle
 */

import React from 'react';
import { Button } from '@/components/ui';
import { ChevronLeftIcon, ChevronRightIcon } from '@/components/ui/icons';

interface PatientTablePaginationProps {
  /**
   * Current page number (1-indexed)
   */
  currentPage: number;
  /**
   * Total number of pages
   */
  totalPages: number;
  /**
   * Total number of items
   */
  totalItems: number;
  /**
   * Page change handler
   */
  onPageChange: (page: number) => void;
  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * Pagination component with page numbers and navigation buttons
 */
export const PatientTablePagination: React.FC<PatientTablePaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  onPageChange,
  className = '',
}) => {
  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5; // Maximum number of page buttons to show

    if (totalPages <= maxVisible) {
      // Show all pages if total is less than max visible
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      if (currentPage > 3) {
        pages.push('...');
      }

      // Show pages around current page
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push('...');
      }

      // Always show last page
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }

    return pages;
  };

  if (totalPages === 0) {
    return null;
  }

  return (
    <div className={`flex items-center justify-end w-full ${className}`}>
      {/* Results info */}
      <div className="mr-auto hidden text-sm text-gray-600 sm:block">
        {totalItems} {totalItems === 1 ? 'result' : 'results'}
      </div>

      {/* Pagination controls */}
      <div className="flex items-center gap-2">
        {/* Previous button */}
        <Button
          onClick={handlePrevious}
          disabled={currentPage === 1}
          variant="secondary"
          size="sm"
          icon={<ChevronLeftIcon className="h-3 w-3" />}
          aria-label="Previous page"
        />

        {/* Page numbers */}
        <div className="flex gap-1">
          {getPageNumbers().map((page, index) => {
            if (page === '...') {
              return (
                <span
                  key={`ellipsis-${index}`}
                  className="flex h-9 w-9 items-center justify-center text-gray-600"
                >
                  ...
                </span>
              );
            }

            const pageNumber = page as number;
            const isActive = pageNumber === currentPage;

            return (
              <Button
                key={pageNumber}
                onClick={() => onPageChange(pageNumber)}
                variant={isActive ? 'primary' : 'secondary'}
                size="sm"
                aria-label={`Page ${pageNumber}`}
                aria-current={isActive ? 'page' : undefined}
              >
                {pageNumber}
              </Button>
            );
          })}
        </div>

        {/* Next button */}
        <Button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          variant="secondary"
          size="sm"
          icon={<ChevronRightIcon className="h-3 w-3" />}
          aria-label="Next page"
        />
      </div>
    </div>
  );
};
