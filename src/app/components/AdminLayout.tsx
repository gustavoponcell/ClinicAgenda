import { ReactNode, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import {
  LayoutDashboard,
  Calendar,
  Users,
  UserCog,
  Clock,
  BarChart3,
  History,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { clearSession, getStoredUser, getToken } from '../services/authStorage';

interface AdminLayoutProps {
  children: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const user = getStoredUser<any>('admin') || {};
  const isAdmin = user.cargo === 'ADMIN';

  useEffect(() => {
    if (!getToken('admin')) {
      navigate('/admin/login');
    }
  }, [navigate]);

  const menuItems = [
    { path: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/admin/agenda', icon: Calendar, label: 'Agenda' },
    { path: '/admin/profissionais', icon: UserCog, label: 'Profissionais', adminOnly: true },
    { path: '/admin/horarios', icon: Clock, label: 'Horários', adminOnly: true },
    { path: '/admin/funcionarios', icon: Users, label: 'Funcionários', adminOnly: true },
    { path: '/admin/relatorios', icon: BarChart3, label: 'Relatórios', adminOnly: true },
    { path: '/admin/historico', icon: History, label: 'Histórico', adminOnly: true },
  ];

  const filteredMenuItems = menuItems.filter(item => !item.adminOnly || isAdmin);

  const handleLogout = () => {
    clearSession('admin');
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E3F2F7] via-white to-[#E8F5F1] flex">
      {/* Sidebar Desktop */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 bg-white border-r border-[#DDE2E8] fixed h-screen">
        <div className="p-6 border-b border-[#DDE2E8]">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-[#2E7D9A] to-[#4CAF93] rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-white text-2xl font-bold">+</span>
            </div>
            <div>
              <h1 className="text-xl text-[#2C3E50] font-bold">ClinicAgenda</h1>
              <p className="text-xs text-[#6C757D]">Painel Admin</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-1">
            {filteredMenuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-[#2E7D9A] to-[#4CAF93] text-white shadow-md'
                      : 'text-[#6C757D] hover:bg-[#F5F7FA] hover:text-[#2C3E50]'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </nav>

        <div className="p-4 border-t border-[#DDE2E8]">
          <div className="mb-3 px-4 py-2 bg-[#F5F7FA] rounded-xl">
            <p className="text-sm text-[#2C3E50] font-medium">{user.nome || 'Usuário admin'}</p>
            <p className="text-xs text-[#6C757D] capitalize">{user.cargo || 'sem sessão'}</p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[#6C757D] hover:bg-[#FFEBEE] hover:text-[#E57373] transition-all font-medium"
          >
            <LogOut className="w-5 h-5" />
            <span>Sair</span>
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-white border-b border-[#DDE2E8] z-50 shadow-sm">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-[#2E7D9A] to-[#4CAF93] rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-white text-xl font-bold">+</span>
            </div>
            <h1 className="text-xl text-[#2C3E50] font-bold">ClinicAgenda</h1>
          </div>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 hover:bg-[#F5F7FA] rounded-xl transition-colors"
          >
            {mobileMenuOpen ? <X className="w-6 h-6 text-[#2C3E50]" /> : <Menu className="w-6 h-6 text-[#2C3E50]" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="bg-white border-t border-[#DDE2E8] p-4">
            <div className="space-y-1">
              {filteredMenuItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <button
                    key={item.path}
                    onClick={() => {
                      navigate(item.path);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-[#2E7D9A] to-[#4CAF93] text-white shadow-md'
                        : 'text-[#6C757D] hover:bg-[#F5F7FA] hover:text-[#2C3E50]'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[#6C757D] hover:bg-[#FFEBEE] hover:text-[#E57373] transition-all font-medium"
              >
                <LogOut className="w-5 h-5" />
                <span>Sair</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 pt-16 lg:pt-0">
        {children}
      </main>
    </div>
  );
}
