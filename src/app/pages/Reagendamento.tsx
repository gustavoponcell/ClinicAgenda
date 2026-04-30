import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { ChevronLeft, ArrowRight, Check } from 'lucide-react';
import { Header } from '../components/Header';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { api, Appointment, Availability } from '../services/api';
import { getToken } from '../services/authStorage';
import { formatDateTime, toApiDateTime } from '../utils/format';

const diaSemanaApi = ['DOMINGO', 'SEGUNDA', 'TERCA', 'QUARTA', 'QUINTA', 'SEXTA', 'SABADO'];

function gerarHorarios(disponibilidades: Availability[], dataPtBr: string) {
  if (!dataPtBr) return [];
  const [day, month, year] = dataPtBr.split('/').map(Number);
  const date = new Date(year, month - 1, day);
  const diaSemana = diaSemanaApi[date.getDay()];
  const horarios = new Set<string>();

  disponibilidades
    .filter((item) => item.ativo && item.diaSemana === diaSemana)
    .forEach((item) => {
      const [inicioHora] = item.horaInicio.split(':').map(Number);
      const [fimHora] = item.horaFim.split(':').map(Number);
      for (let hora = inicioHora; hora < fimHora; hora += 1) {
        horarios.add(`${String(hora).padStart(2, '0')}:00`);
      }
    });

  return Array.from(horarios).sort();
}

