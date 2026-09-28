# GameDex API

API RESTful para cadastrar jogos e acompanhar quais já foram zerados.

Desenvolvida para a AT1 da disciplina de Laboratório de Desenvolvimento Web.

## Tecnologias

- Node.js, Express e TypeScript
- Sequelize e PostgreSQL
- Swagger UI
- Docker e Docker Compose

## Formas de execução

| Ambiente | API | Banco de dados |
| --- | --- | --- |
| Docker local | Container Node.js | PostgreSQL em container |
| Supabase | Node.js na máquina | PostgreSQL remoto |

Os ambientes possuem bancos independentes. Os dados não são sincronizados entre eles.

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

- Swagger UI: http://localhost:3000/docs
- Listagem de jogos: http://localhost:3000/games

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

- Node.js 24
- pnpm 11
- Projeto Supabase com PostgreSQL acessível

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

Preencha o `.env` com os dados da conexão PostgreSQL fornecidos pelo Supabase:

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

- Swagger UI: http://localhost:3000/docs
- Listagem de jogos: http://localhost:3000/games

Se alterar `PORT`, utilize a porta configurada nos endereços.

### Compilar e executar

Dentro de `backend`:

```bash
pnpm build
pnpm start
```

A execução direta com Node.js não aplica migrations automaticamente.

## Endpoints

| Método | Rota | Operação | Sucesso |
| --- | --- | --- | --- |
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

- Textos: de 1 a 255 caracteres após remover espaços nas extremidades.
- Título: único no catálogo.
- Ano de lançamento: inteiro entre 1 e 9999.
- `zerado`: booleano, `true` ou `false`.
- `id`, `createdAt` e `updatedAt`: gerenciados automaticamente.

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

1. Cadastrar um jogo.
2. Listar os jogos.
3. Buscar pelo ID retornado.
4. Atualizar o campo `zerado`.
5. Consultar novamente para confirmar a alteração.
6. Excluir o registro.
7. Buscar novamente e confirmar a resposta `404`.

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
| `src/app.ts` | Middlewares, rotas e Swagger UI |
| `src/server.ts` | Conexão e inicialização do servidor |