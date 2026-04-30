import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { ChevronLeft, ArrowRight, Check } from 'lucide-react';
import { Header } from '../components/Header';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import {
  ConsultaPaciente,
  horariosAtendimento,
  horariosOcupadosReagendamento,
} from '../data/mockData';

export default function Reagendamento() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [userName, setUserName] = useState('');
  const [consultaOriginal, setConsultaOriginal] = useState<ConsultaPaciente | null>(null);
  const [novaData, setNovaData] = useState('');
  const [novoHorario, setNovoHorario] = useState('');
  const [confirmado, setConfirmado] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      const userData = JSON.parse(user);
      setUserName(userData.nome);
    } else {
      navigate('/login');
    }

    const consultas = JSON.parse(localStorage.getItem('consultas') || '[]');
    const consulta = consultas.find((c: any) => c.id === Number(id));
    if (consulta) {
      setConsultaOriginal(consulta);
    }
  }, [id, navigate]);

  const proximosDias = Array.from({ length: 14 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i + 1);
    return date.toLocaleDateString('pt-BR');
  });

  const handleConfirmarReagendamento = () => {
    const consultas = JSON.parse(localStorage.getItem('consultas') || '[]');
    const updated = consultas.map((c: any) =>
      c.id === Number(id)
        ? { ...c, data: novaData, horario: novoHorario, status: 'reagendada' }
        : c
    );
    localStorage.setItem('consultas', JSON.stringify(updated));
    setConfirmado(true);
  };

  if (!consultaOriginal) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#E3F2F7] via-white to-[#E8F5F1]">
        <Header showUserMenu userName={userName} />
        <main className="max-w-4xl mx-auto px-4 py-8">
          <Card className="text-center">
            <p className="text-[#6C757D]">Consulta não encontrada</p>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E3F2F7] via-white to-[#E8F5F1]">
      <Header showUserMenu userName={userName} />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!confirmado ? (
          <>
            <div className="mb-8">
              <button
                onClick={() => navigate('/minhas-consultas')}
                className="flex items-center text-[#2E7D9A] hover:underline mb-4"
              >
                <ChevronLeft className="w-5 h-5" />
                Voltar para Minhas Consultas
              </button>
              <h2 className="text-3xl text-[#2C3E50] font-bold">Reagendar Consulta</h2>
            </div>

            <Card className="mb-6">
              <h3 className="text-xl mb-4 text-[#2C3E50] font-bold">
                Consulta Original
              </h3>
              <div className="grid md:grid-cols-2 gap-4 bg-[#F5F7FA] p-4 rounded-xl">
                <div>
                  <p className="text-sm text-[#6C757D]">Especialidade</p>
                  <p className="text-[#2C3E50]">{consultaOriginal.especialidade}</p>
                </div>
                <div>
                  <p className="text-sm text-[#6C757D]">Profissional</p>
                  <p className="text-[#2C3E50]">{consultaOriginal.profissional}</p>
                </div>
                <div>
                  <p className="text-sm text-[#6C757D]">Data</p>
                  <p className="text-[#2C3E50]">{consultaOriginal.data}</p>
                </div>
                <div>
                  <p className="text-sm text-[#6C757D]">Horário</p>
                  <p className="text-[#2C3E50]">{consultaOriginal.horario}</p>
                </div>
              </div>
            </Card>

            <Card className="mb-6">
              <h3 className="text-xl mb-6 text-[#2C3E50] font-bold">
                Selecione a nova data
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {proximosDias.map((dia) => (
                  <button
                    key={dia}
                    onClick={() => setNovaData(dia)}
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
                <h3 className="text-xl mb-6 text-[#2C3E50] font-bold">
                  Selecione o novo horário
                </h3>
                <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
                  {horariosAtendimento.map((hora) => {
                    const ocupado = horariosOcupadosReagendamento.includes(hora);
                    return (
                      <button
                        key={hora}
                        onClick={() => !ocupado && setNovoHorario(hora)}
                        disabled={ocupado}
                        className={`p-4 border-2 rounded-xl font-medium transition-all ${
                          ocupado
                            ? 'border-[#E8EBF0] bg-[#F5F7FA] text-[#ADB5BD] cursor-not-allowed opacity-60'
                            : novoHorario === hora
                            ? 'border-[#4CAF93] bg-[#E8F5F1] text-[#4CAF93] shadow-md'
                            : 'border-[#DDE2E8] text-[#2C3E50] hover:border-[#4CAF93] hover:bg-[#E8F5F1]'
                        }`}
                      >
                        {hora}
                        {ocupado && (
                          <span className="block text-xs mt-1">Indisponível</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </Card>
            )}

            {novaData && novoHorario && (
              <Card>
                <h3 className="text-xl mb-4 text-[#2C3E50] font-bold">
                  Resumo do Reagendamento
                </h3>
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <p className="text-sm text-[#6C757D] mb-3">Antes</p>
                    <div className="space-y-2">
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-[#6C757D]">Data:</span>
                        <span className="text-[#2C3E50]">
                          {consultaOriginal.data}
                        </span>
                      </div>
                      <div className="flex justify-between py-2">
                        <span className="text-[#6C757D]">Horário:</span>
                        <span className="text-[#2C3E50]">
                          {consultaOriginal.horario}
                        </span>
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
                <Button
                  className="w-full"
                  size="lg"
                  onClick={handleConfirmarReagendamento}
                >
                  Confirmar Reagendamento
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
            <h3 className="text-3xl mb-4 text-[#2C3E50] font-bold">
              Consulta reagendada com sucesso!
            </h3>
            <p className="text-[#6C757D] mb-8">
              Você receberá um novo lembrete por e-mail 24 horas antes da consulta.
            </p>
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
              <Button onClick={() => navigate('/minhas-consultas')}>
                Ver Minhas Consultas
              </Button>
              <Button variant="outline" onClick={() => navigate('/dashboard')}>
                Voltar ao Dashboard
              </Button>
            </div>
          </Card>
        )}
      </main>
    </div>
  );
}
