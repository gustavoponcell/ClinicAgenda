import { ActorType, WeekDay } from '@prisma/client';
import { availabilityRepository } from '../repositories/availability.repository';
import { professionalRepository } from '../repositories/professional.repository';
import { AppError } from '../utils/appError';
import { toMinutes } from '../utils/date';
import { auditLogService } from './auditLog.service';

function ensureValidRange(horaInicio: string, horaFim: string) {
  if (toMinutes(horaInicio) >= toMinutes(horaFim)) {
    throw new AppError('horaInicio deve ser menor que horaFim', 400);
  }
}

export const availabilityService = {
  async listByProfessional(professionalId: string) {
    const professional = await professionalRepository.findById(professionalId);
    if (!professional) throw new AppError('Profissional não encontrado', 404);
    return availabilityRepository.listByProfessional(professionalId);
  },

  async create(
    professionalId: string,
    data: { diaSemana: WeekDay; horaInicio: string; horaFim: string; ativo?: boolean },
    actorId: string,
  ) {
    const professional = await professionalRepository.findById(professionalId);
    if (!professional) throw new AppError('Profissional não encontrado', 404);

    ensureValidRange(data.horaInicio, data.horaFim);

    const availability = await availabilityRepository.create({
      professionalId,
      ...data,
      ativo: data.ativo ?? true,
    });

    await auditLogService.register(
      { actorType: ActorType.EMPLOYEE, actorId },
      'AVAILABILITY_CREATE',
      'Availability',
      availability.id,
      { professionalId },
    );

    return availability;
  },

  async update(
    id: string,
    data: { diaSemana?: WeekDay; horaInicio?: string; horaFim?: string; ativo?: boolean },
    actorId: string,
  ) {
    const current = await availabilityRepository.findById(id);
    if (!current) throw new AppError('Disponibilidade não encontrada', 404);

    ensureValidRange(data.horaInicio ?? current.horaInicio, data.horaFim ?? current.horaFim);

    const availability = await availabilityRepository.update(id, data);

    await auditLogService.register(
      { actorType: ActorType.EMPLOYEE, actorId },
      'AVAILABILITY_UPDATE',
      'Availability',
      id,
      { fields: Object.keys(data) },
    );

    return availability;
  },

  async remove(id: string, actorId: string) {
    const availability = await availabilityRepository.delete(id);

    await auditLogService.register(
      { actorType: ActorType.EMPLOYEE, actorId },
      'AVAILABILITY_DELETE',
      'Availability',
      id,
    );

    return availability;
  },
};
