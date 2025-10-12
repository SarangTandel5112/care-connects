import React, { useState, useEffect, useMemo, useCallback, memo } from 'react';
import { Formik, Form, Field, ErrorMessage, FieldProps } from 'formik';
import { Button, Modal } from '@/components/ui';
import { Input } from '@/components/ui';
import { CalendarOutlined, UserOutlined, ClockCircleOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import * as Yup from 'yup';
import {
  Appointment,
  CreateAppointment,
  UpdateAppointment,
  AppointmentStatus,
  Patient,
  Doctor,
} from '../types/appointment.types';
import { usePatients, useDoctors } from '../hooks/useAppointments';

// Helper function to format date for datetime-local input (preserves local timezone)
const formatDateTimeLocal = (date: Date | string | undefined): string => {
  if (!date) return '';

  const d = new Date(date);
  // Get local date/time components
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');

  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

// Get validation schema based on mode
const getValidationSchema = (mode: 'view' | 'create' | 'edit') => {
  if (mode === 'view') {
    return Yup.object({});
  }

  return Yup.object({
    status: Yup.string().oneOf(Object.values(AppointmentStatus)).required('Status is required'),
    appointmentStartTime: Yup.date().required('Start time is required'),
    appointmentEndTime: Yup.date().required('End time is required'),
    treatment: Yup.string().optional(),
    patientId: Yup.string().required('Patient is required'),
    doctorId: Yup.string().required('Doctor is required'),
  });
};

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'view' | 'create' | 'edit';
  appointment?: Appointment;
  onSave?: (data: CreateAppointment | UpdateAppointment) => void;
  onEdit?: () => void;
  onDelete?: () => void;
  isLoading?: boolean;
  prefilledTimes?: { start: Date; end: Date } | null;
}

const AppointmentModalComponent: React.FC<AppointmentModalProps> = ({
  isOpen,
  onClose,
  mode,
  appointment,
  onSave,
  onEdit,
  onDelete,
  isLoading = false,
  prefilledTimes,
}) => {
  // State for searchable dropdowns
  const [patientSearch, setPatientSearch] = useState('');
  const [doctorSearch, setDoctorSearch] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [isPatientDropdownOpen, setIsPatientDropdownOpen] = useState(false);
  const [isDoctorDropdownOpen, setIsDoctorDropdownOpen] = useState(false);

  // Use API hooks
  const { data: patients = [], isLoading: isLoadingPatients } = usePatients(patientSearch);
  const { data: doctors = [], isLoading: isLoadingDoctors } = useDoctors();

  // Initialize selected patient and doctor from appointment data
  useEffect(() => {
    if (isOpen && appointment) {
      setSelectedPatient(appointment.patient || null);
      setSelectedDoctor(appointment.doctor || null);
    } else if (!isOpen) {
      // Reset state when modal closes
      setSelectedPatient(null);
      setSelectedDoctor(null);
      setPatientSearch('');
      setDoctorSearch('');
      setIsPatientDropdownOpen(false);
      setIsDoctorDropdownOpen(false);
    }
  }, [isOpen, appointment]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (
        !target.closest('.patient-dropdown-container') &&
        !target.closest('.doctor-dropdown-container')
      ) {
        setIsPatientDropdownOpen(false);
        setIsDoctorDropdownOpen(false);
      }
    };

    if (isPatientDropdownOpen || isDoctorDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isPatientDropdownOpen, isDoctorDropdownOpen]);

  // Get initial values based on mode (memoized)
  const initialValues = useMemo((): CreateAppointment | UpdateAppointment => {
    if (mode === 'create') {
      return {
        status: AppointmentStatus.SCHEDULED,
        appointmentStartTime: prefilledTimes?.start || new Date(),
        appointmentEndTime: prefilledTimes?.end || new Date(Date.now() + 30 * 60 * 1000), // 30 minutes later
        treatment: '',
        patientId: '',
        doctorId: '',
      };
    } else if (mode === 'edit' || mode === 'view') {
      const appointmentData = appointment || ({} as Appointment);
      return {
        status: appointmentData.status || AppointmentStatus.SCHEDULED,
        appointmentStartTime: appointmentData.appointmentStartTime || new Date(),
        appointmentEndTime: appointmentData.appointmentEndTime || new Date(),
        treatment: appointmentData.treatment || '',
        patientId: appointmentData.patient?.id || '',
        doctorId: appointmentData.doctor?.id || '',
        ...(mode === 'edit' && appointmentData.id ? { id: appointmentData.id } : {}),
      };
    }
    return {
      status: AppointmentStatus.SCHEDULED,
      appointmentStartTime: new Date(),
      appointmentEndTime: new Date(),
      treatment: '',
      patientId: '',
      doctorId: '',
    };
  }, [mode, appointment, prefilledTimes]);

  const title = useMemo(() => {
    switch (mode) {
      case 'create':
        return 'Schedule New Appointment';
      case 'edit':
        return 'Edit Appointment';
      case 'view':
        return 'View Appointment';
      default:
        return 'Appointment';
    }
  }, [mode]);

  const handleSubmit = useCallback((values: CreateAppointment | UpdateAppointment) => {
    // Clean up the data before submitting
    const cleanedValues = Object.fromEntries(
      Object.entries(values).map(([key, value]) => [
        key,
        value === null || value === undefined || value === '' ? undefined : value,
      ])
    );

    onSave?.(cleanedValues as CreateAppointment | UpdateAppointment);
  }, [onSave]);

  const renderForm = useCallback(() => (
    <Formik
      initialValues={initialValues}
      validationSchema={getValidationSchema(mode)}
      onSubmit={handleSubmit}
      enableReinitialize
    >
      {({ setFieldValue, setFieldTouched, errors, touched }) => (
        <Form className="space-y-6">
          {/* Appointment Details Section */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <CalendarOutlined className="mr-2 text-blue-600" />
              Appointment Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status *</label>
                <Field name="status">
                  {({ field }: FieldProps) => (
                    <select
                      {...field}
                      disabled={mode === 'view'}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
                    >
                      {Object.values(AppointmentStatus).map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  )}
                </Field>
                <ErrorMessage name="status" component="p" className="text-red-500 text-xs mt-1" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Treatment</label>
                <Field name="treatment">
                  {({ field }: FieldProps) => (
                    <Input
                      {...field}
                      placeholder="Enter treatment details"
                      disabled={mode === 'view'}
                    />
                  )}
                </Field>
                <ErrorMessage
                  name="treatment"
                  component="p"
                  className="text-red-500 text-xs mt-1"
                />
              </div>
            </div>
          </div>

          {/* Time Information Section */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <ClockCircleOutlined className="mr-2 text-green-600" />
              Time Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Time *</label>
                <Field name="appointmentStartTime">
                  {({ field }: FieldProps) => (
                    <Input
                      {...field}
                      type="datetime-local"
                      value={formatDateTimeLocal(field.value)}
                      onChange={(e) =>
                        setFieldValue('appointmentStartTime', new Date(e.target.value))
                      }
                      disabled={mode === 'view'}
                      className={
                        errors.appointmentStartTime && touched.appointmentStartTime
                          ? 'border-red-500'
                          : ''
                      }
                    />
                  )}
                </Field>
                <ErrorMessage
                  name="appointmentStartTime"
                  component="p"
                  className="text-red-500 text-xs mt-1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">End Time *</label>
                <Field name="appointmentEndTime">
                  {({ field }: FieldProps) => (
                    <Input
                      {...field}
                      type="datetime-local"
                      value={formatDateTimeLocal(field.value)}
                      onChange={(e) =>
                        setFieldValue('appointmentEndTime', new Date(e.target.value))
                      }
                      disabled={mode === 'view'}
                      className={
                        errors.appointmentEndTime && touched.appointmentEndTime
                          ? 'border-red-500'
                          : ''
                      }
                    />
                  )}
                </Field>
                <ErrorMessage
                  name="appointmentEndTime"
                  component="p"
                  className="text-red-500 text-xs mt-1"
                />
              </div>
            </div>
          </div>

          {/* Participants Section */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <UserOutlined className="mr-2 text-purple-600" />
              Participants
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Patient *</label>
                <div className="relative patient-dropdown-container">
                  <Input
                    value={
                      selectedPatient
                        ? `${selectedPatient.firstName} ${selectedPatient.lastName}`
                        : patientSearch
                    }
                    onChange={(e) => {
                      setPatientSearch(e.target.value);
                      setIsPatientDropdownOpen(true);
                    }}
                    onFocus={() => setIsPatientDropdownOpen(true)}
                    placeholder="Search for patient..."
                    disabled={mode === 'view'}
                    className={errors.patientId && touched.patientId ? 'border-red-500' : ''}
                  />

                  {isPatientDropdownOpen && mode !== 'view' && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60">
                      <div className="max-h-60 overflow-y-auto">
                        {isLoadingPatients ? (
                          <div className="px-3 py-2 text-sm text-gray-500">Loading patients...</div>
                        ) : patients.length > 0 ? (
                          patients.map((patient) => (
                            <div
                              key={patient.id}
                              onClick={() => {
                                setSelectedPatient(patient);
                                setPatientSearch('');
                                setIsPatientDropdownOpen(false);
                                setFieldValue('patientId', patient.id);
                                setFieldTouched('patientId', true, false);
                              }}
                              className="px-3 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                            >
                              <div className="flex justify-between items-center">
                                <div>
                                  <p className="text-sm font-medium text-gray-900">
                                    {patient.firstName} {patient.lastName}
                                  </p>
                                  <p className="text-xs text-gray-500">{patient.mobile}</p>
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="px-3 py-2 text-sm text-gray-500">
                            {patientSearch
                              ? 'No patients found'
                              : 'Start typing to search patients'}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                <ErrorMessage
                  name="patientId"
                  component="p"
                  className="text-red-500 text-xs mt-1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Doctor *</label>
                <div className="relative doctor-dropdown-container">
                  <Input
                    value={
                      selectedDoctor
                        ? `${selectedDoctor.firstName} ${selectedDoctor.lastName}`
                        : doctorSearch
                    }
                    onChange={(e) => {
                      setDoctorSearch(e.target.value);
                      setIsDoctorDropdownOpen(true);
                    }}
                    onFocus={() => setIsDoctorDropdownOpen(true)}
                    placeholder="Search for doctor..."
                    disabled={mode === 'view'}
                    className={errors.doctorId && touched.doctorId ? 'border-red-500' : ''}
                  />

                  {isDoctorDropdownOpen && mode !== 'view' && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60">
                      <div className="max-h-60 overflow-y-auto">
                        {isLoadingDoctors ? (
                          <div className="px-3 py-2 text-sm text-gray-500">Loading doctors...</div>
                        ) : doctors.length > 0 ? (
                          doctors.map((doctor) => (
                            <div
                              key={doctor.id}
                              onClick={() => {
                                setSelectedDoctor(doctor);
                                setDoctorSearch('');
                                setIsDoctorDropdownOpen(false);
                                setFieldValue('doctorId', doctor.id);
                                setFieldTouched('doctorId', true, false);
                              }}
                              className="px-3 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                            >
                              <div className="flex justify-between items-center">
                                <div>
                                  <p className="text-sm font-medium text-gray-900">
                                    Dr. {doctor.firstName} {doctor.lastName}
                                  </p>
                                  <p className="text-xs text-gray-500">{doctor.email}</p>
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="px-3 py-2 text-sm text-gray-500">No doctors found</div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                <ErrorMessage name="doctorId" component="p" className="text-red-500 text-xs mt-1" />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-2 mt-6 pt-4 border-t border-gray-200">
            {mode === 'view' ? (
              <>
                <Button variant="secondary" onClick={onClose}>
                  Close
                </Button>
                {onDelete && (
                  <Button
                    variant="danger"
                    onClick={onDelete}
                    icon={<DeleteOutlined />}
                  >
                    Delete
                  </Button>
                )}
                {onEdit && (
                  <Button onClick={onEdit} icon={<EditOutlined />}>
                    Edit
                  </Button>
                )}
              </>
            ) : (
              <>
                <Button variant="secondary" onClick={onClose} disabled={isLoading}>
                  Cancel
                </Button>
                <Button type="submit" loading={isLoading} disabled={isLoading}>
                  {mode === 'create' ? 'Schedule Appointment' : 'Update Appointment'}
                </Button>
              </>
            )}
          </div>
        </Form>
      )}
    </Formik>
  ), [
    initialValues,
    mode,
    handleSubmit,
    onClose,
    onDelete,
    onEdit,
    isLoading,
    selectedPatient,
    selectedDoctor,
    patientSearch,
    doctorSearch,
    isPatientDropdownOpen,
    isDoctorDropdownOpen,
    patients,
    isLoadingPatients,
    doctors,
    isLoadingDoctors,
  ]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="lg"
    >
      <div className="max-h-[70vh] overflow-y-auto">
        {renderForm()}
      </div>
    </Modal>
  );
};

// Memoize component to prevent unnecessary re-renders
export const AppointmentModal = memo(AppointmentModalComponent);
AppointmentModal.displayName = 'AppointmentModal';
