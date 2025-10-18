/**
 * Document API Hooks
 * React Query hooks for document operations with S3 direct upload
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import Axios from '@/setup/axios';
import {
  Document,
  CreateDocument,
  UpdateDocument,
  DocumentFilters,
  DocumentDownloadResponse,
  DocumentType,
} from '../types/document.types';
import { uploadToS3 } from '@/utils/s3Client';
import { validateFile } from '@/utils/s3Upload';

// ==================== TYPES ====================

interface ApiResponse<T> {
  code: number;
  data: T;
  message: string;
  success: boolean;
}

interface UploadFileParams {
  file: File;
  patientId?: string;
  consultationId?: string;
  documentType?: DocumentType;
  documentCategory?: string;
  description?: string;
  isSensitive?: boolean;
}

// ==================== QUERY KEYS ====================

export const documentKeys = {
  all: ['documents'] as const,
  lists: () => [...documentKeys.all, 'list'] as const,
  list: (filters: DocumentFilters) => [...documentKeys.lists(), filters] as const,
  details: () => [...documentKeys.all, 'detail'] as const,
  detail: (id: string) => [...documentKeys.details(), id] as const,
  patient: (patientId: string) => [...documentKeys.all, 'patient', patientId] as const,
  consultation: (consultationId: string) => [...documentKeys.all, 'consultation', consultationId] as const,
};

// ==================== GET DOCUMENTS ====================

/**
 * Fetch all documents with optional filters
 */
export const useDocuments = (filters?: DocumentFilters) => {
  return useQuery({
    queryKey: documentKeys.list(filters || {}),
    queryFn: async () => {
      const params = new URLSearchParams();

      if (filters?.patientId) params.append('patientId', filters.patientId);
      if (filters?.consultationId) params.append('consultationId', filters.consultationId);
      if (filters?.documentType) params.append('documentType', filters.documentType);
      if (filters?.documentCategory) params.append('documentCategory', filters.documentCategory);
      if (filters?.startDate) params.append('startDate', filters.startDate.toISOString());
      if (filters?.endDate) params.append('endDate', filters.endDate.toISOString());
      if (filters?.isSensitive !== undefined) params.append('isSensitive', String(filters.isSensitive));

      const response = await Axios.get<ApiResponse<Document[]>>(
        `/documents?${params.toString()}`
      );
      return response.data.data;
    },
    enabled: !!filters, // Only fetch if filters are provided
  });
};

/**
 * Fetch patient documents
 */
export const usePatientDocuments = (patientId?: string) => {
  return useQuery({
    queryKey: documentKeys.patient(patientId || ''),
    queryFn: async () => {
      if (!patientId) throw new Error('Patient ID is required');
      const response = await Axios.get<ApiResponse<Document[]>>(
        `/patients/${patientId}/documents`
      );
      return response.data.data;
    },
    enabled: !!patientId,
  });
};

/**
 * Fetch consultation documents
 */
export const useConsultationDocuments = (consultationId?: string) => {
  return useQuery({
    queryKey: documentKeys.consultation(consultationId || ''),
    queryFn: async () => {
      if (!consultationId) throw new Error('Consultation ID is required');
      const response = await Axios.get<ApiResponse<Document[]>>(
        `/consultations/${consultationId}/documents`
      );
      return response.data.data;
    },
    enabled: !!consultationId,
  });
};

/**
 * Fetch single document by ID
 */
export const useDocument = (documentId?: string) => {
  return useQuery({
    queryKey: documentKeys.detail(documentId || ''),
    queryFn: async () => {
      if (!documentId) throw new Error('Document ID is required');
      const response = await Axios.get<ApiResponse<Document>>(`/documents/${documentId}`);
      return response.data.data;
    },
    enabled: !!documentId,
  });
};

// ==================== UPLOAD DOCUMENT (S3 + Backend) ====================

/**
 * Upload document - uploads to S3 first, then saves metadata to backend
 */
export const useUploadDocument = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: UploadFileParams) => {
      const { file, patientId, consultationId, documentType, documentCategory, description, isSensitive } = params;

      // Validate file
      const validation = validateFile(file);
      if (!validation.valid) {
        throw new Error(validation.error);
      }

      // Determine entity type and ID
      const entityType = patientId ? 'patients' : 'consultations';
      const entityId = patientId || consultationId;

      if (!entityId) {
        throw new Error('Either patientId or consultationId is required');
      }

      // Upload to S3
      const s3Result = await uploadToS3(file, entityType, entityId, documentCategory);

      // Save metadata to backend
      const documentData: CreateDocument = {
        patientId,
        consultationId,
        fileName: s3Result.fileName,
        originalFileName: file.name,
        fileType: file.type,
        fileSize: file.size,
        s3Key: s3Result.s3Key,
        s3Url: s3Result.s3Url,
        documentCategory,
        documentType,
        description,
        isSensitive,
      };

      const response = await Axios.post<ApiResponse<Document>>(
        '/documents',
        documentData
      );

      return response.data.data;
    },
    onSuccess: (data) => {
      message.success('Document uploaded successfully');

      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: documentKeys.lists() });
      if (data.patientId) {
        queryClient.invalidateQueries({ queryKey: documentKeys.patient(data.patientId) });
      }
      if (data.consultationId) {
        queryClient.invalidateQueries({ queryKey: documentKeys.consultation(data.consultationId) });
      }
    },
    onError: (error: Error) => {
      message.error(error.message || 'Failed to upload document');
    },
  });
};

