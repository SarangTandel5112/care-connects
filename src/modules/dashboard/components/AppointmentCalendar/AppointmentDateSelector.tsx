/**
 * Appointment Date Selector Component
 * Date picker for selecting appointment viewing date
 * Professional medical application design with Ant Design DatePicker
 * Following Single Responsibility Principle
 */

import React from 'react';
import { DatePicker } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { CalendarOutlined } from '@ant-design/icons';

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
 * Date selector with calendar picker
 * Displays formatted date with clickable calendar popup
 */
export const AppointmentDateSelector: React.FC<AppointmentDateSelectorProps> = ({
  selectedDate,
  onChange,
  className = '',
}) => {
  const handleDateChange = (date: Dayjs | null) => {
    if (date) {
      onChange(date.toDate());
    }
  };

  return (
    <div className={`inline-flex items-center ${className}`}>
      <DatePicker
        value={dayjs(selectedDate)}
        onChange={handleDateChange}
        format="DD MMM YYYY"
        suffixIcon={<CalendarOutlined style={{ color: '#6b7280' }} />}
        allowClear={false}
        className="custom-date-picker"
        style={{
          borderRadius: '0.5rem',
          borderColor: '#e5e7eb',
          fontSize: '0.875rem',
          fontWeight: 600,
          color: '#111827',
        }}
        popupClassName="appointment-date-picker-dropdown"
      />
    </div>
  );
};
