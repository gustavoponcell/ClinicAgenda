# ClinicAgenda - Protótipo Navegável

Implementação React do protótipo ClinicAgenda, um sistema web de agendamento de consultas médicas com área do paciente e área administrativa.

O projeto foi gerado originalmente pelo Figma Make e refinado para uma estrutura React/Vite navegável, com componentes reutilizáveis, rotas organizadas, dados mock e persistência via `localStorage`.

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
    data/           # Dados mock e helpers de status
    pages/          # Telas da área do paciente
    pages/admin/    # Telas da área administrativa
    routes.tsx      # Rotas do protótipo
  styles/           # Tema e estilos globais
```

## Como Rodar

```bash
npm install
npm run dev
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

## Observações

- Não há backend real; os fluxos usam mocks e `localStorage`.
- O login de paciente e admin é simulado para manter o foco no frontend navegável.
- A paleta principal segue o contexto do projeto: `#2E7D9A`, `#4CAF93`, `#E57373`, `#F5F7FA`, `#DDE2E8`.
