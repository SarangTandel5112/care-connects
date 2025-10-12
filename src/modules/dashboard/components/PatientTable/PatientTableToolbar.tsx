/**
 * Patient Table Toolbar Component
 * Contains search bar and action buttons at the top of the table
 * Following Single Responsibility Principle
 */

import React from 'react';
import { Button } from '@/components/ui';
import { SearchIcon, PlusIcon } from '@/components/ui/icons';

interface PatientTableToolbarProps {
  /**
   * Current search query
   */
  searchQuery: string;
  /**
   * Search query change handler
   */
  onSearch: (query: string) => void;
  /**
   * Add patient button click handler
   */
  onAddPatient: () => void;
  /**
   * Total number of patients displayed
   */
  totalPatients?: number;
  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * Toolbar with search, filters, and actions
 * Professional medical application styling
 */
export const PatientTableToolbar: React.FC<PatientTableToolbarProps> = ({
  searchQuery,
  onSearch,
  onAddPatient,
  totalPatients,
  className = '',
}) => {
  return (
    <div className={`flex justify-end items-center gap-4 bg-white p-3 ${className}`}>
      {/* Search Bar */}
      <div className="relative w-64">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2.5">
          <SearchIcon className="h-3 w-3 text-gray-400" />
        </div>
        <input
          type="search"
          value={searchQuery}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Search patients..."
          className="block w-full rounded-lg border border-gray-300 bg-white py-2 pl-8 pr-3 text-sm text-gray-900 placeholder-gray-400 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          aria-label="Search patients"
        />
      </div>

      {/* Add Patient Button */}
      <Button
        onClick={onAddPatient}
        variant="primary"
        size="md"
        icon={<PlusIcon className="h-4 w-4" />}
        aria-label="Add new patient"
      >
        <span className="hidden sm:inline">Add Patient</span>
      </Button>
    </div>
  );
};
