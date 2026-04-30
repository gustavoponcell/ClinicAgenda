import { ActorType } from '@prisma/client';
import { employeeRepository } from '../repositories/employee.repository';
import { patientRepository } from '../repositories/patient.repository';
import { AppError } from '../utils/appError';
import { comparePassword, hashPassword } from '../utils/password';
import { signToken } from '../utils/jwt';
import { omitPassword } from '../utils/sanitize';
import { auditLogService } from './auditLog.service';

export const authService = {
  async registerPatient(data: {
    nome: string;
    email: string;
    senha: string;
    cpf: string;
    telefone: string;
  }) {
    const existingEmail = await patientRepository.findByEmail(data.email);
    if (existingEmail) throw new AppError('E-mail já cadastrado', 409);

    const existingCpf = await patientRepository.findByCpf(data.cpf);
    if (existingCpf) throw new AppError('CPF já cadastrado', 409);

    const patient = await patientRepository.create({
      nome: data.nome,
      email: data.email,
      cpf: data.cpf,
      telefone: data.telefone,
      senhaHash: await hashPassword(data.senha),
    });

    await auditLogService.register(
      { actorType: ActorType.PATIENT, actorId: patient.id },
      'PATIENT_REGISTER',
      'Patient',
      patient.id,
    );

    return {
      user: omitPassword(patient),
      token: signToken({ sub: patient.id, type: 'PATIENT' }),
    };
  },

  async loginPatient(email: string, senha: string) {
    const patient = await patientRepository.findByEmail(email);
    if (!patient || !(await comparePassword(senha, patient.senhaHash))) {
      throw new AppError('Credenciais inválidas', 401);
    }

    return {
      user: omitPassword(patient),
      token: signToken({ sub: patient.id, type: 'PATIENT' }),
    };
  },

  async loginAdmin(email: string, senha: string) {
    const employee = await employeeRepository.findByEmail(email);
    if (!employee || !employee.ativo || !(await comparePassword(senha, employee.senhaHash))) {
      throw new AppError('Credenciais inválidas', 401);
    }

    return {
      user: omitPassword(employee),
      token: signToken({ sub: employee.id, type: 'EMPLOYEE', role: employee.cargo }),
    };
  },

  async me(user: Express.Request['user']) {
    if (!user) throw new AppError('Usuário não autenticado', 401);

    if (user.type === 'PATIENT') {
      const patient = await patientRepository.findById(user.id);
      if (!patient) throw new AppError('Paciente não encontrado', 404);
      return omitPassword(patient);
    }

    const employee = await employeeRepository.findById(user.id);
    if (!employee || !employee.ativo) throw new AppError('Funcionário não encontrado', 404);
    return omitPassword(employee);
  },
};
