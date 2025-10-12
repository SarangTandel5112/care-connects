/**
 * Appointment Date Selector Component
 * Date picker for selecting appointment viewing date
 * Professional medical application design
 * Following Single Responsibility Principle
 */

import React from 'react';
import { CalendarIcon } from '@/components/ui/icons';

interface AppointmentDateSelectorProps {
  /**
   * Currently selected date
   */
  selectedDate: Date;
  /**
   * Date change handler
   */
  onChange: (date: Date) => void;
  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * Date selector with calendar icon
 * Displays formatted date (DD MMM YYYY)
 */
export const AppointmentDateSelector: React.FC<AppointmentDateSelectorProps> = ({
  selectedDate,
  onChange,
  className = '',
}) => {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(new Date(e.target.value));
  };

  const dateInputValue = selectedDate.toISOString().split('T')[0];

  return (
    <div className={`relative inline-flex items-center ${className}`}>
      <input
        type="date"
        value={dateInputValue}
        onChange={handleDateChange}
        className="absolute inset-0 cursor-pointer opacity-0"
        aria-label="Select appointment date"
      />
      <div className="pointer-events-none flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-1.5">
        <span className="text-sm font-semibold text-gray-900">{formatDate(selectedDate)}</span>
        <CalendarIcon className="h-4 w-4 text-gray-500" size={16} />
      </div>
    </div>
  );
};
