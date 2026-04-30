import { ActorType, AppointmentStatus, Prisma } from '@prisma/client';
import { appointmentRepository } from '../repositories/appointment.repository';
import { availabilityRepository } from '../repositories/availability.repository';
import { patientRepository } from '../repositories/patient.repository';
import { professionalRepository } from '../repositories/professional.repository';
import { scheduleBlockRepository } from '../repositories/scheduleBlock.repository';
import { specialtyRepository } from '../repositories/specialty.repository';
import { RequestUser } from '../types/auth';
import { AppError } from '../utils/appError';
import { addMinutes, getTimeHHmm, overlaps, toMinutes, toWeekDay } from '../utils/date';
import { getPagination, paginate } from '../utils/pagination';
import { auditLogService } from './auditLog.service';

const APPOINTMENT_DURATION_MINUTES = 60;

function getActor(user: RequestUser) {
  return {
    actorType: user.type === 'PATIENT' ? ActorType.PATIENT : ActorType.EMPLOYEE,
    actorId: user.id,
  };
}

async function ensureCanUseSlot(professionalId: string, dataHora: Date, ignoredAppointmentId?: string) {
  if (dataHora < new Date()) {
    throw new AppError('Não é possível agendar consulta em data passada', 400);
  }

  const conflict = await appointmentRepository.findConflict(professionalId, dataHora, ignoredAppointmentId);
  if (conflict) throw new AppError('Horário indisponível para este profissional', 409);

  const availabilities = await availabilityRepository.listByProfessional(professionalId);
  const appointmentWeekDay = toWeekDay(dataHora);
  const startTime = getTimeHHmm(dataHora);
  const startMinutes = toMinutes(startTime);
  const endMinutes = startMinutes + APPOINTMENT_DURATION_MINUTES;

  const available = availabilities.some(
    (availability) =>
      availability.ativo &&
      availability.diaSemana === appointmentWeekDay &&
      startMinutes >= toMinutes(availability.horaInicio) &&
      endMinutes <= toMinutes(availability.horaFim),
  );

  if (!available) throw new AppError('Profissional não atende neste dia ou horário', 409);

  const blocks = await scheduleBlockRepository.listByProfessional(professionalId);
  const appointmentEnd = addMinutes(dataHora, APPOINTMENT_DURATION_MINUTES);
  const blocked = blocks.some((block) => overlaps(dataHora, appointmentEnd, block.inicio, block.fim));

  if (blocked) throw new AppError('Horário bloqueado na agenda do profissional', 409);
}

async function ensureProfessionalSpecialty(professionalId: string, specialtyId: string) {
  const professional = await professionalRepository.findById(professionalId);
  if (!professional || !professional.ativo) throw new AppError('Profissional não encontrado ou inativo', 404);

  const specialty = await specialtyRepository.findById(specialtyId);
  if (!specialty) throw new AppError('Especialidade não encontrada', 404);

  const hasSpecialty = professional.specialties.some((item) => item.specialtyId === specialtyId);
  if (!hasSpecialty) {
    throw new AppError('Profissional não atende a especialidade informada', 400);
  }
}

function ensureCanAccessAppointment(user: RequestUser, appointment: { patientId: string }) {
  if (user.type === 'PATIENT' && appointment.patientId !== user.id) {
    throw new AppError('Consulta não pertence ao paciente autenticado', 403);
  }
}

