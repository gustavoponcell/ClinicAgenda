import { z } from 'zod';

export const patientRegisterSchema = z.object({
  body: z.object({
    nome: z.string().min(3),
    email: z.string().email(),
    senha: z.string().min(8),
    cpf: z.string().min(11),
    telefone: z.string().min(8),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    senha: z.string().min(1),
  }),
});
