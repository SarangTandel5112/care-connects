/**
 * Patient Table - Ant Design
 * Uses Ant Design Table with real API integration
 */

import React, { memo } from 'react';
import { Table, Button, Space, Tag, Skeleton, Input, Select } from 'antd';
import { EyeOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import { ColumnsType } from 'antd/es/table';
import { Patient, Gender, PatientGroup } from '../types/patient.types';
import { usePatients } from '../hooks/usePatients';

interface PatientTableProps {
  onViewPatient: (patient: Patient) => void;
  onEditPatient: (patient: Patient) => void;
  onDeletePatient: (patient: Patient) => void;
  searchFilters?: {
    search?: string;
    gender?: Gender;
    patientGroup?: PatientGroup;
  };
}

const PatientTableComponent: React.FC<PatientTableProps> = ({
  onViewPatient,
  onEditPatient,
  onDeletePatient,
  searchFilters,
}) => {
  const { data: patients, isLoading, error } = usePatients(searchFilters);

  const getGenderColor = (gender?: Gender) => {
    switch (gender) {
      case Gender.MALE:
        return 'blue';
      case Gender.FEMALE:
        return 'pink';
      case Gender.OTHER:
        return 'purple';
      default:
        return 'default';
    }
  };

  const getPatientGroupColor = (group?: PatientGroup) => {
    switch (group) {
      case PatientGroup.FAMILY:
        return 'green';
      case PatientGroup.FRIENDS:
        return 'orange';
      case PatientGroup.OTHERS:
        return 'gray';
      default:
        return 'default';
    }
  };

  const columns: ColumnsType<Patient> = [
    {
      title: 'Name',
      key: 'name',
      sorter: (a, b) =>
        `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`),
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="Search by name"
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
        `${record.firstName} ${record.lastName}`
          .toLowerCase()
          .includes(value.toString().toLowerCase()),
      render: (_, record) => (
        <span className="font-medium text-gray-900">
          {record.firstName} {record.lastName}
        </span>
      ),
    },
    {
      title: 'Number',
      dataIndex: 'mobile',
      key: 'mobile',
      width: 120,
      sorter: (a, b) => (a.mobile || '').localeCompare(b.mobile || ''),
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="Search by mobile"
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
        (record.mobile || '').toLowerCase().includes(value.toString().toLowerCase()),
      render: (mobile: string) => <span className="text-gray-900 font-medium">{mobile}</span>,
    },
    {
      title: 'Age',
      dataIndex: 'age',
      key: 'age',
      width: 80,
      sorter: (a, b) => (a.age || 0) - (b.age || 0),
      render: (age: number) => <span className="text-gray-900">{age ? `${age} years` : '-'}</span>,
    },
    {
      title: 'Gender',
      dataIndex: 'gender',
      key: 'gender',
      width: 100,
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div style={{ padding: 8 }}>
          <Select
            placeholder="Filter by gender"
            value={selectedKeys[0]}
            onChange={(value) => setSelectedKeys(value ? [value] : [])}
            style={{ width: 200, marginBottom: 8, display: 'block' }}
            allowClear
          >
            {Object.values(Gender).map((gender) => (
              <Select.Option key={gender} value={gender}>
                {gender}
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
      onFilter: (value, record) => record.gender === value,
      render: (gender: Gender) =>
        gender ? <Tag color={getGenderColor(gender)}>{gender}</Tag> : '-',
    },
    {
      title: 'Location',
      dataIndex: 'location',
      key: 'location',
      sorter: (a, b) => (a.location || '').localeCompare(b.location || ''),
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="Search by location"
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
        (record.location || '').toLowerCase().includes(value.toString().toLowerCase()),
      render: (location: string) => (
        <div className="text-sm text-gray-600 max-w-xs truncate">
          {location || <span className="text-gray-400 italic">Not specified</span>}
        </div>
      ),
    },
    {
      title: 'Group',
      dataIndex: 'patientGroup',
      key: 'patientGroup',
      sorter: (a, b) => (a.patientGroup || '').localeCompare(b.patientGroup || ''),
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div style={{ padding: 8 }}>
          <Select
            placeholder="Filter by group"
            value={selectedKeys[0]}
            onChange={(value) => setSelectedKeys(value ? [value] : [])}
            style={{ width: 200, marginBottom: 8, display: 'block' }}
            allowClear
          >
            {Object.values(PatientGroup).map((group) => (
              <Select.Option key={group} value={group}>
                {group}
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
      onFilter: (value, record) => record.patientGroup === value,
      render: (group: PatientGroup) => (
        <div>
          {group ? (
            <Tag color={getPatientGroupColor(group)}>{group}</Tag>
          ) : (
            <span className="text-gray-400 text-sm">Not assigned</span>
          )}
        </div>
      ),
    },
    {
      title: 'Medical Conditions',
      dataIndex: 'medicalConditions',
      key: 'medicalConditions',
      sorter: (a, b) => (a.medicalConditions?.length || 0) - (b.medicalConditions?.length || 0),
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="Search by condition"
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
        record.medicalConditions?.some((condition) =>
          condition.toLowerCase().includes(value.toString().toLowerCase())
        ) || false,
      render: (conditions: string[]) => (
        <div className="max-w-xs">
          {conditions && conditions.length > 0 ? (
            <div className="flex flex-wrap gap-1">
              {conditions.slice(0, 2).map((condition, index) => (
                <Tag key={index} color="red">
                  {condition}
                </Tag>
              ))}
              {conditions.length > 2 && <Tag color="default">+{conditions.length - 2}</Tag>}
            </div>
          ) : (
            <span className="text-gray-400 text-sm">None</span>
          )}
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
            onClick={() => onViewPatient(record)}
            className="text-blue-600 hover:text-blue-800"
          />
          <Button
            type="text"
            icon={<EditOutlined />}
            size="small"
            onClick={() => onEditPatient(record)}
            className="text-green-600 hover:text-green-800"
          />
          <Button
            type="text"
            icon={<DeleteOutlined />}
            size="small"
            onClick={() => onDeletePatient(record)}
            className="text-red-600 hover:text-red-800"
          />
        </Space>
      ),
    },
  ];

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Failed to load patients</p>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-lg">
        <Skeleton active paragraph={{ rows: 8 }} />
      </div>
    );
  }

  return (
    <Table
      columns={columns}
      dataSource={patients || []}
      loading={isLoading}
      rowKey="id"
      pagination={{
        pageSize: 10,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} patients`,
      }}
      scroll={{ x: 1000 }}
      className="bg-white"
      showSorterTooltip={false}
    />
  );
};

// Memoize component to prevent unnecessary re-renders
export const PatientTable = memo(PatientTableComponent);
PatientTable.displayName = 'PatientTable';
