import { Prisma } from '@prisma/client';
import { prisma } from '../config/prisma';

export const scheduleBlockRepository = {
  findById(id: string) {
    return prisma.scheduleBlock.findUnique({ where: { id } });
  },

  listByProfessional(professionalId: string) {
    return prisma.scheduleBlock.findMany({
      where: { professionalId },
      orderBy: { inicio: 'asc' },
    });
  },

  findOverlapping(professionalId: string, inicio: Date, fim: Date) {
    return prisma.scheduleBlock.findFirst({
      where: {
        professionalId,
        inicio: { lt: fim },
        fim: { gt: inicio },
      },
    });
  },

  create(data: Prisma.ScheduleBlockUncheckedCreateInput) {
    return prisma.scheduleBlock.create({ data });
  },

  delete(id: string) {
    return prisma.scheduleBlock.delete({ where: { id } });
  },
};
