import { useState } from 'react';
import { AdminLayout } from '../../components/AdminLayout';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { BarChart3, Download, FileText, TrendingUp, Users, Calendar } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { nomesProfissionais } from '../../data/mockData';

export default function Relatorios() {
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [profissionalFiltro, setProfissionalFiltro] = useState('todos');

  const dadosConsultasPorProfissional = [
    { nome: 'Dr. João Santos', consultas: 45 },
    { nome: 'Dra. Ana Paula', consultas: 38 },
    { nome: 'Dra. Mariana Lima', consultas: 42 },
    { nome: 'Dr. Carlos Eduardo', consultas: 35 },
  ];

  const dadosStatus = [
    { nome: 'Realizadas', valor: 120, cor: '#2E7D9A' },
    { nome: 'Canceladas', valor: 15, cor: '#E57373' },
    { nome: 'Reagendadas', valor: 8, cor: '#FFA726' },
  ];

  const dadosMensais = [
    { mes: 'Jan', consultas: 142 },
    { mes: 'Fev', consultas: 156 },
    { mes: 'Mar', consultas: 168 },
    { mes: 'Abr', consultas: 145 },
  ];

  const estatisticas = [
    {
      label: 'Total de Consultas',
      valor: '160',
      icon: Calendar,
      color: 'bg-[#2E7D9A]',
      descricao: 'Este mês',
    },
    {
      label: 'Taxa de Realização',
      valor: '83%',
      icon: TrendingUp,
      color: 'bg-[#4CAF93]',
      descricao: 'Consultas efetivadas',
    },
    {
      label: 'Pacientes Atendidos',
      valor: '142',
      icon: Users,
      color: 'bg-[#5DADE2]',
      descricao: 'Únicos no período',
    },
    {
      label: 'Taxa de Cancelamento',
      valor: '9%',
      icon: BarChart3,
      color: 'bg-[#FFA726]',
      descricao: 'Abaixo da média',
    },
  ];

  const handleExportarPDF = () => {
    alert('Exportando relatório em PDF...');
  };

  const handleExportarExcel = () => {
    alert('Exportando relatório em Excel...');
  };

  return (
    <AdminLayout>
      <div className="p-6 bg-gradient-to-br from-[#F5F7FA] to-white min-h-screen">
        <div className="mb-8">
          <h2 className="text-3xl mb-2 text-[#2C3E50] font-bold">Relatórios</h2>
          <p className="text-[#6C757D]">Análise e estatísticas do consultório</p>
        </div>

        <Card className="mb-6">
          <h3 className="mb-4 text-[#2C3E50] font-bold">Filtros</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <Input
              label="Data de início"
              type="date"
              value={dataInicio}
              onChange={(e) => setDataInicio(e.target.value)}
            />
            <Input
              label="Data de término"
              type="date"
              value={dataFim}
              onChange={(e) => setDataFim(e.target.value)}
            />
            <div>
              <label className="block mb-2 text-[#2C3E50]">Profissional</label>
              <select
                value={profissionalFiltro}
                onChange={(e) => setProfissionalFiltro(e.target.value)}
                className="w-full px-4 py-3 bg-[#F5F7FA] border border-[#DDE2E8] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2E7D9A]"
              >
                <option value="todos">Todos</option>
                {nomesProfissionais.map((prof) => (
                  <option key={prof} value={prof}>
                    {prof}
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
                  <div
                    className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center flex-shrink-0`}
                  >
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
                <YAxis />
                <Tooltip />
                <Bar dataKey="consultas" fill="#2E7D9A" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <Card>
            <h3 className="mb-6 text-[#2C3E50] font-bold">Status das Consultas</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={dadosStatus}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ nome, valor }) => `${nome}: ${valor}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="valor"
                >
                  {dadosStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.cor} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-3 gap-4 mt-4">
              {dadosStatus.map((item, index) => (
                <div key={index} className="text-center">
                  <div
                    className="w-4 h-4 rounded-full mx-auto mb-2"
                    style={{ backgroundColor: item.cor }}
                  />
                  <p className="text-sm text-[#6C757D]">{item.nome}</p>
                  <p className="text-xl text-[#2C3E50] font-bold">{item.valor}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <Card>
          <h3 className="mb-6 text-[#2C3E50] font-bold">Evolução Mensal de Consultas</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dadosMensais}>
              <CartesianGrid strokeDasharray="3 3" stroke="#DDE2E8" />
              <XAxis dataKey="mes" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="consultas" fill="#4CAF93" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="mt-6">
          <h3 className="mb-4 text-[#2C3E50] font-bold">Detalhamento por Período</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-gray-600">Profissional</th>
                  <th className="text-left py-3 px-4 text-gray-600">Realizadas</th>
                  <th className="text-left py-3 px-4 text-gray-600">Canceladas</th>
                  <th className="text-left py-3 px-4 text-gray-600">Reagendadas</th>
                  <th className="text-left py-3 px-4 text-gray-600">Total</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100">
                  <td className="py-3 px-4 text-gray-800">Dr. João Santos</td>
                  <td className="py-3 px-4 text-gray-600">38</td>
                  <td className="py-3 px-4 text-gray-600">4</td>
                  <td className="py-3 px-4 text-gray-600">3</td>
                  <td className="py-3 px-4 text-gray-800">45</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3 px-4 text-gray-800">Dra. Ana Paula Costa</td>
                  <td className="py-3 px-4 text-gray-600">32</td>
                  <td className="py-3 px-4 text-gray-600">3</td>
                  <td className="py-3 px-4 text-gray-600">3</td>
                  <td className="py-3 px-4 text-gray-800">38</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3 px-4 text-gray-800">Dra. Mariana Lima</td>
                  <td className="py-3 px-4 text-gray-600">37</td>
                  <td className="py-3 px-4 text-gray-600">3</td>
                  <td className="py-3 px-4 text-gray-600">2</td>
                  <td className="py-3 px-4 text-gray-800">42</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-gray-800">Dr. Carlos Eduardo</td>
                  <td className="py-3 px-4 text-gray-600">30</td>
                  <td className="py-3 px-4 text-gray-600">3</td>
                  <td className="py-3 px-4 text-gray-600">2</td>
                  <td className="py-3 px-4 text-gray-800">35</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
}
