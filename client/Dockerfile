FROM node:22.2.0-alpine

WORKDIR /app


COPY package.json pnpm-workspace.yaml pnpm-lock.yaml tsconfig.json ./
COPY client/package.json client/tsconfig.json ./client/
COPY shared/package.json shared/tsconfig.json ./shared/

RUN corepack enable pnpm

COPY client ./client
COPY shared ./shared

RUN corepack enable
RUN COREPACK_ENABLE_DOWNLOAD_PROMPT=0 corepack prepare pnpm@9.9.0 --activate
RUN pnpm install

RUN pnpm client:build

EXPOSE 3000


CMD ["pnpm", "client:prod"]
