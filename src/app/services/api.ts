import { getToken, SessionType } from './authStorage';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3333/api';

export interface ApiList<T> {
  items: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface Patient {
  id: string;
  nome: string;
  email: string;
  cpf: string;
  telefone: string;
}

export interface Employee {
  id: string;
  nome: string;
  email: string;
  cargo: 'ADMIN' | 'RECEPCIONISTA';
  ativo: boolean;
}

export interface Specialty {
  id: string;
  nome: string;
  descricao?: string | null;
}

export interface Professional {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  ativo: boolean;
  specialties?: Specialty[];
}

export interface Availability {
  id: string;
  professionalId: string;
  diaSemana: string;
  horaInicio: string;
  horaFim: string;
  ativo: boolean;
}

export interface Appointment {
  id: string;
  patientId: string;
  professionalId: string;
  specialtyId: string;
  dataHora: string;
  status: 'AGENDADA' | 'CANCELADA' | 'REAGENDADA' | 'REALIZADA';
  observacoes?: string | null;
  patient?: Patient;
  professional?: Professional;
  specialty?: Specialty;
}

export interface ScheduleBlock {
  id: string;
  professionalId: string;
  inicio: string;
  fim: string;
  motivo: string;
  professional?: Professional;
}

interface RequestOptions extends RequestInit {
  auth?: SessionType | 'auto';
}

async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { auth, headers, body, ...rest } = options;
  const token =
    auth === 'auto'
      ? getToken('patient') ?? getToken('admin')
      : auth
      ? getToken(auth)
      : null;

  const response = await fetch(`${API_URL}${path}`, {
    ...rest,
    body: body && typeof body !== 'string' ? JSON.stringify(body) : body,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok || !payload?.success) {
    throw new Error(payload?.message ?? 'Erro ao comunicar com a API');
  }

  return payload.data as T;
}

function queryString(params: Record<string, unknown>) {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      search.set(key, String(value));
    }
  });
  const text = search.toString();
  return text ? `?${text}` : '';
}

export const api = {
  patientRegister: (body: { nome: string; email: string; senha: string; cpf: string; telefone: string }) =>
    apiRequest<{ user: Patient; token: string }>('/auth/patient/register', {
      method: 'POST',
      body: body as any,
    }),

  patientLogin: (body: { email: string; senha: string }) =>
    apiRequest<{ user: Patient; token: string }>('/auth/patient/login', {
      method: 'POST',
      body: body as any,
    }),

  adminLogin: (body: { email: string; senha: string }) =>
    apiRequest<{ user: Employee; token: string }>('/auth/admin/login', {
      method: 'POST',
      body: body as any,
    }),

  me: <T>(auth: SessionType) => apiRequest<T>('/auth/me', { auth }),

  updatePatientMe: (body: Partial<Pick<Patient, 'nome' | 'telefone' | 'email'>>) =>
    apiRequest<Patient>('/patients/me', { method: 'PUT', body: body as any, auth: 'patient' }),

  listSpecialties: () => apiRequest<ApiList<Specialty>>('/specialties?limit=100'),

  listProfessionals: (params: { specialtyId?: string; ativo?: boolean } = {}) =>
    apiRequest<ApiList<Professional>>(`/professionals${queryString({ ...params, limit: 100 })}`),

  listAvailabilities: (professionalId: string) =>
    apiRequest<Availability[]>(`/professionals/${professionalId}/availabilities`),

  listMyAppointments: () => apiRequest<ApiList<Appointment>>('/appointments/me', { auth: 'patient' }),

  createAppointment: (body: { professionalId: string; specialtyId: string; dataHora: string; observacoes?: string }) =>
    apiRequest<Appointment>('/appointments', { method: 'POST', body: body as any, auth: 'patient' }),

  rescheduleAppointment: (id: string, body: { dataHora: string; observacoes?: string }) =>
    apiRequest<Appointment>(`/appointments/${id}/reschedule`, { method: 'PATCH', body: body as any, auth: 'patient' }),

  rescheduleAppointmentAdmin: (id: string, body: { dataHora: string; observacoes?: string }) =>
    apiRequest<Appointment>(`/appointments/${id}/reschedule`, { method: 'PATCH', body: body as any, auth: 'admin' }),

  cancelAppointment: (id: string, motivo?: string) =>
    apiRequest<Appointment>(`/appointments/${id}/cancel`, {
      method: 'PATCH',
      body: { motivo } as any,
      auth: 'patient',
    }),

  cancelAppointmentAdmin: (id: string, motivo?: string) =>
    apiRequest<Appointment>(`/appointments/${id}/cancel`, {
      method: 'PATCH',
      body: { motivo } as any,
      auth: 'admin',
    }),

  completeAppointmentAdmin: (id: string) =>
    apiRequest<Appointment>(`/appointments/${id}/complete`, { method: 'PATCH', auth: 'admin' }),

  adminAppointments: (params: Record<string, unknown> = {}) =>
    apiRequest<ApiList<Appointment>>(`/admin/appointments${queryString({ ...params, limit: 100 })}`, {
      auth: 'admin',
    }),

  reportsDashboard: () => apiRequest<any>('/reports/dashboard', { auth: 'admin' }),
  reportsAppointments: (params: Record<string, unknown> = {}) =>
    apiRequest<ApiList<Appointment>>(`/reports/appointments${queryString({ ...params, limit: 100 })}`, { auth: 'admin' }),
  reportsProfessionals: (params: Record<string, unknown> = {}) =>
    apiRequest<any[]>(`/reports/professionals${queryString(params)}`, { auth: 'admin' }),

  listEmployees: () => apiRequest<ApiList<Employee>>('/employees?limit=100', { auth: 'admin' }),
  createEmployee: (body: { nome: string; email: string; senha: string; cargo: 'ADMIN' | 'RECEPCIONISTA' }) =>
    apiRequest<Employee>('/employees', { method: 'POST', body: body as any, auth: 'admin' }),

  deleteEmployee: (id: string) =>
    apiRequest<Employee>(`/employees/${id}`, { method: 'DELETE', auth: 'admin' }),

  createProfessional: (body: { nome: string; email: string; telefone: string; specialtyIds: string[] }) =>
    apiRequest<Professional>('/professionals', { method: 'POST', body: body as any, auth: 'admin' }),

  deleteProfessional: (id: string) =>
    apiRequest<Professional>(`/professionals/${id}`, { method: 'DELETE', auth: 'admin' }),

  listScheduleBlocks: (professionalId: string) =>
    apiRequest<ScheduleBlock[]>(`/professionals/${professionalId}/blocks`, { auth: 'admin' }),

  createScheduleBlock: (professionalId: string, body: { inicio: string; fim: string; motivo: string }) =>
    apiRequest<ScheduleBlock>(`/professionals/${professionalId}/blocks`, {
      method: 'POST',
      body: body as any,
      auth: 'admin',
    }),

  deleteScheduleBlock: (id: string) =>
    apiRequest<ScheduleBlock>(`/blocks/${id}`, { method: 'DELETE', auth: 'admin' }),

  auditLogs: (params: Record<string, unknown> = {}) =>
    apiRequest<ApiList<any>>(`/audit-logs${queryString({ ...params, limit: 100 })}`, { auth: 'admin' }),
};
