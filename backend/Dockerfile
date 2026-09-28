FROM node:24-alpine

ENV PNPM_HOME="/root/.local/share/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

WORKDIR /app

RUN npm install -g pnpm@11.27.1

COPY package.json ./

RUN pnpm config set strict-dep-builds false

RUN pnpm install

COPY . .

EXPOSE 3000

CMD ["pnpm", "dev"]