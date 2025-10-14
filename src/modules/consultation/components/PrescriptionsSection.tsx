/**
 * Prescriptions Section
 * Dynamic table for managing medicine prescriptions with template support
 * Features dosage schedule (morning, noon, evening)
 */

import React, { useState, useCallback } from 'react';
import { FormikProps, Field, FieldProps } from 'formik';
import { Button, Table, Input, InputNumber, Select } from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  MedicineBoxOutlined,
  ClearOutlined,
} from '@ant-design/icons';
import {
  ConsultationFormValues,
  CreatePrescription,
  MedicineType,
  DurationType,
} from '../types/consultation.types';
import { useMedicineTemplates } from '@/modules/templates/hooks/useTemplates';
import type { MedicineTemplate } from '@/modules/templates/types/template.types';
import { TemplateSelector } from './TemplateSelector';

const { TextArea } = Input;
const { Option } = Select;

interface PrescriptionsSectionProps {
  formik: FormikProps<ConsultationFormValues>;
}

const initialPrescriptionData: CreatePrescription = {
  name: '',
  type: MedicineType.TABLET,
  strength: '',
  unit: '',
  company: '',
  duration: undefined,
  durationType: undefined,
  morning: 0,
  noon: 0,
  evening: 0,
  note: '',
};

export const PrescriptionsSection: React.FC<PrescriptionsSectionProps> = ({ formik }) => {
  const [currentPrescription, setCurrentPrescription] =
    useState<CreatePrescription>(initialPrescriptionData);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  // Fetch medicine templates
  const { data: medicineTemplates = [], isLoading: templatesLoading } = useMedicineTemplates();

  // Format dosage display
  const formatDosage = (morning: number, noon: number, evening: number): string => {
    return `${morning}-${noon}-${evening}`;
  };

  // Handle template selection
  const handleTemplateSelect = useCallback(
    (template: MedicineTemplate) => {
      setCurrentPrescription({
        ...currentPrescription,
        name: template.name,
        type: template.type as MedicineType,
        strength: template.strength || currentPrescription.strength,
        unit: template.unit || currentPrescription.unit,
        company: template.company || currentPrescription.company,
        duration: template.duration || currentPrescription.duration,
        durationType: template.durationType as DurationType | undefined,
        morning: template.morning || 0,
        noon: template.noon || 0,
        evening: template.evening || 0,
        note: template.note || currentPrescription.note,
      });
    },
    [currentPrescription]
  );

  // Handle Add/Update Prescription
  const handleAddOrUpdate = () => {
    if (!currentPrescription.name || !currentPrescription.type) {
      return;
    }

    if (editingIndex !== null) {
      // Update existing prescription
      const updatedPrescriptions = [...formik.values.prescriptions];
      updatedPrescriptions[editingIndex] = currentPrescription;
      formik.setFieldValue('prescriptions', updatedPrescriptions);
      setEditingIndex(null);
    } else {
      // Add new prescription
      formik.setFieldValue('prescriptions', [
        ...formik.values.prescriptions,
        currentPrescription,
      ]);
    }

    // Reset form
    setCurrentPrescription(initialPrescriptionData);
  };

  // Handle Edit Prescription
  const handleEdit = (index: number) => {
    setCurrentPrescription(formik.values.prescriptions[index]);
    setEditingIndex(index);
  };

  // Handle Clear Form
  const handleClear = () => {
    setCurrentPrescription(initialPrescriptionData);
    setEditingIndex(null);
  };

  // Handle Delete Prescription
  const handleDelete = (index: number) => {
    const updatedPrescriptions = formik.values.prescriptions.filter((_, i) => i !== index);
    formik.setFieldValue('prescriptions', updatedPrescriptions);

    // If deleting the currently editing item, clear the form
    if (editingIndex === index) {
      handleClear();
    }
  };

  // Table columns
  const columns = [
    {
      title: 'Medicine Name',
      dataIndex: 'name',
      key: 'name',
      width: '20%',
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      width: '12%',
      render: (type: MedicineType) => type.charAt(0).toUpperCase() + type.slice(1),
    },
    {
      title: 'Strength',
      dataIndex: 'strength',
      key: 'strength',
      width: '10%',
      render: (strength: string) => strength || '-',
    },
    {
      title: 'Dosage (M-N-E)',
      key: 'dosage',
      width: '12%',
      align: 'center' as const,
      render: (_: unknown, record: CreatePrescription) =>
        formatDosage(record.morning, record.noon, record.evening),
    },
    {
      title: 'Duration',
      key: 'duration',
      width: '12%',
      render: (_: unknown, record: CreatePrescription) =>
        record.duration && record.durationType
          ? `${record.duration} ${record.durationType}${record.duration > 1 ? 's' : ''}`
          : '-',
    },
    {
      title: 'Company',
      dataIndex: 'company',
      key: 'company',
      width: '15%',
      render: (company: string) => company || '-',
    },
    {
      title: 'Actions',
      key: 'actions',
      width: '10%',
      align: 'center' as const,
      render: (_: unknown, __: CreatePrescription, index: number) => (
        <div className="flex gap-2 justify-center">
          <Button size="small" onClick={() => handleEdit(index)} disabled={editingIndex === index}>
            Edit
          </Button>
          <Button size="small" danger icon={<DeleteOutlined />} onClick={() => handleDelete(index)} />
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      {/* Prescription Notes Section */}
      <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
        <label className="block text-sm font-medium text-gray-900 mb-2">
          <EditOutlined className="mr-2 text-purple-600" />
          Prescription Notes
        </label>
        <Field name="prescriptionNotes">
          {({ field }: FieldProps) => (
            <TextArea
              {...field}
              placeholder="Enter any special instructions or notes for all prescriptions..."
              rows={3}
              className="w-full"
              style={{ resize: 'vertical' }}
              maxLength={1000}
            />
          )}
        </Field>
        <p className="text-xs text-gray-500 mt-1">
          Add special instructions, precautions, or additional notes for medications
        </p>
      </div>

      {/* Header */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">
          <MedicineBoxOutlined className="mr-2 text-green-600" />
          Add Medicine
        </h3>

        {/* Template Selector + Form Fields */}
        <div className="flex flex-col md:flex-row gap-3 mb-4">
          {/* Left: Template Selector */}
          <div className="w-full md:w-3/12 md:min-w-[300px]">
            <TemplateSelector
              templates={medicineTemplates}
              isLoading={templatesLoading}
              onSelect={handleTemplateSelect}
              placeholder="Search medicine templates..."
              height="450px"
            />
          </div>

          {/* Right: Form Fields */}
          <div className="flex-1 space-y-3">
            {/* Medicine Name and Type */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Medicine Name *
                </label>
                <Input
                  value={currentPrescription.name}
                  onChange={(e) =>
                    setCurrentPrescription({ ...currentPrescription, name: e.target.value })
                  }
                  placeholder="Enter medicine name"
                  maxLength={255}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type *</label>
                <Select
                  value={currentPrescription.type}
                  onChange={(value) =>
                    setCurrentPrescription({ ...currentPrescription, type: value })
                  }
                  className="w-full"
                >
                  {Object.values(MedicineType).map((type) => (
                    <Option key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </Option>
                  ))}
                </Select>
              </div>
            </div>

            {/* Strength, Unit, Company */}
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Strength</label>
                <Input
                  value={currentPrescription.strength}
                  onChange={(e) =>
                    setCurrentPrescription({ ...currentPrescription, strength: e.target.value })
                  }
                  placeholder="e.g., 500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
                <Input
                  value={currentPrescription.unit}
                  onChange={(e) =>
                    setCurrentPrescription({ ...currentPrescription, unit: e.target.value })
                  }
                  placeholder="e.g., mg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                <Input
                  value={currentPrescription.company}
                  onChange={(e) =>
                    setCurrentPrescription({ ...currentPrescription, company: e.target.value })
                  }
                  placeholder="Manufacturer"
                />
              </div>
            </div>

            {/* Dosage (Morning, Noon, Evening) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dosage Schedule *
              </label>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Morning</label>
                  <InputNumber
                    value={currentPrescription.morning}
                    onChange={(value) =>
                      setCurrentPrescription({ ...currentPrescription, morning: value || 0 })
                    }
                    min={0}
                    precision={1}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Noon</label>
                  <InputNumber
                    value={currentPrescription.noon}
                    onChange={(value) =>
                      setCurrentPrescription({ ...currentPrescription, noon: value || 0 })
                    }
                    min={0}
                    precision={1}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Evening</label>
                  <InputNumber
                    value={currentPrescription.evening}
                    onChange={(value) =>
                      setCurrentPrescription({ ...currentPrescription, evening: value || 0 })
                    }
                    min={0}
                    precision={1}
                    className="w-full"
                  />
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Format:{' '}
                {formatDosage(
                  currentPrescription.morning,
                  currentPrescription.noon,
                  currentPrescription.evening
                )}
              </p>
            </div>

            {/* Duration */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
              <div className="grid grid-cols-2 gap-3">
                <InputNumber
                  value={currentPrescription.duration}
                  onChange={(value) =>
                    setCurrentPrescription({ ...currentPrescription, duration: value || undefined })
                  }
                  min={1}
                  placeholder="Enter duration"
                  className="w-full"
                />
                <Select
                  value={currentPrescription.durationType}
                  onChange={(value) =>
                    setCurrentPrescription({ ...currentPrescription, durationType: value })
                  }
                  placeholder="Select type"
                  className="w-full"
                >
                  {Object.values(DurationType).map((type) => (
                    <Option key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}(s)
                    </Option>
                  ))}
                </Select>
              </div>
            </div>

            {/* Note */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Instructions/Notes
              </label>
              <TextArea
                value={currentPrescription.note}
                onChange={(e) =>
                  setCurrentPrescription({ ...currentPrescription, note: e.target.value })
                }
                placeholder="Add special instructions (e.g., after meals, before sleep)"
                rows={2}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 justify-end">
              <Button icon={<ClearOutlined />} onClick={handleClear}>
                Clear
              </Button>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleAddOrUpdate}
                disabled={!currentPrescription.name || !currentPrescription.type}
              >
                {editingIndex !== null ? 'Update Medicine' : 'Add Medicine'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Medicines Table */}
      <div>
        <h3 className="text-md font-semibold text-gray-900 mb-2">Medicines List</h3>
        <Table
          dataSource={formik.values.prescriptions}
          columns={columns}
          rowKey={(_, index) => index?.toString() || '0'}
          pagination={false}
          locale={{ emptyText: 'No prescriptions added yet' }}
          bordered
          size="small"
        />
      </div>
    </div>
  );
};

PrescriptionsSection.displayName = 'PrescriptionsSection';
