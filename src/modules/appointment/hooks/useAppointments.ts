/**
 * Appointment Hooks
 * React Query hooks for appointment operations
 * Provides data fetching, mutations, and caching for appointments
 */

import { useQueryClient } from '@tanstack/react-query';
import { useApiGet, useApiPost } from '@/hooks/api';
import {
  Appointment,
  CreateAppointment,
  UpdateAppointment,
  AppointmentSearchFilters,
  Patient,
  Doctor,
} from '../types/appointment.types';

// ============================================
// QUERY KEYS
// ============================================

export const getAppointmentQueryKey = (id: string) => ['appointments', id];
export const getAppointmentsQueryKey = (filters?: AppointmentSearchFilters) =>
  filters ? ['appointments', 'list', JSON.stringify(filters)] : ['appointments', 'list'];

export const getPatientQueryKey = (search: string) => ['patients', 'search', search];
export const getDoctorsQueryKey = () => ['doctors', 'list'];

// ============================================
// APPOINTMENT HOOKS
// ============================================

export const useAppointments = (filters?: AppointmentSearchFilters) => {
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
  const endpoint = queryString ? `appointments?${queryString}` : 'appointments';

  return useApiGet<Appointment[]>(getAppointmentsQueryKey(filters), endpoint, {
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useAppointment = (id: string) => {
  return useApiGet<Appointment>(getAppointmentQueryKey(id), `appointments/${id}`, {
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useCreateAppointment = () => {
  const queryClient = useQueryClient();
  return useApiPost<Appointment, CreateAppointment>('appointments', 'POST', {
    successMessage: 'Appointment created successfully!',
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getAppointmentsQueryKey() });
    },
  });
};

export const useUpdateAppointment = () => {
  const queryClient = useQueryClient();
  return useApiPost<Appointment, { data: UpdateAppointment; id: string }>('appointments', 'PATCH', {
    successMessage: 'Appointment updated successfully!',
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getAppointmentsQueryKey() });
      queryClient.invalidateQueries({ queryKey: ['appointments'] }); // Invalidate all appointments
    },
    constructUrl: (variables) => `appointments/${variables.id}`,
  });
};

export const useDeleteAppointment = () => {
  const queryClient = useQueryClient();
  return useApiPost<void, string>('appointments', 'DELETE', {
    successMessage: 'Appointment deleted successfully!',
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getAppointmentsQueryKey() });
    },
    constructUrl: (id: string) => `appointments/${id}`,
  });
};

// ============================================
// RELATED ENTITY HOOKS
// ============================================

/**
 * Hook to fetch patients based on search term
 * @param search - Search term for patient name or mobile
 * @returns React Query result with patients data
 */
export const usePatients = (search: string) => {
  const queryParams = new URLSearchParams();
  queryParams.append('search', search);
  queryParams.append('page', '1');
  queryParams.append('limit', '20');

  const endpoint = `patients?${queryParams.toString()}`;

  return useApiGet<Patient[]>(
    getPatientQueryKey(search),
    endpoint,
    {
      enabled: search.length > 2,
      staleTime: 2 * 60 * 1000, // 2 minutes
      gcTime: 5 * 60 * 1000, // 5 minutes
    }
  );
};

/**
 * Hook to fetch all doctors
 * @returns React Query result with doctors data
 */
export const useDoctors = () => {
  return useApiGet<Doctor[]>(
    getDoctorsQueryKey(),
    'clinic/doctors',
    {
      staleTime: 10 * 60 * 1000, // 10 minutes
      gcTime: 30 * 60 * 1000, // 30 minutes
    }
  );
};
