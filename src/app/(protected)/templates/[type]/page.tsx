/**
 * Template Type Page
 * Displays template management with tabs for switching between different template types
 * Professional medical application design - UI only (functionality to be added later)
 * Following Single Responsibility Principle
 */

'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Tabs } from '@/components/tab-view';
import { MedicineTemplateTable } from '@/modules/templates';
import { AdviceTemplateTable } from '@/modules/templates';
import { ComplaintTemplateTable } from '@/modules/templates';
import { ExaminationTemplateTable } from '@/modules/templates';
import { ProcedureTemplateTable } from '@/modules/templates';
import { MedicinePackageTemplateTable } from '@/modules/templates';
import { TemplateModal } from '@/modules/templates';
import { Button, ConfirmationModal } from '@/components/ui';
import { PlusIcon } from '@/components/ui/icons';
import {
  useCreateAdviceTemplate,
  useCreateComplaintTemplate,
  useCreateExaminationTemplate,
  useCreateProcedureTemplate,
  useCreateMedicineTemplate,
  useCreateMedicinePackageTemplate,
  useUpdateAdviceTemplate,
  useUpdateComplaintTemplate,
  useUpdateExaminationTemplate,
  useUpdateProcedureTemplate,
  useUpdateMedicineTemplate,
  useUpdateMedicinePackageTemplate,
  useDeleteAdviceTemplate,
  useDeleteComplaintTemplate,
  useDeleteExaminationTemplate,
  useDeleteProcedureTemplate,
  useDeleteMedicineTemplate,
  useDeleteMedicinePackageTemplate,
} from '@/modules/templates/hooks/useTemplates';

// Template types
const TEMPLATE_TYPES = [
  { label: 'Advice', value: 'advice' },
  { label: 'Complaint', value: 'complaint' },
  { label: 'Examination', value: 'examination' },
  { label: 'Procedure', value: 'procedure' },
  { label: 'Medicine', value: 'medicine' },
  { label: 'Medicine Package', value: 'medicine-package' },
];

