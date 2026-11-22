# GameDex API

API RESTful para cadastrar jogos e acompanhar quais já foram zerados.

Desenvolvida nas disciplinas de **Laboratório de Desenvolvimento Web (LDW — AT1)** e **Integração e Entrega Contínua (IEC — AT1 e AT2)**.

## Tecnologias

- Node.js, Express e TypeScript
- Sequelize e PostgreSQL
- Swagger UI
- Docker e Docker Compose
- GitHub Actions e Render (CI/CD)

## Deploy em produção (Render + CI/CD)

A API é publicada no **Render** com runtime Docker, banco de dados PostgreSQL no **Supabase** e entrega contínua via GitHub Actions (`.github/workflows/deploy.yml`).

O `Auto-Deploy` no Render permanece desativado (`Off`), garantindo que novas versões só sejam publicadas após a aprovação da esteira de CI (ESLint, checagem de tipos e build) e da construção da imagem Docker, que dispara o **Deploy Hook** do Render.

| Recurso | URL Pública |
| --- | --- |
| API Base | https://gamedex-api-h9s2.onrender.com |
| Health Check | https://gamedex-api-h9s2.onrender.com/api/health |
| Listagem de jogos | https://gamedex-api-h9s2.onrender.com/games |
| Swagger UI | https://gamedex-api-h9s2.onrender.com/docs |

## Formas de execução

| Ambiente | API | Banco de dados |
| --- | --- | --- |
| Docker local | Container Node.js (dev) | PostgreSQL em container |
| Supabase local | Node.js na máquina | PostgreSQL remoto (Supabase) |
| Produção (Render) | Container Docker (Node.js Alpine) | PostgreSQL remoto (Supabase) |

O ambiente Docker local possui banco independente. Os ambientes conectados ao Supabase compartilham o banco configurado nas variáveis de ambiente.

## Opção 1 — Docker local

### Pré-requisitos

- Docker Desktop instalado e em execução.
- Portas `3000` e `5433` disponíveis.

### Inicialização

Na raiz do repositório, onde está `docker-compose.yml`, execute:

```bash
docker compose up -d --build
```

O Compose inicia o PostgreSQL, aguarda o banco ficar disponível e executa as migrations antes de iniciar a API.

Não é necessário configurar o `.env` para essa opção: a conexão local é definida no Compose.

Confira os serviços e os logs:

```bash
docker compose ps
docker compose logs -f api
```

Para sair dos logs, pressione `Ctrl+C`. Os containers continuam em execução.

### Endereços

* Health Check: http://localhost:3000/api/health
* Listagem de jogos: http://localhost:3000/games
* Swagger UI: http://localhost:3000/docs

### Acesso ao banco local

Para acessar por um cliente PostgreSQL:

| Configuração | Valor |
| --- | --- |
| Host | `localhost` |
| Porta | `5433` |
| Banco | `gamedex` |
| Usuário | `postgres` |
| Senha | `postgres` |

Essas credenciais são destinadas ao ambiente local de desenvolvimento.

### Parar e iniciar novamente

Para parar e remover os containers:

```bash
docker compose down
```

Os dados permanecem no volume.

Para iniciar novamente:

```bash
docker compose up -d
```

O comando `docker compose down -v` remove também os volumes e os dados locais.

## Opção 2 — Execução com Supabase

### Pré-requisitos

* Node.js 24
* pnpm 11
* Projeto Supabase com PostgreSQL acessível

Se o Docker estiver usando a porta `3000`, pare os containers antes:

```bash
docker compose down
```

### Instalação

Na raiz do repositório:

```bash
pnpm install
cd backend
```

### Configuração

Copie `.env.example` para `.env`.

No CMD do Windows:

```bat
copy .env.example .env
```

No Linux ou macOS:

```bash
cp .env.example .env
```

Preencha o `.env` com os dados da conexão PostgreSQL fornecidos pelo Supabase (recomenda-se utilizar o **Session Pooler** via IPv4):

```dotenv
PORT=3000
DB_HOST=host_da_conexao
DB_PORT=porta_da_conexao
DB_USER=usuario_da_conexao
DB_PASSWORD=senha_do_banco
DB_NAME=nome_do_banco
DB_SSL=true
```

Use o host, a porta e o usuário correspondentes à modalidade de conexão escolhida no Supabase.

