export type ConsultaStatus = 'agendada' | 'confirmada' | 'cancelada' | 'reagendada' | 'realizada';

export interface ConsultaPaciente {
  id: number;
  especialidade: string;
  profissional: string;
  data: string;
  horario: string;
  status: ConsultaStatus;
}

export interface ConsultaAdmin extends ConsultaPaciente {
  paciente: string;
}

export interface Profissional {
  id: number;
  nome: string;
  especialidade: string;
  registro: string;
  telefone: string;
  email: string;
}

export const especialidades = [
  'Cardiologia',
  'Dermatologia',
  'Ginecologia',
  'Ortopedia',
  'Pediatria',
  'Psiquiatria',
];

export const profissionaisPorEspecialidade: Record<string, string[]> = {
  Cardiologia: ['Dr. João Santos', 'Dra. Ana Paula Costa'],
  Dermatologia: ['Dra. Mariana Lima', 'Dr. Carlos Eduardo'],
  Ginecologia: ['Dra. Fernanda Souza', 'Dra. Juliana Martins'],
  Ortopedia: ['Dr. Pedro Oliveira', 'Dr. Rafael Almeida'],
  Pediatria: ['Dra. Camila Rocha', 'Dr. Lucas Ferreira'],
  Psiquiatria: ['Dra. Beatriz Mendes', 'Dr. Gustavo Silva'],
};

export const horariosAtendimento = [
  '08:00',
  '09:00',
  '10:00',
  '11:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
];

export const horariosOcupadosAgendamento = ['09:00', '14:00'];
export const horariosOcupadosReagendamento = ['10:00', '15:00'];

export const profissionaisMock: Profissional[] = [
  {
    id: 1,
    nome: 'Dr. João Santos',
    especialidade: 'Cardiologia',
    registro: 'CRM 12345',
    telefone: '(11) 98765-4321',
    email: 'joao.santos@clinica.com',
  },
  {
    id: 2,
    nome: 'Dra. Ana Paula Costa',
    especialidade: 'Cardiologia',
    registro: 'CRM 23456',
    telefone: '(11) 98765-4322',
    email: 'ana.costa@clinica.com',
  },
  {
    id: 3,
    nome: 'Dra. Mariana Lima',
    especialidade: 'Dermatologia',
    registro: 'CRM 34567',
    telefone: '(11) 98765-4323',
    email: 'mariana.lima@clinica.com',
  },
  {
    id: 4,
    nome: 'Dr. Carlos Eduardo',
    especialidade: 'Dermatologia',
    registro: 'CRM 45678',
    telefone: '(11) 98765-4324',
    email: 'carlos.eduardo@clinica.com',
  },
];

export const consultasAdminMock: ConsultaAdmin[] = [
  {
    id: 1,
    paciente: 'Maria Silva',
    profissional: 'Dr. João Santos',
    especialidade: 'Cardiologia',
    data: '22/04/2026',
    horario: '09:00',
    status: 'confirmada',
  },
  {
    id: 2,
    paciente: 'José Oliveira',
    profissional: 'Dr. João Santos',
    especialidade: 'Cardiologia',
    data: '22/04/2026',
    horario: '10:00',
    status: 'confirmada',
  },
  {
    id: 3,
    paciente: 'Ana Costa',
    profissional: 'Dra. Mariana Lima',
    especialidade: 'Dermatologia',
    data: '22/04/2026',
    horario: '11:00',
    status: 'reagendada',
  },
  {
    id: 4,
    paciente: 'Pedro Santos',
    profissional: 'Dra. Ana Paula Costa',
    especialidade: 'Cardiologia',
    data: '22/04/2026',
    horario: '14:00',
    status: 'cancelada',
  },
  {
    id: 5,
    paciente: 'Carla Mendes',
    profissional: 'Dra. Mariana Lima',
    especialidade: 'Dermatologia',
    data: '22/04/2026',
    horario: '15:00',
    status: 'confirmada',
  },
];

export const nomesProfissionais = profissionaisMock.map((profissional) => profissional.nome);

export function getStatusLabel(status: ConsultaStatus) {
  const labels: Record<ConsultaStatus, string> = {
    agendada: 'Agendada',
    confirmada: 'Confirmada',
    cancelada: 'Cancelada',
    reagendada: 'Reagendada',
    realizada: 'Realizada',
  };

  return labels[status] ?? status;
}

export function getStatusClassName(status: ConsultaStatus) {
  const classes: Record<ConsultaStatus, string> = {
    agendada: 'bg-[#E8F5F1] border-[#4CAF93] text-[#4CAF93]',
    confirmada: 'bg-[#E8F5F1] border-[#4CAF93] text-[#4CAF93]',
    cancelada: 'bg-[#FFEBEE] border-[#E57373] text-[#E57373]',
    reagendada: 'bg-[#FFF3E0] border-[#FFA726] text-[#C77700]',
    realizada: 'bg-[#E3F2F7] border-[#2E7D9A] text-[#2E7D9A]',
  };

  return classes[status] ?? 'bg-[#F5F7FA] border-[#DDE2E8] text-[#6C757D]';
}
