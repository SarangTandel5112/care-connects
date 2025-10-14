/**
 * Patient Selection Section
 * Allows selection of patient and related appointment
 * Features smart filtering of appointments by selected patient
 */

import React, { useMemo } from 'react';
import { Field, FieldProps, FormikProps } from 'formik';
import { Select } from 'antd';
import { UserOutlined, CalendarOutlined } from '@ant-design/icons';
import { ConsultationFormValues } from '../types/consultation.types';
import { usePatients } from '@/modules/patient/hooks/usePatients';
import { useAppointments } from '@/modules/appointment/hooks/useAppointments';

const { Option } = Select;

interface PatientSelectionSectionProps {
  formik: FormikProps<ConsultationFormValues>;
  readOnly?: {
    patientId?: boolean;
    appointmentId?: boolean;
  };
}

export const PatientSelectionSection: React.FC<PatientSelectionSectionProps> = ({
  formik,
  readOnly = {},
}) => {
  // Fetch all patients
  const { data: patients = [], isLoading: patientsLoading } = usePatients();

  // Fetch all appointments
  const { data: appointments = [], isLoading: appointmentsLoading } = useAppointments();

  // Filter appointments by selected patient
  const filteredAppointments = useMemo(() => {
    if (!formik.values.patientId) {
      // If no patient selected, show all appointments
      return appointments;
    }

    // Filter appointments for the selected patient
    return appointments.filter(
      (appt) =>
        appt.patientId === formik.values.patientId ||
        appt.patient?.id === formik.values.patientId
    );
  }, [appointments, formik.values.patientId]);

  // Format appointment display
  const formatAppointmentLabel = (appointment: { appointmentStartTime: string; status: string }) => {
    const date = new Date(appointment.appointmentStartTime);
    const dateStr = date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
    const timeStr = date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
    return `${dateStr} at ${timeStr} - ${appointment.status}`;
  };

  return (
    <div className="px-4 py-2 bg-gray-50 border-b border-gray-200">
      {/* Minimal Patient Display */}
      {formik.values.patientId && (
        <div className="flex items-center gap-2 text-sm">
          <UserOutlined className="text-blue-600" />
          <span className="font-medium text-gray-900">
            {patients.find((p) => p.id === formik.values.patientId)?.firstName}{' '}
            {patients.find((p) => p.id === formik.values.patientId)?.lastName}
          </span>
        </div>
      )}
    </div>
  );
};

PatientSelectionSection.displayName = 'PatientSelectionSection';
