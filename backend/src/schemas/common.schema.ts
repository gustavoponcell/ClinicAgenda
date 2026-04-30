import { z } from 'zod';

export const idParamSchema = z.object({
  params: z.object({
    id: z.string().uuid('ID inválido'),
  }),
});

export const paginationQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().max(100).optional(),
});

export const optionalDateRangeSchema = z.object({
  dataInicio: z.coerce.date().optional(),
  dataFim: z.coerce.date().optional(),
});

export const dateTimeSchema = z.coerce.date().refine((date) => !Number.isNaN(date.getTime()), {
  message: 'Data inválida',
});

export const timeSchema = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Horário deve estar no formato HH:mm');
