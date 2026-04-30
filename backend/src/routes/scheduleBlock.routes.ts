import { EmployeeRole } from '@prisma/client';
import { Router } from 'express';
import { scheduleBlockController } from '../controllers/scheduleBlock.controller';
import { authenticate } from '../middlewares/authenticate';
import { authorizeRoles } from '../middlewares/authorize';
import { validate } from '../middlewares/validate';
import { blockIdParamSchema } from '../schemas/scheduleBlock.schema';

export const scheduleBlockRoutes = Router();

scheduleBlockRoutes.delete(
  '/:id',
  authenticate,
  authorizeRoles(EmployeeRole.ADMIN),
  validate(blockIdParamSchema),
  scheduleBlockController.remove,
);
