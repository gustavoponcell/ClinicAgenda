import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Card } from '../components/Card';
import { Shield } from 'lucide-react';
import { api } from '../services/api';
import { saveSession } from '../services/authStorage';

export default function Cadastro() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nome: '',
    cpf: '',
    telefone: '',
    email: '',
    senha: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const session = await api.patientRegister(formData);
      saveSession('patient', session.token, session.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível criar a conta');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
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
            <h1 className="text-3xl text-[#2C3E50] font-bold">ClinicAgenda</h1>
          </div>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md">
          <h2 className="text-3xl mb-2 text-center text-[#2C3E50] font-bold">
            Criar Conta
          </h2>
          <p className="text-[#6C757D] text-center mb-8">
            Preencha seus dados para começar
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Nome completo"
              placeholder="Maria Silva"
              value={formData.nome}
              onChange={(e) => handleChange('nome', e.target.value)}
              required
            />

            <Input
              label="CPF"
              placeholder="000.000.000-00"
              value={formData.cpf}
              onChange={(e) => handleChange('cpf', e.target.value)}
              required
            />

            <Input
              label="Telefone"
              type="tel"
              placeholder="(00) 00000-0000"
              value={formData.telefone}
              onChange={(e) => handleChange('telefone', e.target.value)}
              required
            />

            <Input
              label="E-mail"
              type="email"
              placeholder="seu@email.com"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              required
            />

            <Input
              label="Senha"
              type="password"
              placeholder="••••••••"
              value={formData.senha}
              onChange={(e) => handleChange('senha', e.target.value)}
              required
            />

            {error && (
              <p className="rounded-xl bg-[#FFEBEE] px-4 py-3 text-sm text-[#E57373]">
                {error}
              </p>
            )}

            <div className="bg-[#E8F5F1] p-4 rounded-xl flex gap-3 border border-[#4CAF93]/20">
              <Shield className="w-5 h-5 text-[#4CAF93] flex-shrink-0 mt-0.5" />
              <p className="text-sm text-[#2C3E50]">
                Seus dados estão protegidos de acordo com a Lei Geral de Proteção de
                Dados (LGPD)
              </p>
            </div>

            <Button type="submit" className="w-full" size="lg" disabled={loading}>
              {loading ? 'Criando...' : 'Criar Conta'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-[#6C757D]">
              Já tem uma conta?{' '}
              <button
                onClick={() => navigate('/login')}
                className="text-[#2E7D9A] hover:underline font-medium"
              >
                Entrar
              </button>
            </p>
          </div>
        </Card>
      </main>
    </div>
  );
}
