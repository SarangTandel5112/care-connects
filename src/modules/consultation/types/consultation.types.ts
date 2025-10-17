/**
 * Consultation Module Types
 * Based on backend entities and DTOs
 */

import { Patient } from '@/modules/patient/types/patient.types';

// ==================== ENUMS ====================

/**
 * Medicine types enum - matches backend
 */
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

/**
 * Duration type enum - matches backend
 */
export enum DurationType {
  HOUR = 'hour',
  DAY = 'day',
  WEEK = 'week',
  MONTH = 'month',
  YEAR = 'year',
}

/**
 * Dental condition types - matches backend
 */
export enum ConditionType {
  CARIES = 'caries',
  FRACTURE = 'fracture',
  IMPACTED = 'impacted',
  MISSING = 'missing',
  MOBILITY = 'mobility',
  PERIAPICALABSCESS = 'periapicalabscess',
  ROOTSTUMP = 'rootstump',
  SUPRAERUPTED = 'supraerupted',
}

// ==================== CLINICAL EXAMINATION ====================

/**
 * Clinical Examination (Tooth Examination)
 */
export interface ClinicalExamination {
  id?: string;
  consultationId?: string;
  toothNumber: number; // Required
  conditionType: ConditionType; // Required
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Create Clinical Examination DTO
 */
export interface CreateClinicalExamination {
  toothNumber: number;
  conditionType: ConditionType;
  description?: string;
}

// ==================== PROCEDURE ====================

/**
 * Dental Procedure with Cost Calculation
 */
export interface Procedure {
  id?: string;
  consultationId?: string;
  name: string; // Required
  quantity: number; // Required, min 1
  teethNumbers?: number[]; // Optional array of tooth numbers
  note?: string;
  unitCost: number; // Required
  discount: number; // Required, min 0
  subtotal?: number; // Computed: (unitCost * quantity) - discount
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Create Procedure DTO
 */
export interface CreateProcedure {
  name: string;
  quantity: number;
  teethNumbers?: number[];
  note?: string;
  unitCost: number;
  discount: number;
}

// ==================== PRESCRIPTION ====================

/**
 * Medicine Prescription
 */
export interface Prescription {
  id?: string;
  consultationId?: string;
  patientId?: string;
  name: string; // Required - medicine name
  type: MedicineType; // Required
  strength?: string; // e.g., "500mg"
  unit?: string; // e.g., "mg"
  company?: string;
  duration?: number;
  durationType?: DurationType;
  morning: number; // Required - dosage amount
  noon: number; // Required - dosage amount
  evening: number; // Required - dosage amount
  note?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Create Prescription DTO
 */
export interface CreatePrescription {
  name: string;
  type: MedicineType;
  strength?: string;
  unit?: string;
  company?: string;
  duration?: number;
  durationType?: DurationType;
  morning: number;
  noon: number;
  evening: number;
  note?: string;
}

// ==================== BILLING ====================

/**
 * Payment Status Enum - matches backend
 */
export enum PaymentStatus {
  PENDING = 'Pending',
  PAID = 'Paid',
  PARTIALLY_PAID = 'Partially Paid',
  FAILED = 'Failed',
  REFUNDED = 'Refunded',
  CANCELLED = 'Cancelled',
}

/**
 * Billing Information
 */
export interface Billing {
  id?: string;
  consultationId?: string;
  consultationDate?: Date; // Date of consultation
  procedureAmount?: number; // Auto-calculated from procedures
  consultationFee?: number;
  otherAmount?: number;
  subTotal?: number; // Auto-calculated
  discount?: number;
  applyGst?: boolean;
  tax?: number; // Auto-calculated (5% if applyGst is true)
  totalAmount?: number; // Auto-calculated
  pendingAmount?: number; // Auto-calculated: totalAmount - sum of payments
  paymentStatus?: PaymentStatus; // Current payment status
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Create Billing DTO
 */
export interface CreateBilling {
  consultationDate?: Date;
  consultationFee?: number;
  otherAmount?: number;
  discount?: number;
  applyGst?: boolean;
  // Calculated fields required by backend validation
  procedureAmount?: number;
  subTotal?: number;
  tax?: number;
  totalAmount?: number;
}

// ==================== PAYMENT ====================

/**
 * Payment Method Enum
 */
export enum PaymentMethod {
  CASH = 'Cash',
  CARD = 'Card',
  UPI = 'UPI',
  NET_BANKING = 'Net Banking',
  CHEQUE = 'Cheque',
  OTHER = 'Other',
}

/**
 * Payment Information
 */
export interface Payment {
  id?: string;
  billingId?: string;
  amountPaid: number; // Matches backend 'amountPaid' field
  modeOfPayment: string; // Matches backend 'modeOfPayment' field
  paymentReference?: string; // Optional reference number
  paymentDate?: Date;
  paymentStatus?: PaymentStatus;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Create Payment DTO
 */
export interface CreatePayment {
  amountPaid: number;
  modeOfPayment: string;
  paymentReference?: string;
  paymentStatus?: PaymentStatus;
}

// ==================== MAIN CONSULTATION ====================

/**
 * Doctor Type (subset of User entity)
 */
export interface Doctor {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

/**
 * Appointment Type (simplified)
 */
export interface ConsultationAppointment {
  id: string;
  patientId: string;
  doctorId: string;
  appointmentStartTime: Date;
  appointmentEndTime: Date;
  status: string;
}

/**
 * Main Consultation Entity
 */
export interface Consultation {
  id: string;

