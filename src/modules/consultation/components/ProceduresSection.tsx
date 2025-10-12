/**
 * Procedures Section
 * Dynamic table for managing dental procedures with template support
 * Features auto-calculation of subtotals
 */

import React, { useState, useCallback, useMemo } from 'react';
import { FormikProps } from 'formik';
import { Button, Table, Input, InputNumber, Select } from 'antd';
import { PlusOutlined, DeleteOutlined, MedicineBoxOutlined, ClearOutlined } from '@ant-design/icons';
import { ConsultationFormValues, CreateProcedure } from '../types/consultation.types';
import { useProcedureTemplates } from '@/modules/templates/hooks/useTemplates';
import type { ProcedureTemplate } from '@/modules/templates/types/template.types';
import { TemplateSelector } from './TemplateSelector';

const { TextArea } = Input;
const { Option } = Select;

interface ProceduresSectionProps {
  formik: FormikProps<ConsultationFormValues>;
}

const initialProcedureData: CreateProcedure = {
  name: '',
  quantity: 1,
  teethNumbers: [],
  note: '',
  unitCost: 0,
  discount: 0,
};

export const ProceduresSection: React.FC<ProceduresSectionProps> = ({ formik }) => {
  const [currentProcedure, setCurrentProcedure] = useState<CreateProcedure>(initialProcedureData);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  // Fetch procedure templates
  const { data: procedureTemplates = [], isLoading: templatesLoading } = useProcedureTemplates();

  // Get examined teeth numbers for selection
  const examinedTeethNumbers = useMemo(() => {
    return formik.values.clinicalExaminations.map((exam) => exam.toothNumber);
  }, [formik.values.clinicalExaminations]);

  // Calculate subtotal for a procedure
  const calculateSubtotal = (procedure: CreateProcedure): number => {
    const baseAmount = (procedure.unitCost || 0) * (procedure.quantity || 1);
    return Math.max(0, baseAmount - (procedure.discount || 0));
  };

  // Handle template selection
  const handleTemplateSelect = useCallback(
    (template: ProcedureTemplate) => {
      setCurrentProcedure({
        ...currentProcedure,
        name: template.name,
        unitCost: template.unitCost,
        note: template.note || currentProcedure.note,
      });
    },
    [currentProcedure]
  );

  // Handle Add/Update Procedure
  const handleAddOrUpdate = () => {
    if (!currentProcedure.name || !currentProcedure.unitCost || currentProcedure.quantity < 1) {
      return;
    }

    if (editingIndex !== null) {
      // Update existing procedure
      const updatedProcedures = [...formik.values.procedures];
      updatedProcedures[editingIndex] = currentProcedure;
      formik.setFieldValue('procedures', updatedProcedures);
      setEditingIndex(null);
    } else {
      // Add new procedure
      formik.setFieldValue('procedures', [...formik.values.procedures, currentProcedure]);
    }

    // Reset form
    setCurrentProcedure(initialProcedureData);
  };

  // Handle Edit Procedure
  const handleEdit = (index: number) => {
    setCurrentProcedure(formik.values.procedures[index]);
    setEditingIndex(index);
  };

  // Handle Clear Form
  const handleClear = () => {
    setCurrentProcedure(initialProcedureData);
    setEditingIndex(null);
  };

  // Handle Delete Procedure
  const handleDelete = (index: number) => {
    const updatedProcedures = formik.values.procedures.filter((_, i) => i !== index);
    formik.setFieldValue('procedures', updatedProcedures);

    // If deleting the currently editing item, clear the form
    if (editingIndex === index) {
      handleClear();
    }
  };

  // Table columns
  const columns = [
    {
      title: 'Procedure Name',
      dataIndex: 'name',
      key: 'name',
      width: '25%',
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
      width: '10%',
      align: 'center' as const,
    },
    {
      title: 'Teeth Numbers',
      dataIndex: 'teethNumbers',
      key: 'teethNumbers',
      width: '15%',
      render: (teethNumbers: number[]) =>
        teethNumbers && teethNumbers.length > 0 ? teethNumbers.join(', ') : '-',
    },
    {
      title: 'Unit Cost',
      dataIndex: 'unitCost',
      key: 'unitCost',
      width: '12%',
      align: 'right' as const,
      render: (cost: number) => `₹${cost.toFixed(2)}`,
    },
    {
      title: 'Discount',
      dataIndex: 'discount',
      key: 'discount',
      width: '12%',
      align: 'right' as const,
      render: (discount: number) => `₹${discount.toFixed(2)}`,
    },
    {
      title: 'Subtotal',
      key: 'subtotal',
      width: '12%',
      align: 'right' as const,
      render: (_: any, record: CreateProcedure) => `₹${calculateSubtotal(record).toFixed(2)}`,
    },
    {
      title: 'Actions',
      key: 'actions',
      width: '14%',
      align: 'center' as const,
      render: (_: any, record: CreateProcedure, index: number) => (
        <div className="flex gap-2 justify-center">
          <Button
            size="small"
            onClick={() => handleEdit(index)}
            disabled={editingIndex === index}
          >
            Edit
          </Button>
          <Button size="small" danger icon={<DeleteOutlined />} onClick={() => handleDelete(index)} />
        </div>
      ),
    },
  ];

  // Calculate total amount
  const totalAmount = formik.values.procedures.reduce(
    (sum, procedure) => sum + calculateSubtotal(procedure),
    0
  );

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">
          <MedicineBoxOutlined className="mr-2 text-blue-600" />
          Add Procedure
        </h3>

        {/* Template Selector + Form Fields */}
        <div className="flex flex-col md:flex-row gap-3 mb-4">
          {/* Left: Template Selector */}
          <div className="w-full md:w-3/12 md:min-w-[300px]">
            <TemplateSelector
              templates={procedureTemplates}
              isLoading={templatesLoading}
              onSelect={handleTemplateSelect}
              placeholder="Search procedure templates..."
              height="350px"
            />
          </div>

          {/* Right: Form Fields */}
          <div className="flex-1 space-y-3">
            {/* Procedure Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Procedure Name *
              </label>
              <Input
                value={currentProcedure.name}
                onChange={(e) =>
                  setCurrentProcedure({ ...currentProcedure, name: e.target.value })
                }
                placeholder="Enter procedure name"
                maxLength={100}
              />
            </div>

            {/* Quantity and Unit Cost */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Quantity *</label>
                <InputNumber
                  value={currentProcedure.quantity}
                  onChange={(value) =>
                    setCurrentProcedure({ ...currentProcedure, quantity: value || 1 })
                  }
                  min={1}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Unit Cost (₹) *
                </label>
                <InputNumber
                  value={currentProcedure.unitCost}
                  onChange={(value) =>
                    setCurrentProcedure({ ...currentProcedure, unitCost: value || 0 })
                  }
                  min={0}
                  precision={2}
                  className="w-full"
                />
              </div>
            </div>

            {/* Discount and Teeth Numbers */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Discount (₹)
                </label>
                <InputNumber
                  value={currentProcedure.discount}
                  onChange={(value) =>
                    setCurrentProcedure({ ...currentProcedure, discount: value || 0 })
                  }
                  min={0}
                  precision={2}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Teeth Numbers (Optional)
                </label>
                <Select
                  mode="tags"
                  value={currentProcedure.teethNumbers?.map(String) || []}
                  onChange={(values) => {
                    const teethNumbers = values
                      .map((val) => parseInt(val as string))
                      .filter((num) => !isNaN(num) && num >= 1 && num <= 32);
                    setCurrentProcedure({ ...currentProcedure, teethNumbers });
                  }}
                  placeholder="Select from examined teeth or type custom"
                  className="w-full"
                  tokenSeparators={[',']}
                  maxTagCount="responsive"
                >
                  {examinedTeethNumbers.map((toothNum) => (
                    <Option key={toothNum} value={toothNum.toString()}>
                      Tooth {toothNum}
                    </Option>
                  ))}
                </Select>
                <p className="text-xs text-gray-500 mt-1">
                  {examinedTeethNumbers.length > 0
                    ? 'Select from examined teeth or type custom numbers (1-32)'
                    : 'Type tooth numbers (1-32), separated by comma'}
                </p>
              </div>
            </div>

            {/* Note */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Note (Optional)
              </label>
              <TextArea
                value={currentProcedure.note}
                onChange={(e) =>
                  setCurrentProcedure({ ...currentProcedure, note: e.target.value })
                }
                placeholder="Add any additional notes"
                rows={2}
              />
            </div>

            {/* Subtotal Display */}
            <div className="bg-blue-50 p-3 rounded border border-blue-200">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">Subtotal:</span>
                <span className="text-lg font-bold text-blue-700">
                  ₹{calculateSubtotal(currentProcedure).toFixed(2)}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                (Unit Cost × Quantity) - Discount = ({currentProcedure.unitCost} ×{' '}
                {currentProcedure.quantity}) - {currentProcedure.discount}
              </p>
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
                disabled={
                  !currentProcedure.name || !currentProcedure.unitCost || currentProcedure.quantity < 1
                }
              >
                {editingIndex !== null ? 'Update Procedure' : 'Add Procedure'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Procedures Table */}
      <div>
        <h3 className="text-md font-semibold text-gray-900 mb-2">Procedures List</h3>
        <Table
          dataSource={formik.values.procedures}
          columns={columns}
          rowKey={(_, index) => index?.toString() || '0'}
          pagination={false}
          locale={{ emptyText: 'No procedures added yet' }}
          bordered
          size="small"
        />
      </div>

      {/* Total Amount */}
      {formik.values.procedures.length > 0 && (
        <div className="flex justify-end">
          <div className="bg-blue-50 border border-blue-200 rounded px-4 py-2">
            <span className="text-sm font-medium text-gray-700">Total Procedures Amount: </span>
            <span className="text-lg font-bold text-blue-700">₹{totalAmount.toFixed(2)}</span>
          </div>
        </div>
      )}
    </div>
  );
};

ProceduresSection.displayName = 'ProceduresSection';
