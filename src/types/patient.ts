// Patient types
export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  medicalHistory: string[];
  allergies: string[];
  medications: string[];
  insuranceInfo: {
    provider: string;
    policyNumber: string;
    groupNumber: string;
  };
  status: 'active' | 'inactive' | 'archived';
  createdAt: string;
  updatedAt: string;
}

export interface CreatePatientData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  medicalHistory?: string[];
  allergies?: string[];
  medications?: string[];
  insuranceInfo: {
    provider: string;
    policyNumber: string;
    groupNumber: string;
  };
}

export interface UpdatePatientData extends Partial<CreatePatientData> {
  id: string;
}

export interface PatientSearchParams {
  search?: string;
  status?: 'active' | 'inactive' | 'archived';
  gender?: 'male' | 'female' | 'other';
  page?: number;
  limit?: number;
  sortBy?: 'firstName' | 'lastName' | 'createdAt' | 'updatedAt';
  sortOrder?: 'asc' | 'desc';
}

export interface PatientListResponse {
  patients: Patient[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
