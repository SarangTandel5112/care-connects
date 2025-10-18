/**
 * Pending Documents Context
 * Manages files selected during consultation creation
 * Files are uploaded after consultation is saved
 */

import React, { createContext, useContext, useState, useCallback } from 'react';
import { DocumentType } from '@/modules/documents/types/document.types';

export interface PendingDocument {
  file: File;
  uid: string;
  previewUrl?: string;
  documentType: DocumentType;
  documentCategory?: string;
  description?: string;
  isSensitive: boolean;
}

interface PendingDocumentsContextValue {
  pendingFiles: PendingDocument[];
  addFile: (file: PendingDocument) => void;
  removeFile: (uid: string) => void;
  clearFiles: () => void;
  hasFiles: boolean;
}

const PendingDocumentsContext = createContext<PendingDocumentsContextValue | undefined>(undefined);

export const PendingDocumentsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [pendingFiles, setPendingFiles] = useState<PendingDocument[]>([]);

  const addFile = useCallback((file: PendingDocument) => {
    setPendingFiles((prev) => [...prev, file]);
  }, []);

  const removeFile = useCallback((uid: string) => {
    setPendingFiles((prev) => prev.filter((f) => f.uid !== uid));
  }, []);

  const clearFiles = useCallback(() => {
    setPendingFiles([]);
  }, []);

  const hasFiles = pendingFiles.length > 0;

  return (
    <PendingDocumentsContext.Provider
      value={{
        pendingFiles,
        addFile,
        removeFile,
        clearFiles,
        hasFiles,
      }}
    >
      {children}
    </PendingDocumentsContext.Provider>
  );
};

export const usePendingDocuments = () => {
  const context = useContext(PendingDocumentsContext);
  if (!context) {
    throw new Error('usePendingDocuments must be used within PendingDocumentsProvider');
  }
  return context;
};
