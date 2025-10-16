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
import { useUpdateAppointmentSilent } from '@/modules/appointment/hooks/useAppointments';
import { UpdateAppointment, AppointmentStatus } from '@/modules/appointment/types/appointment.types';
import { PatientHeader } from '@/modules/consultation/components/PatientHeader';
import { PatientSelector } from '@/modules/consultation/components/PatientSelector';

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
  const { data: patientData, isLoading: isLoadingPatient } = usePatient(selectedPatientId || '');

  // Mutation hook for updating appointment status (silent - no toast)
  const updateAppointment = useUpdateAppointmentSilent();

  // Handle patient selection from PatientSelector
  const handlePatientSelect = useCallback(
    (patientId: string) => {
      setSelectedPatientId(patientId);
      // Update URL with patientId
      const params = new URLSearchParams(searchParams.toString());
      params.set('patientId', patientId);
      router.push(`/consultations?${params.toString()}`);
    },
    [router, searchParams]
  );

  // Update appointment status to Consultation when appointmentId exists
  useEffect(() => {
    if (appointmentIdFromQuery && !hasUpdatedStatus) {
      // Update appointment status to Consultation silently (no toast)
      updateAppointment.mutate(
        {
          id: appointmentIdFromQuery,
          data: { status: AppointmentStatus.CONSULTATION } as UpdateAppointment,
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
        data: { status: AppointmentStatus.COMPLETED } as UpdateAppointment,
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
      {/* Patient Selection or Patient Header */}
      {!selectedPatientId ? (
        // Show patient selector when no patient is selected
        <PatientSelector onPatientSelect={handlePatientSelect} />
      ) : isLoadingPatient ? (
        // Show skeleton while loading patient data
        <div className="bg-white rounded-lg p-6 mb-6">
          <Skeleton active avatar paragraph={{ rows: 2 }} />
        </div>
      ) : patientData ? (
        // Show patient header when patient is loaded
        <PatientHeader patient={patientData} />
      ) : null}

      {/* Consultation Form - Only show when patient is selected */}
      {selectedPatientId && (
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
      )}
    </div>
  );
}
