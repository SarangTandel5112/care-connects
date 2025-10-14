import React, { useState, useMemo, useCallback, memo } from 'react';
import { Calendar, momentLocalizer, View } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { PlusOutlined } from '@ant-design/icons';
import { Appointment, AppointmentStatus } from '../types/appointment.types';
import { useAppointments } from '../hooks/useAppointments';

// Error Boundary for Calendar
interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class CalendarErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Calendar Error Boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-red-600 mb-2">Calendar Error</h3>
            <p className="text-gray-600 mb-4">
              There was an error loading the calendar. Please refresh the page.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const localizer = momentLocalizer(moment);

interface AppointmentCalendarProps {
  onSelectAppointment: (appointment: Appointment) => void;
  onSelectSlot: (slotInfo: { start: Date; end: Date }) => void;
}

// Custom TimeSlotWrapper component that shows an "Add" button on hover
interface TimeSlotWrapperProps {
  value: Date;
  children?: React.ReactNode;
}

const TimeSlotWrapper: React.FC<TimeSlotWrapperProps & { onAddClick: (date: Date) => void }> = ({
  value,
  children,
  onAddClick,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddClick(value);
  };

  return (
    <div
      className="rbc-time-slot-wrapper"
      style={{ position: 'relative', height: '100%' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
      {isHovered && (
        <button
          onClick={handleClick}
          className="add-appointment-btn"
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            padding: '4px 8px',
            fontSize: '11px',
            fontWeight: '500',
            cursor: 'pointer',
            zIndex: 10,
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#2563eb';
            e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1.05)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#3b82f6';
            e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1)';
          }}
        >
          <PlusOutlined style={{ fontSize: '10px' }} />
          Add
        </button>
      )}
    </div>
  );
};

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

    return appointments
      .map((appointment) => {
        // Ensure dates are valid Date objects
        const startDate = new Date(appointment.appointmentStartTime);
        const endDate = new Date(appointment.appointmentEndTime);

        // Validate dates
        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
          console.error('Invalid appointment dates:', {
            id: appointment.id,
            start: appointment.appointmentStartTime,
            end: appointment.appointmentEndTime,
          });
          return null;
        }

        return {
          id: appointment.id,
          title: `${appointment.patient.firstName} ${appointment.patient.lastName}`,
          start: startDate,
          end: endDate,
          resource: appointment,
          style: {
            backgroundColor: getStatusColor(appointment.status),
            borderColor: getStatusColor(appointment.status),
            color: 'white',
          },
        };
      })
      .filter((event): event is NonNullable<typeof event> => event !== null); // Remove null entries with proper type guard
  }, [appointments, getStatusColor]);

  const eventStyleGetter = useCallback(
    (event: { style: { backgroundColor: string; borderColor: string; color: string } }) => {
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
    },
    []
  );

  const handleSelectEvent = useCallback(
    (event: { resource: Appointment }) => {
      onSelectAppointment(event.resource);
    },
    [onSelectAppointment]
  );

  const handleSelectSlot = useCallback(
    (slotInfo: { start: Date; end: Date }) => {
      // Ensure dates are valid Date objects
      const startDate = slotInfo.start instanceof Date ? slotInfo.start : new Date(slotInfo.start);
      const endDate = slotInfo.end instanceof Date ? slotInfo.end : new Date(slotInfo.end);

      // Validate dates
      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        console.error('Invalid date received in handleSelectSlot:', {
          start: slotInfo.start,
          end: slotInfo.end,
        });
        return;
      }

      onSelectSlot({
        start: startDate,
        end: endDate,
      });
    },
    [onSelectSlot]
  );

  const handleDrillDown = useCallback((date: Date) => {
    setCurrentDate(date);
    setCurrentView('day');
  }, []);

  // Handle clicking "Add" button in time slots
  const handleAddAppointmentClick = useCallback(
    (startTime: Date) => {
      // Ensure startTime is a valid Date object
      const validStartTime = startTime instanceof Date ? startTime : new Date(startTime);

      // Validate the date
      if (isNaN(validStartTime.getTime())) {
        console.error('Invalid startTime received in handleAddAppointmentClick:', startTime);
        return;
      }

      // Calculate end time (30 minutes after start by default)
      const endTime = moment(validStartTime).add(30, 'minutes').toDate();

      // Validate end time
      if (isNaN(endTime.getTime())) {
        console.error('Invalid endTime calculated in handleAddAppointmentClick:', endTime);
        return;
      }

      onSelectSlot({
        start: validStartTime,
        end: endTime,
      });
    },
    [onSelectSlot]
  );

  // Create custom components with the handler
  const customComponents = useMemo(
    () => ({
      timeSlotWrapper: (props: Record<string, unknown>) => (
        <TimeSlotWrapper value={props.value as Date} onAddClick={handleAddAppointmentClick}>
          {props.children as React.ReactNode}
        </TimeSlotWrapper>
      ),
    }),
    [handleAddAppointmentClick]
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
        <CalendarErrorBoundary>
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
            components={customComponents}
          />
        </CalendarErrorBoundary>
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