export default function TemplateTypePage() {
  const params = useParams<{ type: string }>();
  const router = useRouter();

  const currentType = params?.type || 'advice';

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'view'>('create');
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);

  // Delete confirmation modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [templateToDelete, setTemplateToDelete] = useState<any>(null);

  const handleAddTemplate = () => {
    console.log('handleAddTemplate called', { currentType, paramsType: params.type });
    setModalMode('create');
    setSelectedTemplate(null);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedTemplate(null);
  };

  // Get the appropriate API hooks based on template type
  const createAdvice = useCreateAdviceTemplate();
  const createComplaint = useCreateComplaintTemplate();
  const createExamination = useCreateExaminationTemplate();
  const createProcedure = useCreateProcedureTemplate();
  const createMedicine = useCreateMedicineTemplate();
  const createMedicinePackage = useCreateMedicinePackageTemplate();

  const updateAdvice = useUpdateAdviceTemplate();
  const updateComplaint = useUpdateComplaintTemplate();
  const updateExamination = useUpdateExaminationTemplate();
  const updateProcedure = useUpdateProcedureTemplate();
  const updateMedicine = useUpdateMedicineTemplate();
  const updateMedicinePackage = useUpdateMedicinePackageTemplate();

  const deleteAdvice = useDeleteAdviceTemplate();
  const deleteComplaint = useDeleteComplaintTemplate();
  const deleteExamination = useDeleteExaminationTemplate();
  const deleteProcedure = useDeleteProcedureTemplate();
  const deleteMedicine = useDeleteMedicineTemplate();
  const deleteMedicinePackage = useDeleteMedicinePackageTemplate();

  // Get loading states for save operations
  const isCreating =
    createAdvice.isPending ||
    createComplaint.isPending ||
    createExamination.isPending ||
    createProcedure.isPending ||
    createMedicine.isPending ||
    createMedicinePackage.isPending;

  const isUpdating =
    updateAdvice.isPending ||
    updateComplaint.isPending ||
    updateExamination.isPending ||
    updateProcedure.isPending ||
    updateMedicine.isPending ||
    updateMedicinePackage.isPending;

  const isDeleting =
    deleteAdvice.isPending ||
    deleteComplaint.isPending ||
    deleteExamination.isPending ||
    deleteProcedure.isPending ||
    deleteMedicine.isPending ||
    deleteMedicinePackage.isPending;

  // Clean up empty/undefined values from form data
  const cleanFormData = (data: any) => {
    const cleaned: any = {};
    // Fields that should be converted to numbers if they have values
    const numericFields = ['duration', 'morning', 'noon', 'evening', 'unitCost'];

    for (const key in data) {
      const value = data[key];

      // Skip undefined, null, and NaN values
      if (value === undefined || value === null || Number.isNaN(value)) {
        continue;
      }

      // Handle empty strings for numeric fields - exclude them entirely
      if (numericFields.includes(key) && value === '') {
        continue;
      }

      // Special handling for medicine packages - convert medicine objects to IDs
      if (key === 'medicines' && Array.isArray(value) && value.length > 0) {
        // If medicines are objects, extract just the IDs
        if (typeof value[0] === 'object' && value[0].id) {
          cleaned[key] = value.map((medicine: any) => medicine.id);
        } else {
          // If medicines are already IDs, keep them as is
          cleaned[key] = value;
        }
      }
      // Convert numeric fields to numbers if they have values
      else if (numericFields.includes(key) && value !== '') {
        cleaned[key] = Number(value);
      } else {
        cleaned[key] = value;
      }
    }
    return cleaned;
  };

  const handleSave = async (data: any) => {
    console.log('Parent handleSave called', { data, modalMode, paramsType: params.type });
    try {
      // Clean form data to remove empty values
      const cleanedData = cleanFormData(data);
      console.log('Cleaned data:', cleanedData);

      if (modalMode === 'create') {
        // Create new template
        switch (params.type) {
          case 'advice':
            await createAdvice.mutateAsync(cleanedData);
            break;
          case 'complaint':
            await createComplaint.mutateAsync(cleanedData);
            break;
          case 'examination':
            await createExamination.mutateAsync(cleanedData);
            break;
          case 'procedure':
            await createProcedure.mutateAsync(cleanedData);
            break;
          case 'medicine':
            await createMedicine.mutateAsync(cleanedData);
            break;
          case 'medicine-package':
            await createMedicinePackage.mutateAsync(cleanedData);
            break;
          default:
            throw new Error(`Unsupported template type: ${params.type}`);
        }
      } else if (modalMode === 'edit') {
        // Update existing template - remove id from data
        const { id, ...updateData } = cleanedData;

        switch (params.type) {
          case 'advice':
            await updateAdvice.mutateAsync({ data: updateData, id: selectedTemplate.id });
            break;
          case 'complaint':
            await updateComplaint.mutateAsync({ data: updateData, id: selectedTemplate.id });
            break;
          case 'examination':
            await updateExamination.mutateAsync({ data: updateData, id: selectedTemplate.id });
            break;
          case 'procedure':
            await updateProcedure.mutateAsync({ data: updateData, id: selectedTemplate.id });
            break;
          case 'medicine':
            await updateMedicine.mutateAsync({ data: updateData, id: selectedTemplate.id });
            break;
          case 'medicine-package':
            await updateMedicinePackage.mutateAsync({ data: updateData, id: selectedTemplate.id });
            break;
          default:
            throw new Error(`Unsupported template type: ${params.type}`);
        }
      }
      // Only close modal after successful API call
      handleModalClose();
    } catch (error) {
      console.error('Error saving template:', error);
      // Error handling is done by the API hooks with toast messages
      // Don't close modal on error - let user retry
    }
  };

  const handleEditTemplate = (template: any) => {
    setSelectedTemplate(template);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleViewTemplate = (template: any) => {
    setSelectedTemplate(template);
    setModalMode('view');
    setIsModalOpen(true);
  };

  const handleDeleteTemplate = (template: any) => {
    setTemplateToDelete(template);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!templateToDelete) return;

    try {
      // Delete template based on type
      switch (params.type) {
        case 'advice':
          await deleteAdvice.mutateAsync(templateToDelete.id);
          break;
        case 'complaint':
          await deleteComplaint.mutateAsync(templateToDelete.id);
          break;
        case 'examination':
          await deleteExamination.mutateAsync(templateToDelete.id);
          break;
        case 'procedure':
          await deleteProcedure.mutateAsync(templateToDelete.id);
          break;
        case 'medicine':
          await deleteMedicine.mutateAsync(templateToDelete.id);
          break;
        case 'medicine-package':
          await deleteMedicinePackage.mutateAsync(templateToDelete.id);
          break;
        default:
          throw new Error(`Unsupported template type: ${params.type}`);
      }

      // Close modals and reset state
      setIsDeleteModalOpen(false);
      setTemplateToDelete(null);
    } catch (error) {
      console.error('Error deleting template:', error);
      // Error handling is done by the API hooks with toast messages
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
    setTemplateToDelete(null);
  };

  const handleTabChange = (value: string) => {
    router.push(`/templates/${value}`);
  };

  // Template content component for each tab
  const TemplateContent = ({ type }: { type: string }) => {
    const renderTemplateTable = () => {
      switch (params.type) {
        case 'medicine':
          return (
            <MedicineTemplateTable
              onEditTemplate={handleEditTemplate}
              onViewTemplate={handleViewTemplate}
              onDeleteTemplate={handleDeleteTemplate}
              isCreating={isCreating}
              isUpdating={isUpdating}
              isDeleting={isDeleting}
            />
          );
        case 'advice':
          return (
            <AdviceTemplateTable
              onEditTemplate={handleEditTemplate}
              onViewTemplate={handleViewTemplate}
              onDeleteTemplate={handleDeleteTemplate}
              isCreating={isCreating}
              isUpdating={isUpdating}
              isDeleting={isDeleting}
            />
          );
        case 'procedure':
          return (
            <ProcedureTemplateTable
              onEditTemplate={handleEditTemplate}
              onViewTemplate={handleViewTemplate}
              onDeleteTemplate={handleDeleteTemplate}
            />
          );
        case 'complaint':
          return (
            <ComplaintTemplateTable
              onEditTemplate={handleEditTemplate}
              onViewTemplate={handleViewTemplate}
              onDeleteTemplate={handleDeleteTemplate}
            />
          );
        case 'examination':
          return (
            <ExaminationTemplateTable
              onEditTemplate={handleEditTemplate}
              onViewTemplate={handleViewTemplate}
              onDeleteTemplate={handleDeleteTemplate}
            />
          );
        case 'medicine-package':
          return (
            <MedicinePackageTemplateTable
              onEditTemplate={handleEditTemplate}
              onViewTemplate={handleViewTemplate}
              onDeleteTemplate={handleDeleteTemplate}
            />
          );
        default:
          return (
            <AdviceTemplateTable
              onEditTemplate={handleEditTemplate}
              onViewTemplate={handleViewTemplate}
              onDeleteTemplate={handleDeleteTemplate}
            />
          );
      }
    };

    return <div className="h-full">{renderTemplateTable()}</div>;
  };

  // Create tabs with template types (only labels and values, no content)
  const tabs = TEMPLATE_TYPES.map((templateType) => ({
    label: templateType.label,
    value: templateType.value,
  }));

  return (
    <div className="h-full w-full flex flex-col">
      {/* Header Section */}
      <div className="flex-shrink-0 bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Title */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1">Templates</h1>
            <p className="text-sm text-gray-700 mt-1">
              Manage {currentType.charAt(0).toUpperCase() + currentType.slice(1)} templates
            </p>
          </div>

          {/* Add Template Button */}
          <div className="flex items-center gap-4">
            <Button
              variant="primary"
              onClick={handleAddTemplate}
              className="flex items-center gap-2"
            >
              <PlusIcon className="h-4 w-4" />
              Add Template
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs and Table Content - Separated for independent scrolling */}
      <div className="flex-1 min-h-0 bg-gray-50 flex flex-col">
        {/* Tabs Container - Horizontal scroll on mobile */}
        <div className="flex-shrink-0 bg-white border-b border-gray-200 px-3 sm:px-6 py-2 overflow-x-auto scrollbar-hide">
          <div className="min-w-max">
            <Tabs
              tabs={tabs}
              value={currentType}
              onChange={handleTabChange}
              variant="underlined"
              color="primary"
              className="border-gray-200"
            />
          </div>
        </div>

        {/* Table Content - Vertical scroll */}
        <div className="flex-1 min-h-0 overflow-auto">
          <TemplateContent type={currentType} />
        </div>
      </div>

      {/* Template Modal */}
      <TemplateModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        mode={modalMode}
        templateType={currentType as any}
        templateData={selectedTemplate}
        onSave={handleSave}
        isLoading={isCreating || isUpdating}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="Delete Template"
        message={`Are you sure you want to delete "${templateToDelete?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        isLoading={isDeleting}
      />
    </div>
  );
}
