import { patientRepository } from '../repositories/patient.repository';
import { AppError } from '../utils/appError';
import { omitPassword } from '../utils/sanitize';
import { auditLogService } from './auditLog.service';
import { toAuditActorType } from '../types/auth';

export const patientService = {
  async getMe(patientId: string) {
    const patient = await patientRepository.findById(patientId);
    if (!patient) throw new AppError('Paciente não encontrado', 404);
    return omitPassword(patient);
  },

  async updateMe(patientId: string, data: { nome?: string; telefone?: string; email?: string }) {
    if (data.email) {
      const existing = await patientRepository.findByEmail(data.email);
      if (existing && existing.id !== patientId) throw new AppError('E-mail já cadastrado', 409);
    }

    const patient = await patientRepository.update(patientId, data);

    await auditLogService.register(
      { actorType: toAuditActorType('PATIENT'), actorId: patientId },
      'PATIENT_PROFILE_UPDATE',
      'Patient',
      patientId,
      { fields: Object.keys(data) },
    );

    return omitPassword(patient);
  },
};
