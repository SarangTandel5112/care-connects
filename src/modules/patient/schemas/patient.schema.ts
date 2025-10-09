import { z } from 'zod';

// Address schema
export const addressSchema = z.object({
  street: z.string().min(1, 'Street is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  zipCode: z.string().min(1, 'ZIP code is required'),
  country: z.string().min(1, 'Country is required'),
});

// Emergency contact schema
export const emergencyContactSchema = z.object({
  name: z.string().min(1, 'Emergency contact name is required'),
  relationship: z.string().min(1, 'Relationship is required'),
  phone: z.string().min(1, 'Emergency contact phone is required'),
});

// Insurance info schema
export const insuranceInfoSchema = z.object({
  provider: z.string().min(1, 'Insurance provider is required'),
  policyNumber: z.string().min(1, 'Policy number is required'),
  groupNumber: z.string().min(1, 'Group number is required'),
});

// Create patient schema
export const createPatientSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(1, 'Phone number is required'),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  gender: z.enum(['male', 'female', 'other'], {
    errorMap: () => ({ message: 'Gender must be male, female, or other' }),
  }),
  address: addressSchema,
  emergencyContact: emergencyContactSchema,
  medicalHistory: z.array(z.string()).default([]),
  allergies: z.array(z.string()).default([]),
  medications: z.array(z.string()).default([]),
  insuranceInfo: insuranceInfoSchema,
});

// Update patient schema (all fields optional except id)
export const updatePatientSchema = z.object({
  id: z.string().min(1, 'Patient ID is required'),
  firstName: z.string().min(1, 'First name is required').optional(),
  lastName: z.string().min(1, 'Last name is required').optional(),
  email: z.string().email('Invalid email address').optional(),
  phone: z.string().min(1, 'Phone number is required').optional(),
  dateOfBirth: z.string().min(1, 'Date of birth is required').optional(),
  gender: z.enum(['male', 'female', 'other']).optional(),
  address: addressSchema.partial().optional(),
  emergencyContact: emergencyContactSchema.partial().optional(),
  medicalHistory: z.array(z.string()).optional(),
  allergies: z.array(z.string()).optional(),
  medications: z.array(z.string()).optional(),
  insuranceInfo: insuranceInfoSchema.partial().optional(),
  status: z.enum(['active', 'inactive', 'archived']).optional(),
});

// Search patient schema
export const searchPatientSchema = z.object({
  search: z.string().min(2, 'Search term must be at least 2 characters'),
  status: z.enum(['active', 'inactive', 'archived']).optional(),
  gender: z.enum(['male', 'female', 'other']).optional(),
});

// Export types
export type CreatePatientFormData = z.infer<typeof createPatientSchema>;
export type UpdatePatientFormData = z.infer<typeof updatePatientSchema>;
export type SearchPatientFormData = z.infer<typeof searchPatientSchema>;
export type AddressFormData = z.infer<typeof addressSchema>;
export type EmergencyContactFormData = z.infer<typeof emergencyContactSchema>;
export type InsuranceInfoFormData = z.infer<typeof insuranceInfoSchema>;
