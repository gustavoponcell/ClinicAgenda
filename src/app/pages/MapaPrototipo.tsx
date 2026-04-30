import { useNavigate } from 'react-router';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import {
  Home,
  UserPlus,
  LogIn,
  LayoutDashboard,
  Calendar,
  CheckCircle,
  Clock,
  User,
  UserCog,
  BarChart3,
  History,
  ArrowRight,
  Shield,
} from 'lucide-react';

export default function MapaPrototipo() {
  const navigate = useNavigate();

  const fluxoPaciente = [
    { label: 'Landing Page', path: '/', icon: Home, cor: '#2E7D9A' },
    { label: 'Cadastro', path: '/cadastro', icon: UserPlus, cor: '#2E7D9A' },
    { label: 'Login', path: '/login', icon: LogIn, cor: '#2E7D9A' },
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, cor: '#4CAF93' },
    { label: 'Agendar Consulta', path: '/agendamento', icon: Calendar, cor: '#4CAF93' },
    { label: 'Confirmação', path: '/agendamento', icon: CheckCircle, cor: '#4CAF93' },
    { label: 'Minhas Consultas', path: '/minhas-consultas', icon: Clock, cor: '#2E7D9A' },
    { label: 'Perfil', path: '/perfil', icon: User, cor: '#2E7D9A' },
  ];

  const fluxoAdmin = [
    { label: 'Login Admin', path: '/admin/login', icon: Shield, cor: '#5DADE2' },
    { label: 'Dashboard Admin', path: '/admin/dashboard', icon: LayoutDashboard, cor: '#5DADE2' },
    { label: 'Agenda', path: '/admin/agenda', icon: Calendar, cor: '#4CAF93' },
    { label: 'Profissionais', path: '/admin/profissionais', icon: UserCog, cor: '#5DADE2' },
    { label: 'Horários', path: '/admin/horarios', icon: Clock, cor: '#5DADE2' },
    { label: 'Funcionários', path: '/admin/funcionarios', icon: UserPlus, cor: '#5DADE2' },
    { label: 'Relatórios', path: '/admin/relatorios', icon: BarChart3, cor: '#4CAF93' },
    { label: 'Histórico', path: '/admin/historico', icon: History, cor: '#5DADE2' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E3F2F7] via-white to-[#E8F5F1]">
      <header className="bg-white shadow-sm border-b border-[#DDE2E8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-[#2E7D9A] to-[#4CAF93] rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-white text-2xl font-bold">+</span>
              </div>
              <div>
                <h1 className="text-3xl text-[#2C3E50] font-bold">ClinicAgenda</h1>
                <p className="text-sm text-[#6C757D]">Mapa do Protótipo</p>
              </div>
            </div>
            <Button onClick={() => navigate('/')}>Voltar ao Início</Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl mb-4 text-[#2C3E50] font-bold">
            Estrutura do Sistema
          </h2>
          <p className="text-lg text-[#6C757D] max-w-3xl mx-auto">
            Protótipo navegável de alta fidelidade desenvolvido para apresentação
            acadêmica e profissional. Explore os dois fluxos principais do sistema.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          <Card>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-[#2E7D9A] rounded-xl flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl text-[#2C3E50] font-bold">Área do Paciente</h3>
                <p className="text-[#6C757D]">Fluxo completo de agendamento</p>
              </div>
            </div>

            <div className="space-y-3">
              {fluxoPaciente.map((item, index) => {
                const Icon = item.icon;
                return (
                  <div key={index}>
                    <button
                      onClick={() => navigate(item.path)}
                      className="w-full flex items-center gap-4 p-4 bg-[#F5F7FA] hover:bg-[#E3F2F7] rounded-xl transition-all group"
                    >
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: item.cor }}
                      >
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1 text-left">
                        <p className="text-[#2C3E50] font-medium">{item.label}</p>
                      </div>
                      <ArrowRight className="w-5 h-5 text-[#6C757D] group-hover:text-[#2E7D9A] transition-colors" />
                    </button>
                    {index < fluxoPaciente.length - 1 && (
                      <div className="flex justify-center py-1">
                        <div className="w-0.5 h-4 bg-[#DDE2E8]" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="mt-6 p-4 bg-[#E3F2F7] rounded-xl">
              <p className="text-sm text-[#2C3E50]">
                <strong>Funcionalidades:</strong> Cadastro de pacientes, agendamento
                online, reagendamento, cancelamento, gestão de perfil e visualização
                de consultas.
              </p>
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-[#5DADE2] rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl text-[#2C3E50] font-bold">Área Administrativa</h3>
                <p className="text-[#6C757D]">Gestão completa do consultório</p>
              </div>
            </div>

            <div className="space-y-3">
              {fluxoAdmin.map((item, index) => {
                const Icon = item.icon;
                return (
                  <div key={index}>
                    <button
                      onClick={() => navigate(item.path)}
                      className="w-full flex items-center gap-4 p-4 bg-[#F5F7FA] hover:bg-[#E3F2F7] rounded-xl transition-all group"
                    >
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: item.cor }}
                      >
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1 text-left">
                        <p className="text-[#2C3E50] font-medium">{item.label}</p>
                      </div>
                      <ArrowRight className="w-5 h-5 text-[#6C757D] group-hover:text-[#5DADE2] transition-colors" />
                    </button>
                    {index < fluxoAdmin.length - 1 && (
                      <div className="flex justify-center py-1">
                        <div className="w-0.5 h-4 bg-[#DDE2E8]" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="mt-6 p-4 bg-[#E3F2F7] rounded-xl">
              <p className="text-sm text-[#2C3E50]">
                <strong>Funcionalidades:</strong> Gestão de agenda, profissionais,
                horários, funcionários, relatórios e histórico de alterações.
              </p>
            </div>
          </Card>
        </div>

        <Card className="bg-gradient-to-r from-[#2E7D9A] to-[#4CAF93] text-white">
          <div className="text-center">
            <h3 className="text-2xl mb-4 font-bold">Recursos Técnicos</h3>
            <div className="grid md:grid-cols-3 gap-6 mb-6">
              <div>
                <p className="text-3xl mb-2">15+</p>
                <p className="text-white/80">Telas Navegáveis</p>
              </div>
              <div>
                <p className="text-3xl mb-2">100%</p>
                <p className="text-white/80">Responsivo</p>
              </div>
              <div>
                <p className="text-3xl mb-2">React</p>
                <p className="text-white/80">+ Tailwind CSS</p>
              </div>
            </div>
            <p className="text-white/90">
              Desenvolvido com React, React Router, TypeScript, Tailwind CSS v4 e
              Recharts. Componentes reutilizáveis, navegação completa e identidade
              visual profissional.
            </p>
          </div>
        </Card>

        <div className="grid md:grid-cols-3 gap-6 mt-8">
          <Card className="text-center">
            <div className="w-16 h-16 bg-[#E3F2F7] rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-[#2E7D9A]" />
            </div>
            <h4 className="mb-2 text-[#2C3E50] font-bold">Design System</h4>
            <p className="text-[#6C757D] text-sm">
              Paleta de cores consistente, componentes reutilizáveis e hierarquia
              visual clara
            </p>
          </Card>

          <Card className="text-center">
            <div className="w-16 h-16 bg-[#E8F5F1] rounded-2xl flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-[#4CAF93]" />
            </div>
            <h4 className="mb-2 text-[#2C3E50] font-bold">UX/UI</h4>
            <p className="text-[#6C757D] text-sm">
              Interface intuitiva, feedback visual em todas as ações e navegação
              fluida
            </p>
          </Card>

          <Card className="text-center">
            <div className="w-16 h-16 bg-[#F5F7FA] rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-[#5DADE2]" />
            </div>
            <h4 className="mb-2 text-[#2C3E50] font-bold">Permissões</h4>
            <p className="text-[#6C757D] text-sm">
              Sistema de controle de acesso diferenciado para pacientes,
              recepcionistas e administradores
            </p>
          </Card>
        </div>
      </main>

      <footer className="bg-white border-t border-[#DDE2E8] py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-[#6C757D] mb-4">
            Protótipo desenvolvido para apresentação acadêmica/profissional
          </p>
          <div className="flex gap-4 justify-center">
            <Button onClick={() => navigate('/')}>Área do Paciente</Button>
            <Button variant="secondary" onClick={() => navigate('/admin/login')}>
              Área Administrativa
            </Button>
          </div>
        </div>
      </footer>
    </div>
  );
}
