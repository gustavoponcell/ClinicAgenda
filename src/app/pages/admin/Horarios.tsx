import { useState } from 'react';
import { AdminLayout } from '../../components/AdminLayout';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { Calendar, Clock, Ban } from 'lucide-react';
import { nomesProfissionais } from '../../data/mockData';

export default function Horarios() {
  const [profissionalSelecionado, setProfissionalSelecionado] = useState('Dr. João Santos');
  const [mostrarBloqueio, setMostrarBloqueio] = useState(false);
  const [bloqueioData, setBloqueioData] = useState({
    dataInicio: '',
    dataFim: '',
    motivo: '',
  });

  const [bloqueios, setBloqueios] = useState([
    {
      id: 1,
      profissional: 'Dr. João Santos',
      dataInicio: '24/12/2026',
      dataFim: '26/12/2026',
      motivo: 'Feriado de Natal',
    },
    {
      id: 2,
      profissional: 'Dra. Mariana Lima',
      dataInicio: '15/05/2026',
      dataFim: '23/05/2026',
      motivo: 'Férias',
    },
  ]);

  const handleBloquear = (e: React.FormEvent) => {
    e.preventDefault();
    const novoBloqueio = {
      id: Date.now(),
      profissional: profissionalSelecionado,
      dataInicio: new Date(bloqueioData.dataInicio).toLocaleDateString('pt-BR'),
      dataFim: new Date(bloqueioData.dataFim).toLocaleDateString('pt-BR'),
      motivo: bloqueioData.motivo,
    };
    setBloqueios([...bloqueios, novoBloqueio]);
    setMostrarBloqueio(false);
    setBloqueioData({ dataInicio: '', dataFim: '', motivo: '' });
    alert('Período bloqueado com sucesso!');
  };

  const handleRemoverBloqueio = (id: number) => {
    if (window.confirm('Deseja remover este bloqueio?')) {
      setBloqueios(bloqueios.filter((b) => b.id !== id));
    }
  };

  const bloqueiosFiltrados = bloqueios.filter(
    (b) => b.profissional === profissionalSelecionado
  );

  return (
    <AdminLayout>
      <div className="p-6 bg-gradient-to-br from-[#F5F7FA] to-white min-h-screen">
        <div className="mb-8">
          <h2 className="text-3xl mb-2 text-[#2C3E50] font-bold">Gestão de Horários</h2>
          <p className="text-[#6C757D]">
            Configure horários de atendimento e bloqueie datas
          </p>
        </div>

        <Card className="mb-6">
          <div className="flex items-center gap-4 mb-6">
            <label className="text-[#2C3E50]">Profissional:</label>
            <select
              value={profissionalSelecionado}
              onChange={(e) => setProfissionalSelecionado(e.target.value)}
              className="flex-1 max-w-xs px-4 py-2 bg-[#F5F7FA] border border-[#DDE2E8] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2E7D9A]"
            >
              {nomesProfissionais.map((prof) => (
                <option key={prof} value={prof}>
                  {prof}
                </option>
              ))}
            </select>
          </div>

          <div className="bg-[#E3F2F7] p-6 rounded-2xl mb-6 border border-[#2E7D9A]/10">
            <div className="flex items-center gap-3 mb-4">
              <Clock className="w-6 h-6 text-[#2E7D9A]" />
              <h3 className="text-[#2C3E50] font-bold">Horário de Atendimento</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-[#6C757D] mb-2">Dias de atendimento:</p>
                <p className="text-[#2C3E50]">Segunda a Sexta-feira</p>
              </div>
              <div>
                <p className="text-sm text-[#6C757D] mb-2">Horário:</p>
                <p className="text-[#2C3E50]">08:00 às 18:00</p>
              </div>
            </div>
            <Button variant="outline" className="mt-4" size="sm">
              Editar Disponibilidade
            </Button>
          </div>

          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[#2C3E50] font-bold">Períodos Bloqueados</h3>
            <Button size="sm" onClick={() => setMostrarBloqueio(!mostrarBloqueio)}>
              <Ban className="w-4 h-4 mr-2" />
              Bloquear Data
            </Button>
          </div>

          {mostrarBloqueio && (
            <form onSubmit={handleBloquear} className="bg-[#F5F7FA] p-4 rounded-xl mb-4">
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <Input
                  label="Data de início"
                  type="date"
                  value={bloqueioData.dataInicio}
                  onChange={(e) =>
                    setBloqueioData({ ...bloqueioData, dataInicio: e.target.value })
                  }
                  required
                />
                <Input
                  label="Data de término"
                  type="date"
                  value={bloqueioData.dataFim}
                  onChange={(e) =>
                    setBloqueioData({ ...bloqueioData, dataFim: e.target.value })
                  }
                  required
                />
              </div>
              <Input
                label="Motivo"
                placeholder="Ex: Férias, Congresso, Feriado..."
                value={bloqueioData.motivo}
                onChange={(e) =>
                  setBloqueioData({ ...bloqueioData, motivo: e.target.value })
                }
                required
              />
              <div className="flex gap-3 mt-4">
                <Button type="submit" size="sm">
                  Confirmar Bloqueio
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setMostrarBloqueio(false)}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          )}

          {bloqueiosFiltrados.length > 0 ? (
            <div className="space-y-3">
              {bloqueiosFiltrados.map((bloqueio) => (
                <div
                  key={bloqueio.id}
                  className="flex items-center justify-between p-4 bg-[#FFEBEE] border border-[#E57373]/30 rounded-xl"
                >
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-[#E57373]" />
                    <div>
                      <p className="text-[#2C3E50]">
                        {bloqueio.dataInicio} até {bloqueio.dataFim}
                      </p>
                      <p className="text-sm text-[#6C757D]">{bloqueio.motivo}</p>
                    </div>
                  </div>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleRemoverBloqueio(bloqueio.id)}
                  >
                    Remover
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-[#6C757D] py-8">
              Nenhum período bloqueado para este profissional
            </p>
          )}
        </Card>

        <Card>
          <h3 className="mb-4 text-[#2C3E50] font-bold">Calendário de Bloqueios</h3>
          <div className="bg-[#F5F7FA] p-8 rounded-2xl text-center">
            <Calendar className="w-16 h-16 text-[#6C757D] mx-auto mb-4" />
            <p className="text-[#6C757D]">Visualização de calendário será exibida aqui</p>
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
}
