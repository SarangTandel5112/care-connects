/**
 * Patient Table Component
 * Displays patient list with search, pagination, and actions
 * Professional medical application design
 * Following Single Responsibility Principle
 */

'use client';

import React, { useState } from 'react';
import { PatientTableToolbar } from './PatientTableToolbar';
import { PatientTableHeader } from './PatientTableHeader';
import { PatientTableBody } from './PatientTableBody';
import { PatientTableFooter } from './PatientTableFooter';
import type { Patient } from '@/types/patient';

interface PatientTableProps {
  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * Main patient table component
 * Manages table state and renders toolbar, header, body, and footer
 * Clean, professional layout suitable for medical applications
 */
export const PatientTable: React.FC<PatientTableProps> = ({ className = '' }) => {
  // Mock data for UI demonstration
  const mockPatients: Patient[] = [
    {
      id: '1',
      firstName: 'John',
      lastName: 'Doe',
      mobile: '+1234567890',
      gender: 'Male' as const,
      age: 35,
      location: 'New York',
      createdAt: '2024-01-15T10:30:00Z',
      updatedAt: '2024-01-15T10:30:00Z',
    },
    {
      id: '2',
      firstName: 'Jane',
      lastName: 'Smith',
      mobile: '+1234567891',
      gender: 'Female' as const,
      age: 28,
      location: 'Los Angeles',
      createdAt: '2024-01-16T14:20:00Z',
      updatedAt: '2024-01-16T14:20:00Z',
    },
    {
      id: '3',
      firstName: 'Robert',
      lastName: 'Johnson',
      mobile: '+1234567892',
      gender: 'Male' as const,
      age: 42,
      location: 'Chicago',
      createdAt: '2024-01-17T09:15:00Z',
      updatedAt: '2024-01-17T09:15:00Z',
    },
    {
      id: '4',
      firstName: 'Emily',
      lastName: 'Davis',
      mobile: '+1234567893',
      gender: 'Female' as const,
      age: 31,
      location: 'Houston',
      createdAt: '2024-01-18T11:45:00Z',
      updatedAt: '2024-01-18T11:45:00Z',
    },
    {
      id: '5',
      firstName: 'Michael',
      lastName: 'Wilson',
      mobile: '+1234567894',
      gender: 'Male' as const,
      age: 38,
      location: 'Phoenix',
      createdAt: '2024-01-19T16:30:00Z',
      updatedAt: '2024-01-19T16:30:00Z',
    },
    {
      id: '6',
      firstName: 'Sarah',
      lastName: 'Brown',
      mobile: '+1234567895',
      gender: 'Female' as const,
      age: 26,
      location: 'Philadelphia',
      createdAt: '2024-01-20T13:10:00Z',
      updatedAt: '2024-01-20T13:10:00Z',
    },
    {
      id: '7',
      firstName: 'David',
      lastName: 'Taylor',
      mobile: '+1234567896',
      gender: 'Male' as const,
      age: 45,
      location: 'San Antonio',
      createdAt: '2024-01-21T10:00:00Z',
      updatedAt: '2024-01-21T10:00:00Z',
    },
    {
      id: '8',
      firstName: 'Lisa',
      lastName: 'Anderson',
      mobile: '+1234567897',
      gender: 'Female' as const,
      age: 33,
      location: 'San Diego',
      createdAt: '2024-01-22T15:25:00Z',
      updatedAt: '2024-01-22T15:25:00Z',
    },
  ];

  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter patients based on search query
  const filteredPatients = mockPatients.filter(
    (patient) =>
      patient.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.mobile.includes(searchQuery)
  );

  // Calculate pagination
  const totalPages = Math.ceil(filteredPatients.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedPatients = filteredPatients.slice(startIndex, endIndex);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page on search
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleAddPatient = () => {
    // TODO: Implement add patient modal
    console.log('Add patient clicked');
  };

  return (
    <div className={`flex h-full w-full flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm ${className}`}>
      {/* Toolbar: Search and Actions */}
      <div className="flex-shrink-0 border-b border-gray-200">
        <PatientTableToolbar
          searchQuery={searchQuery}
          onSearch={handleSearch}
          onAddPatient={handleAddPatient}
          totalPatients={filteredPatients.length}
        />
      </div>

      {/* Table Content with synchronized horizontal scroll */}
      <div className="flex-1 overflow-hidden">
        {/* Combined scroll container for header and body */}
        <div className="h-full overflow-auto">
          <div className="min-w-[800px]">
            {/* Sticky Table Header */}
            <div className="sticky top-0 z-10 bg-gray-50">
              <PatientTableHeader />
            </div>

            {/* Table Body */}
            <div>
              <PatientTableBody patients={paginatedPatients} />
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Table Footer: Pagination */}
      <div className="flex-shrink-0 border-t border-gray-200 bg-white">
        <PatientTableFooter
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredPatients.length}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};
