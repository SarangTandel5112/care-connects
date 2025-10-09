// src/app/api/patients/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { UpdatePatientData } from '@/types';

// Import mock data (in real app, this would be your database)
// This is a simplified approach - in production, you'd use a proper database
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

// Validation schema for updates (all fields optional except id)
const updatePatientSchema = z.object({
  id: z.string().min(1, 'Patient ID is required'),
  firstName: z.string().min(1, 'First name is required').optional(),
  lastName: z.string().min(1, 'Last name is required').optional(),
  email: z.string().email('Invalid email address').optional(),
  phone: z.string().min(1, 'Phone number is required').optional(),
  dateOfBirth: z.string().min(1, 'Date of birth is required').optional(),
  gender: z.enum(['male', 'female', 'other']).optional(),
  address: z
    .object({
      street: z.string().min(1, 'Street is required').optional(),
      city: z.string().min(1, 'City is required').optional(),
      state: z.string().min(1, 'State is required').optional(),
      zipCode: z.string().min(1, 'ZIP code is required').optional(),
      country: z.string().min(1, 'Country is required').optional(),
    })
    .optional(),
  emergencyContact: z
    .object({
      name: z.string().min(1, 'Emergency contact name is required').optional(),
      relationship: z.string().min(1, 'Relationship is required').optional(),
      phone: z.string().min(1, 'Emergency contact phone is required').optional(),
    })
    .optional(),
  medicalHistory: z.array(z.string()).optional(),
  allergies: z.array(z.string()).optional(),
  medications: z.array(z.string()).optional(),
  insuranceInfo: z
    .object({
      provider: z.string().min(1, 'Insurance provider is required').optional(),
      policyNumber: z.string().min(1, 'Policy number is required').optional(),
      groupNumber: z.string().min(1, 'Group number is required').optional(),
    })
    .optional(),
  status: z.enum(['active', 'inactive', 'archived']).optional(),
});

// GET /api/patients/[id] - Get a specific patient
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const patient = patients.find((p) => p.id === id);

    if (!patient) {
      return NextResponse.json({ success: false, message: 'Patient not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: patient,
    });
  } catch (error) {
    console.error('Get patient error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch patient' },
      { status: 500 }
    );
  }
}

// PUT /api/patients/[id] - Update a specific patient
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Add id to the body for validation
    const updateData = { ...body, id };
    const validatedData = updatePatientSchema.parse(updateData);

    const patientIndex = patients.findIndex((p) => p.id === id);

    if (patientIndex === -1) {
      return NextResponse.json({ success: false, message: 'Patient not found' }, { status: 404 });
    }

    // Check if email is being updated and if it already exists
    if (validatedData.email && validatedData.email !== patients[patientIndex].email) {
      const existingPatient = patients.find((p) => p.email === validatedData.email && p.id !== id);
      if (existingPatient) {
        return NextResponse.json(
          { success: false, message: 'Patient with this email already exists' },
          { status: 400 }
        );
      }
    }

    // Update patient
    const updatedPatient = {
      ...patients[patientIndex],
      ...validatedData,
      updatedAt: new Date().toISOString(),
    };

    patients[patientIndex] = updatedPatient;

    return NextResponse.json({
      success: true,
      data: updatedPatient,
      message: 'Patient updated successfully',
    });
  } catch (error) {
    console.error('Update patient error:', error);

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
      { success: false, message: 'Failed to update patient' },
      { status: 500 }
    );
  }
}

// DELETE /api/patients/[id] - Delete a specific patient
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const patientIndex = patients.findIndex((p) => p.id === id);

    if (patientIndex === -1) {
      return NextResponse.json({ success: false, message: 'Patient not found' }, { status: 404 });
    }

    // Soft delete - change status to archived instead of removing
    patients[patientIndex] = {
      ...patients[patientIndex],
      status: 'archived',
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      message: 'Patient archived successfully',
    });
  } catch (error) {
    console.error('Delete patient error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete patient' },
      { status: 500 }
    );
  }
}
