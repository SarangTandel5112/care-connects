/**
 * S3 Client for Direct File Uploads
 * Uses AWS SDK v3 for browser-based S3 uploads
 */

import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { generateS3Key, sanitizeFileName } from './s3Upload';
import { S3UploadConfig } from '@/modules/documents/types/document.types';

/**
 * Get S3 configuration from environment variables
 */
export const getS3Config = (): S3UploadConfig => {
  return {
    bucket: process.env.NEXT_PUBLIC_S3_BUCKET || '',
    region: process.env.NEXT_PUBLIC_S3_REGION || 'us-east-1',
    accessKeyId: process.env.NEXT_PUBLIC_S3_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.NEXT_PUBLIC_S3_SECRET_ACCESS_KEY || '',
  };
};

/**
 * Create S3 client instance
 */
export const createS3Client = (config: S3UploadConfig): S3Client => {
  return new S3Client({
    region: config.region,
    credentials: {
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey,
    },
  });
};

/**
 * Upload file directly to S3
 * @param file - File to upload
 * @param entityType - 'patients' or 'consultations'
 * @param entityId - Patient or consultation ID
 * @param category - Optional document category
 * @param onProgress - Optional progress callback
 * @returns S3 upload result with key, bucket, and URL
 */
export const uploadToS3 = async (
  file: File,
  entityType: 'patients' | 'consultations',
  entityId: string,
  category?: string,
  onProgress?: (progress: number) => void
): Promise<{
  s3Key: string;
  s3Bucket: string;
  s3Url: string;
  fileName: string;
}> => {
  const config = getS3Config();

  if (!config.bucket || !config.accessKeyId || !config.secretAccessKey) {
    throw new Error('S3 configuration is missing. Please set environment variables.');
  }

  // Generate S3 key
  const s3Key = generateS3Key(entityType, entityId, file.name, category);
  const sanitizedName = sanitizeFileName(file.name);

  // Create S3 client
  const s3Client = createS3Client(config);

  try {
    // Convert File to ArrayBuffer for browser compatibility
    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);

    // Upload file to S3
    const command = new PutObjectCommand({
      Bucket: config.bucket,
      Key: s3Key,
      Body: uint8Array,
      ContentType: file.type,
      // Add metadata
      Metadata: {
        originalName: file.name,
        uploadedAt: new Date().toISOString(),
      },
    });

    await s3Client.send(command);

    // Generate S3 URL
    const s3Url = `https://${config.bucket}.s3.${config.region}.amazonaws.com/${s3Key}`;

    // Call progress callback with 100%
    onProgress?.(100);

    return {
      s3Key,
      s3Bucket: config.bucket,
      s3Url,
      fileName: sanitizedName,
    };
  } catch (error) {
    console.error('S3 upload error:', error);
    throw new Error(`Failed to upload file to S3: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Upload multiple files to S3
 * @param files - Array of files to upload
 * @param entityType - 'patients' or 'consultations'
 * @param entityId - Patient or consultation ID
 * @param category - Optional document category
 * @param onProgress - Optional progress callback (called for each file)
 * @returns Array of S3 upload results
 */
export const uploadMultipleToS3 = async (
  files: File[],
  entityType: 'patients' | 'consultations',
  entityId: string,
  category?: string,
  onProgress?: (fileIndex: number, progress: number) => void
): Promise<Array<{
  s3Key: string;
  s3Bucket: string;
  s3Url: string;
  fileName: string;
  originalFileName: string;
  fileType: string;
  fileSize: number;
}>> => {
  const results = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];

    const result = await uploadToS3(
      file,
      entityType,
      entityId,
      category,
      (progress) => onProgress?.(i, progress)
    );

    results.push({
      ...result,
      originalFileName: file.name,
      fileType: file.type,
      fileSize: file.size,
    });
  }

  return results;
};
