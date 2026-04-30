import { Prisma } from '@prisma/client';
import { prisma } from '../config/prisma';

const includeRelations = {
  specialties: {
    include: {
      specialty: true,
    },
  },
};

export const professionalRepository = {
  findById(id: string) {
    return prisma.professional.findUnique({
      where: { id },
      include: includeRelations,
    });
  },

  findByEmail(email: string) {
    return prisma.professional.findUnique({ where: { email } });
  },

  async list(where: Prisma.ProfessionalWhereInput, skip: number, take: number) {
    const [items, total] = await prisma.$transaction([
      prisma.professional.findMany({
        where,
        skip,
        take,
        orderBy: { nome: 'asc' },
        include: includeRelations,
      }),
      prisma.professional.count({ where }),
    ]);

    return { items, total };
  },

  create(data: Prisma.ProfessionalCreateInput) {
    return prisma.professional.create({
      data,
      include: includeRelations,
    });
  },

  update(id: string, data: Prisma.ProfessionalUpdateInput) {
    return prisma.professional.update({
      where: { id },
      data,
      include: includeRelations,
    });
  },
};
