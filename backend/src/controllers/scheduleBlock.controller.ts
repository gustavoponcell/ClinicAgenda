import { Request, Response } from 'express';
import { scheduleBlockService } from '../services/scheduleBlock.service';
import { asyncHandler } from '../utils/asyncHandler';
import { sendCreated, sendSuccess } from '../utils/apiResponse';
import { requireUser } from '../utils/requireUser';

export const scheduleBlockController = {
  listByProfessional: asyncHandler(async (request: Request, response: Response) => {
    const result = await scheduleBlockService.listByProfessional(String(request.params.id));
    return sendSuccess(response, result);
  }),

  create: asyncHandler(async (request: Request, response: Response) => {
    const user = requireUser(request);
    const result = await scheduleBlockService.create(String(request.params.id), request.body, user.id);
    return sendCreated(response, result, 'Bloqueio de agenda criado com sucesso');
  }),

  remove: asyncHandler(async (request: Request, response: Response) => {
    const user = requireUser(request);
    const result = await scheduleBlockService.remove(String(request.params.id), user.id);
    return sendSuccess(response, result, 'Bloqueio removido com sucesso');
  }),
};
