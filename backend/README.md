# ClinicAgenda Backend

API real para o ClinicAgenda, sistema web de agendamento de consultas médicas. O backend foi criado em pasta própria para preservar o frontend React existente e facilitar a integração futura.

## Stack

- Node.js
- TypeScript
- Express
- PostgreSQL
- Prisma ORM
- JWT
- Bcrypt via `bcryptjs`
- Zod
- Dotenv

## Decisões de Arquitetura

- A autenticação é unificada por JWT, mas o token diferencia `PATIENT` e `EMPLOYEE`.
- Funcionários possuem `cargo`: `ADMIN` ou `RECEPCIONISTA`.
- Regras de negócio ficam em `services`; rotas apenas encadeiam middlewares e controllers.
- O conflito de agenda é validado na camada de serviço, considerando apenas consultas `AGENDADA` e `REAGENDADA`. Isso permite reutilizar horários depois de cancelamentos.
- Profissionais são desativados em vez de removidos fisicamente, preservando histórico.
- Operações relevantes registram `AuditLog`.

## Estrutura

```text
backend/
  prisma/
    schema.prisma
    migrations/
    seed.ts
  src/
    app.ts
    server.ts
    config/
    controllers/
    middlewares/
    repositories/
    routes/
    schemas/
    services/
    types/
    utils/
```

## Configuração

Crie o arquivo `.env` com base em `.env.example`:

```env
PORT=3333
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/clinicagenda?schema=public"
JWT_SECRET="change-me-in-production"
JWT_EXPIRES_IN="1d"
NODE_ENV="development"
```

## Instalação

Na raiz do repositório:

```bash
pnpm install
```

Ou dentro de `backend/`, usando npm:

```bash
npm install
```

## Banco de Dados

Com PostgreSQL rodando e `DATABASE_URL` configurada:

```bash
cd backend
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
```

Credenciais iniciais do seed:

- Admin: `admin@clinica.com` / `12345678`
- Recepcionista: `recepcao@clinica.com` / `12345678`
- Paciente: `maria@email.com` / `12345678`

## Execução

```bash
cd backend
npm run dev
```

API: `http://localhost:3333/api`

Health check:

```http
GET /api/health
```

## Validação

```bash
npm run typecheck
npm run build
```

## Principais Rotas

Auth:

- `POST /api/auth/patient/register`
- `POST /api/auth/patient/login`
- `POST /api/auth/admin/login`
- `GET /api/auth/me`

Paciente:

- `GET /api/patients/me`
- `PUT /api/patients/me`

Profissionais:

- `GET /api/professionals`
- `GET /api/professionals/:id`
- `POST /api/professionals`
- `PUT /api/professionals/:id`
- `DELETE /api/professionals/:id`

Especialidades:

- `GET /api/specialties`
- `POST /api/specialties`
- `PUT /api/specialties/:id`
- `DELETE /api/specialties/:id`

Disponibilidades:

- `GET /api/professionals/:id/availabilities`
- `POST /api/professionals/:id/availabilities`
- `PUT /api/availabilities/:id`
- `DELETE /api/availabilities/:id`

Consultas:

- `GET /api/appointments/me`
- `POST /api/appointments`
- `PATCH /api/appointments/:id/reschedule`
- `PATCH /api/appointments/:id/cancel`
- `PATCH /api/appointments/:id/complete`
- `GET /api/admin/appointments`
- `GET /api/admin/appointments/:id`

Funcionários:

- `GET /api/employees`
- `POST /api/employees`
- `PUT /api/employees/:id`
- `DELETE /api/employees/:id`

Bloqueios:

- `GET /api/professionals/:id/blocks`
- `POST /api/professionals/:id/blocks`
- `DELETE /api/blocks/:id`

Relatórios:

- `GET /api/reports/dashboard`
- `GET /api/reports/appointments`
- `GET /api/reports/professionals`

Auditoria:

- `GET /api/audit-logs`

## Padrão de Resposta

Sucesso:

```json
{
  "success": true,
  "message": "Mensagem opcional",
  "data": {}
}
```

Erro:

```json
{
  "success": false,
  "message": "Descrição do erro",
  "errors": []
}
```

## Observações para Integração com o Frontend

- Envie o JWT no header `Authorization: Bearer <token>`.
- Pacientes usam `/auth/patient/login`.
- Funcionários usam `/auth/admin/login`.
- Datas de consulta devem ser enviadas em ISO 8601 no campo `dataHora`.
- `diaSemana` nas disponibilidades usa enum: `DOMINGO`, `SEGUNDA`, `TERCA`, `QUARTA`, `QUINTA`, `SEXTA`, `SABADO`.
