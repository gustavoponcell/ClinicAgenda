import { Request } from 'express';
import { RequestUser } from '../types/auth';
import { AppError } from './appError';

export function requireUser(request: Request): RequestUser {
  if (!request.user) throw new AppError('Usuário não autenticado', 401);
  return request.user;
}
