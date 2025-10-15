/**
 * Patient Table Body Component
 * Displays patient rows with data
 * Professional medical application styling
 * Following Single Responsibility Principle
 */

'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import type { Patient } from '@/types/patient';
import { Button } from '@/components/ui';
import { UsersIcon, EyeIcon, EditIcon, TrashIcon } from '@/components/ui/icons';

interface PatientTableBodyProps {
  /**
   * Array of patients to display
   */
  patients: Patient[];
  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * Table body with scrollable patient rows
 * Clean, professional design suitable for medical applications
 */
export const PatientTableBody: React.FC<PatientTableBodyProps> = ({ patients, className = '' }) => {
  const router = useRouter();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getGenderBadgeStyle = (gender?: string) => {
    switch (gender) {
      case 'Male':
        return 'bg-blue-50 text-blue-700 border border-blue-200';
      case 'Female':
        return 'bg-purple-50 text-purple-700 border border-purple-200';
      default:
        return 'bg-gray-50 text-gray-700 border border-gray-200';
    }
  };

  const handleView = (patientId: string) => {
    router.push(`/patients/${patientId}`);
  };

  const handleEdit = (patientId: string) => {
    // TODO: Implement edit patient
    console.log('Edit patient:', patientId);
  };

  const handleDelete = (patientId: string) => {
    // TODO: Implement delete patient
    console.log('Delete patient:', patientId);
  };

  if (patients.length === 0) {
    return (
      <div className="flex h-full items-center justify-center bg-gray-50/30 py-16">
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
            <UsersIcon className="h-6 w-6 text-gray-400" />
          </div>
          <h3 className="mt-4 text-sm font-semibold text-gray-900">No patients found</h3>
          <p className="mt-2 text-sm text-gray-600">
            Get started by adding your first patient to the system.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white ${className}`}>
      {patients.map((patient, index) => (
        <div
          key={patient.id}
          className={`flex items-center gap-4 px-6 py-3.5 transition-colors hover:bg-blue-50/30 ${
            index !== patients.length - 1 ? 'border-b border-gray-100' : ''
          }`}
        >
          {/* Patient Name */}
          <div className="min-w-[160px] flex-1">
            <p className="text-sm font-medium text-gray-900">
              {patient.firstName} {patient.lastName}
            </p>
          </div>

          {/* Mobile */}
          <div className="min-w-[130px] flex-shrink-0">
            <p className="text-sm text-gray-700">{patient.mobile}</p>
          </div>

          {/* Gender */}
          <div className="min-w-[80px] flex-shrink-0">
            <span
              className={`inline-flex rounded-md px-2.5 py-1 text-xs font-medium ${getGenderBadgeStyle(patient.gender)}`}
            >
              {patient.gender || 'Not specified'}
            </span>
          </div>

          {/* Age */}
          <div className="min-w-[50px] flex-shrink-0">
            <p className="text-sm text-gray-700">{patient.age ? `${patient.age} yrs` : '—'}</p>
          </div>

          {/* Location */}
          <div className="min-w-[110px] flex-1">
            <p className="text-sm text-gray-700">{patient.location || '—'}</p>
          </div>

          {/* Registered Date */}
          <div className="min-w-[110px] flex-shrink-0">
            <p className="text-sm text-gray-700">{formatDate(patient.createdAt)}</p>
          </div>

          {/* Actions */}
          <div className="min-w-[110px] flex-shrink-0 flex gap-1.5">
            <Button
              onClick={() => handleView(patient.id)}
              variant="ghost"
              size="sm"
              icon={<EyeIcon className="h-3 w-3" />}
              title="View patient details"
              aria-label="View patient details"
            />
            <Button
              onClick={() => handleEdit(patient.id)}
              variant="ghost"
              size="sm"
              icon={<EditIcon className="h-3 w-3" />}
              title="Edit patient information"
              aria-label="Edit patient information"
            />
            <Button
              onClick={() => handleDelete(patient.id)}
              variant="ghost"
              size="sm"
              icon={<TrashIcon className="h-3 w-3" />}
              title="Delete patient record"
              aria-label="Delete patient record"
            />
          </div>
        </div>
      ))}
    </div>
  );
};
