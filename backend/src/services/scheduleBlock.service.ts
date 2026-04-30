import { ActorType } from '@prisma/client';
import { professionalRepository } from '../repositories/professional.repository';
import { scheduleBlockRepository } from '../repositories/scheduleBlock.repository';
import { AppError } from '../utils/appError';
import { auditLogService } from './auditLog.service';

export const scheduleBlockService = {
  async listByProfessional(professionalId: string) {
    const professional = await professionalRepository.findById(professionalId);
    if (!professional) throw new AppError('Profissional não encontrado', 404);
    return scheduleBlockRepository.listByProfessional(professionalId);
  },

  async create(professionalId: string, data: { inicio: Date; fim: Date; motivo: string }, actorId: string) {
    const professional = await professionalRepository.findById(professionalId);
    if (!professional) throw new AppError('Profissional não encontrado', 404);
    if (data.inicio >= data.fim) throw new AppError('Início deve ser menor que fim', 400);

    const overlapping = await scheduleBlockRepository.findOverlapping(professionalId, data.inicio, data.fim);
    if (overlapping) throw new AppError('Já existe bloqueio no período informado', 409);

    const block = await scheduleBlockRepository.create({
      professionalId,
      inicio: data.inicio,
      fim: data.fim,
      motivo: data.motivo,
    });

    await auditLogService.register(
      { actorType: ActorType.EMPLOYEE, actorId },
      'SCHEDULE_BLOCK_CREATE',
      'ScheduleBlock',
      block.id,
      { professionalId, inicio: data.inicio, fim: data.fim },
    );

    return block;
  },

  async remove(id: string, actorId: string) {
    const block = await scheduleBlockRepository.delete(id);

    await auditLogService.register(
      { actorType: ActorType.EMPLOYEE, actorId },
      'SCHEDULE_BLOCK_DELETE',
      'ScheduleBlock',
      id,
    );

    return block;
  },
};
