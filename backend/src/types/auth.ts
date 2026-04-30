import { ActorType, EmployeeRole } from '@prisma/client';

export type AuthUserType = 'PATIENT' | 'EMPLOYEE';

export interface AuthTokenPayload {
  sub: string;
  type: AuthUserType;
  role?: EmployeeRole;
}

export interface RequestUser {
  id: string;
  type: AuthUserType;
  role?: EmployeeRole;
}

export function toAuditActorType(type: AuthUserType): ActorType {
  return type === 'PATIENT' ? ActorType.PATIENT : ActorType.EMPLOYEE;
}
