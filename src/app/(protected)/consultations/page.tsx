'use client';

/**
 * Consultations Page
 * Main page for creating and managing consultations
 * Supports query params for pre-selection: /consultations?patientId=xxx&appointmentId=xxx
 */

import React, { useEffect, useState, useCallback, lazy, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Skeleton } from 'antd';
import { usePatient } from '@/modules/consultation';
import { ConsultationFormValues } from '@/modules/consultation';

// Code splitting: Lazy load the form component
const ConsultationForm = lazy(() =>
  import('@/modules/consultation/components/ConsultationForm').then((module) => ({
    default: module.ConsultationForm,
  }))
);

export default function ConsultationsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get query params for pre-selection
  const patientIdFromQuery = searchParams.get('patientId');
  const appointmentIdFromQuery = searchParams.get('appointmentId');

  // Local state for selections
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(patientIdFromQuery);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<string | null>(
    appointmentIdFromQuery
  );

  // Fetch patient data if patientId is provided (hook will only fetch if ID is truthy)
  const { data: patientData } = usePatient(selectedPatientId || '');

  // Update selections when query params change
  useEffect(() => {
    if (patientIdFromQuery) {
      setSelectedPatientId(patientIdFromQuery);
    }
    if (appointmentIdFromQuery) {
      setSelectedAppointmentId(appointmentIdFromQuery);
    }
  }, [patientIdFromQuery, appointmentIdFromQuery]);

  const handleFormSubmitSuccess = useCallback(() => {
    // Redirect to dashboard or consultations list after successful submission
    router.push('/dashboard');
  }, [router]);

  const handleCancel = useCallback(() => {
    router.push('/dashboard');
  }, [router]);

  return (
    <div className="">
      <div className="bg-white rounded-lg shadow">
        <Suspense
          fallback={
            <div className="p-6">
              <Skeleton active paragraph={{ rows: 12 }} />
            </div>
          }
        >
          <ConsultationForm
            initialPatientId={selectedPatientId || undefined}
            initialAppointmentId={selectedAppointmentId || undefined}
            readOnlyFields={{
              patientId: !!patientIdFromQuery,
              appointmentId: !!appointmentIdFromQuery,
            }}
            onSubmitSuccess={handleFormSubmitSuccess}
            onCancel={handleCancel}
          />
        </Suspense>
      </div>
    </div>
  );
}
