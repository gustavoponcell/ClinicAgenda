import { Request, Response } from 'express';

export function notFound(request: Request, response: Response) {
  return response.status(404).json({
    success: false,
    message: `Rota não encontrada: ${request.method} ${request.originalUrl}`,
    errors: [],
  });
}
