/**
 * Patient Table Header Component
 * Displays column headers for the patient table
 * Professional medical application styling
 * Following Single Responsibility Principle
 */

import React from 'react';

interface PatientTableHeaderProps {
  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * Table header with column titles
 * Clean, professional design suitable for medical applications
 */
export const PatientTableHeader: React.FC<PatientTableHeaderProps> = ({
  className = '',
}) => {
  const columns = [
    { key: 'name', label: 'Patient Name', width: 'min-w-[160px] flex-1' },
    { key: 'mobile', label: 'Mobile Number', width: 'min-w-[130px] flex-shrink-0' },
    { key: 'gender', label: 'Gender', width: 'min-w-[80px] flex-shrink-0' },
    { key: 'age', label: 'Age', width: 'min-w-[50px] flex-shrink-0' },
    { key: 'location', label: 'Location', width: 'min-w-[110px] flex-1' },
    { key: 'registeredDate', label: 'Registration Date', width: 'min-w-[110px] flex-shrink-0' },
    { key: 'actions', label: '', width: 'min-w-[110px] flex-shrink-0' },
  ];

  return (
    <div className={`flex items-center gap-4 border-b border-gray-200 bg-gray-50 px-6 py-3.5 ${className}`}>
      {columns.map((column) => (
        <div
          key={column.key}
          className={`${column.width} text-left text-xs font-semibold uppercase tracking-wide text-gray-700`}
        >
          {column.label}
        </div>
      ))}
    </div>
  );
};
