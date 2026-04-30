import { Router } from 'express';
import { adminAppointmentRoutes, appointmentRoutes } from './appointment.routes';
import { auditLogRoutes } from './auditLog.routes';
import { authRoutes } from './auth.routes';
import { employeeRoutes } from './employee.routes';
import { availabilityRoutes, professionalRoutes } from './professional.routes';
import { patientRoutes } from './patient.routes';
import { reportRoutes } from './report.routes';
import { scheduleBlockRoutes } from './scheduleBlock.routes';
import { specialtyRoutes } from './specialty.routes';

export const routes = Router();

routes.get('/health', (_request, response) => {
  response.json({
    success: true,
    message: 'ClinicAgenda API online',
    data: {
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    },
  });
});

routes.use('/auth', authRoutes);
routes.use('/patients', patientRoutes);
routes.use('/professionals', professionalRoutes);
routes.use('/specialties', specialtyRoutes);
routes.use('/availabilities', availabilityRoutes);
routes.use('/appointments', appointmentRoutes);
routes.use('/admin/appointments', adminAppointmentRoutes);
routes.use('/employees', employeeRoutes);
routes.use('/blocks', scheduleBlockRoutes);
routes.use('/reports', reportRoutes);
routes.use('/audit-logs', auditLogRoutes);
