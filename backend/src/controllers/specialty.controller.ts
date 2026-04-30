import { Request, Response } from 'express';
import { specialtyService } from '../services/specialty.service';
import { asyncHandler } from '../utils/asyncHandler';
import { sendCreated, sendSuccess } from '../utils/apiResponse';
import { requireUser } from '../utils/requireUser';

export const specialtyController = {
  list: asyncHandler(async (request: Request, response: Response) => {
    const result = await specialtyService.list(request.query);
    return sendSuccess(response, result);
  }),

  create: asyncHandler(async (request: Request, response: Response) => {
    const user = requireUser(request);
    const result = await specialtyService.create(request.body, user.id);
    return sendCreated(response, result, 'Especialidade cadastrada com sucesso');
  }),

  update: asyncHandler(async (request: Request, response: Response) => {
    const user = requireUser(request);
    const result = await specialtyService.update(String(request.params.id), request.body, user.id);
    return sendSuccess(response, result, 'Especialidade atualizada com sucesso');
  }),

  remove: asyncHandler(async (request: Request, response: Response) => {
    const user = requireUser(request);
    const result = await specialtyService.remove(String(request.params.id), user.id);
    return sendSuccess(response, result, 'Especialidade removida com sucesso');
  }),
};
