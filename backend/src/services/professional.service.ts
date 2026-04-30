import { ActorType, Prisma } from '@prisma/client';
import { professionalRepository } from '../repositories/professional.repository';
import { specialtyRepository } from '../repositories/specialty.repository';
import { AppError } from '../utils/appError';
import { getPagination, paginate } from '../utils/pagination';
import { auditLogService } from './auditLog.service';

function normalizeProfessional<T extends { specialties?: Array<{ specialty: unknown }> }>(professional: T) {
  return {
    ...professional,
    specialties: professional.specialties?.map((item) => item.specialty) ?? [],
  };
}

async function ensureSpecialtiesExist(specialtyIds: string[]) {
  const specialties = await Promise.all(specialtyIds.map((id) => specialtyRepository.findById(id)));
  if (specialties.some((item) => !item)) {
    throw new AppError('Uma ou mais especialidades não foram encontradas', 404);
  }
}

export const professionalService = {
  async list(filters: {
    page?: number;
    limit?: number;
    specialtyId?: string;
    ativo?: boolean;
    search?: string;
  }) {
    const { page, limit, skip, take } = getPagination(filters);
    const where: Prisma.ProfessionalWhereInput = {
      ativo: filters.ativo,
      specialties: filters.specialtyId
        ? {
            some: { specialtyId: filters.specialtyId },
          }
        : undefined,
      OR: filters.search
        ? [
            { nome: { contains: filters.search, mode: 'insensitive' } },
            { email: { contains: filters.search, mode: 'insensitive' } },
          ]
        : undefined,
    };

    const { items, total } = await professionalRepository.list(where, skip, take);
    return paginate(items.map(normalizeProfessional), total, page, limit);
  },

  async getById(id: string) {
    const professional = await professionalRepository.findById(id);
    if (!professional) throw new AppError('Profissional não encontrado', 404);
    return normalizeProfessional(professional);
  },

  async create(data: { nome: string; email: string; telefone: string; specialtyIds: string[] }, actorId: string) {
    const existing = await professionalRepository.findByEmail(data.email);
    if (existing) throw new AppError('E-mail já cadastrado para profissional', 409);

    await ensureSpecialtiesExist(data.specialtyIds);

    const professional = await professionalRepository.create({
      nome: data.nome,
      email: data.email,
      telefone: data.telefone,
      specialties: {
        create: data.specialtyIds.map((specialtyId) => ({
          specialty: { connect: { id: specialtyId } },
        })),
      },
    });

    await auditLogService.register(
      { actorType: ActorType.EMPLOYEE, actorId },
      'PROFESSIONAL_CREATE',
      'Professional',
      professional.id,
      { specialtyIds: data.specialtyIds },
    );

    return normalizeProfessional(professional);
  },

  async update(
    id: string,
    data: { nome?: string; email?: string; telefone?: string; ativo?: boolean; specialtyIds?: string[] },
    actorId: string,
  ) {
    await this.getById(id);

    if (data.email) {
      const existing = await professionalRepository.findByEmail(data.email);
      if (existing && existing.id !== id) throw new AppError('E-mail já cadastrado para profissional', 409);
    }

    if (data.specialtyIds) await ensureSpecialtiesExist(data.specialtyIds);

    const { specialtyIds, ...professionalData } = data;
    const professional = await professionalRepository.update(id, {
      ...professionalData,
      ...(specialtyIds
        ? {
            specialties: {
              deleteMany: {},
              create: specialtyIds.map((specialtyId) => ({
                specialty: { connect: { id: specialtyId } },
              })),
            },
          }
        : {}),
    });

    await auditLogService.register(
      { actorType: ActorType.EMPLOYEE, actorId },
      'PROFESSIONAL_UPDATE',
      'Professional',
      id,
      { fields: Object.keys(data) },
    );

    return normalizeProfessional(professional);
  },

  async remove(id: string, actorId: string) {
    const professional = await professionalRepository.update(id, { ativo: false });

    await auditLogService.register(
      { actorType: ActorType.EMPLOYEE, actorId },
      'PROFESSIONAL_DISABLE',
      'Professional',
      id,
    );

    return normalizeProfessional(professional);
  },
};
