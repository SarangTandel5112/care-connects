/**
 * Patient Table Component using Ant Design
 * Displays patient list with built-in pagination, filtering, and sorting
 * Professional medical application design
 * Following Single Responsibility Principle
 */

'use client';

import React, { useState, useMemo } from 'react';
import { Table, Input, Button, Space, Tag, Alert } from 'antd';
import type { TableColumnsType, TableProps } from 'antd';
import {
  SearchOutlined,
  UserAddOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import type { Patient, CreatePatient, UpdatePatient } from '@/modules/patient/types/patient.types';
import {
  usePatients,
  useCreatePatient,
  useUpdatePatient,
  useDeletePatient,
} from '@/modules/patient/hooks/usePatients';
import { PatientModal } from '@/modules/patient/components/PatientModal';
import { ConfirmationModal } from '@/components/ui/ConfirmationModal';
import { ModalMode, isCreateMode, isEditMode } from '@/types/modal.types';

interface PatientTableAntdProps {
  className?: string;
}

export const PatientTableAntd: React.FC<PatientTableAntdProps> = ({ className = '' }) => {
  const [searchText, setSearchText] = useState('');
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    mode: ModalMode;
    patient?: Patient;
  }>({
    isOpen: false,
    mode: ModalMode.CREATE,
    patient: undefined,
  });
  const [deleteConfirmState, setDeleteConfirmState] = useState<{
    isOpen: boolean;
    patient?: Patient;
  }>({
    isOpen: false,
    patient: undefined,
  });

  // Fetch patients from API
  const { data: patients = [], isLoading, isError, error } = usePatients();

  // Mutation hooks
  const createPatient = useCreatePatient();
  const updatePatient = useUpdatePatient();
  const deletePatient = useDeletePatient();

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
    const patient = patients.find((p) => p.id === patientId);
    if (patient) {
      setModalState({ isOpen: true, mode: ModalMode.VIEW, patient });
    }
  };

  const handleEdit = (patientId: string) => {
    const patient = patients.find((p) => p.id === patientId);
    if (patient) {
      setModalState({ isOpen: true, mode: ModalMode.EDIT, patient });
    }
  };

  const handleDelete = (patientId: string) => {
    const patient = patients.find((p) => p.id === patientId);
    if (patient) {
      setDeleteConfirmState({ isOpen: true, patient });
    }
  };

  const handleDeleteConfirm = () => {
    if (deleteConfirmState.patient) {
      deletePatient.mutate(deleteConfirmState.patient.id, {
        onSuccess: () => {
          setDeleteConfirmState({ isOpen: false, patient: undefined });
        },
        onError: () => {
          setDeleteConfirmState({ isOpen: false, patient: undefined });
        },
      });
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirmState({ isOpen: false, patient: undefined });
  };

  const handleAddPatient = () => {
    setModalState({ isOpen: true, mode: ModalMode.CREATE, patient: undefined });
  };

  const handleModalClose = () => {
    setModalState({ isOpen: false, mode: ModalMode.CREATE, patient: undefined });
  };

  const handleModalSave = (data: CreatePatient | UpdatePatient) => {
    if (isCreateMode(modalState.mode)) {
      createPatient.mutate(data as CreatePatient, {
        onSuccess: () => {
          handleModalClose();
        },
      });
    } else if (isEditMode(modalState.mode)) {
      updatePatient.mutate(
        { data: data as UpdatePatient, id: modalState.patient!.id },
        {
          onSuccess: () => {
            handleModalClose();
          },
        }
      );
    }
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
      fixed: 'right',
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
      position: ['bottomCenter'],
    },
    scroll: {
      x: 800,
    },
    sticky: true,
    size: 'middle',
  };

  return (
    <div className={`h-full w-full flex flex-col bg-white ${className}`}>
      {/* Toolbar - Sticky Header */}
      <div className="flex items-center justify-between gap-4 p-4 border-b border-gray-200 flex-shrink-0 bg-white z-10">
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
        <div className="p-4 flex-shrink-0">
          <Alert
            message="Error Loading Patients"
            description={
              error instanceof Error
                ? error.message
                : 'Failed to load patient data. Please try again.'
            }
            type="error"
            showIcon
            closable
          />
        </div>
      )}

      {/* Table Container - Takes remaining space */}
      <div className="flex-1 min-h-0 overflow-hidden flex flex-col">
        <style jsx global>{`
          .patient-table-wrapper .ant-table-wrapper {
            height: 100%;
            display: flex;
            flex-direction: column;
          }
          .patient-table-wrapper .ant-spin-nested-loading {
            height: 100%;
            display: flex;
            flex-direction: column;
          }
          .patient-table-wrapper .ant-spin-container {
            height: 100%;
            display: flex;
            flex-direction: column;
          }
          .patient-table-wrapper .ant-table {
            flex: 1;
            display: flex;
            flex-direction: column;
            overflow: hidden;
          }
          .patient-table-wrapper .ant-table-container {
            flex: 1;
            display: flex;
            flex-direction: column;
            overflow: hidden;
          }
          .patient-table-wrapper .ant-table-body {
            flex: 1;
            overflow-y: auto !important;
            overflow-x: auto;
          }
          .patient-table-wrapper .ant-table-pagination {
            position: sticky;
            bottom: 0;
            background: white;
            z-index: 10;
            padding: 16px 16px;
            margin: 0 !important;
            border-top: 1px solid #f0f0f0;
            flex-shrink: 0;
          }
        `}</style>
        <div className="patient-table-wrapper h-full">
          <Table {...tableProps} />
        </div>
      </div>

      {/* Patient Modal */}
      <PatientModal
        isOpen={modalState.isOpen}
        onClose={handleModalClose}
        mode={modalState.mode}
        patient={modalState.patient}
        onSave={handleModalSave}
        isLoading={createPatient.isPending || updatePatient.isPending}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteConfirmState.isOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete Patient"
        message={
          deleteConfirmState.patient
            ? `Are you sure you want to delete ${deleteConfirmState.patient.firstName} ${deleteConfirmState.patient.lastName}'s record? This action cannot be undone.`
            : 'Are you sure you want to delete this patient?'
        }
        confirmText="Yes, Delete"
        cancelText="Cancel"
        variant="danger"
        isLoading={deletePatient.isPending}
      />
    </div>
  );
};
