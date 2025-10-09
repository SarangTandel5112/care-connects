'use client';

import { useState } from 'react';
import {
  usePatients,
  useCreatePatient,
  useDeletePatient,
} from '@/modules/patient/hooks/usePatient';
import {
  CreatePatientFormData,
  createPatientSchema,
} from '@/modules/patient/schemas/patient.schema';
import { useFormHandler } from '@/hooks';
import { Button, Card, Field, LoadingSpinner } from '@/components/ui';
import { PatientSearchParams } from '@/types';

export default function PatientsListPage() {
  const [searchParams, setSearchParams] = useState<PatientSearchParams>({
    page: 1,
    limit: 10,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  const [showCreateForm, setShowCreateForm] = useState(false);

  // Fetch patients
  const { data: patientsData, isLoading, error } = usePatients(searchParams);
  const createPatientMutation = useCreatePatient();
  const deletePatientMutation = useDeletePatient();

  const handleSearch = (search: string) => {
    setSearchParams((prev) => ({
      ...prev,
      search: search || undefined,
      page: 1, // Reset to first page when searching
    }));
  };

  const handleStatusFilter = (status: 'active' | 'inactive' | 'archived' | 'all') => {
    setSearchParams((prev) => ({
      ...prev,
      status: status === 'all' ? undefined : status,
      page: 1,
    }));
  };

  const handlePageChange = (page: number) => {
    setSearchParams((prev) => ({ ...prev, page }));
  };

  const handleDeletePatient = (id: string) => {
    if (confirm('Are you sure you want to archive this patient?')) {
      deletePatientMutation.mutate({ id });
    }
  };

  if (isLoading) return <LoadingSpinner size="lg" />;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Patients</h1>
        <Button onClick={() => setShowCreateForm(true)}>Add New Patient</Button>
      </div>

      {/* Search and Filters */}
      <Card className="mb-6">
        <div className="p-4">
          <div className="flex gap-4 mb-4">
            <input
              type="text"
              placeholder="Search patients..."
              className="flex-1 px-3 py-2 border rounded-lg"
              onChange={(e) => handleSearch(e.target.value)}
            />
            <select
              className="px-3 py-2 border rounded-lg"
              onChange={(e) => handleStatusFilter(e.target.value as any)}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Patients List */}
      <div className="grid gap-4">
        {patientsData?.patients?.map((patient) => (
          <Card key={patient.id}>
            <div className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-semibold">
                    {patient.firstName} {patient.lastName}
                  </h3>
                  <p className="text-gray-600">{patient.email}</p>
                  <p className="text-gray-600">{patient.phone}</p>
                  <span
                    className={`inline-block px-2 py-1 rounded text-sm ${
                      patient.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : patient.status === 'inactive'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {patient.status}
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button variant="secondary" size="sm">
                    View
                  </Button>
                  <Button variant="secondary" size="sm">
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDeletePatient(patient.id)}
                    disabled={deletePatientMutation.isPending}
                  >
                    Archive
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      {patientsData?.pagination && (
        <div className="flex justify-center mt-6">
          <div className="flex gap-2">
            <Button
              variant="secondary"
              disabled={searchParams.page === 1}
              onClick={() => handlePageChange(searchParams.page! - 1)}
            >
              Previous
            </Button>
            <span className="px-4 py-2">
              Page {searchParams.page} of {patientsData.pagination.totalPages}
            </span>
            <Button
              variant="secondary"
              disabled={searchParams.page === patientsData.pagination.totalPages}
              onClick={() => handlePageChange(searchParams.page! + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Create Patient Modal */}
      {showCreateForm && (
        <CreatePatientModal
          onClose={() => setShowCreateForm(false)}
          onCreateSuccess={() => {
            setShowCreateForm(false);
            // The list will automatically refresh due to query invalidation
          }}
        />
      )}
    </div>
  );
}

// Create Patient Modal Component
function CreatePatientModal({
  onClose,
  onCreateSuccess,
}: {
  onClose: () => void;
  onCreateSuccess: () => void;
}) {
  const createPatientMutation = useCreatePatient();

  const {
    register,
    handleSubmit,
    formState: { errors },
    isSubmitting,
  } = useFormHandler<CreatePatientFormData>({
    schema: createPatientSchema as any,
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      dateOfBirth: '',
      gender: 'male',
      address: {
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'USA',
      },
      emergencyContact: {
        name: '',
        relationship: '',
        phone: '',
      },
      medicalHistory: [],
      allergies: [],
      medications: [],
      insuranceInfo: {
        provider: '',
        policyNumber: '',
        groupNumber: '',
      },
    },
    onSubmit: async (data) => {
      await createPatientMutation.mutateAsync(data);
      onCreateSuccess();
    },
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Create New Patient</h2>
            <Button variant="ghost" onClick={onClose}>
              ✕
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <Field
                  label="First Name"
                  placeholder="Enter first name"
                  error={errors.firstName?.message}
                  disabled={isSubmitting}
                  {...register('firstName')}
                />
                <Field
                  label="Last Name"
                  placeholder="Enter last name"
                  error={errors.lastName?.message}
                  disabled={isSubmitting}
                  {...register('lastName')}
                />
                <Field
                  label="Email"
                  type="email"
                  placeholder="Enter email"
                  error={errors.email?.message}
                  disabled={isSubmitting}
                  {...register('email')}
                />
                <Field
                  label="Phone"
                  placeholder="Enter phone number"
                  error={errors.phone?.message}
                  disabled={isSubmitting}
                  {...register('phone')}
                />
                <Field
                  label="Date of Birth"
                  type="date"
                  error={errors.dateOfBirth?.message}
                  disabled={isSubmitting}
                  {...register('dateOfBirth')}
                />
                <div>
                  <label className="block text-sm font-medium mb-2">Gender</label>
                  <select
                    className="w-full px-3 py-2 border rounded-lg"
                    disabled={isSubmitting}
                    {...register('gender')}
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                  {errors.gender && (
                    <span className="text-red-500 text-sm">{errors.gender.message}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Address */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Address</h3>
              <div className="grid grid-cols-2 gap-4">
                <Field
                  label="Street"
                  placeholder="Enter street address"
                  error={errors.address?.street?.message}
                  disabled={isSubmitting}
                  {...register('address.street')}
                />
                <Field
                  label="City"
                  placeholder="Enter city"
                  error={errors.address?.city?.message}
                  disabled={isSubmitting}
                  {...register('address.city')}
                />
                <Field
                  label="State"
                  placeholder="Enter state"
                  error={errors.address?.state?.message}
                  disabled={isSubmitting}
                  {...register('address.state')}
                />
                <Field
                  label="ZIP Code"
                  placeholder="Enter ZIP code"
                  error={errors.address?.zipCode?.message}
                  disabled={isSubmitting}
                  {...register('address.zipCode')}
                />
                <Field
                  label="Country"
                  placeholder="Enter country"
                  error={errors.address?.country?.message}
                  disabled={isSubmitting}
                  {...register('address.country')}
                />
              </div>
            </div>

            {/* Emergency Contact */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Emergency Contact</h3>
              <div className="grid grid-cols-2 gap-4">
                <Field
                  label="Name"
                  placeholder="Enter emergency contact name"
                  error={errors.emergencyContact?.name?.message}
                  disabled={isSubmitting}
                  {...register('emergencyContact.name')}
                />
                <Field
                  label="Relationship"
                  placeholder="Enter relationship"
                  error={errors.emergencyContact?.relationship?.message}
                  disabled={isSubmitting}
                  {...register('emergencyContact.relationship')}
                />
                <Field
                  label="Phone"
                  placeholder="Enter emergency contact phone"
                  error={errors.emergencyContact?.phone?.message}
                  disabled={isSubmitting}
                  {...register('emergencyContact.phone')}
                />
              </div>
            </div>

            {/* Insurance Information */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Insurance Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <Field
                  label="Provider"
                  placeholder="Enter insurance provider"
                  error={errors.insuranceInfo?.provider?.message}
                  disabled={isSubmitting}
                  {...register('insuranceInfo.provider')}
                />
                <Field
                  label="Policy Number"
                  placeholder="Enter policy number"
                  error={errors.insuranceInfo?.policyNumber?.message}
                  disabled={isSubmitting}
                  {...register('insuranceInfo.policyNumber')}
                />
                <Field
                  label="Group Number"
                  placeholder="Enter group number"
                  error={errors.insuranceInfo?.groupNumber?.message}
                  disabled={isSubmitting}
                  {...register('insuranceInfo.groupNumber')}
                />
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex gap-4 pt-4">
              <Button type="submit" isLoading={isSubmitting} className="flex-1">
                Create Patient
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={onClose}
                disabled={isSubmitting}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
}
