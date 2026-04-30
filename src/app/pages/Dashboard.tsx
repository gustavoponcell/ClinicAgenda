import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { Calendar, User, Bell, Clock } from 'lucide-react';
import { Header } from '../components/Header';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { api, Appointment, Patient } from '../services/api';
import { getToken, saveSession } from '../services/authStorage';
import { formatDateTime } from '../utils/format';

export default function Dashboard() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [proximaConsulta, setProximaConsulta] = useState<Appointment | null>(null);

  useEffect(() => {
    if (!getToken('patient')) {
      navigate('/login');
      return;
    }

    async function loadDashboard() {
      try {
        const [user, appointments] = await Promise.all([
          api.me<Patient>('patient'),
          api.listMyAppointments(),
        ]);
        saveSession('patient', getToken('patient')!, user);
        setUserName(user.nome);
        setProximaConsulta(
          appointments.items.find((item) => item.status === 'AGENDADA' || item.status === 'REAGENDADA') ?? null,
        );
      } catch {
        navigate('/login');
      }
    }

    loadDashboard();
  }, [navigate]);

  const formattedNext = proximaConsulta ? formatDateTime(proximaConsulta.dataHora) : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E3F2F7] via-white to-[#E8F5F1]">
      <Header showUserMenu userName={userName} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl sm:text-4xl mb-2 text-[#2C3E50] font-bold">
            Olá, {userName.split(' ')[0]}!
          </h2>
          <p className="text-[#6C757D]">
            Bem-vindo ao seu painel de consultas
          </p>
        </div>

        {proximaConsulta && (
          <Card className="mb-8 bg-gradient-to-r from-[#2E7D9A] to-[#4CAF93] text-white border-0">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-white/80 mb-2">Próxima consulta</p>
                <h3 className="text-2xl mb-3">
                  {proximaConsulta.specialty?.nome}
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    <span>{proximaConsulta.professional?.nome}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    <span>{formattedNext?.data}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    <span>{formattedNext?.horario}</span>
                  </div>
                </div>
              </div>
              <Button
                variant="secondary"
                onClick={() => navigate('/minhas-consultas')}
              >
                Ver detalhes
              </Button>
            </div>
          </Card>
        )}

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card
            hover
            onClick={() => navigate('/agendamento')}
            className="text-center cursor-pointer"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-[#E3F2F7] to-[#E8F5F1] rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-[#2E7D9A]" />
            </div>
            <h3 className="mb-2 text-[#2C3E50] font-bold">Agendar Nova Consulta</h3>
            <p className="text-[#6C757D] text-sm">
              Escolha especialidade, profissional e horário
            </p>
          </Card>

          <Card
            hover
            onClick={() => navigate('/minhas-consultas')}
            className="text-center cursor-pointer"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-[#E3F2F7] to-[#E8F5F1] rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-[#2E7D9A]" />
            </div>
            <h3 className="mb-2 text-[#2C3E50] font-bold">Minhas Consultas</h3>
            <p className="text-[#6C757D] text-sm">
              Visualize, cancele ou reagende suas consultas
            </p>
          </Card>

          <Card
            hover
            onClick={() => navigate('/perfil')}
            className="text-center cursor-pointer sm:col-span-2 lg:col-span-1"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-[#E3F2F7] to-[#E8F5F1] rounded-2xl flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8 text-[#2E7D9A]" />
            </div>
            <h3 className="mb-2 text-[#2C3E50] font-bold">Meu Perfil</h3>
            <p className="text-[#6C757D] text-sm">Edite seus dados pessoais</p>
          </Card>
        </div>

        <Card className="mt-8 bg-[#E8F5F1] border border-[#4CAF93]/20">
          <div className="flex items-start gap-3">
            <Bell className="w-6 h-6 text-[#4CAF93] flex-shrink-0 mt-1" />
            <div>
              <h3 className="mb-2 text-[#2C3E50] font-bold">Lembretes e Notificações</h3>
              <p className="text-[#2C3E50]/80">
                Você receberá lembretes automáticos por e-mail 24 horas antes de cada
                consulta agendada.
              </p>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
}
