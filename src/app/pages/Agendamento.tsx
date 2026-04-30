import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { Header } from '../components/Header';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { api, Availability, Professional, Specialty } from '../services/api';
import { getToken, saveSession } from '../services/authStorage';
import { toApiDateTime } from '../utils/format';

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

export default function Agendamento() {
  const navigate = useNavigate();
  const [etapa, setEtapa] = useState(1);
  const [userName, setUserName] = useState('');
  const [especialidades, setEspecialidades] = useState<Specialty[]>([]);
  const [profissionais, setProfissionais] = useState<Professional[]>([]);
  const [disponibilidades, setDisponibilidades] = useState<Availability[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [agendamento, setAgendamento] = useState({
    specialtyId: '',
    especialidade: '',
    professionalId: '',
    profissional: '',
    data: '',
    horario: '',
  });

  useEffect(() => {
    if (!getToken('patient')) {
      navigate('/login');
      return;
    }

    async function loadInitialData() {
      try {
        const [me, specialtiesResponse, professionalsResponse] = await Promise.all([
          api.me<{ nome: string }>('patient'),
          api.listSpecialties(),
          api.listProfessionals({ ativo: true }),
        ]);
        setUserName(me.nome);
        saveSession('patient', getToken('patient') ?? '', me);
        setEspecialidades(specialtiesResponse.items);
        setProfissionais(professionalsResponse.items);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar dados do agendamento');
      } finally {
        setLoading(false);
      }
    }

    loadInitialData();
  }, [navigate]);

  useEffect(() => {
    if (!agendamento.professionalId) return;

    api
      .listAvailabilities(agendamento.professionalId)
      .then(setDisponibilidades)
      .catch((err) => setError(err instanceof Error ? err.message : 'Erro ao carregar horários'));
  }, [agendamento.professionalId]);

  const profissionaisFiltrados = useMemo(
    () =>
      profissionais.filter((prof) =>
        prof.specialties?.some((specialty) => specialty.id === agendamento.specialtyId),
      ),
    [profissionais, agendamento.specialtyId],
  );

  const proximosDias = Array.from({ length: 14 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i + 1);
    return date.toLocaleDateString('pt-BR');
  });

  const horariosDisponiveis = gerarHorarios(disponibilidades, agendamento.data);
  const horariosExibidos = horariosDisponiveis.length > 0 ? horariosDisponiveis : ['08:00', '09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'];

  const handleConfirmar = async () => {
    setError('');
    setSubmitting(true);

    try {
      await api.createAppointment({
        professionalId: agendamento.professionalId,
        specialtyId: agendamento.specialtyId,
        dataHora: toApiDateTime(agendamento.data, agendamento.horario),
      });
      setEtapa(6);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível confirmar o agendamento');
    } finally {
      setSubmitting(false);
    }
  };

  const etapas = [
    { numero: 1, titulo: 'Especialidade' },
    { numero: 2, titulo: 'Profissional' },
    { numero: 3, titulo: 'Data' },
    { numero: 4, titulo: 'Horário' },
    { numero: 5, titulo: 'Revisão' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E3F2F7] via-white to-[#E8F5F1]">
      <Header showUserMenu userName={userName} />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 rounded-2xl border border-[#E57373]/30 bg-[#FFEBEE] px-4 py-3 text-[#E57373]">
            {error}
          </div>
        )}

        {loading ? (
          <Card className="text-center text-[#6C757D]">Carregando opções de agendamento...</Card>
        ) : etapa < 6 ? (
          <>
            <div className="mb-8">
              <h2 className="text-2xl sm:text-3xl mb-6 text-[#2C3E50] font-bold">Agendar Consulta</h2>
              <div className="flex items-center justify-between mb-2">
                {etapas.map((e, index) => (
                  <div key={e.numero} className="flex items-center flex-1">
                    <div className="flex flex-col items-center flex-1">
                      <div
                        className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center font-bold transition-all ${
                          etapa >= e.numero
                            ? 'bg-gradient-to-br from-[#2E7D9A] to-[#4CAF93] text-white shadow-md'
                            : 'bg-[#E8EBF0] text-[#6C757D]'
                        }`}
                      >
                        {etapa > e.numero ? <Check className="w-5 h-5" /> : e.numero}
                      </div>
                      <span className="text-xs sm:text-sm mt-2 text-[#6C757D] hidden sm:block">{e.titulo}</span>
                    </div>
                    {index < etapas.length - 1 && (
                      <div
                        className={`h-1 flex-1 transition-all ${
                          etapa > e.numero ? 'bg-gradient-to-r from-[#2E7D9A] to-[#4CAF93]' : 'bg-[#E8EBF0]'
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>

            <Card>
              {etapa === 1 && (
                <div>
                  <h3 className="text-xl mb-6 text-[#2C3E50] font-bold">Selecione a especialidade</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                    {especialidades.map((esp) => (
                      <button
                        key={esp.id}
                        onClick={() => {
                          setAgendamento({
                            ...agendamento,
                            specialtyId: esp.id,
                            especialidade: esp.nome,
                            professionalId: '',
                            profissional: '',
                            data: '',
                            horario: '',
                          });
                          setEtapa(2);
                        }}
                        className={`p-3 sm:p-4 border-2 rounded-xl font-medium hover:border-[#2E7D9A] hover:bg-[#E3F2F7] transition-all ${
                          agendamento.specialtyId === esp.id
                            ? 'border-[#2E7D9A] bg-[#E3F2F7] text-[#2E7D9A]'
                            : 'border-[#DDE2E8] text-[#2C3E50]'
                        }`}
                      >
                        {esp.nome}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {etapa === 2 && (
                <div>
                  <h3 className="text-xl mb-6 text-[#2C3E50] font-bold">Selecione o profissional</h3>
                  <div className="space-y-4">
                    {profissionaisFiltrados.map((prof) => (
                      <button
                        key={prof.id}
                        onClick={() => {
                          setAgendamento({
                            ...agendamento,
                            professionalId: prof.id,
                            profissional: prof.nome,
                            data: '',
                            horario: '',
                          });
                          setEtapa(3);
                        }}
                        className={`w-full p-4 border-2 rounded-xl text-left hover:border-[#2E7D9A] hover:bg-[#E3F2F7] transition-all ${
                          agendamento.professionalId === prof.id ? 'border-[#2E7D9A] bg-[#E3F2F7]' : 'border-[#DDE2E8]'
                        }`}
                      >
                        <p className="text-[#2C3E50] font-medium">{prof.nome}</p>
                        <p className="text-sm text-[#6C757D]">{agendamento.especialidade}</p>
                      </button>
                    ))}
                    {profissionaisFiltrados.length === 0 && (
                      <p className="text-center text-[#6C757D] py-6">Nenhum profissional ativo para esta especialidade.</p>
                    )}
                  </div>
                  <Button variant="outline" className="mt-6" onClick={() => setEtapa(1)}>
                    <ChevronLeft className="w-5 h-5 mr-2" />
                    Voltar
                  </Button>
                </div>
              )}

              {etapa === 3 && (
                <div>
                  <h3 className="text-xl mb-6 text-[#2C3E50] font-bold">Selecione a data</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {proximosDias.map((dia) => (
                      <button
                        key={dia}
                        onClick={() => {
                          setAgendamento({ ...agendamento, data: dia, horario: '' });
                          setEtapa(4);
                        }}
                        className={`p-4 border-2 rounded-xl hover:border-[#2E7D9A] hover:bg-[#E3F2F7] transition-all ${
                          agendamento.data === dia
                            ? 'border-[#2E7D9A] bg-[#E3F2F7] text-[#2E7D9A]'
                            : 'border-[#DDE2E8] text-[#2C3E50]'
                        }`}
                      >
                        {dia}
                      </button>
                    ))}
                  </div>
                  <Button variant="outline" className="mt-6" onClick={() => setEtapa(2)}>
                    <ChevronLeft className="w-5 h-5 mr-2" />
                    Voltar
                  </Button>
                </div>
              )}

              {etapa === 4 && (
                <div>
                  <h3 className="text-xl mb-4 text-[#2C3E50] font-bold">Selecione o horário</h3>
                  <p className="text-sm text-[#6C757D] mb-6">Horários indisponíveis seguem a disponibilidade cadastrada no backend.</p>
                  <div className="grid grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
                    {horariosExibidos.map((hora) => {
                      const indisponivel = !horariosDisponiveis.includes(hora);
                      return (
                        <button
                          key={hora}
                          onClick={() => {
                            if (!indisponivel) {
                              setAgendamento({ ...agendamento, horario: hora });
                              setEtapa(5);
                            }
                          }}
                          disabled={indisponivel}
                          className={`p-3 sm:p-4 border-2 rounded-xl font-medium transition-all ${
                            indisponivel
                              ? 'border-[#E8EBF0] bg-[#F5F7FA] text-[#ADB5BD] cursor-not-allowed opacity-60'
                              : agendamento.horario === hora
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
                  <Button variant="outline" className="mt-6" onClick={() => setEtapa(3)}>
                    <ChevronLeft className="w-5 h-5 mr-2" />
                    Voltar
                  </Button>
                </div>
              )}

              {etapa === 5 && (
                <div>
                  <h3 className="text-xl mb-6 text-[#2C3E50] font-bold">Revisar agendamento</h3>
                  <div className="space-y-4 mb-8">
                    <div className="flex justify-between py-3 border-b">
                      <span className="text-[#6C757D]">Especialidade:</span>
                      <span className="text-[#2C3E50] font-medium">{agendamento.especialidade}</span>
                    </div>
                    <div className="flex justify-between py-3 border-b">
                      <span className="text-[#6C757D]">Profissional:</span>
                      <span className="text-[#2C3E50] font-medium">{agendamento.profissional}</span>
                    </div>
                    <div className="flex justify-between py-3 border-b">
                      <span className="text-[#6C757D]">Data:</span>
                      <span className="text-[#2C3E50] font-medium">{agendamento.data}</span>
                    </div>
                    <div className="flex justify-between py-3">
                      <span className="text-[#6C757D]">Horário:</span>
                      <span className="text-[#2C3E50] font-medium">{agendamento.horario}</span>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <Button variant="outline" className="flex-1" onClick={() => setEtapa(4)}>
                      <ChevronLeft className="w-5 h-5 mr-2" />
                      Voltar
                    </Button>
                    <Button className="flex-1" onClick={handleConfirmar} disabled={submitting}>
                      {submitting ? 'Confirmando...' : 'Confirmar Agendamento'}
                      <ChevronRight className="w-5 h-5 ml-2" />
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          </>
        ) : (
          <Card className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-[#E8F5F1] to-[#E3F2F7] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Check className="w-10 h-10 text-[#4CAF93]" />
            </div>
            <h3 className="text-2xl sm:text-3xl mb-4 text-[#2C3E50] font-bold">Consulta agendada com sucesso!</h3>
            <p className="text-[#6C757D] mb-8">Você receberá um lembrete por e-mail 24 horas antes da consulta.</p>
            <div className="bg-[#E8F5F1] border border-[#4CAF93]/20 rounded-2xl p-6 mb-8">
              <h4 className="mb-4 text-[#2C3E50] font-bold">Detalhes da consulta</h4>
              <div className="space-y-2 text-left max-w-md mx-auto">
                <div className="flex justify-between">
                  <span className="text-[#6C757D]">Especialidade:</span>
                  <span className="text-[#2C3E50] font-medium">{agendamento.especialidade}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6C757D]">Profissional:</span>
                  <span className="text-[#2C3E50] font-medium">{agendamento.profissional}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6C757D]">Data:</span>
                  <span className="text-[#2C3E50] font-medium">{agendamento.data}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6C757D]">Horário:</span>
                  <span className="text-[#2C3E50] font-medium">{agendamento.horario}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-4 justify-center">
              <Button onClick={() => navigate('/dashboard')}>Voltar ao Dashboard</Button>
              <Button variant="outline" onClick={() => navigate('/minhas-consultas')}>
                Ver Minhas Consultas
              </Button>
            </div>
          </Card>
        )}
      </main>
    </div>
  );
}
