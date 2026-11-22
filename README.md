# GameDex

Projeto full-stack (monorepo) para cadastrar jogos e acompanhar quais já foram zerados.

Desenvolvido nas disciplinas de **Integração e Entrega Contínua (IEC — AT1 e AT2)** e **Laboratório de Desenvolvimento Web (LDW — AT1 e AT2)**.

## Estrutura do repositório

Este repositório utiliza a arquitetura de monorepo gerenciada com `pnpm`:

- **`/backend`**: API RESTful com Node.js, Express, TypeScript, Sequelize e PostgreSQL. *Consulte o [README do backend](./backend/README.md) para detalhes de rotas, Supabase e payloads.*
- **`/app`**: Frontend SPA com React, TypeScript, Vite, Tailwind CSS, shadcn/ui e React Router DOM. *Consulte o [README do frontend](./app/README.md) para detalhes de configuração, telas e organização.*
- **`/.github/workflows`**: Esteiras de Integração Contínua (CI) e Entrega Contínua (CD) no GitHub Actions.
- **`/.husky`**: Git hooks locais para validação de lint e tipagem antes dos commits.

## Pré-requisitos

- **Docker Desktop** (para subir a API e o PostgreSQL em containers)
- **Node.js 24** e **pnpm 11** (para executar o frontend e scripts do workspace)

## Como executar o projeto

### 1. Subir o backend e o banco de dados (Docker)

1. Certifique-se de que o Docker Desktop está em execução e as portas `3000` (API) e `5433` (PostgreSQL) estão livres.
2. Na raiz do repositório, suba os containers:

```bash
pnpm compose:up
```

O Compose inicia o PostgreSQL, executa as migrations automaticamente e sobe a API em `http://localhost:3000`.

> Caso prefira rodar a API fora do Docker usando Supabase, siga o passo a passo no [README do backend](./backend/README.md).

### 2. Configurar e executar o frontend (`app`)

1. Na raiz do repositório, instale as dependências do workspace:

```bash
pnpm install
```

2. Crie o arquivo `app/.env` a partir do modelo `app/.env.example`:

No CMD do Windows:

```bat
copy app\.env.example app\.env
```

No Linux ou macOS:

```bash
cp app/.env.example app\.env
```

3. Confirme a URL da API em `app/.env`:

```dotenv
VITE_API_URL=http://localhost:3000
```

4. Inicie o servidor de desenvolvimento do frontend a partir da raiz:

```bash
pnpm dev:app
```

## Endereços locais

| Serviço | Endereço |
| --- | --- |
| Frontend (App) | http://localhost:5173 |
| API (Health Check) | http://localhost:3000/api/health |
| API (Listagem de jogos) | http://localhost:3000/games |
| Swagger UI (Documentação da API) | http://localhost:3000/docs |

## Deploy em produção (Render + CI/CD)

A API do backend está publicada no **Render** com runtime Docker, banco PostgreSQL no **Supabase** e entrega contínua via GitHub Actions (`.github/workflows/deploy.yml`). O `Auto-Deploy` permanece desativado (`Off`), disparando a publicação via **Deploy Hook** apenas após a aprovação do CI e do build Docker.

| Recurso | URL Pública |
| --- | --- |
| API Base | https://gamedex-api-h9s2.onrender.com |
| Health Check | https://gamedex-api-h9s2.onrender.com/api/health |
| Listagem de jogos | https://gamedex-api-h9s2.onrender.com/games |
| Swagger UI | https://gamedex-api-h9s2.onrender.com/docs |

## Scripts principais (raiz)

| Script | O que faz |
| --- | --- |
| `pnpm compose:up` | Sobe os containers do backend e banco em segundo plano |
| `pnpm compose:build` | Reconstrói as imagens e sobe os containers |
| `pnpm compose:down` | Para e remove os containers mantendo os dados no volume |
| `pnpm compose:logs` | Exibe os logs dos containers |
| `pnpm dev:backend` | Inicia o backend localmente fora do Docker |
| `pnpm dev:app` | Inicia o frontend SPA em modo de desenvolvimento |