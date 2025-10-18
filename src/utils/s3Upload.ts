/**
 * S3 Upload Utilities
 * Helper functions for uploading files to S3 and managing document uploads
 */

// Allowed file types with MIME types
export const ALLOWED_FILE_TYPES = {
  // Images
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'image/gif': ['.gif'],
  'image/webp': ['.webp'],

  // Documents
  'application/pdf': ['.pdf'],
  'application/msword': ['.doc'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
  'application/vnd.ms-excel': ['.xls'],
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
  'text/plain': ['.txt'],
  'text/csv': ['.csv'],
} as const;

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB in bytes
export const MAX_FILES_PER_UPLOAD = 10;

export interface FileValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Validate file type against allowed types
 */
export const validateFileType = (file: File): FileValidationResult => {
  const allowedTypes = Object.keys(ALLOWED_FILE_TYPES);

  if (!allowedTypes.includes(file.type)) {
    const allowedExtensions = Object.values(ALLOWED_FILE_TYPES).flat().join(', ');
    return {
      valid: false,
      error: `File type not allowed. Allowed types: ${allowedExtensions}`,
    };
  }

  return { valid: true };
};

/**
 * Validate file size
 */
export const validateFileSize = (file: File): FileValidationResult => {
  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `File size exceeds maximum allowed size of ${formatFileSize(MAX_FILE_SIZE)}`,
    };
  }

  if (file.size === 0) {
    return {
      valid: false,
      error: 'File is empty',
    };
  }

  return { valid: true };
};

/**
 * Comprehensive file validation
 */
export const validateFile = (file: File): FileValidationResult => {
  // Validate file type
  const typeValidation = validateFileType(file);
  if (!typeValidation.valid) {
    return typeValidation;
  }

  // Validate file size
  const sizeValidation = validateFileSize(file);
  if (!sizeValidation.valid) {
    return sizeValidation;
  }

  return { valid: true };
};

/**
 * Validate multiple files
 */
export const validateFiles = (files: File[]): FileValidationResult => {
  if (files.length === 0) {
    return {
      valid: false,
      error: 'No files selected',
    };
  }

  if (files.length > MAX_FILES_PER_UPLOAD) {
    return {
      valid: false,
      error: `Maximum ${MAX_FILES_PER_UPLOAD} files allowed per upload`,
    };
  }

  // Validate each file
  for (const file of files) {
    const validation = validateFile(file);
    if (!validation.valid) {
      return {
        valid: false,
        error: `${file.name}: ${validation.error}`,
      };
    }
  }

  return { valid: true };
};

/**
 * Format file size in human-readable format
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
};

/**
 * Sanitize filename for S3 storage
 * Removes special characters and spaces, preserves extension
 */
export const sanitizeFileName = (fileName: string): string => {
  const lastDotIndex = fileName.lastIndexOf('.');
  const name = fileName.substring(0, lastDotIndex);
  const extension = fileName.substring(lastDotIndex);

  // Remove special characters and replace spaces with hyphens
  const sanitizedName = name
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

  return `${sanitizedName}${extension}`;
};

/**
 * Generate S3 key for document upload
 */
export const generateS3Key = (
  entityType: 'patients' | 'consultations',
  entityId: string,
  fileName: string,
  category?: string
): string => {
  const timestamp = Date.now();
  const uuid = crypto.randomUUID();
  const sanitizedFileName = sanitizeFileName(fileName);

  if (entityType === 'patients' && category) {
    const sanitizedCategory = category.toLowerCase().replace(/\s+/g, '-');
    return `${entityType}/${entityId}/${sanitizedCategory}/${timestamp}-${uuid}-${sanitizedFileName}`;
  }

  return `${entityType}/${entityId}/${timestamp}-${uuid}-${sanitizedFileName}`;
};

/**
 * Get file extension from filename
 */
export const getFileExtension = (fileName: string): string => {
  const lastDotIndex = fileName.lastIndexOf('.');
  if (lastDotIndex === -1) return '';
  return fileName.substring(lastDotIndex);
};

/**
 * Get file icon based on file type
 */
export const getFileIcon = (fileType: string): string => {
  if (fileType.startsWith('image/')) return '🖼️';
  if (fileType === 'application/pdf') return '📄';
  if (fileType.includes('word')) return '📝';
  if (fileType.includes('excel') || fileType.includes('spreadsheet')) return '📊';
  if (fileType.startsWith('text/')) return '📃';
  return '📎';
};

/**
 * Create FormData for file upload
 */
export const createUploadFormData = (
  file: File,
  metadata: {
    patientId?: string;
    consultationId?: string;
    documentCategory?: string;
    documentType?: string;
    description?: string;
  }
): FormData => {
  const formData = new FormData();
  formData.append('file', file);

  if (metadata.patientId) formData.append('patientId', metadata.patientId);
  if (metadata.consultationId) formData.append('consultationId', metadata.consultationId);
  if (metadata.documentCategory) formData.append('documentCategory', metadata.documentCategory);
  if (metadata.documentType) formData.append('documentType', metadata.documentType);
  if (metadata.description) formData.append('description', metadata.description);

  return formData;
};

/**
 * Check if file is an image
 */
export const isImageFile = (fileType: string): boolean => {
  return fileType.startsWith('image/');
};

/**
 * Check if file is a PDF
 */
export const isPDFFile = (fileType: string): boolean => {
  return fileType === 'application/pdf';
};

/**
 * Create object URL for file preview
 */
export const createFilePreviewURL = (file: File): string => {
  return URL.createObjectURL(file);
};

/**
 * Revoke object URL to free memory
 */
export const revokeFilePreviewURL = (url: string): void => {
  URL.revokeObjectURL(url);
};

/**
 * Extract file information for display
 */
export interface FileInfo {
  name: string;
  size: string;
  type: string;
  icon: string;
  isImage: boolean;
  isPDF: boolean;
}

export const getFileInfo = (file: File): FileInfo => {
  return {
    name: file.name,
    size: formatFileSize(file.size),
    type: file.type,
    icon: getFileIcon(file.type),
    isImage: isImageFile(file.type),
    isPDF: isPDFFile(file.type),
  };
};
