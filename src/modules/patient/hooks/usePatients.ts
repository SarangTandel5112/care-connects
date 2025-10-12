/**
 * Patient Hooks
 * React Query hooks for patient operations
 * Provides data fetching, mutations, and caching for patients
 */

import { useQueryClient } from '@tanstack/react-query';
import { useApiGet, useApiPost } from '@/hooks/api';
import {
  Patient,
  CreatePatient,
  UpdatePatient,
  PatientSearchFilters,
} from '../types/patient.types';

// ============================================
// QUERY KEYS
// ============================================

export const getPatientQueryKey = (id: string) => ['patients', id];
export const getPatientsQueryKey = (filters?: PatientSearchFilters) =>
  filters ? ['patients', 'list', JSON.stringify(filters)] : ['patients', 'list'];

// ============================================
// GET HOOKS
// ============================================

export const usePatients = (filters?: PatientSearchFilters) => {
  const queryParams = new URLSearchParams();

  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        if (value instanceof Date) {
          queryParams.append(key, value.toISOString().split('T')[0]);
        } else {
          queryParams.append(key, String(value));
        }
      }
    });
  }

  const queryString = queryParams.toString();
  const endpoint = queryString ? `patients?${queryString}` : 'patients';

  return useApiGet<Patient[]>(getPatientsQueryKey(filters), endpoint, {
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const usePatient = (id: string) => {
  return useApiGet<Patient>(getPatientQueryKey(id), `patients/${id}`, {
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

// ============================================
// MUTATION HOOKS
// ============================================

export const useCreatePatient = () => {
  const queryClient = useQueryClient();

  return useApiPost<Patient, CreatePatient>('patients', 'POST', {
    successMessage: 'Patient created successfully!',
    onSuccess: () => {
      // Invalidate patients list to refresh the data
      queryClient.invalidateQueries({ queryKey: ['patients'] });
    },
  });
};

export const useUpdatePatient = () => {
  const queryClient = useQueryClient();

  return useApiPost<Patient, { data: UpdatePatient; id: string }>('patients', 'PATCH', {
    successMessage: 'Patient updated successfully!',
    onSuccess: (_, variables) => {
      // Invalidate specific patient and patients list
      queryClient.invalidateQueries({ queryKey: getPatientQueryKey(variables.id) });
      queryClient.invalidateQueries({ queryKey: ['patients'] });
    },
    constructUrl: (variables) => `patients/${variables.id}`,
  });
};

export const useDeletePatient = () => {
  const queryClient = useQueryClient();

  return useApiPost<void, string>('patients', 'DELETE', {
    successMessage: 'Patient deleted successfully!',
    onSuccess: () => {
      // Invalidate patients list to refresh the data
      queryClient.invalidateQueries({ queryKey: ['patients'] });
    },
    constructUrl: (id) => `patients/${id}`,
  });
};
