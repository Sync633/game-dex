FROM node:24-alpine AS base

ENV PNPM_HOME="/root/.local/share/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

WORKDIR /app

RUN npm install -g pnpm@11.27.1

COPY package.json ./

RUN pnpm config set strict-dep-builds false

FROM base AS development
RUN pnpm install
COPY . .
EXPOSE 3000
CMD ["pnpm", "dev"]

FROM base AS builder
RUN pnpm install
COPY . .
RUN pnpm run build

FROM base AS prod-deps
RUN pnpm install --prod

FROM node:24-alpine AS production

ENV NODE_ENV=production
WORKDIR /app

COPY --from=prod-deps /app/package.json ./
COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD ["node", "dist/server.js"]