import { useEffect, useMemo, useState } from 'react';
import { AdminLayout } from '../../components/AdminLayout';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Modal } from '../../components/Modal';
import { Calendar, User, Clock, Filter } from 'lucide-react';
import { api, Appointment, Professional } from '../../services/api';
import { formatDateTime } from '../../utils/format';

function getStatusLabel(status: Appointment['status']) {
  const labels = {
    AGENDADA: 'Agendada',
    CANCELADA: 'Cancelada',
    REAGENDADA: 'Reagendada',
    REALIZADA: 'Realizada',
  };

  return labels[status] ?? status;
}

function getStatusClassName(status: Appointment['status']) {
  const classes = {
    AGENDADA: 'bg-[#E8F5F1] border-[#4CAF93] text-[#4CAF93]',
    CANCELADA: 'bg-[#FFEBEE] border-[#E57373] text-[#E57373]',
    REAGENDADA: 'bg-[#FFF3E0] border-[#FFA726] text-[#C77700]',
    REALIZADA: 'bg-[#E3F2F7] border-[#2E7D9A] text-[#2E7D9A]',
  };

  return classes[status] ?? 'bg-[#F5F7FA] border-[#DDE2E8] text-[#6C757D]';
}

export default function Agenda() {
  const [visualizacao, setVisualizacao] = useState<'dia' | 'semana' | 'mes'>('dia');
  const [profissionalFiltro, setProfissionalFiltro] = useState('todos');
  const [consultas, setConsultas] = useState<Appointment[]>([]);
  const [profissionais, setProfissionais] = useState<Professional[]>([]);
  const [consultaSelecionada, setConsultaSelecionada] = useState<Appointment | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadData = async () => {
    setError('');
    try {
      const [appointmentsResponse, professionalsResponse] = await Promise.all([
        api.adminAppointments(profissionalFiltro === 'todos' ? {} : { professionalId: profissionalFiltro }),
        api.listProfessionals({ ativo: true }),
      ]);
      setConsultas(appointmentsResponse.items);
      setProfissionais(professionalsResponse.items);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar agenda');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [profissionalFiltro]);

  const consultasOrdenadas = useMemo(
    () => [...consultas].sort((a, b) => new Date(a.dataHora).getTime() - new Date(b.dataHora).getTime()),
    [consultas],
  );

  const handleConsultaClick = (consulta: Appointment) => {
    setConsultaSelecionada(consulta);
    setModalOpen(true);
  };

  const handleCancelar = async () => {
    if (!consultaSelecionada || !window.confirm('Deseja cancelar esta consulta?')) return;

    try {
      const updated = await api.cancelAppointmentAdmin(consultaSelecionada.id, 'Cancelado pela administração');
      setConsultas((current) => current.map((consulta) => (consulta.id === updated.id ? updated : consulta)));
      setConsultaSelecionada(updated);
      setModalOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao cancelar consulta');
    }
  };

  const handleRealizar = async () => {
    if (!consultaSelecionada) return;

    try {
      const updated = await api.completeAppointmentAdmin(consultaSelecionada.id);
      setConsultas((current) => current.map((consulta) => (consulta.id === updated.id ? updated : consulta)));
      setConsultaSelecionada(updated);
      setModalOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao concluir consulta');
    }
  };

  return (
    <AdminLayout>
      <div className="p-6 bg-gradient-to-br from-[#F5F7FA] to-white min-h-screen">
        <div className="mb-8">
          <h2 className="text-2xl sm:text-3xl mb-2 text-[#2C3E50] font-bold">Agenda do Consultório</h2>
          <p className="text-[#6C757D]">Gerencie todas as consultas agendadas</p>
        </div>

        {error && (
          <div className="mb-6 rounded-2xl border border-[#E57373]/30 bg-[#FFEBEE] px-4 py-3 text-[#E57373]">
            {error}
          </div>
        )}

        <Card className="mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="flex gap-2">
              {(['dia', 'semana', 'mes'] as const).map((view) => (
                <button
                  key={view}
                  onClick={() => setVisualizacao(view)}
                  className={`px-4 py-2 rounded-xl font-medium transition-all ${
                    visualizacao === view
                      ? 'bg-gradient-to-r from-[#2E7D9A] to-[#4CAF93] text-white shadow-md'
                      : 'bg-[#F5F7FA] text-[#6C757D] hover:bg-[#E8EBF0]'
                  }`}
                >
                  {view === 'mes' ? 'Mês' : view[0].toUpperCase() + view.slice(1)}
                </button>
              ))}
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
                  {profissionais.map((prof) => (
                    <option key={prof.id} value={prof.id}>
                      {prof.nome}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </Card>

        {loading ? (
          <Card className="text-center text-[#6C757D]">Carregando agenda...</Card>
        ) : (
          <div className="grid gap-4">
            {consultasOrdenadas.map((consulta) => {
              const formatted = formatDateTime(consulta.dataHora);
              return (
                <Card
                  key={consulta.id}
                  hover
                  onClick={() => handleConsultaClick(consulta)}
                  className={`border-l-4 cursor-pointer ${getStatusClassName(consulta.status)}`}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1 grid md:grid-cols-4 gap-4">
                      <div className="flex items-center gap-2">
                        <User className="w-5 h-5 text-[#2E7D9A]" />
                        <div>
                          <p className="text-sm text-[#6C757D]">Paciente</p>
                          <p className="text-[#2C3E50]">{consulta.patient?.nome}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="w-5 h-5 text-[#2E7D9A]" />
                        <div>
                          <p className="text-sm text-[#6C757D]">Profissional</p>
                          <p className="text-[#2C3E50]">{consulta.professional?.nome}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-[#2E7D9A]" />
                        <div>
                          <p className="text-sm text-[#6C757D]">Data</p>
                          <p className="text-[#2C3E50]">{formatted.data}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-5 h-5 text-[#2E7D9A]" />
                        <div>
                          <p className="text-sm text-[#6C757D]">Horário</p>
                          <p className="text-[#2C3E50]">{formatted.horario}</p>
                        </div>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full border text-sm font-medium ${getStatusClassName(consulta.status)}`}>
                      {getStatusLabel(consulta.status)}
                    </span>
                  </div>
                </Card>
              );
            })}
            {consultasOrdenadas.length === 0 && (
              <Card className="text-center text-[#6C757D]">Nenhuma consulta encontrada.</Card>
            )}
          </div>
        )}

        <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Detalhes da Consulta">
          {consultaSelecionada && (
            <div>
              {(() => {
                const formatted = formatDateTime(consultaSelecionada.dataHora);
                return (
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between py-3 border-b">
                      <span className="text-[#6C757D]">Paciente:</span>
                      <span className="text-[#2C3E50]">{consultaSelecionada.patient?.nome}</span>
                    </div>
                    <div className="flex justify-between py-3 border-b">
                      <span className="text-[#6C757D]">Profissional:</span>
                      <span className="text-[#2C3E50]">{consultaSelecionada.professional?.nome}</span>
                    </div>
                    <div className="flex justify-between py-3 border-b">
                      <span className="text-[#6C757D]">Especialidade:</span>
                      <span className="text-[#2C3E50]">{consultaSelecionada.specialty?.nome}</span>
                    </div>
                    <div className="flex justify-between py-3 border-b">
                      <span className="text-[#6C757D]">Data:</span>
                      <span className="text-[#2C3E50]">{formatted.data}</span>
                    </div>
                    <div className="flex justify-between py-3 border-b">
                      <span className="text-[#6C757D]">Horário:</span>
                      <span className="text-[#2C3E50]">{formatted.horario}</span>
                    </div>
                    <div className="flex justify-between py-3">
                      <span className="text-[#6C757D]">Status:</span>
                      <span className={`px-3 py-1 rounded-full border text-sm font-medium ${getStatusClassName(consultaSelecionada.status)}`}>
                        {getStatusLabel(consultaSelecionada.status)}
                      </span>
                    </div>
                  </div>
                );
              })()}

              {(consultaSelecionada.status === 'AGENDADA' || consultaSelecionada.status === 'REAGENDADA') && (
                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1" onClick={handleRealizar}>
                    Realizar
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
