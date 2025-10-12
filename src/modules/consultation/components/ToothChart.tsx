/**
 * Tooth Chart Component
 * Interactive dental chart for recording tooth examinations
 * Uses standard dental numbering (1-32 for permanent teeth)
 */

import React, { useState } from 'react';
import { FormikProps } from 'formik';
import { Modal, Select, Input, Button, Tag, Table } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { ConsultationFormValues, CreateClinicalExamination, ConditionType } from '../types/consultation.types';
import Image from 'next/image';

const { TextArea } = Input;
const { Option } = Select;

interface ToothChartProps {
  formik: FormikProps<ConsultationFormValues>;
}

interface ToothExaminationModalData {
  toothNumber: number | null;
  data: CreateClinicalExamination | null;
  existingIndex: number | null;
}

// Tooth numbering: 1-16 upper teeth (right to left), 17-32 lower teeth (right to left)
const upperTeeth = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
const lowerTeeth = [32, 31, 30, 29, 28, 27, 26, 25, 24, 23, 22, 21, 20, 19, 18, 17];

// Condition colors for visual representation
const conditionColors: Record<ConditionType, string> = {
  [ConditionType.CARIES]: 'bg-red-500',
  [ConditionType.FRACTURE]: 'bg-orange-500',
  [ConditionType.IMPACTED]: 'bg-purple-500',
  [ConditionType.MISSING]: 'bg-slate-700',
  [ConditionType.MOBILITY]: 'bg-yellow-500',
  [ConditionType.PERIAPICALABSCESS]: 'bg-pink-500',
  [ConditionType.ROOTSTUMP]: 'bg-amber-700',
  [ConditionType.SUPRAERUPTED]: 'bg-blue-500',
};

