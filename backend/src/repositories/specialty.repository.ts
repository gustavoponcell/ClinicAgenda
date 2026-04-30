import { Prisma } from '@prisma/client';
import { prisma } from '../config/prisma';

export const specialtyRepository = {
  findById(id: string) {
    return prisma.specialty.findUnique({ where: { id } });
  },

  findByName(nome: string) {
    return prisma.specialty.findUnique({ where: { nome } });
  },

  async list(where: Prisma.SpecialtyWhereInput, skip: number, take: number) {
    const [items, total] = await prisma.$transaction([
      prisma.specialty.findMany({ where, skip, take, orderBy: { nome: 'asc' } }),
      prisma.specialty.count({ where }),
    ]);

    return { items, total };
  },

  create(data: Prisma.SpecialtyCreateInput) {
    return prisma.specialty.create({ data });
  },

  update(id: string, data: Prisma.SpecialtyUpdateInput) {
    return prisma.specialty.update({ where: { id }, data });
  },

  delete(id: string) {
    return prisma.specialty.delete({ where: { id } });
  },
};