  // Relations
  patientId?: string;
  patient?: Patient;
  doctorId?: string;
  doctor?: Doctor;
  clinicId?: string;
  appointmentId?: string;
  appointment?: ConsultationAppointment;

  // Text Fields (all optional)
  complaints?: string;
  advice?: string;
  examination?: string;
  prescriptionNotes?: string;
  consultationFiles?: string[];
  scheduleNextAppointment?: string;

  // Nested Collections
  clinicalExaminations?: ClinicalExamination[];
  procedures?: Procedure[];
  prescriptions?: Prescription[];
  billing?: Billing;
  payments?: Payment[];

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Create Consultation DTO
 * All fields are optional for flexibility
 */
export interface CreateConsultation {
  appointmentId?: string;
  doctorId?: string;
  patientId?: string;
  complaints?: string;
  advice?: string;
  examination?: string;
  prescriptionNotes?: string;
  consultationFiles?: string[];
  scheduleNextAppointment?: string;
  clinicalExaminations?: CreateClinicalExamination[];
  procedures?: CreateProcedure[];
  prescriptions?: CreatePrescription[];
  billing?: CreateBilling;
  payments?: CreatePayment[];
}

/**
 * Update Consultation DTO
 * Extends CreateConsultation with id
 */
export interface UpdateConsultation extends CreateConsultation {
  id: string;
}

// ==================== UI/FORM HELPERS ====================

/**
 * Consultation Form Values
 * Used for Formik form state
 */
export interface ConsultationFormValues {
  // Patient & Appointment
  patientId: string;
  appointmentId?: string;

  // Text Fields
  complaints: string;
  advice: string;
  examination: string;
  prescriptionNotes: string;
  consultationFiles: string[];
  scheduleNextAppointment?: string;

  // Nested Arrays
  clinicalExaminations: CreateClinicalExamination[];
  procedures: CreateProcedure[];
  prescriptions: CreatePrescription[];

  // Billing & Payment
  billing: CreateBilling;
  payments: CreatePayment[];
}

/**
 * Consultation Tab Types
 */
export enum ConsultationTab {
  CLINICAL_EXAMINATION = 'clinical-examination',
  PROCEDURES = 'procedures',
  PRESCRIPTIONS = 'prescriptions',
  BILLING = 'billing',
}

/**
 * Consultation Filter Options
 */
export interface ConsultationFilters {
  patientId?: string;
  doctorId?: string;
  startDate?: Date;
  endDate?: Date;
}
