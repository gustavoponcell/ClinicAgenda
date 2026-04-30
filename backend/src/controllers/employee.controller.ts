import { Request, Response } from 'express';
import { employeeService } from '../services/employee.service';
import { asyncHandler } from '../utils/asyncHandler';
import { sendCreated, sendSuccess } from '../utils/apiResponse';
import { requireUser } from '../utils/requireUser';

export const employeeController = {
  list: asyncHandler(async (request: Request, response: Response) => {
    const result = await employeeService.list(request.query);
    return sendSuccess(response, result);
  }),

  create: asyncHandler(async (request: Request, response: Response) => {
    const user = requireUser(request);
    const result = await employeeService.create(request.body, user.id);
    return sendCreated(response, result, 'Funcionário cadastrado com sucesso');
  }),

  update: asyncHandler(async (request: Request, response: Response) => {
    const user = requireUser(request);
    const result = await employeeService.update(String(request.params.id), request.body, user.id);
    return sendSuccess(response, result, 'Funcionário atualizado com sucesso');
  }),

  remove: asyncHandler(async (request: Request, response: Response) => {
    const user = requireUser(request);
    const result = await employeeService.remove(String(request.params.id), user.id);
    return sendSuccess(response, result, 'Funcionário desativado com sucesso');
  }),
};
