/**
 * DocumentList Component
 * Display list of documents with download, view, and delete actions
 */

import React, { useState, useMemo } from 'react';
import { Table, Button, Space, Tag, Modal, Input, Select, Tooltip, Empty } from 'antd';
import {
  DownloadOutlined,
  DeleteOutlined,
  LockOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { Document, DocumentType, DOCUMENT_TYPE_LABELS } from '../types/document.types';
import { useDeleteDocument, useDownloadDocument } from '../hooks/useDocuments';
import { formatFileSize, getFileIcon } from '@/utils/s3Upload';
import { format } from 'date-fns';

const { Search } = Input;

interface DocumentListProps {
  documents: Document[];
  loading?: boolean;
  onDocumentDeleted?: () => void;
  showFilters?: boolean;
  showActions?: boolean;
}

export const DocumentList: React.FC<DocumentListProps> = ({
  documents,
  loading = false,
  onDocumentDeleted,
  showFilters = true,
  showActions = true,
}) => {
  const [searchText, setSearchText] = useState<string>('');
  const [selectedType, setSelectedType] = useState<DocumentType | undefined>(undefined);
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);

  const deleteDocument = useDeleteDocument();
  const downloadDocument = useDownloadDocument();

  // Filter documents
  const filteredDocuments = useMemo(() => {
    return documents.filter((doc) => {
      // Search filter
      if (searchText) {
        const searchLower = searchText.toLowerCase();
        const matchesFileName = doc.fileName.toLowerCase().includes(searchLower);
        const matchesOriginalName = doc.originalFileName.toLowerCase().includes(searchLower);
        const matchesDescription = doc.description?.toLowerCase().includes(searchLower);
        if (!matchesFileName && !matchesOriginalName && !matchesDescription) {
          return false;
        }
      }

      // Type filter
      if (selectedType && doc.documentType !== selectedType) {
        return false;
      }

      // Category filter
      if (selectedCategory && doc.documentCategory !== selectedCategory) {
        return false;
      }

      return true;
    });
  }, [documents, searchText, selectedType, selectedCategory]);

  // Get unique categories from documents
  const availableCategories = useMemo(() => {
    const categories = new Set<string>();
    documents.forEach((doc) => {
      if (doc.documentCategory) {
        categories.add(doc.documentCategory);
      }
    });
    return Array.from(categories).sort();
  }, [documents]);

  // Handle delete
  const handleDelete = (document: Document) => {
    Modal.confirm({
      title: 'Delete Document',
      content: `Are you sure you want to delete "${document.originalFileName}"? This action cannot be undone.`,
      okText: 'Delete',
      okType: 'danger',
      onOk: async () => {
        await deleteDocument.mutateAsync(document.id);
        onDocumentDeleted?.();
      },
    });
  };

  // Handle download
  const handleDownload = (documentId: string) => {
    downloadDocument.mutate(documentId);
  };

  // Table columns
  const columns: ColumnsType<Document> = [
    {
      title: 'File',
      dataIndex: 'originalFileName',
      key: 'originalFileName',
      width: '30%',
      render: (text: string, record: Document) => (
        <Space>
          <span className="text-2xl">{getFileIcon(record.fileType)}</span>
          <div>
            <div className="font-medium">{text}</div>
            <div className="text-xs text-gray-500">{formatFileSize(record.fileSize)}</div>
          </div>
        </Space>
      ),
    },
    {
      title: 'Type',
      dataIndex: 'documentType',
      key: 'documentType',
      width: '15%',
      render: (type: DocumentType) => (
        <Tag color="blue">{DOCUMENT_TYPE_LABELS[type]}</Tag>
      ),
    },
    {
      title: 'Category',
      dataIndex: 'documentCategory',
      key: 'documentCategory',
      width: '15%',
      render: (category?: string) => category || '-',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      width: '20%',
      ellipsis: true,
      render: (description?: string) => description || '-',
    },
    {
      title: 'Uploaded',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: '12%',
      render: (date: Date) => format(new Date(date), 'MMM dd, yyyy'),
      sorter: (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    },
    ...(showActions
      ? [
          {
            title: 'Actions',
            key: 'actions',
            width: '8%',
            render: (_: unknown, record: Document) => (
              <Space>
                {record.isSensitive && (
                  <Tooltip title="Sensitive Document">
                    <LockOutlined className="text-orange-500" />
                  </Tooltip>
                )}
                <Tooltip title="Download">
                  <Button
                    type="text"
                    size="small"
                    icon={<DownloadOutlined />}
                    onClick={() => handleDownload(record.id)}
                    loading={downloadDocument.isPending}
                  />
                </Tooltip>
                <Tooltip title="Delete">
                  <Button
                    type="text"
                    size="small"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => handleDelete(record)}
                    loading={deleteDocument.isPending}
                  />
                </Tooltip>
              </Space>
            ),
          } as ColumnsType<Document>[number],
        ]
      : []),
  ];

  return (
    <div className="space-y-4">
      {/* Filters */}
      {showFilters && (
        <div className="flex gap-3">
          <Search
            placeholder="Search documents..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onSearch={setSearchText}
            allowClear
            className="flex-1"
          />
          <Select
            placeholder="All Types"
            value={selectedType}
            onChange={setSelectedType}
            allowClear
            className="w-48"
          >
            {Object.entries(DOCUMENT_TYPE_LABELS).map(([value, label]) => (
              <Select.Option key={value} value={value}>
                {label}
              </Select.Option>
            ))}
          </Select>
          <Select
            placeholder="All Categories"
            value={selectedCategory}
            onChange={setSelectedCategory}
            allowClear
            className="w-48"
          >
            {availableCategories.map((category) => (
              <Select.Option key={category} value={category}>
                {category}
              </Select.Option>
            ))}
          </Select>
        </div>
      )}

      {/* Table */}
      <Table
        columns={columns}
        dataSource={filteredDocuments}
        loading={loading}
        rowKey="id"
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `Total ${total} documents`,
        }}
        locale={{
          emptyText: (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="No documents found"
            />
          ),
        }}
      />
    </div>
  );
};

DocumentList.displayName = 'DocumentList';
