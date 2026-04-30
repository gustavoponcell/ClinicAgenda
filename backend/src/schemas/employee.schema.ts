import { EmployeeRole } from '@prisma/client';
import { z } from 'zod';
import { paginationQuerySchema } from './common.schema';

export const employeeListSchema = z.object({
  query: paginationQuerySchema.extend({
    cargo: z.nativeEnum(EmployeeRole).optional(),
    ativo: z.coerce.boolean().optional(),
    search: z.string().optional(),
  }),
});

export const createEmployeeSchema = z.object({
  body: z.object({
    nome: z.string().min(3),
    email: z.string().email(),
    senha: z.string().min(8),
    cargo: z.nativeEnum(EmployeeRole),
  }),
});

export const updateEmployeeSchema = z.object({
  params: z.object({ id: z.string().uuid() }),
  body: z.object({
    nome: z.string().min(3).optional(),
    email: z.string().email().optional(),
    senha: z.string().min(8).optional(),
    cargo: z.nativeEnum(EmployeeRole).optional(),
    ativo: z.boolean().optional(),
  }),
});
