import { z } from 'zod';

export const updatePatientSchema = z.object({
  body: z.object({
    nome: z.string().min(3).optional(),
    telefone: z.string().min(8).optional(),
    email: z.string().email().optional(),
  }),
});
