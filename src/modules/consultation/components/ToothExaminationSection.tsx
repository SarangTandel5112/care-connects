/**
 * Tooth Examination Section
 * Contains the interactive dental tooth chart for recording tooth conditions
 */

import React from 'react';
import { FormikProps } from 'formik';
import { ConsultationFormValues } from '../types/consultation.types';
import { ToothChart } from './ToothChart';

interface ToothExaminationSectionProps {
  formik: FormikProps<ConsultationFormValues>;
}

export const ToothExaminationSection: React.FC<ToothExaminationSectionProps> = ({ formik }) => {
  return (
    <div className="space-y-4">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Dental Tooth Examination</h3>
        {/* <p className="text-sm text-gray-600">
          Click on any tooth to record conditions and examination findings. The chart uses standard
          dental numbering (1-32 for permanent teeth).
        </p> */}
      </div>

      <ToothChart formik={formik} />

      {/* Info Box */}
      <div className="p-4 bg-green-50 border border-green-200 rounded-lg mt-6">
        <p className="text-sm text-green-900">
          <strong>📋 Instructions:</strong> Click on individual teeth to add or edit examination
          records. Select the condition type and add detailed notes for each affected tooth.
        </p>
      </div>
    </div>
  );
};

ToothExaminationSection.displayName = 'ToothExaminationSection';
