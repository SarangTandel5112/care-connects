import { useApiGet, useApiPost, useApiGetPaginated } from '@/hooks/api';
import { QUERY_KEYS } from '@/constants/queryKeys';
import {
  Patient,
  CreatePatientData,
  UpdatePatientData,
  PatientSearchParams,
  PatientListResponse,
} from '@/types';

// ============================================================================
// PATIENT API HOOKS - Core patient API calls using simplified API hooks
// ============================================================================

// Hook for getting all patients with pagination and filtering
export const usePatients = (params?: PatientSearchParams) => {
  // Filter out undefined values for additionalParams
  const additionalParams: Record<string, string | number> = {};
  if (params?.search) additionalParams.search = params.search;
  if (params?.status) additionalParams.status = params.status;
  if (params?.gender) additionalParams.gender = params.gender;
  if (params?.sortBy) additionalParams.sortBy = params.sortBy;
  if (params?.sortOrder) additionalParams.sortOrder = params.sortOrder;

  return useApiGetPaginated<PatientListResponse>(
    [QUERY_KEYS.PATIENT.GET_ALL_PATIENTS],
    'patients',
    {
      page: params?.page || 1,
      limit: params?.limit || 10,
      additionalParams,
      requireAuth: true,
      staleTime: 2 * 60 * 1000, // 2 minutes for patient lists (frequently changing)
    }
  );
};

// Hook for getting a specific patient by ID
export const usePatient = (id: string) => {
  return useApiGet<Patient>([QUERY_KEYS.PATIENT.GET_PATIENT_BY_ID, id], `patients/${id}`, {
    enabled: !!id,
    requireAuth: true,
    staleTime: 10 * 60 * 1000, // 10 minutes for individual patient data (less frequently changing)
  });
};

// Hook for creating a new patient
export const useCreatePatient = () => {
  return useApiPost<Patient, CreatePatientData>('patients', 'POST', {
    successMessage: 'Patient created successfully!',
    errorMessage: 'Failed to create patient',
    invalidateQueries: [[QUERY_KEYS.PATIENT.GET_ALL_PATIENTS], [QUERY_KEYS.PATIENT.SEARCH]],
    requireAuth: true,
  });
};

// Hook for updating a patient
export const useUpdatePatient = () => {
  return useApiPost<Patient, UpdatePatientData>('patients', 'PUT', {
    successMessage: 'Patient updated successfully!',
    errorMessage: 'Failed to update patient',
    invalidateQueries: [[QUERY_KEYS.PATIENT.GET_ALL_PATIENTS], [QUERY_KEYS.PATIENT.SEARCH]],
    requireAuth: true,
  });
};

// Hook for deleting a patient
export const useDeletePatient = () => {
  return useApiPost<void, { id: string }>('patients', 'DELETE', {
    successMessage: 'Patient deleted successfully!',
    errorMessage: 'Failed to delete patient',
    invalidateQueries: [[QUERY_KEYS.PATIENT.GET_ALL_PATIENTS], [QUERY_KEYS.PATIENT.SEARCH]],
    requireAuth: true,
  });
};

// ============================================================================
// PATIENT UTILITY HOOKS - Search and filtering
// ============================================================================

// Hook for searching patients with debouncing
export const useSearchPatients = (searchTerm: string) => {
  return useApiGet<Patient[]>([QUERY_KEYS.PATIENT.SEARCH, searchTerm], 'patients', {
    params: { search: searchTerm, limit: 20 },
    enabled: searchTerm.length >= 2,
    requireAuth: true,
  });
};

// Hook for getting patients by status
export const usePatientsByStatus = (status: 'active' | 'inactive' | 'archived') => {
  return useApiGet<PatientListResponse>([QUERY_KEYS.PATIENT.GET_ALL_PATIENTS, status], 'patients', {
    params: { status, limit: 100 },
    requireAuth: true,
  });
};

// Hook for patient statistics
export const usePatientStats = () => {
  const activeQuery = usePatientsByStatus('active');
  const inactiveQuery = usePatientsByStatus('inactive');
  const archivedQuery = usePatientsByStatus('archived');

  return {
    activePatients: (activeQuery.data as PatientListResponse)?.patients?.length || 0,
    inactivePatients: (inactiveQuery.data as PatientListResponse)?.patients?.length || 0,
    archivedPatients: (archivedQuery.data as PatientListResponse)?.patients?.length || 0,
    totalPatients: 0, // Will be calculated from all statuses
    isLoading: activeQuery.isLoading || inactiveQuery.isLoading || archivedQuery.isLoading,
    isError: activeQuery.isError || inactiveQuery.isError || archivedQuery.isError,
  };
};
