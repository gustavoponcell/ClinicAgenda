import { Prisma } from '@prisma/client';
import { prisma } from '../config/prisma';

export const patientRepository = {
  findById(id: string) {
    return prisma.patient.findUnique({ where: { id } });
  },

  findByEmail(email: string) {
    return prisma.patient.findUnique({ where: { email } });
  },

  findByCpf(cpf: string) {
    return prisma.patient.findUnique({ where: { cpf } });
  },

  create(data: Prisma.PatientCreateInput) {
    return prisma.patient.create({ data });
  },

  update(id: string, data: Prisma.PatientUpdateInput) {
    return prisma.patient.update({ where: { id }, data });
  },
};
