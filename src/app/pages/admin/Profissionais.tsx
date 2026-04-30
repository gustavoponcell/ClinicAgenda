import { useEffect, useState } from 'react';
import { AdminLayout } from '../../components/AdminLayout';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { UserCog, Plus, Edit, Trash2 } from 'lucide-react';
import { api, Professional, Specialty } from '../../services/api';

export default function Profissionais() {
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    specialtyId: '',
    registro: '',
    telefone: '',
    email: '',
  });
  const [profissionais, setProfissionais] = useState<Professional[]>([]);
  const [especialidades, setEspecialidades] = useState<Specialty[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function loadData() {
    try {
      const [professionalsResponse, specialtiesResponse] = await Promise.all([
        api.listProfessionals(),
        api.listSpecialties(),
      ]);
      setProfissionais(professionalsResponse.items);
      setEspecialidades(specialtiesResponse.items);
      setFormData((current) => ({ ...current, specialtyId: current.specialtyId || specialtiesResponse.items[0]?.id || '' }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar profissionais');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const profissional = await api.createProfessional({
        nome: formData.nome,
        telefone: formData.telefone,
        email: formData.email,
        specialtyIds: [formData.specialtyId],
      });
      setProfissionais((current) => [...current, profissional]);
      setMostrarFormulario(false);
      setFormData({
        nome: '',
        specialtyId: especialidades[0]?.id || '',
        registro: '',
        telefone: '',
        email: '',
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao cadastrar profissional');
    }
  };

  const handleExcluir = async (id: string) => {
    if (!window.confirm('Deseja excluir este profissional?')) return;

    try {
      await api.deleteProfessional(id);
      setProfissionais((current) => current.filter((p) => p.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao excluir profissional');
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

        {error && (
          <div className="mb-6 rounded-2xl border border-[#E57373]/30 bg-[#FFEBEE] px-4 py-3 text-[#E57373]">
            {error}
          </div>
        )}

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
                <div>
                  <label className="block mb-2 text-[#2C3E50]">Especialidade</label>
                  <select
                    value={formData.specialtyId}
                    onChange={(e) => setFormData({ ...formData, specialtyId: e.target.value })}
                    required
                    className="w-full px-4 py-3 bg-[#F5F7FA] border border-[#DDE2E8] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2E7D9A]"
                  >
                    {especialidades.map((especialidade) => (
                      <option key={especialidade.id} value={especialidade.id}>
                        {especialidade.nome}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <Input
                  label="CPF ou Registro Profissional"
                  placeholder="CRM, CRO, etc."
                  value={formData.registro}
                  onChange={(e) => setFormData({ ...formData, registro: e.target.value })}
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

              <div className="flex gap-3 pt-4">
                <Button type="submit" className="flex-1">
                  Salvar Profissional
                </Button>
                <Button type="button" variant="outline" onClick={() => setMostrarFormulario(false)}>
                  Cancelar
                </Button>
              </div>
            </form>
          </Card>
        )}

        {loading ? (
          <Card className="text-center text-[#6C757D]">Carregando profissionais...</Card>
        ) : (
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
                        {prof.specialties?.map((specialty) => specialty.nome).join(', ') || 'Sem especialidade vinculada'}
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
                    <Button variant="danger" size="sm" onClick={() => handleExcluir(prof.id)}>
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
