/**
 * DocumentsSection Component
 * Document upload and management section for consultation form
 * Supports both new and existing consultations
 */

import React, { useState, useCallback } from 'react';
import { Card, Tabs, Alert, Upload, Select, Input, Checkbox, Button, Space, Tag } from 'antd';
import { InboxOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import type { FormikProps } from 'formik';
import type { UploadProps } from 'antd';
import { ConsultationFormValues } from '../types/consultation.types';
import { DocumentList } from '@/modules/documents/components/DocumentList';
import {
  useConsultationDocuments,
} from '@/modules/documents/hooks/useDocuments';
import {
  DocumentType,
  DOCUMENT_TYPE_LABELS,
  getCategoryOptions,
} from '@/modules/documents/types/document.types';
import {
  validateFile,
  formatFileSize,
  getFileIcon,
  isImageFile,
  isPDFFile,
  createFilePreviewURL,
  revokeFilePreviewURL,
  MAX_FILES_PER_UPLOAD,
} from '@/utils/s3Upload';
import { usePendingDocuments } from '../context/PendingDocumentsContext';

const { Dragger } = Upload;
const { TextArea } = Input;

interface DocumentsSectionProps {
  formik: FormikProps<ConsultationFormValues>;
  consultationId?: string; // For existing consultations
}

export const DocumentsSection: React.FC<DocumentsSectionProps> = ({
  consultationId,
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'list'>('upload');
  const { pendingFiles, addFile, removeFile } = usePendingDocuments();
  const [globalDocumentType, setGlobalDocumentType] = useState<DocumentType>(DocumentType.GENERAL);
  const [globalCategory, setGlobalCategory] = useState<string | undefined>(undefined);
  const [globalDescription, setGlobalDescription] = useState<string>('');
  const [globalIsSensitive, setGlobalIsSensitive] = useState<boolean>(false);

  // Fetch existing documents if consultationId is provided
  const { data: existingDocuments = [], isLoading, refetch } = useConsultationDocuments(consultationId);

  // Category options based on selected document type
  const categoryOptions = React.useMemo(
    () => getCategoryOptions(globalDocumentType),
    [globalDocumentType]
  );

  // Handle file selection for new consultations
  const handleFileChange = useCallback<NonNullable<UploadProps['beforeUpload']>>(
    (file, fileList) => {
      console.log('=== FILE SELECTED ===');
      console.log('File:', file.name, 'Type:', file.type, 'Size:', file.size);
      console.log('Current pending files:', pendingFiles.length);

      // Validate file
      const validation = validateFile(file);
      if (!validation.valid) {
        console.error('File validation failed:', validation.error);
        return Upload.LIST_IGNORE;
      }

      // Check max files limit
      if (pendingFiles.length + fileList.length > MAX_FILES_PER_UPLOAD) {
        console.error('Max files limit reached');
        return Upload.LIST_IGNORE;
      }

      // Create preview URL for images
      const previewUrl = isImageFile(file.type) || isPDFFile(file.type)
        ? createFilePreviewURL(file)
        : undefined;

      const pendingDoc = {
        file,
        uid: file.uid,
        previewUrl,
        documentType: globalDocumentType,
        documentCategory: globalCategory,
        description: globalDescription,
        isSensitive: globalIsSensitive,
      };

      console.log('Adding file to context:', {
        fileName: file.name,
        documentType: globalDocumentType,
        category: globalCategory,
      });

      addFile(pendingDoc);

      console.log('File added successfully');

      // Prevent default upload behavior
      return false;
    },
    [pendingFiles.length, globalDocumentType, globalCategory, globalDescription, globalIsSensitive, addFile]
  );

  // Remove pending file
  const handleRemoveFile = useCallback((uid: string) => {
    const fileToRemove = pendingFiles.find((f) => f.uid === uid);
    if (fileToRemove?.previewUrl) {
      revokeFilePreviewURL(fileToRemove.previewUrl);
    }
    removeFile(uid);
  }, [pendingFiles, removeFile]);

  // Handle document deleted (for existing consultations)
  const handleDocumentDeleted = useCallback(() => {
    refetch();
  }, [refetch]);

  // Cleanup preview URLs on unmount
  React.useEffect(() => {
    return () => {
      pendingFiles.forEach((f) => {
        if (f.previewUrl) {
          revokeFilePreviewURL(f.previewUrl);
        }
      });
    };
  }, [pendingFiles]);

  // For new consultations, show file selector
  if (!consultationId) {
    return (
      <div className="space-y-4">
        <Alert
          message="Document Upload"
          description="Select documents to upload. They will be saved when you save the consultation."
          type="info"
          showIcon
        />

        <Card title="Document Information" size="small">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Document Type *</label>
              <Select
                value={globalDocumentType}
                onChange={setGlobalDocumentType}
                className="w-full"
              >
                {Object.entries(DOCUMENT_TYPE_LABELS).map(([value, label]) => (
                  <Select.Option key={value} value={value}>
                    {label}
                  </Select.Option>
                ))}
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <Select
                value={globalCategory}
                onChange={setGlobalCategory}
                className="w-full"
                placeholder="Select category"
                allowClear
              >
                {categoryOptions.map((category) => (
                  <Select.Option key={category} value={category}>
                    {category}
                  </Select.Option>
                ))}
              </Select>
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1">Description</label>
              <TextArea
                value={globalDescription}
                onChange={(e) => setGlobalDescription(e.target.value)}
                placeholder="Enter document description (optional)"
                rows={2}
              />
            </div>

            <div className="col-span-2">
              <Checkbox
                checked={globalIsSensitive}
                onChange={(e) => setGlobalIsSensitive(e.target.checked)}
              >
                Mark as sensitive document
              </Checkbox>
            </div>
          </div>
        </Card>

        {/* File Upload Dragger */}
        <Dragger
          multiple
          maxCount={MAX_FILES_PER_UPLOAD}
          beforeUpload={handleFileChange}
          fileList={[]}
          disabled={pendingFiles.length >= MAX_FILES_PER_UPLOAD}
          accept=".pdf,.jpg,.jpeg,.png,.gif,.webp,.doc,.docx,.xls,.xlsx,.txt,.csv"
        >
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">Click or drag files to this area to upload</p>
          <p className="ant-upload-hint">
            Support for PDF, images, and documents. Maximum {MAX_FILES_PER_UPLOAD} files, 10MB each.
          </p>
        </Dragger>

        {/* Pending Files List */}
        {pendingFiles.length > 0 && (
          <Card title={`Selected Files (${pendingFiles.length}/${MAX_FILES_PER_UPLOAD})`} size="small">
            <div className="space-y-2">
              {pendingFiles.map((fileData) => (
                <div
                  key={fileData.uid}
                  className="flex items-center justify-between p-3 border border-gray-200 rounded hover:bg-gray-50"
                >
                  <div className="flex items-center space-x-3 flex-1">
                    <div className="text-2xl">{getFileIcon(fileData.file.type)}</div>
                    <div className="flex-1">
                      <div className="font-medium">{fileData.file.name}</div>
                      <div className="text-sm text-gray-500">
                        {formatFileSize(fileData.file.size)} • {DOCUMENT_TYPE_LABELS[fileData.documentType]}
                        {fileData.documentCategory && ` • ${fileData.documentCategory}`}
                      </div>
                    </div>
                  </div>

                  <Space>
                    {fileData.isSensitive && (
                      <Tag color="orange">Sensitive</Tag>
                    )}
                    {fileData.previewUrl && (
                      <Button
                        type="text"
                        icon={<EyeOutlined />}
                        onClick={() => window.open(fileData.previewUrl, '_blank')}
                      />
                    )}
                    <Button
                      type="text"
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => handleRemoveFile(fileData.uid)}
                    />
                  </Space>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Info Alert */}
        <Alert
          message="Document Upload Guidelines"
          description={
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Maximum file size: 10MB per file</li>
              <li>Supported formats: PDF, Images (JPG, PNG, GIF, WEBP), Documents (DOC, DOCX, XLS, XLSX), Text files</li>
              <li>Selected files will be uploaded when you save the consultation</li>
              <li>Documents are stored securely in encrypted S3 storage</li>
            </ul>
          }
          type="info"
          showIcon
          closable
        />
      </div>
    );
  }

  // For existing consultations, show full document management
  return (
    <div className="space-y-4">
      <Card>
        <Tabs
          activeKey={activeTab}
          onChange={(key) => setActiveTab(key as 'upload' | 'list')}
          items={[
            {
              key: 'list',
              label: `Documents (${existingDocuments.length})`,
              children: (
                <DocumentList
                  documents={existingDocuments}
                  loading={isLoading}
                  onDocumentDeleted={handleDocumentDeleted}
                  showFilters={true}
                  showActions={true}
                />
              ),
            },
          ]}
        />
      </Card>

      {/* Info Alert */}
      <Alert
        message="Document Management"
        description="To upload new documents to this consultation, use the patient's document management section in the patient profile."
        type="info"
        showIcon
        closable
      />
    </div>
  );
};

DocumentsSection.displayName = 'DocumentsSection';
