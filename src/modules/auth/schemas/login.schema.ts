import { z } from 'zod';
import * as Yup from 'yup';

/**
 * Login Validation Schemas
 * Provides both Zod and Yup schemas for flexibility
 */

// Zod schema (for server-side or React Hook Form)
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

// Yup schema (for Formik forms)
export const loginValidationSchema = Yup.object({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

export type LoginFormData = z.infer<typeof loginSchema>;
