/**
 * Appointment Calendar Component
 * Displays appointment timeline with date selector and status tabs
 * Professional medical application design - UI only (functionality to be added later)
 * Following Single Responsibility Principle
 */

'use client';

import React, { useState } from 'react';
import { AppointmentDateSelector } from './AppointmentDateSelector';
import { AppointmentStatusTabs } from './AppointmentStatusTabs';
import { AppointmentTimeline } from './AppointmentTimeline';
import { Button } from '@/components/ui';
import { PlusIcon } from '@/components/ui/icons';

interface AppointmentCalendarProps {
  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * Main appointment calendar component
 * Displays date selector, status tabs, and timeline view
 */
export const AppointmentCalendar: React.FC<AppointmentCalendarProps> = ({ className = '' }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [activeStatus, setActiveStatus] = useState('All');

  // Mock appointment counts
  const statusCounts = {
    All: 12,
    Scheduled: 5,
    'Check In': 3,
    Consultation: 2,
    Completed: 2,
  };

  // Mock appointments for UI
  const mockAppointments = [
    {
      id: '1',
      time: '09:00 AM',
      patient: { firstName: 'John', lastName: 'Doe', mobile: '+1234567890' },
      doctor: { name: 'Dr. Smith' },
      treatment: 'General Checkup',
      status: 'Scheduled',
    },
    {
      id: '2',
      time: '10:00 AM',
      patient: { firstName: 'Jane', lastName: 'Smith', mobile: '+1234567891' },
      doctor: { name: 'Dr. Johnson' },
      treatment: 'Dental Cleaning',
      status: 'Check In',
    },
    {
      id: '3',
      time: '11:00 AM',
      patient: { firstName: 'Robert', lastName: 'Wilson', mobile: '+1234567892' },
      doctor: { name: 'Dr. Williams' },
      treatment: 'Follow-up',
      status: 'Consultation',
    },
  ];

  const handleAddAppointment = () => {
    // TODO: Implement add appointment functionality
    console.log('Add appointment clicked');
  };

  return (
    <div className={`flex h-full flex-col gap-4 ${className}`}>
      {/* Top Section: Date Selector and Add Button */}
      <div className="flex items-center justify-between">
        <AppointmentDateSelector selectedDate={selectedDate} onChange={setSelectedDate} />
        <Button
          onClick={handleAddAppointment}
          variant="primary"
          size="md"
          icon={<PlusIcon className="h-4 w-4" size={16} />}
          ariaLabel="Add appointment"
        >
          Add Appointment
        </Button>
      </div>

      {/* Status Tabs */}
      <AppointmentStatusTabs
        counts={statusCounts}
        activeStatus={activeStatus}
        onChange={setActiveStatus}
      />

      {/* Timeline View - Scrollable */}
      <div className="flex-1 overflow-y-auto pr-2 md:pr-4">
        <AppointmentTimeline appointments={mockAppointments} activeStatus={activeStatus} />
      </div>
    </div>
  );
};
