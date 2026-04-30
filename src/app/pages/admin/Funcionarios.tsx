import { useEffect, useState } from 'react';
import { AdminLayout } from '../../components/AdminLayout';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { Users, Plus, Shield, Edit, Trash2 } from 'lucide-react';
import { api, Employee } from '../../services/api';

export default function Funcionarios() {
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    cargo: 'RECEPCIONISTA' as Employee['cargo'],
    senha: '',
  });
  const [funcionarios, setFuncionarios] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadFuncionarios() {
      try {
        const response = await api.listEmployees();
        setFuncionarios(response.items);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar funcionários');
      } finally {
        setLoading(false);
      }
    }

    loadFuncionarios();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const novoFuncionario = await api.createEmployee(formData);
      setFuncionarios((current) => [...current, novoFuncionario]);
      setMostrarFormulario(false);
      setFormData({
        nome: '',
        email: '',
        cargo: 'RECEPCIONISTA',
        senha: '',
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao cadastrar funcionário');
    }
  };

  const handleExcluir = async (id: string) => {
    if (!window.confirm('Deseja excluir este funcionário?')) return;

    try {
      await api.deleteEmployee(id);
      setFuncionarios((current) => current.filter((f) => f.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao excluir funcionário');
    }
  };

  const getPermissoes = (cargo: Employee['cargo']) => {
    if (cargo === 'ADMIN') {
      return 'Acesso total: Agenda, Profissionais, Funcionários, Relatórios e Histórico';
    }
    return 'Acesso limitado: Agenda, Pacientes, Profissionais e Horários';
  };

  return (
    <AdminLayout>
      <div className="p-6 bg-gradient-to-br from-[#F5F7FA] to-white min-h-screen">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-3xl mb-2 text-[#2C3E50] font-bold">Funcionários</h2>
            <p className="text-[#6C757D]">Gerencie recepcionistas e administradores</p>
          </div>
          <Button onClick={() => setMostrarFormulario(!mostrarFormulario)}>
            <Plus className="w-5 h-5 mr-2" />
            Novo Funcionário
          </Button>
        </div>

        {error && (
          <div className="mb-6 rounded-2xl border border-[#E57373]/30 bg-[#FFEBEE] px-4 py-3 text-[#E57373]">
            {error}
          </div>
        )}

        {mostrarFormulario && (
          <Card className="mb-6">
            <h3 className="mb-6 text-[#2C3E50] font-bold">Cadastrar Novo Funcionário</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Nome completo"
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                required
              />

              <Input
                label="E-mail"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />

              <div>
                <label className="block mb-2 text-[#2C3E50]">Cargo</label>
                <div className="grid md:grid-cols-2 gap-4">
                  <label className="flex items-start gap-3 p-4 border-2 border-[#DDE2E8] rounded-xl cursor-pointer hover:border-[#2E7D9A] has-[:checked]:border-[#2E7D9A] has-[:checked]:bg-[#E3F2F7]">
                    <input
                      type="radio"
                      name="cargo"
                      value="RECEPCIONISTA"
                      checked={formData.cargo === 'RECEPCIONISTA'}
                      onChange={(e) => setFormData({ ...formData, cargo: e.target.value as Employee['cargo'] })}
                      className="mt-1"
                    />
                    <div>
                      <p className="text-[#2C3E50] mb-1 font-medium">Recepcionista</p>
                      <p className="text-sm text-[#6C757D]">Acesso operacional à agenda</p>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 p-4 border-2 border-[#DDE2E8] rounded-xl cursor-pointer hover:border-[#2E7D9A] has-[:checked]:border-[#2E7D9A] has-[:checked]:bg-[#E3F2F7]">
                    <input
                      type="radio"
                      name="cargo"
                      value="ADMIN"
                      checked={formData.cargo === 'ADMIN'}
                      onChange={(e) => setFormData({ ...formData, cargo: e.target.value as Employee['cargo'] })}
                      className="mt-1"
                    />
                    <div>
                      <p className="text-[#2C3E50] mb-1 font-medium">Administrador</p>
                      <p className="text-sm text-[#6C757D]">Acesso total ao sistema</p>
                    </div>
                  </label>
                </div>
              </div>

              <Input
                label="Senha provisória"
                type="password"
                placeholder="Mínimo 8 caracteres"
                value={formData.senha}
                onChange={(e) => setFormData({ ...formData, senha: e.target.value })}
                required
              />

              <div className="flex gap-3 pt-4">
                <Button type="submit" className="flex-1">
                  Salvar Funcionário
                </Button>
                <Button type="button" variant="outline" onClick={() => setMostrarFormulario(false)}>
                  Cancelar
                </Button>
              </div>
            </form>
          </Card>
        )}

        {loading ? (
          <Card className="text-center text-[#6C757D]">Carregando funcionários...</Card>
        ) : (
          <div className="grid gap-4">
            {funcionarios.map((func) => (
              <Card key={func.id}>
                <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                  <div className="flex gap-4 flex-1">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${func.cargo === 'ADMIN' ? 'bg-[#E3F2F7]' : 'bg-[#E8F5F1]'}`}>
                      {func.cargo === 'ADMIN' ? <Shield className="w-6 h-6 text-[#2E7D9A]" /> : <Users className="w-6 h-6 text-[#4CAF93]" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-[#2C3E50] font-bold">{func.nome}</h3>
                        <span className={`px-3 py-1 rounded-full text-sm ${func.cargo === 'ADMIN' ? 'bg-[#E3F2F7] text-[#2E7D9A]' : 'bg-[#E8F5F1] text-[#4CAF93]'}`}>
                          {func.cargo === 'ADMIN' ? 'Administrador' : 'Recepcionista'}
                        </span>
                      </div>
                      <p className="text-sm text-[#6C757D] mb-3">{getPermissoes(func.cargo)}</p>
                      <div className="grid md:grid-cols-2 gap-2 text-sm text-[#6C757D]">
                        <p>{func.email}</p>
                        <p>{func.ativo ? 'Ativo' : 'Inativo'}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button variant="outline" size="sm">
                      <Edit className="w-4 h-4 mr-1" />
                      Editar
                    </Button>
                    <Button variant="danger" size="sm" onClick={() => handleExcluir(func.id)}>
                      <Trash2 className="w-4 h-4 mr-1" />
                      Excluir
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
