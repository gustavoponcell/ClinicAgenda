import { WeekDay } from '@prisma/client';
import { z } from 'zod';
import { timeSchema } from './common.schema';

export const professionalIdParamSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
});

export const createAvailabilitySchema = z.object({
  params: z.object({ id: z.string().uuid() }),
  body: z.object({
    diaSemana: z.nativeEnum(WeekDay),
    horaInicio: timeSchema,
    horaFim: timeSchema,
    ativo: z.boolean().optional(),
  }),
});

export const updateAvailabilitySchema = z.object({
  params: z.object({ id: z.string().uuid() }),
  body: z.object({
    diaSemana: z.nativeEnum(WeekDay).optional(),
    horaInicio: timeSchema.optional(),
    horaFim: timeSchema.optional(),
    ativo: z.boolean().optional(),
  }),
});
