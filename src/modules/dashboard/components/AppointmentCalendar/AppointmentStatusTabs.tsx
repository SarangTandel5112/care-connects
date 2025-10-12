/**
 * Appointment Status Tabs Component
 * Displays appointment status filter tabs with counts
 * Professional medical application design
 * Following Single Responsibility Principle
 */

import React from 'react';

interface StatusCounts {
  [key: string]: number;
}

interface AppointmentStatusTabsProps {
  /**
   * Count of appointments for each status
   */
  counts: StatusCounts;
  /**
   * Currently active status filter
   */
  activeStatus: string;
  /**
   * Status change handler
   */
  onChange: (status: string) => void;
  /**
   * Additional CSS classes
   */
  className?: string;
}

const STATUSES = [
  { label: 'All', value: 'All' },
  { label: 'Check In', value: 'Check In' },
  { label: 'Consultation', value: 'Consultation' },
  { label: 'Completed', value: 'Completed' },
];

/**
 * Tab buttons with status counts
 * Displays count above status label
 */
export const AppointmentStatusTabs: React.FC<AppointmentStatusTabsProps> = ({
  counts,
  activeStatus,
  onChange,
  className = '',
}) => {
  return (
    <div className={`flex gap-2 overflow-x-auto ${className}`}>
      {STATUSES.map((status) => {
        const isActive = activeStatus === status.value;
        const count = counts[status.value] || 0;

        return (
          <button
            key={status.value}
            onClick={() => onChange(status.value)}
            className={`flex min-w-[80px] flex-1 flex-col items-center justify-center rounded-lg px-2 py-2 text-center transition-colors ${
              isActive ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            aria-label={`${status.label}: ${count} appointments`}
            aria-pressed={isActive}
          >
            <span className="text-lg font-bold leading-tight">
              {count.toString().padStart(2, '0')}
            </span>
            <span className="text-xs leading-tight">{status.label}</span>
          </button>
        );
      })}
    </div>
  );
};
