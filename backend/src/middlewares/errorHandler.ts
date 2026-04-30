import { NextFunction, Request, Response } from 'express';
import { Prisma } from '@prisma/client';
import { AppError } from '../utils/appError';
import { env } from '../config/env';

export function errorHandler(error: Error, _request: Request, response: Response, _next: NextFunction) {
  if (error instanceof AppError) {
    return response.status(error.statusCode).json({
      success: false,
      message: error.message,
      errors: error.errors ?? [],
    });
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2002') {
      return response.status(409).json({
        success: false,
        message: 'Registro duplicado para campo único',
        errors: [{ target: error.meta?.target }],
      });
    }

    if (error.code === 'P2025') {
      return response.status(404).json({
        success: false,
        message: 'Registro não encontrado',
        errors: [],
      });
    }
  }

  console.error(error);

  return response.status(500).json({
    success: false,
    message: 'Erro interno do servidor',
    errors: env.NODE_ENV === 'development' ? [{ message: error.message, stack: error.stack }] : [],
  });
}
