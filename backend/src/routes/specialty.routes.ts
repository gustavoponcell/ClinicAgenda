import { EmployeeRole } from '@prisma/client';
import { Router } from 'express';
import { specialtyController } from '../controllers/specialty.controller';
import { authenticate } from '../middlewares/authenticate';
import { authorizeRoles } from '../middlewares/authorize';
import { validate } from '../middlewares/validate';
import { idParamSchema } from '../schemas/common.schema';
import { createSpecialtySchema, specialtyListSchema, updateSpecialtySchema } from '../schemas/specialty.schema';

export const specialtyRoutes = Router();

specialtyRoutes.get('/', validate(specialtyListSchema), specialtyController.list);
specialtyRoutes.post('/', authenticate, authorizeRoles(EmployeeRole.ADMIN), validate(createSpecialtySchema), specialtyController.create);
specialtyRoutes.put('/:id', authenticate, authorizeRoles(EmployeeRole.ADMIN), validate(updateSpecialtySchema), specialtyController.update);
specialtyRoutes.delete('/:id', authenticate, authorizeRoles(EmployeeRole.ADMIN), validate(idParamSchema), specialtyController.remove);
