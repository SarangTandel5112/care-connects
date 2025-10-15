/**
 * Appointment Card Component
 * Displays individual appointment details
 * Professional medical application design
 * Following Single Responsibility Principle
 */

import React from 'react';
import { Button } from '@/components/ui';
import { UserIcon } from '@/components/ui/icons';
import { LoginOutlined, UserAddOutlined, EditOutlined } from '@ant-design/icons';
import { AppointmentStatus } from '@/modules/appointment/types/appointment.types';

interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  mobile: string;
}

interface Doctor {
  name: string;
}

interface Appointment {
  id: string;
  time: string;
  startTime: string;
  endTime: string;
  patient: Patient;
  doctor: Doctor;
  treatment: string;
  status: string;
}

interface AppointmentCardProps {
  /**
   * Appointment data
   */
  appointment: Appointment;
  /**
   * Callback for Check In action
   */
  onCheckIn?: (appointmentId: string) => void;
  /**
   * Callback for Consultation action
   */
  onConsultation?: (appointmentId: string, patientId: string) => void;
  /**
   * Callback for Edit action
   */
  onEdit?: (appointment: Appointment) => void;
  /**
   * Show status badge on the card
   */
  showStatusBadge?: boolean;
  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * Appointment card with patient details and action buttons
 * Displays treatment, patient info, doctor, and status
 */
export const AppointmentCard: React.FC<AppointmentCardProps> = ({
  appointment,
  onCheckIn,
  onConsultation,
  onEdit,
  showStatusBadge = false,
  className = '',
}) => {
  const { patient, doctor, treatment, status } = appointment;

  const getInitials = (firstName: string) => {
    return firstName?.charAt(0)?.toUpperCase() || '?';
  };

  const handleCheckIn = () => {
    if (onCheckIn && status === AppointmentStatus.SCHEDULED) {
      onCheckIn(appointment.id);
    }
  };

  const handleStartConsultation = () => {
    if (onConsultation) {
      onConsultation(appointment.id, patient.id);
    }
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit(appointment);
    }
  };

  // Determine button states using enum
  const isCheckInDisabled = status !== AppointmentStatus.SCHEDULED;
  const isConsultationDisabled = false; // Always enabled for consultation

  // Get status badge color
  const getStatusBadgeColor = () => {
    switch (status) {
      case AppointmentStatus.CHECK_IN:
        return 'bg-orange-600';
      case AppointmentStatus.CONSULTATION:
        return 'bg-green-600';
      case AppointmentStatus.COMPLETED:
        return 'bg-emerald-600';
      default:
        return 'bg-blue-600';
    }
  };

  return (
    <div
      className={`overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md ${className}`}
    >
      <div className="p-3">
        {/* Header: Treatment and Doctor */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-2">
          <h6 className="text-sm font-medium text-gray-900">{treatment}</h6>
          <div className="flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-1">
            <UserIcon className="h-3.5 w-3.5 text-emerald-600" size={14} />
            <span className="text-xs font-medium text-emerald-700">{doctor.name}</span>
          </div>
        </div>

        {/* Body: Patient Info and Actions */}
        <div className="mt-2 flex items-center justify-between">
          {/* Patient Info */}
          <div className="flex items-center gap-2">
            {/* Avatar */}
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
              <span className="text-sm font-bold text-blue-700">
                {getInitials(patient.firstName)}
              </span>
            </div>

            {/* Patient Details */}
            <div>
              <p className="text-sm font-medium text-gray-900">
                {patient.firstName} {patient.lastName}
              </p>
              <p className="text-xs text-gray-600">{patient.mobile}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <div className="relative group">
              <Button
                onClick={handleCheckIn}
                variant="ghost"
                size="sm"
                disabled={isCheckInDisabled}
                className={`w-8 h-8 p-0 rounded-lg border transition-all duration-200 flex items-center justify-center ${
                  isCheckInDisabled
                    ? 'text-gray-400 bg-gray-100 border-gray-200 cursor-not-allowed'
                    : 'text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 border-gray-300 hover:border-emerald-300 hover:scale-105'
                }`}
                ariaLabel="Check in patient"
                icon={<LoginOutlined style={{ fontSize: '16px' }} />}
              >
                {/* Empty children - icon is handled by icon prop */}
              </Button>
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                Check In
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
              </div>
            </div>
            <div className="relative group">
              <Button
                onClick={handleStartConsultation}
                variant="ghost"
                size="sm"
                disabled={isConsultationDisabled}
                className={`w-8 h-8 p-0 rounded-lg border transition-all duration-200 flex items-center justify-center ${
                  isConsultationDisabled
                    ? 'text-gray-400 bg-gray-100 border-gray-200 cursor-not-allowed'
                    : 'text-blue-600 hover:bg-blue-50 hover:text-blue-700 border-gray-300 hover:border-blue-300 hover:scale-105'
                }`}
                ariaLabel="Start consultation"
                icon={<UserAddOutlined style={{ fontSize: '16px' }} />}
              >
                {/* Empty children - icon is handled by icon prop */}
              </Button>
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                Consultation
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
              </div>
            </div>
            <div className="relative group">
              <Button
                onClick={handleEdit}
                variant="ghost"
                size="sm"
                className="w-8 h-8 p-0 text-gray-600 hover:bg-gray-50 hover:text-gray-700 rounded-lg border border-gray-300 hover:border-gray-400 transition-all duration-200 hover:scale-105 flex items-center justify-center"
                ariaLabel="Edit appointment"
                icon={<EditOutlined style={{ fontSize: '16px' }} />}
              >
                {/* Empty children - icon is handled by icon prop */}
              </Button>
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                Edit
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer: Time */}
        <div className="mt-2 text-center text-xs text-gray-500">{appointment.time}</div>
      </div>

      {/* Status Badge */}
      {showStatusBadge && (
        <div className={`${getStatusBadgeColor()} py-1 text-center text-xs font-medium text-white`}>
          {status}
        </div>
      )}
    </div>
  );
};
