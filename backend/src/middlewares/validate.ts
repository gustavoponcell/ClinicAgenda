import { NextFunction, Request, Response } from 'express';
import { AnyZodObject, ZodError } from 'zod';
import { AppError } from '../utils/appError';

export function validate(schema: AnyZodObject) {
  return (request: Request, _response: Response, next: NextFunction) => {
    try {
      const parsed = schema.parse({
        body: request.body,
        params: request.params,
        query: request.query,
      });

      request.body = parsed.body ?? request.body;
      request.params = parsed.params ?? request.params;
      request.query = parsed.query ?? request.query;

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        throw new AppError('Dados inválidos', 400, error.errors);
      }

      throw error;
    }
  };
}
