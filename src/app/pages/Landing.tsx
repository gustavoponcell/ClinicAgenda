import { useNavigate } from 'react-router';
import { Calendar, Clock, Bell, Shield, Map } from 'lucide-react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';

export default function Landing() {
  const navigate = useNavigate();

  const beneficios = [
    {
      icon: Calendar,
      titulo: 'Agendamento Online',
      descricao: 'Agende suas consultas 24/7 de forma rápida e prática',
    },
    {
      icon: Bell,
      titulo: 'Lembretes Automáticos',
      descricao: 'Receba lembretes antes da sua consulta por email',
    },
    {
      icon: Clock,
      titulo: 'Organização da Agenda',
      descricao: 'Visualize todas as suas consultas em um só lugar',
    },
    {
      icon: Shield,
      titulo: 'Segurança e Privacidade',
      descricao: 'Seus dados protegidos de acordo com a LGPD',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E3F2F7] via-white to-[#E8F5F1]">
      <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-[#DDE2E8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-[#2E7D9A] to-[#4CAF93] rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-white text-2xl font-bold">+</span>
            </div>
            <h1 className="text-3xl text-[#2C3E50] font-bold">ClinicAgenda</h1>
          </div>
          <div className="flex gap-3">
            <Button
              variant="secondary"
              onClick={() => navigate('/mapa-prototipo')}
              className="hidden sm:flex"
            >
              <Map className="w-4 h-4 mr-2" />
              Mapa do Protótipo
            </Button>
            <Button variant="outline" onClick={() => navigate('/login')}>
              Entrar
            </Button>
            <Button onClick={() => navigate('/cadastro')}>Criar conta</Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-5xl mb-6 text-[#2C3E50] font-bold">
            Agende suas consultas com praticidade
          </h2>
          <p className="text-lg sm:text-xl text-[#6C757D] mb-8 max-w-2xl mx-auto">
            Sistema completo de agendamento médico online. Simplicidade para pacientes,
            organização para profissionais.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={() => navigate('/agendamento')}>
              <Calendar className="w-5 h-5 mr-2" />
              Agendar Consulta
            </Button>
            <Button
              size="lg"
              variant="secondary"
              onClick={() => navigate('/cadastro')}
            >
              Criar Conta
            </Button>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {beneficios.map((beneficio, index) => {
            const Icon = beneficio.icon;
            return (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-gradient-to-br from-[#E3F2F7] to-[#E8F5F1] rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-8 h-8 text-[#2E7D9A]" />
                </div>
                <h3 className="mb-2 text-[#2C3E50] font-bold">{beneficio.titulo}</h3>
                <p className="text-[#6C757D] text-sm">{beneficio.descricao}</p>
              </Card>
            );
          })}
        </div>

        <Card className="bg-gradient-to-r from-[#2E7D9A] to-[#4CAF93] text-white text-center">
          <h3 className="text-2xl sm:text-3xl mb-4 font-bold">
            Pronto para começar?
          </h3>
          <p className="mb-6 text-white/90">
            Crie sua conta gratuita e comece a gerenciar suas consultas agora mesmo
          </p>
          <div className="flex justify-center">
            <Button
              size="lg"
              variant="secondary"
              onClick={() => navigate('/cadastro')}
              className="bg-white text-[#2E7D9A] hover:bg-gray-50"
            >
              Criar Conta Grátis
            </Button>
          </div>
        </Card>
      </main>

      <footer className="bg-white border-t border-[#DDE2E8] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={() => navigate('/admin/login')}
              className="text-sm text-[#6C757D] hover:text-[#2E7D9A] transition-colors"
            >
              Acesso para Funcionários e Administradores →
            </button>
            <span className="hidden sm:block text-[#DDE2E8]">|</span>
            <button
              onClick={() => navigate('/mapa-prototipo')}
              className="text-sm text-[#6C757D] hover:text-[#2E7D9A] transition-colors flex items-center gap-2"
            >
              <Map className="w-4 h-4" />
              Ver Mapa do Protótipo
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
