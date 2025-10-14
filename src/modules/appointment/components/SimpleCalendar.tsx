/**
 * Simple Calendar Component
 * Lightweight calendar without external dependencies
 * Professional medical application design - UI only
 * Following Single Responsibility Principle
 */

'use client';

import React, { useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@/components/ui/icons';

interface Appointment {
  id: string;
  treatment: string;
  appointmentStartTime: string;
  status: string;
}

interface SimpleCalendarProps {
  /**
   * Array of appointments to display
   */
  appointments: Appointment[];
  /**
   * Slot selection handler
   */
  onSelectSlot: (slot: { start: Date; end: Date }) => void;
  /**
   * Event selection handler
   */
  onSelectEvent: (event: Appointment) => void;
  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * Simple calendar component with month view
 * Displays appointments in a grid format
 */
export const SimpleCalendar: React.FC<SimpleCalendarProps> = ({
  appointments,
  onSelectSlot,
  onSelectEvent,
  className = '',
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  // Get first day of month and number of days
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  const firstDayWeekday = firstDayOfMonth.getDay();
  const daysInMonth = lastDayOfMonth.getDate();

  // Generate calendar days
  const calendarDays = [];

  // Add empty cells for days before month starts
  for (let i = 0; i < firstDayWeekday; i++) {
    calendarDays.push(null);
  }

  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  // Get appointments for a specific date
  const getAppointmentsForDate = (day: number) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    return appointments.filter((appointment) => {
      const appointmentDate = new Date(appointment.appointmentStartTime);
      return appointmentDate.toDateString() === date.toDateString();
    });
  };

  // Navigate to previous month
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  // Navigate to next month
  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  // Handle day click
  const handleDayClick = (day: number) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    const startTime = new Date(date);
    const endTime = new Date(date.getTime() + 60 * 60 * 1000); // 1 hour later

    onSelectSlot({
      start: startTime,
      end: endTime,
    });
  };

  // Handle appointment click
  const handleAppointmentClick = (appointment: Appointment, event: React.MouseEvent) => {
    event.stopPropagation();
    onSelectEvent(appointment);
  };

  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className={`h-full w-full ${className}`}>
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={goToPreviousMonth}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ChevronLeftIcon className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-semibold text-gray-900">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h2>

        <button
          onClick={goToNextMonth}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ChevronRightIcon className="w-5 h-5" />
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {/* Day Headers */}
        <div className="grid grid-cols-7 bg-gray-50">
          {dayNames.map((day) => (
            <div
              key={day}
              className="p-3 text-center text-sm font-medium text-gray-700 border-r border-gray-200 last:border-r-0"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7">
          {calendarDays.map((day, index) => {
            if (day === null) {
              return (
                <div
                  key={`empty-${index}`}
                  className="h-24 border-r border-b border-gray-200 last:border-r-0"
                />
              );
            }

            const dayAppointments = getAppointmentsForDate(day);
            const isToday =
              new Date().toDateString() ===
              new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toDateString();

            return (
              <div
                key={`${currentDate.getFullYear()}-${currentDate.getMonth()}-${day}`}
                className={`h-24 border-r border-b border-gray-200 last:border-r-0 p-1 cursor-pointer hover:bg-gray-50 ${
                  isToday ? 'bg-blue-50' : ''
                }`}
                onClick={() => handleDayClick(day)}
              >
                <div
                  className={`text-sm font-medium mb-1 ${isToday ? 'text-blue-600' : 'text-gray-900'}`}
                >
                  {day}
                </div>

                {/* Appointments for this day */}
                <div className="space-y-1">
                  {dayAppointments.slice(0, 2).map((appointment) => (
                    <div
                      key={appointment.id}
                      className="text-xs p-1 rounded bg-blue-100 text-blue-800 cursor-pointer hover:bg-blue-200"
                      onClick={(e) => handleAppointmentClick(appointment, e)}
                    >
                      <div className="truncate">{appointment.treatment}</div>
                      <div className="text-blue-600">
                        {new Date(appointment.appointmentStartTime).toLocaleTimeString('en-US', {
                          hour: 'numeric',
                          minute: '2-digit',
                          hour12: true,
                        })}
                      </div>
                    </div>
                  ))}

                  {dayAppointments.length > 2 && (
                    <div className="text-xs text-gray-500">+{dayAppointments.length - 2} more</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
