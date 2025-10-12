/**
 * Template Types
 * Based on backend DTOs and entities
 * Defines TypeScript interfaces for all template types
 */

// ============================================
// ENUMS
// ============================================

export enum MedicineType {
  TABLET = 'tablet',
  CAPSULE = 'capsule',
  DROP = 'drop',
  SYRUP = 'syrup',
  INJECTION = 'injection',
  OINTMENT = 'ointment',
  SUSPENSION = 'suspension',
  POWDER = 'powder',
  CREAM = 'cream',
  GEL = 'gel',
  LIQUID = 'liquid',
  OIL = 'oil',
  DROPS = 'drops',
  FOAM = 'foam',
  INHALER = 'inhaler',
  LOTION = 'lotion',
  MOUTHWASH = 'mouthwash',
  SHAMPOO = 'shampoo',
  SPRAY = 'spray',
  SYRINGE = 'syringe',
}

export enum DurationType {
  HOUR = 'hour',
  DAY = 'day',
  WEEK = 'week',
  MONTH = 'month',
  YEAR = 'year',
}

export enum VisitDetails {
  BEFORE_VISIT = 'before visit',
  AFTER_VISIT = 'after visit',
}

// ============================================
// BASE INTERFACES
// ============================================

export interface BaseTemplate {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

// ============================================
// ADVICE TEMPLATE
// ============================================

export interface AdviceTemplate extends BaseTemplate {
  description?: string;
}

export interface CreateAdviceTemplate {
  name: string;
  description?: string;
}

export interface UpdateAdviceTemplate extends Partial<CreateAdviceTemplate> {
  id: string;
}

// ============================================
// COMPLAINT TEMPLATE
// ============================================

export interface ComplaintTemplate extends BaseTemplate {
  description?: string;
}

export interface CreateComplaintTemplate {
  name: string;
  description?: string;
}

export interface UpdateComplaintTemplate extends Partial<CreateComplaintTemplate> {
  id: string;
}

// ============================================
// EXAMINATION TEMPLATE
// ============================================

export interface ExaminationTemplate extends BaseTemplate {
  description?: string;
}

export interface CreateExaminationTemplate {
  name: string;
  description?: string;
}

export interface UpdateExaminationTemplate extends Partial<CreateExaminationTemplate> {
  id: string;
}

// ============================================
// PROCEDURE TEMPLATE
// ============================================

export interface ProcedureInstruction {
  name: string;
  description?: string;
  visitDetails?: VisitDetails;
  duration?: DurationType;
}

export interface ProcedureTemplate extends BaseTemplate {
  note: string;
  unitCost: number;
  instructions: ProcedureInstruction[];
}

export interface CreateProcedureTemplate {
  name: string;
  note: string;
  unitCost: number;
  instructions: ProcedureInstruction[];
}

export interface UpdateProcedureTemplate extends Partial<CreateProcedureTemplate> {
  id: string;
}

// ============================================
// MEDICINE TEMPLATE
// ============================================

export interface MedicineTemplate extends BaseTemplate {
  type: MedicineType;
  strength?: string;
  unit?: string;
  company?: string;
  duration?: number;
  durationType?: DurationType;
  morning?: number;
  noon?: number;
  evening?: number;
  note?: string;
}

export interface CreateMedicineTemplate {
  name: string;
  type: MedicineType;
  strength?: string;
  unit?: string;
  company?: string;
  duration?: number;
  durationType?: DurationType;
  morning?: number;
  noon?: number;
  evening?: number;
  note?: string;
}

export interface UpdateMedicineTemplate extends Partial<CreateMedicineTemplate> {
  id: string;
}

// ============================================
// MEDICINE PACKAGE TEMPLATE
// ============================================

// Type alias for medicines in package (can be full object or just ID)
export type TemplateMedicine = MedicineTemplate;

export interface MedicinePackageTemplate extends BaseTemplate {
  description?: string;
  medicines: string[] | TemplateMedicine[]; // Array of medicine IDs or full medicine objects
}

export interface CreateMedicinePackageTemplate {
  name: string;
  description?: string;
  medicines: string[];
}

export interface UpdateMedicinePackageTemplate extends Partial<CreateMedicinePackageTemplate> {
  id: string;
}

// ============================================
// UNION TYPES
// ============================================

export type TemplateType =
  | 'advice'
  | 'complaint'
  | 'examination'
  | 'procedure'
  | 'medicine'
  | 'medicine-package';

export type AnyTemplate =
  | AdviceTemplate
  | ComplaintTemplate
  | ExaminationTemplate
  | ProcedureTemplate
  | MedicineTemplate
  | MedicinePackageTemplate;

export type CreateTemplateData =
  | CreateAdviceTemplate
  | CreateComplaintTemplate
  | CreateExaminationTemplate
  | CreateProcedureTemplate
  | CreateMedicineTemplate
  | CreateMedicinePackageTemplate;

export type UpdateTemplateData =
  | UpdateAdviceTemplate
  | UpdateComplaintTemplate
  | UpdateExaminationTemplate
  | UpdateProcedureTemplate
  | UpdateMedicineTemplate
  | UpdateMedicinePackageTemplate;
