/**
 * Consultation Hooks
 * React Query hooks for consultation operations
 * Provides data fetching, mutations, and caching for consultations
 */

import { useQueryClient } from '@tanstack/react-query';
import { useApiGet, useApiPost } from '@/hooks/api';
import {
  Consultation,
  CreateConsultation,
  UpdateConsultation,
  ConsultationFilters,
} from '../types/consultation.types';
import { Patient } from '@/modules/patient/types/patient.types';

// ============================================
// QUERY KEYS
// ============================================

export const getConsultationQueryKey = (id: string) => ['consultations', id];
export const getConsultationsQueryKey = (filters?: ConsultationFilters) =>
  filters ? ['consultations', 'list', JSON.stringify(filters)] : ['consultations', 'list'];

export const getPatientQueryKey = (id: string) => ['patients', id];
export const getDoctorsQueryKey = () => ['doctors', 'list'];

// ============================================
// CONSULTATION HOOKS
// ============================================

/**
 * Hook to fetch all consultations with optional filters
 * @param filters - Optional filters (patientId, doctorId, date range)
 * @returns React Query result with consultations array
 */
export const useConsultations = (filters?: ConsultationFilters) => {
  // Compute endpoint BEFORE calling hooks (to avoid conditional hook calls)
  let endpoint: string;

  // If patientId is provided, use the /consultations/patient/:id endpoint
  if (filters?.patientId) {
    endpoint = `consultations/patient/${filters.patientId}`;
  } else {
    // Otherwise, use query parameters for other filters
    const queryParams = new URLSearchParams();

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (value instanceof Date) {
            queryParams.append(key, value.toISOString().split('T')[0]); // YYYY-MM-DD
          } else {
            queryParams.append(key, String(value));
          }
        }
      });
    }

    const queryString = queryParams.toString();
    endpoint = queryString ? `consultations?${queryString}` : 'consultations';
  }

  // Call hook unconditionally (required by Rules of Hooks)
  return useApiGet<Consultation[]>(getConsultationsQueryKey(filters), endpoint, {
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

/**
 * Hook to fetch a single consultation by ID
 * @param id - Consultation ID
 * @returns React Query result with consultation data
 */
export const useConsultation = (id: string) => {
  return useApiGet<Consultation>(getConsultationQueryKey(id), `consultations/${id}`, {
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

// ============================================
// MUTATION HOOKS
// ============================================

/**
 * Hook to create a new consultation
 * Supports nested creation of:
 * - Clinical examinations
 * - Procedures
 * - Prescriptions
 * - Billing
 * - Payments
 */
export const useCreateConsultation = () => {
  const queryClient = useQueryClient();

  return useApiPost<Consultation, CreateConsultation>('consultations', 'POST', {
    successMessage: 'Consultation created successfully!',
    onSuccess: () => {
      // Invalidate consultations list to refresh the data
      queryClient.invalidateQueries({ queryKey: ['consultations'] });
    },
  });
};

/**
 * Hook to update an existing consultation
 * Can update main consultation fields and nested entities
 */
export const useUpdateConsultation = () => {
  const queryClient = useQueryClient();

  return useApiPost<Consultation, { data: UpdateConsultation; id: string }>(
    'consultations',
    'PATCH',
    {
      successMessage: 'Consultation updated successfully!',
      onSuccess: (_, variables) => {
        // Invalidate specific consultation and consultations list
        queryClient.invalidateQueries({ queryKey: getConsultationQueryKey(variables.id) });
        queryClient.invalidateQueries({ queryKey: ['consultations'] });
      },
      constructUrl: (variables) => `consultations/${variables.id}`,
    }
  );
};

/**
 * Hook to delete a consultation
 * Will also delete all related entities (cascade)
 */
export const useDeleteConsultation = () => {
  const queryClient = useQueryClient();

  return useApiPost<void, string>('consultations', 'DELETE', {
    successMessage: 'Consultation deleted successfully!',
    onSuccess: () => {
      // Invalidate consultations list to refresh the data
      queryClient.invalidateQueries({ queryKey: ['consultations'] });
    },
    constructUrl: (id) => `consultations/${id}`,
  });
};

// ============================================
// RELATED ENTITY HOOKS
// ============================================

/**
 * Hook to fetch a patient by ID for pre-filling consultation form
 * @param id - Patient ID
 * @returns React Query result with patient data
 */
export const usePatient = (id: string) => {
  return useApiGet<Patient>(getPatientQueryKey(id), `patients/${id}`, {
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};
