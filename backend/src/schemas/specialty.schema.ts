import { z } from 'zod';
import { paginationQuerySchema } from './common.schema';

export const specialtyListSchema = z.object({
  query: paginationQuerySchema.extend({
    search: z.string().optional(),
  }),
});

export const createSpecialtySchema = z.object({
  body: z.object({
    nome: z.string().min(3),
    descricao: z.string().optional(),
  }),
});

export const updateSpecialtySchema = z.object({
  params: z.object({ id: z.string().uuid() }),
  body: z.object({
    nome: z.string().min(3).optional(),
    descricao: z.string().nullable().optional(),
  }),
});
