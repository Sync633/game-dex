# GameDex App

Interface web (SPA) para gerenciar um catálogo pessoal de jogos e acompanhar quais já foram zerados.

Desenvolvida para a AT2 da disciplina de Laboratório de Desenvolvimento Web.

## Tecnologias

- React 19, TypeScript e Vite
- Tailwind CSS e shadcn/ui (Radix UI, Lucide e Sonner)
- React Router DOM
- Fetch API (consumo da API REST do GameDex)

## Pré-requisitos

- Node.js 24
- pnpm 11
- Backend do GameDex em execução (`http://localhost:3000`)

## Instalação e configuração

Na raiz do repositório, instale as dependências:

```bash
pnpm install
cd app
```

Copie `.env.example` para `.env`.

No CMD do Windows:

```bat
copy .env.example .env
```

No Linux ou macOS:

```bash
cp .env.example .env
```

Confira o conteúdo do `.env`:

```dotenv
VITE_API_URL=http://localhost:3000
```

O arquivo `.env` é ignorado pelo Git e não deve ser versionado.

## Execução

Dentro da pasta `app`:

```bash
pnpm dev
```

Ou a partir da raiz do monorepo:

```bash
pnpm dev:app
```

Acesse no navegador: http://localhost:5173

## Validação e build

Dentro de `app`:

```bash
pnpm lint
pnpm build
pnpm preview
```

## Funcionalidades

- **Dashboard com métricas:** total de jogos cadastrados, jogos zerados e jogos na fila.
- **CRUD completo conectado à API REST:**
  - `GET /games` — listagem inicial em cards responsivos com estado de carregamento (loading) e estado vazio (empty state).
  - `POST /games` — cadastro de novo jogo em modal (`Dialog`) com validação e conversão de tipos.
  - `PUT /games/:id` — edição completa dos dados no modal e alternância rápida do status `zerado` direto no card.
  - `DELETE /games/:id` — exclusão com modal de confirmação.
- **Feedback visual:** notificações flutuantes (`Sonner`) para sucesso e mensagens de erro retornadas pela API.

## Rotas

| Rota | Tela |
| --- | --- |
| `/` | Biblioteca de jogos (Dashboard e CRUD) |
| `/sobre` | Informações sobre o projeto e a stack utilizada |

## Organização do frontend

| Caminho | Responsabilidade |
| --- | --- |
| `src/components/ui/` | Componentes oficiais do shadcn/ui (`card`, `button`, `input`, `label`, `badge`, `dialog`, `sonner`) |
| `src/components/layout/` | Layout compartilhado (`AppLayout`) com barra de navegação |
| `src/components/games/` | Modais de cadastro/edição (`GameFormDialog`) e confirmação de exclusão (`DeleteGameDialog`) |
| `src/pages/` | Páginas da SPA (`GamesPage` e `SobrePage`) |
| `src/services/` | Cliente HTTP (`gameService.ts`) para comunicação com a API |
| `src/types/` | Interfaces TypeScript da entidade `Game` e erros da API |
| `src/App.tsx` | Configuração das rotas (`BrowserRouter`) e do `<Toaster />` |