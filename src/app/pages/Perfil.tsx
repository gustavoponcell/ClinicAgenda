import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { ChevronLeft, Save, Check } from 'lucide-react';
import { Header } from '../components/Header';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { api, Patient } from '../services/api';
import { getToken, saveSession } from '../services/authStorage';

export default function Perfil() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [salvo, setSalvo] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    cpf: '',
    telefone: '',
    email: '',
  });

  useEffect(() => {
    if (!getToken('patient')) {
      navigate('/login');
      return;
    }

    async function loadProfile() {
      try {
        const userData = await api.me<Patient>('patient');
        saveSession('patient', getToken('patient')!, userData);
        setUserName(userData.nome);
      setFormData({
        nome: userData.nome,
        cpf: userData.cpf,
        telefone: userData.telefone || '',
        email: userData.email,
      });
      } catch {
      navigate('/login');
      }
    }

    loadProfile();
  }, [navigate]);

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    setSalvo(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const user = await api.updatePatientMe({
        nome: formData.nome,
        telefone: formData.telefone,
        email: formData.email,
      });
      saveSession('patient', getToken('patient')!, user);
      setUserName(user.nome);
      setFormData({
        nome: user.nome,
        cpf: user.cpf,
        telefone: user.telefone,
        email: user.email,
      });
      setSalvo(true);
      setTimeout(() => setSalvo(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar perfil');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E3F2F7] via-white to-[#E8F5F1]">
      <Header showUserMenu userName={userName} />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center text-[#2E7D9A] hover:underline mb-4"
          >
            <ChevronLeft className="w-5 h-5" />
            Voltar ao Dashboard
          </button>
          <h2 className="text-3xl text-[#2C3E50] font-bold">Meu Perfil</h2>
          <p className="text-[#6C757D] mt-2">
            Gerencie suas informações pessoais
          </p>
        </div>

        <Card>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <p className="rounded-xl bg-[#FFEBEE] px-4 py-3 text-sm text-[#E57373]">
                {error}
              </p>
            )}
            <Input
              label="Nome completo"
              value={formData.nome}
              onChange={(e) => handleChange('nome', e.target.value)}
              required
            />

            <Input
              label="CPF"
              value={formData.cpf}
              onChange={(e) => handleChange('cpf', e.target.value)}
              required
              disabled
              className="bg-[#E8EBF0] cursor-not-allowed"
            />
            <p className="text-sm text-[#6C757D] -mt-3">
              O CPF não pode ser alterado
            </p>

            <Input
              label="Telefone"
              type="tel"
              value={formData.telefone}
              onChange={(e) => handleChange('telefone', e.target.value)}
              required
            />

            <Input
              label="E-mail"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              required
            />

            <div className="pt-4">
              <Button type="submit" size="lg" className="w-full md:w-auto" disabled={loading}>
                {salvo ? (
                  <>
                    <Check className="w-5 h-5 mr-2" />
                    Alterações Salvas
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5 mr-2" />
                    Salvar Alterações
                  </>
                )}
              </Button>
            </div>
          </form>
        </Card>

        <Card className="mt-6">
          <h3 className="mb-4 text-[#2C3E50] font-bold">Segurança</h3>
          <Button variant="outline">Alterar Senha</Button>
        </Card>
      </main>
    </div>
  );
}
