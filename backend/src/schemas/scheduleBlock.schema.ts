import { z } from 'zod';
import { dateTimeSchema } from './common.schema';

export const createScheduleBlockSchema = z.object({
  params: z.object({ id: z.string().uuid() }),
  body: z.object({
    inicio: dateTimeSchema,
    fim: dateTimeSchema,
    motivo: z.string().min(3),
  }),
});

export const blockIdParamSchema = z.object({
  params: z.object({ id: z.string().uuid() }),
});
