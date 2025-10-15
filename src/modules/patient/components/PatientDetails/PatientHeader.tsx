/**
 * Patient Header Component
 * Displays patient avatar, basic info, and quick actions
 * Features attractive gradient avatar with auto-generated initials
 */

import React from 'react';
import { Button, Tag } from 'antd';
import {
  PhoneOutlined,
  EnvironmentOutlined,
  EditOutlined,
  CalendarOutlined,
  ArrowLeftOutlined,
} from '@ant-design/icons';
import { Patient } from '@/modules/patient/types/patient.types';
import { getInitials, getAvatarColor, calculateAge, getRelativeTime } from '../../utils/avatarUtils';

interface PatientHeaderProps {
  patient: Patient;
  onEditClick?: () => void;
  onBackClick?: () => void;
  onStartConsultation?: () => void;
  onBookAppointment?: () => void;
}

export const PatientHeader: React.FC<PatientHeaderProps> = ({
  patient,
  onEditClick,
  onBackClick,
  onStartConsultation,
  onBookAppointment,
}) => {
  const initials = getInitials(patient.firstName, patient.lastName);
  const avatarColor = getAvatarColor(`${patient.firstName} ${patient.lastName}`);
  const age = patient.birthDate ? calculateAge(patient.birthDate) : null;

  // Get last consultation date
  const lastConsultation = patient.consultations?.[0]?.date;
  const lastVisit = lastConsultation ? getRelativeTime(lastConsultation) : 'No consultations yet';

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Back Button */}
      {onBackClick && (
        <div className="border-b border-gray-200 px-4 py-3">
          <Button
            type="text"
            icon={<ArrowLeftOutlined />}
            onClick={onBackClick}
            className="flex items-center text-gray-600 hover:text-gray-900"
            size="small"
          >
            Back to Patients
          </Button>
        </div>
      )}

      <div className="p-6">
        {/* Avatar with Initials - Centered */}
        <div className="flex flex-col items-center mb-6">
          <div
            className={`w-32 h-32 rounded-full ${avatarColor} flex items-center justify-center shadow-lg mb-4`}
          >
            <span className="text-5xl font-bold text-white">{initials}</span>
          </div>

          {/* Name and ID - Centered */}
          <h1 className="text-2xl font-bold text-gray-900 text-center mb-1">
            {patient.firstName} {patient.lastName}
          </h1>
          <p className="text-xs text-gray-500 font-mono">ID: {patient.id.slice(0, 8)}</p>
        </div>

        {/* Key Information Badges */}
        <div className="flex flex-wrap gap-2 justify-center mb-6">
          {age && (
            <Tag color="blue" className="text-sm">
              {age} years
            </Tag>
          )}
          {patient.gender && (
            <Tag color="purple" className="text-sm">
              {patient.gender}
            </Tag>
          )}
        </div>

        {/* Quick Actions */}
        <div className="space-y-2 mb-6">
          <Button
            type="primary"
            icon={<CalendarOutlined />}
            block
            size="middle"
            className="shadow-sm bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 border-0 font-medium h-9"
            onClick={onStartConsultation}
          >
            Start Consultation
          </Button>
          <Button
            type="default"
            icon={<CalendarOutlined />}
            block
            size="middle"
            className="shadow-sm hover:border-blue-500 hover:text-blue-600 font-medium h-9"
            onClick={onBookAppointment}
          >
            Book Appointment
          </Button>
          <Button
            icon={<EditOutlined />}
            block
            size="middle"
            className="shadow-sm hover:border-gray-400 hover:text-gray-700 font-medium h-9"
            onClick={onEditClick}
          >
            Edit Patient
          </Button>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 my-4"></div>

        {/* Contact Information */}
        <div className="space-y-3 mb-4">
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
            Contact Info
          </h3>
          {patient.mobile && (
            <div className="flex items-center text-gray-700">
              <PhoneOutlined className="mr-3 text-blue-600 text-base" />
              <span className="text-sm">{patient.mobile}</span>
            </div>
          )}
          {patient.location && (
            <div className="flex items-start text-gray-700">
              <EnvironmentOutlined className="mr-3 mt-1 text-green-600 text-base flex-shrink-0" />
              <span className="text-sm">{patient.location}</span>
            </div>
          )}
          <div className="flex items-center text-gray-700">
            <CalendarOutlined className="mr-3 text-purple-600 text-base" />
            <span className="text-sm">{lastVisit}</span>
          </div>
        </div>

        {/* Additional Info */}
        {(patient.patientGroup || patient.maritalStatus) && (
          <>
            <div className="border-t border-gray-200 my-4"></div>
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
                Additional Info
              </h3>
              {patient.patientGroup && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Group:</span>
                  <Tag color="green">{patient.patientGroup}</Tag>
                </div>
              )}
              {patient.maritalStatus && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Status:</span>
                  <Tag color="orange">{patient.maritalStatus}</Tag>
                </div>
              )}
            </div>
          </>
        )}

        {/* Medical Conditions Alert */}
        {patient.medicalConditions && patient.medicalConditions.length > 0 && (
          <>
            <div className="border-t border-gray-200 my-4"></div>
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <div className="flex items-center mb-2">
                <div className="flex items-center justify-center h-6 w-6 rounded-full bg-red-100 mr-2">
                  <span className="text-red-600 font-bold text-xs">!</span>
                </div>
                <h3 className="text-xs font-semibold text-red-900 uppercase">
                  Allergies / Conditions
                </h3>
              </div>
              <div className="flex flex-wrap gap-1">
                {patient.medicalConditions.map((condition, index) => (
                  <Tag key={index} color="red" className="text-xs">
                    {condition}
                  </Tag>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

PatientHeader.displayName = 'PatientHeader';