export default function Reagendamento() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [userName, setUserName] = useState('');
  const [consultaOriginal, setConsultaOriginal] = useState<Appointment | null>(null);
  const [disponibilidades, setDisponibilidades] = useState<Availability[]>([]);
  const [novaData, setNovaData] = useState('');
  const [novoHorario, setNovoHorario] = useState('');
  const [confirmado, setConfirmado] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!getToken('patient')) {
      navigate('/login');
      return;
    }

    async function loadConsulta() {
      try {
        const [me, consultas] = await Promise.all([api.me<{ nome: string }>('patient'), api.listMyAppointments()]);
        setUserName(me.nome);
        const consulta = consultas.items.find((item) => item.id === id);
        setConsultaOriginal(consulta ?? null);

        if (consulta) {
          const response = await api.listAvailabilities(consulta.professionalId);
          setDisponibilidades(response);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar consulta');
      } finally {
        setLoading(false);
      }
    }

    loadConsulta();
  }, [id, navigate]);

  const proximosDias = Array.from({ length: 14 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i + 1);
    return date.toLocaleDateString('pt-BR');
  });

  const horariosDisponiveis = gerarHorarios(disponibilidades, novaData);
  const horariosExibidos = horariosDisponiveis.length > 0 ? horariosDisponiveis : ['08:00', '09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'];

  const handleConfirmarReagendamento = async () => {
    if (!consultaOriginal) return;

    setError('');
    setSubmitting(true);

    try {
      await api.rescheduleAppointment(consultaOriginal.id, {
        dataHora: toApiDateTime(novaData, novoHorario),
        observacoes: 'Reagendado pelo paciente',
      });
      setConfirmado(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível reagendar a consulta');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#E3F2F7] via-white to-[#E8F5F1]">
        <Header showUserMenu userName={userName} />
        <main className="max-w-4xl mx-auto px-4 py-8">
          <Card className="text-center">
            <p className="text-[#6C757D]">Carregando consulta...</p>
          </Card>
        </main>
      </div>
    );
  }

  if (!consultaOriginal) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#E3F2F7] via-white to-[#E8F5F1]">
        <Header showUserMenu userName={userName} />
        <main className="max-w-4xl mx-auto px-4 py-8">
          <Card className="text-center">
            <p className="text-[#6C757D]">{error || 'Consulta não encontrada'}</p>
          </Card>
        </main>
      </div>
    );
  }

  const dataOriginal = formatDateTime(consultaOriginal.dataHora);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E3F2F7] via-white to-[#E8F5F1]">
      <Header showUserMenu userName={userName} />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 rounded-2xl border border-[#E57373]/30 bg-[#FFEBEE] px-4 py-3 text-[#E57373]">
            {error}
          </div>
        )}

        {!confirmado ? (
          <>
            <div className="mb-8">
              <button onClick={() => navigate('/minhas-consultas')} className="flex items-center text-[#2E7D9A] hover:underline mb-4">
                <ChevronLeft className="w-5 h-5" />
                Voltar para Minhas Consultas
              </button>
              <h2 className="text-3xl text-[#2C3E50] font-bold">Reagendar Consulta</h2>
            </div>

            <Card className="mb-6">
              <h3 className="text-xl mb-4 text-[#2C3E50] font-bold">Consulta Original</h3>
              <div className="grid md:grid-cols-2 gap-4 bg-[#F5F7FA] p-4 rounded-xl">
                <div>
                  <p className="text-sm text-[#6C757D]">Especialidade</p>
                  <p className="text-[#2C3E50]">{consultaOriginal.specialty?.nome}</p>
                </div>
                <div>
                  <p className="text-sm text-[#6C757D]">Profissional</p>
                  <p className="text-[#2C3E50]">{consultaOriginal.professional?.nome}</p>
                </div>
                <div>
                  <p className="text-sm text-[#6C757D]">Data</p>
                  <p className="text-[#2C3E50]">{dataOriginal.data}</p>
                </div>
                <div>
                  <p className="text-sm text-[#6C757D]">Horário</p>
                  <p className="text-[#2C3E50]">{dataOriginal.horario}</p>
                </div>
              </div>
            </Card>

            <Card className="mb-6">
              <h3 className="text-xl mb-6 text-[#2C3E50] font-bold">Selecione a nova data</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {proximosDias.map((dia) => (
                  <button
                    key={dia}
                    onClick={() => {
                      setNovaData(dia);
                      setNovoHorario('');
                    }}
                    className={`p-4 border-2 rounded-xl transition-all ${
                      novaData === dia
                        ? 'border-[#2E7D9A] bg-[#E3F2F7] text-[#2E7D9A]'
                        : 'border-[#DDE2E8] text-[#2C3E50] hover:border-[#2E7D9A] hover:bg-[#E3F2F7]'
                    }`}
                  >
                    {dia}
                  </button>
                ))}
              </div>
            </Card>

            {novaData && (
              <Card className="mb-6">
                <h3 className="text-xl mb-6 text-[#2C3E50] font-bold">Selecione o novo horário</h3>
                <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
                  {horariosExibidos.map((hora) => {
                    const indisponivel = !horariosDisponiveis.includes(hora);
                    return (
                      <button
                        key={hora}
                        onClick={() => !indisponivel && setNovoHorario(hora)}
                        disabled={indisponivel}
                        className={`p-4 border-2 rounded-xl font-medium transition-all ${
                          indisponivel
                            ? 'border-[#E8EBF0] bg-[#F5F7FA] text-[#ADB5BD] cursor-not-allowed opacity-60'
                            : novoHorario === hora
                            ? 'border-[#4CAF93] bg-[#E8F5F1] text-[#4CAF93] shadow-md'
                            : 'border-[#DDE2E8] text-[#2C3E50] hover:border-[#4CAF93] hover:bg-[#E8F5F1]'
                        }`}
                      >
                        {hora}
                        <span className="block text-xs mt-1">{indisponivel ? 'Indisponível' : 'Disponível'}</span>
                      </button>
                    );
                  })}
                </div>
              </Card>
            )}

            {novaData && novoHorario && (
              <Card>
                <h3 className="text-xl mb-4 text-[#2C3E50] font-bold">Resumo do Reagendamento</h3>
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <p className="text-sm text-[#6C757D] mb-3">Antes</p>
                    <div className="space-y-2">
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-[#6C757D]">Data:</span>
                        <span className="text-[#2C3E50]">{dataOriginal.data}</span>
                      </div>
                      <div className="flex justify-between py-2">
                        <span className="text-[#6C757D]">Horário:</span>
                        <span className="text-[#2C3E50]">{dataOriginal.horario}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-[#6C757D] mb-3">Depois</p>
                    <div className="space-y-2">
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-[#6C757D]">Data:</span>
                        <span className="text-[#2E7D9A] font-medium">{novaData}</span>
                      </div>
                      <div className="flex justify-between py-2">
                        <span className="text-[#6C757D]">Horário:</span>
                        <span className="text-[#2E7D9A] font-medium">{novoHorario}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <Button className="w-full" size="lg" onClick={handleConfirmarReagendamento} disabled={submitting}>
                  {submitting ? 'Confirmando...' : 'Confirmar Reagendamento'}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Card>
            )}
          </>
        ) : (
          <Card className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-[#E8F5F1] to-[#E3F2F7] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Check className="w-10 h-10 text-[#4CAF93]" />
            </div>
            <h3 className="text-3xl mb-4 text-[#2C3E50] font-bold">Consulta reagendada com sucesso!</h3>
            <p className="text-[#6C757D] mb-8">Você receberá um novo lembrete por e-mail 24 horas antes da consulta.</p>
            <div className="bg-[#E8F5F1] border border-[#4CAF93]/20 rounded-2xl p-6 mb-8 max-w-md mx-auto">
              <h4 className="mb-4 text-[#2C3E50] font-bold">Nova data e horário</h4>
              <div className="space-y-2 text-left">
                <div className="flex justify-between">
                  <span className="text-[#6C757D]">Data:</span>
                  <span className="text-[#2C3E50] font-medium">{novaData}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6C757D]">Horário:</span>
                  <span className="text-[#2C3E50] font-medium">{novoHorario}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-4 justify-center">
              <Button onClick={() => navigate('/minhas-consultas')}>Ver Minhas Consultas</Button>
              <Button variant="outline" onClick={() => navigate('/dashboard')}>Voltar ao Dashboard</Button>
            </div>
          </Card>
        )}
      </main>
    </div>
  );
}
