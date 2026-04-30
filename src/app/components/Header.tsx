import { useNavigate } from 'react-router';
import { User, LogOut } from 'lucide-react';
import { clearSession } from '../services/authStorage';

interface HeaderProps {
  showUserMenu?: boolean;
  userName?: string;
}

export function Header({ showUserMenu = false, userName }: HeaderProps) {
  const navigate = useNavigate();

  const handleLogout = () => {
    clearSession('patient');
    navigate('/');
  };

  return (
    <header className="bg-white shadow-sm border-b border-[#DDE2E8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => navigate(showUserMenu ? '/dashboard' : '/')}
        >
          <div className="w-12 h-12 bg-gradient-to-br from-[#2E7D9A] to-[#4CAF93] rounded-2xl flex items-center justify-center shadow-lg">
            <span className="text-white text-2xl font-bold">+</span>
          </div>
          <h1 className="text-2xl sm:text-3xl text-[#2C3E50] font-bold">ClinicAgenda</h1>
        </div>

        {showUserMenu && (
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-[#F5F7FA] rounded-xl">
              <User className="w-5 h-5 text-[#2E7D9A]" />
              <span className="text-[#2C3E50] font-medium">{userName}</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-[#6C757D] hover:text-[#E57373] hover:bg-[#FFEBEE] rounded-xl transition-all"
            >
              <LogOut className="w-5 h-5" />
              <span className="hidden sm:inline">Sair</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
