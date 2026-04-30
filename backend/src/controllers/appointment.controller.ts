import { Request, Response } from 'express';
import { appointmentService } from '../services/appointment.service';
import { asyncHandler } from '../utils/asyncHandler';
import { sendCreated, sendSuccess } from '../utils/apiResponse';
import { requireUser } from '../utils/requireUser';

export const appointmentController = {
  listMine: asyncHandler(async (request: Request, response: Response) => {
    const user = requireUser(request);
    const result = await appointmentService.listMine(user.id);
    return sendSuccess(response, result);
  }),

  create: asyncHandler(async (request: Request, response: Response) => {
    const user = requireUser(request);
    const result = await appointmentService.create(user, request.body);
    return sendCreated(response, result, 'Consulta agendada com sucesso');
  }),

  reschedule: asyncHandler(async (request: Request, response: Response) => {
    const user = requireUser(request);
    const result = await appointmentService.reschedule(user, String(request.params.id), request.body);
    return sendSuccess(response, result, 'Consulta reagendada com sucesso');
  }),

  cancel: asyncHandler(async (request: Request, response: Response) => {
    const user = requireUser(request);
    const result = await appointmentService.cancel(user, String(request.params.id), request.body?.motivo);
    return sendSuccess(response, result, 'Consulta cancelada com sucesso');
  }),

  complete: asyncHandler(async (request: Request, response: Response) => {
    const user = requireUser(request);
    const result = await appointmentService.complete(user, String(request.params.id));
    return sendSuccess(response, result, 'Consulta marcada como realizada');
  }),

  listAdmin: asyncHandler(async (request: Request, response: Response) => {
    const result = await appointmentService.listAdmin(request.query);
    return sendSuccess(response, result);
  }),

  getAdminById: asyncHandler(async (request: Request, response: Response) => {
    const result = await appointmentService.getAdminById(String(request.params.id));
    return sendSuccess(response, result);
  }),
};
