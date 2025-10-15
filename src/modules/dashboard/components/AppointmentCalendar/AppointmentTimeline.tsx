/**
 * Appointment Timeline Component
 * Displays appointments in a vertical timeline format
 * Professional medical application design
 * Following Single Responsibility Principle
 */

import React from 'react';
import { AppointmentCard } from './AppointmentCard';
import { Button } from '@/components/ui';
import { AppointmentStatus } from '@/modules/appointment/types/appointment.types';

interface Appointment {
  id: string;
  time: string;
  startTime: string; // For grouping by time slot
  endTime: string; // For filtering overlapping slots
  patient: {
    id: string;
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
   * Callback when adding appointment at a specific time
   */
  onAddAppointment?: (time: string) => void;
  /**
   * Callback for Check In action
   */
  onCheckIn?: (appointmentId: string) => void;
  /**
   * Callback for Consultation action
   */
  onConsultation?: (appointmentId: string, patientId: string) => void;
  /**
   * Callback for Edit action
   */
  onEdit?: (appointment: Appointment) => void;
  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * Timeline view with time slots and appointment cards
 * Displays dotted timeline with appointments positioned at their scheduled times
 * Shows gaps between appointments with Add buttons
 */
export const AppointmentTimeline: React.FC<AppointmentTimelineProps> = ({
  appointments,
  activeStatus,
  onAddAppointment,
  onCheckIn,
  onConsultation,
  onEdit,
  className = '',
}) => {
  // Filter appointments by active status using enum
  const filteredAppointments = appointments.filter((apt) => {
    if (activeStatus === 'All') return true;
    // Map display status to enum values
    const statusMap: Record<string, AppointmentStatus> = {
      Scheduled: AppointmentStatus.SCHEDULED,
      'Check In': AppointmentStatus.CHECK_IN,
      Consultation: AppointmentStatus.CONSULTATION,
      Completed: AppointmentStatus.COMPLETED,
    };
    return apt.status === statusMap[activeStatus];
  });

  // Generate 30-minute time slots (9 AM to 6 PM)
  const generateTimeSlots = () => {
    const slots = [];
    const startHour = 9;
    const endHour = 18; // 6 PM in 24-hour format

    for (let hour = startHour; hour <= endHour; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        if (hour === endHour && minute > 0) break; // Stop at 6:00 PM

        const period = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
        const timeString = `${String(displayHour).padStart(2, '0')}:${String(minute).padStart(2, '0')} ${period}`;
        slots.push(timeString);
      }
    }

    return slots;
  };

  // Helper function to parse time string to minutes
  const parseTime = (timeStr: string) => {
    const [time, period] = timeStr.split(' ');
    const [hours, minutes] = time.split(':').map(Number);
    let hour24 = hours;
    if (period === 'PM' && hours !== 12) {
      hour24 = hours + 12;
    } else if (period === 'AM' && hours === 12) {
      hour24 = 0;
    }
    return hour24 * 60 + minutes;
  };

  // Check if a time slot falls within any appointment duration
  const isTimeSlotOccupied = (timeSlot: string) => {
    const slotMinutes = parseTime(timeSlot);
    return filteredAppointments.some((apt) => {
      const startMinutes = parseTime(apt.startTime);
      const endMinutes = parseTime(apt.endTime);
      // A slot is occupied if it falls after the start and before the end (exclusive of start time)
      return slotMinutes > startMinutes && slotMinutes < endMinutes;
    });
  };

  const baseTimeSlots = generateTimeSlots();

  // Filter out base slots that are occupied by appointments
  const availableBaseSlots = baseTimeSlots.filter((slot) => !isTimeSlotOccupied(slot));

  // Add appointment times that don't fall on 30-minute slots
  const appointmentTimes = filteredAppointments.map((apt) => apt.startTime);
  const uniqueAppointmentTimes = [...new Set(appointmentTimes)];

  // Merge available base slots with appointment times and sort
  const allTimeSlots = [...new Set([...availableBaseSlots, ...uniqueAppointmentTimes])].sort(
    (a, b) => parseTime(a) - parseTime(b)
  );

  const timeSlots = allTimeSlots;

  // Group appointments by start time slot
  const appointmentsByTime = filteredAppointments.reduce(
    (acc, appointment) => {
      const time = appointment.startTime;
      if (!acc[time]) {
        acc[time] = [];
      }
      acc[time].push(appointment);
      return acc;
    },
    {} as Record<string, Appointment[]>
  );

  const handleAddAppointment = (time: string) => {
    if (onAddAppointment) {
      onAddAppointment(time);
    }
  };

  return (
    <div className={`relative ${className}`}>
      {/* Dashed timeline */}
      <div
        className="absolute left-12 top-0 bottom-0 z-0 w-0.5 border-l-2 border-dotted border-blue-300"
        aria-hidden="true"
      />

      {/* Time slots */}
      <div className="flex flex-col gap-2">
        {timeSlots.map((time) => {
          const appointmentsAtTime = appointmentsByTime[time] || [];
          const hasAppointments = appointmentsAtTime.length > 0;

          // Check if this is an hourly slot (00 minutes) or half-hourly (30 minutes)
          const isHourlySlot = time.includes(':00');

          return (
            <div key={time} className="relative pl-14">
              {/* Time indicator dot */}
              <div className="absolute left-12 top-0 z-10 -translate-x-1/2 transform">
                <div
                  className={`rounded-full bg-blue-500 ${isHourlySlot ? 'h-3 w-3' : 'h-2 w-2'}`}
                  aria-hidden="true"
                />
              </div>

              {/* Solid line for slots with appointments */}
              {hasAppointments && (
                <div
                  className="absolute left-12 top-0 bottom-0 z-0 w-0.5 bg-blue-500"
                  aria-hidden="true"
                />
              )}

              {/* Time label - only show for hourly slots or slots with appointments */}
              {(isHourlySlot || hasAppointments) && (
                <span
                  className={`absolute left-0 top-0 text-right text-xs ${isHourlySlot ? 'font-medium text-gray-600' : 'font-normal text-gray-500'} w-10`}
                >
                  {time}
                </span>
              )}

              {/* Appointments or Add button */}
              {hasAppointments ? (
                <div className="space-y-2">
                  {appointmentsAtTime.map((appointment) => (
                    <AppointmentCard
                      key={appointment.id}
                      appointment={appointment}
                      onCheckIn={onCheckIn}
                      onConsultation={onConsultation}
                      onEdit={onEdit}
                    />
                  ))}
                </div>
              ) : (
                <Button
                  onClick={() => handleAddAppointment(time)}
                  variant="ghost"
                  size="sm"
                  className="w-full h-8 border border-dashed border-gray-300 hover:border-blue-400 hover:bg-blue-50 hover:text-blue-600 text-xs"
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
