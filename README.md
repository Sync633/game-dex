# GameDex - Monorepo (AT1 - IEC)

Projeto full-stack para gerenciamento de catálogo de jogos, desenvolvido para consolidar os fundamentos de infraestrutura, conteinerização e automação na disciplina de Integração e Entrega Contínua (IEC).

## Estrutura do Repositório

Este repositório utiliza a arquitetura de monorepo gerenciada pelo `pnpm`:

- **/backend**: API RESTful (Node.js, Express, TypeScript, PostgreSQL). *Consulte o [README do backend](./backend/README.md) para detalhes de rotas, Supabase e payloads.*
- **/app**: *(Futuro)* Frontend da aplicação (React, Vite).
- **/.github/workflows**: Esteira de Integração Contínua (CI) no GitHub Actions.
- **/.husky**: Git hooks locais para bloqueio de commits inválidos.

## Como executar o projeto (Docker)

Toda a infraestrutura pode ser levantada com um único comando a partir da raiz do projeto.

1. Certifique-se de que o Docker Desktop está em execução e as portas `3000` (API) e `5433` (Banco) estão livres.
2. Na raiz do projeto, suba os contêineres:
   ```bash
   docker compose up -d --build