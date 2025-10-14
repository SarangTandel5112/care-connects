/**
 * Appointment Hooks
 * React Query hooks for appointment operations
 * Provides data fetching, mutations, and caching for appointments
 */

import { useQueryClient, useQuery } from '@tanstack/react-query';
import { useApiGet, useApiPost } from '@/hooks/api';
import { Axios } from '@/setup';
import { ApiResponse } from '@/types';
import {
  Appointment,
  CreateAppointment,
  UpdateAppointment,
  AppointmentSearchFilters,
  Patient,
  Doctor,
  DoctorApiResponse,
  AppointmentApiResponse,
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

  return useQuery({
    queryKey: getAppointmentsQueryKey(filters),
    queryFn: async (): Promise<Appointment[]> => {
      const response = await Axios.get<ApiResponse<AppointmentApiResponse[]>>(endpoint);
      const appointments = response.data.data;

      // Transform API response to match Appointment interface
      return appointments.map((appointment) => {
        // Split doctor's fullName into firstName and lastName
        const nameParts = appointment.doctor.fullName.trim().split(' ');
        const firstName = nameParts[0] || '';
        const lastName = nameParts.slice(1).join(' ') || '';

        return {
          ...appointment,
          // Ensure dates are Date objects
          appointmentStartTime: new Date(appointment.appointmentStartTime),
          appointmentEndTime: new Date(appointment.appointmentEndTime),
          createdAt: new Date(appointment.createdAt),
          updatedAt: new Date(appointment.updatedAt),
          // Transform doctor from API format to frontend format
          doctor: {
            id: appointment.doctor.id,
            firstName,
            lastName,
            email: appointment.doctor.email,
            specialization: undefined,
          },
        };
      });
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useAppointment = (id: string) => {
  return useQuery({
    queryKey: getAppointmentQueryKey(id),
    queryFn: async (): Promise<Appointment> => {
      const response = await Axios.get<ApiResponse<AppointmentApiResponse>>(`appointments/${id}`);
      const appointment = response.data.data;

      // Split doctor's fullName into firstName and lastName
      const nameParts = appointment.doctor.fullName.trim().split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      return {
        ...appointment,
        // Ensure dates are Date objects
        appointmentStartTime: new Date(appointment.appointmentStartTime),
        appointmentEndTime: new Date(appointment.appointmentEndTime),
        createdAt: new Date(appointment.createdAt),
        updatedAt: new Date(appointment.updatedAt),
        // Transform doctor from API format to frontend format
        doctor: {
          id: appointment.doctor.id,
          firstName,
          lastName,
          email: appointment.doctor.email,
          specialization: undefined,
        },
      };
    },
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
 * Transforms API response (fullName) to Doctor interface (firstName, lastName)
 * @returns React Query result with doctors data
 */
export const useDoctors = () => {
  return useQuery({
    queryKey: getDoctorsQueryKey(),
    queryFn: async (): Promise<Doctor[]> => {
      const response = await Axios.get<ApiResponse<DoctorApiResponse[]>>('clinic/doctors');
      const doctors = response.data.data;

      // Transform API response to match Doctor interface
      return doctors.map((doctor) => {
        // Split fullName into firstName and lastName
        const nameParts = doctor.fullName.trim().split(' ');
        const firstName = nameParts[0] || '';
        const lastName = nameParts.slice(1).join(' ') || '';

        return {
          id: doctor.id,
          firstName,
          lastName,
          email: doctor.email,
          specialization: undefined,
        };
      });
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
};
