/**
 * Patient Types
 * Based on backend DTOs and entities
 * Defines TypeScript interfaces for patient operations
 */

// ============================================
// ENUMS
// ============================================

export enum Gender {
  MALE = 'Male',
  FEMALE = 'Female',
  OTHER = 'Other',
}

export enum PatientGroup {
  FRIENDS = 'Friends',
  FAMILY = 'Family',
  OTHERS = 'Others',
}

export enum MaritalStatus {
  SINGLE = 'Single',
  MARRIED = 'Married',
}

// ============================================
// BASE INTERFACES
// ============================================

export interface BasePatient {
  id: string;
  firstName: string;
  lastName: string;
  mobile: string;
  location?: string;
  patientGroup?: PatientGroup;
  birthDate?: Date;
  gender?: Gender;
  age?: number;
  profilePic?: string;
  maritalStatus?: MaritalStatus;
  numberOfChildren?: number;
  country?: string;
  state?: string;
  city?: string;
  region?: string;
  zipCode?: string;
  referredBy?: string;
  consents?: string;
  medicalConditions?: string[];
  createdAt: Date;
  updatedAt: Date;
}

// ============================================
// PATIENT INTERFACES
// ============================================

export interface Patient extends BasePatient {
  clinic?: {
    id: string;
    name: string;
  };
  consultations?: Array<{
    id: string;
    date: Date;
    status: string;
  }>;
}

export interface CreatePatient {
  firstName: string;
  lastName: string;
  mobile: string;
  location?: string;
  patientGroup?: PatientGroup;
  birthDate?: Date;
  gender?: Gender;
  age?: number;
  profilePic?: string;
  maritalStatus?: MaritalStatus;
  numberOfChildren?: number;
  country?: string;
  state?: string;
  city?: string;
  region?: string;
  zipCode?: string;
  referredBy?: string;
  consents?: string;
  medicalConditions?: string[];
}

export interface UpdatePatient extends Partial<CreatePatient> {
  id: string;
}

export interface PatientSearchFilters {
  search?: string;
  firstName?: string;
  lastName?: string;
  mobile?: string;
  gender?: Gender;
  birthDate?: Date;
  maritalStatus?: MaritalStatus;
  patientGroup?: PatientGroup;
  page?: number;
  limit?: number;
}

// ============================================
// TYPE EXPORTS FOR UI ENUMS (uppercased for consistency)
// ============================================

export type GenderType = keyof typeof Gender;
export type PatientGroupType = keyof typeof PatientGroup;
export type MaritalStatusType = keyof typeof MaritalStatus;
