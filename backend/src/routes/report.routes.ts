import { EmployeeRole } from '@prisma/client';
import { Router } from 'express';
import { reportController } from '../controllers/report.controller';
import { authenticate } from '../middlewares/authenticate';
import { authorizeRoles } from '../middlewares/authorize';
import { validate } from '../middlewares/validate';
import { reportFilterSchema } from '../schemas/report.schema';

export const reportRoutes = Router();

reportRoutes.use(authenticate, authorizeRoles(EmployeeRole.ADMIN));
reportRoutes.get('/dashboard', reportController.dashboard);
reportRoutes.get('/appointments', validate(reportFilterSchema), reportController.appointments);
reportRoutes.get('/professionals', validate(reportFilterSchema), reportController.professionals);
