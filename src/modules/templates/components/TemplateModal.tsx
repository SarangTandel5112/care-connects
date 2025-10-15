/**
 * Template Modal Component
 * Base modal for viewing, creating, and updating templates
 * Supports all template types with dynamic form fields
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Button, Modal } from '@/components/ui';
import { Input } from '@/components/ui';
import { TrashIcon } from '@/components/ui/icons';
import { MedicineType } from '../types/template.types';
import { useDeleteInstruction, useMedicineTemplates } from '../hooks/useTemplates';
import { ModalMode, isCreateMode, isEditMode, isViewMode } from '@/types/modal.types';

import type { AnyTemplate, TemplateType } from '../types/template.types';

interface TemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: ModalMode;
  templateType: TemplateType;
  templateData?: AnyTemplate;
  onSave?: (data: Record<string, unknown>) => void;
  isLoading?: boolean;
}

export const TemplateModal: React.FC<TemplateModalProps> = ({
  isOpen,
  onClose,
  mode,
  templateType,
  templateData,
  onSave,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState<Record<string, unknown>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Debug form data changes
  useEffect(() => {
    console.log('Form data changed:', formData);
  }, [formData]);

  // Hook for deleting instructions
  const deleteInstruction = useDeleteInstruction();

  // Hook for getting medicines (for medicine package form)
  const { data: medicines, isLoading: medicinesLoading } = useMedicineTemplates();

  // State for medicine package form
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.medicine-dropdown-container')) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isDropdownOpen]);

  // Initialize form data based on template type and mode
  useEffect(() => {
    console.log('Form initialization effect:', { mode, templateType, isOpen });
    if (isOpen) {
      if (isCreateMode(mode)) {
        const defaultData = getDefaultFormData(templateType);
        console.log('Setting default form data:', defaultData);
        setFormData(defaultData);
      } else if (isEditMode(mode) || isViewMode(mode)) {
        console.log('Setting template data:', templateData);
        console.log('Template type:', templateType);
        console.log(
          'Medicines in template data:',
          templateData && 'medicines' in templateData
            ? (templateData as { medicines: unknown }).medicines
            : undefined
        );
        setFormData(templateData ? (templateData as unknown as Record<string, unknown>) : {});
      }
      setErrors({});
    }
  }, [mode, templateType, templateData, isOpen]);

  // Clear form when modal closes
  useEffect(() => {
    console.log('Modal open state changed:', isOpen);
    if (!isOpen) {
      console.log('Clearing form data');
      setFormData({});
      setErrors({});
    }
  }, [isOpen]);

  const getDefaultFormData = (type: string) => {
    switch (type) {
      case 'medicine':
        return {
          name: '',
          type: 'tablet',
          strength: '',
          unit: '',
          company: '',
          duration: '',
          durationType: 'day',
          morning: '',
          noon: '',
          evening: '',
          note: '',
        };
      case 'advice':
      case 'complaint':
      case 'examination':
        return {
          name: '',
          description: '',
        };
      case 'procedure':
        return {
          name: '',
          note: '',
          unitCost: '',
          instructions: [
            { name: '', description: '', visitDetails: 'before visit', duration: 'hour' },
          ],
        };
      case 'medicine-package':
        return {
          name: '',
          medicines: [],
        };
      default:
        return {};
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    console.log('Validating form data:', formData);
    console.log('Template type:', templateType);

    // Common validations
    if (typeof formData.name !== 'string' || !formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    // Type-specific validations
    if (templateType === 'medicine') {
      console.log('Medicine type validation - type field:', formData.type);
      if (!formData.type) {
        newErrors.type = 'Type is required';
      }
    }

    if (
      templateType === 'advice' ||
      templateType === 'complaint' ||
      templateType === 'examination'
    ) {
      if (typeof formData.description !== 'string' || !formData.description.trim()) {
        newErrors.description = 'Description is required';
      }
    }

    if (templateType === 'procedure') {
      if (typeof formData.note !== 'string' || !formData.note.trim()) {
        newErrors.note = 'Note is required';
      }
      if (!formData.unitCost || typeof formData.unitCost !== 'number' || formData.unitCost < 0) {
        newErrors.unitCost = 'Valid cost is required';
      }
    }

    console.log('Validation errors:', newErrors);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    console.log('handleSave called', { formData, templateType, mode });
    console.log('Description field:', formData.description);
    if (validateForm()) {
      console.log('Form validation passed, calling onSave');
      // Don't close modal here - let parent handle it after API success
      onSave?.(formData);
    } else {
      console.log('Form validation failed', errors);
    }
  };

  const handleInputChange = (field: string, value: unknown) => {
    // Convert numeric fields to numbers
    const numericFields = ['unitCost', 'morning', 'noon', 'evening', 'duration'];
    const processedValue = numericFields.includes(field) && value !== '' ? Number(value) : value;

    setFormData((prev) => ({ ...prev, [field]: processedValue }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const addInstruction = () => {
    setFormData((prev) => ({
      ...prev,
      instructions: [
        ...(Array.isArray(prev.instructions) ? prev.instructions : []),
        { name: '', description: '', visitDetails: 'before visit', duration: 'hour' },
      ],
    }));
  };

  const removeInstruction = async (index: number) => {
    const instructions = formData.instructions;
    if (!Array.isArray(instructions)) return;

    const instruction = instructions[index] as { id?: string } | undefined;

    // If instruction has an ID (existing instruction), call the API to delete it
    if (instruction && 'id' in instruction && instruction.id) {
      try {
        await deleteInstruction.mutateAsync(instruction.id);
        // Remove from local state after successful API call
        setFormData((prev) => ({
          ...prev,
          instructions: Array.isArray(prev.instructions)
            ? prev.instructions.filter((_, i) => i !== index)
            : [],
        }));
      } catch (error) {
        console.error('Error deleting instruction:', error);
        // Don't remove from local state if API call fails
      }
    } else {
      // For new instructions (no ID), just remove from local state
      setFormData((prev) => ({
        ...prev,
        instructions: Array.isArray(prev.instructions)
          ? prev.instructions.filter((_, i) => i !== index)
          : [],
      }));
    }
  };

  const updateInstruction = (index: number, field: string, value: string) => {
    // Convert numeric fields to numbers
    const numericFields = ['unitCost', 'morning', 'noon', 'evening', 'duration'];
    const processedValue = numericFields.includes(field) && value !== '' ? Number(value) : value;

    setFormData((prev) => ({
      ...prev,
      instructions: Array.isArray(prev.instructions)
        ? prev.instructions.map((instruction, i) =>
            i === index && typeof instruction === 'object' && instruction !== null
              ? { ...instruction, [field]: processedValue }
              : instruction
          )
        : [],
    }));
  };

  const renderMedicineForm = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Medicine Name *</label>
        <Input
          value={typeof formData.name === 'string' ? formData.name : ''}
          onChange={(e) => handleInputChange('name', e.target.value)}
          placeholder="Enter medicine name"
          disabled={mode === 'view'}
          className={errors.name ? 'border-red-500' : ''}
        />
        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Type *</label>
          <select
            value={typeof formData.type === 'string' ? formData.type : 'tablet'}
            onChange={(e) => handleInputChange('type', e.target.value)}
            disabled={isViewMode(mode)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
          >
            {Object.values(MedicineType).map((type) => (
              <option key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Strength</label>
          <Input
            value={
              typeof formData.strength === 'string' || typeof formData.strength === 'number'
                ? formData.strength
                : ''
            }
            onChange={(e) => handleInputChange('strength', e.target.value)}
            placeholder="e.g., 500mg"
            disabled={isViewMode(mode)}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
          <Input
            value={
              typeof formData.unit === 'string' || typeof formData.unit === 'number'
                ? formData.unit
                : ''
            }
            onChange={(e) => handleInputChange('unit', e.target.value)}
            placeholder="e.g., mg, ml"
            disabled={isViewMode(mode)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
          <Input
            value={
              typeof formData.company === 'string' || typeof formData.company === 'number'
                ? formData.company
                : ''
            }
            onChange={(e) => handleInputChange('company', e.target.value)}
            placeholder="Pharmaceutical company"
            disabled={isViewMode(mode)}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
          <Input
            type="number"
            value={
              typeof formData.duration === 'string' || typeof formData.duration === 'number'
                ? formData.duration
                : ''
            }
            onChange={(e) => handleInputChange('duration', e.target.value)}
            placeholder="Duration"
            disabled={isViewMode(mode)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Duration Type</label>
          <select
            value={typeof formData.durationType === 'string' ? formData.durationType : 'day'}
            onChange={(e) => handleInputChange('durationType', e.target.value)}
            disabled={isViewMode(mode)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
          >
            <option value="hour">Hour</option>
            <option value="day">Day</option>
            <option value="week">Week</option>
            <option value="month">Month</option>
            <option value="year">Year</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Morning</label>
          <Input
            type="number"
            value={
              typeof formData.morning === 'string' || typeof formData.morning === 'number'
                ? formData.morning
                : ''
            }
            onChange={(e) => handleInputChange('morning', e.target.value)}
            placeholder="Dosage"
            disabled={isViewMode(mode)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Noon</label>
          <Input
            type="number"
            value={
              typeof formData.noon === 'string' || typeof formData.noon === 'number'
                ? formData.noon
                : ''
            }
            onChange={(e) => handleInputChange('noon', e.target.value)}
            placeholder="Dosage"
            disabled={isViewMode(mode)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Evening</label>
          <Input
            type="number"
            value={
              typeof formData.evening === 'string' || typeof formData.evening === 'number'
                ? formData.evening
                : ''
            }
            onChange={(e) => handleInputChange('evening', e.target.value)}
            placeholder="Dosage"
            disabled={isViewMode(mode)}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Note</label>
        <textarea
          value={
            typeof formData.note === 'string' || typeof formData.note === 'number'
              ? formData.note
              : ''
          }
          onChange={(e) => handleInputChange('note', e.target.value)}
          placeholder="Additional notes"
          disabled={mode === 'view'}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
        />
      </div>
    </div>
  );

  const renderAdviceForm = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Advice Name *</label>
        <Input
          value={
            typeof formData.name === 'string' || typeof formData.name === 'number'
              ? formData.name
              : ''
          }
          onChange={(e) => handleInputChange('name', e.target.value)}
          placeholder="Enter advice name"
          disabled={mode === 'view'}
          className={errors.name ? 'border-red-500' : ''}
        />
        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Advice Description *</label>
        <textarea
          value={
            typeof formData.description === 'string' || typeof formData.description === 'number'
              ? formData.description
              : ''
          }
          onChange={(e) => handleInputChange('description', e.target.value)}
          placeholder="Enter advice description"
          disabled={mode === 'view'}
          rows={4}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
        />
        {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
      </div>
    </div>
  );

  const renderComplaintForm = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Complaint Name *</label>
        <Input
          value={
            typeof formData.name === 'string' || typeof formData.name === 'number'
              ? formData.name
              : ''
          }
          onChange={(e) => handleInputChange('name', e.target.value)}
          placeholder="Enter complaint name"
          disabled={mode === 'view'}
          className={errors.name ? 'border-red-500' : ''}
        />
        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Complaint Description *
        </label>
        <textarea
          value={
            typeof formData.description === 'string' || typeof formData.description === 'number'
              ? formData.description
              : ''
          }
          onChange={(e) => handleInputChange('description', e.target.value)}
          placeholder="Enter complaint description"
          disabled={mode === 'view'}
          rows={4}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
        />
        {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
      </div>
    </div>
  );

  const renderProcedureForm = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Procedure Name *</label>
        <Input
          value={
            typeof formData.name === 'string' || typeof formData.name === 'number'
              ? formData.name
              : ''
          }
          onChange={(e) => handleInputChange('name', e.target.value)}
          placeholder="Enter procedure name"
          disabled={mode === 'view'}
          className={errors.name ? 'border-red-500' : ''}
        />
        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Note *</label>
        <textarea
          value={
            typeof formData.note === 'string' || typeof formData.note === 'number'
              ? formData.note
              : ''
          }
          onChange={(e) => handleInputChange('note', e.target.value)}
          placeholder="Enter procedure note"
          disabled={mode === 'view'}
          rows={3}
          className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white ${errors.note ? 'border-red-500' : ''}`}
        />
        {errors.note && <p className="text-red-500 text-xs mt-1">{errors.note}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Unit Cost *</label>
        <Input
          type="number"
          value={
            typeof formData.unitCost === 'string' || typeof formData.unitCost === 'number'
              ? formData.unitCost
              : ''
          }
          onChange={(e) => handleInputChange('unitCost', e.target.value)}
          placeholder="Enter cost"
          disabled={mode === 'view'}
          className={errors.unitCost ? 'border-red-500' : ''}
        />
        {errors.unitCost && <p className="text-red-500 text-xs mt-1">{errors.unitCost}</p>}
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-gray-700">Instructions</label>
          {mode !== 'view' && (
            <Button
              variant="secondary"
              size="sm"
              onClick={addInstruction}
              className="text-blue-600 hover:text-blue-800"
            >
              Add Instruction
            </Button>
          )}
        </div>

        {Array.isArray(formData.instructions) &&
          formData.instructions.map((instruction, index: number) => {
            const inst = instruction as {
              id?: string;
              name?: string;
              description?: string;
              visitDetails?: string;
              duration?: string;
            };
            return (
              <div key={index} className="border border-gray-200 rounded-lg p-4 mb-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Instruction {index + 1}</span>
                  {mode !== 'view' && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeInstruction(index)}
                      disabled={deleteInstruction.isPending}
                      loading={deleteInstruction.isPending}
                      className="text-red-600 hover:text-red-800"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <Input
                      value={inst.name || ''}
                      onChange={(e) => updateInstruction(index, 'name', e.target.value)}
                      placeholder="Instruction name"
                      disabled={isViewMode(mode)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      value={inst.description || ''}
                      onChange={(e) => updateInstruction(index, 'description', e.target.value)}
                      placeholder="Instruction description"
                      disabled={isViewMode(mode)}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Visit Details
                      </label>
                      <select
                        value={inst.visitDetails || 'before visit'}
                        onChange={(e) => updateInstruction(index, 'visitDetails', e.target.value)}
                        disabled={isViewMode(mode)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                      >
                        <option value="before visit">Before Visit</option>
                        <option value="after visit">After Visit</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Duration
                      </label>
                      <select
                        value={inst.duration || 'hour'}
                        onChange={(e) => updateInstruction(index, 'duration', e.target.value)}
                        disabled={isViewMode(mode)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                      >
                        <option value="hour">Hour</option>
                        <option value="day">Day</option>
                        <option value="week">Week</option>
                        <option value="month">Month</option>
                        <option value="year">Year</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );

  const renderExaminationForm = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Examination Name *</label>
        <Input
          value={
            typeof formData.name === 'string' || typeof formData.name === 'number'
              ? formData.name
              : ''
          }
          onChange={(e) => handleInputChange('name', e.target.value)}
          placeholder="Enter examination name"
          disabled={mode === 'view'}
          className={errors.name ? 'border-red-500' : ''}
        />
        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Examination Description *
        </label>
        <textarea
          value={
            typeof formData.description === 'string' || typeof formData.description === 'number'
              ? formData.description
              : ''
          }
          onChange={(e) => handleInputChange('description', e.target.value)}
          placeholder="Enter examination description"
          disabled={mode === 'view'}
          rows={4}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
        />
        {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
      </div>
    </div>
  );

  const renderMedicinePackageForm = () => {
    // Filter medicines based on search term
    const filteredMedicines =
      medicines?.filter(
        (medicine) =>
          medicine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          medicine.type.toLowerCase().includes(searchTerm.toLowerCase())
      ) || [];

    // Get selected medicine details
    // Handle both cases: medicines as IDs (string[]) or as full objects (TemplateMedicine[])
    const selectedMedicines = (() => {
      const meds = formData.medicines;
      if (!Array.isArray(meds) || meds.length === 0) return [];

      // If medicines are already full objects, return them
      if (typeof meds[0] === 'object' && meds[0] !== null) {
        return meds as Array<{
          id: string;
          name: string;
          type: string;
          strength: string;
          unit: string;
        }>;
      }

      // If medicines are IDs, filter from the medicines list
      if (Array.isArray(meds)) {
        return medicines?.filter((medicine) => meds.includes(medicine.id)) || [];
      }
      return [];
    })();

    console.log('Medicine package form - formData.medicines:', formData.medicines);
    console.log('Medicine package form - selectedMedicines:', selectedMedicines);

    const addMedicine = (medicineId: string) => {
      const currentMedicines = formData.medicines;
      const medsArray = Array.isArray(currentMedicines) ? currentMedicines : [];

      // Handle both cases: medicines as IDs or as full objects
      if (medsArray.length > 0 && typeof medsArray[0] === 'object' && medsArray[0] !== null) {
        // If medicines are full objects, check if medicine already exists
        const medicineExists = medsArray.some(
          (med) => typeof med === 'object' && med !== null && 'id' in med && med.id === medicineId
        );
        if (!medicineExists) {
          // Find the medicine object from the medicines list
          const medicineToAdd = medicines?.find((med) => med.id === medicineId);
          if (medicineToAdd) {
            handleInputChange('medicines', [...medsArray, medicineToAdd]);
          }
        }
      } else {
        // If medicines are IDs, add the ID directly
        if (!medsArray.includes(medicineId)) {
          handleInputChange('medicines', [...medsArray, medicineId]);
        }
      }

      setSearchTerm('');
      setIsDropdownOpen(false);
    };

    const removeMedicine = (medicineId: string) => {
      const currentMedicines = formData.medicines;
      const medsArray = Array.isArray(currentMedicines) ? currentMedicines : [];

      // Handle both cases: medicines as IDs or as full objects
      if (medsArray.length > 0 && typeof medsArray[0] === 'object' && medsArray[0] !== null) {
        // If medicines are full objects, filter by id property
        handleInputChange(
          'medicines',
          medsArray.filter(
            (medicine) =>
              !(
                typeof medicine === 'object' &&
                medicine !== null &&
                'id' in medicine &&
                medicine.id === medicineId
              )
          )
        );
      } else {
        // If medicines are IDs, filter directly
        handleInputChange(
          'medicines',
          medsArray.filter((id) => id !== medicineId)
        );
      }
    };

    return (
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Package Name *</label>
          <Input
            value={
              typeof formData.name === 'string' || typeof formData.name === 'number'
                ? formData.name
                : ''
            }
            onChange={(e) => handleInputChange('name', e.target.value)}
            placeholder="Enter package name"
            disabled={isViewMode(mode)}
            className={errors.name ? 'border-red-500' : ''}
          />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Medicines</label>

          {/* Search Input */}
          <div className="relative medicine-dropdown-container">
            <Input
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setIsDropdownOpen(true);
              }}
              onFocus={() => setIsDropdownOpen(true)}
              placeholder="Search medicines..."
              disabled={isViewMode(mode)}
              className="w-full"
            />

            {/* Dropdown */}
            {isDropdownOpen && !medicinesLoading && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60">
                <div className="max-h-60 overflow-y-auto">
                  {filteredMedicines.length > 0 ? (
                    filteredMedicines.map((medicine) => (
                      <div
                        key={medicine.id}
                        onClick={() => addMedicine(medicine.id)}
                        className="px-3 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-sm font-medium text-gray-900">{medicine.name}</p>
                            <p className="text-xs text-gray-500">
                              {medicine.type} - {medicine.strength} {medicine.unit}
                            </p>
                          </div>
                          {(() => {
                            const currentMedicines = formData.medicines;
                            const medsArray = Array.isArray(currentMedicines)
                              ? currentMedicines
                              : [];
                            const isSelected =
                              medsArray.length > 0 &&
                              typeof medsArray[0] === 'object' &&
                              medsArray[0] !== null
                                ? medsArray.some(
                                    (med) =>
                                      typeof med === 'object' &&
                                      med !== null &&
                                      'id' in med &&
                                      med.id === medicine.id
                                  )
                                : medsArray.includes(medicine.id);
                            return (
                              isSelected && (
                                <span className="text-xs text-green-600 font-medium">Selected</span>
                              )
                            );
                          })()}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="px-3 py-2 text-sm text-gray-500">
                      {searchTerm ? 'No medicines found' : 'No medicines available'}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Selected Medicines */}
          {selectedMedicines.length > 0 && (
            <div className="mt-3 space-y-2">
              <p className="text-sm font-medium text-gray-700">Selected Medicines:</p>
              <div className="max-h-48 overflow-y-auto border border-gray-200 rounded-md p-2 bg-gray-50">
                <div className="space-y-1">
                  {selectedMedicines.map((medicine) => (
                    <div
                      key={medicine.id}
                      className="flex items-center justify-between bg-white px-3 py-2 rounded-md shadow-sm"
                    >
                      <div>
                        <span className="text-sm font-medium text-gray-900">{medicine.name}</span>
                        <span className="text-xs text-gray-500 ml-2">
                          ({medicine.type} - {medicine.strength} {medicine.unit})
                        </span>
                      </div>
                      {mode !== 'view' && (
                        <button
                          onClick={() => removeMedicine(medicine.id)}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Loading State */}
          {medicinesLoading && (
            <div className="mt-3 p-3 border border-gray-300 rounded-md">
              <p className="text-sm text-gray-500">Loading medicines...</p>
            </div>
          )}

          {/* Empty State */}
          {!medicinesLoading && medicines?.length === 0 && (
            <div className="mt-3 p-3 border border-gray-300 rounded-md">
              <p className="text-sm text-gray-500">No medicines available</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderForm = () => {
    switch (templateType) {
      case 'medicine':
        return renderMedicineForm();
      case 'advice':
        return renderAdviceForm();
      case 'complaint':
        return renderComplaintForm();
      case 'procedure':
        return renderProcedureForm();
      case 'examination':
        return renderExaminationForm();
      case 'medicine-package':
        return renderMedicinePackageForm();
      default:
        return <div>Unsupported template type</div>;
    }
  };

  const getModalTitle = () => {
    const typeLabels = {
      medicine: 'Medicine',
      advice: 'Advice',
      complaint: 'Complaint',
      procedure: 'Procedure',
      examination: 'Examination',
      'medicine-package': 'Medicine Package',
    };

    const modeLabels = {
      view: 'View',
      create: 'Create',
      edit: 'Edit',
    };

    return `${modeLabels[mode]} ${typeLabels[templateType]} Template`;
  };

  const renderFooter = () => {
    if (isViewMode(mode)) {
      return (
        <div className="flex justify-end">
          <Button variant="primary" onClick={onClose}>
            Close
          </Button>
        </div>
      );
    }

    return (
      <div className="flex justify-end gap-3">
        <Button variant="secondary" onClick={onClose} disabled={isLoading}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSave} disabled={isLoading} loading={isLoading}>
          {isCreateMode(mode) ? 'Create' : 'Update'}
        </Button>
      </div>
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={getModalTitle()}
      size="xl"
      footer={renderFooter()}
    >
      <div>{renderForm()}</div>
    </Modal>
  );
};
