/**
 * Medicine Template Table - Ant Design
 * Uses Ant Design Table with real API integration
 */

import React from 'react';
import { Table, Button, Space, Tag, Skeleton } from 'antd';
import { EyeOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { ColumnsType } from 'antd/es/table';
import { MedicineTemplate, MedicineType } from '../types/template.types';
import { useMedicineTemplates } from '../hooks/useTemplates';

interface MedicineTemplateTableProps {
  onViewTemplate: (template: MedicineTemplate) => void;
  onEditTemplate: (template: MedicineTemplate) => void;
  onDeleteTemplate: (template: MedicineTemplate) => void;
  isCreating?: boolean;
  isUpdating?: boolean;
  isDeleting?: boolean;
}

export const MedicineTemplateTable: React.FC<MedicineTemplateTableProps> = ({
  onViewTemplate,
  onEditTemplate,
  onDeleteTemplate,
  isCreating = false,
  isUpdating = false,
  isDeleting = false,
}) => {
  const { data: templates, isLoading, error } = useMedicineTemplates();

  const getMedicineTypeColor = (type: MedicineType) => {
    const colors: Record<MedicineType, string> = {
      tablet: 'blue',
      capsule: 'green',
      drop: 'orange',
      syrup: 'purple',
      injection: 'red',
      ointment: 'cyan',
      suspension: 'magenta',
      powder: 'lime',
      cream: 'gold',
      gel: 'volcano',
      liquid: 'blue',
      oil: 'orange',
      drops: 'cyan',
      foam: 'purple',
      inhaler: 'green',
      lotion: 'pink',
      mouthwash: 'blue',
      shampoo: 'brown',
      spray: 'cyan',
      syringe: 'red',
    };
    return colors[type] || 'default';
  };

  const columns: ColumnsType<MedicineTemplate> = [
    {
      title: 'Medicine Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (text: string) => <span className="text-gray-900 font-medium">{text}</span>,
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      filters: Object.values(MedicineType).map((type) => ({ text: type, value: type })),
      onFilter: (value, record) => record.type === value,
      render: (type: MedicineType) => (
        <Tag color={getMedicineTypeColor(type)}>{type.charAt(0).toUpperCase() + type.slice(1)}</Tag>
      ),
    },
    {
      title: 'Strength',
      dataIndex: 'strength',
      key: 'strength',
      render: (text: string) => <span className="text-sm text-gray-600">{text || 'N/A'}</span>,
    },
    {
      title: 'Company',
      dataIndex: 'company',
      key: 'company',
      render: (text: string) => <span className="text-sm text-gray-600">{text || 'N/A'}</span>,
    },
    {
      title: 'Duration',
      dataIndex: 'duration',
      key: 'duration',
      render: (value: number, record) => (
        <span className="text-sm text-gray-600">
          {value && record.durationType ? `${value} ${record.durationType}` : 'N/A'}
        </span>
      ),
    },
    {
      title: 'Dosage',
      key: 'dosage',
      render: (_, record) => {
        const dosages = [];
        if (record.morning) dosages.push(`M: ${record.morning}`);
        if (record.noon) dosages.push(`N: ${record.noon}`);
        if (record.evening) dosages.push(`E: ${record.evening}`);
        return (
          <div className="text-sm text-gray-600">
            {dosages.length > 0 ? dosages.join(', ') : 'N/A'}
          </div>
        );
      },
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
            onClick={() => onViewTemplate(record)}
            className="text-blue-600 hover:text-blue-800"
          />
          <Button
            type="text"
            icon={<EditOutlined />}
            size="small"
            onClick={() => onEditTemplate(record)}
            disabled={isUpdating || isDeleting}
            loading={isUpdating}
            className="text-green-600 hover:text-green-800"
          />
          <Button
            type="text"
            icon={<DeleteOutlined />}
            size="small"
            onClick={() => onDeleteTemplate(record)}
            disabled={isUpdating || isDeleting}
            loading={isDeleting}
            className="text-red-600 hover:text-red-800"
          />
        </Space>
      ),
    },
  ];

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Failed to load medicine templates</p>
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
      dataSource={templates || []}
      loading={isLoading || isCreating}
      rowKey="id"
      pagination={{
        pageSize: 10,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} templates`,
      }}
      scroll={{ x: 1200 }}
      className="bg-white"
    />
  );
};
