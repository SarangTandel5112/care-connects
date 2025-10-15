/**
 * Patient Details Page
 * Displays comprehensive patient information with tabs:
 * - Overview: Patient profile and summary
 * - Consultations: Clinical history
 * - Billing & Payments: Financial details
 * - Reports & Documents: Medical reports
 */

'use client';

import React, { useState, useCallback, lazy, Suspense } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Tabs, Spin, Alert, Button } from 'antd';
import { usePatient, useUpdatePatient } from '@/modules/patient/hooks/usePatients';
import { PatientHeader } from '@/modules/patient/components/PatientDetails/PatientHeader';
import { OverviewTab } from '@/modules/patient/components/PatientDetails/OverviewTab';
import { ConsultationsTab } from '@/modules/patient/components/PatientDetails/ConsultationsTab';
import { BillingTab } from '@/modules/patient/components/PatientDetails/BillingTab';
import { ReportsTab } from '@/modules/patient/components/PatientDetails/ReportsTab';
import { PatientModal } from '@/modules/patient/components/PatientModal';
import { UpdatePatient, CreatePatient } from '@/modules/patient/types/patient.types';
import { PatientModalState, ModalMode } from '@/types/modal.types';
import {
  useCreateAppointment,
  useUpdateAppointment,
} from '@/modules/appointment/hooks/useAppointments';
import {
  Appointment,
  CreateAppointment,
  UpdateAppointment as AppointmentUpdate,
} from '@/modules/appointment/types/appointment.types';

// Lazy load AppointmentModal
const AppointmentModal = lazy(() =>
  import('@/modules/appointment').then((module) => ({ default: module.AppointmentModal }))
);

export default function PatientDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const patientId = params.id as string;
  const [activeTab, setActiveTab] = useState('overview');
  const [modalState, setModalState] = useState<PatientModalState>({
    isOpen: false,
    mode: ModalMode.EDIT,
    patient: undefined,
  });
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);
  const [appointmentModalMode, setAppointmentModalMode] = useState<ModalMode>(ModalMode.CREATE);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | undefined>(
    undefined
  );

  // Fetch patient data
  const { data: patient, isLoading, isError, error } = usePatient(patientId);

  // Update patient mutation
  const updatePatient = useUpdatePatient();

  // Appointment mutations
  const createAppointment = useCreateAppointment();
  const updateAppointmentMutation = useUpdateAppointment();

  // Handle back navigation
  const handleBack = () => {
    router.push('/patients');
  };

  // Handle edit patient
  const handleEditClick = useCallback(() => {
    setModalState({
      isOpen: true,
      mode: ModalMode.EDIT,
      patient: patient,
    });
  }, [patient]);

  const handleModalClose = useCallback(() => {
    setModalState({
      isOpen: false,
      mode: ModalMode.EDIT,
      patient: undefined,
    });
  }, []);

  const handleModalSave = useCallback(
    async (data: UpdatePatient | CreatePatient) => {
      try {
        await updatePatient.mutateAsync({ data: data as UpdatePatient, id: patientId });
        handleModalClose();
      } catch (error) {
        console.error('Failed to update patient:', error);
      }
    },
    [updatePatient, patientId, handleModalClose]
  );

  // Handle Start Consultation
  const handleStartConsultation = useCallback(() => {
    router.push(`/consultations?patientId=${patientId}`);
  }, [router, patientId]);

  // Handle Book Appointment
  const handleBookAppointment = useCallback(() => {
    setSelectedAppointment(undefined);
    setAppointmentModalMode(ModalMode.CREATE);
    setIsAppointmentModalOpen(true);
  }, []);

  // Handle Appointment Modal Close
  const handleAppointmentModalClose = useCallback(() => {
    setIsAppointmentModalOpen(false);
    setSelectedAppointment(undefined);
  }, []);

  // Handle Appointment Save
  const handleAppointmentSave = useCallback(
    async (data: CreateAppointment | AppointmentUpdate) => {
      try {
        if (appointmentModalMode === 'create') {
          await createAppointment.mutateAsync(data as CreateAppointment);
        } else if (appointmentModalMode === 'edit' && selectedAppointment) {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
          const { id, createdAt, updatedAt, ...updateData } = data as any;
          await updateAppointmentMutation.mutateAsync({
            data: updateData as AppointmentUpdate,
            id: selectedAppointment.id,
          });
        }
        setIsAppointmentModalOpen(false);
      } catch {
        // Error handling is done by API hooks with toast messages
      }
    },
    [appointmentModalMode, selectedAppointment, createAppointment, updateAppointmentMutation]
  );

  // Loading state
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spin size="large" tip="Loading patient details..." />
      </div>
    );
  }

  // Error state
  if (isError || !patient) {
    return (
      <div className="p-6">
        <Alert
          message="Error Loading Patient"
          description={
            error instanceof Error
              ? error.message
              : 'Failed to load patient details. Please try again.'
          }
          type="error"
          showIcon
          action={
            <Button size="small" onClick={handleBack}>
              Go Back
            </Button>
          }
        />
      </div>
    );
  }

  // Tab items
  const tabItems = [
    {
      key: 'overview',
      label: 'Overview',
      children: <OverviewTab patient={patient} />,
    },
    {
      key: 'consultations',
      label: 'Consultations',
      children: <ConsultationsTab patientId={patientId} />,
    },
    {
      key: 'billing',
      label: 'Billing & Payments',
      children: <BillingTab patientId={patientId} />,
    },
    {
      key: 'reports',
      label: 'Reports & Documents',
      children: <ReportsTab patientId={patientId} />,
    },
  ];

  return (
    <div className="flex h-full bg-gray-50 gap-6">
      {/* Left Sidebar - Patient Info */}
      <div className="w-80 flex-shrink-0 overflow-y-auto">
        <PatientHeader
          patient={patient}
          onEditClick={handleEditClick}
          onBackClick={handleBack}
          onStartConsultation={handleStartConsultation}
          onBookAppointment={handleBookAppointment}
        />
      </div>

      {/* Right Content - Tabs */}
      <div className="flex-1 flex flex-col overflow-hidden ">
        <div className="bg-white rounded-lg shadow flex-1 flex flex-col overflow-hidden px-3">
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            items={tabItems}
            size="large"
            className="h-full flex flex-col px-6 [&_.ant-tabs-content-holder]:flex-1 [&_.ant-tabs-content-holder]:overflow-y-auto [&_.ant-tabs-content-holder]:overflow-x-hidden [&_.ant-tabs-content]:h-full"
          />
        </div>
      </div>

      {/* Edit Patient Modal */}
      <PatientModal
        isOpen={modalState.isOpen}
        onClose={handleModalClose}
        mode={modalState.mode}
        patient={modalState.patient}
        onSave={handleModalSave}
        isLoading={updatePatient.isPending}
      />

      {/* Appointment Modal */}
      <Suspense fallback={null}>
        <AppointmentModal
          isOpen={isAppointmentModalOpen}
          onClose={handleAppointmentModalClose}
          mode={appointmentModalMode}
          appointment={selectedAppointment}
          onSave={handleAppointmentSave}
          isLoading={createAppointment.isPending || updateAppointmentMutation.isPending}
          prefilledTimes={null}
          prefilledPatientId={patientId}
        />
      </Suspense>
    </div>
  );
}
