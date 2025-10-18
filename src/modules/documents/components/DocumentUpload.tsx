/**
 * DocumentUpload Component
 * Drag and drop file upload component with preview and validation
 * Features:
 * - Drag and drop support
 * - Multiple file selection
 * - File type and size validation
 * - File preview (images and PDFs)
 * - Upload progress tracking
 * - Document metadata input
 */

import React, { useState, useCallback, useMemo } from 'react';
import { Upload, Card, Select, Input, Checkbox, Button, Alert, Progress, Space, Tag } from 'antd';
import {
  InboxOutlined,
  DeleteOutlined,
  EyeOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';
import type { UploadProps } from 'antd';
import {
  DocumentType,
  DOCUMENT_TYPE_LABELS,
  getCategoryOptions,
  UploadProgress,
} from '../types/document.types';
import {
  validateFile,
  formatFileSize,
  getFileIcon,
  isImageFile,
  isPDFFile,
  createFilePreviewURL,
  revokeFilePreviewURL,
} from '@/utils/s3Upload';

const { Dragger } = Upload;
const { TextArea } = Input;

interface DocumentUploadProps {
  /** Optional patient ID - auto-fill if provided */
  patientId?: string;
  /** Optional consultation ID - auto-fill if provided */
  consultationId?: string;
  /** Callback when files are successfully uploaded */
  onUploadComplete?: (documentIds: string[]) => void;
  /** Callback when upload is cancelled */
  onCancel?: () => void;
  /** Maximum number of files allowed */
  maxFiles?: number;
  /** Upload mutation hook (from useUpload*Document hooks) */
  uploadMutation: ReturnType<typeof import('../hooks/useDocuments').useUploadPatientDocument> |
                  ReturnType<typeof import('../hooks/useDocuments').useUploadConsultationDocument>;
}

interface FileWithMetadata {
  file: File;
  uid: string;
  previewUrl?: string;
  documentType: DocumentType;
  documentCategory?: string;
  description?: string;
  isSensitive: boolean;
  uploadProgress?: UploadProgress;
}

export const DocumentUpload: React.FC<DocumentUploadProps> = ({
  onUploadComplete,
  onCancel,
  maxFiles = 10,
  uploadMutation,
}) => {
  const [files, setFiles] = useState<FileWithMetadata[]>([]);
  const [globalDocumentType, setGlobalDocumentType] = useState<DocumentType>(DocumentType.GENERAL);
  const [globalCategory, setGlobalCategory] = useState<string | undefined>(undefined);
  const [globalDescription, setGlobalDescription] = useState<string>('');
  const [globalIsSensitive, setGlobalIsSensitive] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  // Category options based on selected document type
  const categoryOptions = useMemo(
    () => getCategoryOptions(globalDocumentType),
    [globalDocumentType]
  );

  // Handle file selection
  const handleFileChange = useCallback<NonNullable<UploadProps['beforeUpload']>>(
    (file, fileList) => {
      // Validate file
      const validation = validateFile(file);
      if (!validation.valid) {
        // Show error message handled by Ant Design Upload
        return Upload.LIST_IGNORE;
      }

      // Check max files limit
      if (files.length + fileList.length > maxFiles) {
        return Upload.LIST_IGNORE;
      }

      // Create preview URL for images
      const previewUrl = isImageFile(file.type) || isPDFFile(file.type)
        ? createFilePreviewURL(file)
        : undefined;

      const fileWithMetadata: FileWithMetadata = {
        file,
        uid: file.uid,
        previewUrl,
        documentType: globalDocumentType,
        documentCategory: globalCategory,
        description: globalDescription,
        isSensitive: globalIsSensitive,
      };

      setFiles((prev) => [...prev, fileWithMetadata]);

      // Prevent default upload behavior
      return false;
    },
    [files.length, maxFiles, globalDocumentType, globalCategory, globalDescription, globalIsSensitive]
  );

  // Remove file
  const handleRemoveFile = useCallback((uid: string) => {
    setFiles((prev) => {
      const fileToRemove = prev.find((f) => f.uid === uid);
      if (fileToRemove?.previewUrl) {
        revokeFilePreviewURL(fileToRemove.previewUrl);
      }
      return prev.filter((f) => f.uid !== uid);
    });
  }, []);


  // Handle upload
  const handleUpload = useCallback(async () => {
    setIsUploading(true);
    const uploadedIds: string[] = [];

    try {
      // Upload files sequentially with progress tracking
      for (const fileData of files) {
        // Update progress: uploading
        setFiles((prev) =>
          prev.map((f) =>
            f.uid === fileData.uid
              ? {
                  ...f,
                  uploadProgress: {
                    fileName: f.file.name,
                    progress: 0,
                    status: 'uploading',
                  },
                }
              : f
          )
        );

        try {
          const result = await uploadMutation.mutateAsync({
            file: fileData.file,
            documentType: fileData.documentType,
            documentCategory: fileData.documentCategory,
            description: fileData.description,
            isSensitive: fileData.isSensitive,
          });

          uploadedIds.push(result.id);

          // Update progress: success
          setFiles((prev) =>
            prev.map((f) =>
              f.uid === fileData.uid
                ? {
                    ...f,
                    uploadProgress: {
                      fileName: f.file.name,
                      progress: 100,
                      status: 'success',
                    },
                  }
                : f
            )
          );
        } catch (error) {
          // Update progress: error
          setFiles((prev) =>
            prev.map((f) =>
              f.uid === fileData.uid
                ? {
                    ...f,
                    uploadProgress: {
                      fileName: f.file.name,
                      progress: 0,
                      status: 'error',
                      error: error instanceof Error ? error.message : 'Upload failed',
                    },
                  }
                : f
            )
          );
        }
      }

      // Call success callback with uploaded document IDs
      onUploadComplete?.(uploadedIds);

      // Clear files after successful upload
      setFiles([]);
      setGlobalDescription('');
    } finally {
      setIsUploading(false);
    }
  }, [files, uploadMutation, onUploadComplete]);

  // Cleanup preview URLs on unmount
  React.useEffect(() => {
    return () => {
      files.forEach((f) => {
        if (f.previewUrl) {
          revokeFilePreviewURL(f.previewUrl);
        }
      });
    };
  }, [files]);

  return (
    <div className="space-y-4">
      {/* Global Metadata Section */}
      <Card title="Document Information" size="small">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Document Type *</label>
            <Select
              value={globalDocumentType}
              onChange={setGlobalDocumentType}
              className="w-full"
              disabled={isUploading}
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
              disabled={isUploading}
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
              disabled={isUploading}
            />
          </div>

          <div className="col-span-2">
            <Checkbox
              checked={globalIsSensitive}
              onChange={(e) => setGlobalIsSensitive(e.target.checked)}
              disabled={isUploading}
            >
              Mark as sensitive document
            </Checkbox>
          </div>
        </div>
      </Card>

      {/* File Upload Dragger */}
      <Dragger
        multiple
        maxCount={maxFiles}
        beforeUpload={handleFileChange}
        fileList={[]}
        disabled={isUploading || files.length >= maxFiles}
        accept=".pdf,.jpg,.jpeg,.png,.gif,.webp,.doc,.docx,.xls,.xlsx,.txt,.csv"
      >
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">Click or drag files to this area to upload</p>
        <p className="ant-upload-hint">
          Support for PDF, images, and documents. Maximum {maxFiles} files, 10MB each.
        </p>
      </Dragger>

      {/* File List */}
      {files.length > 0 && (
        <Card title={`Selected Files (${files.length}/${maxFiles})`} size="small">
          <div className="space-y-2">
            {files.map((fileData) => (
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
                    {fileData.uploadProgress && (
                      <Progress
                        percent={fileData.uploadProgress.progress}
                        status={
                          fileData.uploadProgress.status === 'error'
                            ? 'exception'
                            : fileData.uploadProgress.status === 'success'
                            ? 'success'
                            : 'active'
                        }
                        size="small"
                      />
                    )}
                    {fileData.uploadProgress?.error && (
                      <Alert
                        message={fileData.uploadProgress.error}
                        type="error"
                        showIcon
                        closable
                        className="mt-2"
                      />
                    )}
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
                      disabled={isUploading}
                    />
                  )}
                  {fileData.uploadProgress?.status === 'success' && (
                    <CheckCircleOutlined className="text-green-500" />
                  )}
                  {fileData.uploadProgress?.status === 'error' && (
                    <CloseCircleOutlined className="text-red-500" />
                  )}
                  {!fileData.uploadProgress && (
                    <Button
                      type="text"
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => handleRemoveFile(fileData.uid)}
                      disabled={isUploading}
                    />
                  )}
                </Space>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex justify-end space-x-3">
        <Button onClick={onCancel} disabled={isUploading}>
          Cancel
        </Button>
        <Button
          type="primary"
          onClick={handleUpload}
          loading={isUploading}
          disabled={files.length === 0 || isUploading}
        >
          Upload {files.length > 0 && `(${files.length})`}
        </Button>
      </div>
    </div>
  );
};

DocumentUpload.displayName = 'DocumentUpload';
