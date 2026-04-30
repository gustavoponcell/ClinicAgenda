import { Request, Response } from 'express';
import { availabilityService } from '../services/availability.service';
import { asyncHandler } from '../utils/asyncHandler';
import { sendCreated, sendSuccess } from '../utils/apiResponse';
import { requireUser } from '../utils/requireUser';

export const availabilityController = {
  listByProfessional: asyncHandler(async (request: Request, response: Response) => {
    const result = await availabilityService.listByProfessional(String(request.params.id));
    return sendSuccess(response, result);
  }),

  create: asyncHandler(async (request: Request, response: Response) => {
    const user = requireUser(request);
    const result = await availabilityService.create(String(request.params.id), request.body, user.id);
    return sendCreated(response, result, 'Disponibilidade cadastrada com sucesso');
  }),

  update: asyncHandler(async (request: Request, response: Response) => {
    const user = requireUser(request);
    const result = await availabilityService.update(String(request.params.id), request.body, user.id);
    return sendSuccess(response, result, 'Disponibilidade atualizada com sucesso');
  }),

  remove: asyncHandler(async (request: Request, response: Response) => {
    const user = requireUser(request);
    const result = await availabilityService.remove(String(request.params.id), user.id);
    return sendSuccess(response, result, 'Disponibilidade removida com sucesso');
  }),
};
