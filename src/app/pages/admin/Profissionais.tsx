import { useState } from 'react';
import { AdminLayout } from '../../components/AdminLayout';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { UserCog, Plus, Edit, Trash2 } from 'lucide-react';
import { Profissional, profissionaisMock } from '../../data/mockData';

export default function Profissionais() {
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    especialidade: '',
    registro: '',
    telefone: '',
    email: '',
    diasAtendimento: [] as string[],
    horarioInicio: '',
    horarioFim: '',
  });

  const [profissionais, setProfissionais] = useState<Profissional[]>(profissionaisMock);

  const diasSemana = [
    'Segunda-feira',
    'Terça-feira',
    'Quarta-feira',
    'Quinta-feira',
    'Sexta-feira',
    'Sábado',
  ];

  const handleDiaChange = (dia: string) => {
    if (formData.diasAtendimento.includes(dia)) {
      setFormData({
        ...formData,
        diasAtendimento: formData.diasAtendimento.filter((d) => d !== dia),
      });
    } else {
      setFormData({
        ...formData,
        diasAtendimento: [...formData.diasAtendimento, dia],
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const novoProfissional = {
      id: Date.now(),
      nome: formData.nome,
      especialidade: formData.especialidade,
      registro: formData.registro,
      telefone: formData.telefone,
      email: formData.email,
    };
    setProfissionais([...profissionais, novoProfissional]);
    setMostrarFormulario(false);
    setFormData({
      nome: '',
      especialidade: '',
      registro: '',
      telefone: '',
      email: '',
      diasAtendimento: [],
      horarioInicio: '',
      horarioFim: '',
    });
    alert('Profissional cadastrado com sucesso!');
  };

  const handleExcluir = (id: number) => {
    if (window.confirm('Deseja excluir este profissional?')) {
      setProfissionais(profissionais.filter((p) => p.id !== id));
    }
  };

  return (
    <AdminLayout>
      <div className="p-6 bg-gradient-to-br from-[#F5F7FA] to-white min-h-screen">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-3xl mb-2 text-[#2C3E50] font-bold">Profissionais</h2>
            <p className="text-[#6C757D]">Gerencie médicos e especialistas</p>
          </div>
          <Button onClick={() => setMostrarFormulario(!mostrarFormulario)}>
            <Plus className="w-5 h-5 mr-2" />
            Novo Profissional
          </Button>
        </div>

        {mostrarFormulario && (
          <Card className="mb-6">
            <h3 className="mb-6 text-[#2C3E50] font-bold">Cadastrar Novo Profissional</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <Input
                  label="Nome do profissional"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  required
                />
                <Input
                  label="Especialidade"
                  value={formData.especialidade}
                  onChange={(e) =>
                    setFormData({ ...formData, especialidade: e.target.value })
                  }
                  required
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <Input
                  label="CPF ou Registro Profissional"
                  placeholder="CRM, CRO, etc."
                  value={formData.registro}
                  onChange={(e) => setFormData({ ...formData, registro: e.target.value })}
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

              <Input
                label="E-mail"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />

              <div>
                <label className="block mb-3 text-[#2C3E50]">Dias de Atendimento</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {diasSemana.map((dia) => (
                    <label
                      key={dia}
                      className="flex items-center gap-2 p-3 border border-[#DDE2E8] rounded-xl cursor-pointer hover:bg-[#E3F2F7]"
                    >
                      <input
                        type="checkbox"
                        checked={formData.diasAtendimento.includes(dia)}
                        onChange={() => handleDiaChange(dia)}
                        className="w-4 h-4"
                      />
                      <span className="text-[#2C3E50]">{dia}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <Input
                  label="Horário de início"
                  type="time"
                  value={formData.horarioInicio}
                  onChange={(e) =>
                    setFormData({ ...formData, horarioInicio: e.target.value })
                  }
                  required
                />
                <Input
                  label="Horário de término"
                  type="time"
                  value={formData.horarioFim}
                  onChange={(e) =>
                    setFormData({ ...formData, horarioFim: e.target.value })
                  }
                  required
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="submit" className="flex-1">
                  Salvar Profissional
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
          {profissionais.map((prof) => (
            <Card key={prof.id}>
              <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-[#E3F2F7] rounded-2xl flex items-center justify-center">
                    <UserCog className="w-6 h-6 text-[#2E7D9A]" />
                  </div>
                  <div className="flex-1">
                    <h3 className="mb-1 text-[#2C3E50] font-bold">{prof.nome}</h3>
                    <p className="text-sm text-[#6C757D] mb-3">
                      {prof.especialidade} - {prof.registro}
                    </p>
                    <div className="grid md:grid-cols-2 gap-2 text-sm text-[#6C757D]">
                      <p>{prof.telefone}</p>
                      <p>{prof.email}</p>
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
                    onClick={() => handleExcluir(prof.id)}
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
