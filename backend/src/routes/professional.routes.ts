import { EmployeeRole } from '@prisma/client';
import { Router } from 'express';
import { availabilityController } from '../controllers/availability.controller';
import { professionalController } from '../controllers/professional.controller';
import { scheduleBlockController } from '../controllers/scheduleBlock.controller';
import { authenticate } from '../middlewares/authenticate';
import { authorizeRoles, authorizeUserTypes } from '../middlewares/authorize';
import { validate } from '../middlewares/validate';
import {
  createProfessionalSchema,
  professionalListSchema,
  updateProfessionalSchema,
} from '../schemas/professional.schema';
import {
  createAvailabilitySchema,
  professionalIdParamSchema,
  updateAvailabilitySchema,
} from '../schemas/availability.schema';
import { createScheduleBlockSchema } from '../schemas/scheduleBlock.schema';
import { idParamSchema } from '../schemas/common.schema';

export const professionalRoutes = Router();

professionalRoutes.get('/', validate(professionalListSchema), professionalController.list);
professionalRoutes.get('/:id', validate(idParamSchema), professionalController.getById);

professionalRoutes.post(
  '/',
  authenticate,
  authorizeRoles(EmployeeRole.ADMIN),
  validate(createProfessionalSchema),
  professionalController.create,
);

professionalRoutes.put(
  '/:id',
  authenticate,
  authorizeRoles(EmployeeRole.ADMIN),
  validate(updateProfessionalSchema),
  professionalController.update,
);

professionalRoutes.delete(
  '/:id',
  authenticate,
  authorizeRoles(EmployeeRole.ADMIN),
  validate(idParamSchema),
  professionalController.remove,
);

professionalRoutes.get(
  '/:id/availabilities',
  validate(professionalIdParamSchema),
  availabilityController.listByProfessional,
);

professionalRoutes.post(
  '/:id/availabilities',
  authenticate,
  authorizeRoles(EmployeeRole.ADMIN),
  validate(createAvailabilitySchema),
  availabilityController.create,
);

professionalRoutes.get(
  '/:id/blocks',
  authenticate,
  authorizeUserTypes('EMPLOYEE'),
  validate(professionalIdParamSchema),
  scheduleBlockController.listByProfessional,
);

professionalRoutes.post(
  '/:id/blocks',
  authenticate,
  authorizeRoles(EmployeeRole.ADMIN),
  validate(createScheduleBlockSchema),
  scheduleBlockController.create,
);

export const availabilityRoutes = Router();

availabilityRoutes.put(
  '/:id',
  authenticate,
  authorizeRoles(EmployeeRole.ADMIN),
  validate(updateAvailabilitySchema),
  availabilityController.update,
);

availabilityRoutes.delete(
  '/:id',
  authenticate,
  authorizeRoles(EmployeeRole.ADMIN),
  validate(idParamSchema),
  availabilityController.remove,
);
