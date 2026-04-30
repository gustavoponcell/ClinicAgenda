import { NextFunction, Request, Response } from 'express';
import { AppError } from '../utils/appError';
import { verifyToken } from '../utils/jwt';

export function authenticate(request: Request, _response: Response, next: NextFunction) {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    throw new AppError('Token não informado', 401);
  }

  const [scheme, token] = authHeader.split(' ');

  if (scheme !== 'Bearer' || !token) {
    throw new AppError('Formato de token inválido', 401);
  }

  try {
    const payload = verifyToken(token);
    request.user = {
      id: payload.sub,
      type: payload.type,
      role: payload.role,
    };
    next();
  } catch {
    throw new AppError('Token inválido ou expirado', 401);
  }
}
