import { EmployeeRole } from '@prisma/client';
import { Router } from 'express';
import { employeeController } from '../controllers/employee.controller';
import { authenticate } from '../middlewares/authenticate';
import { authorizeRoles } from '../middlewares/authorize';
import { validate } from '../middlewares/validate';
import { idParamSchema } from '../schemas/common.schema';
import { createEmployeeSchema, employeeListSchema, updateEmployeeSchema } from '../schemas/employee.schema';

export const employeeRoutes = Router();

employeeRoutes.use(authenticate, authorizeRoles(EmployeeRole.ADMIN));
employeeRoutes.get('/', validate(employeeListSchema), employeeController.list);
employeeRoutes.post('/', validate(createEmployeeSchema), employeeController.create);
employeeRoutes.put('/:id', validate(updateEmployeeSchema), employeeController.update);
employeeRoutes.delete('/:id', validate(idParamSchema), employeeController.remove);
