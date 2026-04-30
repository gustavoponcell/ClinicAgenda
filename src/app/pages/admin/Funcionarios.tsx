import { useState } from 'react';
import { AdminLayout } from '../../components/AdminLayout';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { Users, Plus, Shield, Edit, Trash2 } from 'lucide-react';

export default function Funcionarios() {
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    cargo: 'recepcionista',
    senha: '',
  });

  const [funcionarios, setFuncionarios] = useState([
    {
      id: 1,
      nome: 'Dr. Roberto Silva',
      email: 'roberto.silva@clinica.com',
      telefone: '(11) 98765-1111',
      cargo: 'administrador',
    },
    {
      id: 2,
      nome: 'Juliana Santos',
      email: 'juliana.santos@clinica.com',
      telefone: '(11) 98765-2222',
      cargo: 'recepcionista',
    },
    {
      id: 3,
      nome: 'Carlos Mendes',
      email: 'carlos.mendes@clinica.com',
      telefone: '(11) 98765-3333',
      cargo: 'recepcionista',
    },
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const novoFuncionario = {
      id: Date.now(),
      ...formData,
    };
    setFuncionarios([...funcionarios, novoFuncionario]);
    setMostrarFormulario(false);
    setFormData({
      nome: '',
      email: '',
      telefone: '',
      cargo: 'recepcionista',
      senha: '',
    });
    alert('Funcionário cadastrado com sucesso!');
  };

  const handleExcluir = (id: number) => {
    if (window.confirm('Deseja excluir este funcionário?')) {
      setFuncionarios(funcionarios.filter((f) => f.id !== id));
    }
  };

  const getPermissoes = (cargo: string) => {
    if (cargo === 'administrador') {
      return 'Acesso total: Agenda, Profissionais, Funcionários e Relatórios';
    }
    return 'Acesso limitado: Agenda e Pacientes';
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

              <div className="grid md:grid-cols-2 gap-4">
                <Input
                  label="E-mail"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
                <Input
                  label="Telefone"
                  type="tel"
                  value={formData.telefone}
                  onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block mb-2 text-[#2C3E50]">Cargo</label>
                <div className="grid md:grid-cols-2 gap-4">
                  <label className="flex items-start gap-3 p-4 border-2 border-[#DDE2E8] rounded-xl cursor-pointer hover:border-[#2E7D9A] has-[:checked]:border-[#2E7D9A] has-[:checked]:bg-[#E3F2F7]">
                    <input
                      type="radio"
                      name="cargo"
                      value="recepcionista"
                      checked={formData.cargo === 'recepcionista'}
                      onChange={(e) =>
                        setFormData({ ...formData, cargo: e.target.value })
                      }
                      className="mt-1"
                    />
                    <div>
                      <p className="text-[#2C3E50] mb-1 font-medium">Recepcionista</p>
                      <p className="text-sm text-[#6C757D]">
                        Acesso limitado: Agenda e Pacientes
                      </p>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 p-4 border-2 border-[#DDE2E8] rounded-xl cursor-pointer hover:border-[#2E7D9A] has-[:checked]:border-[#2E7D9A] has-[:checked]:bg-[#E3F2F7]">
                    <input
                      type="radio"
                      name="cargo"
                      value="administrador"
                      checked={formData.cargo === 'administrador'}
                      onChange={(e) =>
                        setFormData({ ...formData, cargo: e.target.value })
                      }
                      className="mt-1"
                    />
                    <div>
                      <p className="text-[#2C3E50] mb-1 font-medium">Administrador</p>
                      <p className="text-sm text-[#6C757D]">
                        Acesso total: Todas as funcionalidades
                      </p>
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
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setMostrarFormulario(false)}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </Card>
        )}

        <div className="grid gap-4">
          {funcionarios.map((func) => (
            <Card key={func.id}>
              <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                <div className="flex gap-4 flex-1">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      func.cargo === 'administrador'
                        ? 'bg-[#E3F2F7]'
                        : 'bg-[#E8F5F1]'
                    }`}
                  >
                    {func.cargo === 'administrador' ? (
                      <Shield className="w-6 h-6 text-[#2E7D9A]" />
                    ) : (
                      <Users className="w-6 h-6 text-[#4CAF93]" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-[#2C3E50] font-bold">{func.nome}</h3>
                      <span
                        className={`px-3 py-1 rounded-full text-sm ${
                          func.cargo === 'administrador'
                            ? 'bg-[#E3F2F7] text-[#2E7D9A]'
                            : 'bg-[#E8F5F1] text-[#4CAF93]'
                        }`}
                      >
                        {func.cargo === 'administrador'
                          ? 'Administrador'
                          : 'Recepcionista'}
                      </span>
                    </div>
                    <p className="text-sm text-[#6C757D] mb-3">
                      {getPermissoes(func.cargo)}
                    </p>
                    <div className="grid md:grid-cols-2 gap-2 text-sm text-[#6C757D]">
                      <p>{func.email}</p>
                      <p>{func.telefone}</p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button variant="outline" size="sm">
                    <Edit className="w-4 h-4 mr-1" />
                    Editar
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleExcluir(func.id)}
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Excluir
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
