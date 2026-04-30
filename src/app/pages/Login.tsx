import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Card } from '../components/Card';
import { api } from '../services/api';
import { saveSession } from '../services/authStorage';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const session = await api.patientLogin({ email, senha });
      saveSession('patient', session.token, session.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível entrar');
    } finally {
      setLoading(false);
    }
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
            Entrar
          </h2>
          <p className="text-[#6C757D] text-center mb-8">
            Acesse sua conta para gerenciar suas consultas
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="E-mail"
              type="email"
              placeholder="seu@email.com"
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

            {error && (
              <p className="rounded-xl bg-[#FFEBEE] px-4 py-3 text-sm text-[#E57373]">
                {error}
              </p>
            )}

            <div className="flex justify-end">
              <button
                type="button"
                className="text-[#2E7D9A] hover:underline text-sm font-medium"
              >
                Esqueci minha senha
              </button>
            </div>

            <Button type="submit" className="w-full" size="lg" disabled={loading}>
              {loading ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-[#6C757D]">
              Não tem uma conta?{' '}
              <button
                onClick={() => navigate('/cadastro')}
                className="text-[#2E7D9A] hover:underline font-medium"
              >
                Criar conta
              </button>
            </p>
          </div>
        </Card>
      </main>
    </div>
  );
}
