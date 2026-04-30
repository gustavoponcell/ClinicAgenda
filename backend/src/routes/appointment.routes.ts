import { EmployeeRole } from '@prisma/client';
import { Router } from 'express';
import { appointmentController } from '../controllers/appointment.controller';
import { authenticate } from '../middlewares/authenticate';
import { authorizeRoles, authorizeUserTypes } from '../middlewares/authorize';
import { validate } from '../middlewares/validate';
import {
  adminAppointmentListSchema,
  appointmentIdParamSchema,
  cancelAppointmentSchema,
  createAppointmentSchema,
  rescheduleAppointmentSchema,
} from '../schemas/appointment.schema';

export const appointmentRoutes = Router();

appointmentRoutes.get('/me', authenticate, authorizeUserTypes('PATIENT'), appointmentController.listMine);
appointmentRoutes.post('/', authenticate, validate(createAppointmentSchema), appointmentController.create);
appointmentRoutes.patch('/:id/reschedule', authenticate, validate(rescheduleAppointmentSchema), appointmentController.reschedule);
appointmentRoutes.patch('/:id/cancel', authenticate, validate(cancelAppointmentSchema), appointmentController.cancel);
appointmentRoutes.patch(
  '/:id/complete',
  authenticate,
  authorizeUserTypes('EMPLOYEE'),
  validate(appointmentIdParamSchema),
  appointmentController.complete,
);

export const adminAppointmentRoutes = Router();

adminAppointmentRoutes.use(authenticate, authorizeUserTypes('EMPLOYEE'));
adminAppointmentRoutes.get('/', validate(adminAppointmentListSchema), appointmentController.listAdmin);
adminAppointmentRoutes.get('/:id', validate(appointmentIdParamSchema), appointmentController.getAdminById);
adminAppointmentRoutes.patch(
  '/:id/complete',
  authorizeRoles(EmployeeRole.ADMIN, EmployeeRole.RECEPCIONISTA),
  validate(appointmentIdParamSchema),
  appointmentController.complete,
);
