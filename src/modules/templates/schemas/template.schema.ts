/**
 * Template Schemas
 * Based on backend DTOs with Zod validation
 * Defines types and validation for all template entities
 */

import { z } from 'zod';

// ============================================
// ENUMS
// ============================================

export const MedicineTypeEnum = z.enum([
  'tablet',
  'capsule',
  'drop',
  'syrup',
  'injection',
  'ointment',
  'suspension',
  'powder',
  'cream',
  'gel',
  'liquid',
  'oil',
  'drops',
  'foam',
  'inhaler',
  'lotion',
  'mouthwash',
  'shampoo',
  'spray',
  'syringe',
]);

export const DurationTypeEnum = z.enum(['hour', 'day', 'week', 'month', 'year']);

export const VisitDetailsEnum = z.enum(['before visit', 'after visit']);

// ============================================
// ADVICE TEMPLATE
// ============================================

export const createAdviceTemplateSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
});

export type CreateAdviceTemplate = z.infer<typeof createAdviceTemplateSchema>;

export const adviceTemplateSchema = createAdviceTemplateSchema.extend({
  id: z.string().uuid(),
});

export type AdviceTemplate = z.infer<typeof adviceTemplateSchema>;

// ============================================
// COMPLAINT TEMPLATE
// ============================================

export const createComplaintTemplateSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
});

export type CreateComplaintTemplate = z.infer<typeof createComplaintTemplateSchema>;

export const complaintTemplateSchema = createComplaintTemplateSchema.extend({
  id: z.string().uuid(),
});

export type ComplaintTemplate = z.infer<typeof complaintTemplateSchema>;

// ============================================
// EXAMINATION TEMPLATE
// ============================================

export const createExaminationTemplateSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
});

export type CreateExaminationTemplate = z.infer<typeof createExaminationTemplateSchema>;

export const examinationTemplateSchema = createExaminationTemplateSchema.extend({
  id: z.string().uuid(),
});

export type ExaminationTemplate = z.infer<typeof examinationTemplateSchema>;

// ============================================
// MEDICINE TEMPLATE
// ============================================

export const createMedicineTemplateSchema = z.object({
  name: z.string().min(1, 'Medicine name is required'),
  type: MedicineTypeEnum,
  strength: z.string().optional(),
  unit: z.string().optional(),
  company: z.string().optional(),
  duration: z.number().int().positive().optional(),
  durationType: DurationTypeEnum.optional(),
  morning: z.number().nonnegative().optional(),
  noon: z.number().nonnegative().optional(),
  evening: z.number().nonnegative().optional(),
  note: z.string().optional(),
});

export type CreateMedicineTemplate = z.infer<typeof createMedicineTemplateSchema>;

export const medicineTemplateSchema = createMedicineTemplateSchema.extend({
  id: z.string().uuid(),
});

export type MedicineTemplate = z.infer<typeof medicineTemplateSchema>;

// ============================================
// PROCEDURE TEMPLATE
// ============================================

export const instructionSchema = z.object({
  name: z.string().min(1, 'Instruction name is required'),
  description: z.string().optional(),
  visitDetails: VisitDetailsEnum.optional(),
  duration: DurationTypeEnum.optional(),
});

export type Instruction = z.infer<typeof instructionSchema>;

export const createProcedureTemplateSchema = z.object({
  name: z.string().min(1, 'Procedure name is required'),
  note: z.string().min(1, 'Note is required'),
  unitCost: z.number().int().nonnegative('Cost must be non-negative'),
  instructions: z.array(instructionSchema).optional(),
});

export type CreateProcedureTemplate = z.infer<typeof createProcedureTemplateSchema>;

export const procedureTemplateSchema = createProcedureTemplateSchema.extend({
  id: z.string().uuid(),
});

export type ProcedureTemplate = z.infer<typeof procedureTemplateSchema>;

// ============================================
// MEDICINE PACKAGE TEMPLATE
// ============================================

export const createMedicinePackageTemplateSchema = z.object({
  name: z.string().min(1, 'Package name is required'),
  medicines: z.array(z.string().uuid('Invalid medicine ID')).optional(),
});

export type CreateMedicinePackageTemplate = z.infer<typeof createMedicinePackageTemplateSchema>;

export const medicinePackageTemplateSchema = createMedicinePackageTemplateSchema.extend({
  id: z.string().uuid(),
});

export type MedicinePackageTemplate = z.infer<typeof medicinePackageTemplateSchema>;

// ============================================
// TYPE EXPORTS FOR UI ENUMS (uppercased for consistency)
// ============================================

export type MedicineType = z.infer<typeof MedicineTypeEnum>;
export type DurationType = z.infer<typeof DurationTypeEnum>;
export type VisitDetails = z.infer<typeof VisitDetailsEnum>;
