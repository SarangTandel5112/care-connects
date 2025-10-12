'use client';

/**
 * Patients Page
 * Main page for managing patients
 */

import React, { useState, lazy, Suspense } from 'react';
import { Button, ConfirmationModal } from '@/components/ui';
import { UserAddOutlined } from '@ant-design/icons';
import { Skeleton } from 'antd';

// Code splitting: Lazy load heavy components
const PatientTable = lazy(() =>
  import('@/modules/patient').then((module) => ({ default: module.PatientTable }))
);
const PatientModal = lazy(() =>
  import('@/modules/patient').then((module) => ({ default: module.PatientModal }))
);
import { Patient, CreatePatient, UpdatePatient } from '@/modules/patient';
import { useCreatePatient, useUpdatePatient, useDeletePatient } from '@/modules/patient';

export default function PatientsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'view' | 'create' | 'edit'>('create');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [patientToDelete, setPatientToDelete] = useState<Patient | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // API hooks
  const createPatient = useCreatePatient();
  const updatePatient = useUpdatePatient();
  const deletePatient = useDeletePatient();

  // Loading states
  const isCreating = createPatient.isPending;
  const isUpdating = updatePatient.isPending;
  const isDeleting = deletePatient.isPending;

  const handleAddPatient = () => {
    setModalMode('create');
    setSelectedPatient(null);
    setIsModalOpen(true);
  };

  const handleViewPatient = (patient: Patient) => {
    setSelectedPatient(patient);
    setModalMode('view');
    setIsModalOpen(true);
  };

  const handleEditPatient = (patient: Patient) => {
    setSelectedPatient(patient);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleDeletePatient = (patient: Patient) => {
    setPatientToDelete(patient);
    setIsDeleteModalOpen(true);
  };

  const handleSave = async (data: CreatePatient | UpdatePatient) => {
    try {
      if (modalMode === 'create') {
        await createPatient.mutateAsync(data as CreatePatient);
      } else if (modalMode === 'edit' && selectedPatient) {
        // Remove id, createdAt, and updatedAt from data to avoid sending them in request body
        // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
        const { id, createdAt, updatedAt, ...updateData } = data as any;
        await updatePatient.mutateAsync({
          data: updateData as UpdatePatient,
          id: selectedPatient.id,
        });
      }
      setIsModalOpen(false);
    } catch {
      // Error handling is done by API hooks with toast messages
    }
  };

  const handleConfirmDelete = async () => {
    if (!patientToDelete) return;

    try {
      await deletePatient.mutateAsync(patientToDelete.id);
      setIsDeleteModalOpen(false);
      setPatientToDelete(null);
    } catch {
      // Error handling is done by API hooks with toast messages
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
    setPatientToDelete(null);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedPatient(null);
  };

  return (
    <div className="">
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Patients</h1>
            <p className="text-gray-600">Manage your patient records</p>
          </div>
          <Button onClick={handleAddPatient} icon={<UserAddOutlined />}>
            Add Patient
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <Suspense
          fallback={
            <div className="p-6">
              <Skeleton active paragraph={{ rows: 8 }} />
            </div>
          }
        >
          <PatientTable
            onViewPatient={handleViewPatient}
            onEditPatient={handleEditPatient}
            onDeletePatient={handleDeletePatient}
          />
        </Suspense>
      </div>

      {/* Patient Modal */}
      <Suspense fallback={null}>
        <PatientModal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          mode={modalMode}
          patient={selectedPatient || undefined}
          onSave={handleSave}
          isLoading={isCreating || isUpdating}
        />
      </Suspense>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="Delete Patient"
        message={`Are you sure you want to delete "${patientToDelete?.firstName} ${patientToDelete?.lastName}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        isLoading={isDeleting}
      />
    </div>
  );
}