export const appointmentService = {
  async listMine(patientId: string) {
    const { page, limit, skip, take } = getPagination({ page: 1, limit: 100 });
    const { items, total } = await appointmentRepository.list({ patientId }, skip, take);
    return paginate(items, total, page, limit);
  },

  async create(
    user: RequestUser,
    data: {
      patientId?: string;
      professionalId: string;
      specialtyId: string;
      dataHora: Date;
      observacoes?: string;
    },
  ) {
    const patientId = user.type === 'PATIENT' ? user.id : data.patientId;
    if (!patientId) throw new AppError('patientId é obrigatório para agendamento administrativo', 400);

    const patient = await patientRepository.findById(patientId);
    if (!patient) throw new AppError('Paciente não encontrado', 404);

    await ensureProfessionalSpecialty(data.professionalId, data.specialtyId);
    await ensureCanUseSlot(data.professionalId, data.dataHora);

    const appointment = await appointmentRepository.create({
      patientId,
      professionalId: data.professionalId,
      specialtyId: data.specialtyId,
      dataHora: data.dataHora,
      observacoes: data.observacoes,
      status: AppointmentStatus.AGENDADA,
    });

    await auditLogService.register(getActor(user), 'APPOINTMENT_CREATE', 'Appointment', appointment.id, {
      patientId,
      professionalId: data.professionalId,
      specialtyId: data.specialtyId,
      dataHora: data.dataHora,
    });

    return appointment;
  },

  async reschedule(user: RequestUser, id: string, data: { dataHora: Date; observacoes?: string }) {
    const current = await appointmentRepository.findById(id);
    if (!current) throw new AppError('Consulta não encontrada', 404);
    ensureCanAccessAppointment(user, current);

    if (current.status === AppointmentStatus.CANCELADA || current.status === AppointmentStatus.REALIZADA) {
      throw new AppError('Consulta cancelada ou realizada não pode ser reagendada', 400);
    }

    await ensureCanUseSlot(current.professionalId, data.dataHora, id);

    const appointment = await appointmentRepository.update(id, {
      dataHora: data.dataHora,
      observacoes: data.observacoes ?? current.observacoes,
      status: AppointmentStatus.REAGENDADA,
    });

    await auditLogService.register(getActor(user), 'APPOINTMENT_RESCHEDULE', 'Appointment', id, {
      previousDataHora: current.dataHora,
      newDataHora: data.dataHora,
    });

    return appointment;
  },

  async cancel(user: RequestUser, id: string, motivo?: string) {
    const current = await appointmentRepository.findById(id);
    if (!current) throw new AppError('Consulta não encontrada', 404);
    ensureCanAccessAppointment(user, current);

    if (current.status === AppointmentStatus.CANCELADA) throw new AppError('Consulta já cancelada', 400);
    if (current.status === AppointmentStatus.REALIZADA) throw new AppError('Consulta realizada não pode ser cancelada', 400);

    const appointment = await appointmentRepository.update(id, {
      status: AppointmentStatus.CANCELADA,
      observacoes: motivo ? `${current.observacoes ?? ''}\nCancelamento: ${motivo}`.trim() : current.observacoes,
    });

    await auditLogService.register(getActor(user), 'APPOINTMENT_CANCEL', 'Appointment', id, {
      motivo,
      previousStatus: current.status,
    });

    return appointment;
  },

  async complete(user: RequestUser, id: string) {
    if (user.type !== 'EMPLOYEE') throw new AppError('Apenas funcionários podem concluir consultas', 403);

    const current = await appointmentRepository.findById(id);
    if (!current) throw new AppError('Consulta não encontrada', 404);
    if (current.status === AppointmentStatus.CANCELADA) throw new AppError('Consulta cancelada não pode ser realizada', 400);

    const appointment = await appointmentRepository.update(id, {
      status: AppointmentStatus.REALIZADA,
    });

    await auditLogService.register(getActor(user), 'APPOINTMENT_COMPLETE', 'Appointment', id, {
      previousStatus: current.status,
    });

    return appointment;
  },

  async listAdmin(filters: {
    page?: number;
    limit?: number;
    dataInicio?: Date;
    dataFim?: Date;
    professionalId?: string;
    specialtyId?: string;
    status?: AppointmentStatus;
  }) {
    const { page, limit, skip, take } = getPagination(filters);
    const where: Prisma.AppointmentWhereInput = {
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

    const { items, total } = await appointmentRepository.list(where, skip, take);
    return paginate(items, total, page, limit);
  },

  async getAdminById(id: string) {
    const appointment = await appointmentRepository.findById(id);
    if (!appointment) throw new AppError('Consulta não encontrada', 404);
    return appointment;
  },
};
