import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Calendar, User, Clock, AlertCircle } from 'lucide-react';
import { Header } from '../components/Header';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { ConsultaPaciente, getStatusClassName, getStatusLabel } from '../data/mockData';

export default function MinhasConsultas() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [consultas, setConsultas] = useState<ConsultaPaciente[]>([]);
  const [filtro, setFiltro] = useState<'todas' | 'futuras' | 'passadas'>('futuras');

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      const userData = JSON.parse(user);
      setUserName(userData.nome);
    } else {
      navigate('/login');
    }

    const storedConsultas = JSON.parse(localStorage.getItem('consultas') || '[]');
    setConsultas(storedConsultas);
  }, [navigate]);

  const handleCancelar = (id: number) => {
    if (
      window.confirm(
        'Tem certeza que deseja cancelar esta consulta? Cancelamentos devem ser feitos com no mínimo 24h de antecedência.'
      )
    ) {
      const updated = consultas.map<ConsultaPaciente>((c) =>
        c.id === id ? { ...c, status: 'cancelada' } : c
      );
      setConsultas(updated);
      localStorage.setItem('consultas', JSON.stringify(updated));
    }
  };

  const consultasFiltradas = consultas.filter((c) => {
    if (filtro === 'futuras') return c.status === 'agendada';
    if (filtro === 'passadas') return c.status === 'cancelada' || c.status === 'realizada';
    return true;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E3F2F7] via-white to-[#E8F5F1]">
      <Header showUserMenu userName={userName} />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl mb-4 text-[#2C3E50] font-bold">Minhas Consultas</h2>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setFiltro('futuras')}
              className={`px-4 py-2 rounded-xl font-medium transition-all ${
                filtro === 'futuras'
                  ? 'bg-gradient-to-r from-[#2E7D9A] to-[#4CAF93] text-white shadow-md'
                  : 'bg-white text-[#2C3E50] border border-[#DDE2E8] hover:bg-[#E3F2F7]'
              }`}
            >
              Futuras
            </button>
            <button
              onClick={() => setFiltro('passadas')}
              className={`px-4 py-2 rounded-xl font-medium transition-all ${
                filtro === 'passadas'
                  ? 'bg-gradient-to-r from-[#2E7D9A] to-[#4CAF93] text-white shadow-md'
                  : 'bg-white text-[#2C3E50] border border-[#DDE2E8] hover:bg-[#E3F2F7]'
              }`}
            >
              Passadas
            </button>
            <button
              onClick={() => setFiltro('todas')}
              className={`px-4 py-2 rounded-xl font-medium transition-all ${
                filtro === 'todas'
                  ? 'bg-gradient-to-r from-[#2E7D9A] to-[#4CAF93] text-white shadow-md'
                  : 'bg-white text-[#2C3E50] border border-[#DDE2E8] hover:bg-[#E3F2F7]'
              }`}
            >
              Todas
            </button>
          </div>
        </div>

        {consultasFiltradas.length === 0 ? (
          <Card className="text-center py-12">
            <Calendar className="w-16 h-16 text-[#6C757D] mx-auto mb-4" />
            <h3 className="text-xl mb-2 text-[#2C3E50] font-bold">
              Nenhuma consulta encontrada
            </h3>
            <p className="text-[#6C757D] mb-6">
              Você ainda não possui consultas nesta categoria.
            </p>
            <Button onClick={() => navigate('/agendamento')}>
              Agendar Nova Consulta
            </Button>
          </Card>
        ) : (
          <div className="space-y-4">
            {consultasFiltradas.map((consulta) => (
              <Card key={consulta.id}>
                <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-3">
                      <h3 className="text-xl text-[#2C3E50] font-bold">
                        {consulta.especialidade}
                      </h3>
                      <span
                        className={`px-3 py-1 rounded-full border text-sm font-medium ${getStatusClassName(consulta.status)}`}
                      >
                        {getStatusLabel(consulta.status)}
                      </span>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4 text-[#6C757D]">
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
                  </div>

                  {consulta.status === 'agendada' && (
                    <div className="flex flex-col sm:flex-row gap-3 lg:ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/reagendamento/${consulta.id}`)}
                      >
                        Reagendar
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleCancelar(consulta.id)}
                      >
                        Cancelar
                      </Button>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}

        <Card className="mt-8 bg-amber-50 border border-amber-200">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="mb-1 text-amber-900">Importante</h4>
              <p className="text-amber-800">
                Cancelamentos devem ser feitos com no mínimo 24 horas de
                antecedência. Caso contrário, você poderá ser cobrado pela consulta.
              </p>
            </div>
          </div>
        </Card>

        <div className="mt-8 text-center">
          <Button onClick={() => navigate('/dashboard')}>
            Voltar ao Dashboard
          </Button>
        </div>
      </main>
    </div>
  );
}
