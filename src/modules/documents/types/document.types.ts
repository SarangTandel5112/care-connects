/**
 * Document Module Types
 * Based on backend Document and DocumentAccessLog entities
 * All field names use camelCase to match backend convention
 */

import { Patient } from '@/modules/patient/types/patient.types';
import { Consultation } from '@/modules/consultation/types/consultation.types';

// ==================== ENUMS ====================

/**
 * Document Type Enum - matches backend
 */
export enum DocumentType {
  GENERAL = 'GENERAL',
  MEDICAL_RECORD = 'MEDICAL_RECORD',
  LAB_REPORT = 'LAB_REPORT',
  IMAGING = 'IMAGING', // X-rays, CT scans, MRI
  PRESCRIPTION = 'PRESCRIPTION',
  INSURANCE = 'INSURANCE',
  IDENTIFICATION = 'IDENTIFICATION',
}

// ==================== DOCUMENT ====================

/**
 * User Type (subset of User entity for uploadedBy)
 */
export interface DocumentUploader {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

/**
 * Main Document Entity
 */
export interface Document {
  id: string;

  // Relations
  patientId?: string;
  patient?: Patient;
  consultationId?: string;
  consultation?: Consultation;
  uploadedBy?: string;
  uploader?: DocumentUploader;

  // Document Information
  fileName: string;
  originalFileName: string;
  fileType: string; // MIME type
  fileSize: number; // File size in bytes

  // S3 Storage Information
  s3Key: string;
  s3Bucket: string;
  s3Url?: string; // Pre-signed URL or CloudFront URL

  // Document Metadata
  documentCategory?: string; // e.g., 'X-Ray', 'Lab Report', etc.
  documentType: DocumentType;
  description?: string;

  // Document Status
  isSensitive: boolean;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date; // Soft delete
}

/**
 * Create Document DTO
 * Used for saving document metadata after S3 upload
 */
export interface CreateDocument {
  patientId?: string;
  consultationId?: string;
  fileName: string;
  originalFileName: string;
  fileType: string;
  fileSize: number;
  s3Key: string;
  s3Url: string;
  documentCategory?: string;
  documentType?: DocumentType;
  description?: string;
  isSensitive?: boolean;
}

/**
 * S3 Upload Configuration
 */
export interface S3UploadConfig {
  bucket: string;
  region: string;
  accessKeyId: string;
  secretAccessKey: string;
}

/**
 * Update Document DTO
 * Used for updating document metadata only
 */
export interface UpdateDocument {
  id: string;
  documentCategory?: string;
  documentType?: DocumentType;
  description?: string;
  isSensitive?: boolean;
}

// ==================== UI/FORM HELPERS ====================

/**
 * Document Upload Form Values
 * Used for Formik form state
 */
export interface DocumentUploadFormValues {
  files: File[];
  patientId?: string;
  consultationId?: string;
  documentCategory?: string;
  documentType: DocumentType;
  description?: string;
  isSensitive: boolean;
}

/**
 * Document Filter Options
 */
export interface DocumentFilters {
  patientId?: string;
  consultationId?: string;
  documentType?: DocumentType;
  documentCategory?: string;
  startDate?: Date;
  endDate?: Date;
  isSensitive?: boolean;
}

/**
 * Document List Item
 * Simplified document representation for lists
 */
export interface DocumentListItem {
  id: string;
  fileName: string;
  originalFileName: string;
  fileType: string;
  fileSize: number;
  documentType: DocumentType;
  documentCategory?: string;
  isSensitive: boolean;
  createdAt: Date;
  uploadedBy?: string;
  uploaderName?: string;
}

/**
 * Upload Progress State
 */
export interface UploadProgress {
  fileName: string;
  progress: number; // 0-100
  status: 'uploading' | 'success' | 'error';
  error?: string;
}

/**
 * Document Download Response
 */
export interface DocumentDownloadResponse {
  url: string; // Pre-signed S3 URL
  expiresIn: number; // Expiration time in seconds
}

// ==================== CONSTANTS ====================

/**
 * Document Category Options
 * Suggested categories for different document types
 */
export const DOCUMENT_CATEGORIES = {
  MEDICAL_RECORDS: [
    'Medical History',
    'Clinical Notes',
    'Discharge Summary',
    'Medical Certificate',
  ],
  LAB_REPORTS: [
    'Blood Test',
    'Urine Test',
    'Pathology Report',
    'Culture Report',
  ],
  IMAGING: [
    'X-Ray',
    'CT Scan',
    'MRI',
    'Ultrasound',
    'Dental X-Ray',
    'Mammogram',
  ],
  PRESCRIPTIONS: [
    'Prescription',
    'Medication List',
    'Drug Chart',
  ],
  INSURANCE: [
    'Insurance Card',
    'Pre-Authorization',
    'Claim Form',
    'Insurance Letter',
  ],
  IDENTIFICATION: [
    'ID Proof',
    'Address Proof',
    'Photo ID',
    'Passport',
    'Driver License',
  ],
  OTHER: [
    'Consent Form',
    'Treatment Plan',
    'Invoice',
    'Receipt',
    'Referral Letter',
  ],
} as const;

/**
 * Get category options based on document type
 */
export const getCategoryOptions = (documentType: DocumentType): readonly string[] => {
  switch (documentType) {
    case DocumentType.MEDICAL_RECORD:
      return DOCUMENT_CATEGORIES.MEDICAL_RECORDS;
    case DocumentType.LAB_REPORT:
      return DOCUMENT_CATEGORIES.LAB_REPORTS;
    case DocumentType.IMAGING:
      return DOCUMENT_CATEGORIES.IMAGING;
    case DocumentType.PRESCRIPTION:
      return DOCUMENT_CATEGORIES.PRESCRIPTIONS;
    case DocumentType.INSURANCE:
      return DOCUMENT_CATEGORIES.INSURANCE;
    case DocumentType.IDENTIFICATION:
      return DOCUMENT_CATEGORIES.IDENTIFICATION;
    case DocumentType.GENERAL:
    default:
      return DOCUMENT_CATEGORIES.OTHER;
  }
};

/**
 * Document type display labels
 */
export const DOCUMENT_TYPE_LABELS: Record<DocumentType, string> = {
  [DocumentType.GENERAL]: 'General',
  [DocumentType.MEDICAL_RECORD]: 'Medical Record',
  [DocumentType.LAB_REPORT]: 'Lab Report',
  [DocumentType.IMAGING]: 'Imaging',
  [DocumentType.PRESCRIPTION]: 'Prescription',
  [DocumentType.INSURANCE]: 'Insurance',
  [DocumentType.IDENTIFICATION]: 'Identification',
};
