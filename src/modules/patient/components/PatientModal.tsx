/**
 * Patient Modal
 * Universal modal for viewing, creating, and updating patients
 */

import React, { useMemo, useCallback, memo } from 'react';
import { Formik, Form, Field, ErrorMessage, FieldProps } from 'formik';
import { Button, Modal } from '@/components/ui';
import { Input } from '@/components/ui';
import { UserOutlined, IdcardOutlined, HomeOutlined, InfoCircleOutlined } from '@ant-design/icons';
import * as Yup from 'yup';
import {
  Patient,
  CreatePatient,
  UpdatePatient,
  Gender,
  PatientGroup,
} from '../types/patient.types';

// Get validation schema based on mode
const getValidationSchema = (mode: 'view' | 'create' | 'edit') => {
  if (mode === 'view') {
    // No validation for view mode
    return Yup.object({});
  }

  // For create mode, all required fields are mandatory
  // For edit mode, only validate required fields and validate optional fields only if they have values

  return Yup.object({
    firstName: Yup.string().required('First name is required'),
    lastName: Yup.string().required('Last name is required'),
    mobile: Yup.string()
      .required('Mobile number is required')
      .matches(/^[0-9]{10}$/, 'Mobile number must be exactly 10 digits'),
    location: Yup.string().nullable().optional(),
    patientGroup: Yup.string().oneOf(Object.values(PatientGroup)).nullable().optional(),
    birthDate: Yup.date().nullable().optional(),
    gender: Yup.string().oneOf(Object.values(Gender)).nullable().optional(),
    age: Yup.number().min(0).max(150).nullable().optional(),
    profilePic: Yup.string().url('Invalid URL').nullable().optional(),
    numberOfChildren: Yup.number().min(0).nullable().optional(),
    country: Yup.string().nullable().optional(),
    state: Yup.string().nullable().optional(),
    city: Yup.string().nullable().optional(),
    region: Yup.string().nullable().optional(),
    zipCode: Yup.string().nullable().optional(),
    referredBy: Yup.string().nullable().optional(),
    consents: Yup.string().nullable().optional(),
    medicalConditions: Yup.array().of(Yup.string()).nullable().optional(),
  });
};

interface PatientModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'view' | 'create' | 'edit';
  patient?: Patient;
  onSave?: (data: CreatePatient | UpdatePatient) => void;
  isLoading?: boolean;
}

