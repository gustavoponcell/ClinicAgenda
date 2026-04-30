import { ActorType, Prisma } from '@prisma/client';
import { specialtyRepository } from '../repositories/specialty.repository';
import { AppError } from '../utils/appError';
import { getPagination, paginate } from '../utils/pagination';
import { auditLogService } from './auditLog.service';

export const specialtyService = {
  async list(filters: { page?: number; limit?: number; search?: string }) {
    const { page, limit, skip, take } = getPagination(filters);
    const where: Prisma.SpecialtyWhereInput = filters.search
      ? { nome: { contains: filters.search, mode: 'insensitive' } }
      : {};
    const { items, total } = await specialtyRepository.list(where, skip, take);
    return paginate(items, total, page, limit);
  },

  async create(data: { nome: string; descricao?: string }, actorId: string) {
    const existing = await specialtyRepository.findByName(data.nome);
    if (existing) throw new AppError('Especialidade já cadastrada', 409);

    const specialty = await specialtyRepository.create(data);

    await auditLogService.register(
      { actorType: ActorType.EMPLOYEE, actorId },
      'SPECIALTY_CREATE',
      'Specialty',
      specialty.id,
    );

    return specialty;
  },

  async update(id: string, data: { nome?: string; descricao?: string | null }, actorId: string) {
    const existing = await specialtyRepository.findById(id);
    if (!existing) throw new AppError('Especialidade não encontrada', 404);

    if (data.nome) {
      const duplicated = await specialtyRepository.findByName(data.nome);
      if (duplicated && duplicated.id !== id) throw new AppError('Especialidade já cadastrada', 409);
    }

    const specialty = await specialtyRepository.update(id, data);

    await auditLogService.register(
      { actorType: ActorType.EMPLOYEE, actorId },
      'SPECIALTY_UPDATE',
      'Specialty',
      id,
      { fields: Object.keys(data) },
    );

    return specialty;
  },

  async remove(id: string, actorId: string) {
    const specialty = await specialtyRepository.delete(id);

    await auditLogService.register(
      { actorType: ActorType.EMPLOYEE, actorId },
      'SPECIALTY_DELETE',
      'Specialty',
      id,
    );

    return specialty;
  },
};
