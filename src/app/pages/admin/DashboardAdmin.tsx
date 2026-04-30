import { useNavigate } from 'react-router';
import { AdminLayout } from '../../components/AdminLayout';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import {
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  UserPlus,
  UserCog,
  CalendarPlus,
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function DashboardAdmin() {
  const navigate = useNavigate();

  const stats = [
    { label: 'Consultas Hoje', value: '12', icon: Calendar, color: 'bg-[#2E7D9A]' },
    { label: 'Confirmadas', value: '8', icon: CheckCircle, color: 'bg-[#4CAF93]' },
    { label: 'Canceladas', value: '3', icon: XCircle, color: 'bg-[#E57373]' },
    { label: 'Horários Disponíveis', value: '24', icon: Clock, color: 'bg-[#5DADE2]' },
  ];

  const proximasConsultas = [
    {
      paciente: 'Maria Silva',
      profissional: 'Dr. João Santos',
      especialidade: 'Cardiologia',
      horario: '09:00',
      status: 'confirmada',
    },
    {
      paciente: 'José Oliveira',
      profissional: 'Dra. Ana Paula Costa',
      especialidade: 'Cardiologia',
      horario: '10:00',
      status: 'confirmada',
    },
    {
      paciente: 'Ana Costa',
      profissional: 'Dra. Mariana Lima',
      especialidade: 'Dermatologia',
      horario: '11:00',
      status: 'confirmada',
    },
  ];

  const dadosGrafico = [
    { dia: 'Seg', consultas: 15 },
    { dia: 'Ter', consultas: 18 },
    { dia: 'Qua', consultas: 12 },
    { dia: 'Qui', consultas: 20 },
    { dia: 'Sex', consultas: 16 },
    { dia: 'Sáb', consultas: 8 },
  ];

  return (
    <AdminLayout>
      <div className="p-6 bg-gradient-to-br from-[#F5F7FA] to-white min-h-screen">
        <div className="mb-8">
          <h2 className="text-2xl sm:text-3xl mb-2 text-[#2C3E50] font-bold">Dashboard Administrativo</h2>
          <p className="text-[#6C757D]">Visão geral das consultas e operações</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index}>
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-[#6C757D] text-sm">{stat.label}</p>
                    <p className="text-3xl text-[#2C3E50] font-bold">{stat.value}</p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          <Card hover onClick={() => navigate('/admin/agenda')} className="cursor-pointer">
            <div className="flex items-center gap-3 mb-3">
              <CalendarPlus className="w-6 h-6 text-[#2E7D9A]" />
              <h3 className="text-[#2C3E50] font-bold">Novo Agendamento</h3>
            </div>
            <p className="text-[#6C757D] text-sm">Agendar consulta para paciente</p>
          </Card>

          <Card hover onClick={() => navigate('/cadastro')} className="cursor-pointer">
            <div className="flex items-center gap-3 mb-3">
              <UserPlus className="w-6 h-6 text-[#2E7D9A]" />
              <h3 className="text-[#2C3E50] font-bold">Cadastrar Paciente</h3>
            </div>
            <p className="text-[#6C757D] text-sm">Registrar novo paciente</p>
          </Card>

          <Card hover onClick={() => navigate('/admin/profissionais')} className="cursor-pointer">
            <div className="flex items-center gap-3 mb-3">
              <UserCog className="w-6 h-6 text-[#2E7D9A]" />
              <h3 className="text-[#2C3E50] font-bold">Cadastrar Profissional</h3>
            </div>
            <p className="text-[#6C757D] text-sm">Adicionar médico ou especialista</p>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <Card>
            <h3 className="mb-6 text-[#2C3E50] font-bold">Próximas Consultas de Hoje</h3>
            <div className="space-y-4">
              {proximasConsultas.map((consulta, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-[#F5F7FA] rounded-xl"
                >
                  <div className="flex-1">
                    <p className="text-[#2C3E50] mb-1 font-medium">{consulta.paciente}</p>
                    <p className="text-sm text-[#6C757D]">
                      {consulta.profissional} - {consulta.especialidade}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[#2E7D9A] font-bold">{consulta.horario}</p>
                    <span className="inline-block mt-1 px-2 py-1 bg-[#E8F5F1] text-[#4CAF93] text-xs rounded-full font-medium">
                      Confirmada
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <Button
              variant="outline"
              className="w-full mt-6"
              onClick={() => navigate('/admin/agenda')}
            >
              Ver Agenda Completa
            </Button>
          </Card>

          <Card>
            <h3 className="mb-6 text-[#2C3E50] font-bold">Consultas por Dia (Esta Semana)</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={dadosGrafico}>
                <CartesianGrid strokeDasharray="3 3" stroke="#DDE2E8" />
                <XAxis dataKey="dia" stroke="#6C757D" />
                <YAxis stroke="#6C757D" />
                <Tooltip />
                <Bar dataKey="consultas" fill="#2E7D9A" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
