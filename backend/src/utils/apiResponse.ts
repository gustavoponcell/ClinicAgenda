import { Response } from 'express';

export function sendSuccess<T>(
  response: Response,
  data?: T,
  message = 'Operação realizada com sucesso',
  statusCode = 200,
) {
  return response.status(statusCode).json({
    success: true,
    message,
    data,
  });
}

export function sendCreated<T>(response: Response, data?: T, message = 'Registro criado com sucesso') {
  return sendSuccess(response, data, message, 201);
}
