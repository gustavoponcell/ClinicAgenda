import { useState } from 'react';
import { AdminLayout } from '../../components/AdminLayout';
import { Card } from '../../components/Card';
import { Input } from '../../components/Input';
import { History, Calendar, User, Clock, ArrowRight } from 'lucide-react';

export default function Historico() {
  const [filtroTipo, setFiltroTipo] = useState<'todos' | 'cancelamento' | 'reagendamento'>('todos');
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');

  const alteracoes = [
    {
      id: 1,
      tipo: 'cancelamento',
      data: '22/04/2026',
      hora: '14:35',
      usuario: 'Juliana Santos (Recepcionista)',
      paciente: 'Pedro Santos',
      profissional: 'Dra. Ana Paula Costa',
      consultaOriginal: {
        data: '25/04/2026',
        horario: '14:00',
      },
      motivo: 'Paciente solicitou cancelamento por viagem',
    },
    {
      id: 2,
      tipo: 'reagendamento',
      data: '21/04/2026',
      hora: '10:20',
      usuario: 'Ana Costa (Paciente)',
      paciente: 'Ana Costa',
      profissional: 'Dra. Mariana Lima',
      consultaOriginal: {
        data: '23/04/2026',
        horario: '10:00',
      },
      novaConsulta: {
        data: '28/04/2026',
        horario: '11:00',
      },
      motivo: 'Conflito de agenda',
    },
    {
      id: 3,
      tipo: 'cancelamento',
      data: '20/04/2026',
      hora: '16:15',
      usuario: 'Carlos Mendes (Recepcionista)',
      paciente: 'Marcos Oliveira',
      profissional: 'Dr. João Santos',
      consultaOriginal: {
        data: '22/04/2026',
        horario: '09:00',
      },
      motivo: 'Profissional em emergência médica',
    },
    {
      id: 4,
      tipo: 'reagendamento',
      data: '19/04/2026',
      hora: '11:45',
      usuario: 'Dr. Roberto Silva (Administrador)',
      paciente: 'Fernanda Lima',
      profissional: 'Dr. Carlos Eduardo',
      consultaOriginal: {
        data: '21/04/2026',
        horario: '15:00',
      },
      novaConsulta: {
        data: '24/04/2026',
        horario: '16:00',
      },
      motivo: 'Ajuste de agenda do profissional',
    },
    {
      id: 5,
      tipo: 'cancelamento',
      data: '18/04/2026',
      hora: '09:30',
      usuario: 'Juliana Santos (Recepcionista)',
      paciente: 'Roberto Carlos',
      profissional: 'Dra. Ana Paula Costa',
      consultaOriginal: {
        data: '20/04/2026',
        horario: '11:00',
      },
      motivo: 'Paciente não compareceu à confirmação',
    },
  ];

  const alteracoesFiltradas = alteracoes.filter((alt) => {
    if (filtroTipo !== 'todos' && alt.tipo !== filtroTipo) {
      return false;
    }
    return true;
  });

  const getTipoLabel = (tipo: string) => {
    return tipo === 'cancelamento' ? 'Cancelamento' : 'Reagendamento';
  };

  const getTipoColor = (tipo: string) => {
    return tipo === 'cancelamento'
      ? 'bg-[#FFEBEE] border-[#E57373] text-[#E57373]'
      : 'bg-[#FFF3E0] border-[#FFA726] text-[#C77700]';
  };

  return (
    <AdminLayout>
      <div className="p-6 bg-gradient-to-br from-[#F5F7FA] to-white min-h-screen">
        <div className="mb-8">
          <h2 className="text-3xl mb-2 text-[#2C3E50] font-bold">Histórico de Alterações</h2>
          <p className="text-[#6C757D]">
            Registro completo de cancelamentos e reagendamentos
          </p>
        </div>

        <Card className="mb-6">
          <h3 className="mb-4 text-[#2C3E50] font-bold">Filtros</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block mb-2 text-[#2C3E50]">Tipo de alteração</label>
              <select
                value={filtroTipo}
                onChange={(e) => setFiltroTipo(e.target.value as any)}
                className="w-full px-4 py-3 bg-[#F5F7FA] border border-[#DDE2E8] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2E7D9A]"
              >
                <option value="todos">Todos</option>
                <option value="cancelamento">Cancelamentos</option>
                <option value="reagendamento">Reagendamentos</option>
              </select>
            </div>
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
          </div>
        </Card>

        <div className="space-y-4">
          {alteracoesFiltradas.map((alteracao) => (
            <Card
              key={alteracao.id}
              className={`border-l-4 ${getTipoColor(alteracao.tipo)}`}
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${getTipoColor(alteracao.tipo)}`}>
                    <History className="w-6 h-6" />
                  </div>
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${getTipoColor(alteracao.tipo)}`}
                    >
                      {getTipoLabel(alteracao.tipo)}
                    </span>
                      <span className="text-sm text-[#6C757D]">
                      {alteracao.data} às {alteracao.hora}
                    </span>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-[#6C757D] mb-1">Realizado por:</p>
                      <p className="text-[#2C3E50]">{alteracao.usuario}</p>
                    </div>
                    <div>
                      <p className="text-sm text-[#6C757D] mb-1">Paciente:</p>
                      <p className="text-[#2C3E50]">{alteracao.paciente}</p>
                    </div>
                    <div>
                      <p className="text-sm text-[#6C757D] mb-1">Profissional:</p>
                      <p className="text-[#2C3E50]">{alteracao.profissional}</p>
                    </div>
                  </div>

                  {alteracao.tipo === 'reagendamento' ? (
                    <div className="bg-[#F5F7FA] p-4 rounded-xl mb-4">
                      <div className="flex items-center gap-4">
                        <div className="flex-1">
                          <p className="text-sm text-[#6C757D] mb-1">Data/Hora Original:</p>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-[#6C757D]" />
                            <span className="text-[#2C3E50]">
                              {alteracao.consultaOriginal.data}
                            </span>
                            <Clock className="w-4 h-4 text-[#6C757D] ml-2" />
                            <span className="text-[#2C3E50]">
                              {alteracao.consultaOriginal.horario}
                            </span>
                          </div>
                        </div>
                        <ArrowRight className="w-5 h-5 text-[#6C757D]" />
                        <div className="flex-1">
                          <p className="text-sm text-[#6C757D] mb-1">Nova Data/Hora:</p>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-[#2E7D9A]" />
                            <span className="text-[#2E7D9A]">
                              {alteracao.novaConsulta?.data}
                            </span>
                            <Clock className="w-4 h-4 text-[#2E7D9A] ml-2" />
                            <span className="text-[#2E7D9A]">
                              {alteracao.novaConsulta?.horario}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-[#F5F7FA] p-4 rounded-xl mb-4">
                      <p className="text-sm text-[#6C757D] mb-1">
                        Consulta Cancelada:
                      </p>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-[#6C757D]" />
                          <span className="text-[#2C3E50]">
                            {alteracao.consultaOriginal.data}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-[#6C757D]" />
                          <span className="text-[#2C3E50]">
                            {alteracao.consultaOriginal.horario}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {alteracao.motivo && (
                    <div>
                      <p className="text-sm text-[#6C757D] mb-1">Motivo:</p>
                      <p className="text-[#2C3E50]">{alteracao.motivo}</p>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {alteracoesFiltradas.length === 0 && (
          <Card className="text-center py-12">
            <History className="w-16 h-16 text-[#6C757D] mx-auto mb-4" />
            <h3 className="text-xl mb-2 text-[#2C3E50] font-bold">
              Nenhuma alteração encontrada
            </h3>
            <p className="text-[#6C757D]">
              Não há registros para os filtros selecionados
            </p>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
}
