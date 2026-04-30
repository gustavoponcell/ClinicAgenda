import { Request, Response } from 'express';
import { authService } from '../services/auth.service';
import { asyncHandler } from '../utils/asyncHandler';
import { sendCreated, sendSuccess } from '../utils/apiResponse';

export const authController = {
  registerPatient: asyncHandler(async (request: Request, response: Response) => {
    const result = await authService.registerPatient(request.body);
    return sendCreated(response, result, 'Paciente cadastrado com sucesso');
  }),

  loginPatient: asyncHandler(async (request: Request, response: Response) => {
    const result = await authService.loginPatient(request.body.email, request.body.senha);
    return sendSuccess(response, result, 'Login realizado com sucesso');
  }),

  loginAdmin: asyncHandler(async (request: Request, response: Response) => {
    const result = await authService.loginAdmin(request.body.email, request.body.senha);
    return sendSuccess(response, result, 'Login administrativo realizado com sucesso');
  }),

  me: asyncHandler(async (request: Request, response: Response) => {
    const result = await authService.me(request.user);
    return sendSuccess(response, result);
  }),
};
