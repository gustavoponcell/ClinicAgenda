import jwt, { SignOptions } from 'jsonwebtoken';
import { env } from '../config/env';
import { AuthTokenPayload } from '../types/auth';

export function signToken(payload: AuthTokenPayload) {
  const options: SignOptions = {
    expiresIn: env.JWT_EXPIRES_IN,
  };

  return jwt.sign(payload, env.JWT_SECRET, options);
}

export function verifyToken(token: string) {
  return jwt.verify(token, env.JWT_SECRET) as AuthTokenPayload;
}
