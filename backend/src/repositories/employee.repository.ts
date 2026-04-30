import { Prisma } from '@prisma/client';
import { prisma } from '../config/prisma';

export const employeeRepository = {
  findById(id: string) {
    return prisma.employee.findUnique({ where: { id } });
  },

  findByEmail(email: string) {
    return prisma.employee.findUnique({ where: { email } });
  },

  create(data: Prisma.EmployeeCreateInput) {
    return prisma.employee.create({ data });
  },

  update(id: string, data: Prisma.EmployeeUpdateInput) {
    return prisma.employee.update({ where: { id }, data });
  },

  async list(where: Prisma.EmployeeWhereInput, skip: number, take: number) {
    const [items, total] = await prisma.$transaction([
      prisma.employee.findMany({
        where,
        skip,
        take,
        orderBy: { nome: 'asc' },
      }),
      prisma.employee.count({ where }),
    ]);

    return { items, total };
  },
};
