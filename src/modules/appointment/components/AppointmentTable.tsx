/**
 * Appointment Table - Ant Design
 * Uses Ant Design Table with real API integration
 */

import React from 'react';
import { Table, Button, Space, Tag, Skeleton, Input, Select } from 'antd';
import { EyeOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import { ColumnsType } from 'antd/es/table';
import { Appointment, AppointmentStatus } from '../types/appointment.types';
import { useAppointments } from '../hooks/useAppointments';

interface AppointmentTableProps {
  onViewAppointment: (appointment: Appointment) => void;
  onEditAppointment: (appointment: Appointment) => void;
  onDeleteAppointment: (appointment: Appointment) => void;
  searchFilters?: {
    status?: AppointmentStatus;
    patientId?: string;
    doctorId?: string;
  };
}

export const AppointmentTable: React.FC<AppointmentTableProps> = ({
  onViewAppointment,
  onEditAppointment,
  onDeleteAppointment,
  searchFilters,
}) => {
  const { data: appointments, isLoading, error } = useAppointments(searchFilters);

  const getStatusColor = (status: AppointmentStatus) => {
    switch (status) {
      case AppointmentStatus.SCHEDULED:
        return 'blue';
      case AppointmentStatus.CHECK_IN:
        return 'orange';
      case AppointmentStatus.CONSULTATION:
        return 'purple';
      case AppointmentStatus.COMPLETED:
        return 'green';
      case AppointmentStatus.CANCELLED:
        return 'red';
      default:
        return 'default';
    }
  };

  const formatDateTime = (date: Date) => {
    return new Date(date).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const columns: ColumnsType<Appointment> = [
    {
      title: 'Patient',
      key: 'patient',
      sorter: (a, b) =>
        `${a.patient.firstName} ${a.patient.lastName}`.localeCompare(
          `${b.patient.firstName} ${b.patient.lastName}`
        ),
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="Search by patient name"
            value={selectedKeys[0]}
            onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onPressEnter={() => confirm()}
            style={{ marginBottom: 8, display: 'block' }}
          />
          <Space>
            <Button
              type="primary"
              onClick={() => confirm()}
              icon={<SearchOutlined />}
              size="small"
              style={{ width: 90 }}
            >
              Search
            </Button>
            <Button
              onClick={() => {
                clearFilters?.();
                confirm();
              }}
              size="small"
              style={{ width: 90 }}
            >
              Reset
            </Button>
          </Space>
        </div>
      ),
      onFilter: (value, record) =>
        `${record.patient.firstName} ${record.patient.lastName}`
          .toLowerCase()
          .includes(value.toString().toLowerCase()),
      render: (_, record) => (
        <div>
          <div className="font-medium text-gray-900">
            {record.patient.firstName} {record.patient.lastName}
          </div>
          <div className="text-sm text-gray-500">{record.patient.mobile}</div>
        </div>
      ),
    },
    {
      title: 'Doctor',
      key: 'doctor',
      sorter: (a, b) =>
        `${a.doctor.firstName} ${a.doctor.lastName}`.localeCompare(
          `${b.doctor.firstName} ${b.doctor.lastName}`
        ),
      render: (_, record) => (
        <div>
          <div className="font-medium text-gray-900">
            Dr. {record.doctor.firstName} {record.doctor.lastName}
          </div>
          <div className="text-sm text-gray-500">{record.doctor.email}</div>
        </div>
      ),
    },
    {
      title: 'Date & Time',
      key: 'datetime',
      sorter: (a, b) =>
        new Date(a.appointmentStartTime).getTime() - new Date(b.appointmentStartTime).getTime(),
      render: (_, record) => (
        <div>
          <div className="font-medium text-gray-900">
            {formatDateTime(record.appointmentStartTime)}
          </div>
          <div className="text-sm text-gray-500">
            to {formatDateTime(record.appointmentEndTime)}
          </div>
        </div>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div style={{ padding: 8 }}>
          <Select
            placeholder="Filter by status"
            value={selectedKeys[0]}
            onChange={(value) => setSelectedKeys(value ? [value] : [])}
            style={{ width: 200, marginBottom: 8, display: 'block' }}
            allowClear
          >
            {Object.values(AppointmentStatus).map((status) => (
              <Select.Option key={status} value={status}>
                {status}
              </Select.Option>
            ))}
          </Select>
          <Space>
            <Button type="primary" onClick={() => confirm()} size="small" style={{ width: 90 }}>
              Filter
            </Button>
            <Button
              onClick={() => {
                clearFilters?.();
                confirm();
              }}
              size="small"
              style={{ width: 90 }}
            >
              Reset
            </Button>
          </Space>
        </div>
      ),
      onFilter: (value, record) => record.status === value,
      render: (status: AppointmentStatus) => <Tag color={getStatusColor(status)}>{status}</Tag>,
    },
    {
      title: 'Treatment',
      dataIndex: 'treatment',
      key: 'treatment',
      render: (treatment: string) => (
        <div className="text-sm text-gray-600 max-w-xs truncate">
          {treatment || <span className="text-gray-400 italic">No treatment notes</span>}
        </div>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 120,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="text"
            icon={<EyeOutlined />}
            size="small"
            onClick={() => onViewAppointment(record)}
            className="text-blue-600 hover:text-blue-800"
          />
          <Button
            type="text"
            icon={<EditOutlined />}
            size="small"
            onClick={() => onEditAppointment(record)}
            className="text-green-600 hover:text-green-800"
          />
          <Button
            type="text"
            icon={<DeleteOutlined />}
            size="small"
            onClick={() => onDeleteAppointment(record)}
            className="text-red-600 hover:text-red-800"
          />
        </Space>
      ),
    },
  ];

  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-lg">
        <Skeleton active paragraph={{ rows: 8 }} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-6 rounded-lg">
        <div className="text-center text-red-600">
          <p>Failed to load appointments</p>
          <p className="text-sm text-gray-500 mt-1">Please try again later</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <Table
        columns={columns}
        dataSource={appointments}
        rowKey="id"
        pagination={{
          total: appointments?.length || 0,
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} appointments`,
        }}
        scroll={{ x: 800 }}
        size="middle"
      />
    </div>
  );
};
