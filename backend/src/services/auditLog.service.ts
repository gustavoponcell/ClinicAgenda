import { ActorType, Prisma } from '@prisma/client';
import { auditLogRepository } from '../repositories/auditLog.repository';
import { getPagination, paginate } from '../utils/pagination';

export interface AuditActor {
  actorType: ActorType;
  actorId?: string;
}

export const auditLogService = {
  register(actor: AuditActor, action: string, entity: string, entityId: string, metadata?: Prisma.InputJsonValue) {
    return auditLogRepository.create({
      actorType: actor.actorType,
      actorId: actor.actorId,
      action,
      entity,
      entityId,
      metadata,
    });
  },

  async list(filters: {
    page?: number;
    limit?: number;
    actorType?: ActorType;
    actorId?: string;
    entity?: string;
    action?: string;
    dataInicio?: Date;
    dataFim?: Date;
  }) {
    const { page, limit, skip, take } = getPagination(filters);
    const where: Prisma.AuditLogWhereInput = {
      actorType: filters.actorType,
      actorId: filters.actorId,
      entity: filters.entity,
      action: filters.action,
      createdAt:
        filters.dataInicio || filters.dataFim
          ? {
              gte: filters.dataInicio,
              lte: filters.dataFim,
            }
          : undefined,
    };

    const { items, total } = await auditLogRepository.list(where, skip, take);
    return paginate(items, total, page, limit);
  },
};
