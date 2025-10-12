/**
 * Appointment Timeline Component
 * Displays appointments in a vertical timeline format
 * Professional medical application design
 * Following Single Responsibility Principle
 */

import React from 'react';
import { AppointmentCard } from './AppointmentCard';
import { Button } from '@/components/ui';

interface Appointment {
  id: string;
  time: string;
  patient: {
    firstName: string;
    lastName: string;
    mobile: string;
  };
  doctor: {
    name: string;
  };
  treatment: string;
  status: string;
}

interface AppointmentTimelineProps {
  /**
   * Array of appointments to display
   */
  appointments: Appointment[];
  /**
   * Active status filter
   */
  activeStatus: string;
  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * Timeline view with time slots and appointment cards
 * Displays dotted timeline with appointments positioned at their scheduled times
 */
export const AppointmentTimeline: React.FC<AppointmentTimelineProps> = ({
  appointments,
  activeStatus,
  className = '',
}) => {
  // Generate time slots (9 AM to 6 PM)
  const timeSlots = [
    '09:00 AM',
    '10:00 AM',
    '11:00 AM',
    '12:00 PM',
    '01:00 PM',
    '02:00 PM',
    '03:00 PM',
    '04:00 PM',
    '05:00 PM',
    '06:00 PM',
  ];

  // Filter appointments by active status
  const filteredAppointments = appointments.filter(
    (apt) => activeStatus === 'All' || apt.status === activeStatus
  );

  // Group appointments by time slot
  const appointmentsByTime = filteredAppointments.reduce(
    (acc, appointment) => {
      const time = appointment.time;
      if (!acc[time]) {
        acc[time] = [];
      }
      acc[time].push(appointment);
      return acc;
    },
    {} as Record<string, Appointment[]>
  );

  const handleAddAppointment = (time: string) => {
    // TODO: Implement add appointment at specific time
    console.log('Add appointment at:', time);
  };

  return (
    <div className={`relative ${className}`}>
      {/* Dashed timeline */}
      <div
        className="absolute left-12 top-0 bottom-0 z-0 w-0.5 border-l-2 border-dotted border-blue-300"
        aria-hidden="true"
      />

      {/* Time slots */}
      <div className="flex flex-col gap-3">
        {timeSlots.map((time) => {
          const appointmentsAtTime = appointmentsByTime[time] || [];
          const hasAppointments = appointmentsAtTime.length > 0;

          return (
            <div key={time} className="relative pl-14">
              {/* Time indicator dot */}
              <div className="absolute left-12 top-0 z-10 -translate-x-1/2 transform">
                <div className="h-3 w-3 rounded-full bg-blue-500" aria-hidden="true" />
              </div>

              {/* Solid line for slots with appointments */}
              {hasAppointments && (
                <div
                  className="absolute left-12 top-0 bottom-0 z-0 w-0.5 bg-blue-500"
                  aria-hidden="true"
                />
              )}

              {/* Time label */}
              <span className="absolute left-0 top-0 text-right text-xs font-medium text-gray-600 w-10">
                {time}
              </span>

              {/* Appointments or Add button */}
              {hasAppointments ? (
                <div className="space-y-2">
                  {appointmentsAtTime.map((appointment) => (
                    <AppointmentCard key={appointment.id} appointment={appointment} />
                  ))}
                </div>
              ) : (
                <Button
                  onClick={() => handleAddAppointment(time)}
                  variant="ghost"
                  size="md"
                  className="w-full border-2 border-dashed border-gray-300 hover:border-blue-400 hover:bg-blue-50 hover:text-blue-600"
                  ariaLabel={`Add appointment at ${time}`}
                >
                  + Add Appointment
                </Button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
