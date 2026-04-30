import { useEffect, useMemo, useState } from 'react';
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
import { api, Appointment } from '../../services/api';
import { formatDateTime } from '../../utils/format';

interface DashboardReport {
  consultasHoje: number;
  consultasAtivas: number;
  consultasCanceladas: number;
  profissionaisAtivos: number;
  pacientesCadastrados: number;
}

export default function DashboardAdmin() {
  const navigate = useNavigate();
  const [report, setReport] = useState<DashboardReport | null>(null);
  const [consultas, setConsultas] = useState<Appointment[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadDashboard() {
      try {
        const [dashboardResponse, appointmentsResponse] = await Promise.all([
          api.reportsDashboard(),
          api.adminAppointments({ limit: 6 }),
        ]);
        setReport(dashboardResponse);
        setConsultas(appointmentsResponse.items);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar dashboard');
      }
    }

    loadDashboard();
  }, []);

  const stats = [
    { label: 'Consultas Hoje', value: report?.consultasHoje ?? 0, icon: Calendar, color: 'bg-[#2E7D9A]' },
    { label: 'Ativas', value: report?.consultasAtivas ?? 0, icon: CheckCircle, color: 'bg-[#4CAF93]' },
    { label: 'Canceladas', value: report?.consultasCanceladas ?? 0, icon: XCircle, color: 'bg-[#E57373]' },
    { label: 'Profissionais Ativos', value: report?.profissionaisAtivos ?? 0, icon: Clock, color: 'bg-[#5DADE2]' },
  ];

  const dadosGrafico = useMemo(() => {
    const dias = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    return dias.map((dia, index) => ({
      dia,
      consultas: consultas.filter((consulta) => new Date(consulta.dataHora).getDay() === index).length,
    }));
  }, [consultas]);

  return (
    <AdminLayout>
      <div className="p-6 bg-gradient-to-br from-[#F5F7FA] to-white min-h-screen">
        <div className="mb-8">
          <h2 className="text-2xl sm:text-3xl mb-2 text-[#2C3E50] font-bold">Dashboard Administrativo</h2>
          <p className="text-[#6C757D]">Visão geral das consultas e operações</p>
        </div>

        {error && (
          <div className="mb-6 rounded-2xl border border-[#E57373]/30 bg-[#FFEBEE] px-4 py-3 text-[#E57373]">
            {error}
          </div>
        )}

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
              <h3 className="text-[#2C3E50] font-bold">Gerenciar Agenda</h3>
            </div>
            <p className="text-[#6C757D] text-sm">Visualizar e atualizar consultas</p>
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
            <h3 className="mb-6 text-[#2C3E50] font-bold">Próximas Consultas</h3>
            <div className="space-y-4">
              {consultas.slice(0, 4).map((consulta) => {
                const formatted = formatDateTime(consulta.dataHora);
                return (
                  <div key={consulta.id} className="flex items-center justify-between p-4 bg-[#F5F7FA] rounded-xl">
                    <div className="flex-1">
                      <p className="text-[#2C3E50] mb-1 font-medium">{consulta.patient?.nome}</p>
                      <p className="text-sm text-[#6C757D]">
                        {consulta.professional?.nome} - {consulta.specialty?.nome}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[#2E7D9A] font-bold">{formatted.horario}</p>
                      <p className="text-xs text-[#6C757D]">{formatted.data}</p>
                    </div>
                  </div>
                );
              })}
              {consultas.length === 0 && <p className="text-center text-[#6C757D] py-8">Nenhuma consulta encontrada.</p>}
            </div>
            <Button variant="outline" className="w-full mt-6" onClick={() => navigate('/admin/agenda')}>
              Ver Agenda Completa
            </Button>
          </Card>

          <Card>
            <h3 className="mb-6 text-[#2C3E50] font-bold">Consultas por Dia</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={dadosGrafico}>
                <CartesianGrid strokeDasharray="3 3" stroke="#DDE2E8" />
                <XAxis dataKey="dia" stroke="#6C757D" />
                <YAxis stroke="#6C757D" allowDecimals={false} />
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
