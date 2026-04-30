# ClinicAgenda - Protótipo Navegável

Implementação React do ClinicAgenda, um sistema web de agendamento de consultas médicas com área do paciente e área administrativa.

O projeto foi gerado originalmente pelo Figma Make e refinado para uma estrutura React/Vite navegável, com componentes reutilizáveis, rotas organizadas e integração com a API Express/PostgreSQL do ClinicAgenda.

## Stack

- React 18
- React Router 7
- TypeScript
- Tailwind CSS 4
- Vite
- Lucide React
- Recharts

## Estrutura Principal

```text
src/
  app/
    components/     # Button, Input, Card, Header, AdminLayout, Modal
    data/           # Dados auxiliares herdados do protótipo
    pages/          # Telas da área do paciente
    pages/admin/    # Telas da área administrativa
    routes.tsx      # Rotas do protótipo
    services/       # Cliente HTTP e sessão JWT
    utils/          # Formatação de datas e helpers
  styles/           # Tema e estilos globais

backend/
  prisma/           # Schema, migration inicial e seed
  src/              # API Express em camadas
```

## Como Rodar

```bash
npm install
npm run dev
```

Crie um arquivo `.env` na raiz do frontend se a API estiver em outro endereço:

```env
VITE_API_URL=http://localhost:3333/api
```

Depois acesse:

- `http://127.0.0.1:5173/`
- `http://127.0.0.1:5173/mapa-prototipo`
- `http://127.0.0.1:5173/admin/login`

## Validação

```bash
npm run typecheck
npm run build
```

## Backend

O backend real do ClinicAgenda está em `backend/`. Ele usa Node.js, TypeScript, Express, PostgreSQL, Prisma, JWT, bcrypt e Zod.

Consulte [backend/README.md](backend/README.md) para configurar `.env`, rodar migrations, seed e iniciar a API.

Para usar o frontend integrado, mantenha o backend rodando em `http://localhost:3333/api` ou ajuste `VITE_API_URL`.

## Observações

- Autenticação, consultas, profissionais, funcionários, horários, relatórios e auditoria consomem endpoints reais do backend.
- O `localStorage` é usado apenas para guardar token JWT e dados básicos da sessão autenticada.
- A paleta principal segue o contexto do projeto: `#2E7D9A`, `#4CAF93`, `#E57373`, `#F5F7FA`, `#DDE2E8`.
