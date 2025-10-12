/**
 * Clinical Examination Section
 * Contains complaints, advice, and examination text fields
 * Supports rich text input for medical documentation
 */

import React from 'react';
import { Field, FieldProps, FormikProps } from 'formik';
import { Input } from 'antd';
import {
  FileTextOutlined,
  MedicineBoxOutlined,
  ExperimentOutlined,
  EditOutlined,
} from '@ant-design/icons';
import { ConsultationFormValues } from '../types/consultation.types';
import { ToothChart } from './ToothChart';

const { TextArea } = Input;

interface ClinicalExaminationSectionProps {
  formik: FormikProps<ConsultationFormValues>;
}

export const ClinicalExaminationSection: React.FC<ClinicalExaminationSectionProps> = ({
  formik,
}) => {
  return (
    <div className="space-y-6">
      {/* Complaints Section */}
      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2">
          <FileTextOutlined className="mr-2 text-red-600" />
          Chief Complaints
        </label>
        <Field name="complaints">
          {({ field }: FieldProps) => (
            <TextArea
              {...field}
              placeholder="Enter patient's chief complaints, symptoms, and concerns..."
              rows={4}
              className="w-full"
              style={{ resize: 'vertical' }}
              maxLength={2000}
              showCount
            />
          )}
        </Field>
        <p className="text-xs text-gray-500 mt-1">
          Document the main reasons for the patient&apos;s visit and primary symptoms
        </p>
      </div>

      {/* Examination Section */}
      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2">
          <ExperimentOutlined className="mr-2 text-blue-600" />
          Clinical Examination Findings
        </label>
        <Field name="examination">
          {({ field }: FieldProps) => (
            <TextArea
              {...field}
              placeholder="Enter clinical examination findings, observations, and diagnostic notes..."
              rows={4}
              className="w-full"
              style={{ resize: 'vertical' }}
              maxLength={2000}
              showCount
            />
          )}
        </Field>
        <p className="text-xs text-gray-500 mt-1">
          Record physical examination findings, vital signs, and clinical observations
        </p>
      </div>

      {/* Advice Section */}
      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2">
          <MedicineBoxOutlined className="mr-2 text-green-600" />
          Advice & Recommendations
        </label>
        <Field name="advice">
          {({ field }: FieldProps) => (
            <TextArea
              {...field}
              placeholder="Enter medical advice, lifestyle recommendations, and follow-up instructions..."
              rows={4}
              className="w-full"
              style={{ resize: 'vertical' }}
              maxLength={2000}
              showCount
            />
          )}
        </Field>
        <p className="text-xs text-gray-500 mt-1">
          Provide treatment advice, lifestyle modifications, and follow-up care instructions
        </p>
      </div>

      {/* Prescription Notes Section */}
      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2">
          <EditOutlined className="mr-2 text-purple-600" />
          Prescription Notes (Optional)
        </label>
        <Field name="prescriptionNotes">
          {({ field }: FieldProps) => (
            <TextArea
              {...field}
              placeholder="Enter any special instructions or notes for prescriptions..."
              rows={3}
              className="w-full"
              style={{ resize: 'vertical' }}
              maxLength={1000}
              showCount
            />
          )}
        </Field>
        <p className="text-xs text-gray-500 mt-1">
          Add special instructions, precautions, or additional notes for medications
        </p>
      </div>

      {/* Tooth Chart for Dental Examinations */}
      <div className="mt-6">
        <h4 className="text-md font-semibold text-gray-900 mb-4">Dental Tooth Examination</h4>
        <ToothChart formik={formik} />
      </div>

      {/* Info Box */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-900">
          <strong>💡 Tip:</strong> Be thorough in documenting clinical findings. This information is
          crucial for treatment planning and future reference.
        </p>
      </div>
    </div>
  );
};

ClinicalExaminationSection.displayName = 'ClinicalExaminationSection';
