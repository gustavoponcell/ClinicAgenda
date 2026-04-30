import { Request, Response } from 'express';
import { professionalService } from '../services/professional.service';
import { asyncHandler } from '../utils/asyncHandler';
import { sendCreated, sendSuccess } from '../utils/apiResponse';
import { requireUser } from '../utils/requireUser';

export const professionalController = {
  list: asyncHandler(async (request: Request, response: Response) => {
    const result = await professionalService.list(request.query);
    return sendSuccess(response, result);
  }),

  getById: asyncHandler(async (request: Request, response: Response) => {
    const result = await professionalService.getById(String(request.params.id));
    return sendSuccess(response, result);
  }),

  create: asyncHandler(async (request: Request, response: Response) => {
    const user = requireUser(request);
    const result = await professionalService.create(request.body, user.id);
    return sendCreated(response, result, 'Profissional cadastrado com sucesso');
  }),

  update: asyncHandler(async (request: Request, response: Response) => {
    const user = requireUser(request);
    const result = await professionalService.update(String(request.params.id), request.body, user.id);
    return sendSuccess(response, result, 'Profissional atualizado com sucesso');
  }),

  remove: asyncHandler(async (request: Request, response: Response) => {
    const user = requireUser(request);
    const result = await professionalService.remove(String(request.params.id), user.id);
    return sendSuccess(response, result, 'Profissional desativado com sucesso');
  }),
};
