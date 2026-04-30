import { Request, Response } from 'express';
import { patientService } from '../services/patient.service';
import { asyncHandler } from '../utils/asyncHandler';
import { sendSuccess } from '../utils/apiResponse';
import { requireUser } from '../utils/requireUser';

export const patientController = {
  me: asyncHandler(async (request: Request, response: Response) => {
    const user = requireUser(request);
    const result = await patientService.getMe(user.id);
    return sendSuccess(response, result);
  }),

  updateMe: asyncHandler(async (request: Request, response: Response) => {
    const user = requireUser(request);
    const result = await patientService.updateMe(user.id, request.body);
    return sendSuccess(response, result, 'Perfil atualizado com sucesso');
  }),
};
