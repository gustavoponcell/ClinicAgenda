import { useEffect, useMemo, useState } from 'react';
import { AdminLayout } from '../../components/AdminLayout';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { Calendar, Clock, Ban } from 'lucide-react';
import { api, Availability, Professional, ScheduleBlock } from '../../services/api';
import { formatDateTime } from '../../utils/format';

const diasSemanaLabel: Record<string, string> = {
  DOMINGO: 'Domingo',
  SEGUNDA: 'Segunda-feira',
  TERCA: 'Terça-feira',
  QUARTA: 'Quarta-feira',
  QUINTA: 'Quinta-feira',
  SEXTA: 'Sexta-feira',
  SABADO: 'Sábado',
};

export default function Horarios() {
  const [profissionalSelecionado, setProfissionalSelecionado] = useState('');
  const [profissionais, setProfissionais] = useState<Professional[]>([]);
  const [disponibilidades, setDisponibilidades] = useState<Availability[]>([]);
  const [mostrarBloqueio, setMostrarBloqueio] = useState(false);
  const [bloqueioData, setBloqueioData] = useState({
    dataInicio: '',
    dataFim: '',
    motivo: '',
  });
  const [bloqueios, setBloqueios] = useState<ScheduleBlock[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadProfessionals() {
      try {
        const response = await api.listProfessionals({ ativo: true });
        setProfissionais(response.items);
        setProfissionalSelecionado(response.items[0]?.id || '');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar profissionais');
        setLoading(false);
      }
    }

    loadProfessionals();
  }, []);

  useEffect(() => {
    if (!profissionalSelecionado) return;

    async function loadSchedule() {
      setLoading(true);
      setError('');
      try {
        const [availabilitiesResponse, blocksResponse] = await Promise.all([
          api.listAvailabilities(profissionalSelecionado),
          api.listScheduleBlocks(profissionalSelecionado),
        ]);
        setDisponibilidades(availabilitiesResponse);
        setBloqueios(blocksResponse);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar horários');
      } finally {
        setLoading(false);
      }
    }

    loadSchedule();
  }, [profissionalSelecionado]);

  const disponibilidadesAgrupadas = useMemo(
    () =>
      disponibilidades
        .filter((item) => item.ativo)
        .map((item) => `${diasSemanaLabel[item.diaSemana] ?? item.diaSemana}: ${item.horaInicio} às ${item.horaFim}`),
    [disponibilidades],
  );

  const handleBloquear = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profissionalSelecionado) return;

    try {
      const block = await api.createScheduleBlock(profissionalSelecionado, {
        inicio: new Date(`${bloqueioData.dataInicio}T00:00:00`).toISOString(),
        fim: new Date(`${bloqueioData.dataFim}T23:59:59`).toISOString(),
        motivo: bloqueioData.motivo,
      });
      setBloqueios((current) => [...current, block]);
      setMostrarBloqueio(false);
      setBloqueioData({ dataInicio: '', dataFim: '', motivo: '' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao bloquear período');
    }
  };

  const handleRemoverBloqueio = async (id: string) => {
    if (!window.confirm('Deseja remover este bloqueio?')) return;

    try {
      await api.deleteScheduleBlock(id);
      setBloqueios((current) => current.filter((b) => b.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao remover bloqueio');
    }
  };

  return (
    <AdminLayout>
      <div className="p-6 bg-gradient-to-br from-[#F5F7FA] to-white min-h-screen">
        <div className="mb-8">
          <h2 className="text-3xl mb-2 text-[#2C3E50] font-bold">Gestão de Horários</h2>
          <p className="text-[#6C757D]">Configure horários de atendimento e bloqueie datas</p>
        </div>

        {error && (
          <div className="mb-6 rounded-2xl border border-[#E57373]/30 bg-[#FFEBEE] px-4 py-3 text-[#E57373]">
            {error}
          </div>
        )}

        <Card className="mb-6">
          <div className="flex items-center gap-4 mb-6">
            <label className="text-[#2C3E50]">Profissional:</label>
            <select
              value={profissionalSelecionado}
              onChange={(e) => setProfissionalSelecionado(e.target.value)}
              className="flex-1 max-w-xs px-4 py-2 bg-[#F5F7FA] border border-[#DDE2E8] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2E7D9A]"
            >
              {profissionais.map((prof) => (
                <option key={prof.id} value={prof.id}>
                  {prof.nome}
                </option>
              ))}
            </select>
          </div>

          {loading ? (
            <p className="text-center text-[#6C757D] py-8">Carregando horários...</p>
          ) : (
            <>
              <div className="bg-[#E3F2F7] p-6 rounded-2xl mb-6 border border-[#2E7D9A]/10">
                <div className="flex items-center gap-3 mb-4">
                  <Clock className="w-6 h-6 text-[#2E7D9A]" />
                  <h3 className="text-[#2C3E50] font-bold">Horário de Atendimento</h3>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  {disponibilidadesAgrupadas.map((item) => (
                    <p key={item} className="text-[#2C3E50]">
                      {item}
                    </p>
                  ))}
                  {disponibilidadesAgrupadas.length === 0 && (
                    <p className="text-[#6C757D]">Nenhuma disponibilidade cadastrada para este profissional.</p>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[#2C3E50] font-bold">Períodos Bloqueados</h3>
                <Button size="sm" onClick={() => setMostrarBloqueio(!mostrarBloqueio)}>
                  <Ban className="w-4 h-4 mr-2" />
                  Bloquear Data
                </Button>
              </div>

              {mostrarBloqueio && (
                <form onSubmit={handleBloquear} className="bg-[#F5F7FA] p-4 rounded-xl mb-4">
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <Input
                      label="Data de início"
                      type="date"
                      value={bloqueioData.dataInicio}
                      onChange={(e) => setBloqueioData({ ...bloqueioData, dataInicio: e.target.value })}
                      required
                    />
                    <Input
                      label="Data de término"
                      type="date"
                      value={bloqueioData.dataFim}
                      onChange={(e) => setBloqueioData({ ...bloqueioData, dataFim: e.target.value })}
                      required
                    />
                  </div>
                  <Input
                    label="Motivo"
                    placeholder="Ex: Férias, Congresso, Feriado..."
                    value={bloqueioData.motivo}
                    onChange={(e) => setBloqueioData({ ...bloqueioData, motivo: e.target.value })}
                    required
                  />
                  <div className="flex gap-3 mt-4">
                    <Button type="submit" size="sm">
                      Confirmar Bloqueio
                    </Button>
                    <Button type="button" variant="outline" size="sm" onClick={() => setMostrarBloqueio(false)}>
                      Cancelar
                    </Button>
                  </div>
                </form>
              )}

              {bloqueios.length > 0 ? (
                <div className="space-y-3">
                  {bloqueios.map((bloqueio) => {
                    const inicio = formatDateTime(bloqueio.inicio);
                    const fim = formatDateTime(bloqueio.fim);
                    return (
                      <div key={bloqueio.id} className="flex items-center justify-between p-4 bg-[#FFEBEE] border border-[#E57373]/30 rounded-xl">
                        <div className="flex items-center gap-3">
                          <Calendar className="w-5 h-5 text-[#E57373]" />
                          <div>
                            <p className="text-[#2C3E50]">
                              {inicio.data} até {fim.data}
                            </p>
                            <p className="text-sm text-[#6C757D]">{bloqueio.motivo}</p>
                          </div>
                        </div>
                        <Button variant="danger" size="sm" onClick={() => handleRemoverBloqueio(bloqueio.id)}>
                          Remover
                        </Button>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-center text-[#6C757D] py-8">Nenhum período bloqueado para este profissional</p>
              )}
            </>
          )}
        </Card>
      </div>
    </AdminLayout>
  );
}
