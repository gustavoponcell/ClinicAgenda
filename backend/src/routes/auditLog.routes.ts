import { EmployeeRole } from '@prisma/client';
import { Router } from 'express';
import { auditLogController } from '../controllers/auditLog.controller';
import { authenticate } from '../middlewares/authenticate';
import { authorizeRoles } from '../middlewares/authorize';
import { validate } from '../middlewares/validate';
import { auditLogListSchema } from '../schemas/audit.schema';

export const auditLogRoutes = Router();

auditLogRoutes.use(authenticate, authorizeRoles(EmployeeRole.ADMIN));
auditLogRoutes.get('/', validate(auditLogListSchema), auditLogController.list);
