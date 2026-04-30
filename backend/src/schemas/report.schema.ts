import { z } from 'zod';
import { AppointmentStatus } from '@prisma/client';
import { paginationQuerySchema } from './common.schema';

export const reportFilterSchema = z.object({
  query: paginationQuerySchema.extend({
    dataInicio: z.coerce.date().optional(),
    dataFim: z.coerce.date().optional(),
    professionalId: z.string().uuid().optional(),
    specialtyId: z.string().uuid().optional(),
    status: z.nativeEnum(AppointmentStatus).optional(),
  }),
});
