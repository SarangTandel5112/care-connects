/**
 * Patient Schemas
 * Based on backend DTOs with Zod validation
 * Defines types and validation for patient operations
 */

import { z } from 'zod';

// ============================================
// ENUMS
// ============================================

export const GenderEnum = z.enum(['Male', 'Female', 'Other']);
export const PatientGroupEnum = z.enum(['Friends', 'Family', 'Others']);
export const MaritalStatusEnum = z.enum(['Single', 'Married']);

// ============================================
// PATIENT SCHEMAS
// ============================================

export const createPatientSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  mobile: z
    .string()
    .regex(/^[0-9]{10}$/, 'Mobile number must contain exactly 10 digits')
    .length(10, 'Mobile number must be 10 digits long'),
  location: z.string().optional(),
  patientGroup: PatientGroupEnum.optional(),
  birthDate: z.date().optional(),
  gender: GenderEnum.optional(),
  age: z.number().int().min(0).max(150).optional(),
  profilePic: z.string().url().optional(),
  maritalStatus: MaritalStatusEnum.optional(),
  numberOfChildren: z.number().int().min(0).optional(),
  country: z.string().optional(),
  state: z.string().optional(),
  city: z.string().optional(),
  region: z.string().optional(),
  zipCode: z.string().optional(),
  referredBy: z.string().optional(),
  consents: z.string().optional(),
  medicalConditions: z.array(z.string()).optional(),
});

export const updatePatientSchema = createPatientSchema.partial().extend({
  id: z.string().uuid(),
});

export const patientSchema = createPatientSchema.extend({
  id: z.string().uuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const patientSearchSchema = z.object({
  search: z.string().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  mobile: z.string().optional(),
  gender: GenderEnum.optional(),
  birthDate: z.date().optional(),
  maritalStatus: MaritalStatusEnum.optional(),
  patientGroup: PatientGroupEnum.optional(),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20),
});
