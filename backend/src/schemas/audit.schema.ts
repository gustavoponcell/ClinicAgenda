import { ActorType } from '@prisma/client';
import { z } from 'zod';
import { paginationQuerySchema } from './common.schema';

export const auditLogListSchema = z.object({
  query: paginationQuerySchema.extend({
    actorType: z.nativeEnum(ActorType).optional(),
    actorId: z.string().uuid().optional(),
    entity: z.string().optional(),
    action: z.string().optional(),
    dataInicio: z.coerce.date().optional(),
    dataFim: z.coerce.date().optional(),
  }),
});
