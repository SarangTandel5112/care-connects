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

import React, { useMemo, useCallback, useRef, useEffect } from 'react';
import { Formik, Form, FormikProps } from 'formik';
import { Button } from '@/components/ui';
import { Tabs } from 'antd';
import * as Yup from 'yup';
import { CreateConsultation, ConsultationFormValues } from '../types/consultation.types';
import { useCreateConsultation } from '../hooks/useConsultations';
import { BasicInfoSection } from './BasicInfoSection';
import { ToothExaminationSection } from './ToothExaminationSection';
import { ProceduresSection } from './ProceduresSection';
import { PrescriptionsSection } from './PrescriptionsSection';
import { BillingSection } from './BillingSection';
import { ConsultationPreview } from './ConsultationPreview';

interface ConsultationFormProps {
  initialPatientId?: string;
  initialAppointmentId?: string;
  readOnlyFields?: {
    patientId?: boolean;
    appointmentId?: boolean;
  };
  onSubmitSuccess?: () => void;
  onCancel?: () => void;
}

export const ConsultationForm: React.FC<ConsultationFormProps> = ({
  initialPatientId,
  initialAppointmentId,
  // readOnlyFields = {},
  onSubmitSuccess,
  onCancel,
}) => {
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  // const [previousValues, setPreviousValues] = useState<ConsultationFormValues | null>(null);

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
        // Initialize calculated fields with default values
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

  // Handle form submission
  const handleSubmit = useCallback(
    async (values: ConsultationFormValues) => {
      try {
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
        await createConsultation.mutateAsync(consultationData);

        // Call success callback
        onSubmitSuccess?.();
      } catch (error) {
        // Error handling is done by the mutation hook
        console.error('Failed to create consultation:', error);
      }
    },
    [createConsultation, onSubmitSuccess]
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
                  disabled={createConsultation.isPending}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  loading={createConsultation.isPending}
                  disabled={createConsultation.isPending || !formik.isValid}
                >
                  Save Consultation
                </Button>
              </div>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

ConsultationForm.displayName = 'ConsultationForm';
