/**
 * DocumentsTab Component
 * Document management tab for patient details page
 * Features:
 * - Upload patient documents
 * - View all patient documents
 * - Download and delete documents
 * - Filter by type and category
 */

import React, { useState, useCallback } from 'react';
import { Card, Tabs, Button, Space } from 'antd';
import { UploadOutlined, FileTextOutlined } from '@ant-design/icons';
import { DocumentUpload } from '@/modules/documents/components/DocumentUpload';
import { DocumentList } from '@/modules/documents/components/DocumentList';
import {
  usePatientDocuments,
  useUploadPatientDocument,
} from '@/modules/documents/hooks/useDocuments';

interface DocumentsTabProps {
  patientId: string;
}

export const DocumentsTab: React.FC<DocumentsTabProps> = ({ patientId }) => {
  const [activeTab, setActiveTab] = useState<'list' | 'upload'>('list');

  // Fetch patient documents
  const { data: documents = [], isLoading, refetch } = usePatientDocuments(patientId);

  // Upload mutation
  const uploadMutation = useUploadPatientDocument(patientId);

  // Handle upload complete
  const handleUploadComplete = useCallback(
    (documentIds: string[]) => {
      console.log('Uploaded document IDs:', documentIds);
      // Switch to list tab
      setActiveTab('list');
      // Refetch documents
      refetch();
    },
    [refetch]
  );

  // Handle document deleted
  const handleDocumentDeleted = useCallback(() => {
    refetch();
  }, [refetch]);

  return (
    <div className="space-y-4">
      {/* Header with actions */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Patient Documents</h3>
          <p className="text-sm text-gray-500">
            Manage medical records, lab reports, imaging, and other patient documents
          </p>
        </div>
        <Space>
          <Button
            type={activeTab === 'list' ? 'primary' : 'default'}
            icon={<FileTextOutlined />}
            onClick={() => setActiveTab('list')}
          >
            View Documents ({documents.length})
          </Button>
          <Button
            type={activeTab === 'upload' ? 'primary' : 'default'}
            icon={<UploadOutlined />}
            onClick={() => setActiveTab('upload')}
          >
            Upload Documents
          </Button>
        </Space>
      </div>

      {/* Tabs */}
      <Card>
        <Tabs
          activeKey={activeTab}
          onChange={(key) => setActiveTab(key as 'list' | 'upload')}
          items={[
            {
              key: 'list',
              label: `All Documents (${documents.length})`,
              children: (
                <DocumentList
                  documents={documents}
                  loading={isLoading}
                  onDocumentDeleted={handleDocumentDeleted}
                  showFilters={true}
                  showActions={true}
                />
              ),
            },
            {
              key: 'upload',
              label: 'Upload Documents',
              children: (
                <DocumentUpload
                  patientId={patientId}
                  uploadMutation={uploadMutation}
                  onUploadComplete={handleUploadComplete}
                  onCancel={() => setActiveTab('list')}
                  maxFiles={10}
                />
              ),
            },
          ]}
        />
      </Card>
    </div>
  );
};

DocumentsTab.displayName = 'DocumentsTab';
