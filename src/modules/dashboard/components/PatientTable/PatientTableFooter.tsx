/**
 * Patient Table Footer Component
 * Contains only pagination controls
 * Following Single Responsibility Principle
 */

import React from 'react';
import { PatientTablePagination } from './PatientTablePagination';

interface PatientTableFooterProps {
  /**
   * Current page number
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
 * Footer with centered pagination
 * Professional medical application styling
 */
export const PatientTableFooter: React.FC<PatientTableFooterProps> = ({
  currentPage,
  totalPages,
  totalItems,
  onPageChange,
  className = '',
}) => {
  return (
    <div className={`flex items-center w-full bg-white px-6 py-4 ${className}`}>
      <PatientTablePagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        onPageChange={onPageChange}
      />
    </div>
  );
};
