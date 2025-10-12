/**
 * Procedure Template Table - Ant Design
 * Uses Ant Design Table with real API integration
 */

import React from 'react';
import { Table, Button, Space, Tag, Skeleton } from 'antd';
import { EyeOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { ColumnsType } from 'antd/es/table';
import { ProcedureTemplate } from '../types/template.types';
import { useProcedureTemplates } from '../hooks/useTemplates';

interface ProcedureTemplateTableProps {
  onViewTemplate: (template: ProcedureTemplate) => void;
  onEditTemplate: (template: ProcedureTemplate) => void;
  onDeleteTemplate: (template: ProcedureTemplate) => void;
}

export const ProcedureTemplateTable: React.FC<ProcedureTemplateTableProps> = ({
  onViewTemplate,
  onEditTemplate,
  onDeleteTemplate,
}) => {
  const { data: templates, isLoading, error } = useProcedureTemplates();

  const columns: ColumnsType<ProcedureTemplate> = [
    {
      title: 'Procedure Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (text: string) => <span className="text-gray-900 font-medium">{text}</span>,
    },
    {
      title: 'Note',
      dataIndex: 'note',
      key: 'note',
      render: (text: string) => (
        <div className="text-sm text-gray-600 max-w-md">
          {text ? (
            <div className="whitespace-pre-line">{text}</div>
          ) : (
            <span className="text-gray-400 italic">No note</span>
          )}
        </div>
      ),
    },
    {
      title: 'Unit Cost',
      dataIndex: 'unitCost',
      key: 'unitCost',
      sorter: (a, b) => (a.unitCost || 0) - (b.unitCost || 0),
      render: (value: number) => (
        <span className="text-sm text-gray-900">{value ? `$${value.toFixed(2)}` : 'N/A'}</span>
      ),
    },
    {
      title: 'Instructions',
      dataIndex: 'instructions',
      key: 'instructions',
      render: (instructions: string[]) => (
        <div className="text-sm text-gray-900">
          {instructions && instructions.length > 0 ? (
            <Tag color="green">
              {instructions.length} instruction{instructions.length !== 1 ? 's' : ''}
            </Tag>
          ) : (
            <span className="text-gray-400 italic">No instructions</span>
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
        <p className="text-red-600">Failed to load procedure templates</p>
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
      scroll={{ x: 1000 }}
      className="bg-white"
    />
  );
};
