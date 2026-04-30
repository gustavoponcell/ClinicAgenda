import { z } from 'zod';
import { paginationQuerySchema } from './common.schema';

export const professionalListSchema = z.object({
  query: paginationQuerySchema.extend({
    specialtyId: z.string().uuid().optional(),
    ativo: z.coerce.boolean().optional(),
    search: z.string().optional(),
  }),
});

export const createProfessionalSchema = z.object({
  body: z.object({
    nome: z.string().min(3),
    email: z.string().email(),
    telefone: z.string().min(8),
    specialtyIds: z.array(z.string().uuid()).min(1),
  }),
});

export const updateProfessionalSchema = z.object({
  params: z.object({ id: z.string().uuid() }),
  body: z.object({
    nome: z.string().min(3).optional(),
    email: z.string().email().optional(),
    telefone: z.string().min(8).optional(),
    ativo: z.boolean().optional(),
    specialtyIds: z.array(z.string().uuid()).min(1).optional(),
  }),
});
