import { Router } from 'express';
import { authController } from '../controllers/auth.controller';
import { authenticate } from '../middlewares/authenticate';
import { validate } from '../middlewares/validate';
import { loginSchema, patientRegisterSchema } from '../schemas/auth.schema';

export const authRoutes = Router();

authRoutes.post('/patient/register', validate(patientRegisterSchema), authController.registerPatient);
authRoutes.post('/patient/login', validate(loginSchema), authController.loginPatient);
authRoutes.post('/admin/login', validate(loginSchema), authController.loginAdmin);
authRoutes.get('/me', authenticate, authController.me);
