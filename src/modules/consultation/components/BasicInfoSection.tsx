/**
 * Basic Info Section
 * Contains complaints, examination, and advice text fields with template support
 */

import React, { useCallback } from 'react';
import { Field, FieldProps, FormikProps } from 'formik';
import { Input } from 'antd';
import { FileTextOutlined, MedicineBoxOutlined, ExperimentOutlined } from '@ant-design/icons';
import { ConsultationFormValues } from '../types/consultation.types';
import {
  useComplaintTemplates,
  useExaminationTemplates,
  useAdviceTemplates,
} from '@/modules/templates/hooks/useTemplates';
import { TemplateSelector } from './TemplateSelector';
import type {
  ComplaintTemplate,
  ExaminationTemplate,
  AdviceTemplate,
} from '@/modules/templates/types/template.types';

const { TextArea } = Input;

interface BasicInfoSectionProps {
  formik: FormikProps<ConsultationFormValues>;
}

export const BasicInfoSection: React.FC<BasicInfoSectionProps> = ({ formik }) => {
  // Fetch templates
  const { data: complaintTemplates = [], isLoading: complaintsLoading } = useComplaintTemplates();
  const { data: examinationTemplates = [], isLoading: examinationsLoading } =
    useExaminationTemplates();
  const { data: adviceTemplates = [], isLoading: advicesLoading } = useAdviceTemplates();

  // Handle template selection - appends to current field value
  const handleComplaintSelect = useCallback(
    (template: ComplaintTemplate) => {
      const currentValue = formik.values.complaints || '';
      const newValue = currentValue
        ? `${currentValue}\n${template.description}`
        : template.description;
      formik.setFieldValue('complaints', newValue);
    },
    [formik]
  );

  const handleExaminationSelect = useCallback(
    (template: ExaminationTemplate) => {
      const currentValue = formik.values.examination || '';
      const newValue = currentValue
        ? `${currentValue}\n${template.description}`
        : template.description;
      formik.setFieldValue('examination', newValue);
    },
    [formik]
  );

  const handleAdviceSelect = useCallback(
    (template: AdviceTemplate) => {
      const currentValue = formik.values.advice || '';
      const newValue = currentValue
        ? `${currentValue}\n${template.description}`
        : template.description;
      formik.setFieldValue('advice', newValue);
    },
    [formik]
  );

  return (
    <div className="space-y-6">
      {/* Complaints Section */}
      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2">
          <FileTextOutlined className="mr-2 text-red-600" />
          Chief Complaints
        </label>
        <div className="flex flex-col md:flex-row gap-3">
          {/* Left: Template Selector */}
          <div className="w-full md:w-3/12 md:min-w-[300px]">
            <TemplateSelector
              templates={complaintTemplates}
              isLoading={complaintsLoading}
              onSelect={handleComplaintSelect}
              getDisplayValue={(template) => template.description || ''}
              placeholder="Search complaint templates..."
              height="250px"
            />
          </div>

          {/* Right: TextArea */}
          <div className="flex-1">
            <Field name="complaints">
              {({ field }: FieldProps) => (
                <TextArea
                  {...field}
                  placeholder="Enter patient's chief complaints, symptoms, and concerns..."
                  rows={4}
                  className="w-full"
                  style={{ resize: 'vertical', height: '250px' }}
                  maxLength={2000}
                />
              )}
            </Field>
            <p className="text-xs text-gray-500 mt-1">
              Document the main reasons for the patient&apos;s visit and primary symptoms
            </p>
          </div>
        </div>
      </div>

      {/* Examination Section */}
      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2">
          <ExperimentOutlined className="mr-2 text-blue-600" />
          Clinical Examination Findings
        </label>
        <div className="flex flex-col md:flex-row gap-3">
          {/* Left: Template Selector */}
          <div className="w-full md:w-3/12 md:min-w-[300px]">
            <TemplateSelector
              templates={examinationTemplates}
              isLoading={examinationsLoading}
              onSelect={handleExaminationSelect}
              getDisplayValue={(template) => template.description || ''}
              placeholder="Search examination templates..."
              height="250px"
            />
          </div>

          {/* Right: TextArea */}
          <div className="flex-1">
            <Field name="examination">
              {({ field }: FieldProps) => (
                <TextArea
                  {...field}
                  placeholder="Enter clinical examination findings, observations, and diagnostic notes..."
                  rows={4}
                  className="w-full"
                  style={{ resize: 'vertical', height: '250px' }}
                  maxLength={2000}
                />
              )}
            </Field>
            <p className="text-xs text-gray-500 mt-1">
              Record physical examination findings, vital signs, and clinical observations
            </p>
          </div>
        </div>
      </div>

      {/* Advice Section */}
      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2">
          <MedicineBoxOutlined className="mr-2 text-green-600" />
          Advice & Recommendations
        </label>
        <div className="flex flex-col md:flex-row gap-3">
          {/* Left: Template Selector */}
          <div className="w-full md:w-3/12 md:min-w-[300px]">
            <TemplateSelector
              templates={adviceTemplates}
              isLoading={advicesLoading}
              onSelect={handleAdviceSelect}
              getDisplayValue={(template) => template.description || ''}
              placeholder="Search advice templates..."
              height="250px"
            />
          </div>

          {/* Right: TextArea */}
          <div className="flex-1">
            <Field name="advice">
              {({ field }: FieldProps) => (
                <TextArea
                  {...field}
                  placeholder="Enter medical advice, lifestyle recommendations, and follow-up instructions..."
                  rows={4}
                  className="w-full"
                  style={{ resize: 'vertical', height: '250px' }}
                  maxLength={2000}
                />
              )}
            </Field>
            <p className="text-xs text-gray-500 mt-1">
              Provide treatment advice, lifestyle modifications, and follow-up care instructions
            </p>
          </div>
        </div>
      </div>

      {/* Info Box */}
      {/* <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-900">
          <strong>💡 Tip:</strong> Use templates from the left panel to quickly add common findings.
          Templates will be appended to your current text.
        </p>
      </div> */}
    </div>
  );
};

BasicInfoSection.displayName = 'BasicInfoSection';
