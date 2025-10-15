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
import { useUpdateAppointment } from '@/modules/appointment/hooks/useAppointments';
import { UpdateAppointment } from '@/modules/appointment/types/appointment.types';

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
  const [hasUpdatedStatus, setHasUpdatedStatus] = useState(false);

  // Fetch patient data if patientId is provided (hook will only fetch if ID is truthy)
  const { data: patientData } = usePatient(selectedPatientId || '');

  // Mutation hook for updating appointment status
  const updateAppointment = useUpdateAppointment();

  // Update appointment status to Consultation when appointmentId exists
  useEffect(() => {
    if (appointmentIdFromQuery && !hasUpdatedStatus) {
      // Update appointment status to Consultation
      updateAppointment.mutate(
        {
          id: appointmentIdFromQuery,
          data: { status: 'Consultation' } as UpdateAppointment,
        },
        {
          onSuccess: () => {
            setHasUpdatedStatus(true);
          },
          onError: (error) => {
            console.error('Failed to update appointment status:', error);
            // Still mark as updated to prevent infinite retries
            setHasUpdatedStatus(true);
          },
        }
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appointmentIdFromQuery, hasUpdatedStatus]);

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
    // Update appointment status to Completed if appointmentId exists
    if (appointmentIdFromQuery) {
      updateAppointment.mutate({
        id: appointmentIdFromQuery,
        data: { status: 'Completed' } as UpdateAppointment,
      });
    }

    // Redirect to dashboard
    router.push('/dashboard');
  }, [appointmentIdFromQuery, updateAppointment, router]);

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
