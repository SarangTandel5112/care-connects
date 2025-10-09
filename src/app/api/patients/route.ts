// src/app/api/patients/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { CreatePatientData, PatientSearchParams } from '@/types';

// Validation schemas
const addressSchema = z.object({
  street: z.string().min(1, 'Street is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  zipCode: z.string().min(1, 'ZIP code is required'),
  country: z.string().min(1, 'Country is required'),
});

const emergencyContactSchema = z.object({
  name: z.string().min(1, 'Emergency contact name is required'),
  relationship: z.string().min(1, 'Relationship is required'),
  phone: z.string().min(1, 'Emergency contact phone is required'),
});

const insuranceInfoSchema = z.object({
  provider: z.string().min(1, 'Insurance provider is required'),
  policyNumber: z.string().min(1, 'Policy number is required'),
  groupNumber: z.string().min(1, 'Group number is required'),
});

const createPatientSchema = z.object({
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
  medicalHistory: z.array(z.string()).optional().default([]),
  allergies: z.array(z.string()).optional().default([]),
  medications: z.array(z.string()).optional().default([]),
  insuranceInfo: insuranceInfoSchema,
});

// Mock data - Replace with your database
let patients: any[] = [
  {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1-555-0123',
    dateOfBirth: '1990-01-15',
    gender: 'male',
    address: {
      street: '123 Main St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA',
    },
    emergencyContact: {
      name: 'Jane Doe',
      relationship: 'Spouse',
      phone: '+1-555-0124',
    },
    medicalHistory: ['Hypertension', 'Diabetes Type 2'],
    allergies: ['Penicillin', 'Shellfish'],
    medications: ['Metformin', 'Lisinopril'],
    insuranceInfo: {
      provider: 'Blue Cross Blue Shield',
      policyNumber: 'BC123456789',
      groupNumber: 'GRP001',
    },
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// GET /api/patients - Get all patients with filtering and pagination
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Parse query parameters
    const params: PatientSearchParams = {
      search: searchParams.get('search') || undefined,
      status: (searchParams.get('status') as any) || undefined,
      gender: (searchParams.get('gender') as any) || undefined,
      page: parseInt(searchParams.get('page') || '1'),
      limit: parseInt(searchParams.get('limit') || '10'),
      sortBy: (searchParams.get('sortBy') as any) || 'createdAt',
      sortOrder: (searchParams.get('sortOrder') as any) || 'desc',
    };

    // Filter patients
    let filteredPatients = [...patients];

    // Search filter
    if (params.search) {
      const searchLower = params.search.toLowerCase();
      filteredPatients = filteredPatients.filter(
        (patient) =>
          patient.firstName.toLowerCase().includes(searchLower) ||
          patient.lastName.toLowerCase().includes(searchLower) ||
          patient.email.toLowerCase().includes(searchLower) ||
          patient.phone.includes(searchLower)
      );
    }

    // Status filter
    if (params.status) {
      filteredPatients = filteredPatients.filter((patient) => patient.status === params.status);
    }

    // Gender filter
    if (params.gender) {
      filteredPatients = filteredPatients.filter((patient) => patient.gender === params.gender);
    }

    // Sort patients
    filteredPatients.sort((a, b) => {
      const aValue = a[params.sortBy!];
      const bValue = b[params.sortBy!];

      if (params.sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    // Pagination
    const total = filteredPatients.length;
    const totalPages = Math.ceil(total / params.limit!);
    const startIndex = (params.page! - 1) * params.limit!;
    const endIndex = startIndex + params.limit!;
    const paginatedPatients = filteredPatients.slice(startIndex, endIndex);

    return NextResponse.json({
      success: true,
      data: {
        patients: paginatedPatients,
        pagination: {
          page: params.page!,
          limit: params.limit!,
          total,
          totalPages,
        },
      },
    });
  } catch (error) {
    console.error('Get patients error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch patients' },
      { status: 500 }
    );
  }
}

// POST /api/patients - Create a new patient
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const patientData = createPatientSchema.parse(body);

    // Check if patient with email already exists
    const existingPatient = patients.find((p) => p.email === patientData.email);
    if (existingPatient) {
      return NextResponse.json(
        { success: false, message: 'Patient with this email already exists' },
        { status: 400 }
      );
    }

    // Create new patient
    const newPatient = {
      id: Date.now().toString(),
      ...patientData,
      status: 'active' as const,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    patients.push(newPatient);

    return NextResponse.json(
      {
        success: true,
        data: newPatient,
        message: 'Patient created successfully',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create patient error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          message: 'Validation error',
          errors: error.errors,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, message: 'Failed to create patient' },
      { status: 500 }
    );
  }
}
