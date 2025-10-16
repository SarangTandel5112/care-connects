/**
 * Patient Header Component for Consultation Page
 * Displays patient basic information in an attractive card format
 * Shows name, phone, and location
 */

import React from 'react';
import { PhoneOutlined, EnvironmentOutlined, UserOutlined } from '@ant-design/icons';
import { Patient } from '@/modules/patient/types/patient.types';

interface PatientHeaderProps {
  patient: Patient;
}

/**
 * Get initials from patient name for avatar
 */
const getInitials = (firstName: string, lastName: string): string => {
  const firstInitial = firstName?.charAt(0)?.toUpperCase() || '';
  const lastInitial = lastName?.charAt(0)?.toUpperCase() || '';
  return `${firstInitial}${lastInitial}` || '?';
};

/**
 * Get gradient color based on patient name
 */
const getAvatarGradient = (name: string): string => {
  const gradients = [
    'bg-gradient-to-br from-blue-500 to-blue-700',
    'bg-gradient-to-br from-purple-500 to-purple-700',
    'bg-gradient-to-br from-pink-500 to-pink-700',
    'bg-gradient-to-br from-green-500 to-green-700',
    'bg-gradient-to-br from-orange-500 to-orange-700',
    'bg-gradient-to-br from-teal-500 to-teal-700',
    'bg-gradient-to-br from-indigo-500 to-indigo-700',
    'bg-gradient-to-br from-red-500 to-red-700',
  ];

  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }

  return gradients[Math.abs(hash) % gradients.length];
};

export const PatientHeader: React.FC<PatientHeaderProps> = ({ patient }) => {
  const initials = getInitials(patient.firstName, patient.lastName);
  const avatarGradient = getAvatarGradient(`${patient.firstName} ${patient.lastName}`);

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 mb-4 border border-blue-100 shadow-sm">
      <div className="flex items-center gap-3">
        {/* Avatar */}
        <div
          className={`flex-shrink-0 w-12 h-12 rounded-full ${avatarGradient} flex items-center justify-center shadow-md`}
        >
          <span className="text-lg font-bold text-white">{initials}</span>
        </div>

        {/* Patient Info */}
        <div className="flex-1 min-w-0">
          {/* Name */}
          <h2 className="text-base font-bold text-gray-900 mb-0.5">
            {patient.firstName} {patient.lastName}
          </h2>

          {/* Contact Details */}
          <div className="flex flex-wrap gap-3 items-center">
            {/* Phone */}
            {patient.mobile && (
              <div className="flex items-center gap-1 text-gray-700">
                <PhoneOutlined className="text-blue-600 text-xs" />
                <span className="text-xs font-medium">{patient.mobile}</span>
              </div>
            )}

            {/* Location */}
            {patient.location && (
              <div className="flex items-center gap-1 text-gray-700">
                <EnvironmentOutlined className="text-green-600 text-xs" />
                <span className="text-xs truncate max-w-[200px]">{patient.location}</span>
              </div>
            )}

            {/* Age/Gender */}
            {(patient.age || patient.gender) && (
              <div className="flex items-center gap-1 text-gray-700">
                <UserOutlined className="text-purple-600 text-xs" />
                <span className="text-xs">
                  {patient.age && `${patient.age} yrs`}
                  {patient.age && patient.gender && ' • '}
                  {patient.gender}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Patient ID Badge */}
        <div className="flex-shrink-0">
          <div className="bg-white px-2 py-1 rounded border border-gray-200">
            <p className="text-[10px] text-gray-500 leading-tight">ID</p>
            <p className="text-xs font-mono font-semibold text-gray-900 leading-tight">
              {patient.id.slice(0, 8).toUpperCase()}
            </p>
          </div>
        </div>

        {/* Medical Conditions Badge (if any) */}
        {patient.medicalConditions && patient.medicalConditions.length > 0 && (
          <div className="flex-shrink-0">
            <div className="bg-red-50 border border-red-300 rounded px-2 py-1 flex items-center gap-1.5">
              <div className="flex items-center justify-center h-4 w-4 rounded-full bg-red-100 flex-shrink-0">
                <span className="text-red-600 font-bold text-[10px]">!</span>
              </div>
              <div>
                <p className="text-[10px] font-semibold text-red-900 uppercase leading-tight">
                  Allergies
                </p>
                <p className="text-xs text-red-700 leading-tight">
                  {patient.medicalConditions.length} condition(s)
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

PatientHeader.displayName = 'PatientHeader';
