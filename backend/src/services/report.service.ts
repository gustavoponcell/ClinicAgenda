import { AppointmentStatus, Prisma } from '@prisma/client';
import { prisma } from '../config/prisma';
import { appointmentRepository } from '../repositories/appointment.repository';
import { getPagination, paginate } from '../utils/pagination';

function buildPeriodWhere(filters: {
  dataInicio?: Date;
  dataFim?: Date;
  professionalId?: string;
  specialtyId?: string;
  status?: AppointmentStatus;
}): Prisma.AppointmentWhereInput {
  return {
    professionalId: filters.professionalId,
    specialtyId: filters.specialtyId,
    status: filters.status,
    dataHora:
      filters.dataInicio || filters.dataFim
        ? {
            gte: filters.dataInicio,
            lte: filters.dataFim,
          }
        : undefined,
  };
}

export const reportService = {
  async dashboard() {
    const today = new Date();
    const start = new Date(today);
    start.setHours(0, 0, 0, 0);
    const end = new Date(today);
    end.setHours(23, 59, 59, 999);

    const [consultasHoje, confirmadas, canceladas, profissionaisAtivos, pacientes] = await prisma.$transaction([
      prisma.appointment.count({ where: { dataHora: { gte: start, lte: end } } }),
      prisma.appointment.count({ where: { status: { in: ['AGENDADA', 'REAGENDADA'] } } }),
      prisma.appointment.count({ where: { status: 'CANCELADA' } }),
      prisma.professional.count({ where: { ativo: true } }),
      prisma.patient.count(),
    ]);

    return {
      consultasHoje,
      consultasAtivas: confirmadas,
      consultasCanceladas: canceladas,
      profissionaisAtivos,
      pacientesCadastrados: pacientes,
    };
  },

  async appointments(filters: {
    page?: number;
    limit?: number;
    dataInicio?: Date;
    dataFim?: Date;
    professionalId?: string;
    specialtyId?: string;
    status?: AppointmentStatus;
  }) {
    const { page, limit, skip, take } = getPagination(filters);
    const where = buildPeriodWhere(filters);
    const { items, total } = await appointmentRepository.list(where, skip, take);
    return paginate(items, total, page, limit);
  },

  async professionals(filters: { dataInicio?: Date; dataFim?: Date }) {
    const where = buildPeriodWhere(filters);
    const rows = await prisma.appointment.groupBy({
      by: ['professionalId'],
      where,
      _count: { id: true },
    });

    const professionals = await prisma.professional.findMany({
      where: { id: { in: rows.map((row) => row.professionalId) } },
      select: { id: true, nome: true, email: true },
    });

    return rows.map((row) => ({
      professional: professionals.find((item) => item.id === row.professionalId),
      totalConsultas: row._count.id,
    }));
  },
};