/**
 * Upload patient document
 */
export const useUploadPatientDocument = (patientId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: Omit<UploadFileParams, 'patientId'>) => {
      const { file, documentType, documentCategory, description, isSensitive } = params;

      // Validate file
      const validation = validateFile(file);
      if (!validation.valid) {
        throw new Error(validation.error);
      }

      // Upload to S3
      const s3Result = await uploadToS3(file, 'patients', patientId, documentCategory);

      // Save metadata to backend
      const documentData: CreateDocument = {
        patientId,
        fileName: s3Result.fileName,
        originalFileName: file.name,
        fileType: file.type,
        fileSize: file.size,
        s3Key: s3Result.s3Key,
        s3Url: s3Result.s3Url,
        documentCategory,
        documentType,
        description,
        isSensitive,
      };

      const response = await Axios.post<ApiResponse<Document>>(
        `/patients/${patientId}/documents`,
        documentData
      );

      return response.data.data;
    },
    onSuccess: () => {
      message.success('Patient document uploaded successfully');
      queryClient.invalidateQueries({ queryKey: documentKeys.patient(patientId) });
      queryClient.invalidateQueries({ queryKey: documentKeys.lists() });
    },
    onError: (error: Error) => {
      message.error(error.message || 'Failed to upload patient document');
    },
  });
};

/**
 * Upload consultation document
 */
export const useUploadConsultationDocument = (consultationId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: Omit<UploadFileParams, 'consultationId'>) => {
      const { file, documentType, documentCategory, description, isSensitive } = params;

      // Validate file
      const validation = validateFile(file);
      if (!validation.valid) {
        throw new Error(validation.error);
      }

      // Upload to S3
      const s3Result = await uploadToS3(file, 'consultations', consultationId, documentCategory);

      // Save metadata to backend
      const documentData: CreateDocument = {
        consultationId,
        fileName: s3Result.fileName,
        originalFileName: file.name,
        fileType: file.type,
        fileSize: file.size,
        s3Key: s3Result.s3Key,
        s3Url: s3Result.s3Url,
        documentCategory,
        documentType,
        description,
        isSensitive,
      };

      const response = await Axios.post<ApiResponse<Document>>(
        `/consultations/${consultationId}/documents`,
        documentData
      );

      return response.data.data;
    },
    onSuccess: () => {
      message.success('Consultation document uploaded successfully');
      queryClient.invalidateQueries({ queryKey: documentKeys.consultation(consultationId) });
      queryClient.invalidateQueries({ queryKey: documentKeys.lists() });
    },
    onError: (error: Error) => {
      message.error(error.message || 'Failed to upload consultation document');
    },
  });
};

// ==================== UPDATE DOCUMENT ====================

/**
 * Update document metadata
 */
export const useUpdateDocument = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateDocument) => {
      const { id, ...updateData } = data;
      const response = await Axios.patch<ApiResponse<Document>>(
        `/documents/${id}`,
        updateData
      );
      return response.data.data;
    },
    onSuccess: (data) => {
      message.success('Document updated successfully');
      queryClient.invalidateQueries({ queryKey: documentKeys.detail(data.id) });
      queryClient.invalidateQueries({ queryKey: documentKeys.lists() });
      if (data.patientId) {
        queryClient.invalidateQueries({ queryKey: documentKeys.patient(data.patientId) });
      }
      if (data.consultationId) {
        queryClient.invalidateQueries({ queryKey: documentKeys.consultation(data.consultationId) });
      }
    },
    onError: (error: Error) => {
      message.error(error.message || 'Failed to update document');
    },
  });
};

// ==================== DELETE DOCUMENT ====================

/**
 * Delete document (soft delete)
 */
export const useDeleteDocument = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (documentId: string) => {
      const response = await Axios.delete<ApiResponse<void>>(`/documents/${documentId}`);
      return response.data;
    },
    onSuccess: () => {
      message.success('Document deleted successfully');
      queryClient.invalidateQueries({ queryKey: documentKeys.all });
    },
    onError: (error: Error) => {
      message.error(error.message || 'Failed to delete document');
    },
  });
};

// ==================== DOWNLOAD DOCUMENT ====================

/**
 * Get document download URL
 */
export const useDownloadDocument = () => {
  return useMutation({
    mutationFn: async (documentId: string) => {
      const response = await Axios.get<ApiResponse<DocumentDownloadResponse>>(
        `/documents/${documentId}/download`
      );
      return response.data.data;
    },
    onSuccess: (data) => {
      // Open the S3 URL in a new window/tab
      window.open(data.url, '_blank');
    },
    onError: (error: Error) => {
      message.error(error.message || 'Failed to download document');
    },
  });
};
