/**
 * Appointment Calendar Component
 * Displays appointment timeline with date selector and status tabs
 * Professional medical application design with full API integration
 * Following Single Responsibility Principle
 */

'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { AppointmentDateSelector } from './AppointmentDateSelector';
import { AppointmentStatusTabs } from './AppointmentStatusTabs';
import { AppointmentTimeline } from './AppointmentTimeline';
import { AppointmentCard } from './AppointmentCard';
import { Button } from '@/components/ui';
import { PlusIcon } from '@/components/ui/icons';
import {
  useAppointments,
  useCreateAppointment,
  useUpdateAppointment,
  useDeleteAppointment,
} from '@/modules/appointment/hooks/useAppointments';
import { Spin, Alert } from 'antd';
import type {
  Appointment,
  CreateAppointment,
  UpdateAppointment,
  AppointmentStatus,
} from '@/modules/appointment/types/appointment.types';
import { AppointmentModal } from '@/modules/appointment/components/AppointmentModal';
import { ConfirmationModal } from '@/components/ui/ConfirmationModal';

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
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [activeStatus, setActiveStatus] = useState('All');
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    mode: 'view' | 'create' | 'edit';
    appointment?: Appointment;
    prefilledTimes?: { start: Date; end: Date } | null;
  }>({
    isOpen: false,
    mode: 'create',
    appointment: undefined,
    prefilledTimes: null,
  });
  const [deleteConfirmState, setDeleteConfirmState] = useState<{
    isOpen: boolean;
    appointment?: Appointment;
  }>({
    isOpen: false,
    appointment: undefined,
  });

  // Fetch appointments from API
  const { data: allAppointments = [], isLoading, isError, error } = useAppointments();

  // Mutation hooks
  const createAppointment = useCreateAppointment();
  const updateAppointment = useUpdateAppointment();
  const deleteAppointment = useDeleteAppointment();

  // Filter appointments by selected date
  const appointmentsForDate = useMemo(() => {
    return allAppointments.filter((appointment) => {
      const appointmentDate = new Date(appointment.appointmentStartTime);
      return appointmentDate.toDateString() === selectedDate.toDateString();
    });
  }, [allAppointments, selectedDate]);

  // Transform appointments to match AppointmentTimeline format
  const transformedAppointments = useMemo(() => {
    return appointmentsForDate.map((appointment: Appointment) => {
      const startTime = new Date(appointment.appointmentStartTime);
      const endTime = new Date(appointment.appointmentEndTime);

      const startTimeString = startTime.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });

      const endTimeString = endTime.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });

      const timeString = `${startTimeString} - ${endTimeString}`;

      return {
        id: appointment.id,
        time: timeString, // Display time with range
        startTime: startTimeString, // For timeline grouping
        patient: {
          id: appointment.patient.id,
          firstName: appointment.patient.firstName,
          lastName: appointment.patient.lastName,
          mobile: appointment.patient.mobile,
        },
        doctor: {
          name: `${appointment.doctor.firstName} ${appointment.doctor.lastName}`,
        },
        treatment: appointment.treatment || 'General Consultation',
        status: appointment.status,
      };
    });
  }, [appointmentsForDate]);

  // Calculate status counts
  const statusCounts = useMemo(() => {
    const counts = {
      All: appointmentsForDate.length,
      Scheduled: 0,
      'Check In': 0,
      Consultation: 0,
      Completed: 0,
    };

    appointmentsForDate.forEach((appointment) => {
      if (appointment.status in counts) {
        counts[appointment.status as keyof typeof counts]++;
      }
    });

    return counts;
  }, [appointmentsForDate]);

  // Filter transformed appointments by active status
  const filteredTransformedAppointments = useMemo(() => {
    if (activeStatus === 'All') return transformedAppointments;
    return transformedAppointments.filter((apt) => apt.status === activeStatus);
  }, [transformedAppointments, activeStatus]);

  const handleCheckIn = (appointmentId: string) => {
    // Update appointment status to Check In
    updateAppointment.mutate({
      id: appointmentId,
      data: { status: 'Check In' } as UpdateAppointment,
    });
  };

  const handleConsultation = (appointmentId: string, patientId: string) => {
    // Redirect to consultations page with query parameters
    router.push(`/consultations?appointmentId=${appointmentId}&patientId=${patientId}`);
  };

  const handleEdit = (transformedAppointment: any) => {
    // Find the original appointment by ID
    const originalAppointment = appointmentsForDate.find(
      (apt) => apt.id === transformedAppointment.id
    );
    if (originalAppointment) {
      setModalState({
        isOpen: true,
        mode: 'edit',
        appointment: originalAppointment,
        prefilledTimes: null,
      });
    }
  };

  const handleAddAppointment = () => {
    setModalState({
      isOpen: true,
      mode: 'create',
      appointment: undefined,
      prefilledTimes: null,
    });
  };

  const handleAddAppointmentAtTime = (timeString: string) => {
    // Parse time string (e.g., "09:00 AM") and combine with selected date
    const [time, period] = timeString.split(' ');
    const [hours, minutes] = time.split(':').map(Number);

    // Convert to 24-hour format
    let hour24 = hours;
    if (period === 'PM' && hours !== 12) {
      hour24 = hours + 12;
    } else if (period === 'AM' && hours === 12) {
      hour24 = 0;
    }

    // Create start date with selected date and parsed time
    const startDate = new Date(selectedDate);
    startDate.setHours(hour24, minutes, 0, 0);

    // Create end date (30 minutes after start)
    const endDate = new Date(startDate);
    endDate.setMinutes(endDate.getMinutes() + 30);

    // Open modal with prefilled times
    setModalState({
      isOpen: true,
      mode: 'create',
      appointment: undefined,
      prefilledTimes: { start: startDate, end: endDate },
    });
  };

  const handleModalClose = () => {
    setModalState({
      isOpen: false,
      mode: 'create',
      appointment: undefined,
      prefilledTimes: null,
    });
  };

  const handleModalSave = (data: CreateAppointment | UpdateAppointment) => {
    if (modalState.mode === 'create') {
      createAppointment.mutate(data as CreateAppointment, {
        onSuccess: () => {
          handleModalClose();
        },
      });
    } else if (modalState.mode === 'edit') {
      updateAppointment.mutate(
        { data: data as UpdateAppointment, id: modalState.appointment!.id },
        {
          onSuccess: () => {
            handleModalClose();
          },
        }
      );
    }
  };

  const handleModalEdit = () => {
    if (modalState.appointment) {
      setModalState({
        ...modalState,
        mode: 'edit',
      });
    }
  };

  const handleModalDelete = () => {
    if (modalState.appointment) {
      setDeleteConfirmState({
        isOpen: true,
        appointment: modalState.appointment,
      });
      // Close the appointment modal
      handleModalClose();
    }
  };

  const handleDeleteConfirm = () => {
    if (deleteConfirmState.appointment) {
      deleteAppointment.mutate(deleteConfirmState.appointment.id, {
        onSuccess: () => {
          setDeleteConfirmState({ isOpen: false, appointment: undefined });
        },
        onError: () => {
          setDeleteConfirmState({ isOpen: false, appointment: undefined });
        },
      });
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirmState({ isOpen: false, appointment: undefined });
  };

  // Loading state
  if (isLoading) {
    return (
      <div className={`flex h-full flex-col items-center justify-center ${className}`}>
        <Spin size="large" />
        <p className="mt-4 text-gray-600">Loading appointments...</p>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className={`flex h-full flex-col gap-4 ${className}`}>
        <Alert
          message="Error Loading Appointments"
          description={
            error instanceof Error
              ? error.message
              : 'Failed to load appointments. Please try again.'
          }
          type="error"
          showIcon
          closable
        />
      </div>
    );
  }

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

      {/* Timeline View - Only show in "All" tab */}
      {activeStatus === 'All' ? (
        <div className="flex-1 overflow-y-auto pr-2 md:pr-4">
          <AppointmentTimeline
            appointments={transformedAppointments}
            activeStatus={activeStatus}
            onAddAppointment={handleAddAppointmentAtTime}
            onCheckIn={handleCheckIn}
            onConsultation={handleConsultation}
            onEdit={handleEdit}
          />
        </div>
      ) : (
        /* Card View for filtered status tabs */
        <div className="flex-1 overflow-y-auto pr-2 md:pr-4">
          {filteredTransformedAppointments.length > 0 ? (
            <div className="space-y-3">
              {filteredTransformedAppointments.map((appointment) => (
                <AppointmentCard
                  key={appointment.id}
                  appointment={appointment}
                  onCheckIn={handleCheckIn}
                  onConsultation={handleConsultation}
                  onEdit={handleEdit}
                  showStatusBadge={true}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <p className="text-gray-500 text-lg">No appointments found</p>
              <p className="text-gray-400 text-sm mt-2">
                There are no {activeStatus.toLowerCase()} appointments for this date
              </p>
            </div>
          )}
        </div>
      )}

      {/* Appointment Modal */}
      <AppointmentModal
        isOpen={modalState.isOpen}
        onClose={handleModalClose}
        mode={modalState.mode}
        appointment={modalState.appointment}
        onSave={handleModalSave}
        onEdit={handleModalEdit}
        onDelete={handleModalDelete}
        isLoading={createAppointment.isPending || updateAppointment.isPending}
        prefilledTimes={modalState.prefilledTimes}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteConfirmState.isOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete Appointment"
        message={
          deleteConfirmState.appointment
            ? `Are you sure you want to delete the appointment with ${deleteConfirmState.appointment.patient.firstName} ${deleteConfirmState.appointment.patient.lastName}? This action cannot be undone.`
            : 'Are you sure you want to delete this appointment?'
        }
        confirmText="Yes, Delete"
        cancelText="Cancel"
        variant="danger"
        isLoading={deleteAppointment.isPending}
      />
    </div>
  );
};