const PatientModalComponent: React.FC<PatientModalProps> = ({
  isOpen,
  onClose,
  mode,
  patient,
  onSave,
  isLoading = false,
}) => {
  // Get initial values based on mode (memoized)
  const initialValues = useMemo((): CreatePatient | UpdatePatient => {
    if (mode === 'create') {
      return {
        firstName: '',
        lastName: '',
        mobile: '',
      };
    } else if (mode === 'edit' || mode === 'view') {
      const patientData = patient || ({} as Patient);

      const initialValues: CreatePatient | UpdatePatient = {
        firstName: patientData.firstName || '',
        lastName: patientData.lastName || '',
        mobile: patientData.mobile || '',
        location: patientData.location || '',
        patientGroup: patientData.patientGroup || undefined,
        birthDate: patientData.birthDate || undefined,
        gender: patientData.gender || undefined,
        age: patientData.age || undefined,
        profilePic: patientData.profilePic || '',
        numberOfChildren: patientData.numberOfChildren || undefined,
        country: patientData.country || '',
        state: patientData.state || '',
        city: patientData.city || '',
        region: patientData.region || '',
        zipCode: patientData.zipCode || '',
        referredBy: patientData.referredBy || '',
        consents: patientData.consents || '',
        medicalConditions: patientData.medicalConditions || [],
        // Don't include id in form data - it should only be in the URL
      };

      return initialValues;
    }
    return {
      firstName: '',
      lastName: '',
      mobile: '',
    };
  }, [mode, patient]);

  const title = useMemo(() => {
    switch (mode) {
      case 'create':
        return 'Add New Patient';
      case 'edit':
        return 'Edit Patient';
      case 'view':
        return 'Patient Details';
      default:
        return 'Patient';
    }
  }, [mode]);

  const handleSubmit = useCallback(
    (values: CreatePatient | UpdatePatient) => {
      // Clean up the data before submitting
      const cleanedValues = Object.fromEntries(
        Object.entries(values).map(([key, value]) => [
          key,
          value === null || value === undefined || value === '' ? undefined : value,
        ])
      );

      onSave?.(cleanedValues as CreatePatient | UpdatePatient);
    },
    [onSave]
  );

  const renderFooter = useCallback(() => {
    if (mode === 'view') return null;

    return (
      <div className="flex justify-end space-x-2">
        <Button variant="secondary" onClick={onClose} disabled={isLoading}>
          Cancel
        </Button>
        <Button type="submit" form="patient-form" loading={isLoading} disabled={isLoading}>
          {mode === 'create' ? 'Create Patient' : 'Update Patient'}
        </Button>
      </div>
    );
  }, [mode, onClose, isLoading]);

  const renderForm = useCallback(
    () => (
      <Formik
        initialValues={initialValues}
        validationSchema={getValidationSchema(mode)}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ setFieldValue, errors, touched }) => (
          <Form id="patient-form" className="space-y-6">
            {/* Basic Information Section */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center">
                <UserOutlined className="mr-2 text-blue-600" />
                Basic Information
              </h3>

              {/* Name Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name *
                  </label>
                  <Field name="firstName">
                    {({ field }: FieldProps) => (
                      <Input
                        {...field}
                        placeholder="Enter first name"
                        disabled={mode === 'view'}
                        className={errors.firstName && touched.firstName ? 'border-red-500' : ''}
                      />
                    )}
                  </Field>
                  <ErrorMessage
                    name="firstName"
                    component="p"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name *
                  </label>
                  <Field name="lastName">
                    {({ field }: FieldProps) => (
                      <Input
                        {...field}
                        placeholder="Enter last name"
                        disabled={mode === 'view'}
                        className={errors.lastName && touched.lastName ? 'border-red-500' : ''}
                      />
                    )}
                  </Field>
                  <ErrorMessage
                    name="lastName"
                    component="p"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>
              </div>

              {/* Phone Number */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number *
                </label>
                <Field name="mobile">
                  {({ field }: FieldProps) => (
                    <Input
                      {...field}
                      placeholder="Enter 10-digit mobile number"
                      disabled={mode === 'view'}
                      className={errors.mobile && touched.mobile ? 'border-red-500' : ''}
                    />
                  )}
                </Field>
                <ErrorMessage name="mobile" component="p" className="text-red-500 text-xs mt-1" />
              </div>

              {/* Gender and Age */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                  <Field name="gender">
                    {({ field }: FieldProps) => (
                      <select
                        {...field}
                        disabled={mode === 'view'}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
                      >
                        <option value="">Select gender</option>
                        {Object.values(Gender).map((gender) => (
                          <option key={gender} value={gender}>
                            {gender}
                          </option>
                        ))}
                      </select>
                    )}
                  </Field>
                  <ErrorMessage name="gender" component="p" className="text-red-500 text-xs mt-1" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                  <Field name="age">
                    {({ field }: FieldProps) => (
                      <Input
                        {...field}
                        type="number"
                        onChange={(e) =>
                          setFieldValue(
                            'age',
                            e.target.value ? parseInt(e.target.value) : undefined
                          )
                        }
                        placeholder="Enter age"
                        disabled={mode === 'view'}
                      />
                    )}
                  </Field>
                  <ErrorMessage name="age" component="p" className="text-red-500 text-xs mt-1" />
                </div>
              </div>
            </div>

            {/* Personal Information Section */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center">
                <IdcardOutlined className="mr-2 text-green-600" />
                Personal Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Patient Group
                  </label>
                  <Field name="patientGroup">
                    {({ field }: FieldProps) => (
                      <select
                        {...field}
                        disabled={mode === 'view'}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
                      >
                        <option value="">Select group</option>
                        {Object.values(PatientGroup).map((group) => (
                          <option key={group} value={group}>
                            {group}
                          </option>
                        ))}
                      </select>
                    )}
                  </Field>
                  <ErrorMessage
                    name="patientGroup"
                    component="p"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Number of Children
                  </label>
                  <Field name="numberOfChildren">
                    {({ field }: FieldProps) => (
                      <Input
                        {...field}
                        type="number"
                        onChange={(e) =>
                          setFieldValue(
                            'numberOfChildren',
                            e.target.value ? parseInt(e.target.value) : undefined
                          )
                        }
                        placeholder="Enter number of children"
                        disabled={mode === 'view'}
                      />
                    )}
                  </Field>
                  <ErrorMessage
                    name="numberOfChildren"
                    component="p"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>
              </div>
            </div>

            {/* Address Information Section */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center">
                <HomeOutlined className="mr-2 text-purple-600" />
                Address Information
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location/Address
                  </label>
                  <Field name="location">
                    {({ field }: FieldProps) => (
                      <Input
                        {...field}
                        placeholder="Enter location/address"
                        disabled={mode === 'view'}
                      />
                    )}
                  </Field>
                  <ErrorMessage
                    name="location"
                    component="p"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                    <Field name="city">
                      {({ field }: FieldProps) => (
                        <Input {...field} placeholder="Enter city" disabled={mode === 'view'} />
                      )}
                    </Field>
                    <ErrorMessage name="city" component="p" className="text-red-500 text-xs mt-1" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                    <Field name="state">
                      {({ field }: FieldProps) => (
                        <Input {...field} placeholder="Enter state" disabled={mode === 'view'} />
                      )}
                    </Field>
                    <ErrorMessage
                      name="state"
                      component="p"
                      className="text-red-500 text-xs mt-1"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                    <Field name="country">
                      {({ field }: FieldProps) => (
                        <Input {...field} placeholder="Enter country" disabled={mode === 'view'} />
                      )}
                    </Field>
                    <ErrorMessage
                      name="country"
                      component="p"
                      className="text-red-500 text-xs mt-1"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code</label>
                    <Field name="zipCode">
                      {({ field }: FieldProps) => (
                        <Input {...field} placeholder="Enter ZIP code" disabled={mode === 'view'} />
                      )}
                    </Field>
                    <ErrorMessage
                      name="zipCode"
                      component="p"
                      className="text-red-500 text-xs mt-1"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Information Section */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center">
                <InfoCircleOutlined className="mr-2 text-orange-600" />
                Additional Information
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Referred By
                  </label>
                  <Field name="referredBy">
                    {({ field }: FieldProps) => (
                      <Input
                        {...field}
                        placeholder="Who referred this patient?"
                        disabled={mode === 'view'}
                      />
                    )}
                  </Field>
                  <ErrorMessage
                    name="referredBy"
                    component="p"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Medical Conditions
                  </label>
                  <Field name="medicalConditions">
                    {({ field }: FieldProps) => (
                      <Input
                        value={field.value?.join(', ') || ''}
                        onChange={(e) => {
                          const newArray = e.target.value
                            ? e.target.value
                                .split(',')
                                .map((item) => item.trim())
                                .filter((item) => item)
                            : [];
                          setFieldValue('medicalConditions', newArray);
                        }}
                        placeholder="Enter medical conditions (comma-separated)"
                        disabled={mode === 'view'}
                      />
                    )}
                  </Field>
                  <ErrorMessage
                    name="medicalConditions"
                    component="p"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Consents</label>
                  <Field name="consents">
                    {({ field }: FieldProps) => (
                      <textarea
                        {...field}
                        placeholder="Enter consent details"
                        disabled={mode === 'view'}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    )}
                  </Field>
                  <ErrorMessage
                    name="consents"
                    component="p"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    ),
    [initialValues, mode, handleSubmit]
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="lg" footer={renderFooter()}>
      {renderForm()}
    </Modal>
  );
};

// Memoize component to prevent unnecessary re-renders
export const PatientModal = memo(PatientModalComponent);
PatientModal.displayName = 'PatientModal';
