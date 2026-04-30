import { Prisma } from '@prisma/client';
import { prisma } from '../config/prisma';

export const appointmentInclude = {
  patient: true,
  professional: true,
  specialty: true,
};

export const appointmentRepository = {
  findById(id: string) {
    return prisma.appointment.findUnique({
      where: { id },
      include: appointmentInclude,
    });
  },

  async list(where: Prisma.AppointmentWhereInput, skip: number, take: number) {
    const [items, total] = await prisma.$transaction([
      prisma.appointment.findMany({
        where,
        skip,
        take,
        orderBy: { dataHora: 'asc' },
        include: appointmentInclude,
      }),
      prisma.appointment.count({ where }),
    ]);

    return { items, total };
  },

  findConflict(professionalId: string, dataHora: Date, ignoredId?: string) {
    return prisma.appointment.findFirst({
      where: {
        professionalId,
        dataHora,
        status: { in: ['AGENDADA', 'REAGENDADA'] },
        ...(ignoredId ? { id: { not: ignoredId } } : {}),
      },
    });
  },

  create(data: Prisma.AppointmentUncheckedCreateInput) {
    return prisma.appointment.create({
      data,
      include: appointmentInclude,
    });
  },

  update(id: string, data: Prisma.AppointmentUpdateInput) {
    return prisma.appointment.update({
      where: { id },
      data,
      include: appointmentInclude,
    });
  },
};
