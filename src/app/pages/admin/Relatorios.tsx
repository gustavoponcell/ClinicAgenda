import { useEffect, useMemo, useState } from 'react';
import { AdminLayout } from '../../components/AdminLayout';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { BarChart3, Download, FileText, TrendingUp, Users, Calendar } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { api, Appointment, Professional } from '../../services/api';

interface DashboardReport {
  consultasHoje: number;
  consultasAtivas: number;
  consultasCanceladas: number;
  profissionaisAtivos: number;
  pacientesCadastrados: number;
}

export default function Relatorios() {
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [profissionalFiltro, setProfissionalFiltro] = useState('todos');
  const [dashboard, setDashboard] = useState<DashboardReport | null>(null);
  const [consultas, setConsultas] = useState<Appointment[]>([]);
  const [profissionais, setProfissionais] = useState<Professional[]>([]);
  const [consultasPorProfissional, setConsultasPorProfissional] = useState<any[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadRelatorios() {
      setError('');
      try {
        const params = {
          dataInicio,
          dataFim,
          professionalId: profissionalFiltro === 'todos' ? undefined : profissionalFiltro,
        };
        const [dashboardResponse, appointmentsResponse, professionalsReportResponse, professionalsResponse] = await Promise.all([
          api.reportsDashboard(),
          api.reportsAppointments(params),
          api.reportsProfessionals({ dataInicio, dataFim }),
          api.listProfessionals({ ativo: true }),
        ]);
        setDashboard(dashboardResponse);
        setConsultas(appointmentsResponse.items);
        setConsultasPorProfissional(professionalsReportResponse);
        setProfissionais(professionalsResponse.items);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar relatórios');
      }
    }

    loadRelatorios();
  }, [dataInicio, dataFim, profissionalFiltro]);

  const dadosStatus = useMemo(
    () => [
      { nome: 'Realizadas', valor: consultas.filter((item) => item.status === 'REALIZADA').length, cor: '#2E7D9A' },
      { nome: 'Canceladas', valor: consultas.filter((item) => item.status === 'CANCELADA').length, cor: '#E57373' },
      { nome: 'Reagendadas', valor: consultas.filter((item) => item.status === 'REAGENDADA').length, cor: '#FFA726' },
      { nome: 'Agendadas', valor: consultas.filter((item) => item.status === 'AGENDADA').length, cor: '#4CAF93' },
    ],
    [consultas],
  );

  const dadosMensais = useMemo(() => {
    const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    return meses.map((mes, index) => ({
      mes,
      consultas: consultas.filter((item) => new Date(item.dataHora).getMonth() === index).length,
    }));
  }, [consultas]);

  const estatisticas = [
    {
      label: 'Total de Consultas',
      valor: String(consultas.length),
      icon: Calendar,
      color: 'bg-[#2E7D9A]',
      descricao: 'Filtro atual',
    },
    {
      label: 'Taxa de Realização',
      valor: consultas.length ? `${Math.round((dadosStatus[0].valor / consultas.length) * 100)}%` : '0%',
      icon: TrendingUp,
      color: 'bg-[#4CAF93]',
      descricao: 'Consultas efetivadas',
    },
    {
      label: 'Pacientes Cadastrados',
      valor: String(dashboard?.pacientesCadastrados ?? 0),
      icon: Users,
      color: 'bg-[#5DADE2]',
      descricao: 'Total no sistema',
    },
    {
      label: 'Taxa de Cancelamento',
      valor: consultas.length ? `${Math.round((dadosStatus[1].valor / consultas.length) * 100)}%` : '0%',
      icon: BarChart3,
      color: 'bg-[#FFA726]',
      descricao: 'Filtro atual',
    },
  ];

  const dadosConsultasPorProfissional = consultasPorProfissional.map((item) => ({
    nome: item.professional?.nome ?? 'Sem profissional',
    consultas: item.totalConsultas,
  }));

  const handleExportarPDF = () => {
    window.print();
  };

  const handleExportarExcel = () => {
    alert('Exportação em Excel pode ser implementada sobre este endpoint de relatórios.');
  };

  return (
    <AdminLayout>
      <div className="p-6 bg-gradient-to-br from-[#F5F7FA] to-white min-h-screen">
        <div className="mb-8">
          <h2 className="text-3xl mb-2 text-[#2C3E50] font-bold">Relatórios</h2>
          <p className="text-[#6C757D]">Análise e estatísticas do consultório</p>
        </div>

        {error && (
          <div className="mb-6 rounded-2xl border border-[#E57373]/30 bg-[#FFEBEE] px-4 py-3 text-[#E57373]">
            {error}
          </div>
        )}

        <Card className="mb-6">
          <h3 className="mb-4 text-[#2C3E50] font-bold">Filtros</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <Input label="Data de início" type="date" value={dataInicio} onChange={(e) => setDataInicio(e.target.value)} />
            <Input label="Data de término" type="date" value={dataFim} onChange={(e) => setDataFim(e.target.value)} />
            <div>
              <label className="block mb-2 text-[#2C3E50]">Profissional</label>
              <select
                value={profissionalFiltro}
                onChange={(e) => setProfissionalFiltro(e.target.value)}
                className="w-full px-4 py-3 bg-[#F5F7FA] border border-[#DDE2E8] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2E7D9A]"
              >
                <option value="todos">Todos</option>
                {profissionais.map((prof) => (
                  <option key={prof.id} value={prof.id}>
                    {prof.nome}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            <Button onClick={handleExportarPDF}>
              <Download className="w-4 h-4 mr-2" />
              Exportar PDF
            </Button>
            <Button variant="outline" onClick={handleExportarExcel}>
              <FileText className="w-4 h-4 mr-2" />
              Exportar Excel
            </Button>
          </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {estatisticas.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index}>
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-[#6C757D] text-sm mb-1">{stat.label}</p>
                    <p className="text-3xl mb-1 text-[#2C3E50] font-bold">{stat.valor}</p>
                    <p className="text-xs text-[#6C757D]">{stat.descricao}</p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          <Card>
            <h3 className="mb-6 text-[#2C3E50] font-bold">Consultas por Profissional</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dadosConsultasPorProfissional}>
                <CartesianGrid strokeDasharray="3 3" stroke="#DDE2E8" />
                <XAxis dataKey="nome" angle={-15} textAnchor="end" height={100} />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="consultas" fill="#2E7D9A" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <Card>
            <h3 className="mb-6 text-[#2C3E50] font-bold">Status das Consultas</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={dadosStatus} cx="50%" cy="50%" labelLine={false} label={({ nome, valor }) => `${nome}: ${valor}`} outerRadius={100} fill="#8884d8" dataKey="valor">
                  {dadosStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.cor} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </div>

        <Card>
          <h3 className="mb-6 text-[#2C3E50] font-bold">Evolução Mensal de Consultas</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dadosMensais}>
              <CartesianGrid strokeDasharray="3 3" stroke="#DDE2E8" />
              <XAxis dataKey="mes" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="consultas" fill="#4CAF93" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </AdminLayout>
  );
}
