import { ActorType, EmployeeRole, Prisma } from '@prisma/client';
import { employeeRepository } from '../repositories/employee.repository';
import { AppError } from '../utils/appError';
import { hashPassword } from '../utils/password';
import { getPagination, paginate } from '../utils/pagination';
import { omitPassword, omitPasswordFromList } from '../utils/sanitize';
import { auditLogService } from './auditLog.service';

export const employeeService = {
  async list(filters: { page?: number; limit?: number; cargo?: EmployeeRole; ativo?: boolean; search?: string }) {
    const { page, limit, skip, take } = getPagination(filters);
    const where: Prisma.EmployeeWhereInput = {
      cargo: filters.cargo,
      ativo: filters.ativo,
      OR: filters.search
        ? [
            { nome: { contains: filters.search, mode: 'insensitive' } },
            { email: { contains: filters.search, mode: 'insensitive' } },
          ]
        : undefined,
    };

    const { items, total } = await employeeRepository.list(where, skip, take);
    return paginate(omitPasswordFromList(items), total, page, limit);
  },

  async create(data: { nome: string; email: string; senha: string; cargo: EmployeeRole }, actorId: string) {
    const existing = await employeeRepository.findByEmail(data.email);
    if (existing) throw new AppError('E-mail já cadastrado para funcionário', 409);

    const employee = await employeeRepository.create({
      nome: data.nome,
      email: data.email,
      senhaHash: await hashPassword(data.senha),
      cargo: data.cargo,
    });

    await auditLogService.register(
      { actorType: ActorType.EMPLOYEE, actorId },
      'EMPLOYEE_CREATE',
      'Employee',
      employee.id,
      { cargo: data.cargo },
    );

    return omitPassword(employee);
  },

  async update(
    id: string,
    data: { nome?: string; email?: string; senha?: string; cargo?: EmployeeRole; ativo?: boolean },
    actorId: string,
  ) {
    const current = await employeeRepository.findById(id);
    if (!current) throw new AppError('Funcionário não encontrado', 404);

    if (data.email) {
      const existing = await employeeRepository.findByEmail(data.email);
      if (existing && existing.id !== id) throw new AppError('E-mail já cadastrado para funcionário', 409);
    }

    const { senha, ...rest } = data;
    const employee = await employeeRepository.update(id, {
      ...rest,
      ...(senha ? { senhaHash: await hashPassword(senha) } : {}),
    });

    await auditLogService.register(
      { actorType: ActorType.EMPLOYEE, actorId },
      'EMPLOYEE_UPDATE',
      'Employee',
      id,
      { fields: Object.keys(data) },
    );

    return omitPassword(employee);
  },

  async remove(id: string, actorId: string) {
    const employee = await employeeRepository.update(id, { ativo: false });

    await auditLogService.register(
      { actorType: ActorType.EMPLOYEE, actorId },
      'EMPLOYEE_DISABLE',
      'Employee',
      id,
    );

    return omitPassword(employee);
  },
};
