import React, { useState, useMemo, useCallback, memo } from 'react';
import { Calendar, momentLocalizer, View } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Appointment, AppointmentStatus } from '../types/appointment.types';
import { useAppointments } from '../hooks/useAppointments';

const localizer = momentLocalizer(moment);

interface AppointmentCalendarProps {
  onSelectAppointment: (appointment: Appointment) => void;
  onSelectSlot: (slotInfo: { start: Date; end: Date }) => void;
}

const AppointmentCalendarComponent: React.FC<AppointmentCalendarProps> = ({
  onSelectAppointment,
  onSelectSlot,
}) => {
  const { data: appointments, isLoading } = useAppointments();
  const [currentView, setCurrentView] = useState<View>('week');
  const [currentDate, setCurrentDate] = useState(new Date());

  const getStatusColor = useCallback((status: AppointmentStatus) => {
    switch (status) {
      case AppointmentStatus.SCHEDULED:
        return '#3b82f6'; // blue
      case AppointmentStatus.CHECK_IN:
        return '#f97316'; // orange
      case AppointmentStatus.CONSULTATION:
        return '#10b981'; // green
      case AppointmentStatus.COMPLETED:
        return '#059669'; // darker green
      case AppointmentStatus.CANCELLED:
        return '#ef4444'; // red
      default:
        return '#6b7280'; // gray
    }
  }, []);

  const events = useMemo(() => {
    if (!appointments) return [];

    return appointments.map((appointment) => ({
      id: appointment.id,
      title: `${appointment.patient.firstName} ${appointment.patient.lastName}`,
      start: new Date(appointment.appointmentStartTime),
      end: new Date(appointment.appointmentEndTime),
      resource: appointment,
      style: {
        backgroundColor: getStatusColor(appointment.status),
        borderColor: getStatusColor(appointment.status),
        color: 'white',
      },
    }));
  }, [appointments, getStatusColor]);

  const eventStyleGetter = useCallback((event: any) => {
    return {
      style: {
        backgroundColor: event.style.backgroundColor,
        borderColor: event.style.borderColor,
        color: event.style.color,
        borderRadius: '4px',
        border: 'none',
        fontSize: '12px',
        padding: '2px 4px',
      },
    };
  }, []);

  const handleSelectEvent = useCallback(
    (event: any) => {
      onSelectAppointment(event.resource);
    },
    [onSelectAppointment]
  );

  const handleSelectSlot = useCallback(
    (slotInfo: any) => {
      onSelectSlot({
        start: slotInfo.start,
        end: slotInfo.end,
      });
    },
    [onSelectSlot]
  );

  const handleDrillDown = useCallback(
    (date: Date) => {
      setCurrentDate(date);
      setCurrentView('day');
    },
    []
  );

  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-4"></div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4">
        <style jsx global>{`
          .rbc-header {
            color: #1f2937 !important;
            font-weight: 600 !important;
          }
          .rbc-toolbar-label {
            color: #1f2937 !important;
            font-weight: 700 !important;
            font-size: 1.25rem !important;
          }
          .rbc-date-cell {
            color: #374151 !important;
            font-weight: 500 !important;
          }
          .rbc-off-range-bg {
            color: #9ca3af !important;
          }
          .rbc-today {
            background-color: #f3f4f6 !important;
          }
          .rbc-today .rbc-date-cell {
            color: #1f2937 !important;
            font-weight: 700 !important;
          }
          .rbc-time-view .rbc-header {
            color: #1f2937 !important;
            font-weight: 600 !important;
          }
          .rbc-time-header-content {
            color: #1f2937 !important;
            font-weight: 600 !important;
          }
          .rbc-time-slot {
            color: #374151 !important;
            font-weight: 500 !important;
          }
          .rbc-timeslot-group {
            color: #374151 !important;
            font-weight: 500 !important;
          }
          .rbc-time-content {
            color: #374151 !important;
          }
          .rbc-time-header {
            color: #1f2937 !important;
          }
          .rbc-toolbar button {
            color: #374151 !important;
            border-color: #d1d5db !important;
          }
          .rbc-toolbar button:hover {
            color: #1f2937 !important;
            background-color: #f3f4f6 !important;
          }
          .rbc-toolbar button.rbc-active {
            color: #1f2937 !important;
            background-color: #e5e7eb !important;
          }
          .rbc-time-slot .rbc-label {
            color: #374151 !important;
            font-weight: 500 !important;
          }
          .rbc-time-header-gutter .rbc-label {
            color: #374151 !important;
            font-weight: 500 !important;
          }
          .rbc-time-gutter .rbc-label {
            color: #374151 !important;
            font-weight: 500 !important;
          }
          .rbc-time-view .rbc-time-gutter {
            color: #374151 !important;
          }
          .rbc-time-view .rbc-time-content {
            color: #374151 !important;
          }
          .rbc-time-view .rbc-timeslot-group {
            color: #374151 !important;
          }
          .rbc-time-view .rbc-time-slot {
            color: #374151 !important;
          }
          .rbc-time-view .rbc-time-slot .rbc-label {
            color: #374151 !important;
            font-weight: 500 !important;
          }
        `}</style>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 600 }}
          onSelectEvent={handleSelectEvent}
          onSelectSlot={handleSelectSlot}
          selectable={true}
          eventPropGetter={eventStyleGetter}
          views={['month', 'week', 'day', 'agenda']}
          view={currentView}
          date={currentDate}
          onNavigate={setCurrentDate}
          onView={setCurrentView}
          onDrillDown={handleDrillDown}
          step={30}
          timeslots={2}
          showMultiDayTimes
          popup
          doShowMoreDrillDown={false}
          drilldownView={null}
          longPressThreshold={100}
        />
      </div>

      {/* Legend */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: '#3b82f6' }}></div>
            <span className="text-gray-900 font-medium">Scheduled</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: '#f97316' }}></div>
            <span className="text-gray-900 font-medium">Check In</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: '#10b981' }}></div>
            <span className="text-gray-900 font-medium">Consultation</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: '#059669' }}></div>
            <span className="text-gray-900 font-medium">Completed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: '#ef4444' }}></div>
            <span className="text-gray-900 font-medium">Cancelled</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Memoize component to prevent unnecessary re-renders
export const AppointmentCalendar = memo(AppointmentCalendarComponent);
AppointmentCalendar.displayName = 'AppointmentCalendar';