`DB_PASSWORD` é a senha do banco PostgreSQL, não uma chave de API do Supabase.

O `.env` não deve ser versionado.

### Migrations

Dentro de `backend`, execute:

```bash
pnpm db:migrate
```

Para consultar o estado:

```bash
pnpm db:migrate:status
```

O estado `up` indica que a migration foi aplicada.

### Iniciar a API

```bash
pnpm dev
```

Acesse:

* Health Check: http://localhost:3000/api/health
* Listagem de jogos: http://localhost:3000/games
* Swagger UI: http://localhost:3000/docs

Se alterar `PORT`, utilize a porta configurada nos endereços.

### Compilar e executar

Dentro de `backend`:

```bash
pnpm build
pnpm start
```

A execução direta com Node.js não aplica migrations automaticamente.

## Imagem Docker de produção

O `Dockerfile` utiliza build multi-stage baseado em `node:24-alpine`, compilando o TypeScript para `dist/`, mantendo apenas as dependências de produção e iniciando a aplicação com `node dist/server.js`.

Para testar a imagem de produção localmente a partir da raiz do repositório:

```bash
docker build -t gamedex-api:prod ./backend
docker run --rm --env-file ./backend/.env -p 3000:3000 gamedex-api:prod
```

## Endpoints

| Método | Rota | Operação | Sucesso |
| --- | --- | --- | --- |
| GET | `/api/health` | Verificar integridade da API | `200` |
| GET | `/games` | Listar jogos | `200` |
| GET | `/games/:id` | Buscar por ID | `200` |
| POST | `/games` | Cadastrar jogo | `201` |
| PUT | `/games/:id` | Atualizar campos enviados | `200` |
| DELETE | `/games/:id` | Excluir jogo | `204` |

As respostas de erro utilizam `400` para entradas inválidas ou título duplicado, `404` para jogo não encontrado e `500` para falhas internas.

## Exemplo de cadastro

Corpo de `POST /games`:

```json
{
  "titulo": "Ori and the Blind Forest",
  "desenvolvedora": "Moon Studios",
  "plataforma": "PC",
  "genero": "Metroidvania",
  "anoLancamento": 2015,
  "zerado": false
}
```

Todos os seis campos são obrigatórios.

* Textos: de 1 a 255 caracteres após remover espaços nas extremidades.
* Título: único no catálogo.
* Ano de lançamento: inteiro entre 1 e 9999.
* `zerado`: booleano, `true` ou `false`.
* `id`, `createdAt` e `updatedAt`: gerenciados automaticamente.

## Exemplo de atualização

Corpo de `PUT /games/:id`:

```json
{
  "zerado": true
}
```

Substitua `:id` pelo identificador retornado no cadastro.

Somente os campos enviados são atualizados. Um objeto vazio retorna o registro sem alterações.

## Testes pelo Swagger

1. Acesse `/docs`.
2. Abra a operação e clique em **Try it out**.
3. Preencha os parâmetros ou o JSON.
4. Clique em **Execute**.
5. Confira o código HTTP e o corpo da resposta.

Fluxo de verificação:

1. Consultar `GET /api/health` para confirmar o status `200`.
2. Cadastrar um jogo.
3. Listar os jogos.
4. Buscar pelo ID retornado.
5. Atualizar o campo `zerado`.
6. Consultar novamente para confirmar a alteração.
7. Excluir o registro.
8. Buscar novamente e confirmar a resposta `404`.

A persistência pode ser conferida na tabela `games`, pelo Supabase ou por um cliente conectado ao PostgreSQL local, conforme o ambiente em execução.

## Organização do backend

| Caminho | Responsabilidade |
| --- | --- |
| `src/config/` | Conexão com o banco e configuração do Sequelize CLI |
| `src/models/` | Model Sequelize e interface da entidade |
| `src/controllers/` | Validações e operações do CRUD |
| `src/routes/` | Rotas Express |
| `src/docs/swagger.json` | Documentação OpenAPI |
| `src/migrations/` | Criação das tabelas |
| `src/app.ts` | Middlewares, health check, rotas e Swagger UI |
| `src/server.ts` | Conexão e inicialização do servidor |
| `Dockerfile` | Build multi-stage para desenvolvimento e produção |
| `.dockerignore` | Exclusão de arquivos desnecessários do contexto Docker |