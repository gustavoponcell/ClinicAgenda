import { EmployeeRole } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';
import { AppError } from '../utils/appError';
import { AuthUserType } from '../types/auth';

export function authorizeUserTypes(...types: AuthUserType[]) {
  return (request: Request, _response: Response, next: NextFunction) => {
    if (!request.user || !types.includes(request.user.type)) {
      throw new AppError('Acesso não autorizado', 403);
    }

    next();
  };
}

export function authorizeRoles(...roles: EmployeeRole[]) {
  return (request: Request, _response: Response, next: NextFunction) => {
    if (!request.user || request.user.type !== 'EMPLOYEE' || !request.user.role) {
      throw new AppError('Acesso restrito a funcionários', 403);
    }

    if (!roles.includes(request.user.role)) {
      throw new AppError('Permissão insuficiente', 403);
    }

    next();
  };
}
