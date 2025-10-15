/**
 * Modal and Operation Types
 * Centralized enums for modal modes and operation types
 * Replaces manual string checks with type-safe enums
 */

// ============================================
// MODAL MODES
// ============================================

export enum ModalMode {
  VIEW = 'view',
  CREATE = 'create',
  EDIT = 'edit',
}

// ============================================
// OPERATION TYPES
// ============================================

export enum OperationType {
  ADD = 'add',
  UPDATE = 'update',
  DELETE = 'delete',
  VIEW = 'view',
}

// ============================================
// TYPE GUARDS
// ============================================

export const isCreateMode = (mode: ModalMode): boolean => mode === ModalMode.CREATE;
export const isEditMode = (mode: ModalMode): boolean => mode === ModalMode.EDIT;
export const isViewMode = (mode: ModalMode): boolean => mode === ModalMode.VIEW;

export const isAddOperation = (operation: OperationType): boolean =>
  operation === OperationType.ADD;
export const isUpdateOperation = (operation: OperationType): boolean =>
  operation === OperationType.UPDATE;
export const isDeleteOperation = (operation: OperationType): boolean =>
  operation === OperationType.DELETE;
export const isViewOperation = (operation: OperationType): boolean =>
  operation === OperationType.VIEW;

// ============================================
// MODAL STATE INTERFACES
// ============================================

export interface BaseModalState {
  isOpen: boolean;
  mode: ModalMode;
}

export interface AppointmentModalState extends BaseModalState {
  appointment?: import('@/modules/appointment/types/appointment.types').Appointment;
  prefilledTimes?: { start: Date; end: Date } | null;
}

export interface PatientModalState extends BaseModalState {
  patient?: import('@/modules/patient/types/patient.types').Patient;
}

export interface TemplateModalState extends BaseModalState {
  template?: import('@/modules/templates/types/template.types').AnyTemplate;
}
