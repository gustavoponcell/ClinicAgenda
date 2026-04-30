import { Prisma } from '@prisma/client';
import { prisma } from '../config/prisma';

export const availabilityRepository = {
  findById(id: string) {
    return prisma.availability.findUnique({ where: { id } });
  },

  listByProfessional(professionalId: string) {
    return prisma.availability.findMany({
      where: { professionalId },
      orderBy: [{ diaSemana: 'asc' }, { horaInicio: 'asc' }],
    });
  },

  create(data: Prisma.AvailabilityUncheckedCreateInput) {
    return prisma.availability.create({ data });
  },

  update(id: string, data: Prisma.AvailabilityUpdateInput) {
    return prisma.availability.update({ where: { id }, data });
  },

  delete(id: string) {
    return prisma.availability.delete({ where: { id } });
  },
};
