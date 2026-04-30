import { useEffect, useMemo, useState } from 'react';
import { AdminLayout } from '../../components/AdminLayout';
import { Card } from '../../components/Card';
import { Input } from '../../components/Input';
import { History, Calendar, User, Clock } from 'lucide-react';
import { api } from '../../services/api';
import { formatDateTime } from '../../utils/format';

type FiltroTipo = 'todos' | 'cancelamento' | 'reagendamento';

interface AuditLog {
  id: string;
  actorType: 'PATIENT' | 'EMPLOYEE' | 'SYSTEM';
  actorId?: string | null;
  action: string;
  entity: string;
  entityId: string;
  metadata?: Record<string, unknown> | null;
  createdAt: string;
}

export default function Historico() {
  const [filtroTipo, setFiltroTipo] = useState<FiltroTipo>('todos');
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [alteracoes, setAlteracoes] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadHistorico() {
      setError('');
      try {
        const response = await api.auditLogs({ dataInicio, dataFim });
        setAlteracoes(response.items);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar histórico');
      } finally {
        setLoading(false);
      }
    }

    loadHistorico();
  }, [dataInicio, dataFim]);

  const alteracoesFiltradas = useMemo(
    () =>
      alteracoes.filter((alt) => {
        if (filtroTipo === 'cancelamento') return alt.action.includes('CANCEL');
        if (filtroTipo === 'reagendamento') return alt.action.includes('RESCHEDULE');
        return true;
      }),
    [alteracoes, filtroTipo],
  );

  const getTipoLabel = (action: string) => {
    if (action.includes('CANCEL')) return 'Cancelamento';
    if (action.includes('RESCHEDULE')) return 'Reagendamento';
    if (action.includes('CREATE')) return 'Criação';
    if (action.includes('DELETE')) return 'Remoção';
    if (action.includes('COMPLETE')) return 'Realização';
    return action;
  };

  const getTipoColor = (action: string) => {
    if (action.includes('CANCEL')) return 'bg-[#FFEBEE] border-[#E57373] text-[#E57373]';
    if (action.includes('RESCHEDULE')) return 'bg-[#FFF3E0] border-[#FFA726] text-[#C77700]';
    return 'bg-[#E3F2F7] border-[#2E7D9A] text-[#2E7D9A]';
  };

  const actorLabel = (alteracao: AuditLog) => {
    if (alteracao.actorType === 'PATIENT') return 'Paciente';
    if (alteracao.actorType === 'EMPLOYEE') return 'Funcionário';
    return 'Sistema';
  };

  return (
    <AdminLayout>
      <div className="p-6 bg-gradient-to-br from-[#F5F7FA] to-white min-h-screen">
        <div className="mb-8">
          <h2 className="text-3xl mb-2 text-[#2C3E50] font-bold">Histórico de Alterações</h2>
          <p className="text-[#6C757D]">Registro completo de operações importantes do sistema</p>
        </div>

        {error && (
          <div className="mb-6 rounded-2xl border border-[#E57373]/30 bg-[#FFEBEE] px-4 py-3 text-[#E57373]">
            {error}
          </div>
        )}

        <Card className="mb-6">
          <h3 className="mb-4 text-[#2C3E50] font-bold">Filtros</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block mb-2 text-[#2C3E50]">Tipo de alteração</label>
              <select
                value={filtroTipo}
                onChange={(e) => setFiltroTipo(e.target.value as FiltroTipo)}
                className="w-full px-4 py-3 bg-[#F5F7FA] border border-[#DDE2E8] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2E7D9A]"
              >
                <option value="todos">Todos</option>
                <option value="cancelamento">Cancelamentos</option>
                <option value="reagendamento">Reagendamentos</option>
              </select>
            </div>
            <Input label="Data de início" type="date" value={dataInicio} onChange={(e) => setDataInicio(e.target.value)} />
            <Input label="Data de término" type="date" value={dataFim} onChange={(e) => setDataFim(e.target.value)} />
          </div>
        </Card>

        {loading ? (
          <Card className="text-center text-[#6C757D]">Carregando histórico...</Card>
        ) : (
          <div className="space-y-4">
            {alteracoesFiltradas.map((alteracao) => {
              const createdAt = formatDateTime(alteracao.createdAt);
              const tipoColor = getTipoColor(alteracao.action);
              return (
                <Card key={alteracao.id} className={`border-l-4 ${tipoColor}`}>
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${tipoColor}`}>
                        <History className="w-6 h-6" />
                      </div>
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <span className={`px-3 py-1 rounded-full text-sm ${tipoColor}`}>{getTipoLabel(alteracao.action)}</span>
                        <span className="text-sm text-[#6C757D]">
                          {createdAt.data} às {createdAt.horario}
                        </span>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-[#6C757D] mb-1">Realizado por:</p>
                          <p className="text-[#2C3E50]">
                            {actorLabel(alteracao)} {alteracao.actorId ? `(${alteracao.actorId})` : ''}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-[#6C757D] mb-1">Entidade:</p>
                          <p className="text-[#2C3E50]">
                            {alteracao.entity} ({alteracao.entityId})
                          </p>
                        </div>
                      </div>

                      <div className="bg-[#F5F7FA] p-4 rounded-xl mb-4">
                        <div className="flex flex-wrap items-center gap-4">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-[#6C757D]" />
                            <span className="text-[#2C3E50]">{createdAt.data}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-[#6C757D]" />
                            <span className="text-[#2C3E50]">{createdAt.horario}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-[#6C757D]" />
                            <span className="text-[#2C3E50]">{alteracao.action}</span>
                          </div>
                        </div>
                      </div>

                      {alteracao.metadata && (
                        <pre className="overflow-x-auto rounded-xl bg-white border border-[#DDE2E8] p-3 text-xs text-[#6C757D]">
                          {JSON.stringify(alteracao.metadata, null, 2)}
                        </pre>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        {!loading && alteracoesFiltradas.length === 0 && (
          <Card className="text-center py-12">
            <History className="w-16 h-16 text-[#6C757D] mx-auto mb-4" />
            <h3 className="text-xl mb-2 text-[#2C3E50] font-bold">Nenhuma alteração encontrada</h3>
            <p className="text-[#6C757D]">Não há registros para os filtros selecionados</p>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
}
