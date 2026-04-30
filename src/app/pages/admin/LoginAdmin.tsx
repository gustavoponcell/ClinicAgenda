import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { Card } from '../../components/Card';
import { Shield } from 'lucide-react';

export default function LoginAdmin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const adminUser = {
      nome: 'Dr. Roberto Silva',
      email: email,
      cargo: 'administrador',
    };
    localStorage.setItem('adminUser', JSON.stringify(adminUser));
    navigate('/admin/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E3F2F7] via-white to-[#E8F5F1] flex flex-col">
      <header className="bg-white shadow-sm border-b border-[#DDE2E8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div
            className="flex items-center gap-3 cursor-pointer w-fit"
            onClick={() => navigate('/')}
          >
            <div className="w-12 h-12 bg-gradient-to-br from-[#2E7D9A] to-[#4CAF93] rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-white text-2xl font-bold">+</span>
            </div>
            <div>
              <h1 className="text-3xl text-[#2C3E50] font-bold">ClinicAgenda</h1>
              <p className="text-xs text-[#6C757D]">Painel Administrativo</p>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-[#E3F2F7] to-[#E8F5F1] rounded-2xl flex items-center justify-center shadow-lg">
              <Shield className="w-10 h-10 text-[#2E7D9A]" />
            </div>
          </div>

          <h2 className="text-3xl mb-2 text-center text-[#2C3E50] font-bold">
            Área Administrativa
          </h2>
          <p className="text-[#6C757D] text-center mb-8">
            Acesso exclusivo para funcionários e administradores
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="E-mail"
              type="email"
              placeholder="funcionario@clinica.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Input
              label="Senha"
              type="password"
              placeholder="••••••••"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />

            <Button type="submit" className="w-full" size="lg">
              Entrar no Painel
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => navigate('/')}
              className="text-[#2E7D9A] hover:underline text-sm font-medium"
            >
              ← Voltar para área do paciente
            </button>
          </div>
        </Card>
      </main>
    </div>
  );
}
