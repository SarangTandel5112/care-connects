import { z } from 'zod';
import { AppointmentStatus } from '../types/appointment.types';

export const AppointmentStatusEnum = z.enum([
  'Scheduled',
  'Check In',
  'Consultation',
  'Completed',
  'Cancelled',
]);

export const createAppointmentSchema = z.object({
  status: AppointmentStatusEnum,
  appointmentStartTime: z.date(),
  appointmentEndTime: z.date(),
  treatment: z.string().optional(),
  patientId: z.string().uuid('Invalid patient ID'),
  doctorId: z.string().uuid('Invalid doctor ID'),
});

export const updateAppointmentSchema = createAppointmentSchema.partial().extend({
  id: z.string().uuid(),
});

export const appointmentSchema = createAppointmentSchema.extend({
  id: z.string().uuid(),
  patient: z.object({
    id: z.string().uuid(),
    firstName: z.string(),
    lastName: z.string(),
    mobile: z.string(),
  }),
  doctor: z.object({
    id: z.string().uuid(),
    firstName: z.string(),
    lastName: z.string(),
    email: z.string().email(),
  }),
  consultation: z
    .object({
      id: z.string().uuid(),
    })
    .optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const appointmentSearchSchema = z.object({
  status: AppointmentStatusEnum.optional(),
  appointmentTime: z.date().optional(),
  appointmentStartTime: z.date().optional(),
  appointmentEndTime: z.date().optional(),
  patientId: z.string().uuid().optional(),
  doctorId: z.string().uuid().optional(),
  clinicId: z.string().uuid().optional(),
  reason: z.string().optional(),
});
