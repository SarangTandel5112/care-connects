/**
 * Patient Table Component using Ant Design
 * Displays patient list with built-in pagination, filtering, and sorting
 * Professional medical application design
 * Following Single Responsibility Principle
 */

'use client';

import React, { useState, useMemo } from 'react';
import { Table, Input, Button, Space, Tag, Dropdown, Spin, Alert } from 'antd';
import type { TableColumnsType, TableProps } from 'antd';
import {
  SearchOutlined,
  UserAddOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import type { Patient } from '@/modules/patient/types/patient.types';
import { usePatients } from '@/modules/patient/hooks/usePatients';

interface PatientTableAntdProps {
  className?: string;
}

export const PatientTableAntd: React.FC<PatientTableAntdProps> = ({ className = '' }) => {
  const [searchText, setSearchText] = useState('');

  // Fetch patients from API
  const { data: patients = [], isLoading, isError, error } = usePatients();

  // Filter patients based on search text
  const filteredPatients = useMemo(() => {
    if (!searchText) return patients;

    return patients.filter(
      (patient) =>
        patient.firstName.toLowerCase().includes(searchText.toLowerCase()) ||
        patient.lastName.toLowerCase().includes(searchText.toLowerCase()) ||
        patient.mobile.includes(searchText)
    );
  }, [patients, searchText]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const handleSearch = (value: string) => {
    setSearchText(value);
  };

  const handleView = (patientId: string) => {
    console.log('View patient:', patientId);
  };

  const handleEdit = (patientId: string) => {
    console.log('Edit patient:', patientId);
  };

  const handleDelete = (patientId: string) => {
    console.log('Delete patient:', patientId);
  };

  const handleAddPatient = () => {
    console.log('Add patient clicked');
  };

  const columns: TableColumnsType<Patient> = [
    {
      title: 'Patient Name',
      dataIndex: 'firstName',
      key: 'name',
      sorter: (a, b) =>
        `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`),
      render: (_, record) => (
        <span className="font-medium text-gray-900">
          {record.firstName} {record.lastName}
        </span>
      ),
    },
    {
      title: 'Mobile Number',
      dataIndex: 'mobile',
      key: 'mobile',
      sorter: (a, b) => a.mobile.localeCompare(b.mobile),
    },
    {
      title: 'Gender',
      dataIndex: 'gender',
      key: 'gender',
      filters: [
        { text: 'Male', value: 'Male' },
        { text: 'Female', value: 'Female' },
      ],
      onFilter: (value, record) => record.gender === value,
      render: (gender: string) => <Tag color={gender === 'Male' ? 'blue' : 'purple'}>{gender}</Tag>,
    },
    {
      title: 'Age',
      dataIndex: 'age',
      key: 'age',
      sorter: (a, b) => (a.age || 0) - (b.age || 0),
      render: (age: number) => (age ? `${age} yrs` : '—'),
    },
    {
      title: 'Location',
      dataIndex: 'location',
      key: 'location',
      sorter: (a, b) => (a.location || '').localeCompare(b.location || ''),
    },
    {
      title: 'Registration Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      sorter: (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      render: (date: string) => formatDate(date),
    },
    {
      title: '',
      key: 'action',
      width: 120,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="text"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => handleView(record.id)}
            title="View patient details"
          />
          <Button
            type="text"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record.id)}
            title="Edit patient information"
          />
          <Button
            type="text"
            size="small"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
            title="Delete patient record"
          />
        </Space>
      ),
    },
  ];

  const tableProps: TableProps<Patient> = {
    columns,
    dataSource: filteredPatients,
    rowKey: 'id',
    loading: isLoading,
    pagination: {
      defaultPageSize: 10,
      showSizeChanger: true,
      showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} patients`,
      pageSizeOptions: ['5', '10', '20', '50'],
    },
    scroll: {
      x: 800,
      y: 320, // Balanced height for optimal pagination positioning
    },
    sticky: {
      offsetHeader: 0, // No offset needed since we're in a contained layout
    },
    size: 'middle',
  };

  return (
    <div className={`h-full w-full flex flex-col bg-white p-2 ${className}`}>
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-4 p-4 border-b border-gray-200 flex-shrink-0">
        <Input
          placeholder="Search patients by name or mobile..."
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={(e) => handleSearch(e.target.value)}
          allowClear
          style={{ maxWidth: 400 }}
        />
        <Button type="primary" icon={<UserAddOutlined />} onClick={handleAddPatient}>
          <span className="hidden sm:inline">Add Patient</span>
        </Button>
      </div>

      {/* Error State */}
      {isError && (
        <div className="p-4">
          <Alert
            message="Error Loading Patients"
            description={
              (error as any)?.message || 'Failed to load patient data. Please try again.'
            }
            type="error"
            showIcon
            closable
          />
        </div>
      )}

      {/* Table */}
      <div className="flex-1 min-h-0">
        <Table {...tableProps} />
      </div>
    </div>
  );
};
