import { useState } from 'react';
import { AdminLayout } from '../../components/AdminLayout';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Modal } from '../../components/Modal';
import { Calendar, User, Clock, Filter } from 'lucide-react';
import {
  ConsultaAdmin,
  consultasAdminMock,
  getStatusClassName,
  getStatusLabel,
  nomesProfissionais,
} from '../../data/mockData';

export default function Agenda() {
  const [visualizacao, setVisualizacao] = useState<'dia' | 'semana' | 'mes'>('dia');
  const [profissionalFiltro, setProfissionalFiltro] = useState('todos');
  const [consultas, setConsultas] = useState<ConsultaAdmin[]>(consultasAdminMock);
  const [consultaSelecionada, setConsultaSelecionada] = useState<ConsultaAdmin | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const consultasFiltradas =
    profissionalFiltro === 'todos'
      ? consultas
      : consultas.filter((c) => c.profissional === profissionalFiltro);

  const handleConsultaClick = (consulta: ConsultaAdmin) => {
    setConsultaSelecionada(consulta);
    setModalOpen(true);
  };

  const handleCancelar = () => {
    if (consultaSelecionada && window.confirm('Deseja cancelar esta consulta?')) {
      const updated = consultas.map((consulta) =>
        consulta.id === consultaSelecionada.id
          ? { ...consulta, status: 'cancelada' as const }
          : consulta
      );
      setConsultas(updated);
      setConsultaSelecionada({ ...consultaSelecionada, status: 'cancelada' });
      setModalOpen(false);
    }
  };

  const handleReagendar = () => {
    if (!consultaSelecionada) return;

    const updated = consultas.map((consulta) =>
      consulta.id === consultaSelecionada.id
        ? { ...consulta, status: 'reagendada' as const }
        : consulta
    );
    setConsultas(updated);
    setConsultaSelecionada({ ...consultaSelecionada, status: 'reagendada' });
  };

  return (
    <AdminLayout>
      <div className="p-6 bg-gradient-to-br from-[#F5F7FA] to-white min-h-screen">
        <div className="mb-8">
          <h2 className="text-2xl sm:text-3xl mb-2 text-[#2C3E50] font-bold">Agenda do Consultório</h2>
          <p className="text-[#6C757D]">Gerencie todas as consultas agendadas</p>
        </div>

        <Card className="mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="flex gap-2">
              <button
                onClick={() => setVisualizacao('dia')}
                className={`px-4 py-2 rounded-xl font-medium transition-all ${
                  visualizacao === 'dia'
                    ? 'bg-gradient-to-r from-[#2E7D9A] to-[#4CAF93] text-white shadow-md'
                    : 'bg-[#F5F7FA] text-[#6C757D] hover:bg-[#E8EBF0]'
                }`}
              >
                Dia
              </button>
              <button
                onClick={() => setVisualizacao('semana')}
                className={`px-4 py-2 rounded-xl font-medium transition-all ${
                  visualizacao === 'semana'
                    ? 'bg-gradient-to-r from-[#2E7D9A] to-[#4CAF93] text-white shadow-md'
                    : 'bg-[#F5F7FA] text-[#6C757D] hover:bg-[#E8EBF0]'
                }`}
              >
                Semana
              </button>
              <button
                onClick={() => setVisualizacao('mes')}
                className={`px-4 py-2 rounded-xl font-medium transition-all ${
                  visualizacao === 'mes'
                    ? 'bg-gradient-to-r from-[#2E7D9A] to-[#4CAF93] text-white shadow-md'
                    : 'bg-[#F5F7FA] text-[#6C757D] hover:bg-[#E8EBF0]'
                }`}
              >
                Mês
              </button>
            </div>

            <div className="flex gap-4 items-center w-full md:w-auto">
              <div className="flex items-center gap-2 flex-1 md:flex-initial">
                <Filter className="w-5 h-5 text-[#6C757D]" />
                <select
                  value={profissionalFiltro}
                  onChange={(e) => setProfissionalFiltro(e.target.value)}
                  className="flex-1 md:w-auto px-4 py-2 bg-[#F5F7FA] border border-[#DDE2E8] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2E7D9A]"
                >
                  <option value="todos">Todos os profissionais</option>
                  {nomesProfissionais.map((prof) => (
                    <option key={prof} value={prof}>
                      {prof}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </Card>

        <div className="grid gap-4">
          {consultasFiltradas.map((consulta) => (
            <Card
              key={consulta.id}
              hover
              onClick={() => handleConsultaClick(consulta)}
              className={`border-l-4 cursor-pointer ${getStatusClassName(consulta.status)}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1 grid md:grid-cols-4 gap-4">
                  <div className="flex items-center gap-2">
                    <User className="w-5 h-5 text-[#2E7D9A]" />
                    <div>
                      <p className="text-sm text-[#6C757D]">Paciente</p>
                      <p className="text-[#2C3E50]">{consulta.paciente}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="w-5 h-5 text-[#2E7D9A]" />
                    <div>
                      <p className="text-sm text-[#6C757D]">Profissional</p>
                      <p className="text-[#2C3E50]">{consulta.profissional}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-[#2E7D9A]" />
                    <div>
                      <p className="text-sm text-[#6C757D]">Data</p>
                      <p className="text-[#2C3E50]">{consulta.data}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-[#2E7D9A]" />
                    <div>
                      <p className="text-sm text-[#6C757D]">Horário</p>
                      <p className="text-[#2C3E50]">{consulta.horario}</p>
                    </div>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full border text-sm font-medium ${getStatusClassName(consulta.status)}`}>
                  {getStatusLabel(consulta.status)}
                </span>
              </div>
            </Card>
          ))}
        </div>

        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title="Detalhes da Consulta"
        >
          {consultaSelecionada && (
            <div>
              <div className="space-y-4 mb-6">
                <div className="flex justify-between py-3 border-b">
                  <span className="text-[#6C757D]">Paciente:</span>
                  <span className="text-[#2C3E50]">{consultaSelecionada.paciente}</span>
                </div>
                <div className="flex justify-between py-3 border-b">
                  <span className="text-[#6C757D]">Profissional:</span>
                  <span className="text-[#2C3E50]">{consultaSelecionada.profissional}</span>
                </div>
                <div className="flex justify-between py-3 border-b">
                  <span className="text-[#6C757D]">Especialidade:</span>
                  <span className="text-[#2C3E50]">{consultaSelecionada.especialidade}</span>
                </div>
                <div className="flex justify-between py-3 border-b">
                  <span className="text-[#6C757D]">Data:</span>
                  <span className="text-[#2C3E50]">{consultaSelecionada.data}</span>
                </div>
                <div className="flex justify-between py-3 border-b">
                  <span className="text-[#6C757D]">Horário:</span>
                  <span className="text-[#2C3E50]">{consultaSelecionada.horario}</span>
                </div>
                <div className="flex justify-between py-3">
                  <span className="text-[#6C757D]">Status:</span>
                  <span className={`px-3 py-1 rounded-full border text-sm font-medium ${getStatusClassName(consultaSelecionada.status)}`}>
                    {getStatusLabel(consultaSelecionada.status)}
                  </span>
                </div>
              </div>

              {consultaSelecionada.status === 'confirmada' && (
                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1">
                    Editar
                  </Button>
                  <Button variant="outline" className="flex-1" onClick={handleReagendar}>
                    Reagendar
                  </Button>
                  <Button variant="danger" className="flex-1" onClick={handleCancelar}>
                    Cancelar
                  </Button>
                </div>
              )}
            </div>
          )}
        </Modal>
      </div>
    </AdminLayout>
  );
}
