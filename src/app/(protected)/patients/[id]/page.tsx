/**
 * Patient Details Page
 * Displays comprehensive patient information with tabs:
 * - Overview: Patient profile and summary
 * - Consultations: Clinical history
 * - Billing & Payments: Financial details
 * - Reports & Documents: Medical reports
 */

'use client';

import React, { useState, useCallback } from 'react';
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

  // Fetch patient data
  const { data: patient, isLoading, isError, error } = usePatient(patientId);

  // Update patient mutation
  const updatePatient = useUpdatePatient();

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
        <PatientHeader patient={patient} onEditClick={handleEditClick} onBackClick={handleBack} />
      </div>

      {/* Right Content - Tabs */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="bg-white rounded-lg shadow flex-1 flex flex-col overflow-hidden">
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
    </div>
  );
}
