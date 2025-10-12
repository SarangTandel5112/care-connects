/**
 * Calendar Component
 * Full calendar view using react-big-calendar
 * Professional medical application design - UI only
 * Following Single Responsibility Principle
 */

'use client';

import React, { useState } from 'react';
import { Calendar as BigCalendar, momentLocalizer, SlotInfo, View } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

interface CalendarProps {
  /**
   * Array of appointments to display
   */
  appointments: any[];
  /**
   * Slot selection handler
   */
  onSelectSlot: (slot: SlotInfo) => void;
  /**
   * Event selection handler
   */
  onSelectEvent: (event: any) => void;
  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * Full calendar component with month/week/day views
 * Displays appointments in a calendar format
 */
export const Calendar: React.FC<CalendarProps> = ({
  appointments,
  onSelectSlot,
  onSelectEvent,
  className = '',
}) => {
  const [currentView, setCurrentView] = useState<View>('month');
  const [date, setDate] = useState<Date>(new Date());

  const handleNavigate = (newDate: Date, view: View) => {
    setDate(newDate);
    setCurrentView(view);
  };

  // Transform appointments for react-big-calendar
  const events = appointments.map((appointment) => ({
    ...appointment,
    title: appointment.treatment,
    start: new Date(appointment.appointmentStartTime),
    end: new Date(appointment.appointmentEndTime),
  }));

  return (
    <div className={`h-full w-full ${className}`}>
      <BigCalendar
        className="my-4 h-[600px]"
        localizer={localizer}
        events={events}
        view={currentView}
        onView={setCurrentView}
        startAccessor="start"
        endAccessor="end"
        selectable={true}
        onSelectSlot={onSelectSlot}
        onSelectEvent={onSelectEvent}
        onNavigate={handleNavigate}
        date={date}
        step={30}
        timeslots={2}
        showMultiDayTimes
        popup
        style={{
          height: '600px',
        }}
        eventPropGetter={(event) => {
          // Color code events by status
          const statusColors: { [key: string]: string } = {
            Scheduled: '#3B82F6', // Blue
            'Check In': '#10B981', // Green
            Consultation: '#F59E0B', // Yellow
            Completed: '#6B7280', // Gray
            Cancelled: '#EF4444', // Red
          };

          return {
            style: {
              backgroundColor: statusColors[event.status] || '#3B82F6',
              borderColor: statusColors[event.status] || '#3B82F6',
              color: 'white',
            },
          };
        }}
      />
    </div>
  );
};
