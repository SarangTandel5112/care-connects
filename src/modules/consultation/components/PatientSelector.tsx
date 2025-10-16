/**
 * Patient Selector Component for Consultation Page
 * Searchable dropdown to select a patient
 * Updates URL with patientId when selected
 */

import React, { useState } from 'react';
import { Input } from '@/components/ui';
import { SearchOutlined, UserOutlined } from '@ant-design/icons';
import { usePatients } from '@/modules/patient/hooks/usePatients';
import { Patient } from '@/modules/patient/types/patient.types';

interface PatientSelectorProps {
  onPatientSelect: (patientId: string) => void;
}

export const PatientSelector: React.FC<PatientSelectorProps> = ({ onPatientSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Fetch patients based on search term
  const { data: patients = [], isLoading } = usePatients({
    search: searchTerm,
    page: 1,
    limit: 20,
  });

  const handlePatientClick = (patient: Patient) => {
    onPatientSelect(patient.id);
    setSearchTerm('');
    setIsDropdownOpen(false);
  };

  return (
    <div className="bg-white rounded-lg p-8 mb-6 border-2 border-dashed border-gray-300 shadow-sm">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <UserOutlined className="text-3xl text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Select Patient</h2>
          <p className="text-gray-600">Search and select a patient to start the consultation</p>
        </div>

        {/* Search Input */}
        <div className="relative">
          <div className="relative">
            <SearchOutlined className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
            <Input
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setIsDropdownOpen(true);
              }}
              onFocus={() => setIsDropdownOpen(true)}
              placeholder="Search by name or mobile number..."
              className="pl-12 pr-4 py-3 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg shadow-sm"
            />
          </div>

          {/* Dropdown */}
          {isDropdownOpen && searchTerm.length >= 3 && (
            <div className="absolute z-10 w-full mt-2 bg-white border border-gray-300 rounded-lg shadow-xl max-h-80 overflow-y-auto">
              {isLoading ? (
                <div className="px-6 py-4 text-center text-gray-500">
                  <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mb-2"></div>
                  <p className="text-sm">Searching patients...</p>
                </div>
              ) : patients.length > 0 ? (
                <div className="py-2">
                  {patients.map((patient) => (
                    <div
                      key={patient.id}
                      onClick={() => handlePatientClick(patient)}
                      className="px-6 py-4 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        {/* Avatar */}
                        <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold text-sm">
                            {patient.firstName.charAt(0)}
                            {patient.lastName.charAt(0)}
                          </span>
                        </div>

                        {/* Patient Info */}
                        <div className="flex-1 min-w-0">
                          <p className="text-base font-semibold text-gray-900">
                            {patient.firstName} {patient.lastName}
                          </p>
                          <div className="flex items-center gap-3 mt-0.5">
                            <span className="text-sm text-gray-600">{patient.mobile}</span>
                            {patient.location && (
                              <>
                                <span className="text-gray-400">•</span>
                                <span className="text-sm text-gray-600 truncate">
                                  {patient.location}
                                </span>
                              </>
                            )}
                          </div>
                        </div>

                        {/* Age/Gender Badge */}
                        {(patient.age || patient.gender) && (
                          <div className="flex-shrink-0 bg-gray-100 px-3 py-1 rounded-full">
                            <span className="text-xs font-medium text-gray-700">
                              {patient.age && `${patient.age}y`}
                              {patient.age && patient.gender && ' • '}
                              {patient.gender && patient.gender.charAt(0)}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="px-6 py-8 text-center text-gray-500">
                  <UserOutlined className="text-4xl text-gray-300 mb-3" />
                  <p className="text-sm font-medium">No patients found</p>
                  <p className="text-xs mt-1">Try searching with a different name or number</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Helper Text */}
        {searchTerm.length > 0 && searchTerm.length < 3 && (
          <p className="mt-3 text-sm text-gray-500 text-center">
            Type at least 3 characters to search...
          </p>
        )}

        {searchTerm.length === 0 && (
          <p className="mt-3 text-sm text-gray-500 text-center">
            Start typing patient name or mobile number to search
          </p>
        )}
      </div>
    </div>
  );
};

PatientSelector.displayName = 'PatientSelector';
