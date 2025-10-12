/**
 * Appointment Types
 * Based on backend DTOs and entities
 * Defines TypeScript interfaces for appointment operations
 */

// ============================================
// ENUMS
// ============================================

export enum AppointmentStatus {
  SCHEDULED = 'Scheduled',
  CHECK_IN = 'Check In',
  CONSULTATION = 'Consultation',
  COMPLETED = 'Completed',
  CANCELLED = 'Cancelled',
}

// ============================================
// RELATED ENTITIES
// ============================================

export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  mobile: string;
  email?: string;
}

export interface Doctor {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  specialization?: string;
}

// ============================================
// BASE INTERFACES
// ============================================

export interface BaseAppointment {
  status: AppointmentStatus;
  appointmentStartTime: Date;
  appointmentEndTime: Date;
  treatment?: string;
  patientId: string;
  doctorId: string;
}

export interface Appointment extends BaseAppointment {
  id: string;
  patient: Patient;
  doctor: Doctor;
  consultation?: {
    id: string;
    // Add consultation fields as needed
  };
  createdAt: Date;
  updatedAt: Date;
}

export type CreateAppointment = BaseAppointment;

export interface UpdateAppointment extends Partial<CreateAppointment> {
  id: string;
}

export interface AppointmentSearchFilters {
  status?: AppointmentStatus;
  appointmentTime?: Date;
  appointmentStartTime?: Date;
  appointmentEndTime?: Date;
  patientId?: string;
  doctorId?: string;
  clinicId?: string;
  reason?: string;
}
