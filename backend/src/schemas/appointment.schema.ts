import { AppointmentStatus } from '@prisma/client';
import { z } from 'zod';
import { dateTimeSchema, paginationQuerySchema } from './common.schema';

export const createAppointmentSchema = z.object({
  body: z.object({
    professionalId: z.string().uuid(),
    specialtyId: z.string().uuid(),
    dataHora: dateTimeSchema,
    observacoes: z.string().optional(),
    patientId: z.string().uuid().optional(),
  }),
});

export const rescheduleAppointmentSchema = z.object({
  params: z.object({ id: z.string().uuid() }),
  body: z.object({
    dataHora: dateTimeSchema,
    observacoes: z.string().optional(),
  }),
});

export const cancelAppointmentSchema = z.object({
  params: z.object({ id: z.string().uuid() }),
  body: z.object({
    motivo: z.string().optional(),
  }).default({}),
});

export const appointmentIdParamSchema = z.object({
  params: z.object({ id: z.string().uuid() }),
});

export const adminAppointmentListSchema = z.object({
  query: paginationQuerySchema.extend({
    dataInicio: z.coerce.date().optional(),
    dataFim: z.coerce.date().optional(),
    professionalId: z.string().uuid().optional(),
    specialtyId: z.string().uuid().optional(),
    status: z.nativeEnum(AppointmentStatus).optional(),
  }),
});
