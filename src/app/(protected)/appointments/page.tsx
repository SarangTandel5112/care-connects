'use client';

import React, { useState, lazy, Suspense } from 'react';
import { Button, ConfirmationModal } from '@/components/ui';
import { CalendarOutlined } from '@ant-design/icons';
import { Skeleton } from 'antd';

// Code splitting: Lazy load heavy components
const AppointmentCalendar = lazy(() =>
  import('@/modules/appointment').then((module) => ({ default: module.AppointmentCalendar }))
);
const AppointmentModal = lazy(() =>
  import('@/modules/appointment').then((module) => ({ default: module.AppointmentModal }))
);
import {
  Appointment,
  CreateAppointment,
  UpdateAppointment,
} from '@/modules/appointment/types/appointment.types';
import {
  useCreateAppointment,
  useUpdateAppointment,
  useDeleteAppointment,
} from '@/modules/appointment/hooks/useAppointments';

export default function AppointmentsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'view' | 'create' | 'edit'>('create');
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | undefined>(
    undefined
  );
  const [appointmentToDelete, setAppointmentToDelete] = useState<Appointment | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [prefilledTimes, setPrefilledTimes] = useState<{ start: Date; end: Date } | null>(null);

  // API hooks
  // Note: appointments data is fetched by AppointmentCalendar component internally
  const createAppointment = useCreateAppointment();
  const updateAppointment = useUpdateAppointment();
  const deleteAppointment = useDeleteAppointment();

  const handleAddAppointment = () => {
    setSelectedAppointment(undefined);
    setModalMode('create');
    setIsModalOpen(true);
  };

  const handleSelectSlot = (slotInfo: { start: Date; end: Date }) => {
    setSelectedAppointment(undefined);
    setPrefilledTimes(slotInfo);
    setModalMode('create');
    setIsModalOpen(true);
  };

  const handleViewAppointment = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setModalMode('view');
    setIsModalOpen(true);
  };

  // These functions are not used in the current implementation
  // const handleEditAppointment = (appointment: Appointment) => {
  //   setSelectedAppointment(appointment);
  //   setModalMode('edit');
  //   setIsModalOpen(true);
  // };

  // const handleDeleteAppointment = (appointment: Appointment) => {
  //   setAppointmentToDelete(appointment);
  //   setIsDeleteModalOpen(true);
  // };

  const handleSave = async (data: CreateAppointment | UpdateAppointment) => {
    try {
      if (modalMode === 'create') {
        await createAppointment.mutateAsync(data as CreateAppointment);
      } else if (modalMode === 'edit' && selectedAppointment) {
        // Remove id, createdAt, and updatedAt from data to avoid sending them in request body
        // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
        const { id, createdAt, updatedAt, ...updateData } = data as any;
        await updateAppointment.mutateAsync({
          data: updateData as UpdateAppointment,
          id: selectedAppointment.id,
        });
      }
      setIsModalOpen(false);
    } catch {
      // Error handling is done by API hooks with toast messages
    }
  };

  const handleConfirmDelete = async () => {
    if (!appointmentToDelete) return;

    try {
      await deleteAppointment.mutateAsync(appointmentToDelete.id);
      setIsDeleteModalOpen(false);
      setAppointmentToDelete(null);
    } catch {
      // Error handling is done by API hooks with toast messages
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
    setAppointmentToDelete(null);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedAppointment(undefined);
    setPrefilledTimes(null);
  };

  const handleEditFromModal = () => {
    // Switch from view mode to edit mode
    setModalMode('edit');
  };

  const handleDeleteFromModal = () => {
    // Open delete confirmation and close the appointment modal
    if (selectedAppointment) {
      setAppointmentToDelete(selectedAppointment);
      setIsModalOpen(false);
      setIsDeleteModalOpen(true);
    }
  };

  return (
    <div className="">
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Appointments</h1>
            <p className="text-gray-600 mt-1">Manage patient appointments and schedules</p>
          </div>
          <Button onClick={handleAddAppointment} icon={<CalendarOutlined />}>
            Schedule Appointment
          </Button>
        </div>
      </div>

      <Suspense
        fallback={
          <div className="bg-white p-6 rounded-lg shadow">
            <Skeleton active paragraph={{ rows: 8 }} />
          </div>
        }
      >
        <AppointmentCalendar
          onSelectAppointment={handleViewAppointment}
          onSelectSlot={handleSelectSlot}
        />
      </Suspense>

      {/* Appointment Modal */}
      <Suspense fallback={null}>
        <AppointmentModal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          mode={modalMode}
          appointment={selectedAppointment}
          onSave={handleSave}
          onEdit={handleEditFromModal}
          onDelete={handleDeleteFromModal}
          isLoading={createAppointment.isPending || updateAppointment.isPending}
          prefilledTimes={prefilledTimes}
        />
      </Suspense>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="Delete Appointment"
        message="Are you sure you want to delete this appointment? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        isLoading={deleteAppointment.isPending}
      />
    </div>
  );
}