export const ToothChart: React.FC<ToothChartProps> = ({ formik }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState<ToothExaminationModalData>({
    toothNumber: null,
    data: null,
    existingIndex: null,
  });

  // Get examination for a specific tooth
  const getToothExamination = (toothNumber: number) => {
    const index = formik.values.clinicalExaminations.findIndex(
      (exam) => exam.toothNumber === toothNumber
    );
    return index >= 0 ? { examination: formik.values.clinicalExaminations[index], index } : null;
  };

  // Handle tooth click
  const handleToothClick = (toothNumber: number) => {
    const existing = getToothExamination(toothNumber);

    if (existing) {
      // Edit existing examination
      setModalData({
        toothNumber,
        data: existing.examination,
        existingIndex: existing.index,
      });
    } else {
      // Add new examination
      setModalData({
        toothNumber,
        data: {
          toothNumber,
          conditionType: ConditionType.CARIES,
          description: '',
        },
        existingIndex: null,
      });
    }
    setIsModalOpen(true);
  };

  // Handle save examination
  const handleSave = () => {
    if (!modalData.data || modalData.toothNumber === null) return;

    if (modalData.existingIndex !== null) {
      // Update existing
      const updatedExaminations = [...formik.values.clinicalExaminations];
      updatedExaminations[modalData.existingIndex] = modalData.data;
      formik.setFieldValue('clinicalExaminations', updatedExaminations);
    } else {
      // Add new
      formik.setFieldValue('clinicalExaminations', [
        ...formik.values.clinicalExaminations,
        modalData.data,
      ]);
    }

    setIsModalOpen(false);
    setModalData({ toothNumber: null, data: null, existingIndex: null });
  };

  // Handle delete examination
  const handleDelete = () => {
    if (modalData.existingIndex !== null) {
      const updatedExaminations = formik.values.clinicalExaminations.filter(
        (_, index) => index !== modalData.existingIndex
      );
      formik.setFieldValue('clinicalExaminations', updatedExaminations);
    }
    setIsModalOpen(false);
    setModalData({ toothNumber: null, data: null, existingIndex: null });
  };

  // Render a single tooth
  const renderTooth = (toothNumber: number) => {
    const examination = getToothExamination(toothNumber);
    const hasCondition = examination !== null;
    const isLowerJaw = toothNumber >= 17 && toothNumber <= 32;

    return (
      <button
        key={toothNumber}
        type="button"
        onClick={() => handleToothClick(toothNumber)}
        className="relative cursor-pointer bg-transparent border-0 p-0 m-0"
        title={hasCondition ? `Tooth ${toothNumber} - ${examination.examination.conditionType}` : `Tooth ${toothNumber}`}
      >
        <div className="relative">
          <Image
            src={`/images/dental/caries/${toothNumber}.png`}
            alt={`Tooth ${toothNumber}`}
            width={50}
            height={50}
            className={`m-0 rounded-lg hover:bg-[#0000000f] transition-all duration-200 ${
              isLowerJaw ? "-scale-y-100" : ""
            }`}
          />
          {hasCondition && (
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-yellow-400 rounded-full border border-white"></span>
          )}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={`text-xs font-semibold ${isLowerJaw ? "-scale-y-100" : ""}`}>
              {toothNumber}
            </span>
          </div>
        </div>
      </button>
    );
  };

  return (
    <div className="space-y-6">
      {/* Legend */}
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <h4 className="text-sm font-semibold text-gray-900 mb-3">Tooth Conditions Legend:</h4>
        <div className="flex flex-wrap gap-2">
          {Object.entries(ConditionType).map(([key, value]) => {
            let tagColor = conditionColors[value].replace('bg-', '').replace('-500', '').replace('-700', '');
            // Special handling for slate color (Missing)
            if (value === ConditionType.MISSING) {
              tagColor = 'default'; // Use dark gray for better visibility
            }
            return (
              <Tag key={key} color={tagColor}>
                {value.charAt(0).toUpperCase() + value.slice(1)}
              </Tag>
            );
          })}
        </div>
      </div>

      {/* Tooth Chart */}
      <div className="bg-white p-6 rounded-lg border-2 border-gray-300">
        <div className="space-y-8">
          {/* Upper Jaw */}
          <div>
            <h4 className="text-center text-sm font-semibold text-gray-700 mb-3">Upper Jaw</h4>
            <div className="flex justify-center gap-1">
              {upperTeeth.map((toothNumber) => renderTooth(toothNumber))}
            </div>
          </div>

          {/* Divider */}
          <div className="border-t-2 border-gray-300"></div>

          {/* Lower Jaw */}
          <div>
            <h4 className="text-center text-sm font-semibold text-gray-700 mb-3">Lower Jaw</h4>
            <div className="flex justify-center gap-1">
              {lowerTeeth.map((toothNumber) => renderTooth(toothNumber))}
            </div>
          </div>
        </div>
      </div>

      {/* Summary */}
      {formik.values.clinicalExaminations.length > 0 && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-5 rounded-lg border border-blue-300 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-base font-bold text-blue-900 flex items-center gap-2">
              <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">
                {formik.values.clinicalExaminations.length}
              </span>
              Recorded Examinations
            </h4>
            <span className="text-xs text-blue-700 font-medium">
              Click on any row to edit
            </span>
          </div>
          <Table
            dataSource={formik.values.clinicalExaminations}
            columns={[
              {
                title: 'Tooth Number',
                dataIndex: 'toothNumber',
                key: 'toothNumber',
                width: '15%',
                align: 'center' as const,
                render: (num: number) => <strong>Tooth {num}</strong>,
              },
              {
                title: 'Condition Type',
                dataIndex: 'conditionType',
                key: 'conditionType',
                width: '25%',
                render: (type: string) => {
                  let tagColor = conditionColors[type].replace('bg-', '').replace('-500', '').replace('-700', '');
                  if (type === ConditionType.MISSING) {
                    tagColor = 'default';
                  }
                  return (
                    <Tag color={tagColor}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </Tag>
                  );
                },
              },
              {
                title: 'Description',
                dataIndex: 'description',
                key: 'description',
                render: (desc: string) => desc || '-',
              },
              {
                title: 'Actions',
                key: 'actions',
                width: '12%',
                align: 'center' as const,
                render: (_: any, record: any) => (
                  <Button
                    size="small"
                    type="primary"
                    icon={<EditOutlined />}
                    onClick={() => handleToothClick(record.toothNumber)}
                  >
                    Edit
                  </Button>
                ),
              },
            ]}
            rowKey={(_, index) => index?.toString() || '0'}
            pagination={false}
            bordered
            size="small"
            className="bg-white"
          />
        </div>
      )}

      {/* Modal for Adding/Editing Tooth Examination */}
      <Modal
        title={
          modalData.existingIndex !== null
            ? `Edit Tooth ${modalData.toothNumber} Examination`
            : `Add Tooth ${modalData.toothNumber} Examination`
        }
        open={isModalOpen}
        onOk={handleSave}
        onCancel={() => {
          setIsModalOpen(false);
          setModalData({ toothNumber: null, data: null, existingIndex: null });
        }}
        width={500}
        okText="Save"
        cancelText="Cancel"
        footer={[
          modalData.existingIndex !== null && (
            <Button key="delete" danger icon={<DeleteOutlined />} onClick={handleDelete}>
              Delete
            </Button>
          ),
          <Button key="cancel" onClick={() => setIsModalOpen(false)}>
            Cancel
          </Button>,
          <Button
            key="save"
            type="primary"
            onClick={handleSave}
            disabled={!modalData.data?.conditionType}
          >
            Save
          </Button>,
        ]}
      >
        {modalData.data && (
          <div className="space-y-4 mt-4">
            {/* Tooth Number (Read-only) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tooth Number</label>
              <div className="bg-gray-100 px-3 py-2 rounded border border-gray-300">
                <span className="text-lg font-semibold text-gray-900">
                  {modalData.toothNumber}
                </span>
              </div>
            </div>

            {/* Condition Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Condition Type *
              </label>
              <Select
                value={modalData.data.conditionType}
                onChange={(value) =>
                  setModalData({
                    ...modalData,
                    data: { ...modalData.data!, conditionType: value },
                  })
                }
                className="w-full"
                size="large"
              >
                {Object.entries(ConditionType).map(([key, value]) => {
                  let tagColor = conditionColors[value].replace('bg-', '').replace('-500', '').replace('-700', '');
                  // Special handling for slate color (Missing)
                  if (value === ConditionType.MISSING) {
                    tagColor = 'default'; // Use dark gray for better visibility
                  }
                  return (
                    <Option key={key} value={value}>
                      <Tag color={tagColor}>
                        {value.charAt(0).toUpperCase() + value.slice(1)}
                      </Tag>
                    </Option>
                  );
                })}
              </Select>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description (Optional)
              </label>
              <TextArea
                value={modalData.data.description}
                onChange={(e) =>
                  setModalData({
                    ...modalData,
                    data: { ...modalData.data!, description: e.target.value },
                  })
                }
                placeholder="Add detailed notes about this tooth condition..."
                rows={4}
              />
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

ToothChart.displayName = 'ToothChart';
