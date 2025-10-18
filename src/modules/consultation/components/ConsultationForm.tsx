/**
 * Consultation Form
 * Main form component for creating and editing consultations
 * Features:
 * - Patient and appointment selection
 * - Clinical examinations (complaints, advice, examination, tooth chart)
 * - Procedures with auto-cost calculation
 * - Prescriptions
 * - Billing with auto-calculations
 * - Real-time form updates with debouncing
 */

import React, { useMemo, useCallback, useRef, useEffect, useState } from 'react';
import { Formik, Form, FormikProps } from 'formik';
import { Button } from '@/components/ui';
import { Tabs, message, Modal, Progress } from 'antd';
import * as Yup from 'yup';
import { CreateConsultation, ConsultationFormValues } from '../types/consultation.types';
import { useCreateConsultation } from '../hooks/useConsultations';
import { BasicInfoSection } from './BasicInfoSection';
import { ToothExaminationSection } from './ToothExaminationSection';
import { ProceduresSection } from './ProceduresSection';
import { PrescriptionsSection } from './PrescriptionsSection';
import { BillingSection } from './BillingSection';
import { DocumentsSection } from './DocumentsSection';
import { ConsultationPreview } from './ConsultationPreview';
import { PendingDocumentsProvider, usePendingDocuments } from '../context/PendingDocumentsContext';
import { uploadToS3 } from '@/utils/s3Client';
import Axios from '@/setup/axios';

interface ConsultationFormProps {
  initialPatientId?: string;
  initialAppointmentId?: string;
  consultationId?: string; // For editing existing consultations
  readOnlyFields?: {
    patientId?: boolean;
    appointmentId?: boolean;
  };
  onSubmitSuccess?: () => void;
  onCancel?: () => void;
}

