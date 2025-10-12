/**
 * Appointment Form Component
 * Form for creating and editing appointments
 * Professional medical application design - UI only
 * Following Single Responsibility Principle
 */

'use client';

import React, { useState } from 'react';
import { Button, Input } from '@/components/ui';

interface AppointmentFormProps {
  /**
   * Whether to show the form title
   */
  showTitle?: boolean;
  /**
   * Initial appointment data for editing
   */
  appointmentDetails?: {
    id?: string;
    patientId?: string;
    doctorId?: string;
    treatment?: string;
    appointmentStartTime?: number;
    appointmentEndTime?: number;
    patient?: { id: string; firstName: string; lastName: string };
    doctor?: { id: string; firstName: string; lastName: string };
  };
  /**
   * Callback after form submission
   */
  afterSubmit?: () => void;
  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * Appointment form with patient, doctor, time, and treatment fields
 * Handles both creation and editing of appointments
 */
export const AppointmentForm: React.FC<AppointmentFormProps> = ({
  showTitle = true,
  appointmentDetails,
  afterSubmit,
  className = '',
}) => {
  const [formData, setFormData] = useState({
    patientId: appointmentDetails?.patient?.id || '',
    doctorId: appointmentDetails?.doctor?.id || '',
    treatment: appointmentDetails?.treatment || '',
    appointmentStartTime: appointmentDetails?.appointmentStartTime || new Date().getTime(),
    appointmentEndTime:
      appointmentDetails?.appointmentEndTime || new Date().getTime() + 60 * 60 * 1000,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock data - in real app, these would come from API
  const patients = [
    { id: '1', firstName: 'John', lastName: 'Doe', mobile: '+1234567890' },
    { id: '2', firstName: 'Jane', lastName: 'Smith', mobile: '+1234567891' },
    { id: '3', firstName: 'Robert', lastName: 'Wilson', mobile: '+1234567892' },
  ];

  const doctors = [
    { id: '1', firstName: 'Dr. Sarah', lastName: 'Johnson', email: 'sarah@clinic.com' },
    { id: '2', firstName: 'Dr. Michael', lastName: 'Brown', email: 'michael@clinic.com' },
    { id: '3', firstName: 'Dr. Emily', lastName: 'Davis', email: 'emily@clinic.com' },
  ];

  // Validation function
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.patientId) {
      newErrors.patientId = 'Please select a patient';
    }

    if (!formData.doctorId) {
      newErrors.doctorId = 'Please select a doctor';
    }

    if (!formData.treatment.trim()) {
      newErrors.treatment = 'Please enter treatment details';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Mock form submission
      console.log('Appointment submitted:', formData);

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (afterSubmit) {
        afterSubmit();
      }
    } catch (error) {
      console.error('Failed to submit appointment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle input changes
  const handleInputChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  // Format date for input
  const formatDateForInput = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toISOString().slice(0, 16);
  };

  // Parse date from input
  const parseDateFromInput = (dateString: string) => {
    return new Date(dateString).getTime();
  };

  return (
    <div className={`${className}`}>
      {showTitle && (
        <h1 className="mb-4 text-2xl font-bold text-gray-900">
          {appointmentDetails?.id ? 'Update Appointment' : 'Create Appointment'}
        </h1>
      )}

      {errors.general && (
        <div className="mb-4 rounded-md bg-red-50 p-4">
          <p className="text-sm text-red-600">{errors.general}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Patient Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Patient *</label>
          <select
            value={formData.patientId}
            onChange={(e) => handleInputChange('patientId', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
              errors.patientId
                ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <option value="">Select a patient</option>
            {patients.map((patient) => (
              <option key={patient.id} value={patient.id}>
                {patient.firstName} {patient.lastName} - {patient.mobile}
              </option>
            ))}
          </select>
          {errors.patientId && <p className="mt-1 text-sm text-red-600">{errors.patientId}</p>}
        </div>

        {/* Doctor Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Doctor *</label>
          <select
            value={formData.doctorId}
            onChange={(e) => handleInputChange('doctorId', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
              errors.doctorId
                ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <option value="">Select a doctor</option>
            {doctors.map((doctor) => (
              <option key={doctor.id} value={doctor.id}>
                {doctor.firstName} {doctor.lastName}
              </option>
            ))}
          </select>
          {errors.doctorId && <p className="mt-1 text-sm text-red-600">{errors.doctorId}</p>}
        </div>

        {/* Date and Time */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Start Time *</label>
            <Input
              type="datetime-local"
              value={formatDateForInput(formData.appointmentStartTime)}
              onChange={(e) =>
                handleInputChange('appointmentStartTime', parseDateFromInput(e.target.value))
              }
              error={errors.appointmentStartTime}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">End Time *</label>
            <Input
              type="datetime-local"
              value={formatDateForInput(formData.appointmentEndTime)}
              onChange={(e) =>
                handleInputChange('appointmentEndTime', parseDateFromInput(e.target.value))
              }
              error={errors.appointmentEndTime}
            />
          </div>
        </div>

        {/* Treatment Details */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Treatment Details *
          </label>
          <textarea
            value={formData.treatment}
            onChange={(e) => handleInputChange('treatment', e.target.value)}
            rows={3}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none ${
              errors.treatment
                ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                : 'border-gray-300 hover:border-gray-400'
            }`}
            placeholder="Enter treatment details..."
          />
          {errors.treatment && <p className="mt-1 text-sm text-red-600">{errors.treatment}</p>}
        </div>

        {/* Form Actions */}
        <div className="flex gap-2 pt-4 border-t border-gray-200">
          <Button
            type="submit"
            variant="primary"
            isLoading={isSubmitting}
            loadingContent="Saving..."
          >
            {appointmentDetails?.id ? 'Update Appointment' : 'Create Appointment'}
          </Button>

          <Button type="button" variant="secondary" onClick={afterSubmit} disabled={isSubmitting}>
            Cancel
          </Button>

          {appointmentDetails?.id && (
            <Button
              type="button"
              variant="danger"
              className="ml-auto"
              onClick={() => {
                console.log('Delete appointment:', appointmentDetails.id);
                if (afterSubmit) afterSubmit();
              }}
            >
              Delete
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};
