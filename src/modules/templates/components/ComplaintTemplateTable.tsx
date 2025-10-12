/**
 * Complaint Template Table - Ant Design
 * Uses Ant Design Table with real API integration
 */

import React from 'react';
import { Table, Button, Space, Skeleton } from 'antd';
import { EyeOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { ColumnsType } from 'antd/es/table';
import { ComplaintTemplate } from '../types/template.types';
import { useComplaintTemplates } from '../hooks/useTemplates';

interface ComplaintTemplateTableProps {
  onViewTemplate: (template: ComplaintTemplate) => void;
  onEditTemplate: (template: ComplaintTemplate) => void;
  onDeleteTemplate: (template: ComplaintTemplate) => void;
}

export const ComplaintTemplateTable: React.FC<ComplaintTemplateTableProps> = ({
  onViewTemplate,
  onEditTemplate,
  onDeleteTemplate,
}) => {
  const { data: templates, isLoading, error } = useComplaintTemplates();

  const columns: ColumnsType<ComplaintTemplate> = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (text: string) => <span className="text-gray-900 font-medium">{text}</span>,
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      render: (text: string) => (
        <div className="text-sm text-gray-600 max-w-md">
          {text ? (
            <div className="whitespace-pre-line">{text}</div>
          ) : (
            <span className="text-gray-400 italic">No description</span>
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
            onClick={() => onViewTemplate(record)}
            className="text-blue-600 hover:text-blue-800"
          />
          <Button
            type="text"
            icon={<EditOutlined />}
            size="small"
            onClick={() => onEditTemplate(record)}
            className="text-green-600 hover:text-green-800"
          />
          <Button
            type="text"
            icon={<DeleteOutlined />}
            size="small"
            onClick={() => onDeleteTemplate(record)}
            className="text-red-600 hover:text-red-800"
          />
        </Space>
      ),
    },
  ];

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Failed to load complaint templates</p>
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
      loading={false}
      rowKey="id"
      pagination={{
        pageSize: 10,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} templates`,
      }}
      scroll={{ x: 800 }}
      className="bg-white"
    />
  );
};
