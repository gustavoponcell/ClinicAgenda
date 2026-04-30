import { Prisma } from '@prisma/client';
import { prisma } from '../config/prisma';

export const auditLogRepository = {
  create(data: Prisma.AuditLogUncheckedCreateInput) {
    return prisma.auditLog.create({ data });
  },

  async list(where: Prisma.AuditLogWhereInput, skip: number, take: number) {
    const [items, total] = await prisma.$transaction([
      prisma.auditLog.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.auditLog.count({ where }),
    ]);

    return { items, total };
  },
};
