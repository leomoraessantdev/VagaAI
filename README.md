# VagaAI

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-20-339933?logo=node.js&logoColor=white)
![Anthropic](https://img.shields.io/badge/Claude-claude--sonnet--4--6-blueviolet)

> **Descrições de vagas profissionais em segundos, geradas com IA.**

VagaAI usa a API da Anthropic para gerar descrições de vagas completas e profissionais a partir de um formulário simples. Ideal para RH, recrutadores e fundadores que precisam publicar vagas no LinkedIn, Gupy ou Indeed rapidamente.

## Screenshots

_Em breve_

## Tecnologias

| Camada | Stack |
|---|---|
| Frontend | React 18, TypeScript, Tailwind v4, Vite |
| Backend | Node.js 20, Express, TypeScript |
| IA | Claude claude-sonnet-4-6 via Anthropic SDK |
| Deploy | Vercel (frontend) + Render (backend) |
| Testes | Vitest + RTL (frontend), Jest + Supertest (backend) |

## Como Rodar Localmente

### Pré-requisitos

- Node.js 20+
- Chave de API da Anthropic ([console.anthropic.com](https://console.anthropic.com))

### Backend

```bash
cd backend
cp .env.example .env
# Edite .env e adicione sua ANTHROPIC_API_KEY
npm install
npm run dev
```

Backend disponível em `http://localhost:3001`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend disponível em `http://localhost:5173`

## Deploy

### Frontend → Vercel

1. Importe o repositório no [vercel.com](https://vercel.com)
2. **Root Directory:** `frontend`
3. **Environment Variable:** `VITE_API_URL=https://sua-url.onrender.com`
4. Deploy automático em cada push para `main`

### Backend → Render

1. Crie um **Web Service** no [render.com](https://render.com)
2. **Root Directory:** `backend`
3. **Build Command:** `npm install && npm run build`
4. **Start Command:** `npm start`
5. **Environment Variable:** `ANTHROPIC_API_KEY=sua_chave`
6. Opcional: `ALLOWED_ORIGINS=https://seu-frontend.vercel.app`

## Estrutura do Projeto

```
vagaai/
├── frontend/              # React + Vite + TypeScript + Tailwind
│   └── src/
│       ├── components/    # Header, JobForm, ResultArea, History
│       ├── hooks/         # useHistory (localStorage)
│       ├── lib/           # api.ts (axios client)
│       └── types/         # Tipos TypeScript compartilhados
├── backend/               # Node.js + Express + TypeScript
│   └── src/
│       ├── routes/        # POST /api/gerar-vaga
│       ├── lib/           # buildPrompt (geração do prompt)
│       └── types/         # Tipos TypeScript compartilhados
└── README.md
```

## Licença

MIT