// Inner component that has access to PendingDocumentsContext
const ConsultationFormInner: React.FC<ConsultationFormProps> = ({
  initialPatientId,
  initialAppointmentId,
  consultationId: initialConsultationId,
  // readOnlyFields = {},
  onSubmitSuccess,
  onCancel,
}) => {
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [consultationId, setConsultationId] = useState<string | undefined>(initialConsultationId);
  const [isUploadingDocuments, setIsUploadingDocuments] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({ current: 0, total: 0 });

  // Get pending files from context
  const { pendingFiles, clearFiles, hasFiles } = usePendingDocuments();

  // API hooks
  const createConsultation = useCreateConsultation();

  // Initial values for the form
  const initialValues = useMemo(
    (): ConsultationFormValues => ({
      patientId: initialPatientId || '',
      appointmentId: initialAppointmentId || '',
      complaints: '',
      advice: '',
      examination: '',
      prescriptionNotes: '',
      consultationFiles: [],
      scheduleNextAppointment: '',
      clinicalExaminations: [],
      procedures: [],
      prescriptions: [],
      billing: {
        consultationDate: new Date(),
        consultationFee: 0,
        otherAmount: 0,
        discount: 0,
        applyGst: false,
        // Calculated fields required by backend validation
        procedureAmount: 0,
        subTotal: 0,
        tax: 0,
        totalAmount: 0,
      },
      payments: [],
    }),
    [initialPatientId, initialAppointmentId]
  );

  // Validation schema
  const validationSchema = useMemo(
    () =>
      Yup.object({
        patientId: Yup.string().required('Patient is required'),
        appointmentId: Yup.string().optional(),
        complaints: Yup.string().optional(),
        advice: Yup.string().optional(),
        examination: Yup.string().optional(),
        prescriptionNotes: Yup.string().optional(),
        consultationFiles: Yup.array().of(Yup.string()).optional(),
        scheduleNextAppointment: Yup.string().optional(),
        clinicalExaminations: Yup.array().optional(),
        procedures: Yup.array().optional(),
        prescriptions: Yup.array().optional(),
        billing: Yup.object().optional(),
        payments: Yup.array().optional(),
      }),
    []
  );

  // Cleanup timeout on unmount
  useEffect(() => {
    const timeoutRef = debounceTimeoutRef.current;
    return () => {
      if (timeoutRef) {
        clearTimeout(timeoutRef);
      }
    };
  }, []);

  // Upload pending files after consultation is created (concurrent uploads)
  const uploadPendingFiles = useCallback(
    async (newConsultationId: string) => {
      if (!hasFiles || pendingFiles.length === 0 || !newConsultationId) {
        console.log('Upload skipped:', { hasFiles, filesCount: pendingFiles.length, newConsultationId });
        return;
      }

      try {
        setIsUploadingDocuments(true);
        setUploadProgress({ current: 0, total: pendingFiles.length });

        let completedCount = 0;

        // Upload all files concurrently using Promise.allSettled
        const uploadPromises = pendingFiles.map(async (pendingFile, index) => {
          try {
            // Upload to S3
            const s3Result = await uploadToS3(
              pendingFile.file,
              'consultations',
              newConsultationId,
              pendingFile.documentCategory
            );

            // Save metadata to backend
            await Axios.post(`/consultations/${newConsultationId}/documents`, {
              consultationId: newConsultationId,
              fileName: s3Result.fileName,
              originalFileName: pendingFile.file.name,
              fileType: pendingFile.file.type,
              fileSize: pendingFile.file.size,
              s3Key: s3Result.s3Key,
              s3Url: s3Result.s3Url,
              documentCategory: pendingFile.documentCategory,
              documentType: pendingFile.documentType,
              description: pendingFile.description,
              isSensitive: pendingFile.isSensitive,
            });

            // Update progress
            completedCount++;
            setUploadProgress({ current: completedCount, total: pendingFiles.length });

            return { success: true, fileName: pendingFile.file.name };
          } catch (uploadError) {
            console.error('Failed to upload file:', pendingFile.file.name, uploadError);

            // Update progress even for failed uploads
            completedCount++;
            setUploadProgress({ current: completedCount, total: pendingFiles.length });

            return { success: false, fileName: pendingFile.file.name, error: uploadError };
          }
        });

        // Wait for all uploads to complete
        const results = await Promise.allSettled(uploadPromises);

        // Count successes and failures
        const uploadedCount = {
          success: results.filter(
            (r) => r.status === 'fulfilled' && r.value.success
          ).length,
          failed: results.filter(
            (r) => r.status === 'rejected' || (r.status === 'fulfilled' && !r.value.success)
          ).length,
        };

        if (uploadedCount.success > 0) {
          message.success(`${uploadedCount.success} document(s) uploaded successfully!`);
        }
        if (uploadedCount.failed > 0) {
          message.warning(`${uploadedCount.failed} document(s) failed to upload`);
        }

        // Clear pending files after upload
        clearFiles();
      } catch (error) {
        message.error('Failed to upload documents');
        console.error('Document upload error:', error);
      } finally {
        setIsUploadingDocuments(false);
        setUploadProgress({ current: 0, total: 0 });
      }
    },
    [hasFiles, pendingFiles, clearFiles]
  );

  // Handle form submission
  const handleSubmit = useCallback(
    async (values: ConsultationFormValues) => {
      try {
        console.log('=== FORM SUBMIT START ===');
        console.log('Pending files count:', pendingFiles.length);
        console.log('Has files:', hasFiles);

        // Transform form values to CreateConsultation DTO
        const consultationData: CreateConsultation = {
          patientId: values.patientId,
          appointmentId: values.appointmentId || undefined,
          complaints: values.complaints || undefined,
          advice: values.advice || undefined,
          examination: values.examination || undefined,
          prescriptionNotes: values.prescriptionNotes || undefined,
          consultationFiles: values.consultationFiles,
          scheduleNextAppointment: values.scheduleNextAppointment || undefined,
          clinicalExaminations: values.clinicalExaminations,
          procedures: values.procedures,
          prescriptions: values.prescriptions,
          billing: values.billing,
          payments: values.payments,
        };

        // Call create mutation
        console.log('Creating consultation...');
        const result = await createConsultation.mutateAsync(consultationData);
        console.log('Consultation created with ID:', result.id);

        // Upload pending files if any (pass the consultationId directly)
        if (pendingFiles.length > 0) {
          console.log('Starting document upload for', pendingFiles.length, 'files');
          await uploadPendingFiles(result.id);
          console.log('Document upload completed');
        } else {
          console.log('No pending files to upload');
        }

        console.log('=== FORM SUBMIT SUCCESS ===');

        // Call success callback - This triggers the redirect
        onSubmitSuccess?.();
      } catch (error) {
        // Error handling is done by the mutation hook
        console.error('Failed to create consultation:', error);
      }
    },
    [createConsultation, pendingFiles, uploadPendingFiles, onSubmitSuccess]
  );

  // Tab items for Ant Design Tabs (will receive formik from within Formik context)
  const getTabItems = (formik: FormikProps<ConsultationFormValues>) => [
    {
      key: 'basic-info',
      label: 'Basic Info',
      children: (
        <div className="py-4">
          <BasicInfoSection formik={formik} />
        </div>
      ),
    },
    {
      key: 'clinical-examination',
      label: 'Clinical Examination',
      children: (
        <div className="py-4">
          <ToothExaminationSection formik={formik} />
        </div>
      ),
    },
    {
      key: 'procedures',
      label: 'Procedures',
      children: (
        <div className="py-4">
          <ProceduresSection formik={formik} />
        </div>
      ),
    },
    {
      key: 'prescriptions',
      label: 'Prescriptions',
      children: (
        <div className="py-4">
          <PrescriptionsSection formik={formik} />
        </div>
      ),
    },
    {
      key: 'documents',
      label: 'Documents',
      children: (
        <div className="py-4">
          <DocumentsSection formik={formik} consultationId={consultationId} />
        </div>
      ),
    },
    {
      key: 'billing',
      label: 'Billing & Payment',
      children: (
        <div className="py-4">
          <BillingSection formik={formik} />
        </div>
      ),
    },
    {
      key: 'preview',
      label: 'Preview & Print',
      children: (
        <div className="py-4">
          <ConsultationPreview formik={formik} />
        </div>
      ),
    },
  ];

  return (
    <div className="">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {(formik) => {
          return (
            <Form className="space-y-6">
              {/* Patient and Appointment Selection Section */}
              {/* <PatientSelectionSection
                formik={formik}
                readOnly={readOnlyFields}
              /> */}

              {/* Tabbed Sections */}
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <Tabs
                  defaultActiveKey="basic-info"
                  items={getTabItems(formik)}
                  type="card"
                  size="large"
                />
              </div>

              {/* Form Actions */}
              <div className="flex justify-end space-x-3 py-4 border-t border-gray-200">
                <Button
                  variant="secondary"
                  onClick={onCancel}
                  disabled={createConsultation.isPending || isUploadingDocuments}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  loading={createConsultation.isPending || isUploadingDocuments}
                  disabled={createConsultation.isPending || isUploadingDocuments || !formik.isValid}
                >
                  {isUploadingDocuments ? 'Uploading Documents...' : 'Save Consultation'}
                </Button>
              </div>
            </Form>
          );
        }}
      </Formik>

      {/* Upload Progress Modal */}
      <Modal
        open={isUploadingDocuments}
        closable={false}
        footer={null}
        centered
        maskClosable={false}
      >
        <div className="py-4">
          <h3 className="text-lg font-semibold mb-4">Uploading Documents</h3>
          <Progress
            percent={uploadProgress.total > 0 ? Math.round((uploadProgress.current / uploadProgress.total) * 100) : 0}
            status="active"
            strokeColor={{
              '0%': '#108ee9',
              '100%': '#87d068',
            }}
          />
          <p className="text-sm text-gray-600 mt-3 text-center">
            {uploadProgress.current} of {uploadProgress.total} documents uploaded
          </p>
        </div>
      </Modal>
    </div>
  );
};

ConsultationFormInner.displayName = 'ConsultationFormInner';

// Wrapper component that provides PendingDocumentsContext
export const ConsultationForm: React.FC<ConsultationFormProps> = (props) => {
  return (
    <PendingDocumentsProvider>
      <ConsultationFormInner {...props} />
    </PendingDocumentsProvider>
  );
};

ConsultationForm.displayName = 'ConsultationForm';
