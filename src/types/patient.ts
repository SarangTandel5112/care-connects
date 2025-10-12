/**
 * Patient Types
 * Based on backend patient.entity.ts schema
 */

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

/**
 * Patient entity interface matching backend schema
 */
export interface Patient {
  id: string;
  // Required fields
  firstName: string;
  lastName: string;
  mobile: string;
  // Optional fields
  location?: string;
  patientGroup?: PatientGroup;
  birthDate?: string;
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
  // Timestamps
  createdAt: string;
  updatedAt: string;
}

/**
 * Create patient data (required fields only)
 */
export interface CreatePatientData {
  firstName: string;
  lastName: string;
  mobile: string;
  // Optional fields
  location?: string;
  patientGroup?: PatientGroup;
  birthDate?: string;
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

/**
 * Update patient data (all fields optional except id)
 */
export interface UpdatePatientData extends Partial<CreatePatientData> {
  id: string;
}

/**
 * Patient search and filter parameters
 */
export interface PatientSearchParams {
  search?: string;
  gender?: Gender;
  patientGroup?: PatientGroup;
  maritalStatus?: MaritalStatus;
  page?: number;
  limit?: number;
  sortBy?: 'firstName' | 'lastName' | 'createdAt' | 'updatedAt';
  sortOrder?: 'asc' | 'desc';
}

/**
 * Patient list response with pagination
 */
export interface PatientListResponse {
  patients: Patient[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/**
 * Patient table display data
 * Subset of patient fields for table view
 */
export interface PatientTableRow {
  id: string;
  firstName: string;
  lastName: string;
  mobile: string;
  gender?: Gender;
  age?: number;
  location?: string;
  createdAt: string;
}
