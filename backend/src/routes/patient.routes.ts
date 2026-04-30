import { Router } from 'express';
import { patientController } from '../controllers/patient.controller';
import { authenticate } from '../middlewares/authenticate';
import { authorizeUserTypes } from '../middlewares/authorize';
import { validate } from '../middlewares/validate';
import { updatePatientSchema } from '../schemas/patient.schema';

export const patientRoutes = Router();

patientRoutes.use(authenticate, authorizeUserTypes('PATIENT'));
patientRoutes.get('/me', patientController.me);
patientRoutes.put('/me', validate(updatePatientSchema), patientController.updateMe);
